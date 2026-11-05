import { afterEach, describe, expect, it } from 'vitest';
import { PRACTICE_TYPES, PLAN39_BAR_TO_LINE_PRACTICE_TYPE } from '../src/app/practice-types.js';
import { createFractionFlowApp } from '../src/app/app.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';
import { PLAN37_BAR_TO_LINE_BRIDGE_RECORDS } from '../src/content/data/plan37-bar-to-line-bridge-records.js';

function startApp({ supportId = 'high-support' } = {}) {
  const document = setupMockDOM();
  const root = document.createElement('div');
  document.body.appendChild(root);
  const app = createFractionFlowApp({ root, presentationMode: 'instant-test', navigationMode: 'legacy-acknowledged' }).mount();
  if (supportId !== 'high-support') {
    root.querySelector('.app-gear-button').click();
    root.querySelector(`[data-support-id="${supportId}"]`).click();
  }
  openChooser(root); root.querySelector('[data-practice-type="bar-to-line-same-amount"]').click();
  return { document, root, app };
}

describe('Plan 39 Repair 02 app wiring', () => {
  afterEach(() => teardownMockDOM());

  it('starts directly at location with one unplaced source token and no pre-answer bar in either view', () => {
    const { root, app } = startApp();
    expect(PRACTICE_TYPES).toContain(PLAN39_BAR_TO_LINE_PRACTICE_TYPE);
    expect(PLAN39_BAR_TO_LINE_PRACTICE_TYPE.items).toHaveLength(8);
    expect(app.getState().episodeDefinition.revision).toBe('2');
    expect(app.getState().beat).toBe('locate');
    expect(root.querySelector('.app-visual-view .plan39-continue')).toBeNull();
    expect(root.querySelectorAll('.plan39-repair-token')).toHaveLength(2);
    expect(root.querySelectorAll('.plan39-bar-track')).toHaveLength(0);
    expect(root.querySelectorAll('.plan39-preview-marker')).toHaveLength(0);
    expect(root.querySelector('.app-visual-view .active-beat-prompt').textContent).toBe('Place this fraction on the number line.');
    expect(root.querySelector('.app-linear-view .active-beat-prompt').textContent).toBe('Choose a location.');
    const visualCue = root.querySelector('.app-visual-view .plan39-grab-cue');
    const linearCue = root.querySelector('.app-linear-view .plan39-grab-cue');
    expect(visualCue.getAttribute('aria-hidden')).toBe('true');
    expect(root.querySelector('.app-visual-view .plan39-repair-token').classList.contains('has-grab-cue')).toBe(true);
    expect(root.querySelector('.app-linear-view .plan39-repair-token').classList.contains('has-grab-cue')).toBe(false);
    expect(linearCue.getAttribute('aria-hidden')).toBe('true');
    expect(root.querySelector('.app-visual-view .plan39-stepper-previous').textContent).toBe('← Place leftmost');
    expect(root.querySelector('.app-visual-view .plan39-stepper-next').textContent).toBe('Place rightmost →');
    app.destroy();
  });

  it('names and selects the first and last offered sparse points on bridge items 2 and 7', () => {
    const { root, app } = startApp({ supportId: 'medium-support' });
    function completeCorrectItem(recordIndex) {
      const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[recordIndex];
      const wanted = record.sparseCandidates.find(({ form }) =>
        BigInt(form.numerator) * BigInt(record.sourceForm.denominator)
          === BigInt(record.sourceForm.numerator) * BigInt(form.denominator));
      const offered = Array.from(root.querySelectorAll('.app-visual-view .plan39-candidate-point'))
        .map((point) => point.getAttribute('data-candidate-id'));
      const wantedIndex = offered.indexOf(wanted.id);
      root.querySelector('.app-visual-view .plan39-stepper-next').click();
      for (let index = offered.length - 1; index > wantedIndex; index -= 1) {
        root.querySelector('.app-visual-view .plan39-stepper-previous').click();
      }
      expect(root.querySelector('.app-visual-view .plan39-stepper-status').getAttribute('data-candidate-id')).toBe(wanted.id);
      root.querySelector('.app-visual-view .plan39-check-position').click();
      root.querySelector('.app-visual-view .plan39-finish').click();
      root.querySelector('.app-next-button').click();
    }
    function assertSparseEndpoints(recordIndex) {
      const offered = Array.from(root.querySelectorAll('.app-visual-view .plan39-candidate-point'))
        .map((point) => point.getAttribute('data-candidate-id'));
      const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[recordIndex];
      const first = record.sparseCandidates[0].id;
      const last = record.sparseCandidates.at(-1).id;
      const hasZero = record.sparseCandidates.some(({ form }) => form.numerator === '0');
      const hasOne = record.sparseCandidates.some(({ form }) => form.numerator === form.denominator);
      expect([hasZero, hasOne]).not.toEqual([true, true]);
      if (recordIndex === 1) expect(record.sparseCandidates.at(-1).form).toMatchObject({ numerator: '1', denominator: '2' });
      if (recordIndex === 6) {
        expect(record.sparseCandidates[0].form).toMatchObject({ numerator: '1', denominator: '6' });
        expect(record.sparseCandidates.at(-1).form).toMatchObject({ numerator: '2', denominator: '3' });
      }
      expect(offered).toEqual(record.sparseCandidates.map(({ id }) => id));
      expect(root.querySelector('.app-visual-view .plan39-stepper-previous').textContent).toBe('← Place leftmost');
      expect(root.querySelector('.app-visual-view .plan39-stepper-next').textContent).toBe('Place rightmost →');
      root.querySelector('.app-visual-view .plan39-stepper-previous').click();
      expect(root.querySelector('.app-visual-view .plan39-stepper-status').getAttribute('data-candidate-id')).toBe(first);
      root.querySelector('.app-restart-button').click();
      root.querySelector('.app-visual-view .plan39-stepper-next').click();
      expect(root.querySelector('.app-visual-view .plan39-stepper-status').getAttribute('data-candidate-id')).toBe(last);
      root.querySelector('.app-restart-button').click();
    }
    completeCorrectItem(0);
    assertSparseEndpoints(1);
    completeCorrectItem(1);
    for (let recordIndex = 2; recordIndex < 6; recordIndex += 1) completeCorrectItem(recordIndex);
    assertSparseEndpoints(6);
    app.destroy();
  });

  it('keeps a pending choice and open help through view changes, then checks only on explicit action', () => {
    const { root, app } = startApp();
    const next = root.querySelector('.app-visual-view .plan39-stepper-next');
    next.click(); // place at 1: offered endpoint, deliberately incorrect
    expect(next.textContent).toBe('Move right →');
    expect(root.querySelector('.app-visual-view .plan39-stepper-previous').textContent).toBe('← Move left');
    expect(root.querySelector('.app-visual-view .plan39-check-position').disabled).toBe(false);
    expect(root.querySelector('.app-visual-view .plan39-accepted-point')).toBeNull();
    const help = root.querySelector('.app-support-controls button');
    help.click();
    expect(root.querySelector('#visual-plan39-help')).not.toBeNull();
    root.querySelector('.app-view-toggle').click();
    const radio = Array.from(root.querySelector('.app-linear-view').querySelectorAll('input'))
      .find((input) => input.getAttribute('data-candidate-id') === 'partition-2-of-2');
    expect(radio.checked).toBe(true);
    expect(root.querySelector('#linear-plan39-help')).not.toBeNull();
    expect(root.querySelectorAll('.plan39-bar-track')).toHaveLength(0);
    root.querySelector('.app-linear-view .plan39-check-position').click();
    expect(app.getState().beat).toBe('locate');
    expect(app.getState().lastRecovery).not.toBeNull();
    expect(root.querySelectorAll('.plan39-bar-track')).toHaveLength(0);
    app.destroy();
  });

  it('offers keyboard steppers and native radios, then reveals the aligned bar only after a correct check', () => {
    const { root, app } = startApp();
    const next = root.querySelector('.app-visual-view .plan39-stepper-next');
    next.click(); // place at 1
    root.querySelector('.app-visual-view .plan39-stepper-previous').click(); // move to 1 of 2
    expect(root.querySelector('.app-visual-view .plan39-stepper-status').textContent).toMatch(/1 of 2 equal steps/);
    root.querySelector('.app-visual-view .plan39-check-position').click();
    expect(app.getState().beat).toBe('resolve');
    expect(root.querySelectorAll('.plan39-bar-track')).toHaveLength(1);
    expect(root.querySelector('.app-visual-view .plan39-connector-overlay')).toBeNull(); // the mock DOM has no measured geometry
    expect(root.querySelector('.app-visual-view .plan39-resolution-description').textContent).toBe('1 of 2 equal steps from 0 is 1/2.');
    root.querySelector('.app-visual-view .plan39-finish').click();
    expect(app.getState().status).toBe('resolved');
    app.destroy();
  });

  it('resets pending location and help on Retry and Return', () => {
    const { root, app } = startApp();
    root.querySelector('.app-visual-view .plan39-stepper-next').click();
    root.querySelector('.app-support-controls button').click();
    root.querySelector('.app-restart-button').click();
    expect(app.getState().beat).toBe('locate');
    expect(root.querySelector('.app-visual-view .plan39-check-position').disabled).toBe(true);
    expect(root.querySelector('#visual-plan39-help')).toBeNull();
    root.querySelector('.app-return-button').click();
    expect(root.querySelector('.app-episode').hasAttribute('hidden')).toBe(true);
    app.destroy();
  });

  it('places unplaced token in the starting tray and moves it to the stack on placement without duplicate', () => {
    const { root, app } = startApp();
    expect(root.querySelector('.app-visual-view .plan39-intro-header')).not.toBeNull();
    const tray = root.querySelector('.app-visual-view .plan39-token-tray');
    expect(tray).not.toBeNull();
    const token = root.querySelector('.app-visual-view .plan39-repair-token');
    expect(token).not.toBeNull();
    expect(tray.contains(token)).toBe(true);
    expect(token.classList.contains('is-placed')).toBe(false);

    root.querySelector('.app-visual-view .plan39-stepper-next').click();
    expect(tray.contains(token)).toBe(false);
    expect(tray.querySelectorAll('.plan39-repair-token')).toHaveLength(0);
    const stack = root.querySelector('.app-visual-view .plan39-representation-stack');
    expect(stack.contains(token)).toBe(true);
    expect(token.classList.contains('is-placed')).toBe(true);

    root.querySelector('.app-restart-button').click();
    const refreshedTray = root.querySelector('.app-visual-view .plan39-token-tray');
    const refreshedToken = root.querySelector('.app-visual-view .plan39-repair-token');
    expect(refreshedTray.contains(refreshedToken)).toBe(true);
    expect(refreshedToken.classList.contains('is-placed')).toBe(false);
    app.destroy();
  });

  it('renders accepted-result header with That’s right and borderless stacked fraction only after correct Check in both views', () => {
    const { root, app } = startApp();
    expect(root.querySelector('.app-visual-view .plan39-accepted-header')).toBeNull();
    expect(root.querySelector('.app-linear-view .plan39-accepted-header')).toBeNull();

    // Wrong Check
    root.querySelector('.app-visual-view .plan39-stepper-next').click(); // 1 of 1 (wrong)
    root.querySelector('.app-visual-view .plan39-check-position').click();
    expect(app.getState().beat).toBe('locate');
    expect(root.querySelector('.app-visual-view .plan39-accepted-header')).toBeNull();
    expect(root.querySelector('.app-visual-view .plan39-bar-track')).toBeNull();

    // Correct Check: stepper starts from unselected after recovery; next selects 1, previous moves to 1/2
    root.querySelector('.app-visual-view .plan39-stepper-next').click();
    root.querySelector('.app-visual-view .plan39-stepper-previous').click();
    root.querySelector('.app-visual-view .plan39-check-position').click();
    expect(app.getState().beat).toBe('resolve');

    // Visual view accepted header and graphics
    const visualHeader = root.querySelector('.app-visual-view .plan39-accepted-header');
    expect(visualHeader).not.toBeNull();
    expect(visualHeader.querySelector('.plan39-accepted-text').textContent).toBe('That’s right.');
    const visualFrac = visualHeader.querySelector('.plan39-accepted-fraction');
    expect(visualFrac).not.toBeNull();
    expect(visualFrac.querySelector('.symbolic-numerator').textContent).toBe('1');
    expect(visualFrac.querySelector('.symbolic-denominator').textContent).toBe('2');
    expect(root.querySelector('.app-visual-view .plan39-accepted-bar-figure')).not.toBeNull();
    expect(root.querySelector('.app-visual-view .plan39-bar-track')).not.toBeNull();
    expect(root.querySelector('.app-visual-view .plan39-accepted-bar-figure .plan39-source-fraction')).toBeNull();

    // Linear view accepted header
    const linearHeader = root.querySelector('.app-linear-view .plan39-accepted-header');
    expect(linearHeader).not.toBeNull();
    expect(linearHeader.querySelector('.plan39-accepted-text').textContent).toBe('That’s right.');
    expect(linearHeader.querySelector('.plan39-accepted-fraction')).not.toBeNull();
    expect(root.querySelector('.app-linear-view .plan39-bar-track')).toBeNull();
    app.destroy();
  });

  it('consumes Plan 43 direct progression: Next advances fresh to item 2 and final item returns', () => {
    const document = setupMockDOM();
    const root = document.createElement('div');
    document.body.appendChild(root);
    const app = createFractionFlowApp({ root, presentationMode: 'instant-test', navigationMode: 'direct' }).mount();
    openChooser(root); root.querySelector('[data-practice-type="bar-to-line-same-amount"]').click();

    // Item 1
    root.querySelector('.app-visual-view .plan39-stepper-next').click();
    root.querySelector('.app-visual-view .plan39-stepper-previous').click();
    root.querySelector('.app-visual-view .plan39-check-position').click();
    expect(app.getState().beat).toBe('resolve');

    const nextBtn = root.querySelector('.app-visual-view .plan39-finish');
    expect(nextBtn.textContent).toBe('Next problem');
    nextBtn.click();

    // Item 2 mounted fresh
    expect(app.getState().beat).toBe('locate');
    expect(root.querySelector('.app-episode').getAttribute('data-current-item-id')).toBe('bridge-02-fourth-4');
    expect(root.querySelector('.app-visual-view .plan39-check-position').disabled).toBe(true);
    const tray = root.querySelector('.app-visual-view .plan39-token-tray');
    const token = root.querySelector('.app-visual-view .plan39-repair-token');
    expect(tray.contains(token)).toBe(true);
    expect(token.classList.contains('is-placed')).toBe(false);

    // Fast-forward to final item (item 7 index)
    for (let i = 1; i < 8; i += 1) {
      if (app.getState().beat === 'locate') {
        const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[i];
        app.dispatch({ type: 'propose-number-line-location', proposed: record.sourceForm });
      }
      if (i < 7) {
        expect(app.getState().beat).toBe('resolve');
        root.querySelector('.app-visual-view .plan39-finish').click();
      }
    }
    expect(app.getState().beat).toBe('resolve');
    const finalBtn = root.querySelector('.app-visual-view .plan39-finish');
    expect(finalBtn.textContent).toBe('Back to start');
    expect(root.querySelector('.app-visual-view .progression-notice').textContent).toBe('You’ve tried every problem in this set.');
    finalBtn.click();
    expect(root.querySelector('.app-episode').hasAttribute('hidden')).toBe(true);
    app.destroy();
  });
});


function openChooser(root) { const chooser = root.querySelector('[data-entry-chooser]'); if (chooser.getAttribute('aria-expanded') === 'false') chooser.click(); }
