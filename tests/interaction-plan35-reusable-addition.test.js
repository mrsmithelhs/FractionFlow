import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { buildCuratedProblem } from '../src/content/generator.js';
import { resolveCuratedFixture } from '../src/content/authored-content-catalog.js';
import { PLAN35_ADDITION_RECIPE_RECORDS, PLAN35_RECIPE_IDS, PLAN35_ADDITION_RECIPE_PRACTICE_SET, findPlan35RecipeAssociationSet } from '../src/content/data/plan35-addition-recipe-records.js';
import { resolvePlan34TaskContext } from '../src/content/full-addition-task-patterns.js';
import { resolvePlan18TaskContext } from '../src/content/nested-renaming-task.js';
import { resolvePlan35AdditionRecipeContext, validatePlan35AdditionRecipeRecord } from '../src/content/plan35-addition-recipe-task.js';
import { addAtCommonDenominator, convertToDenominator, equalFractions } from '../src/math/index.js';
import { applyIntent, createEpisode } from '../src/interaction/episode.js';
import { PLAN34_FULL_ADDITION_EPISODE_DEFINITION, PLAN18_NESTED_ADDITION_EPISODE_DEFINITION, PLAN35_REUSABLE_ADDITION_RECIPES_EPISODE_DEFINITION } from '../src/interaction/episode-definition.js';
import { createReplayEnvelope, replayEpisode, REPLAY_V4_SCHEMA_VERSION } from '../src/interaction/replay.js';
import { projectScene } from '../src/interaction/scene.js';
import { HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from '../src/interaction/support.js';

const mathematical = (value) => ({ kind: 'fraction', numerator: BigInt(value.numerator), denominator: BigInt(value.denominator) });

function instanceFor(record) {
  const fixture = resolveCuratedFixture(record.fixtureId, record.authoringRevision);
  return buildCuratedProblem({ fixture, selector: fixture.selector, overlays: fixture.overlays, profileId: fixture.profileId,
    candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: [] } });
}

function start(record, support = HIGH_SUPPORT_CONFIGURATION) {
  const instance = instanceFor(record);
  const association = findPlan35RecipeAssociationSet(record.itemId);
  if (!association) throw new Error(`missing unique registered association for ${record.itemId}`);
  const taskContext = resolvePlan35AdditionRecipeContext(instance, record.itemId, {
    practiceSetId: association.id, practiceSetRevision: association.revision,
  });
  return { instance, taskContext, state: createEpisode({ instance, episodeDefinition: PLAN35_REUSABLE_ADDITION_RECIPES_EPISODE_DEFINITION, taskContext, support }) };
}

function correctOperandForm(instance, side, targetDenominator) {
  const source = instance.operands[side].initialForm;
  const converted = convertToDenominator(mathematical(source), BigInt(targetDenominator));
  return { kind: 'fraction', numerator: converted.numerator.toString(), denominator: converted.denominator.toString() };
}

function resultForm(instance, targetDenominator) {
  const target = BigInt(targetDenominator);
  const left = convertToDenominator(mathematical(instance.operands.left.initialForm), target);
  const right = convertToDenominator(mathematical(instance.operands.right.initialForm), target);
  const sum = addAtCommonDenominator(mathematical(instance.operands.left.initialForm), mathematical(instance.operands.right.initialForm), target);
  return { kind: 'fraction', numerator: sum.numerator.toString(), denominator: sum.denominator.toString() };
}

