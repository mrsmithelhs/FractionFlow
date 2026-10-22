import { afterEach, describe, expect, it } from 'vitest';
import { PRACTICE_TYPES, PLAN39_BAR_TO_LINE_PRACTICE_TYPE } from '../src/app/practice-types.js';
import { createFractionFlowApp } from '../src/app/app.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

function startApp() {
  const document = setupMockDOM();
  const root = document.createElement('div');
  document.body.appendChild(root);
  const app = createFractionFlowApp({ root, presentationMode: 'instant-test' }).mount();
  root.querySelector('[data-practice-type="bar-to-line-same-amount"]').click();
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
    app.destroy();
  });

  it('keeps a pending choice and open help through view changes, then checks only on explicit action', () => {
    const { root, app } = startApp();
    const next = root.querySelector('.app-visual-view .plan39-stepper-next');
    next.click(); // 0 of 2: offered endpoint, deliberately incorrect
    expect(root.querySelector('.app-visual-view .plan39-check-position').disabled).toBe(false);
    expect(root.querySelector('.app-visual-view .plan39-accepted-point')).toBeNull();
    const help = root.querySelector('.app-support-controls button');
    help.click();
    expect(root.querySelector('#visual-plan39-help')).not.toBeNull();
    root.querySelector('.app-view-toggle').click();
    const radio = Array.from(root.querySelector('.app-linear-view').querySelectorAll('input'))
      .find((input) => input.getAttribute('data-candidate-id') === 'partition-0-of-2');
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
    next.click(); // 0 of 2
    next.click(); // 1 of 2
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
});
