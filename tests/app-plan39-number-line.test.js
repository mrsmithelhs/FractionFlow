import { afterEach, describe, expect, it } from 'vitest';
import { PRACTICE_TYPES, PLAN39_BAR_TO_LINE_PRACTICE_TYPE } from '../src/app/practice-types.js';
import { createFractionFlowApp } from '../src/app/app.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

describe('Plan 39 app wiring', () => {
  afterEach(() => teardownMockDOM());

  it('registers eight records and starts a unary encounter without binary fixture operands', () => {
    expect(PRACTICE_TYPES).toContain(PLAN39_BAR_TO_LINE_PRACTICE_TYPE);
    expect(PLAN39_BAR_TO_LINE_PRACTICE_TYPE.items).toHaveLength(8);
    const document = setupMockDOM();
    const root = document.createElement('div');
    document.body.appendChild(root);
    const app = createFractionFlowApp({ root, presentationMode: 'instant-test' }).mount();
    root.querySelector('[data-practice-type="place-fractions-on-number-line"]').click();
    expect(app.getState().episodeDefinition.id).toBe('phase-4-bar-to-line-same-amount');
    expect(app.getState().content).not.toHaveProperty('operands');
    expect(root.querySelectorAll('.plan39-source-figure')).toHaveLength(2);
    expect(root.querySelectorAll('.plan39-track-figure')).toHaveLength(2);
    expect(root.querySelectorAll('.plan39-candidates-visual input[type="radio"]')).toHaveLength(0);
    expect(root.querySelector('.app-replay-button').hidden).toBe(true);
    app.destroy();
  });

  it('keeps an unconfirmed preview across view changes and does not submit on selection', () => {
    const document = setupMockDOM();
    const root = document.createElement('div');
    document.body.appendChild(root);
    const app = createFractionFlowApp({ root, presentationMode: 'instant-test' }).mount();
    root.querySelector('[data-practice-type="place-fractions-on-number-line"]').click();
    root.querySelector('.app-visual-view .plan39-continue').click();
    const visualChoice = root.querySelector('.app-visual-view').querySelectorAll('.plan39-candidate-option').find((button) => button.getAttribute('data-candidate-id') === 'partition-1-of-2');
    visualChoice.click();
    expect(app.getState().beat).toBe('locate');
    expect(app.getState().intentHistory.map((intent) => intent.type)).toEqual(['acknowledge-bridge-encounter']);
    root.querySelector('.app-view-toggle').click();
    const linearRadio = root.querySelector('.app-linear-view').querySelectorAll('input').find((input) => input.getAttribute('data-candidate-id') === 'partition-1-of-2');
    expect(linearRadio.checked).toBe(true);
    root.querySelector('.app-view-toggle').click();
    expect(root.querySelector('.app-visual-view').querySelectorAll('.plan39-candidate-option').find((button) => button.getAttribute('data-candidate-id') === 'partition-1-of-2').getAttribute('aria-pressed')).toBe('true');
    app.dispatch({ type: 'propose-number-line-location', proposed: { kind: 'fraction', numerator: '1', denominator: '2' } });
    expect(app.getState().beat).toBe('resolve');
    expect(root.querySelector('.app-visual-view .plan39-accepted-point')).not.toBeNull();
    root.querySelector('.app-visual-view .plan39-finish').click();
    expect(app.getState().status).toBe('resolved');
    expect(root.querySelector('.app-visual-view .plan39-finish')).toBeNull();
    expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(false);
    expect(root.querySelector('.app-visual-view .active-beat-prompt').textContent).toBe('The same amount is on the number line.');
    app.destroy();
  });
});
