import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const reflectionFault = vi.hoisted(() => ({ current: null }));

vi.mock('../src/content/data/reflection-choices.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    reflectionChoicesForInstance(instance, denominator) {
      const choices = actual.reflectionChoicesForInstance(instance, denominator);
      if (reflectionFault.current && instance.provenance.fixtureId
        === 'curated-relatively-prime-addition-one-half-one-third') {
        return reflectionFault.current(choices);
      }
      return choices;
    },
  };
});
import {
  validateCuratedFixtures,
  validateAuthoredTaskData,
  validateAuthoredPremiseCase,
  validateAuthoredMatchingChoices,
} from '../src/content/index.js';
import { premiseCheckForInstance } from '../src/content/data/premise-checks.js';
import { reflectionChoicesForInstance } from '../src/content/data/reflection-choices.js';
import { applyIntent, createEpisode } from '../src/interaction/episode.js';
import { createReplayEnvelope, replayEpisode } from '../src/interaction/replay.js';
import { createFractionFlowApp } from '../src/app/app.js';
import { PRACTICE_TYPES } from '../src/app/practice-types.js';
import { REGISTERED_CONDITIONS } from '../src/app/conditions.js';
import { PHASE2_REFLECTION_EPISODE_DEFINITION } from '../src/interaction/episode-definition.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

function fraction(numerator, denominator) {
  return { kind: 'fraction', numerator: String(numerator), denominator: String(denominator) };
}

function secondInstance() {
  return validateCuratedFixtures().find((entry) => (
    entry.fixture.id === 'curated-relatively-prime-addition-one-half-one-third'
  )).instance;
}

function completeEpisodeToReflection(app, targetDenominator) {
  const state = app.getState();
  const content = state.content;
  const left = content.operands.left.initialForm;
  const right = content.operands.right.initialForm;
  const leftNumerator = BigInt(left.numerator) * BigInt(targetDenominator) / BigInt(left.denominator);
  const rightNumerator = BigInt(right.numerator) * BigInt(targetDenominator) / BigInt(right.denominator);
  const resultNumerator = leftNumerator + rightNumerator;

  app.dispatch({ type: 'acknowledge-encounter' });
  app.dispatch({ type: 'submit-notice', matchesUnits: false });
  app.dispatch({ type: 'propose-common-denominator', proposed: fraction(targetDenominator, 1) });
  app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(leftNumerator, targetDenominator) });
  app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(rightNumerator, targetDenominator) });
  app.dispatch({ type: 'submit-operation-result', proposed: fraction(resultNumerator, targetDenominator) });
  app.dispatch({ type: 'submit-resolution', proposed: fraction(resultNumerator, targetDenominator) });
  expect(app.getState().beat).toBe('reflect');
}

function finishCurrentEpisode(app, targetDenominator) {
  completeEpisodeToReflection(app, targetDenominator);
  const state = app.getState();
  const response = state.activeCondition.connectionMaking === 'CM-01-P'
    ? premiseCheckForInstance(state.content, targetDenominator).expectedResponse
    : (state.content.provenance.fixtureId === 'curated-relatively-prime-addition-one-half-one-third'
      ? 'match-b'
      : 'match-a');
  app.dispatch({ type: 'submit-reflection', response });
  expect(app.getState().status).toBe('resolved');
}

