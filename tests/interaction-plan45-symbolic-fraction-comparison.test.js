import { describe, expect, it } from 'vitest';
import {
  PLAN45_COMPARISON_RECORDS,
} from '../src/content/data/plan45-symbolic-fraction-comparison-records.js';
import { resolvePlan45ComparisonContext } from '../src/content/plan45-symbolic-fraction-comparison-task.js';
import { applyIntent, createEpisode, episodeStateSnapshot } from '../src/interaction/episode.js';
import { createReplayEnvelope, replayEpisode, REPLAY_V8_SCHEMA_VERSION, REPLAY_V9_SCHEMA_VERSION } from '../src/interaction/replay.js';
import { resolveRenderableScene } from '../src/render/contract.js';
import {
  PHASE2_ACTIVE_CONDITION,
  PHASE2_EPISODE_DEFINITION,
  PLAN45_SYMBOLIC_FRACTION_COMPARISON_EPISODE_DEFINITION,
} from '../src/interaction/episode-definition.js';
import { HIGH_SUPPORT_CONFIGURATION, MEDIUM_SUPPORT_CONFIGURATION } from '../src/interaction/support.js';
import { validateCuratedFixtures } from '../src/content/index.js';
import { compareFractions, createFraction } from '../src/math/index.js';

function start(itemId, support = HIGH_SUPPORT_CONFIGURATION) {
  return createEpisode({
    episodeDefinition: PLAN45_SYMBOLIC_FRACTION_COMPARISON_EPISODE_DEFINITION,
    taskContext: resolvePlan45ComparisonContext(itemId),
    support,
  });
}

function exactRelation(sourceForms) {
  const first = createFraction(BigInt(sourceForms.first.numerator), BigInt(sourceForms.first.denominator));
  const second = createFraction(BigInt(sourceForms.second.numerator), BigInt(sourceForms.second.denominator));
  const order = compareFractions(first, second);
  return order < 0 ? '<' : order > 0 ? '>' : '=';
}

function relationOtherThan(state) {
  const correct = exactRelation(state.taskContext.sourceForms);
  return ['<', '=', '>'].find((candidate) => candidate !== correct);
}

