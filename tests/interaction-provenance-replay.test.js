import { describe, expect, it } from 'vitest';
import {
  applyIntent,
  createEpisode,
  createReplayEnvelope,
  replayEpisode,
} from '../src/interaction/index.js';
import {
  generateProblem,
  validateCuratedFixtures,
} from '../src/content/index.js';

function whole(value) {
  return { kind: 'fraction', numerator: String(value), denominator: '1' };
}

function fraction(numerator, denominator) {
  return { kind: 'fraction', numerator: String(numerator), denominator: String(denominator) };
}

function resolved(instance) {
  let state = createEpisode({ instance });
  const path = instance.canonicalPath;
  const leftConversion = path.transformations.find((entry) => entry.target === 'left')?.toForm
    ?? path.operation.left;
  const rightConversion = path.transformations.find((entry) => entry.target === 'right')?.toForm
    ?? path.operation.right;
  const actions = [
    { type: 'acknowledge-encounter' },
    { type: 'submit-notice', matchesUnits: false },
    { type: 'propose-common-denominator', proposed: whole(path.targetDenominator) },
    { type: 'submit-equivalent-form', proposed: leftConversion },
    { type: 'submit-equivalent-form', proposed: rightConversion },
    { type: 'submit-operation-result', proposed: path.finalResult.rawForm },
    { type: 'submit-resolution', proposed: path.finalResult.preferredFinalForm },
  ];
  for (const action of actions) state = applyIntent(state, action);
  return state;
}

function curatedInstance() {
  return validateCuratedFixtures().find((entry) => (
    entry.fixture.id === 'curated-relatively-prime-addition-non-least'
  )).instance;
}

describe('Plan 05 provenance and replay', () => {
  it('records supported help separately from an uncued response opportunity', () => {
    let state = createEpisode({ instance: curatedInstance() });
    state = applyIntent(state, { type: 'acknowledge-encounter' });
    state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
    state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(12) });
    state = applyIntent(state, { type: 'request-help' });
    state = applyIntent(state, { type: 'request-help' });
    state = applyIntent(state, { type: 'request-help' });
    state = applyIntent(state, { type: 'request-help' });
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(8, 12) });
    expect(state.responseProvenance.at(-1).evidenceCategory).toBe('supported-construction');
    expect(state.responseProvenance.at(-1).helpHistory.at(-1).level).toBe('demonstrate');
    expect(state.responseProvenance.at(-1).visibility.supplied).toContain('reviewed-demonstration');
  });

  it('replays a generated instance from its envelope identity alone', () => {
    const instance = generateProblem({
      selector: 'relatively-prime-addition',
      seed: 'plan05-generated-replay',
    });
    const original = resolved(instance);
    const envelope = createReplayEnvelope(original);
    expect(() => JSON.stringify(envelope)).not.toThrow();
    expect(envelope.contentIdentity.reconstruction.kind).toBe('generated');
    const replayed = replayEpisode(JSON.parse(JSON.stringify(envelope)));
    expect(JSON.stringify(replayed)).toBe(JSON.stringify(original));
  });

  it('replays a curated instance and rejects a tampered identity', () => {
    const original = resolved(curatedInstance());
    const envelope = createReplayEnvelope(original);
    expect(envelope.contentIdentity.reconstruction.kind).toBe('curated');
    const replayed = replayEpisode(JSON.parse(JSON.stringify(envelope)));
    expect(JSON.stringify(replayed)).toBe(JSON.stringify(original));

    const tampered = structuredClone(envelope);
    tampered.contentIdentity.reconstruction.fixtureId = 'unknown-fixture';
    expect(() => replayEpisode(tampered)).toThrow(/unknown curated replay fixture identity/);
  });
});