function complete(record, support = HIGH_SUPPORT_CONFIGURATION, { unchangedEdit = false } = {}) {
  const built = start(record, support);
  let state = applyIntent(built.state, { type: 'acknowledge-encounter' });
  const identify = built.taskContext.patternId === PLAN35_RECIPE_IDS.identify;
  if (identify) state = applyIntent(state, { type: 'select-renaming-side', side: built.taskContext.requiredSides[0] });
  for (const side of built.taskContext.requiredSides) {
    if (built.taskContext.patternId === PLAN35_RECIPE_IDS.inspect) {
      const candidate = built.taskContext.candidates[side];
      const equivalent = equalFractions(mathematical(candidate), mathematical(built.instance.operands[side].initialForm));
      state = applyIntent(state, equivalent
        ? (unchangedEdit ? { type: 'repair-inspected-form', numerator: candidate.numerator } : { type: 'keep-inspected-form' })
        : { type: 'repair-inspected-form', numerator: correctOperandForm(built.instance, side, built.taskContext.targetDenominator).numerator });
    } else {
      state = applyIntent(state, { type: 'submit-equivalent-form', proposed: correctOperandForm(built.instance, side, built.taskContext.targetDenominator) });
    }
  }
  state = applyIntent(state, { type: 'submit-operation-result', proposed: resultForm(built.instance, built.taskContext.targetDenominator) });
  state = applyIntent(state, { type: 'finish-compact-episode' });
  return { ...built, state };
}

function exerciseRecoveries(record, support) {
  const built = start(record, support);
  expect(Object.isFrozen(built.state.beatSchedule)).toBe(true);
  const schedule = built.state.beatSchedule;
  let state = applyIntent(built.state, { type: 'acknowledge-encounter' });
  const identify = built.taskContext.patternId === PLAN35_RECIPE_IDS.identify;
  if (identify) {
    const requiredSide = built.taskContext.requiredSides[0];
    const wrongSide = requiredSide === 'left' ? 'right' : 'left';
    state = applyIntent(state, { type: 'select-renaming-side', side: wrongSide });
    expect(state.lastRecovery.classification.kind).toBe('side-choice-needs-retry');
    state = applyIntent(state, { type: 'select-renaming-side', side: requiredSide });
  }
  for (const side of built.taskContext.requiredSides) {
    const correct = correctOperandForm(built.instance, side, built.taskContext.targetDenominator);
    if (built.taskContext.patternId === PLAN35_RECIPE_IDS.inspect) {
      state = applyIntent(state, { type: 'repair-inspected-form', numerator: '0' });
    } else {
      state = applyIntent(state, { type: 'submit-equivalent-form', proposed: { ...correct, denominator: built.instance.operands[side].initialForm.denominator } });
    }
    expect(state.lastRecovery).not.toBeNull();
    expect(state.beatSchedule).toEqual(schedule);
    state = built.taskContext.patternId === PLAN35_RECIPE_IDS.inspect
      ? applyIntent(state, { type: 'repair-inspected-form', numerator: correct.numerator })
      : applyIntent(state, { type: 'submit-equivalent-form', proposed: correct });
  }
  state = applyIntent(state, { type: 'submit-operation-result', proposed: { kind: 'fraction', numerator: '0', denominator: built.taskContext.targetDenominator } });
  expect(state.lastRecovery).not.toBeNull();
  expect(state.beatSchedule).toEqual(schedule);
  state = applyIntent(state, { type: 'submit-operation-result', proposed: resultForm(built.instance, built.taskContext.targetDenominator) });
  state = applyIntent(state, { type: 'finish-compact-episode' });
  return state;
}

