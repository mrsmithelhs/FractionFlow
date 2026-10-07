import { describe, expect, it } from 'vitest';
import {
  applyIntent,
  computeBeatSchedule,
  createEpisode,
  createReplayEnvelope,
  episodeStateSnapshot,
  EpisodeConstructionError,
  EpisodeIntentError,
  LEGACY_PHASE2_REFLECTION_EPISODE_DEFINITION,
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
    expect(state.beatSchedule.map((entry) => entry.id)).toEqual([
      'encounter', 'notice', 'decide', 'transform-left', 'transform-right', 'operate', 'resolve',
    ]);
    expect(Object.isFrozen(state.beatSchedule)).toBe(true);
    expect(Object.isFrozen(state.beatSchedule[0])).toBe(true);
    expect(JSON.stringify(state)).not.toContain('BigInt');
    expect(() => JSON.stringify(state)).not.toThrow();
  });

  it('derives frozen schedules for both, one, and no renaming without registering new families', () => {
    const instance = canonicalInstance();
    const scheduleIds = (left, right) => computeBeatSchedule({
      ...instance,
      classification: {
        ...instance.classification,
        transformations: {
          ...instance.classification.transformations,
          canonicalRenaming: { left, right, targetDenominator: '12' },
        },
      },
    }, PHASE2_REFLECTION_EPISODE_DEFINITION).map((entry) => entry.id);

    expect(scheduleIds(true, true)).toEqual([
      'encounter', 'notice', 'decide', 'transform-left', 'transform-right', 'operate', 'resolve', 'reflect',
    ]);
    expect(scheduleIds(true, false)).toEqual([
      'encounter', 'notice', 'decide', 'transform-left', 'operate', 'resolve', 'reflect',
    ]);
    expect(scheduleIds(false, true)).toEqual([
      'encounter', 'notice', 'decide', 'transform-right', 'operate', 'resolve', 'reflect',
    ]);
    expect(scheduleIds(false, false)).toEqual([
      'encounter', 'notice', 'operate', 'resolve', 'reflect',
    ]);
    const noReflection = computeBeatSchedule(instance, PHASE2_EPISODE_DEFINITION);
    expect(noReflection.at(-1).id).toBe('resolve');
    expect(Object.isFrozen(noReflection)).toBe(true);
    expect(Object.isFrozen(noReflection[0])).toBe(true);
  });

  it('rejects unsupported operations while retaining add and subtract schedule derivation', () => {
    const instance = canonicalInstance();
    const expectedIds = [
      'encounter', 'notice', 'decide', 'transform-left', 'transform-right', 'operate', 'resolve', 'reflect',
    ];

    for (const operation of ['add', 'subtract']) {
      const supportedInstance = {
        ...instance,
        request: { ...instance.request, operation },
      };
      expect(computeBeatSchedule(supportedInstance, PHASE2_REFLECTION_EPISODE_DEFINITION)
        .map((entry) => entry.id)).toEqual(expectedIds);
    }

    for (const operation of ['bogus', 'multiply', '', ' ', undefined, null, 3, {}]) {
      const unsupportedInstance = {
        ...instance,
        request: { ...instance.request, operation },
      };
      let error;
      try {
        computeBeatSchedule(unsupportedInstance, PHASE2_REFLECTION_EPISODE_DEFINITION);
      } catch (caught) {
        error = caught;
      }
      expect(error).toMatchObject({ code: 'INVALID_BEAT_SCHEDULE_INPUT' });
    }
  });

  it('keeps the construction-time schedule reference unchanged across learner actions', () => {
    let state = createEpisode({ instance: canonicalInstance() });
    const schedule = state.beatSchedule;
    state = applyIntent(state, { type: 'acknowledge-encounter' });
    expect(state.beatSchedule).toBe(schedule);
    state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
    expect(state.beatSchedule).toBe(schedule);
    state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(5) });
    expect(state.beatSchedule).toBe(schedule);
    state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(12) });
    expect(state.beatSchedule).toBe(schedule);
    state = applyIntent(state, { type: 'request-help' });
    expect(state.beatSchedule).toBe(schedule);
    state = applyIntent(state, { type: 'request-replay' });
    expect(state.beatSchedule).toBe(schedule);
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(8, 12) });
    expect(state.beatSchedule).toBe(schedule);
    expect(state.schedulePosition).toBe(4);
    expect(state.expectedResponse.target).toBe('right');
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(3, 12) });
    expect(state.beatSchedule).toBe(schedule);
    expect(state.schedulePosition).toBe(5);
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

  it('keeps valid but unavailable denominator paths at the decide boundary', () => {
    let state = atDecide();
    state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(36) });
    expect(state.status).toBe('active');
    expect(state.beat).toBe('decide');
    expect(state.established.commonDenominator).toBeNull();
    expect(state.lastRecovery.classification).toMatchObject({
      kind: 'valid-but-unavailable-task-path',
      validity: 'valid',
      mathClassification: 'valid-non-least',
      targetDenominator: '36',
      pathClassification: {
        kind: 'valid-but-outside-representation-capability',
        validity: 'valid',
        rendering: 'ineligible',
        authoredCoverage: 'outside-authored-coverage',
      },
      taskPathClosure: {
        available: false,
        reason: 'outside-representation-capability',
      },
      continuation: 'local-recovery',
    });
    expect(state.responseProvenance.at(-1).classification.validity).toBe('valid');

    state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(12) });
    expect(state.beat).toBe('transform');
    expect(state.established.commonDenominator.targetDenominator).toBe('12');
  });

  it('replays pinned revision 1 with its original unsupported-unit transition', () => {
    let state = createEpisode({
      instance: canonicalInstance(),
      episodeDefinition: LEGACY_PHASE2_REFLECTION_EPISODE_DEFINITION,
    });
    state = applyIntent(state, { type: 'acknowledge-encounter' });
    state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
    state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(36) });
    expect(state.episodeDefinition.revision).toBe('1');
    expect(state.beat).toBe('transform');
    expect(state.established.commonDenominator.targetDenominator).toBe('36');
    expect(replayEpisode(JSON.parse(JSON.stringify(createReplayEnvelope(state)))))
      .toEqual(state);
  });

  it('detects removal of the new admission guard with the legacy 36 route as a failing-first seed', () => {
    let state = createEpisode({
      instance: canonicalInstance(),
      episodeDefinition: LEGACY_PHASE2_REFLECTION_EPISODE_DEFINITION,
    });
    state = applyIntent(state, { type: 'acknowledge-encounter' });
    state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
    state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(36) });

    const assertApprovedBoundary = () => expect(state).toMatchObject({
      beat: 'decide',
      established: { commonDenominator: null },
      lastRecovery: { classification: { kind: 'valid-but-unavailable-task-path' } },
    });
    expect(() => assertApprovedBoundary()).toThrow();
    expect(state).toMatchObject({
      beat: 'transform',
      established: {
        commonDenominator: {
          validity: 'valid',
          rendering: 'ineligible',
          authoredCoverage: 'outside-authored-coverage',
        },
      },
    });
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
    const exactCopy = structuredClone(PHASE2_EPISODE_DEFINITION);
    const compatible = createEpisode({ instance: canonicalInstance(), episodeDefinition: exactCopy });
    expect(compatible.episodeDefinition).toEqual(PHASE2_EPISODE_DEFINITION);
    expect(compatible.episodeDefinition.beats).toEqual(PHASE2_EPISODE_DEFINITION.beats);

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
    state = applyIntent(state, { type: 'submit-reflection', response: 'match-a' });
    expect(state.status).toBe('resolved');
    expect(state.beat).toBe('reflect');
    expect(state.established.reflection).toEqual({ response: 'match-a' });

    const replayed = replayEpisode(JSON.parse(JSON.stringify(createReplayEnvelope(state))));
    expect(JSON.stringify(replayed)).toBe(JSON.stringify(state));
  });
});
