import { describe, expect, it } from 'vitest';
import { validateCuratedFixtures } from '../src/content/index.js';
import {
  applyIntent,
  createEpisode,
  createReplayEnvelope,
  getEpisodeDefinition,
  projectScene,
  replayEpisode,
} from '../src/interaction/index.js';

function whole(value) {
  return { kind: 'fraction', numerator: String(value), denominator: '1' };
}

function fraction(numerator, denominator) {
  return { kind: 'fraction', numerator: String(numerator), denominator: String(denominator) };
}

function instance() {
  return validateCuratedFixtures().find((entry) => (
    entry.fixture.id === 'curated-relatively-prime-addition-non-least'
  )).instance;
}

function atTransform(definition = getEpisodeDefinition(), denominator = 24) {
  let state = createEpisode({ instance: instance(), episodeDefinition: definition });
  state = applyIntent(state, { type: 'acknowledge-encounter' });
  state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
  state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(denominator) });
  return state;
}

describe('Plan 25 requested equivalent-fraction task help', () => {
  it('registers revision 3 as fresh for both existing definitions and rejects helper intents on revision 2', () => {
    expect(getEpisodeDefinition().revision).toBe('3');
    expect(getEpisodeDefinition('phase-2-unlike-proper-addition-reflection').revision).toBe('3');
    const old = atTransform(getEpisodeDefinition('phase-2-unlike-proper-addition', '2'));
    expect(() => applyIntent(old, { type: 'request-task-help' })).toThrow(/revision 3/);
    expect(() => applyIntent(old, {
      type: 'submit-transform-help-multiplier',
      proposed: whole(8),
    })).toThrow(/revision 3/);
  });

  it('keeps request state scoped and idempotent, accepts a learner multiplier, and withholds its answer numerator', () => {
    let state = atTransform();
    expect(() => applyIntent(state, {
      type: 'submit-transform-help-multiplier',
      proposed: whole(8),
    })).toThrow(/requested/);
    state = applyIntent(state, { type: 'request-task-help' });
    const once = state;
    state = applyIntent(state, { type: 'request-task-help' });
    expect(state).toBe(once);
    expect(state.helpHistory).toHaveLength(0);
    expect(state.nextResponseSupport).toBe(null);

    const wrong = applyIntent(state, {
      type: 'submit-transform-help-multiplier',
      proposed: whole(7),
    });
    expect(wrong.supportHistory.at(-1)).toMatchObject({
      type: 'transform-help-multiplier',
      classification: 'incorrect',
      proposed: whole(7),
    });
    const wrongScene = projectScene({ state: wrong, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(wrongScene.meaning.taskHelp).toMatchObject({ kind: 'equivalent-fraction', status: 'incorrect', side: 'left' });
    expect(wrongScene.meaning.taskHelp).not.toHaveProperty('expectedMultiplier');
    expect(wrongScene.meaning.taskHelp.acceptedMultiplier).toBe(null);
    expect(JSON.stringify(wrongScene)).not.toContain('16/24');

    state = applyIntent(wrong, {
      type: 'submit-transform-help-multiplier',
      proposed: whole(8),
    });
    const scene = projectScene({ state, representationRole: 'fraction-bar', presentationMode: 'instant-test' });
    expect(scene.meaning.taskHelp).toMatchObject({
      kind: 'equivalent-fraction', status: 'accepted', side: 'left', acceptedMultiplier: '8',
    });
    expect(JSON.stringify(scene)).not.toContain('16/24');
    expect(() => applyIntent(state, {
      type: 'submit-transform-help-multiplier',
      proposed: whole(8),
    })).toThrow(/already accepted/);
    expect(replayEpisode(createReplayEnvelope(state))).toEqual(state);
  });

  it('does not let repeated denominator cue requests escalate to a demonstration', () => {
    let state = createEpisode({ instance: instance() });
    state = applyIntent(state, { type: 'acknowledge-encounter' });
    state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
    for (let index = 0; index < 4; index += 1) {
      state = applyIntent(state, { type: 'request-task-help' });
    }
    expect(state.supportHistory.filter((entry) => entry.type === 'task-help-request')).toHaveLength(1);
    expect(state.helpHistory).toHaveLength(0);
    expect(state.nextResponseSupport).toBe(null);
    state = applyIntent(state, { type: 'propose-common-denominator', proposed: whole(24) });
    state = applyIntent(state, { type: 'request-task-help' });
    const response = applyIntent(state, {
      type: 'submit-transform-help-multiplier',
      proposed: whole(8),
    });
    const provenanceState = applyIntent(response, {
      type: 'submit-equivalent-form',
      proposed: fraction(16, 24),
    });
    expect(provenanceState.responseProvenance.at(-1).visibility.supplied).toEqual([]);
    expect(provenanceState.responseProvenance.at(-1).evidenceCategory).toBe('supported-construction');
  });

  it('classifies both operands from live operands at the authored twelfths and twenty-fourths targets', () => {
    for (const [denominator, leftFactor, rightFactor, leftNumerator, rightNumerator] of [
      [12, 4, 3, 8, 3],
      [24, 8, 6, 16, 6],
    ]) {
      let state = atTransform(getEpisodeDefinition(), denominator);
      for (const [side, factor, numerator] of [
        ['left', leftFactor, leftNumerator],
        ['right', rightFactor, rightNumerator],
      ]) {
        expect(state.expectedResponse.target).toBe(side);
        state = applyIntent(state, { type: 'request-task-help' });
        state = applyIntent(state, {
          type: 'submit-transform-help-multiplier',
          proposed: whole(factor),
        });
        expect(state.supportHistory.at(-1)).toMatchObject({
          side,
          classification: 'accepted',
          proposed: whole(factor),
        });
        state = applyIntent(state, {
          type: 'submit-equivalent-form',
          proposed: fraction(numerator, denominator),
        });
      }
    }
  });

  it('fails malformed multiplier wire values without changing reducer state and keeps rev2 closure', () => {
    const state = applyIntent(atTransform(), { type: 'request-task-help' });
    expect(() => applyIntent(state, {
      type: 'submit-transform-help-multiplier',
      proposed: { kind: 'fraction', numerator: '2.5', denominator: '1' },
    })).toThrow();
    expect(state.supportHistory.at(-1).type).toBe('task-help-request');
    for (const denominator of [36, 72]) {
      const old = atTransform(getEpisodeDefinition('phase-2-unlike-proper-addition', '2'), denominator);
      expect(old.beat).toBe('decide');
      expect(old.lastRecovery.classification.kind).toBe('valid-but-unavailable-task-path');
    }
    const rev3 = createEpisode({
      instance: instance(),
      episodeDefinition: getEpisodeDefinition(),
    });
    let state3 = applyIntent(rev3, { type: 'acknowledge-encounter' });
    state3 = applyIntent(state3, { type: 'submit-notice', matchesUnits: false });
    for (const denominator of [36, 72]) {
      const closed = applyIntent(state3, { type: 'propose-common-denominator', proposed: whole(denominator) });
      expect(closed.beat).toBe('decide');
      expect(closed.lastRecovery.classification.kind).toBe('valid-but-unavailable-task-path');
    }
  });
});
