import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  PLAN40_RECIPE_IDS,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_REVISION,
  PLAN40_SUBTRACTION_RECIPE_RECORDS,
  PLAN40_VETTED_BATCH,
  PLAN40_DATA_ONLY_HOLDOUTS,
  PLAN40_DATA_ONLY_HOLDOUTS_ID,
  PLAN40_DATA_ONLY_HOLDOUTS_REVISION,
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
import { applyIntent, createEpisode } from '../src/interaction/episode.js';
import {
  PLAN40_REUSABLE_SUBTRACTION_RECIPES_EPISODE_DEFINITION,
} from '../src/interaction/episode-definition.js';
import {
  REPLAY_V4_SCHEMA_VERSION,
  REPLAY_V5_SCHEMA_VERSION,
  REPLAY_V6_SCHEMA_VERSION,
  createReplayEnvelope,
  replayEpisode,
} from '../src/interaction/replay.js';
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
  const isHoldout = record.itemId.startsWith('plan40-holdout-');
  const taskContext = resolvePlan40SubtractionRecipeContext(instance, record.itemId, {
    practiceSetId: isHoldout ? PLAN40_DATA_ONLY_HOLDOUTS_ID : PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID,
    practiceSetRevision: isHoldout ? PLAN40_DATA_ONLY_HOLDOUTS_REVISION : record.itemId.startsWith('plan85-') ? '3' : record.itemId.startsWith('plan76-') ? '2' : PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_REVISION,
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

function completeEpisode(record, support = HIGH_SUPPORT_CONFIGURATION) {
  const { instance, taskContext, state: initial } = startEpisode(record, support);
  let state = applyIntent(initial, { type: 'acknowledge-encounter' });

  if (record.recipeId === PLAN40_RECIPE_IDS.identify) {
    const requiredSide = taskContext.requiredSides[0];
    state = applyIntent(state, { type: 'select-renaming-side', side: requiredSide });
    const converted = expectedConvertedForm(instance, requiredSide, taskContext.targetDenominator);
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: converted });
  } else if (record.recipeId === PLAN40_RECIPE_IDS.inspect) {
    for (const side of taskContext.requiredSides) {
      const candidate = taskContext.candidates[side];
      const source = toMath(instance.operands[side].initialForm);
      const cand = toMath(candidate);
      if (equalFractions(source, cand)) {
        state = applyIntent(state, { type: 'keep-inspected-form' });
      } else {
        const correct = expectedConvertedForm(instance, side, taskContext.targetDenominator);
        state = applyIntent(state, { type: 'repair-inspected-form', numerator: correct.numerator });
      }
    }
  } else {
    // Construct
    for (const side of taskContext.requiredSides) {
      const converted = expectedConvertedForm(instance, side, taskContext.targetDenominator);
      state = applyIntent(state, { type: 'submit-equivalent-form', proposed: converted });
    }
  }

  const diff = expectedDifference(instance, taskContext.targetDenominator);
  state = applyIntent(state, { type: 'submit-subtraction-result', proposed: diff });
  state = applyIntent(state, { type: 'finish-compact-episode' });
  return { initial, completed: state };
}

