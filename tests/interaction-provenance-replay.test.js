import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  applyIntent,
  createEpisode,
  createReplayEnvelope,
  replayEpisode,
} from '../src/interaction/index.js';
import { PHASE2_REFLECTION_EPISODE_DEFINITION } from '../src/interaction/episode-definition.js';
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

function legacyScheduleProjection(value) {
  if (Array.isArray(value)) return value.map(legacyScheduleProjection);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !['beatSchedule', 'schedulePosition', 'scheduleEntryId'].includes(key))
    .map(([key, entry]) => [key, legacyScheduleProjection(entry)]));
}

describe('Plan 05 provenance and replay', () => {
  it('round-trips complete high and medium support profiles through replay v1', () => {
    const profiles = [
      {
        label: 'high support',
        dimensions: {
          fractionBarModel: 'high support',
          commonDenominator: 'high support',
          equivalentNumerators: 'high support',
          prediction: 'high support',
          symbolicIntegration: 'high support',
          helpAndReplay: 'high support',
        },
      },
      {
        label: 'medium support',
        dimensions: {
          fractionBarModel: 'medium support',
          commonDenominator: 'medium support',
          equivalentNumerators: 'high support',
          prediction: 'high support',
          symbolicIntegration: 'high support',
          helpAndReplay: 'high support',
        },
      },
    ];

    for (const support of profiles) {
      let state = createEpisode({
        instance: curatedInstance(),
        episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION,
        activeCondition: {
          id: 'phase2-bundle-4',
          revision: '1',
          display: 'D-01-A',
          choreography: 'D-02-M',
          promptCadence: 'D-05-focused-key-beats',
          connectionMaking: 'CM-01-P',
        },
        support,
      });
      state = applyIntent(state, { type: 'acknowledge-encounter' });
      state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
      state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(12) });
      state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(8, 12) });
      state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(3, 12) });
      state = applyIntent(state, { type: 'submit-operation-result', proposed: fraction(11, 12) });
      state = applyIntent(state, { type: 'submit-resolution', proposed: fraction(11, 12) });
      state = applyIntent(state, { type: 'submit-reflection', response: 'no' });
      const envelope = createReplayEnvelope(state);
      expect(envelope.schemaVersion).toBe('fractionflow.episode-replay/v1');
      expect(envelope.support).toEqual(support);
      expect(JSON.stringify(replayEpisode(JSON.parse(JSON.stringify(envelope)))))
        .toBe(JSON.stringify(state));
    }
  });

  it('reconstructs the b654487 envelope and state oracles under the approved narrow projection', () => {
    const oracle = JSON.parse(readFileSync(
      new URL('./fixtures/plan-16-legacy-replay-oracle.json', import.meta.url),
      'utf8',
    ));
    expect(oracle.oracleCommit).toBe('b65448794cd4c4577b1ad20683e63acafe5a5d38');
    expect(oracle.fixtures).toHaveLength(23);

    for (const fixture of oracle.fixtures) {
      const replayed = replayEpisode(JSON.parse(JSON.stringify(fixture.envelope)));
      expect(legacyScheduleProjection(replayed), fixture.name).toEqual(fixture.expectedState);
      expect(fixture.envelope.schemaVersion).toBe('fractionflow.episode-replay/v1');
      expect(fixture.envelope.episodeDefinition).toEqual(fixture.episodeDefinition);
      const currentRoundTrip = replayEpisode(JSON.parse(JSON.stringify(createReplayEnvelope(replayed))));
      expect(JSON.stringify(currentRoundTrip), `${fixture.name} current replay`).toBe(JSON.stringify(replayed));
    }
  });

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
    expect(state.responseProvenance.at(-1)).toMatchObject({
      schedulePosition: 3,
      scheduleEntryId: 'transform-left',
    });
  });

  it('retains demonstration support across an incorrect retry', () => {
    let state = createEpisode({ instance: curatedInstance() });
    state = applyIntent(state, { type: 'acknowledge-encounter' });
    state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
    state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(12) });
    state = applyIntent(state, { type: 'request-help' });
    state = applyIntent(state, { type: 'request-help' });
    state = applyIntent(state, { type: 'request-help' });
    state = applyIntent(state, { type: 'request-help' });
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(1, 12) });
    expect(state.nextResponseSupport).toBe('demonstrate');
    state = applyIntent(state, { type: 'submit-equivalent-form', proposed: fraction(8, 12) });
    expect(state.responseProvenance.at(-1).evidenceCategory).toBe('supported-construction');
    expect(state.responseProvenance.at(-1).visibility.supplied).toContain('reviewed-demonstration');
    expect(state.established.lastConversion.supportOrigin).toBe('demonstrate');
    const replayed = replayEpisode(JSON.parse(JSON.stringify(createReplayEnvelope(state))));
    expect(JSON.stringify(replayed)).toBe(JSON.stringify(state));
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

    for (const mutate of [
      (identity) => { identity.reconstruction.profileId = 'curated-review'; },
      (identity) => { identity.reconstruction.request.operation = 'subtract'; },
      (identity) => { identity.reconstruction.request.profileVersion = 'forged'; },
    ]) {
      const tampered = JSON.parse(JSON.stringify(envelope));
      mutate(tampered.contentIdentity);
      expect(() => replayEpisode(tampered)).toThrow(/reconstruction identity|content identity|profile/);
    }
  });

  it('replays a curated instance and rejects a tampered identity', () => {
    const original = resolved(curatedInstance());
    const envelope = createReplayEnvelope(original);
    expect(envelope.contentIdentity.reconstruction.kind).toBe('curated');
    const replayed = replayEpisode(JSON.parse(JSON.stringify(envelope)));
    expect(JSON.stringify(replayed)).toBe(JSON.stringify(original));

    const tampered = JSON.parse(JSON.stringify(envelope));
    tampered.contentIdentity.reconstruction.fixtureId = 'unknown-fixture';
    expect(() => replayEpisode(tampered)).toThrow(/unknown curated replay fixture identity/);
  });

  it('rejects out-of-order replay intents before constructing an impossible episode', () => {
    const envelope = createReplayEnvelope(createEpisode({ instance: curatedInstance() }));
    const tampered = JSON.parse(JSON.stringify(envelope));
    tampered.learnerIntents = [{ type: 'submit-notice', matchesUnits: false }];
    expect(() => replayEpisode(tampered)).toThrow(/not valid at beat encounter/);
  });
});
