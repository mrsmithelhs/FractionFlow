import { describe, expect, it } from 'vitest';
import {
  PLAN40_RECIPE_IDS,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_REVISION,
  PLAN40_VETTED_BATCH,
  findPlan40RecipeAssociationSet,
} from '../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import { resolveCuratedFixture } from '../src/content/authored-content-catalog.js';
import { buildCuratedProblem } from '../src/content/generator.js';
import {
  resolvePlan40SubtractionRecipeContext,
} from '../src/content/plan40-reusable-subtraction-recipes.js';
import {
  convertToDenominator,
  createFraction,
  equalFractions,
  subtractAtCommonDenominator,
} from '../src/math/index.js';
import { applyIntent, createEpisode, episodeStateSnapshot } from '../src/interaction/episode.js';
import {
  PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION,
} from '../src/interaction/episode-definition.js';
import { projectScene } from '../src/interaction/scene.js';
import {
  HIGH_SUPPORT_CONFIGURATION,
  MEDIUM_SUPPORT_CONFIGURATION,
} from '../src/interaction/support.js';

function toMath(wire) {
  return createFraction(BigInt(wire.numerator), BigInt(wire.denominator));
}

function instanceFor(record) {
  const fixture = resolveCuratedFixture(record.fixtureId, record.authoringRevision);
  return buildCuratedProblem({
    fixture,
    selector: fixture.selector,
    overlays: fixture.overlays,
    profileId: fixture.profileId,
    candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: [] },
  });
}

function startEpisode(record, support = HIGH_SUPPORT_CONFIGURATION) {
  const instance = instanceFor(record);
  const taskContext = resolvePlan40SubtractionRecipeContext(instance, record.itemId, {
    practiceSetId: PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID,
    practiceSetRevision: PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_REVISION,
  });
  const state = createEpisode({
    instance,
    episodeDefinition: PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION,
    taskContext,
    support,
  });
  return { instance, taskContext, state };
}

function expectedDifference(instance, targetDenominator) {
  const target = BigInt(targetDenominator);
  const left = toMath(instance.operands.left.initialForm);
  const right = toMath(instance.operands.right.initialForm);
  const diff = subtractAtCommonDenominator(left, right, target);
  return {
    kind: 'fraction',
    numerator: diff.numerator.toString(),
    denominator: diff.denominator.toString(),
  };
}

function expectedConvertedForm(instance, side, targetDenominator) {
  const target = BigInt(targetDenominator);
  const source = toMath(instance.operands[side].initialForm);
  const converted = convertToDenominator(source, target);
  return {
    kind: 'fraction',
    numerator: converted.numerator.toString(),
    denominator: converted.denominator.toString(),
  };
}