describe('Plan 40 Replay v6 and backwards compatibility suite (Stage 2)', () => {
  it('reconstructs the frozen pre-Plan 79 v1 oracle exactly', () => {
    const oracle = JSON.parse(readFileSync(new URL('../reports/development/plan-79-unlike-subtraction-bank-publication/v1-v6-oracle.json', import.meta.url), 'utf8'));
    expect(JSON.parse(JSON.stringify(replayEpisode(oracle.envelope)))).toEqual(oracle.expectedState);
  });
  it('round-trips initial and completed episodes for all 32 registered items through Replay v6', () => {
    const historicalRecords = PLAN40_SUBTRACTION_RECIPE_RECORDS.filter((record) => !record.itemId.startsWith('plan86-'));
    expect(historicalRecords).toHaveLength(32);

    for (const record of historicalRecords) {
      const { initial, completed } = completeEpisode(record);

      // Initial state round-trip
      const initialEnvelope = createReplayEnvelope(initial);
      expect(initialEnvelope.schemaVersion).toBe(REPLAY_V6_SCHEMA_VERSION);
      expect(initialEnvelope.episodeDefinition.id).toBe('phase-3-reusable-subtraction-recipes');
      expect(initialEnvelope.episodeDefinition.revision).toBe('1');
      expect(initialEnvelope.learnerIntents).toHaveLength(0);

      const replayedInitial = replayEpisode(initialEnvelope);
      expect(replayedInitial).toEqual(initial);

      // Completed state round-trip
      const completedEnvelope = createReplayEnvelope(completed);
      expect(completedEnvelope.schemaVersion).toBe(REPLAY_V6_SCHEMA_VERSION);
      expect(completedEnvelope.learnerIntents.length).toBeGreaterThan(0);

      const replayedCompleted = replayEpisode(completedEnvelope);
      expect(replayedCompleted).toEqual(completed);
      expect(replayedCompleted.status).toBe('resolved');
      expect(replayedCompleted.established.compactCompletion).toEqual({ kind: 'navigation-completion' });
    }
  });

  it('round-trips under medium support configuration without schema deviations', () => {
    for (const record of PLAN40_VETTED_BATCH) {
      const { initial, completed } = completeEpisode(record, MEDIUM_SUPPORT_CONFIGURATION);

      const initialEnvelope = createReplayEnvelope(initial);
      expect(initialEnvelope.schemaVersion).toBe(REPLAY_V6_SCHEMA_VERSION);
      expect(replayEpisode(initialEnvelope)).toEqual(initial);

      const completedEnvelope = createReplayEnvelope(completed);
      expect(completedEnvelope.schemaVersion).toBe(REPLAY_V6_SCHEMA_VERSION);
      expect(replayEpisode(completedEnvelope)).toEqual(completed);
    }
  });

  it('enforces exact taskContext shape and rejects tampering in Replay v6', () => {
    const record = PLAN40_VETTED_BATCH[0];
    const { initial } = completeEpisode(record);
    const envelope = createReplayEnvelope(initial);

    // Missing key in taskContext
    const tampered = structuredClone(envelope);
    delete tampered.taskContext.candidates;
    expect(() => replayEpisode(tampered)).toThrow(/replay v6 taskContext has an unsupported shape/);

    // Extra key in taskContext
    const extraKey = structuredClone(envelope);
    extraKey.taskContext.extraField = 'malicious';
    expect(() => replayEpisode(extraKey)).toThrow(/replay v6 taskContext has an unsupported shape/);

    // Mismatched definition id
    const badDef = structuredClone(envelope);
    badDef.episodeDefinition.id = 'phase-3-reusable-addition-recipes';
    expect(() => replayEpisode(badDef)).toThrow(/replay v6 is reserved for exact Plan 40 recipe context/);
  });

  it('rejects disallowed learner intent types in Replay v6', () => {
    const record = PLAN40_VETTED_BATCH[0];
    const { initial } = completeEpisode(record);
    const envelope = createReplayEnvelope(initial);

    const badEnvelope = structuredClone(envelope);
    badEnvelope.learnerIntents = [
      { type: 'acknowledge-encounter' },
      { type: 'submit-operation-result', proposed: { kind: 'fraction', numerator: '1', denominator: '10' } },
    ];
    expect(() => replayEpisode(badEnvelope)).toThrow(/replay v6 does not permit intent type: submit-operation-result/);

    const badNoticeEnvelope = structuredClone(envelope);
    badNoticeEnvelope.learnerIntents = [
      { type: 'submit-notice', matchesUnits: true },
    ];
    expect(() => replayEpisode(badNoticeEnvelope)).toThrow(/replay v6 does not permit intent type: submit-notice/);
  });

  it('preserves frozen Plan 38 Replay v5 baseline oracles without modification (16 cases)', () => {
    const oraclesJson = readFileSync(
      new URL('./fixtures/plan38-v5-replay-oracles.json', import.meta.url),
      'utf8',
    );
    const oracleDocument = JSON.parse(oraclesJson);
    expect(oracleDocument.oracleId).toBe('plan38-v5-replay-baseline-before-plan40');
    expect(Array.isArray(oracleDocument.cases)).toBe(true);
    expect(oracleDocument.cases.length).toBe(16);

    for (const oracleCase of oracleDocument.cases) {
      expect(oracleCase.envelope.schemaVersion).toBe(REPLAY_V5_SCHEMA_VERSION);
      const replayed = replayEpisode(oracleCase.envelope);
      expect(JSON.parse(JSON.stringify(replayed))).toEqual(oracleCase.expectedState);

      const envelope = createReplayEnvelope(replayed);
      expect(envelope.schemaVersion).toBe(REPLAY_V5_SCHEMA_VERSION);
      expect(envelope.episodeDefinition.id).toBe('phase-3-like-denominator-takeaway-subtraction');
    }
  });

  it('preserves frozen Plan 35 Replay v4 baseline oracles without modification (8 cases)', () => {
    const oraclesJson = readFileSync(
      new URL('./fixtures/plan35-v4-replay-oracles.json', import.meta.url),
      'utf8',
    );
    const oracleDocument = JSON.parse(oraclesJson);
    expect(oracleDocument.oracleId).toBe('plan35-v4-replay-baseline-before-plan38');
    expect(Array.isArray(oracleDocument.cases)).toBe(true);
    expect(oracleDocument.cases.length).toBe(8);

    for (const oracleCase of oracleDocument.cases) {
      expect(oracleCase.envelope.schemaVersion).toBe(REPLAY_V4_SCHEMA_VERSION);
      const replayed = replayEpisode(oracleCase.envelope);
      expect(JSON.parse(JSON.stringify(replayed))).toEqual(oracleCase.expectedState);

      const envelope = createReplayEnvelope(replayed);
      expect(envelope.schemaVersion).toBe(REPLAY_V4_SCHEMA_VERSION);
      expect(envelope.episodeDefinition.id).toBe('phase-3-reusable-addition-recipes');
    }
  });
});
