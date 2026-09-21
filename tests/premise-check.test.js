import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import {
  createEpisode,
  applyIntent,
  createReplayEnvelope,
  replayEpisode,
  projectScene,
  PHASE2_REFLECTION_EPISODE_DEFINITION,
} from '../src/interaction/index.js';
import { validateCuratedFixtures } from '../src/content/index.js';
import { createBeatContainer } from '../src/render/beat-container.js';
import { createLinearPathRenderer } from '../src/render/linear-path.js';
import { STRINGS } from '../src/render/strings.js';

function whole(value) {
  return { kind: 'fraction', numerator: String(value), denominator: '1' };
}

function fraction(numerator, denominator) {
  return {
    kind: 'fraction',
    numerator: String(numerator),
    denominator: String(denominator),
  };
}

function canonicalInstance() {
  return validateCuratedFixtures().find((entry) => (
    entry.fixture.id === 'curated-relatively-prime-addition-non-least'
  )).instance;
}

const PREMISE_CONDITION = Object.freeze({
  id: 'phase2-bundle-4',
  revision: '1',
  display: 'D-01-A',
  choreography: 'D-02-M',
  promptCadence: 'D-05-focused-key-beats',
  connectionMaking: 'CM-01-P',
});

function advanceToReflect(targetDenominator = 12) {
  let state = createEpisode({
    instance: canonicalInstance(),
    episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION,
    activeCondition: PREMISE_CONDITION,
  });

  state = applyIntent(state, { type: 'acknowledge-encounter' });
  state = applyIntent(state, { type: 'submit-notice', matchesUnits: false });
  state = applyIntent(state, {
    type: 'propose-common-denominator',
    proposed: whole(targetDenominator),
  });

  if (targetDenominator === 12) {
    state = applyIntent(state, {
      type: 'submit-equivalent-form',
      proposed: fraction(8, 12),
    });
    state = applyIntent(state, {
      type: 'submit-equivalent-form',
      proposed: fraction(3, 12),
    });
    state = applyIntent(state, {
      type: 'submit-operation-result',
      proposed: fraction(11, 12),
    });
    state = applyIntent(state, {
      type: 'submit-resolution',
      proposed: fraction(11, 12),
    });
  } else if (targetDenominator === 24) {
    state = applyIntent(state, {
      type: 'submit-equivalent-form',
      proposed: fraction(16, 24),
    });
    state = applyIntent(state, {
      type: 'submit-equivalent-form',
      proposed: fraction(6, 24),
    });
    state = applyIntent(state, {
      type: 'submit-operation-result',
      proposed: fraction(22, 24),
    });
    state = applyIntent(state, {
      type: 'submit-resolution',
      proposed: fraction(22, 24),
    });
  }

  return state;
}

describe('Premise Check (CM-01-P, Repair 05 Item 1)', () => {
  let doc;

  beforeEach(() => {
    doc = setupMockDOM();
  });

  afterEach(() => {
    teardownMockDOM();
  });

  // Failure Mode 1: Answering reassuring way on false case produces recovery rather than completion
  it('failure mode 1: answering reassuringly ("yes") on a false premise case produces recovery rather than completion', () => {
    const atReflect = advanceToReflect(12);
    expect(atReflect.beat).toBe('reflect');

    // On denominator 12, the premise check presents 7/12 for 2/3 (isEquivalent: false, expectedResponse: 'no').
    // Answering 'yes' is the reassuring answer, but factually false.
    const result = applyIntent(atReflect, {
      type: 'submit-reflection',
      response: 'yes',
    });

    // Must NOT be resolved!
    expect(result.status).toBe('active');
    expect(result.lastRecovery).not.toBeNull();
    expect(result.lastRecovery.classification.kind).toBe('incorrect-reflection');
    expect(result.established.reflection).toBeNull();
  });

  // Failure Mode 2: Answering correctly completes
  it('failure mode 2: answering correctly completes the episode on both false and true cases', () => {
    // False case (denominator 12): expected answer is 'no'
    const atReflect12 = advanceToReflect(12);
    const completed12 = applyIntent(atReflect12, {
      type: 'submit-reflection',
      response: 'no',
    });
    expect(completed12.status).toBe('resolved');
    expect(completed12.established.reflection).toEqual({
      premiseCaseId: 'premise-rel-prime-12',
      response: 'no',
      expected: 'no',
    });

    // True case (denominator 24): expected answer is 'yes'
    const atReflect24 = advanceToReflect(24);
    const completed24 = applyIntent(atReflect24, {
      type: 'submit-reflection',
      response: 'yes',
    });
    expect(completed24.status).toBe('resolved');
    expect(completed24.established.reflection).toEqual({
      premiseCaseId: 'premise-rel-prime-24',
      response: 'yes',
      expected: 'yes',
    });
  });

  // Failure Mode 3: The question's referents are mounted
  it('failure mode 3: visual models for starting fraction and new parts are mounted on screen', () => {
    const atReflect = advanceToReflect(12);
    const scene = projectScene({
      state: atReflect,
      representationRole: 'fraction-bar',
      presentationMode: 'standard-motion',
    });

    const container = doc.createElement('div');
    const beatContainer = createBeatContainer({ container, dispatchAction: () => {} });
    beatContainer.mount(scene);

    // Prompt and framing
    expect(container.textContent).toContain('Check this renaming:');
    expect(container.textContent).toContain('Does this new bar show the same amount as before?');

    // Both referent fraction bars must be on screen!
    expect(container.textContent).toContain('Starting fraction: 2/3');
    expect(container.textContent).toContain('New parts: 7/12');

    // Shaded segments for referents
    const comparison = container.querySelector('.premise-comparison');
    expect(comparison).toBeTruthy();
  });

  // Failure Mode 4: The replay envelope names the case
  it('failure mode 4: the replay envelope records and reconstructs the premise case id', () => {
    const atReflect = advanceToReflect(12);
    const completed = applyIntent(atReflect, {
      type: 'submit-reflection',
      response: 'no',
    });

    expect(completed.established.reflection?.premiseCaseId).toBe('premise-rel-prime-12');

    const envelope = createReplayEnvelope(completed);
    const replayed = replayEpisode(envelope);

    expect(replayed.status).toBe('resolved');
    expect(replayed.established.reflection).toEqual({
      premiseCaseId: 'premise-rel-prime-12',
      response: 'no',
      expected: 'no',
    });
  });
});