function completeSecondInstance(instance, targetDenominator, activeCondition) {
  let state = createEpisode({
    instance,
    episodeDefinition: PHASE2_REFLECTION_EPISODE_DEFINITION,
    activeCondition,
  });
  const left = instance.operands.left.initialForm;
  const right = instance.operands.right.initialForm;
  const leftNumerator = BigInt(left.numerator) * BigInt(targetDenominator) / BigInt(left.denominator);
  const rightNumerator = BigInt(right.numerator) * BigInt(targetDenominator) / BigInt(right.denominator);
  const resultNumerator = leftNumerator + rightNumerator;
  const steps = [
    { type: 'acknowledge-encounter' },
    { type: 'submit-notice', matchesUnits: false },
    { type: 'propose-common-denominator', proposed: fraction(targetDenominator, 1) },
    { type: 'submit-equivalent-form', proposed: fraction(leftNumerator, targetDenominator) },
    { type: 'submit-equivalent-form', proposed: fraction(rightNumerator, targetDenominator) },
    { type: 'submit-operation-result', proposed: fraction(resultNumerator, targetDenominator) },
    { type: 'submit-resolution', proposed: fraction(resultNumerator, targetDenominator) },
  ];
  for (const step of steps) state = applyIntent(state, step);
  const response = activeCondition.connectionMaking === 'CM-01-P'
    ? premiseCheckForInstance(instance, targetDenominator).expectedResponse
    : 'match-b';
  return applyIntent(state, { type: 'submit-reflection', response });
}