describe('Plan 40 interaction: reusable subtraction recipes (Stage 2)', () => {
  it('completes construct-equivalent subtraction recipes with exact scene projections (Guardrails A–C)', () => {
    const record = PLAN40_VETTED_BATCH.find((r) => r.recipeId === PLAN40_RECIPE_IDS.construct);
    const { state: initial, instance, taskContext } = startEpisode(record);

    // 1. Encounter beat
    expect(initial.beat).toBe('encounter');
    const encounterScene = projectScene({ state: initial, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(encounterScene.meaning.takeaway).toBeNull(); // Guardrail B: null during encounter
    expect(encounterScene.meaning.operation.rawResult).toBeNull();
    expect(encounterScene.meaning.operation.acceptedResponseForm).toBeNull();
    expect(encounterScene.meaning.availableAction).toEqual(expect.objectContaining({
      responsibility: 'inspect-expression',
      inputKind: 'acknowledge',
    }));

    // In construct, common denominator is already set; advance encounter -> transform (left)
    let state = applyIntent(initial, { type: 'acknowledge-encounter' });
    expect(state.beat).toBe('transform');

    // 2. Transform beat 1 (left)
    const transformLeftScene = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(transformLeftScene.meaning.takeaway).toBeNull(); // Guardrail B: null during transform
    expect(transformLeftScene.meaning.availableAction).toEqual(expect.objectContaining({
      responsibility: 'construct-equivalent-numerator',
      inputKind: 'numerator',
      target: 'left',
    }));

    const leftForm = expectedConvertedForm(instance, 'left', taskContext.targetDenominator);
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: leftForm });
    expect(state.beat).toBe('transform');

    // 3. Transform beat 2 (right)
    const transformRightScene = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(transformRightScene.meaning.takeaway).toBeNull();
    expect(transformRightScene.meaning.availableAction).toEqual(expect.objectContaining({
      responsibility: 'construct-equivalent-numerator',
      inputKind: 'numerator',
      target: 'right',
    }));

    const rightForm = expectedConvertedForm(instance, 'right', taskContext.targetDenominator);
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: rightForm });

    // 4. Operate beat (advances directly into operate with subtractionRemoval: 'marked')
    expect(state.beat).toBe('operate');
    expect(state.established.subtractionRemoval).toBe('marked');

    const operateScene = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(operateScene.meaning.takeaway).not.toBeNull(); // Guardrail B: active at operate
    expect(operateScene.meaning.takeaway.removalStatus).toBe('marked');
    expect(operateScene.meaning.takeaway.wholePartitionCount).toBe(Number(taskContext.targetDenominator));
    expect(operateScene.meaning.takeaway.sourceForms.left).toEqual(leftForm);
    expect(operateScene.meaning.takeaway.sourceForms.right).toEqual(rightForm);
    expect(operateScene.meaning.availableAction).toEqual(expect.objectContaining({
      responsibility: 'supply-amount-left',
      inputKind: 'fraction-response', // Guardrail A: fraction-response
    }));
    expect(operateScene.meaning.operation.rawResult).toBeNull();
    expect(operateScene.meaning.operation.acceptedResponseForm).toBeNull();
    expect(operateScene.meaning.operation.currentForms).toEqual({
      left: leftForm,
      right: rightForm,
    });

    // Advance operate -> resolve via submit-subtraction-result (Guardrail A)
    const diff = expectedDifference(instance, taskContext.targetDenominator);
    state = applyIntent(state, { type: 'submit-subtraction-result', proposed: diff });
    expect(state.beat).toBe('resolve');

    // 5. Resolve beat
    const resolveScene = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(resolveScene.meaning.takeaway).not.toBeNull();
    expect(resolveScene.meaning.takeaway.removalStatus).toBe('marked');
    expect(resolveScene.meaning.takeaway.acceptedResponseForm).toEqual(diff);
    expect(resolveScene.meaning.operation.acceptedResponseForm).toEqual(diff);
    expect(resolveScene.meaning.operation.preferredFinalForm).toEqual(diff);
    expect(resolveScene.meaning.availableAction).toEqual(expect.objectContaining({
      responsibility: 'settle-final-form',
      inputKind: 'fraction',
    }));

    // Finish compact episode
    state = applyIntent(state, { type: 'finish-compact-episode' });
    expect(state.status).toBe('resolved');
    expect(state.established.compactCompletion).toEqual({ kind: 'navigation-completion' });
  });

  it('completes inspect-keep-repair subtraction recipes with keep and repair actions', () => {
    const record = PLAN40_VETTED_BATCH.find((r) => r.recipeId === PLAN40_RECIPE_IDS.inspect);
    const { state: initial, instance, taskContext } = startEpisode(record);

    let state = applyIntent(initial, { type: 'acknowledge-encounter' });

    for (const side of taskContext.requiredSides) {
      expect(state.beat).toBe('transform');
      const candidate = taskContext.candidates[side];
      const source = toMath(instance.operands[side].initialForm);
      const cand = toMath(candidate);
      const isCandidateCorrect = equalFractions(source, cand);

      if (isCandidateCorrect) {
        state = applyIntent(state, { type: 'keep-inspected-form' });
      } else {
        const correct = expectedConvertedForm(instance, side, taskContext.targetDenominator);
        state = applyIntent(state, { type: 'repair-inspected-form', numerator: correct.numerator });
      }
    }

    expect(state.beat).toBe('operate');
    const diff = expectedDifference(instance, taskContext.targetDenominator);
    state = applyIntent(state, { type: 'submit-subtraction-result', proposed: diff });
    expect(state.beat).toBe('resolve');
    state = applyIntent(state, { type: 'finish-compact-episode' });
    expect(state.status).toBe('resolved');
  });

  it('completes identify-side-construct subtraction recipes and enforces Guardrail C', () => {
    const identifyRecords = PLAN40_VETTED_BATCH.filter((r) => r.recipeId === PLAN40_RECIPE_IDS.identify);

    for (const record of identifyRecords) {
      const { state: initial, instance, taskContext } = startEpisode(record);

      let state = applyIntent(initial, { type: 'acknowledge-encounter' });
      expect(state.beat).toBe('decide');

      // Guardrail C: candidateDenominatorsMeaning must be null during decide
      const decideScene = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
      expect(decideScene.meaning.unitRelationship.candidateDenominators).toBeNull();
      expect(decideScene.meaning.currentTask.responsibility).toBe('identify-renaming-side');
      expect(decideScene.meaning.currentTask.inputKind).toBe('side-choice');

      // Advance decide with side choice
      const requiredSide = taskContext.requiredSides[0];
      state = applyIntent(state, { type: 'select-renaming-side', side: requiredSide });
      expect(state.beat).toBe('transform');

      // Guardrail C: selectedSide projected in taskMeaning during transform
      const transformScene = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
      expect(transformScene.meaning.currentTask.selectedSide).toBe(requiredSide);

      // Perform single-side transform
      const converted = expectedConvertedForm(instance, requiredSide, taskContext.targetDenominator);
      state = applyIntent(state, { type: 'submit-equivalent-form', proposed: converted });
      expect(state.beat).toBe('operate');

      // Guardrail B: operationMeaning preserves unrenamed original operand and assigns correct origins
      const otherSide = requiredSide === 'left' ? 'right' : 'left';
      const operateScene = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
      expect(operateScene.meaning.operation.currentForms[otherSide]).toEqual(instance.operands[otherSide].initialForm);
      expect(operateScene.meaning.operation.currentForms[requiredSide]).toEqual(converted);
      expect(operateScene.meaning.operation.operandOrigins[otherSide]).toEqual({
        kind: 'validated-original',
        performed: false,
      });
      expect(operateScene.meaning.operation.operandOrigins[requiredSide]).toEqual({
        kind: 'learner-converted',
        performed: true,
      });

      // Submit subtraction result and finish
      const diff = expectedDifference(instance, taskContext.targetDenominator);
      state = applyIntent(state, { type: 'submit-subtraction-result', proposed: diff });
      expect(state.beat).toBe('resolve');
      state = applyIntent(state, { type: 'finish-compact-episode' });
      expect(state.status).toBe('resolved');
    }
  });

  it('accepts simplified equivalent fraction response and records dual-form truth', () => {
    // Item 7: 5/6 - 1/3 = 3/6. Simplified form is 1/2.
    const record = PLAN40_VETTED_BATCH.find((r) => r.itemId === 'plan40-identify-five-sixths-one-third-6');
    const { state: initial, instance, taskContext } = startEpisode(record);

    let state = applyIntent(initial, { type: 'acknowledge-encounter' });
    state = applyIntent(state, { type: 'select-renaming-side', side: 'right' });
    state = applyIntent(state, {
      type: 'submit-equivalent-form',
      proposed: expectedConvertedForm(instance, 'right', taskContext.targetDenominator),
    });
    expect(state.beat).toBe('operate');

    // Submit simplified form 1/2 instead of 3/6
    const simplified = { kind: 'fraction', numerator: '1', denominator: '2' };
    state = applyIntent(state, { type: 'submit-subtraction-result', proposed: simplified });
    expect(state.beat).toBe('resolve');

    // Verify dual-form recording: rawResultForm at targetDenominator (3/6) and submittedForm (1/2)
    expect(state.established.operation.rawResultForm).toEqual({
      kind: 'fraction',
      numerator: '3',
      denominator: '6',
    });
    expect(state.established.operation.submittedForm).toEqual(simplified);

    const resolveScene = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(resolveScene.meaning.takeaway.acceptedResponseForm).toEqual(simplified);
    expect(resolveScene.meaning.operation.acceptedResponseForm).toEqual(simplified);
    expect(resolveScene.meaning.operation.preferredFinalForm).toEqual(simplified);
  });

  it('rejects forbidden or mismatched intents with precise errors', () => {
    const record = PLAN40_VETTED_BATCH.find((r) => r.recipeId === PLAN40_RECIPE_IDS.identify);
    const { state: initial } = startEpisode(record);

    // Reject wrong renaming side at decide in identify
    const decide = applyIntent(initial, { type: 'acknowledge-encounter' });
    expect(decide.beat).toBe('decide');
    const wrongSide = record.requiredSides[0] === 'left' ? 'right' : 'left';
    const recoveryState = applyIntent(decide, { type: 'select-renaming-side', side: wrongSide });
    expect(recoveryState.lastRecovery?.classification.kind).toBe('side-choice-needs-retry');

    // Advance to operate
    let state = applyIntent(decide, { type: 'select-renaming-side', side: record.requiredSides[0] });
    const converted = expectedConvertedForm(instanceFor(record), record.requiredSides[0], record.targetDenominator);
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: converted });
    expect(state.beat).toBe('operate');

    // Cannot submit submit-operation-result at operate (must use submit-subtraction-result)
    expect(() => applyIntent(state, { type: 'submit-operation-result', proposed: { kind: 'fraction', numerator: '1', denominator: '6' } }))
      .toThrow(/reusable subtraction uses submit-subtraction-result/);

    // Reject submit-resolution at resolve (must use finish-compact-episode)
    state = applyIntent(state, {
      type: 'submit-subtraction-result',
      proposed: { kind: 'fraction', numerator: '3', denominator: '6' },
    });
    expect(state.beat).toBe('resolve');
    expect(() => applyIntent(state, { type: 'submit-resolution', proposed: { kind: 'fraction', numerator: '1', denominator: '2' } }))
      .toThrow(/compact resolve is navigation only/);
  });

  it('supports multiplier help during construct transform and task help during operate', () => {
    const record = PLAN40_VETTED_BATCH.find((r) => r.recipeId === PLAN40_RECIPE_IDS.construct);
    const { state: initial } = startEpisode(record);

    let state = applyIntent(initial, { type: 'acknowledge-encounter' });
    expect(state.beat).toBe('transform');

    // First request task help during transform
    state = applyIntent(state, { type: 'request-task-help' });
    expect(state.supportHistory).toHaveLength(1);

    // Multiplier help during transform
    state = applyIntent(state, {
      type: 'submit-transform-help-multiplier',
      proposed: { kind: 'fraction', numerator: '5', denominator: '1' },
    });
    expect(state.supportHistory).toHaveLength(2);

    // Advance to operate
    const leftForm = expectedConvertedForm(instanceFor(record), 'left', record.targetDenominator);
    const rightForm = expectedConvertedForm(instanceFor(record), 'right', record.targetDenominator);
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: leftForm });
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: rightForm });
    expect(state.beat).toBe('operate');

    // Task help during operate
    state = applyIntent(state, { type: 'request-task-help' });
    expect(state.supportHistory).toHaveLength(3);
    const operateHelpScene = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(operateHelpScene.meaning.taskHelp).toEqual({
      kind: 'like-denominator-takeaway',
      status: 'requested',
    });
  });
});
