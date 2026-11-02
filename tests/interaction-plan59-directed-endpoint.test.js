import { describe, it, expect } from 'vitest';
import { PLAN59_RECORDS } from '../src/content/data/plan59-directed-endpoint-records.js';
import { admitPlan59Record, resolvePlan59Context, validatePlan59Context } from '../src/content/plan59-directed-endpoint-task.js';
import { getEpisodeDefinition } from '../src/interaction/episode-definition.js';
import { createEpisode, applyIntent } from '../src/interaction/episode.js';
import { plan59IntentContext } from '../src/interaction/plan59-directed-endpoint-episode.js';
import { projectPlan59Endpoint } from '../src/interaction/plan59-directed-endpoint-scene.js';
import { projectScene } from '../src/interaction/scene.js';
import { MEDIUM_SUPPORT_CONFIGURATION } from '../src/interaction/support.js';
import { createReplayEnvelope, replayEpisode } from '../src/interaction/replay.js';

const start = (id, support) => createEpisode({
  episodeDefinition: getEpisodeDefinition('phase-4-directed-number-line-endpoint', '1'),
  taskContext: resolvePlan59Context(id), ...(support ? { support } : {}),
});
const send = (state, type, extra = {}) => applyIntent(state, { type, context: plan59IntentContext(state), ...extra });
const place = (state, candidateId) => send(state, 'place-directed-endpoint', { candidateId });
const check = state => send(state, 'check-directed-endpoint', { revision: state.placementRevision });
const roundtrip = state => expect(replayEpisode(JSON.parse(JSON.stringify(createReplayEnvelope(state))))).toEqual(state);

describe('Plan 59 pure directed endpoint', () => {
  it('admits all six exact inputs and verifies direction, distance and withheld results in both supports', () => {
    const resultNumerators = ['3', '1', '4', '2', '5', '2'];
    expect(PLAN59_RECORDS).toHaveLength(6);
    PLAN59_RECORDS.forEach((record, i) => {
      const admitted = admitPlan59Record(record);
      const d = Number(record.start.denominator);
      const endpoint = Number(resultNumerators[i]);
      expect(admitted.candidates).toHaveLength(d + 1);
      expect(admitted.candidates[0].form.numerator).toBe('0');
      expect(admitted.candidates[d].form.numerator).toBe(String(d));
      expect(admitted.verification.endpoint).toEqual({ numerator: resultNumerators[i], denominator: record.start.denominator });
      expect(admitted.verification.direction).toBe(record.operation === 'add' ? 'right' : 'left');
      expect(Math.abs(endpoint - Number(record.start.numerator))).toBe(Number(record.amount.numerator));
      for (const support of [undefined, MEDIUM_SUPPORT_CONFIGURATION]) {
        let state = start(record.itemId, support);
        expect(state.placement).toBeNull();
        expect(projectPlan59Endpoint(state).verification).toBeNull();
        expect(projectScene({ state, representationRole: 'number-line', presentationMode: 'instant-test' }).meaning.endpoint.verification).toBeNull();
        state = place(state, `step-${endpoint}`);
        expect(projectPlan59Endpoint(state).verification).toBeNull();
        roundtrip(state);
        state = check(state);
        expect(state.evaluation.status).toBe('accepted');
        expect(projectPlan59Endpoint(state).verification).toEqual(admitted.verification);
        roundtrip(state);
      }
    });
  });
  it('rejects unregistered, altered, unsupported or malformed inputs and context', () => {
    const record = PLAN59_RECORDS[0];
    for (const altered of [
      { ...record, operation: 'multiply' }, { ...record, operation: 'subtract' },
      { ...record, start: { numerator: '0', denominator: '4' } },
      { ...record, amount: { numerator: '4', denominator: '4' } },
      { ...record, amount: { numerator: '2', denominator: '6' } },
      { ...record, itemId: 'unknown' },
    ]) expect(() => admitPlan59Record(altered)).toThrow();
    expect(() => resolvePlan59Context('unknown')).toThrow();
    expect(() => validatePlan59Context({ ...resolvePlan59Context(record.itemId), operation: 'subtract' })).toThrow();
    expect(() => projectScene({ state: start(record.itemId), representationRole: 'fraction-bar', presentationMode: 'instant-test' })).toThrow();
  });
  it('preserves incomplete, wrong, revised and helped responses and rejects stale checks and context', () => {
    let state = start(PLAN59_RECORDS[3].itemId);
    state = check(state); expect(state.evaluation.status).toBe('incomplete'); roundtrip(state);
    state = place(state, 'step-4'); state = check(state);
    expect(state.evaluation.status).toBe('incorrect');
    expect(projectPlan59Endpoint(state).verification).toBeNull();
    state = send(state, 'request-directed-endpoint-help', { helpKind: 'placement' });
    expect(state.assistanceHistory, 'WITNESS_ASSISTANCE_HISTORY').toHaveLength(1); roundtrip(state);
    const stale = state.placementRevision;
    state = place(state, 'step-2');
    expect(state.evaluation.status).toBe('unchecked');
    expect(() => send(state, 'check-directed-endpoint', { revision: stale })).toThrow();
    expect(() => applyIntent(state, { type: 'place-directed-endpoint', context: { ...plan59IntentContext(state), itemId: 'other' }, candidateId: 'step-1' })).toThrow();
    expect(() => place(state, 'step-99')).toThrow();
    state = check(state); expect(state.evaluation.status).toBe('accepted');
    expect(state.responseProvenance[0].assistanceHistory).toHaveLength(1); roundtrip(state);
  });
  it('rejects altered v15 envelopes and stale replay intents', () => {
    const state = start(PLAN59_RECORDS[0].itemId);
    const envelope = JSON.parse(JSON.stringify(createReplayEnvelope(state)));
    expect(envelope.schemaVersion).toBe('fractionflow.episode-replay/v15');
    for (const mutate of [
      x => { x.contentIdentity.id = 'other'; }, x => { x.taskContext.start.numerator = '2'; },
      x => { x.extra = 1; },
      x => { x.learnerIntents = [{ type: 'check-directed-endpoint', context: plan59IntentContext(state), revision: 1 }]; },
    ]) { const bad = structuredClone(envelope); mutate(bad); expect(() => replayEpisode(bad)).toThrow(); }
  });
});