describe('Plan 26 vetted addition practice set', () => {
  let document;
  let root;
  let app;

  beforeEach(() => {
    document = setupMockDOM();
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    reflectionFault.current = null;
    app?.destroy();
    teardownMockDOM();
  });

  it('admits the second fixture and truth-checks complete task data for targets 6 and 12', () => {
    const instance = secondInstance();
    expect(instance.resultState.canonicalRawResultForm).toEqual(fraction(5, 6));
    expect(instance.resultState.exactResult).toEqual(fraction(5, 6));
    expect(instance.canonicalPath.targetDenominator).toBe('6');
    expect(instance.alternatePaths.map((path) => path.targetDenominator)).toEqual(['12']);
    expect(instance.canonicalPath.scaleFactors).toEqual({ left: '3', right: '2' });
    expect(instance.alternatePaths[0].scaleFactors).toEqual({ left: '6', right: '4' });
    expect(validateAuthoredTaskData(instance, ['6', '12'])).toBe(true);

    expect(premiseCheckForInstance(instance, '6')).toMatchObject({
      id: 'premise-half-third-6', isEquivalent: false, expectedResponse: 'no',
    });
    expect(premiseCheckForInstance(instance, '12')).toMatchObject({
      id: 'premise-half-third-12', isEquivalent: true, expectedResponse: 'yes',
    });
    expect(reflectionChoicesForInstance(instance, '6').map((choice) => choice.id))
      .toEqual(['match-a', 'match-b', 'match-c']);
    expect(reflectionChoicesForInstance(instance, '12').map((choice) => choice.id))
      .toEqual(['match-a', 'match-b', 'match-c']);

    const premise = premiseCheckForInstance(instance, '6');
    expect(() => validateAuthoredPremiseCase(instance, {
      ...premise,
      expectedResponse: 'yes',
    }, '6')).toThrow(/premise truth mismatch/);
    const choices = reflectionChoicesForInstance(instance, '6');
    expect(() => validateAuthoredMatchingChoices(instance.operands.left.initialForm, [
      choices[0],
      { ...choices[1], form: fraction(4, 6) },
      choices[2],
    ], '6')).toThrow(/exactly one equivalent form/);

    expect(() => validateAuthoredMatchingChoices(
      instance.operands.left.initialForm,
      choices.slice(0, 2),
      '6',
    )).toThrow(/at least three/);
    expect(() => validateAuthoredMatchingChoices(instance.operands.left.initialForm, [
      choices[0], choices[1], { ...choices[2], form: fraction(7, 6) },
    ], '6')).toThrow(/presentation range/);

    for (const invalidForm of [
      fraction(-1, 6),
      fraction(Number.MAX_SAFE_INTEGER + 1, 6),
      fraction(1.5, 6),
      fraction(1, 0),
      fraction(1, Number.MAX_SAFE_INTEGER + 1),
    ]) {
      const targetDenominator = String(invalidForm.denominator);
      expect(() => validateAuthoredMatchingChoices(instance.operands.left.initialForm, [
        ...choices.slice(0, 2).map((choice) => ({
          ...choice,
          form: { ...choice.form, denominator: targetDenominator },
        })),
        { ...choices[2], form: invalidForm },
      ], targetDenominator)).toThrow(/presentation range/);
    }

    for (const [source, boundaryChoice] of [
      [fraction(0, 1), fraction(0, 6)],
      [fraction(1, 1), fraction(6, 6)],
    ]) {
      expect(validateAuthoredMatchingChoices(source, [
        { id: 'boundary', form: boundaryChoice },
        { id: 'other-a', form: fraction(1, 6) },
        { id: 'other-b', form: fraction(2, 6) },
      ], '6')).toBe(true);
    }
  });

  it('refuses missing routes and mismatched, missing, or unknown authored revisions', () => {
    const instance = secondInstance();
    const withRevision = (authoringRevision) => ({
      ...instance,
      provenance: { ...instance.provenance, authoringRevision },
    });
    for (const invalid of [withRevision('plan03-fixtures-v1'), withRevision('unknown-v9'), {
      ...instance,
      provenance: { fixtureId: instance.provenance.fixtureId },
    }]) {
      expect(premiseCheckForInstance(invalid, '6')).toBeNull();
      expect(reflectionChoicesForInstance(invalid, '6')).toBeNull();
    }
    expect(premiseCheckForInstance(instance, '24')).toBeNull();
    expect(reflectionChoicesForInstance(instance, '24')).toBeNull();
  });

  it.each(['6', '12'])('reconstructs the second item through replay at denominator %s for matching and premise conditions', (target) => {
    const instance = secondInstance();
    for (const condition of [REGISTERED_CONDITIONS[0], REGISTERED_CONDITIONS[3]]) {
      const completed = completeSecondInstance(instance, target, condition.activeCondition);
      expect(completed.status).toBe('resolved');
      const replayed = replayEpisode(createReplayEnvelope(completed));
      expect(replayed).toEqual(completed);
      expect(replayed.content.provenance).toMatchObject({
        fixtureId: 'curated-relatively-prime-addition-one-half-one-third',
        authoringRevision: 'plan26-fixtures-v1',
      });
    }
  });

  it('uses mounted Next, Retry, return, and re-entry controls with fresh item state and retained settings/view', () => {
    app = createFractionFlowApp({
      root,
      initialConditionId: 'phase2-bundle-4',
      presentationMode: 'instant-test',
    });
    app.mount();
    root.querySelector('.app-gear-button').click();
    root.querySelector('[data-support-id="medium-support"]').click();
    root.querySelector('.app-practice-button').click();
    root.querySelector('.app-view-toggle').click();
    expect(app.getState().content.provenance.fixtureId)
      .toBe('curated-relatively-prime-addition-non-least');

    const firstState = app.getState();
    finishCurrentEpisode(app, 12);
    expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(false);
    root.querySelector('.app-next-button').click();

    const secondState = app.getState();
    expect(secondState).toEqual(createEpisode({
      instance: secondInstance(),
      episodeDefinition: firstState.episodeDefinition,
      activeCondition: firstState.activeCondition,
      support: firstState.support,
    }));
    expect(secondState.status).toBe('active');
    expect(secondState.revision).toBe(0);
    expect(secondState.content.provenance.fixtureId)
      .toBe('curated-relatively-prime-addition-one-half-one-third');
    expect(secondState.content.operands.left.initialForm).toEqual(fraction(1, 2));
    expect(secondState.content.operands.right.initialForm).toEqual(fraction(1, 3));
    expect(document.activeElement).toBe(root.querySelector('.app-episode'));
    expect(root.querySelector('.app-linear-view').hasAttribute('hidden')).toBe(false);
    expect(secondState.activeCondition.id).toBe('phase2-bundle-4');
    expect(secondState.support.label).toBe('medium support');
    expect(app.getReplayEnvelope().contentIdentity.reconstruction.fixtureId)
      .toBe('curated-relatively-prime-addition-one-half-one-third');

    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: true });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    app.dispatch({ type: 'propose-common-denominator', proposed: fraction(6, 1) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(3, 6) });
    expect(app.getState().established.conversions.left).not.toBeNull();
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(3, 6) });
    expect(app.getState().lastRecovery?.classification?.kind).toBe('incorrect-equivalent-numerator');
    root.querySelector('.app-linear-view .active-beat-controls .app-secondary-button').click();
    const multiplierDraft = root.querySelector('#linear-transform-help-multiplier-right');
    expect(multiplierDraft).not.toBeNull();
    multiplierDraft.value = '2';
    multiplierDraft.focus();
    app.dispatch({ type: 'request-replay' });
    const replayButton = [...root.querySelectorAll('.app-secondary-button')]
      .find((button) => button.textContent === 'Replay the last change');
    expect(replayButton.getAttribute('aria-pressed')).toBe('true');
    app.dispatch({ type: 'request-replay' });
    expect(app.getState().supportHistory.some((entry) => entry.type === 'task-help-request')).toBe(true);
    root.querySelector('.app-view-toggle').dispatchEvent({ type: 'pointerdown' });
    const expectedFresh = createEpisode({
      instance: secondState.content,
      episodeDefinition: secondState.episodeDefinition,
      activeCondition: secondState.activeCondition,
      support: secondState.support,
    });
    root.querySelector('.app-restart-button').click();
    expect(app.getState()).toEqual(expectedFresh);
    expect(document.activeElement).toBe(root.querySelector('.app-episode'));
    expect(root.querySelector('#linear-transform-help-multiplier-right')).toBeNull();
    const resetReplayButton = [...root.querySelectorAll('.app-secondary-button')]
      .find((button) => button.textContent === 'Replay the last change');
    expect(resetReplayButton.getAttribute('aria-pressed')).toBe('false');
    expect(root.querySelector('.app-navigation-notice').hasAttribute('hidden')).toBe(true);
    expect(root.querySelector('.app-linear-view').hasAttribute('hidden')).toBe(false);

    root.querySelector('.app-return-button').click();
    expect(document.activeElement).toBe(root.querySelector('.app-entry-title'));
    root.querySelector('.app-practice-button').click();
    expect(app.getState()).toEqual(createEpisode({
      instance: firstState.content,
      episodeDefinition: firstState.episodeDefinition,
      activeCondition: firstState.activeCondition,
      support: firstState.support,
    }));
    expect(app.getState().content.operands).toEqual(firstState.content.operands);
    expect(root.querySelector('.app-episode').textContent).toContain('Look at these two fractions.');
    expect(root.querySelectorAll('input.control-numeric-input')).toHaveLength(0);
    expect(root.querySelectorAll('.recovery-feedback')).toHaveLength(0);
    expect(root.querySelector('#linear-transform-help-multiplier-right')).toBeNull();
    expect([...root.querySelectorAll('.app-secondary-button')]
      .find((button) => button.textContent === 'Replay the last change')
      .getAttribute('aria-pressed')).toBe('false');
    expect(document.activeElement).toBe(root.querySelector('.app-episode'));
    expect(app.getState().content.provenance.fixtureId)
      .toBe('curated-relatively-prime-addition-non-least');
    expect(app.getState().revision).toBe(0);
    expect(app.getState().support.label).toBe('medium support');
    expect(app.getState().activeCondition.id).toBe('phase2-bundle-4');
    expect(root.querySelector('.app-linear-view').hasAttribute('hidden')).toBe(false);
  });

  it('focuses exhaustion only on final completion and keeps return available without a Next control', () => {
    app = createFractionFlowApp({ root, presentationMode: 'instant-test' });
    app.mount();
    root.querySelector('.app-practice-button').click();
    finishCurrentEpisode(app, 12);
    root.querySelector('.app-next-button').click();
    finishCurrentEpisode(app, 6);

    const notice = root.querySelector('.app-navigation-notice');
    expect(notice.textContent).toBe('You’ve tried both problems.');
    expect(notice.hasAttribute('hidden')).toBe(false);
    expect(document.activeElement).toBe(notice);
    const viewToggle = root.querySelector('.app-view-toggle');
    viewToggle.focus();
    app.update();
    expect(document.activeElement).toBe(viewToggle);
    expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(true);
    expect(root.querySelector('.app-return-button').disabled).toBe(false);
    expect(root.textContent.match(/You’ve tried both problems\./g)).toHaveLength(1);
  });

  it('keeps a supplied test instance outside the vetted set while Retry rebuilds that same instance', () => {
    const instance = secondInstance();
    app = createFractionFlowApp({ root, instance, presentationMode: 'instant-test' });
    app.mount();
    root.querySelector('.app-practice-button').click();
    finishCurrentEpisode(app, 6);

    expect(app.getState().status).toBe('resolved');
    expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(true);
    expect(root.textContent).not.toContain('You’ve tried both problems.');

    root.querySelector('.app-restart-button').click();
    expect(app.getState()).toEqual(createEpisode({
      instance,
      episodeDefinition: PRACTICE_TYPES[0].episodeDefinition,
      activeCondition: REGISTERED_CONDITIONS[0].activeCondition,
    }));
    expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(true);
  });

  it('refuses a corrupt next item transactionally and preserves the completed item and recovery controls', () => {
    const practiceType = PRACTICE_TYPES[0];
    const brokenType = {
      ...practiceType,
      items: Object.freeze([
        practiceType.items[0],
        Object.freeze({
          ...practiceType.items[1],
          fixtureId: 'missing-fixture',
        }),
      ]),
    };
    app = createFractionFlowApp({
      root,
      practiceTypes: [brokenType],
      presentationMode: 'instant-test',
    });
    app.mount();
    root.querySelector('.app-practice-button').click();
    finishCurrentEpisode(app, 12);
    const knownComplete = app.getState();
    const knownReplay = app.getReplayEnvelope();
    root.querySelector('.app-next-button').click();

    expect(app.getState()).toBe(knownComplete);
    expect(app.getReplayEnvelope()).toEqual(knownReplay);
    expect(app.getState().content.provenance.fixtureId)
      .toBe('curated-relatively-prime-addition-non-least');
    expect(root.querySelector('.app-navigation-notice').textContent)
      .toBe('This problem is not ready. Try again or go back to start.');
    expect(document.activeElement).toBe(root.querySelector('.app-navigation-notice'));
    expect(root.querySelector('.app-next-button').disabled).toBe(false);
    expect(root.querySelector('.app-restart-button').disabled).toBe(false);
    expect(root.querySelector('.app-return-button').disabled).toBe(false);
  });

  it.each([
    ['two choices', (choices) => choices.slice(0, 2)],
    ['an out-of-whole distractor', (choices) => [
      choices[0], choices[1], { ...choices[2], form: fraction(7, 6) },
    ]],
  ])('refuses a second-item matching-data fault (%s) before mounted Next replaces completed work', (_label, corrupt) => {
    app = createFractionFlowApp({ root, presentationMode: 'instant-test' });
    app.mount();
    root.querySelector('.app-practice-button').click();
    finishCurrentEpisode(app, 12);

    const knownComplete = app.getState();
    const knownReplay = app.getReplayEnvelope();
    reflectionFault.current = corrupt;
    root.querySelector('.app-next-button').click();

    expect(app.getState()).toBe(knownComplete);
    expect(app.getState().status).toBe('resolved');
    expect(app.getReplayEnvelope()).toEqual(knownReplay);
    expect(app.getState().content.provenance.fixtureId)
      .toBe('curated-relatively-prime-addition-non-least');
    const notice = root.querySelector('.app-navigation-notice');
    expect(notice.textContent)
      .toBe('This problem is not ready. Try again or go back to start.');
    expect(document.activeElement).toBe(notice);
    expect(root.querySelector('.app-restart-button').disabled).toBe(false);
    expect(root.querySelector('.app-return-button').disabled).toBe(false);

    reflectionFault.current = null;
    root.querySelector('.app-next-button').click();
    expect(app.getState().content.provenance.fixtureId)
      .toBe('curated-relatively-prime-addition-one-half-one-third');
    expect(app.getState().status).toBe('active');
    expect(document.activeElement).toBe(root.querySelector('.app-episode'));
  });
});
