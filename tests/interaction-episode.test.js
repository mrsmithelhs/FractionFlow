import { describe, expect, it } from 'vitest';
import {
  applyIntent,
  createEpisode,
  createReplayEnvelope,
  episodeStateSnapshot,
  EpisodeConstructionError,
  EpisodeIntentError,
  PHASE2_EPISODE_DEFINITION,
  PHASE2_REFLECTION_EPISODE_DEFINITION,
  replayEpisode,
} from '../src/interaction/index.js';
import { buildCuratedProblem, validateCuratedFixtures } from '../src/content/index.js';

function whole(value) {
  return { kind: 'fraction', numerator: String(value), denominator: '1' };
}

function fraction(numerator, denominator) {
  return { kind: 'fraction', numerator: String(numerator), denominator: String(denominator) };
}

function canonicalInstance() {
  return validateCuratedFixtures().find((entry) => (
    entry.fixture.id === 'curated-relatively-prime-addition-non-least'
  )).instance;
}

function atDecide(instance = canonicalInstance()) {
  let state = createEpisode({ instance });
  state = applyIntent(state, { type: 'acknowledge-encounter' });
  state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
  return state;
}

function canonicalResolved(instance = canonicalInstance()) {
  let state = atDecide(instance);
  state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(12) });
  state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(8, 12) });
  state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(3, 12) });
  state = applyIntent(state, { type: 'submit-operation-result', proposed: fraction(11, 12) });
  state = applyIntent(state, { type: 'submit-resolution', proposed: fraction(11, 12) });
  return state;
}

function ineligibleBaseInstance() {
  const fixture = {
    id: 'plan05-interaction-ineligible-base',
    authoringRevision: 'plan05-test-v1',
    profileId: 'curated-review',
    selector: 'relatively-prime-addition',
    overlays: [],
    left: { kind: 'fraction', numerator: '1', denominator: '7' },
    right: { kind: 'fraction', numerator: '1', denominator: '12' },
  };
  return buildCuratedProblem({
    fixture,
    selector: fixture.selector,
    overlays: fixture.overlays,
    profileId: fixture.profileId,
    candidate: { left: fixture.left, right: fixture.right },
  });
}

