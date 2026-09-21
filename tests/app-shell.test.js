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
    expect(root.textContent).toContain('Common denominator: 12 — the smallest one.');
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
    expect(root.textContent).toContain('Common denominator: 24 — both fractions can use it.');
    expect([...root.querySelectorAll('.matching-choice-btn')]
      .map((choice) => choice.getAttribute('aria-label')))
      .toEqual([
        'Bar with 15 of 24 equal parts shaded',
        'Bar with 16 of 24 equal parts shaded',
        'Bar with 17 of 24 equal parts shaded',
      ]);

    root.querySelectorAll('.matching-choice-btn')[0].click();
    expect(app.getState().status).toBe('active');
    root.querySelectorAll('.matching-choice-btn')[1].click();
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

  it('dismisses the display choices menu on Escape key and click-outside, returning focus on Escape', () => {
    const gearBtn = root.querySelector('.app-gear-button');
    const menu = root.querySelector('.app-display-menu');

    // Initially closed
    expect(menu.hasAttribute('hidden')).toBe(true);
    expect(gearBtn.getAttribute('aria-expanded')).toBe('false');

    // Open menu
    gearBtn.click();
    expect(menu.hasAttribute('hidden')).toBe(false);
    expect(gearBtn.getAttribute('aria-expanded')).toBe('true');

    // Dismiss with Escape inside menu
    const escapeEvent = { key: 'Escape', stopPropagation: () => {} };
    for (const listener of menu._eventListeners.get('keydown') || []) {
      listener(escapeEvent);
    }
    expect(menu.hasAttribute('hidden')).toBe(true);
    expect(gearBtn.getAttribute('aria-expanded')).toBe('false');
    expect(gearBtn._isFocused).toBe(true);

    // Reopen menu
    gearBtn.click();
    expect(menu.hasAttribute('hidden')).toBe(false);

    // Dismiss by clicking outside
    const outsideEvent = { target: document.body };
    for (const listener of document._eventListeners.get('click') || []) {
      listener(outsideEvent);
    }
    expect(menu.hasAttribute('hidden')).toBe(true);
    expect(gearBtn.getAttribute('aria-expanded')).toBe('false');
  });

  it('produces visibly and structurally distinct output for each condition during transform beat', () => {
    // Advance to transform beat with left converted
    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    app.dispatch({ type: 'propose-common-denominator', proposed: whole(12) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(8, 12) });

    const visualView = root.querySelector('.app-visual-view');

    // Default: phase2-bundle-1 (in-place)
    const inPlaceHtml = visualView.innerHTML;
    expect(visualView.querySelector('.choreography-juxtaposed')).toBe(null);
    expect(visualView.querySelector('.choreography-sequential')).toBe(null);
    expect(visualView.querySelectorAll('.fraction-bar-segment.subdivided').length).toBeGreaterThan(0);

    // Switch to phase2-bundle-2 (juxtaposed)
    root.querySelector('.app-gear-button').click();
    root.querySelector('[data-condition-id="phase2-bundle-2"]').click();

    const juxtaposedHtml = visualView.innerHTML;
    expect(juxtaposedHtml).not.toBe(inPlaceHtml);
    expect(visualView.querySelector('.choreography-juxtaposed')).toBeTruthy();
    expect(visualView.querySelector('.fraction-bar-juxtaposed')).toBeTruthy();
    expect(visualView.querySelector('.fraction-bar-row-before')).toBeTruthy();
    expect(visualView.querySelector('.fraction-bar-row-after')).toBeTruthy();
    expect(visualView.textContent).toContain('Before: 2/3');
    expect(visualView.textContent).toContain('After: 8/12');

    // Switch to phase2-bundle-3 (sequential)
    root.querySelector('.app-gear-button').click();
    root.querySelector('[data-condition-id="phase2-bundle-3"]').click();

    const sequentialHtml = visualView.innerHTML;
    expect(sequentialHtml).not.toBe(inPlaceHtml);
    expect(sequentialHtml).not.toBe(juxtaposedHtml);
    expect(visualView.querySelector('.choreography-sequential')).toBeTruthy();
    expect(visualView.querySelector('.fraction-bar-sequential')).toBeTruthy();
    expect(visualView.querySelector('.fraction-bar-step-1')).toBeTruthy();
    expect(visualView.querySelector('.fraction-bar-step-2')).toBeTruthy();
    expect(visualView.querySelector('.fraction-bar-step-connector')).toBeTruthy();
    expect(visualView.textContent).toContain('Step 1: Start with 2/3');
    expect(visualView.textContent).toContain('Split into 12 parts');
    expect(visualView.textContent).toContain('Step 2: New parts 8/12');
  });

  it('registers phase2-bundle-4 and reaches the premise check in the app shell', () => {
    expect(REGISTERED_CONDITIONS.some((c) => c.activeCondition.connectionMaking === 'CM-01-P'))
      .toBe(true);

    root.querySelector('.app-gear-button').click();
    const bundle4 = root.querySelector('[data-condition-id="phase2-bundle-4"]');
    expect(bundle4).not.toBeNull();
    expect(bundle4.getAttribute('data-connection-code')).toBe('CM-01-P');
    bundle4.click();

    expect(app.getState().activeCondition.connectionMaking).toBe('CM-01-P');

    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    app.dispatch({ type: 'propose-common-denominator', proposed: whole(12) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(8, 12) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(3, 12) });
    app.dispatch({ type: 'submit-operation-result', proposed: fraction(11, 12) });
    app.dispatch({ type: 'submit-resolution', proposed: fraction(11, 12) });

    expect(app.getState().beat).toBe('reflect');
    // Premise check is presented: framing and referents
    expect(root.querySelector('.app-visual-view').textContent)
      .toContain('Check this renaming:');
    expect(root.querySelector('.app-visual-view').textContent)
      .toContain('Does this new bar show the same amount as before?');
    expect(root.querySelector('.app-visual-view .premise-comparison')).toBeTruthy();

    // Denominator 12 has false premise (7/12 for 2/3). Answering 'yes' triggers recovery!
    const choiceButtons = root.querySelectorAll('.app-visual-view .control-choice-btn');
    const yesBtn = Array.from(choiceButtons).find((b) => b.textContent.includes('Yes'));
    const noBtn = Array.from(choiceButtons).find((b) => b.textContent.includes('No'));
    expect(yesBtn).toBeTruthy();
    expect(noBtn).toBeTruthy();

    yesBtn.click();
    expect(app.getState().status).toBe('active');
    expect(app.getState().lastRecovery.classification.kind).toBe('incorrect-reflection');
    expect(root.querySelector('.app-visual-view .recovery-feedback').textContent)
      .toContain('Look closely: the shaded length became longer');

    // Answering correctly ('no') completes the episode!
    noBtn.click();
    expect(app.getState().status).toBe('resolved');
    expect(app.getState().established.reflection.premiseCaseId).toBe('premise-rel-prime-12');
  });

  it('makes replay real across in-place, juxtaposed, and sequential conditions (Repair 06 Item 1)', () => {
    const replayButton = Array.from(root.querySelectorAll('.app-secondary-button'))
      .find((b) => b.textContent.includes('Replay'));
    expect(replayButton).toBeTruthy();

    // 1. Encounter beat: replay button is disabled
    expect(replayButton.disabled).toBe(true);

    // Advance to decide beat
    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    expect(app.getState().beat).toBe('decide');
    expect(replayButton.disabled).toBe(false);

    // Clicking replay before any conversion gives intentional guidance
    replayButton.click();
    const notice = root.querySelector('.app-support-notice');
    expect(notice.textContent).toBe('Finish a change before replaying it.');
    expect(replayButton.getAttribute('aria-pressed')).toBe('false');

    // Establish common denominator and first conversion (left: 2/3 -> 8/12)
    app.dispatch({ type: 'propose-common-denominator', proposed: whole(12) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(8, 12) });

    // Now in transform beat for right fraction (with left converted)
    expect(app.getState().beat).toBe('transform');
    expect(app.getState().established.lastConversion).toBeTruthy();

    // --- Condition 1: New parts only (in-place / D-02-M) ---
    // In-place before replay does not show replay card
    expect(root.querySelector('.fraction-bar-in-place-replay')).toBeNull();

    // Trigger replay
    replayButton.click();
    expect(replayButton.getAttribute('aria-pressed')).toBe('true');
    expect(notice.textContent).toBe('Take another look at the current bars and symbols.');

    // Shows starting parts (2/3) with badge and toggle button (Condition A)
    const replayCard = root.querySelector('.app-visual-view .fraction-bar-in-place-replay');
    expect(replayCard).not.toBeNull();
    expect(replayCard.textContent).toContain('Starting parts: 2/3');
    const toggleBtn = replayCard.querySelector('.fraction-bar-toggle-btn');
    expect(toggleBtn).not.toBeNull();
    expect(toggleBtn.textContent).toBe('Show new parts');

    // Clicking toggle button dismisses replay cleanly
    toggleBtn.click();
    expect(root.querySelector('.app-visual-view .fraction-bar-in-place-replay')).toBeNull();
    expect(replayButton.getAttribute('aria-pressed')).toBe('false');

    // --- Condition 2: Compare (juxtaposed / D-02-J) ---
    root.querySelector('.app-gear-button').click();
    root.querySelector('[data-condition-id="phase2-bundle-2"]').click();

    expect(root.querySelector('.choreography-juxtaposed.replay-active')).toBeNull();
    replayButton.click();
    expect(replayButton.getAttribute('aria-pressed')).toBe('true');
    expect(root.querySelector('.choreography-juxtaposed.replay-active')).not.toBeNull();

    // Toggle off replay
    replayButton.click();
    expect(replayButton.getAttribute('aria-pressed')).toBe('false');
    expect(root.querySelector('.choreography-juxtaposed.replay-active')).toBeNull();

    // --- Condition 3: Steps (sequential / D-02-S) ---
    root.querySelector('.app-gear-button').click();
    root.querySelector('[data-condition-id="phase2-bundle-3"]').click();

    expect(root.querySelector('.choreography-sequential.replay-active')).toBeNull();
    replayButton.click();
    expect(replayButton.getAttribute('aria-pressed')).toBe('true');
    expect(root.querySelector('.choreography-sequential.replay-active')).not.toBeNull();
    replayButton.click();
    expect(replayButton.getAttribute('aria-pressed')).toBe('false');
  });

  it('enters Inspection Mode at reflect, unmounting choices and restoring focus on exit (Conditions B & D)', () => {
    const replayButton = Array.from(root.querySelectorAll('.app-secondary-button'))
      .find((b) => b.textContent.includes('Replay'));

    // Advance through the episode to reflect
    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    app.dispatch({ type: 'propose-common-denominator', proposed: whole(12) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(8, 12) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(3, 12) });
    app.dispatch({ type: 'submit-operation-result', proposed: fraction(11, 12) });
    app.dispatch({ type: 'submit-resolution', proposed: fraction(11, 12) });

    expect(app.getState().beat).toBe('reflect');

    // Visual matching choices are present
    const visualView = root.querySelector('.app-visual-view');
    const initialChoices = visualView.querySelectorAll('.matching-choice-btn');
    expect(initialChoices.length).toBeGreaterThanOrEqual(3);

    // Trigger replay -> Inspection Mode
    replayButton.click();

    // Inspection card is mounted, choices are unmounted (Condition D)
    const inspectionCard = visualView.querySelector('.replay-inspection-card');
    expect(inspectionCard).not.toBeNull();
    expect(visualView.querySelectorAll('.matching-choice-btn').length).toBe(0);
    expect(visualView.querySelectorAll('.control-choice-btn').length).toBe(0);

    const doneButton = inspectionCard.querySelector('.app-done-looking-button');
    expect(doneButton).not.toBeNull();
    expect(doneButton.textContent).toBe('Done looking');

    // Exit Inspection Mode by clicking "Done looking"
    doneButton.click();

    // Choices remount cleanly
    expect(visualView.querySelector('.replay-inspection-card')).toBeNull();
    const restoredChoices = visualView.querySelectorAll('.matching-choice-btn');
    expect(restoredChoices.length).toBe(initialChoices.length);
    expect(replayButton.getAttribute('aria-pressed')).toBe('false');
  });
});
