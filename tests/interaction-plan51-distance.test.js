import { describe, expect, it } from 'vitest';
import { PLAN51_DISTANCE_RECORDS } from '../src/content/data/plan51-distance-records.js';
import { admitPlan51Record, resolvePlan51Context } from '../src/content/plan51-distance-task.js';
import { compareFractions, createFraction, equalFractions, subtractFractions } from '../src/math/index.js';
import { getEpisodeDefinition } from '../src/interaction/episode-definition.js';
import { applyIntent, createEpisode, episodeStateSnapshot, withActiveCondition } from '../src/interaction/episode.js';
import { plan51IntentContext } from '../src/interaction/plan51-distance-episode.js';
import { projectPlan51Distance } from '../src/interaction/plan51-distance-scene.js';
import { projectScene } from '../src/interaction/scene.js';
import { createReplayEnvelope, replayEpisode } from '../src/interaction/replay.js';
import { MEDIUM_SUPPORT_CONFIGURATION } from '../src/interaction/support.js';

const definition = getEpisodeDefinition('phase-4-fraction-distance', '1');
const start = (itemId, support) => createEpisode({ episodeDefinition: definition, taskContext: resolvePlan51Context(itemId), ...(support ? { support } : {}) });
const send = (state, type, fields = {}) => applyIntent(state, { type, context: plan51IntentContext(state), ...fields });