describe('Plan 05 instructional episode', () => {
  it('retains the full validated content record and uses explicit beats', () => {
    const state = createEpisode({ instance: canonicalInstance() });
    expect(state.status).toBe('active');
    expect(state.beat).toBe('encounter');
    expect(state.expectedResponse.promptId).toBe('phase2.encounter');
    expect(state.content.canonicalPath).toBeDefined();
    expect(state.content.alternatePaths).toHaveLength(1);
    expect(state.content.resultState).toBeDefined();
    expect(JSON.stringify(state)).not.toContain('BigInt');
    expect(() => JSON.stringify(state)).not.toThrow();
  });

  it('recovers locally from invalid work and preserves earlier progress', () => {
    let state = atDecide();
    state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(5) });
    expect(state.status).toBe('active');
    expect(state.beat).toBe('decide');
    expect(state.established.notice.relationship).toBe('relatively-prime');
    expect(state.established.commonDenominator).toBeNull();
    expect(state.lastRecovery.classification.kind).toBe('invalid-common-denominator');
    expect(state.responseProvenance.at(-1).classification.kind).toBe('invalid-common-denominator');
  });

  it('covers the five required response classes through delegated validators', () => {
    let state = atDecide();
    state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(5) });
    expect(state.lastRecovery.classification.kind).toBe('invalid-common-denominator');

    state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(12) });
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(1, 12) });
    expect(state.lastRecovery.classification.kind).toBe('incorrect-equivalent-numerator');

    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(2, 12) });
    expect(state.lastRecovery.classification.kind).toBe('denominator-changed-without-numerator');

    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(8, 12) });
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(3, 12) });
    state = applyIntent(state, { type: 'submit-operation-result', proposed: fraction(10, 12) });
    expect(state.lastRecovery.classification.kind).toBe('incorrect-numerator-arithmetic');

    let alternate = atDecide();
    alternate = applyIntent(alternate, { type: 'propose-common-denominator', proposed: whole(24) });
    alternate = applyIntent(alternate, { type: 'submit-equivalent-form', proposed: fraction(16, 24) });
    alternate = applyIntent(alternate, { type: 'submit-equivalent-form', proposed: fraction(6, 24) });
    alternate = applyIntent(alternate, { type: 'submit-operation-result', proposed: fraction(22, 24) });
    expect(alternate.established.operation.kind).toBe('correct-unsimplified');
    expect(alternate.status).toBe('active');
    expect(alternate.beat).toBe('resolve');
  });

  it('distinguishes a valid but visually ineligible proposed path from base construction', () => {
    let state = atDecide();
    state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(36) });
    expect(state.status).toBe('active');
    expect(state.established.commonDenominator.kind).toBe('valid-but-outside-representation-capability');
    expect(state.established.route).toBe('symbolic-continuation');
  });

  it('rejects invalid construction and keeps continue outside the reducer', () => {
    const forged = structuredClone(canonicalInstance());
    delete forged.representationFacts.eligibility;
    expect(() => createEpisode({ instance: forged })).toThrowError(EpisodeConstructionError);
    const deferred = structuredClone(canonicalInstance());
    deferred.representationFacts.eligibility.fractionBar = 'deferred';
    expect(() => createEpisode({ instance: deferred })).toThrowError(EpisodeConstructionError);
    expect(() => createEpisode({ instance: ineligibleBaseInstance() })).toThrowError(
      expect.objectContaining({ code: 'INELIGIBLE_BASE_REPRESENTATION' }),
    );
    const state = createEpisode({ instance: canonicalInstance() });
    expect(() => applyIntent(state, { type: 'continue' })).toThrowError(EpisodeIntentError);
  });

  it('accepts only registered episode-definition semantics and canonical wire values', () => {
    const alteredPrompt = structuredClone(PHASE2_EPISODE_DEFINITION);
    alteredPrompt.promptIdentities.encounter = 'tampered.encounter';
    expect(() => createEpisode({ instance: canonicalInstance(), episodeDefinition: alteredPrompt }))
      .toThrowError(expect.objectContaining({ code: 'INVALID_EPISODE_DEFINITION' }));

    const missingPrompt = structuredClone(PHASE2_EPISODE_DEFINITION);
    delete missingPrompt.promptIdentities.notice;
    expect(() => createEpisode({ instance: canonicalInstance(), episodeDefinition: missingPrompt }))
      .toThrowError(expect.objectContaining({ code: 'INVALID_EPISODE_DEFINITION' }));

    const sameIdentityReflection = {
      ...PHASE2_EPISODE_DEFINITION,
      includeReflection: true,
    };
    expect(() => createEpisode({ instance: canonicalInstance(), episodeDefinition: sameIdentityReflection }))
      .toThrowError(expect.objectContaining({ code: 'INVALID_EPISODE_DEFINITION' }));

    const nonWirePrompt = structuredClone(PHASE2_EPISODE_DEFINITION);
    nonWirePrompt.promptIdentities.encounter = undefined;
    expect(() => createEpisode({ instance: canonicalInstance(), episodeDefinition: nonWirePrompt }))
      .toThrowError(expect.objectContaining({ code: 'INVALID_EPISODE_DEFINITION' }));
  });

  it('rejects beat-specific intents outside the active instructional beat', () => {
    const state = createEpisode({ instance: canonicalInstance() });
    const outOfOrderIntents = [
      { type: 'submit-notice', matchesUnits: false },
      { type: 'propose-common-denominator', proposed: whole(12) },
      { type: 'submit-equivalent-form', proposed: fraction(8, 12) },
      { type: 'submit-operation-result', proposed: fraction(11, 12) },
      { type: 'submit-resolution', proposed: fraction(11, 12) },
      { type: 'submit-reflection', response: 'same-quantity-different-form' },
    ];
    for (const intent of outOfOrderIntents) {
      expect(() => applyIntent(state, intent)).toThrowError(
        expect.objectContaining({ code: 'UNEXPECTED_INTENT' }),
      );
    }
    expect(state.beat).toBe('encounter');
    expect(state.completedBeats).toEqual([]);
  });

  it('rejects non-canonical intent wire values and preserves JSON round-trip state', () => {
    const state = createEpisode({ instance: canonicalInstance() });
    expect(() => applyIntent(state, { type: 'acknowledge-encounter', diagnostic: NaN })).toThrowError(
      expect.objectContaining({ code: 'NON_JSON_INTENT' }),
    );
    expect(() => applyIntent(state, { type: 'acknowledge-encounter', optional: undefined })).toThrowError(
      expect.objectContaining({ code: 'NON_JSON_INTENT' }),
    );
    const next = applyIntent(state, { type: 'acknowledge-encounter' });
    expect(JSON.parse(JSON.stringify(next))).toEqual(next);
  });

  it('resolves only through the final instructional beat and records completion context', () => {
    const state = canonicalResolved();
    expect(state.status).toBe('resolved');
    expect(state.beat).toBe('resolve');
    expect(state.expectedResponse).toBeNull();
    expect(state.completedBeats.map((entry) => entry.beat)).toEqual([
      'encounter',
      'notice',
      'decide',
      'transform',
      'operate',
      'resolve',
    ]);
    expect(state.established.resolution.proposed).toEqual(fraction(11, 12));
    expect(episodeStateSnapshot(state).resolution.proposed).toEqual(fraction(11, 12));
    expect(state.responseProvenance.at(-1).resultingState.established.resolution.proposed)
      .toEqual(fraction(11, 12));
    expect(() => applyIntent(state, { type: 'request-help' })).toThrowError(EpisodeIntentError);
  });

  it('supports the selective reflection beat without making it mandatory', () => {
    const definition = PHASE2_REFLECTION_EPISODE_DEFINITION;
    let state = createEpisode({ instance: canonicalInstance(), episodeDefinition: definition });
    state = applyIntent(state, { type: 'acknowledge-encounter' });
    state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
    state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(12) });
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(8, 12) });
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(3, 12) });
    state = applyIntent(state, { type: 'submit-operation-result', proposed: fraction(11, 12) });
    state = applyIntent(state, { type: 'submit-resolution', proposed: fraction(11, 12) });
    expect(state.status).toBe('active');
    expect(state.beat).toBe('reflect');
    state = applyIntent(state, { type: 'submit-reflection', response: 'same-quantity-different-form' });
    expect(state.status).toBe('resolved');
    expect(state.beat).toBe('reflect');
    expect(state.established.reflection).toEqual({ response: 'same-quantity-different-form' });

    const replayed = replayEpisode(JSON.parse(JSON.stringify(createReplayEnvelope(state))));
    expect(JSON.stringify(replayed)).toBe(JSON.stringify(state));
  });
});