describe('Plan 35 reusable addition recipe foundation', () => {
  const frozenPlan18V3 = JSON.parse(readFileSync(new URL('./fixtures/plan18-v3-replay-oracles.json', import.meta.url), 'utf8'));

  it('replays the frozen pre-edit Plan18 v3 initial and completed oracles for both orders', () => {
    expect(frozenPlan18V3.cases).toHaveLength(4);
    for (const entry of frozenPlan18V3.cases) expect(replayEpisode(entry.envelope)).toEqual(entry.expectedState);
  });

  it('registers the exact 21-item set@7 while keeping the 13-position prefix order', () => {
    expect(PLAN35_ADDITION_RECIPE_PRACTICE_SET.itemIds).toHaveLength(21);
    expect(PLAN35_ADDITION_RECIPE_PRACTICE_SET.itemIds.slice(0, 13)).toEqual([
      'two-thirds-plus-one-fourth', 'one-half-plus-one-third', 'one-half-plus-one-fifth',
      'one-half-plus-two-fifths', 'one-third-plus-one-fourth', 'one-third-plus-one-fifth',
      'one-third-plus-two-fifths', 'two-thirds-plus-one-fifth', 'three-fifths-plus-one-third',
      'one-sixth-plus-one-fourth', 'two-thirds-plus-three-fourths',
      'nested-one-half-plus-three-eighths', 'nested-three-eighths-plus-one-half',
    ]);
    const liveRecords = PLAN35_ADDITION_RECIPE_RECORDS.filter((record) => PLAN35_ADDITION_RECIPE_PRACTICE_SET.itemIds.includes(record.itemId));
    expect(liveRecords).toHaveLength(13);
    expect(liveRecords.filter((record) => record.recipeId === PLAN35_RECIPE_IDS.construct)).toHaveLength(3);
    expect(liveRecords.filter((record) => record.recipeId === PLAN35_RECIPE_IDS.inspect)).toHaveLength(4);
    expect(liveRecords.filter((record) => record.recipeId === PLAN35_RECIPE_IDS.identify)).toHaveLength(6);
  });

  it('admits, completes, and v4-round-trips every registered task under high and medium support', () => {
    for (const support of [HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION]) {
      for (const record of PLAN35_ADDITION_RECIPE_RECORDS) {
        const initial = start(record, support).state;
        const completed = complete(record, support).state;
        for (const side of ['left', 'right']) {
          if (!completed.taskContext.requiredSides.includes(side)) {
            expect(completed.established.conversionOrigins[side] ?? null).toBeNull();
            continue;
          }
          const expectedOrigin = record.recipeId === PLAN35_RECIPE_IDS.inspect
            ? (equalFractions(mathematical(record.candidates[side]), mathematical(record.sourceForms[side]))
              ? 'authored-then-confirmed' : 'learner-repaired')
            : 'learner-constructed';
          expect(completed.established.conversionOrigins[side]).toBe(expectedOrigin);
        }
        expect(initial.beatSchedule.at(-1).id).toBe('resolve');
        expect(initial.taskContext.targetDenominator).toBe(record.targetDenominator);
        expect(completed.status).toBe('resolved');
        expect(completed.established.operation.proposed).toEqual(resultForm(completed.content, record.targetDenominator));
        expect(createReplayEnvelope(initial).schemaVersion).toBe(REPLAY_V4_SCHEMA_VERSION);
        expect(replayEpisode(createReplayEnvelope(initial))).toEqual(initial);
        expect(replayEpisode(createReplayEnvelope(completed))).toEqual(completed);
        const recovered = exerciseRecoveries(record, support);
        expect(recovered.status).toBe('resolved');
      }
    }
  });

  it('keeps inspect validity hidden, recovers false keeps, and accepts a valid unchanged edit', () => {
    for (const record of PLAN35_ADDITION_RECIPE_RECORDS.filter((row) => row.recipeId === PLAN35_RECIPE_IDS.inspect)) {
      const built = start(record);
      let state = applyIntent(built.state, { type: 'acknowledge-encounter' });
      const scene = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
      expect(scene.meaning.currentTask).toHaveProperty('candidate');
      expect(scene.meaning.currentTask.candidate).not.toHaveProperty('validity');
      state = applyIntent(state, { type: 'request-task-help' });
      const helpScene = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
      expect(helpScene.meaning.taskHelp.kind).toBe('inspect-comparison-invariant');
      expect(helpScene.meaning.taskHelp).not.toHaveProperty('candidateValidity');
      const falseSide = built.taskContext.candidates.left;
      if (!equalFractions(mathematical(falseSide), mathematical(built.instance.operands.left.initialForm))) {
        const recovered = applyIntent(state, { type: 'keep-inspected-form' });
        expect(recovered.lastRecovery.classification.kind).toBe('false-candidate-kept');
        state = applyIntent(recovered, { type: 'repair-inspected-form', numerator: correctOperandForm(built.instance, 'left', built.taskContext.targetDenominator).numerator });
        expect(state.established.conversions.left).toEqual(correctOperandForm(built.instance, 'left', built.taskContext.targetDenominator));
      } else {
        state = applyIntent(state, { type: 'repair-inspected-form', numerator: falseSide.numerator });
        expect(state.responseProvenance.at(-1).classification.kind).toBe('valid-unchanged-edit');
      }
    }
    const unchanged = complete(PLAN35_ADDITION_RECIPE_RECORDS.find((row) => row.itemId === 'plan35-inspect-fifth-third-30'), HIGH_SUPPORT_CONFIGURATION, { unchangedEdit: true });
    expect(unchanged.state.responseProvenance.some((entry) => entry.classification.kind === 'valid-unchanged-edit')).toBe(true);
  });

  it('keeps construct help local and answer-withholding, with a recoverable wrong multiplier', () => {
    const record = PLAN35_ADDITION_RECIPE_RECORDS.find((row) => row.itemId === 'plan35-construct-half-fifth-10');
    const built = start(record);
    let state = applyIntent(built.state, { type: 'acknowledge-encounter' });
    state = applyIntent(state, { type: 'request-task-help' });
    const wrong = applyIntent(state, { type: 'submit-transform-help-multiplier', proposed: { kind: 'fraction', numerator: '2', denominator: '1' } });
    expect(wrong.supportHistory.at(-1).classification).toBe('incorrect');
    expect(wrong.schedulePosition).toBe(state.schedulePosition);
    state = applyIntent(wrong, { type: 'submit-transform-help-multiplier', proposed: { kind: 'fraction', numerator: '5', denominator: '1' } });
    const help = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' }).meaning.taskHelp;
    expect(help.acceptedMultiplier).toBe('5');
    expect(state.established.conversions.left).toBeNull();
  });

  it('keeps identify-side selection fixed, records one learner conversion and the other operand as original, and preserves help/replay', () => {
    const record = PLAN35_ADDITION_RECIPE_RECORDS.find((row) => row.itemId === 'nested-one-half-plus-three-eighths');
    const built = start(record);
    const initialScene = projectScene({ state: built.state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(initialScene.derivation.sourceContext.instructional.taskContext).not.toHaveProperty('requiredSides');
    expect(initialScene.meaning.currentTask).not.toHaveProperty('requiredSide');
    let state = applyIntent(built.state, { type: 'acknowledge-encounter' });
    state = applyIntent(state, { type: 'request-task-help' });
    const decisionHelp = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' }).meaning.taskHelp;
    const oldDecision = createEpisode({ instance: built.instance, episodeDefinition: PLAN18_NESTED_ADDITION_EPISODE_DEFINITION, taskContext: resolvePlan18TaskContext(built.instance) });
    const oldDecisionHelpState = applyIntent(applyIntent(oldDecision, { type: 'acknowledge-encounter' }), { type: 'request-task-help' });
    expect(decisionHelp.kind).toBe('renaming-side-comparison');
    const oldDecisionHelp = projectScene({ state: oldDecisionHelpState, representationRole: 'fraction-bar', presentationMode: 'instant-test' }).meaning.taskHelp;
    expect(decisionHelp).toMatchObject({ kind: oldDecisionHelp.kind, status: oldDecisionHelp.status, targetDenominator: oldDecisionHelp.targetDenominator });
    state = applyIntent(state, { type: 'select-renaming-side', side: built.taskContext.requiredSides[0] });
    state = applyIntent(state, { type: 'request-task-help' });
    const conversionHelp = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' }).meaning.taskHelp;
    const oldConversion = applyIntent(applyIntent(oldDecisionHelpState, { type: 'select-renaming-side', side: built.taskContext.requiredSides[0] }), { type: 'request-task-help' });
    expect(conversionHelp.kind).toBe('equivalent-fraction');
    const oldConversionHelp = projectScene({ state: oldConversion, representationRole: 'fraction-bar', presentationMode: 'instant-test' }).meaning.taskHelp;
    expect(conversionHelp).toMatchObject({ kind: oldConversionHelp.kind, status: oldConversionHelp.status, side: oldConversionHelp.side, acceptedMultiplier: oldConversionHelp.acceptedMultiplier });
    const wrong = built.taskContext.requiredSides[0] === 'left' ? 'right' : 'left';
    expect(wrong).not.toBe(built.taskContext.requiredSides[0]);
    const requiredSide = built.taskContext.requiredSides[0];
    const factor = correctOperandForm(built.instance, requiredSide, built.taskContext.targetDenominator).numerator;
    state = applyIntent(state, { type: 'submit-transform-help-multiplier', proposed: { kind: 'fraction', numerator: factor, denominator: '1' } });
    expect(projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' }).meaning.taskHelp.acceptedMultiplier).toBe(factor);
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: correctOperandForm(built.instance, requiredSide, built.taskContext.targetDenominator) });
    state = applyIntent(state, { type: 'request-replay' });
    expect(replayEpisode(createReplayEnvelope(state))).toEqual(state);
    const other = requiredSide === 'left' ? 'right' : 'left';
    expect(state.established.conversions[other]).toBeNull();
    state = applyIntent(state, { type: 'submit-operation-result', proposed: resultForm(built.instance, built.taskContext.targetDenominator) });
    expect(projectScene({ state, representationRole: 'symbolic', presentationMode: 'instant-test' }).meaning.operation.operandOrigins[other]).toEqual({ kind: 'validated-original', performed: false });
  });

  it('refuses malformed, incompatible, and altered recipe contexts and content bindings', () => {
    const record = PLAN35_ADDITION_RECIPE_RECORDS[0];
    const built = start(record);
    const context = built.taskContext;
    for (const altered of [
      { ...context, practiceSetRevision: '6' },
      { ...context, itemId: 'nested-one-half-plus-three-eighths' },
      { ...context, patternId: PLAN35_RECIPE_IDS.inspect },
      { ...context, sourceForms: { ...context.sourceForms, left: { kind: 'fraction', numerator: '1', denominator: '3' } } },
      { ...context, requiredSides: ['left'] },
      { ...context, extra: true },
    ]) {
      expect(() => createEpisode({ instance: built.instance, episodeDefinition: PLAN35_REUSABLE_ADDITION_RECIPES_EPISODE_DEFINITION, taskContext: altered })).toThrow();
    }
    const envelope = structuredClone(createReplayEnvelope(built.state));
    envelope.taskContext.sourceForms.right.denominator = '7';
    expect(() => replayEpisode(envelope)).toThrow();
  });

  it('rejects unknown recipe revisions and malformed or out-of-domain authored inspect candidates', () => {
    const record = PLAN35_ADDITION_RECIPE_RECORDS.find((row) => row.recipeId === PLAN35_RECIPE_IDS.inspect);
    const instance = instanceFor(record);
    for (const altered of [
      { ...record, recipeId: 'full-addition.unknown' },
      { ...record, patternRevision: '2' },
      { ...record, targetDenominator: 12 },
      { ...record, candidates: { ...record.candidates, left: { kind: 'decimal', numerator: '5', denominator: '12' } } },
      { ...record, candidates: { ...record.candidates, left: { kind: 'fraction', numerator: '05', denominator: '12' } } },
      { ...record, candidates: { ...record.candidates, left: { kind: 'fraction', numerator: '13', denominator: '12' } } },
    ]) {
      expect(() => validatePlan35AdditionRecipeRecord(instance, altered)).toThrow(/invalid Plan 35 addition recipe context/);
    }
  });

  it('preserves the five compact prefix schedules and completion semantics against Plan34 and Plan18', () => {
    const cases = [
      { itemId: 'two-thirds-plus-one-fourth', definition: PLAN34_FULL_ADDITION_EPISODE_DEFINITION, pattern: 'full-addition.construct-equivalent', target: '12' },
      { itemId: 'one-half-plus-one-third', definition: PLAN34_FULL_ADDITION_EPISODE_DEFINITION, pattern: 'full-addition.inspect-keep-repair', target: '12' },
      { itemId: 'one-third-plus-one-fourth', definition: PLAN34_FULL_ADDITION_EPISODE_DEFINITION, pattern: 'full-addition.inspect-keep-repair', target: '12' },
      { itemId: 'nested-one-half-plus-three-eighths', definition: PLAN18_NESTED_ADDITION_EPISODE_DEFINITION, target: '8' },
      { itemId: 'nested-three-eighths-plus-one-half', definition: PLAN18_NESTED_ADDITION_EPISODE_DEFINITION, target: '8' },
    ];
    for (const item of cases) {
      const record = PLAN35_ADDITION_RECIPE_RECORDS.find((row) => row.itemId === item.itemId);
      const instance = instanceFor(record);
      const next = start(record);
      const oldContext = item.definition.id === PLAN18_NESTED_ADDITION_EPISODE_DEFINITION.id
        ? resolvePlan18TaskContext(instance)
        : resolvePlan34TaskContext(instance, item.pattern, '1', item.target, { practiceSetRevision: '6' });
      const oldState = createEpisode({ instance, episodeDefinition: item.definition, taskContext: oldContext });
      expect(next.state.beatSchedule).toEqual(oldState.beatSchedule);
      expect(next.taskContext.targetDenominator).toBe(oldContext.targetDenominator);
      expect(next.state.expectedResponse.question).toBe(oldState.expectedResponse.question);
      const oldCompleted = item.definition.id === PLAN18_NESTED_ADDITION_EPISODE_DEFINITION.id
        ? completePlan18(instance, oldContext)
        : completePlan34(instance, item.definition, oldContext);
      const newCompleted = complete(record).state;
      expect(newCompleted.established.operation.proposed).toEqual(oldCompleted.established.operation.proposed);
      expect(newCompleted.established.compactCompletion ?? newCompleted.established.nestedCompletion).toEqual({ kind: 'navigation-completion' });
    }
  });
});

function completePlan18(instance, taskContext) {
  let state = createEpisode({ instance, episodeDefinition: PLAN18_NESTED_ADDITION_EPISODE_DEFINITION, taskContext });
  state = applyIntent(state, { type: 'acknowledge-encounter' });
  state = applyIntent(state, { type: 'select-renaming-side', side: taskContext.requiredSide });
  state = applyIntent(state, { type: 'submit-equivalent-form', proposed: correctOperandForm(instance, taskContext.requiredSide, '8') });
  state = applyIntent(state, { type: 'submit-operation-result', proposed: resultForm(instance, '8') });
  return applyIntent(state, { type: 'finish-nested-episode' });
}

function completePlan34(instance, definition, taskContext) {
  let state = createEpisode({ instance, episodeDefinition: definition, taskContext });
  state = applyIntent(state, { type: 'acknowledge-encounter' });
  for (const side of taskContext.requiredSides) {
    if (taskContext.patternId === 'full-addition.inspect-keep-repair') {
      const candidate = taskContext.candidates[side];
      const equivalent = equalFractions(mathematical(candidate), mathematical(instance.operands[side].initialForm));
      state = applyIntent(state, equivalent ? { type: 'keep-inspected-form' } : { type: 'repair-inspected-form', numerator: correctOperandForm(instance, side, taskContext.targetDenominator).numerator });
    } else state = applyIntent(state, { type: 'submit-equivalent-form', proposed: correctOperandForm(instance, side, taskContext.targetDenominator) });
  }
  state = applyIntent(state, { type: 'submit-operation-result', proposed: resultForm(instance, taskContext.targetDenominator) });
  return applyIntent(state, { type: 'finish-compact-episode' });
}
