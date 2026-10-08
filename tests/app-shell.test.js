import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createFractionFlowApp } from '../src/app/app.js';
import { REGISTERED_CONDITIONS } from '../src/app/conditions.js';
import { buildCuratedProblem } from '../src/content/generator.js';
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
    root.querySelector('.app-practice-button').click();
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
    expect(root.querySelector('.fractionflow-app').children.at(-1).classList.contains('app-episode')).toBe(true);
    expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(true);
    expect(root.querySelector('.app-episode .app-gear-button')).toBe(null);
    expect(root.textContent).toContain('Look at these two fractions.');
    expect(root.querySelector('.app-linear-view').hasAttribute('hidden')).toBe(true);
    expect(root.querySelector('.app-visual-view').hasAttribute('hidden')).toBe(false);
    expect(root.querySelector('.app-display-menu').hasAttribute('hidden')).toBe(true);
    expect(root.querySelectorAll('[aria-live="polite"]').length).toBe(1);
    expect(root.textContent).not.toContain('11/12');
    expect(root.textContent).not.toContain('D-02');
    expect(app.getState().episodeDefinition.revision).toBe('2');
  });

  it('selects reviewer condition on the entry page and applies it to a fresh episode', () => {
    const encounterButton = root.querySelector('.app-visual-view .control-btn');
    encounterButton.click();
    root.querySelectorAll('.app-visual-view .control-choice-btn')[1].click();

    const before = app.getState();
    expect(before.beat).toBe('decide');
    expect(before.established.notice.relationship).toBe('relatively-prime');
    root.querySelector('.app-return-button').click();
    expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(false);
    expect(root.querySelector('.app-episode .app-gear-button')).toBe(null);
    root.querySelector('.app-gear-button').click();
    const second = root.querySelector('[data-condition-id="phase2-bundle-2"]');
    expect(second.getAttribute('data-choreography-code')).toBe('D-02-J');
    second.click();
    root.querySelector('.app-practice-button').click();

    const after = app.getState();
    expect(after.activeCondition).toEqual(REGISTERED_CONDITIONS[1].activeCondition);
    expect(after.revision).toBe(0);
    expect(after.established.notice).toBe(null);
    expect(after.support.label).toBe('high support');
    expect(root.querySelector('.fractionflow-app').getAttribute('data-support-level')).toBe('high-support');
    expect(app.getReplayEnvelope().activeCondition).toEqual(after.activeCondition);
    expect(root.textContent).not.toContain('D-02-J');
    expect(root.querySelector('.app-episode .app-gear-button')).toBe(null);
    expect(before.established.notice.relationship).toBe('relatively-prime');
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

  it('places denominator help beside the response, preserves its draft, and explains the selected unit', () => {
    root.querySelector('.app-return-button').click();
    root.querySelector('.app-gear-button').click();
    root.querySelector('[data-support-id="medium-support"]').click();
    root.querySelector('.app-practice-button').click();
    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });

    let input = root.querySelector('.app-visual-view #decide-common-denominator-input');
    input.value = '8';
    input.focus();
    const help = root.querySelector('.app-visual-view .active-beat-controls .app-secondary-button');
    expect(help.parentNode.classList.contains('active-beat-controls')).toBe(true);
    expect(help.getAttribute('aria-expanded')).toBe('false');
    help.click();
    expect(app.getState().helpHistory.at(-1).beat).toBe('decide');
    expect(help.parentNode.classList.contains('active-beat-controls')).toBe(true);
    expect(root.querySelector('.active-denominator-help-cue').textContent)
      .toBe('Try multiplying 3 by 4 to find one common denominator.');
    expect(help.getAttribute('aria-expanded')).toBe('true');
    expect(help.getAttribute('aria-controls')).toBe('fractionflow-decide-help-cue');
    expect(input.value).toBe('8');

    root.querySelector('.app-view-toggle').click();
    let linearInput = root.querySelector('.app-linear-view #linear-decide-common-denominator-input');
    expect(linearInput.value).toBe('8');
    expect(root.querySelector('.app-linear-view .active-denominator-help-cue')).not.toBeNull();
    root.querySelector('.app-view-toggle').click();
    expect(root.querySelector('.app-visual-view .active-denominator-help-cue')).not.toBeNull();

    help.click();
    expect(root.querySelector('.active-denominator-help-cue')).toBe(null);
    expect(help.getAttribute('aria-expanded')).toBe('false');
    expect(help.hasAttribute('aria-controls')).toBe(false);
    expect(input.value).toBe('8');
    input.focus();
    root.querySelector('.app-view-toggle').click();
    input = root.querySelector('.app-linear-view #linear-decide-common-denominator-input');
    expect(input.value).toBe('8');
    expect(input._isFocused).toBe(true);
    expect(help.parentNode.classList.contains('active-beat-controls')).toBe(true);

    app.dispatch({ type: 'propose-common-denominator', proposed: whole(8) });
    expect(root.querySelector('.app-linear-view .recovery-feedback').textContent)
      .toBe('8 is a multiple of 4, but not 3. Try another number.');
    expect(root.querySelector('.active-denominator-help-cue')).toBe(null);

    app.dispatch({ type: 'propose-common-denominator', proposed: whole(10) });
    expect(root.querySelector('.app-linear-view .recovery-feedback').textContent)
      .toBe('10 is not a common denominator. Try another number.');
    app.dispatch({ type: 'propose-common-denominator', proposed: whole(36) });
    expect(app.getState().beat).toBe('decide');
    expect(root.querySelector('.app-linear-view .recovery-feedback').textContent)
      .toBe('36 is a valid common denominator, but this practice cannot use it. Try another number.');

    app.dispatch({ type: 'propose-common-denominator', proposed: whole(24) });
    const explanation = root.querySelector('.app-linear-view .selected-unit-help');
    expect(explanation.querySelector('summary').textContent).toBe('Why does 24 work?');
    expect(explanation.hasAttribute('open')).toBe(false);
    expect(explanation.textContent).toBe(
      'Why does 24 work?24 is 8 groups of 3 and 6 groups of 4, so both fractions can use twenty-fourths.',
    );
    expect(explanation.textContent).not.toContain('16/24');
  });

  it('formats denominator help from projected source denominators for a noncanonical test instance', () => {
    app.destroy();
    const instance = buildCuratedProblem({
      fixture: { id: 'plan24-noncanonical-help-test', authoringRevision: 'plan24-test-v1' },
      selector: 'relatively-prime-addition',
      overlays: [],
      profileId: 'curated-review',
      candidate: {
        left: fraction(1, 2),
        right: fraction(1, 3),
      },
    });
    app = createFractionFlowApp({ root, presentationMode: 'instant-test', instance });
    app.mount();
    root.querySelector('.app-practice-button').click();
    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });

    root.querySelector('.app-visual-view .active-beat-controls .app-secondary-button').click();
    expect(root.querySelector('.active-denominator-help-cue').textContent)
      .toBe('Try multiplying 2 by 3 to find one common denominator.');
  });

  it('uses one visible associated question for decide and transform across profiles and views', () => {
    const assertSingleQuestion = (view, expected, controlKind) => {
      const active = root.querySelector(`.app-${view}-view .active-beat-section`);
      const questions = active.querySelectorAll('.active-beat-prompt');
      expect(questions).toHaveLength(1);
      const question = questions[0];
      expect(question.textContent).toBe(expected);
      expect(active.querySelector('.active-beat-header .active-beat-prompt')).toBe(null);
      expect(active.textContent.split(expected).length - 1).toBe(1);
      if (controlKind === 'input') {
        const input = active.querySelector('input.control-numeric-input');
        expect(question.tagName).toBe('LABEL');
        expect(question.getAttribute('for')).toBe(input.id);
      } else {
        const fieldset = active.querySelector('fieldset.control-choice-fieldset');
        expect(question.tagName).toBe('LEGEND');
        expect(question.parentNode).toBe(fieldset);
        expect(question.classList.contains('sr-only')).toBe(false);
      }
    };

    for (const profile of ['high', 'medium']) {
      for (const view of ['visual', 'linear']) {
        for (const denominator of ['12', '24']) {
          root.querySelector('.app-return-button').click();
          root.querySelector('.app-gear-button').click();
          root.querySelector(`[data-support-id="${profile}-support"]`).click();
          root.querySelector('.app-practice-button').click();
          const currentlyLinear = !root.querySelector('.app-linear-view').hasAttribute('hidden');
          if (currentlyLinear !== (view === 'linear')) root.querySelector('.app-view-toggle').click();

          app.dispatch({ type: 'acknowledge-encounter' });
          app.dispatch({ type: 'submit-notice', matchesUnits: false });
          const controlKind = profile === 'high' ? 'choice' : 'input';
          assertSingleQuestion(view, 'Choose a common denominator for both fractions.', controlKind);

          if (controlKind === 'choice') {
            const button = Array.from(root.querySelectorAll(`.app-${view}-view .control-choice-btn`))
              .find((option) => option.textContent.trim() === denominator);
            button.click();
          } else {
            app.dispatch({ type: 'propose-common-denominator', proposed: whole(denominator) });
          }
          assertSingleQuestion(
            view,
            `How many parts out of ${denominator} make the same amount as 2/3?`,
            'input',
          );
        }
      }
    }
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
    expect(root.querySelector('.app-completion-panel')).toBe(null);
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
    expect(root.querySelector('.app-linear-view .linear-context-expression')
      .getAttribute('aria-label')).toBe('2 over 3 plus 1 over 4');
    expect(root.textContent).not.toContain('Problem: 2/3 + 1/4');
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
    root.querySelector('.app-practice-button').click();
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

    // Switch to phase2-bundle-2 through the entry page, then replay the same beat.
    root.querySelector('.app-return-button').click();
    root.querySelector('.app-return-button').click();
    root.querySelector('.app-gear-button').click();
    root.querySelector('[data-condition-id="phase2-bundle-2"]').click();
    root.querySelector('.app-practice-button').click();
    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    app.dispatch({ type: 'propose-common-denominator', proposed: whole(12) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(8, 12) });

    const juxtaposedHtml = visualView.innerHTML;
    expect(juxtaposedHtml).not.toBe(inPlaceHtml);
    expect(visualView.querySelector('.choreography-juxtaposed')).toBeTruthy();
    expect(visualView.querySelector('.fraction-bar-juxtaposed')).toBeTruthy();
    expect(visualView.querySelector('.fraction-bar-row-before')).toBeTruthy();
    expect(visualView.querySelector('.fraction-bar-row-after')).toBeTruthy();
    expect(visualView.textContent).toContain('Before: 2/3');
    expect(visualView.textContent).toContain('After: 8/12');

    // Switch to phase2-bundle-3 through the entry page, then replay the same beat.
    root.querySelector('.app-return-button').click();
    root.querySelector('.app-gear-button').click();
    root.querySelector('[data-condition-id="phase2-bundle-3"]').click();
    root.querySelector('.app-practice-button').click();
    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    app.dispatch({ type: 'propose-common-denominator', proposed: whole(12) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(8, 12) });

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

    root.querySelector('.app-return-button').click();
    root.querySelector('.app-gear-button').click();
    const bundle4 = root.querySelector('[data-condition-id="phase2-bundle-4"]');
    expect(bundle4).not.toBeNull();
    expect(bundle4.getAttribute('data-connection-code')).toBe('CM-01-P');
    bundle4.click();
    root.querySelector('.app-practice-button').click();

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
      .toContain('Does the "New parts" bar show the same amount as the starting fraction?');
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

  it('makes replay real in the selected episode condition (Repair 06 Item 1)', () => {
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
    const layoutReserve = root.querySelector('.app-visual-view .fraction-bar-replay-reserve');
    expect(layoutReserve).not.toBeNull();
    expect(layoutReserve.getAttribute('aria-hidden')).toBe('true');
    expect(layoutReserve.children).toHaveLength(0);
    expect(layoutReserve.style.height).not.toBe('');
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

  it('restores focus to reflection choices upon exiting Inspection Mode in visual and linear paths', async () => {
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

    // --- Visual Path ---
    const visualView = root.querySelector('.app-visual-view');
    const visualChoice = visualView.querySelector('.matching-choice-btn');
    expect(visualChoice).not.toBeNull();
    visualChoice.focus();
    expect(document.activeElement).toBe(visualChoice);
    expect(document.activeElement.className).toContain('matching-choice-btn');

    // Enter Inspection Mode
    replayButton.click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(document.activeElement.tagName).toBe('BUTTON');
    expect(document.activeElement.className).toContain('app-done-looking-button');

    // Exit Inspection Mode
    const doneButtonVisual = visualView.querySelector('.app-done-looking-button');
    doneButtonVisual.click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(document.activeElement.tagName).toBe('BUTTON');
    expect(document.activeElement.className).toContain('matching-choice-btn');
    expect(document.activeElement.className).toContain('inspection-focus-return-target');

    // --- Linear Path ---
    const viewSwitchButton = root.querySelector('.app-view-controls .app-secondary-button');
    viewSwitchButton.click();
    const linearView = root.querySelector('.app-linear-view');
    expect(linearView.hasAttribute('hidden')).toBe(false);

    const linearChoice = linearView.querySelector('.control-choice-btn');
    expect(linearChoice).not.toBeNull();
    linearChoice.focus();
    expect(document.activeElement).toBe(linearChoice);
    expect(document.activeElement.className).toContain('control-choice-btn');

    // Enter Inspection Mode
    replayButton.click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(document.activeElement.tagName).toBe('BUTTON');
    expect(document.activeElement.className).toContain('app-done-looking-button');

    // Exit Inspection Mode
    const doneButtonLinear = linearView.querySelector('.app-done-looking-button');
    doneButtonLinear.click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(document.activeElement.tagName).toBe('BUTTON');
    expect(document.activeElement.className).toContain('control-choice-btn');
    expect(document.activeElement.className).toContain('inspection-focus-return-target');
  });

  it('preserves document.activeElement and input state across replay at interactive beat (Repair 07 Item 2)', () => {
    // Advance to transform-right
    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    app.dispatch({ type: 'propose-common-denominator', proposed: whole(12) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(8, 12) });
    expect(app.getState().beat).toBe('transform');
    expect(app.getState().established.lastConversion.side).toBe('left');

    // Visual view: focus numerator input and enter value
    const visualInput = root.querySelector('.app-visual-view input.control-numeric-input');
    expect(visualInput).not.toBeNull();
    visualInput.value = '3';
    visualInput.focus();
    expect(document.activeElement).toBe(visualInput);

    const replayButton = Array.from(root.querySelectorAll('.app-secondary-button'))
      .find((b) => b.textContent.includes('Replay'));

    // Trigger replay
    replayButton.click();
    expect(document.activeElement).toBe(visualInput);
    expect(visualInput.value).toBe('3');

    // Toggle off replay
    replayButton.click();
    expect(document.activeElement).toBe(visualInput);
    expect(visualInput.value).toBe('3');

    // Linear view: switch to linear and test focus preservation
    const linearView = root.querySelector('.app-linear-view');
    root.querySelector('.app-visual-view').setAttribute('hidden', 'true');
    linearView.removeAttribute('hidden');

    const linearInput = linearView.querySelector('input.control-numeric-input');
    expect(linearInput).not.toBeNull();
    linearInput.value = '3';
    linearInput.focus();
    expect(document.activeElement).toBe(linearInput);

    // Trigger replay
    replayButton.click();
    expect(document.activeElement).toBe(linearInput);
    expect(linearInput.value).toBe('3');

    replayButton.click();
    expect(document.activeElement).toBe(linearInput);
    expect(linearInput.value).toBe('3');
  });

  it('provides replay acknowledgement under reduced motion without exposing reviewer settings in the episode', () => {
    const replayButton = Array.from(root.querySelectorAll('.app-secondary-button'))
      .find((b) => b.textContent.includes('Replay'));

    // Advance to operate
    app.dispatch({ type: 'acknowledge-encounter' });
    app.dispatch({ type: 'submit-notice', matchesUnits: false });
    app.dispatch({ type: 'propose-common-denominator', proposed: whole(12) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(8, 12) });
    app.dispatch({ type: 'submit-equivalent-form', proposed: fraction(3, 12) });
    expect(app.getState().beat).toBe('operate');

    // First trigger replay in default in-place mode to add choreography-in-place
    replayButton.click();
    const inPlaceBar = root.querySelector('.fraction-bar-container.choreography-in-place');
    expect(inPlaceBar).not.toBeNull();
    expect(root.querySelector('.app-entry-page').hasAttribute('hidden')).toBe(true);
    expect(root.querySelector('.app-episode .app-gear-button')).toBe(null);

    // Toggle replay off on the same episode.
    replayButton.click();
    expect(inPlaceBar.classList.contains('replay-active')).toBe(false);
  });
});
