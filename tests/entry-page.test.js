import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createFractionFlowApp } from '../src/app/app.js';
import { PRACTICE_TYPES } from '../src/app/practice-types.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

describe('Plan 12 entry page', () => {
  let document;
  let root;
  let app;

  beforeEach(() => {
    document = setupMockDOM();
    root = document.createElement('div');
    document.body.appendChild(root);
    app = createFractionFlowApp({ root, presentationMode: 'instant-test' });
    app.mount();
  });

  afterEach(() => {
    app.destroy();
    teardownMockDOM();
  });

  it('opens on a restrained entry page with one runnable registry button and keyboard-reachable gear', () => {
    expect(root.querySelector('.app-entry-title').textContent).toBe('FractionFlow');
    expect(root.querySelector('.app-entry-line').textContent)
      .toBe('See how different-sized fraction parts fit together.');
    expect(PRACTICE_TYPES).toHaveLength(1);
    expect(root.querySelectorAll('.app-practice-button')).toHaveLength(1);
    expect(root.querySelector('.app-practice-button').textContent)
      .toBe('Add fractions with different denominators');
    expect(root.querySelector('.app-practice-button').disabled).toBe(false);
    expect(root.querySelector('.app-creator-credit').textContent).toBe('Created by an educator');
    expect(root.querySelector('.app-episode').hasAttribute('hidden')).toBe(true);
    expect(root.querySelector('.app-display-menu').hasAttribute('hidden')).toBe(true);
    expect(root.querySelector('.app-entry-page .app-gear-button')).not.toBeNull();
  });

  it('begins the registered episode and returns focus to the entry page on return', () => {
    root.querySelector('.app-practice-button').click();
    expect(app.getState().beat).toBe('encounter');
    expect(document.activeElement).toBe(root.querySelector('.app-episode'));
    expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(true);
    expect(root.querySelector('.app-episode .app-gear-button')).toBeNull();

    app.dispatch({ type: 'acknowledge-encounter' });
    const freshAfterRetry = root.querySelector('.app-restart-button');
    expect(freshAfterRetry.textContent).toBe('Try this problem again');
    freshAfterRetry.click();
    expect(app.getState().beat).toBe('encounter');

    root.querySelector('.app-return-button').click();
    expect(app.getState().beat).toBe('encounter');
    expect(app.getState().revision).toBe(0);
    expect(document.activeElement).toBe(root.querySelector('.app-entry-title'));
  });

  it('selects a complete support profile on the entry gear and writes it into a fresh episode', () => {
    root.querySelector('.app-gear-button').click();
    expect(root.querySelectorAll('.app-display-options .app-display-option')).toHaveLength(4);
    expect(root.querySelectorAll('.app-support-options .app-display-option')).toHaveLength(2);
    expect(root.querySelector('[data-support-id="high-support"]').getAttribute('aria-pressed')).toBe('true');
    root.querySelector('[data-support-id="medium-support"]').click();
    expect(document.activeElement).toBe(root.querySelector('.app-gear-button'));
    root.querySelector('.app-practice-button').click();

    expect(app.getState().support).toEqual({
      label: 'medium support',
      dimensions: {
        fractionBarModel: 'medium support',
        commonDenominator: 'medium support',
        equivalentNumerators: 'high support',
        prediction: 'high support',
        symbolicIntegration: 'high support',
        helpAndReplay: 'high support',
      },
    });
    expect(app.getReplayEnvelope().support).toEqual(app.getState().support);
    expect(root.querySelector('.fractionflow-app').getAttribute('data-support-level')).toBe('medium-support');
  });

  it('retains the selected profile on retry and applies an entry-page change on return and re-entry', () => {
    root.querySelector('.app-gear-button').click();
    root.querySelector('[data-support-id="medium-support"]').click();
    root.querySelector('.app-practice-button').click();
    app.dispatch({ type: 'acknowledge-encounter' });
    root.querySelector('.app-restart-button').click();
    expect(app.getState().support.label).toBe('medium support');

    root.querySelector('.app-return-button').click();
    root.querySelector('.app-gear-button').click();
    root.querySelector('[data-support-id="high-support"]').click();
    root.querySelector('.app-practice-button').click();
    expect(app.getState().support.label).toBe('high support');
    expect(app.getState().revision).toBe(0);
  });

  it('makes the medium denominator path numeric and preserves recovery before correction', () => {
    root.querySelector('.app-gear-button').click();
    root.querySelector('[data-condition-id="phase2-bundle-4"]').click();
    root.querySelector('.app-gear-button').click();
    root.querySelector('[data-support-id="medium-support"]').click();
    root.querySelector('.app-practice-button').click();
    root.querySelector('.app-visual-view .control-btn').click();
    root.querySelectorAll('.app-visual-view .control-choice-btn')[1].click();

    const denominator = root.querySelector('.app-visual-view input.control-numeric-input');
    expect(denominator).not.toBeNull();
    denominator.value = '11';
    root.querySelector('.app-visual-view .control-submit-btn').click();
    expect(root.querySelector('.app-visual-view .recovery-feedback')).not.toBeNull();
    expect(app.getState().beat).toBe('decide');

    const correctedDenominator = root.querySelector('.app-visual-view input.control-numeric-input');
    correctedDenominator.value = '12';
    root.querySelector('.app-visual-view .control-submit-btn').click();
    expect(app.getState().beat).toBe('transform');
    expect(app.getState().established.commonDenominator.targetDenominator).toBe('12');
  });

  it.each(['retry', 'return and re-enter'])(
    '%s discards complete state after recovery, help, replay, established work, and unsubmitted input',
    (resetIntent) => {
      root.querySelector('.app-practice-button').click();
      const freshInitialState = app.getState();

      app.dispatch({ type: 'acknowledge-encounter' });
      app.dispatch({ type: 'submit-notice', matchesUnits: true });
      expect(app.getState().retryHistory).toHaveLength(1);

      app.dispatch({ type: 'request-help' });
      expect(app.getState().helpHistory).toHaveLength(1);

      app.dispatch({ type: 'submit-notice', matchesUnits: false });
      app.dispatch({ type: 'propose-common-denominator', proposed: {
        kind: 'fraction', numerator: '12', denominator: '1',
      } });
      app.dispatch({ type: 'submit-equivalent-form', proposed: {
        kind: 'fraction', numerator: '8', denominator: '12',
      } });
      expect(app.getState().established.lastConversion.form).toEqual({
        kind: 'fraction', numerator: '8', denominator: '12',
      });

      app.dispatch({ type: 'request-replay' });
      expect(app.getState().replayHistory).toHaveLength(1);
      const unsubmitted = root.querySelector('.app-visual-view input.control-numeric-input');
      expect(unsubmitted).not.toBeNull();
      unsubmitted.value = '9';
      expect(unsubmitted.value).toBe('9');

      if (resetIntent === 'retry') {
        root.querySelector('.app-restart-button').click();
      } else {
        root.querySelector('.app-return-button').click();
        root.querySelector('.app-practice-button').click();
      }

      expect(app.getState()).toEqual(freshInitialState);
      expect(app.getState().retryHistory).toEqual([]);
      expect(app.getState().helpHistory).toEqual([]);
      expect(app.getState().replayHistory).toEqual([]);
      expect(app.getState().established.lastConversion).toBeUndefined();
      expect(root.querySelector('.app-visual-view input.control-numeric-input')).toBeNull();
      expect(root.querySelector('.app-support-controls .app-restart-button').textContent)
        .toBe('Try this problem again');
    },
  );
});
