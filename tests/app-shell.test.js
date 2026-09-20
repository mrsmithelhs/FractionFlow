import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createFractionFlowApp } from '../src/app/app.js';
import { REGISTERED_CONDITIONS } from '../src/app/conditions.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

function whole(value) {
  return { kind: 'fraction', numerator: String(value), denominator: '1' };
}

function fraction(numerator, denominator) {
  return { kind: 'fraction', numerator: String(numerator), denominator: String(denominator) };
}

describe('Plan 09 app shell and upstream display switcher', () => {
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
    delete globalThis.matchMedia;
    teardownMockDOM();
  });

  it('mounts one calm episode with visual and linear access paths', () => {
    expect(root.querySelector('h1').textContent).toBe('FractionFlow');
    expect(root.querySelector('.app-header')).toBe(null);
    expect(root.querySelector('.app-introduction')).toBe(null);
    expect(root.querySelector('.app-display-status')).toBe(null);
    expect(root.querySelector('.fractionflow-app').children[0].tagName).toBe('MAIN');
    expect(root.querySelector('.fractionflow-app').children.at(-1).tagName).toBe('FOOTER');
    expect(root.textContent).toContain('Look at these two fractions.');
    expect(root.querySelector('.app-linear-view').hasAttribute('hidden')).toBe(true);
    expect(root.querySelector('.app-visual-view').hasAttribute('hidden')).toBe(false);
    expect(root.querySelector('.app-display-menu').hasAttribute('hidden')).toBe(true);
    expect(root.querySelectorAll('[aria-live="polite"]').length).toBe(1);
    expect(root.textContent).not.toContain('11/12');
    expect(root.textContent).not.toContain('D-02');
  });

  it('switches registered display styles upstream without resetting learner work or persisting', () => {
    const encounterButton = root.querySelector('.app-visual-view .control-btn');
    encounterButton.click();
    root.querySelectorAll('.app-visual-view .control-choice-btn')[1].click();

    const before = app.getState();
    expect(before.beat).toBe('decide');
    expect(before.established.notice.relationship).toBe('relatively-prime');

    root.querySelector('.app-gear-button').click();
    const second = root.querySelector('[data-condition-id="phase2-bundle-2"]');
    expect(second.getAttribute('data-choreography-code')).toBe('D-02-J');
    second.click();

    const after = app.getState();
    expect(after.activeCondition).toEqual(REGISTERED_CONDITIONS[1].activeCondition);
    expect(after.revision).toBe(before.revision);
    expect(after.established).toEqual(before.established);
    expect(app.getReplayEnvelope().activeCondition).toEqual(after.activeCondition);
    expect(root.textContent).toContain('Now showing Compare before and after.');
    expect(root.textContent).not.toContain('D-02-J');
    expect(root.querySelector('.app-gear-button')._isFocused).toBe(true);
  });

  it('keeps help secondary and records a help request without revealing the answer', () => {
    root.querySelector('.app-support-panel .app-secondary-button').click();
    expect(app.getState().helpHistory).toHaveLength(1);
    expect(root.textContent).toContain('Look at the parts in each bar.');
    expect(root.querySelector('.active-beat-help').textContent)
      .toBe(root.querySelector('.app-support-notice').textContent);
    expect(root.querySelector('.app-support-notice').classList.contains('sr-only')).toBe(true);
    expect(root.textContent).not.toContain('11/12');
  });

  it('lets the same composed episode reach reflection and completion', () => {
    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    app.dispatch({ type: 'propose-common-denominator', proposed: whole(12) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(8, 12) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(3, 12) });
    app.dispatch({ type: 'submit-operation-result', proposed: fraction(11, 12) });
    expect(app.getState().beat).toBe('resolve');
    app.dispatch({ type: 'submit-resolution', proposed: fraction(11, 12) });
    expect(app.getState().beat).toBe('reflect');
    expect(root.textContent).toContain('same amount');
    expect(root.querySelectorAll('.matching-choice-btn')).toHaveLength(3);
    expect(root.querySelectorAll('.matching-choice-bar')).toHaveLength(3);
    expect(root.querySelector('.control-legend').classList.contains('sr-only')).toBe(true);
    root.querySelectorAll('.app-visual-view .matching-choice-btn')[1].click();
    expect(app.getState().status).toBe('active');
    expect(app.getState().lastRecovery.classification.kind).toBe('incorrect-reflection');
    expect(root.querySelector('.app-visual-view .recovery-feedback').textContent)
      .toContain('different shaded amount');

    root.querySelector('.app-view-controls .app-secondary-button').click();
    root.querySelectorAll('.app-linear-view .control-choice-btn')[1].click();
    expect(app.getState().status).toBe('active');
    expect(root.querySelector('.app-linear-view .recovery-feedback').textContent).toContain('fraction');
    expect(root.querySelector('.app-linear-view .recovery-feedback').textContent).not.toContain('bar');
    root.querySelectorAll('.app-linear-view .control-choice-btn')[0].click();

    expect(app.getState().status).toBe('resolved');
    expect(root.textContent).toContain('You finished this problem.');
    expect(root.querySelector('.app-linear-view').textContent.match(/You finished this problem\./g))
      .toHaveLength(1);
    expect(root.querySelector('.app-completion-panel').hasAttribute('hidden')).toBe(false);
  });

  it('serves the authored reflection set for the established twenty-fourths route', () => {
    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    app.dispatch({ type: 'propose-common-denominator', proposed: whole(24) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(16, 24) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(6, 24) });
    app.dispatch({ type: 'submit-operation-result', proposed: fraction(22, 24) });
    app.dispatch({ type: 'submit-resolution', proposed: fraction(22, 24) });

    expect(app.getState().beat).toBe('reflect');
    expect([...root.querySelectorAll('.matching-choice-btn')]
      .map((choice) => choice.getAttribute('aria-label')))
      .toEqual([
        'Bar with 16 of 24 equal parts shaded',
        'Bar with 15 of 24 equal parts shaded',
        'Bar with 17 of 24 equal parts shaded',
      ]);

    root.querySelectorAll('.matching-choice-btn')[1].click();
    expect(app.getState().status).toBe('active');
    root.querySelectorAll('.matching-choice-btn')[0].click();
    expect(app.getState().status).toBe('resolved');
  });

  it('can switch to the linear access path without changing the episode state', () => {
    const before = app.getState();
    root.querySelector('.app-view-controls .app-secondary-button').click();
    expect(root.querySelector('.app-visual-view').hasAttribute('hidden')).toBe(true);
    expect(root.querySelector('.app-linear-view').hasAttribute('hidden')).toBe(false);
    expect(root.textContent).toContain('Problem: 2/3 + 1/4');
    expect(app.getState()).toBe(before);
  });

  it('routes automatic reduced-motion preference changes without changing learner state', () => {
    app.destroy();

    let changeListener;
    let removedListener;
    const motionQuery = {
      matches: false,
      addEventListener(type, listener) {
        expect(type).toBe('change');
        changeListener = listener;
      },
      removeEventListener(type, listener) {
        expect(type).toBe('change');
        removedListener = listener;
      },
    };
    globalThis.matchMedia = (query) => {
      expect(query).toBe('(prefers-reduced-motion: reduce)');
      return motionQuery;
    };

    app = createFractionFlowApp({ root, presentationMode: 'auto' });
    app.mount();
    expect(root.querySelector('.fraction-bar-track.reduced-motion')).toBe(null);

    const before = app.getState();
    motionQuery.matches = true;
    changeListener({ matches: true });

    expect(root.querySelector('.fraction-bar-track.reduced-motion')).toBeTruthy();
    expect(app.getState()).toBe(before);

    app.destroy();
    expect(removedListener).toBe(changeListener);
  });
});
