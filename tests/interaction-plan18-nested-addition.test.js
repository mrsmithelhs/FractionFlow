import { describe, expect, it } from 'vitest';
import { buildCuratedProblem } from '../src/content/generator.js';
import { resolveCuratedFixture } from '../src/content/authored-content-catalog.js';
import { resolvePlan18TaskContext } from '../src/content/nested-renaming-task.js';
import { PLAN18_NESTED_ADDITION_EPISODE_DEFINITION } from '../src/interaction/episode-definition.js';
import { applyIntent, createEpisode } from '../src/interaction/episode.js';
import { createReplayEnvelope, replayEpisode, REPLAY_V3_SCHEMA_VERSION } from '../src/interaction/replay.js';
import { projectScene } from '../src/interaction/scene.js';
import { HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from '../src/interaction/support.js';
import { addFractions, convertToDenominator } from '../src/math/index.js';

const records = [
  ['curated-nested-addition-one-half-three-eighths', 'left'],
  ['curated-nested-addition-three-eighths-one-half', 'right'],
];
function start(fixtureId, support = HIGH_SUPPORT_CONFIGURATION) {
  const fixture = resolveCuratedFixture(fixtureId, 'plan18-record-v1');
  const instance = buildCuratedProblem({ fixture, selector: fixture.selector, overlays: [], profileId: fixture.profileId, candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: [] } });
  const taskContext = resolvePlan18TaskContext(instance);
  return { instance, taskContext, state: createEpisode({ instance, episodeDefinition: PLAN18_NESTED_ADDITION_EPISODE_DEFINITION, taskContext, support }) };
}
function expectedSum(instance) {
  const at8 = (side) => convertToDenominator({ kind: 'fraction', numerator: BigInt(instance.operands[side].initialForm.numerator), denominator: BigInt(instance.operands[side].initialForm.denominator) }, 8n);
  const sum = addFractions(at8('left'), at8('right'));
  return { kind: 'fraction', numerator: sum.numerator.toString(), denominator: sum.denominator.toString() };
}
function complete(fixtureId, support = HIGH_SUPPORT_CONFIGURATION) {
  const built = start(fixtureId, support); let state = built.state;
  const side = built.taskContext.requiredSide;
  state = applyIntent(state, { type: 'acknowledge-encounter' });
  state = applyIntent(state, { type: 'select-renaming-side', side });
  const converted = convertToDenominator({ kind: 'fraction', numerator: BigInt(built.instance.operands[side].initialForm.numerator), denominator: BigInt(built.instance.operands[side].initialForm.denominator) }, 8n);
  state = applyIntent(state, { type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: converted.numerator.toString(), denominator: '8' } });
  state = applyIntent(state, { type: 'submit-operation-result', proposed: expectedSum(built.instance) });
  state = applyIntent(state, { type: 'finish-nested-episode' });
  return { ...built, state };
}