describe('Plan 45 pure comparison episode contract', () => {
  it('uses one immutable compare-to-resolve schedule for both existing support profiles', () => {
    const more = start('plan45-compare-01', HIGH_SUPPORT_CONFIGURATION);
    const less = start('plan45-compare-01', MEDIUM_SUPPORT_CONFIGURATION);
    expect(more.beatSchedule).toEqual([{ id: 'compare', kind: 'compare' }, { id: 'resolve', kind: 'resolve' }]);
    expect(less.beatSchedule).toEqual(more.beatSchedule);
    expect(more.beat).toBe('compare');
    expect(more.expectedResponse.choices).toEqual(['<', '=', '>']);
    expect(more.assistance.modelChoice).toBeNull();
    expect(less.assistance.modelChoice).toBeNull();
    expect(more.activeCondition).toEqual({
      id: 'plan45-static-comparison', revision: '1', display: 'not-applicable',
      choreography: 'not-applicable', promptCadence: 'D-05-focused-key-beats',
      connectionMaking: 'not-applicable',
    });
    expect(() => start('plan45-compare-01', { label: 'low support' })).toThrow(/only the existing More and Less/);
    expect(() => createEpisode({
      episodeDefinition: PLAN45_SYMBOLIC_FRACTION_COMPARISON_EPISODE_DEFINITION,
      taskContext: resolvePlan45ComparisonContext('plan45-compare-01'),
      activeCondition: PHASE2_ACTIVE_CONDITION,
    })).toThrow(/transformation display, choreography, and connection conditions do not apply/);
    expect(() => createEpisode({
      episodeDefinition: PLAN45_SYMBOLIC_FRACTION_COMPARISON_EPISODE_DEFINITION,
      taskContext: resolvePlan45ComparisonContext('plan45-compare-01'),
      activeCondition: { ...more.activeCondition, id: 'unregistered-static-condition' },
    })).toThrow(/static comparison accepts focused prompt cadence only/);

    const legacyInstance = validateCuratedFixtures().find((entry) => (
      entry.fixture.id === 'curated-relatively-prime-addition-non-least'
    )).instance;
    expect(createEpisode({ instance: legacyInstance, episodeDefinition: PHASE2_EPISODE_DEFINITION }).activeCondition)
      .toEqual(PHASE2_ACTIVE_CONDITION);
    expect(() => createEpisode({
      instance: legacyInstance,
      episodeDefinition: PHASE2_EPISODE_DEFINITION,
      activeCondition: null,
    })).toThrow(/activeCondition must be an object/);
    expect(() => createEpisode({
      episodeDefinition: PLAN45_SYMBOLIC_FRACTION_COMPARISON_EPISODE_DEFINITION,
      taskContext: resolvePlan45ComparisonContext('plan45-compare-01'),
      activeCondition: null,
    })).toThrow(/activeCondition must be an object/);
  });

  it('locks the first source-model request and retains it through help and wrong Check', () => {
    let state = start('plan45-compare-01');
    state = applyIntent(state, { type: 'request-comparison-model', side: 'first' });
    expect(state.assistance.modelChoice).toBe('first');
    expect(state.assistanceHistory).toEqual([{
      type: 'comparison-model-request', side: 'first', cueId: state.taskContext.cueId,
    }]);

    const duplicate = applyIntent(state, { type: 'request-comparison-model', side: 'first' });
    expect(duplicate).toBe(state); // Same-side duplicate is a strict no-op.
    expect(() => applyIntent(state, { type: 'request-comparison-model', side: 'second' }))
      .toThrow(/first requested source model remains selected/);

    state = applyIntent(state, { type: 'request-comparison-help', helpKind: 'reasoning' });
    const wrong = relationOtherThan(state);
    state = applyIntent(state, { type: 'submit-fraction-comparison', proposed: wrong });
    expect(state.status).toBe('active');
    expect(state.beat).toBe('compare');
    expect(state.schedulePosition).toBe(0);
    expect(state.assistance.modelChoice).toBe('first');
    expect(state.lastRecovery).toEqual({
      beat: 'compare', classification: { kind: 'comparison-retry' }, clearedPendingResponse: false,
    });
    expect(state.lastRecovery).not.toHaveProperty('expectedRelation');

    const correct = exactRelation(state.taskContext.sourceForms);
    state = applyIntent(state, { type: 'submit-fraction-comparison', proposed: correct });
    expect(state.status).toBe('resolved');
    expect(state.beat).toBe('resolve');
    expect(state.schedulePosition).toBe(1);
    expect(state.assistance.modelChoice).toBe('first');
    expect(state.established.comparison).toEqual({
      acceptedRelation: correct,
      sourceForms: state.taskContext.sourceForms,
    });
    expect(state.responseProvenance.at(-1).evidenceCategory).toBe('supported-construction');
    expect(state.responseProvenance.at(-1).assistanceHistory).toHaveLength(2);
    expect(() => applyIntent(state, { type: 'request-comparison-model', side: 'second' }))
      .toThrow(/resolved comparison episodes/);
  });

  it('accepts exact equality and rejects unsupported raw model/relation wires', () => {
    let state = start('plan45-compare-11');
    expect(() => applyIntent(state, { type: 'request-comparison-model', side: 'left' }))
      .toThrow(/exactly first or second/);
    expect(() => applyIntent(state, { type: 'submit-fraction-comparison', proposed: 'equal' }))
      .toThrow(/exactly <, =, or >/);
    expect(() => applyIntent(state, { type: 'submit-fraction-comparison', proposed: '=' , answer: true }))
      .toThrow(/exactly <, =, or >/);

    state = applyIntent(state, { type: 'submit-fraction-comparison', proposed: '=' });
    expect(state.status).toBe('resolved');
    expect(state.established.comparison.acceptedRelation).toBe('=');
  });

  it('tests all three choices on all 12 registered identities using an independent exact-math oracle', () => {
    for (const record of PLAN45_COMPARISON_RECORDS) {
      const expected = exactRelation(record.sourceForms);
      const results = ['<', '=', '>'].map((proposed) => applyIntent(
        start(record.itemId),
        { type: 'submit-fraction-comparison', proposed },
      ));
      expect(results.filter((result) => result.status === 'resolved')).toHaveLength(1);
      for (let index = 0; index < results.length; index += 1) {
        const proposed = ['<', '=', '>'][index];
        const result = results[index];
        expect(result.established.comparison?.acceptedRelation ?? null).toBe(proposed === expected ? expected : null);
        if (proposed === expected) {
          expect(result.status).toBe('resolved');
          expect(result.established.comparison.sourceForms).toEqual(record.sourceForms);
          expect(episodeStateSnapshot(result)).toMatchObject({ acceptedComparison: { acceptedRelation: expected } });
        } else {
          expect(result.status).toBe('active');
          expect(result.beat).toBe('compare');
          expect(result.schedulePosition).toBe(0);
          expect(result.lastRecovery.classification.kind).toBe('comparison-retry');
        }
      }
    }
  });

  it('projects the selected one-model scene without correctness or private provenance, then reveals paired verification after acceptance', () => {
    let state = start('plan45-compare-01');
    let scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
    expect(scene.meaning.comparison).toMatchObject({ modelChoice: null, pairedVerificationVisible: false });
    expect(scene.meaning.comparison).not.toHaveProperty('acceptedRelation');
    expect(scene.meaning.comparison.sourceForms).toEqual(state.taskContext.sourceForms);
    expect(JSON.stringify(scene)).not.toMatch(/correct-option|expected-relation|classification|normalizedIdentity/);

    state = applyIntent(state, { type: 'request-comparison-model', side: 'second' });
    scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
    expect(scene.meaning.comparison.modelChoice).toBe('second');
    expect(scene.meaning.comparison.pairedVerificationVisible).toBe(false);
    expect(JSON.stringify(scene.meaning.comparison)).not.toContain('firstModel');

    state = applyIntent(state, { type: 'submit-fraction-comparison', proposed: exactRelation(state.taskContext.sourceForms) });
    scene = resolveRenderableScene({ state, presentationMode: 'instant-test' });
    expect(scene.meaning.comparison).toMatchObject({
      modelChoice: 'second',
      acceptedRelation: exactRelation(state.taskContext.sourceForms),
      pairedVerificationVisible: true,
    });
  });

  it('round-trips comparison-only replay v9 and rejects cross-version or identity mismatches', () => {
    let state = start('plan45-compare-07', MEDIUM_SUPPORT_CONFIGURATION);
    state = applyIntent(state, { type: 'request-comparison-model', side: 'first' });
    state = applyIntent(state, { type: 'request-comparison-help', helpKind: 'notation' });
    const wrong = relationOtherThan(state);
    state = applyIntent(state, { type: 'submit-fraction-comparison', proposed: wrong });
    state = applyIntent(state, { type: 'submit-fraction-comparison', proposed: exactRelation(state.taskContext.sourceForms) });

    const envelope = createReplayEnvelope(state);
    expect(envelope.schemaVersion).toBe(REPLAY_V9_SCHEMA_VERSION);
    expect(envelope.contentIdentity.schemaVersion).toBe('fractionflow.comparison-content-identity/v1');
    expect(replayEpisode(JSON.parse(JSON.stringify(envelope)))).toEqual(state);

    const v8 = JSON.parse(JSON.stringify(envelope));
    v8.schemaVersion = REPLAY_V8_SCHEMA_VERSION;
    expect(() => replayEpisode(v8)).toThrow();

    const altered = JSON.parse(JSON.stringify(envelope));
    altered.contentIdentity.reconstruction.itemId = 'plan45-compare-08';
    expect(() => replayEpisode(altered)).toThrow(/identity|authoritative|context/i);

    const wrongDefinition = JSON.parse(JSON.stringify(envelope));
    wrongDefinition.episodeDefinition.id = PHASE2_EPISODE_DEFINITION.id;
    wrongDefinition.episodeDefinition.revision = PHASE2_EPISODE_DEFINITION.revision;
    expect(() => replayEpisode(wrongDefinition)).toThrow(/v9|comparison/i);
  });
});