describe('Plan 51 pure distance contract', () => {
  it('derives all four relations and unsigned distances independently from exact core', () => {
    const expected = [['<', '4', '8'], ['>', '4', '8'], ['>', '2', '6'], ['>', '3', '6']];
    PLAN51_DISTANCE_RECORDS.forEach((record, index) => {
      const first = record.sourceForms.first;
      const second = record.sourceForms.second;
      const a = createFraction(BigInt(first.numerator), BigInt(first.denominator));
      const b = createFraction(BigInt(second.numerator), BigInt(second.denominator));
      const order = compareFractions(a, b);
      const oracle = subtractFractions(order > 0 ? a : b, order > 0 ? b : a);
      const admitted = admitPlan51Record(record);
      expect([admitted.relation, String(oracle.numerator), String(oracle.denominator)]).toEqual(expected[index]);
      expect(equalFractions(oracle, admitted.distance)).toBe(true);
      const swapped = structuredClone(record);
      [swapped.sourceForms.first, swapped.sourceForms.second] = [swapped.sourceForms.second, swapped.sourceForms.first];
      expect(equalFractions(admitPlan51Record(swapped).distance, oracle)).toBe(true);
      expect(resolvePlan51Context(record.itemId).sourceForms).toEqual(record.sourceForms);
    });
  });
  it('withholds pairs, retains model lock and accepts learner form while range uses source units', () => {
    let state = start('distance-03', MEDIUM_SUPPORT_CONFIGURATION);
    state = send(state, 'request-distance-comparison-model', { side: 'first' });
    expect(() => send(state, 'request-distance-comparison-model', { side: 'second' })).toThrow();
    state = send(state, 'submit-distance-comparison', { proposed: '<' });
    expect(projectPlan51Distance(state).acceptedRelation).toBeNull();
    state = send(state, 'submit-distance-comparison', { proposed: '>' });
    expect(projectPlan51Distance(state)).toMatchObject({ acceptedRelation: '>', pairedAmounts: false, distanceRange: null });
    state = send(state, 'submit-distance-fraction', { numerator: '1', denominator: '6' });
    expect(state.feedback).toBe('incorrect-distance');
    expect(projectPlan51Distance(state).pairedAmounts).toBe(false);
    state = send(state, 'request-distance-help', { helpKind: 'both-amounts' });
    expect(projectPlan51Distance(state)).toMatchObject({ pairedAmounts: true, distanceRange: null });
    state = send(state, 'submit-distance-fraction', { numerator: '1', denominator: '3' });
    expect(projectPlan51Distance(state)).toMatchObject({ acceptedDistance: { numerator: '1', denominator: '3' }, distanceRange: { start: 3, end: 5, denominator: 6, count: 2 } });
    const replay = state.intentHistory.reduce((current, intent) => applyIntent(current, intent), start('distance-03', MEDIUM_SUPPORT_CONFIGURATION));
    expect(episodeStateSnapshot(replay)).toEqual(episodeStateSnapshot(state));
  });
  it('accepts equivalents for every item and distinguishes refusal from wrong response', () => {
    for (const record of PLAN51_DISTANCE_RECORDS) {
      const admitted = admitPlan51Record(record);
      let state = send(start(record.itemId), 'submit-distance-comparison', { proposed: admitted.relation });
      for (const [numerator, denominator] of [['', '2'], ['01', '2'], ['1', '0'], ['1'.repeat(19), '2']]) {
        expect(() => send(state, 'submit-distance-fraction', { numerator, denominator })).toThrow();
        expect(state.responseProvenance).toHaveLength(1);
      }
      state = send(state, 'submit-distance-fraction', { numerator: String(admitted.distance.numerator * 2n), denominator: String(admitted.distance.denominator * 2n) });
      expect(state.status).toBe('resolved');
    }
  });
  it('refuses unsupported source, foreign context, stale stage and changed conditions', () => {
    for (const mutate of [r => { r.sourceForms.second = { ...r.sourceForms.first }; }, r => { r.sourceForms.second.denominator = '6'; }, r => { r.sourceForms.first.numerator = '0'; }, r => { r.sourceForms.first.denominator = '9'; }]) {
      const bad = structuredClone(PLAN51_DISTANCE_RECORDS[0]); mutate(bad);
      expect(() => admitPlan51Record(bad)).toThrow();
    }
    let state = start('distance-01');
    expect(() => applyIntent(state, { type: 'submit-distance-comparison', context: { ...plan51IntentContext(state), itemId: 'distance-02' }, proposed: '<' })).toThrow();
    expect(withActiveCondition(state, state.activeCondition)).toBe(state);
    expect(() => withActiveCondition(state, { ...state.activeCondition, display: 'other' })).toThrow();
    state = send(state, 'submit-distance-comparison', { proposed: '<' });
    expect(() => send(state, 'submit-distance-comparison', { proposed: '<' })).toThrow();
  });
  it('round trips v12 at each stage and projects only authorized scene information', () => {
    let state = start('distance-03', MEDIUM_SUPPORT_CONFIGURATION);
    const scene = () => projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' }).meaning.distance;
    const roundTrip = () => expect(replayEpisode(JSON.parse(JSON.stringify(createReplayEnvelope(state))))).toEqual(state);
    roundTrip();
    expect(scene()).toMatchObject({ acceptedRelation: null, pairedAmounts: false, distanceRange: null });
    state = send(state, 'submit-distance-comparison', { proposed: '>' });
    roundTrip();
    expect(scene()).toMatchObject({ acceptedRelation: '>', pairedAmounts: false, distanceRange: null });
    state = send(state, 'submit-distance-fraction', { numerator: '1', denominator: '6' });
    roundTrip();
    state = send(state, 'request-distance-help', { helpKind: 'both-amounts' });
    roundTrip();
    expect(scene()).toMatchObject({ pairedAmounts: true, distanceRange: null });
    state = send(state, 'submit-distance-fraction', { numerator: '1', denominator: '3' });
    roundTrip();
    expect(scene()).toMatchObject({ acceptedDistance: { numerator: '1', denominator: '3' }, distanceRange: { start: 3, end: 5, denominator: 6, count: 2 } });
    const envelope = JSON.parse(JSON.stringify(createReplayEnvelope(state)));
    for (const mutate of [e => { e.contentIdentity.id = 'distance-01'; }, e => { e.episodeDefinition.revision = '2'; }, e => { e.extra = true; }, e => { e.schemaVersion = 'fractionflow.episode-replay/v11'; }]) {
      const bad = structuredClone(envelope); mutate(bad); expect(() => replayEpisode(bad)).toThrow();
    }
  });
});