describe('Plan 18 nested-denominator episode', () => {
  it('keeps both fixed orders on the five-entry schedule for high and medium support without denominator suggestions', () => {
    for (const support of [HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION]) for (const [fixtureId, side] of records) {
      const { taskContext, state } = start(fixtureId, support);
      expect(taskContext.requiredSide).toBe(side);
      expect(state.beatSchedule.map((entry) => entry.id)).toEqual(['encounter', 'select-renaming-side', `transform-${side}`, 'operate', 'resolve']);
      const choiceState = applyIntent(state, { type: 'acknowledge-encounter' });
      expect(choiceState.expectedResponse.question).toBe('Which fraction needs new parts to use eighths?');
      expect(choiceState.expectedResponse.choices.map((choice) => choice.side)).toEqual(['left', 'right']);
      expect(choiceState.expectedResponse.choices[0].form).toEqual(state.content.operands.left.initialForm);
      const scene = projectScene({ state: choiceState, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
      expect(scene.meaning.currentTask).not.toHaveProperty('selectedSide');
      expect(scene.meaning.currentTask).not.toHaveProperty('requiredSide');
      expect(scene.meaning.unitRelationship.candidateDenominators).toBeNull();
    }
  });
  it('keeps side and conversion errors local, then records one learner conversion and the effective original operand for both orders and profiles', () => {
    for (const support of [HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION]) for (const [fixtureId, requiredSide] of records) {
    const { taskContext, state: initial } = start(fixtureId, support);
    let state = applyIntent(initial, { type: 'acknowledge-encounter' });
    state = applyIntent(state, { type: 'request-task-help' });
    expect(state.supportHistory.at(-1)).toMatchObject({ type: 'task-help-request', scheduleEntryId: 'select-renaming-side', side: null });
    const helpScene = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(helpScene.meaning.taskHelp).toEqual({ kind: 'renaming-side-comparison', status: 'requested', targetDenominator: '8' });
    expect(helpScene.meaning.taskHelp).not.toHaveProperty('side');
    const wrongSide = requiredSide === 'left' ? 'right' : 'left';
    const retry = applyIntent(state, { type: 'select-renaming-side', side: wrongSide });
    expect(retry.schedulePosition).toBe(1);
    expect(retry.lastRecovery.classification.kind).toBe('side-choice-needs-retry');
    state = applyIntent(retry, { type: 'select-renaming-side', side: taskContext.requiredSide });
    const side = taskContext.requiredSide;
    const source = state.content.operands[side].initialForm;
    const converted = convertToDenominator({ kind: 'fraction', numerator: BigInt(source.numerator), denominator: BigInt(source.denominator) }, 8n);
    const wrongConversion = applyIntent(state, { type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: '1', denominator: '8' } });
    expect(wrongConversion.schedulePosition).toBe(2);
    expect(wrongConversion.lastRecovery.classification.kind).not.toBe('correct-equivalent-form');
    state = wrongConversion;
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: converted.numerator.toString(), denominator: '8' } });
    // Replay is a history-only action once the learner has made the conversion.
    // It must preserve the accepted side and the untouched eighths operand.
    const other = side === 'left' ? 'right' : 'left';
    const acceptedConversion = state;
    state = applyIntent(state, { type: 'request-replay' });
    expect(state.taskContext.requiredSide).toBe(taskContext.requiredSide);
    expect(state.established.conversions[side]).toEqual(acceptedConversion.established.conversions[side]);
    expect(state.established.conversions[other]).toBeNull();
    expect(state.content.operands[other].initialForm).toEqual(acceptedConversion.content.operands[other].initialForm);
    expect(replayEpisode(createReplayEnvelope(state))).toEqual(state);
    const result = expectedSum(state.content);
    state = applyIntent(state, { type: 'submit-operation-result', proposed: result });
    const requiredSideBeforeReplay = state.taskContext.requiredSide;
    state = applyIntent(state, { type: 'request-replay' });
    expect(state.taskContext.requiredSide).toBe(requiredSideBeforeReplay);
    expect(replayEpisode(createReplayEnvelope(state))).toEqual(state);
    const scene = projectScene({ state, representationRole: 'symbolic', presentationMode: 'instant-test' });
    expect(state.established.conversions[other]).toBeNull();
    expect(scene.meaning.operation.currentForms[other]).toEqual(state.content.operands[other].initialForm);
    expect(scene.meaning.operation.operandOrigins[other]).toEqual({ kind: 'validated-original', performed: false });
    expect(scene.meaning.operation.operandOrigins[side]).toEqual({ kind: 'learner-converted', performed: true });
    expect(scene.meaning.operation.currentForms[other]).toEqual(state.content.operands[other].initialForm);
    expect(state.responseProvenance.at(-1).visibility.visible).toContain('validated-original-operand');
    expect(state.beatSchedule.filter((entry) => entry.kind === 'transform')).toHaveLength(1);
    }
  });
  it('rejects legacy denominator and fraction-resolution intents directly and during v3 replay', () => {
    const { state: initial } = start(records[0][0]);
    const decide = applyIntent(initial, { type: 'acknowledge-encounter' });
    const denominatorIntent = { type: 'propose-common-denominator', proposed: { kind: 'fraction', numerator: '1', denominator: '8' } };
    expect(() => applyIntent(decide, denominatorIntent)).toThrow(/nested side choice/);
    const badDecisionReplay = structuredClone(createReplayEnvelope(initial));
    badDecisionReplay.learnerIntents = [{ type: 'acknowledge-encounter' }, denominatorIntent];
    expect(() => replayEpisode(badDecisionReplay)).toThrow(/nested side choice/);
    const beforeResolve = completeForResolve(records[0][0]);
    const resolutionIntent = { type: 'submit-resolution', proposed: beforeResolve.state.established.operation.proposed };
    expect(() => applyIntent(beforeResolve.state, resolutionIntent)).toThrow(/navigation only/);
    const badResolveReplay = structuredClone(createReplayEnvelope(initial));
    badResolveReplay.learnerIntents = [...beforeResolve.state.intentHistory, resolutionIntent];
    expect(() => replayEpisode(badResolveReplay)).toThrow(/navigation only/);
  });
  it('exports exact v3 and round-trips initial and completed state across both orders and support profiles', () => {
    for (const support of [HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION]) for (const [fixtureId, requiredSide] of records) {
    const { state: initial, taskContext } = start(fixtureId, support);
    expect(createReplayEnvelope(initial).schemaVersion).toBe(REPLAY_V3_SCHEMA_VERSION);
    expect(replayEpisode(createReplayEnvelope(initial))).toEqual(initial);
    expect(taskContext.requiredSide).toBe(requiredSide);
    const { state: completed } = complete(fixtureId, support);
    const replayed = replayEpisode(createReplayEnvelope(completed));
    expect(replayed).toEqual(completed);
    expect(replayed.established.conversions[requiredSide === 'left' ? 'right' : 'left']).toBeNull();
    expect(replayed.established.operation.proposed).toEqual(expectedSum(replayed.content));
    const mutationCases = [
      (e) => { e.taskContext.practiceSetRevision = '5'; },
      (e) => { e.taskContext.itemId = 'unregistered-item'; },
      (e) => { e.taskContext.sourceForms.left.denominator = '3'; },
      (e) => { e.taskContext.targetDenominator = '16'; },
      (e) => { e.taskContext.taskDataId = 'unknown-task-data'; },
      (e) => { e.taskContext.definitionRevision = '2'; },
      (e) => { e.taskContext.unreviewed = true; },
      (e) => { e.schemaVersion = 'fractionflow.episode-replay/v2'; },
      (e) => { e.episodeDefinition.revision = '2'; },
    ];
    for (const mutate of mutationCases) {
      const tampered = structuredClone(createReplayEnvelope(initial));
      mutate(tampered);
      expect(() => replayEpisode(tampered)).toThrow();
    }
    }
  });
});

function completeForResolve(fixtureId) {
  const built = start(fixtureId); let state = built.state;
  const side = built.taskContext.requiredSide;
  state = applyIntent(state, { type: 'acknowledge-encounter' });
  state = applyIntent(state, { type: 'select-renaming-side', side });
  const form = convertToDenominator({ kind: 'fraction', numerator: BigInt(built.instance.operands[side].initialForm.numerator), denominator: BigInt(built.instance.operands[side].initialForm.denominator) }, 8n);
  state = applyIntent(state, { type: 'submit-equivalent-form', proposed: { kind: 'fraction', numerator: form.numerator.toString(), denominator: '8' } });
  state = applyIntent(state, { type: 'submit-operation-result', proposed: expectedSum(built.instance) });
  return { ...built, state };
}
