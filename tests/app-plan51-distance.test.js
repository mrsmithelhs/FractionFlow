import { afterEach, expect, it } from 'vitest';
import { createFractionFlowApp, prepareProgressionTransaction } from '../src/app/app.js';
import { PLAN51_DISTANCE_PRACTICE_TYPE } from '../src/app/practice-types.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

afterEach(() => teardownMockDOM());

it('mounts the two stages, preserves a wrong draft, and progresses after acceptance', () => {
  const document = setupMockDOM();
  const root = document.createElement('div'); document.body.appendChild(root);
  const app = createFractionFlowApp({ root, presentationMode: 'instant-test' }).mount();
  root.querySelector('[data-practice-type="fraction-distance"]').click();
  const input = [...root.querySelectorAll('.app-visual-view .plan45-relation-option input')].find(node => node.value === '<');
  expect(input.getAttribute('aria-label')).toBe('First amount is less than second amount');
  input.checked = true; input.dispatchEvent({ type: 'change' });
  const retired = root.querySelector('.app-visual-view .plan51-response');
  retired.dispatchEvent({ type: 'submit', preventDefault() {} });
  expect(app.getState().beat).toBe('distance');
  expect(root.querySelectorAll('.app-visual-view .plan45-model')).toHaveLength(0);
  const numerator = root.querySelector('.app-visual-view [data-plan51-focus="numerator"]');
  const denominator = root.querySelector('.app-visual-view [data-plan51-focus="denominator"]');
  numerator.value = '3'; numerator.dispatchEvent({ type: 'input' });
  denominator.value = '8'; denominator.dispatchEvent({ type: 'input' });
  root.querySelector('.app-visual-view .plan51-response').dispatchEvent({ type: 'submit', preventDefault() {} });
  expect(app.getState().feedback).toBe('incorrect-distance');
  expect(root.querySelector('.app-visual-view [data-plan51-focus="numerator"]').getAttribute('aria-describedby')).toBe('plan51-feedback-visual');
  expect(root.querySelector('.app-visual-view [data-plan51-focus="numerator"]').value).toBe('3');
  retired.dispatchEvent({ type: 'submit', preventDefault() {} });
  expect(app.getState().beat).toBe('distance');
  const revised = root.querySelector('.app-visual-view [data-plan51-focus="numerator"]');
  revised.value = '4'; revised.dispatchEvent({ type: 'input' });
  root.querySelector('.app-visual-view .plan51-response').dispatchEvent({ type: 'submit', preventDefault() {} });
  expect(app.getState().status).toBe('resolved');
  expect(root.querySelector('.app-visual-view .plan51-success').textContent).toBe("That's right.");
  expect(root.querySelector('.app-visual-view .plan45-model-track').getAttribute('role')).toBe('img');
  const accepted = app.getState();
  const refusal = prepareProgressionTransaction({ currentState: accepted, practiceType: PLAN51_DISTANCE_PRACTICE_TYPE,
    activeIndex: 0, actionKind: 'advance', prepareDestination: () => { throw new Error('unavailable'); } });
  expect(refusal.ok).toBe(false);
  expect(refusal.completedOldState).toBe(accepted);
  expect(root.querySelectorAll('.app-visual-view .plan45-model')).toHaveLength(2);
  const next = [...root.querySelectorAll('.app-visual-view button')].find(node => node.textContent === 'Next problem');
  expect(next).toBeTruthy(); next.click();
  expect(app.getState().taskContext.itemId).toBe('distance-02');
  app.destroy();
});

it('records explicit assistance, refuses malformed input, and retains draft through the linear view', () => {
  const document = setupMockDOM();
  const root = document.createElement('div'); document.body.appendChild(root);
  const app = createFractionFlowApp({ root, presentationMode: 'instant-test' }).mount();
  root.querySelector('[data-practice-type="fraction-distance"]').click();
  root.querySelector('.app-gear-button').click();
  root.querySelector('[data-support-id="medium-support"]').click();
  [...root.querySelectorAll('button')].find(node => node.textContent === 'Try this problem again').click();
  expect(app.getState().support.label).toBe('medium support');
  const buttons = () => [...root.querySelectorAll('.app-visual-view button')];
  buttons().find(node => node.textContent === 'Show first amount').click();
  expect(app.getState().modelChoice).toBe('first');
  expect(root.querySelector('.app-visual-view .plan45-model-track').getAttribute('aria-label')).toContain('8 equal parts');
  expect(buttons().some(node => node.textContent === 'Show second amount')).toBe(false);
  const wrong = [...root.querySelectorAll('.app-visual-view .plan45-relation-option input')].find(node => node.value === '>');
  wrong.checked = true; wrong.dispatchEvent({ type: 'change' });
  root.querySelector('.app-visual-view .plan51-response').dispatchEvent({ type: 'submit', preventDefault() {} });
  expect(root.querySelector('.app-visual-view .plan45-relation-group').getAttribute('aria-describedby')).toBe('plan51-feedback-visual');
  const relation = [...root.querySelectorAll('.app-visual-view .plan45-relation-option input')].find(node => node.value === '<');
  relation.checked = true; relation.dispatchEvent({ type: 'change' });
  root.querySelector('.app-visual-view .plan51-response').dispatchEvent({ type: 'submit', preventDefault() {} });
  expect(root.querySelector('.app-visual-view [data-plan51-focus="numerator"]').hasAttribute('aria-describedby')).toBe(false);
  const numerator = root.querySelector('.app-visual-view [data-plan51-focus="numerator"]');
  const denominator = root.querySelector('.app-visual-view [data-plan51-focus="denominator"]');
  numerator.value = '1'; numerator.dispatchEvent({ type: 'input' }); numerator.focus();
  denominator.value = '0'; denominator.dispatchEvent({ type: 'input' });
  const before = app.getState().intentHistory.length;
  root.querySelector('.app-visual-view .plan51-response').dispatchEvent({ type: 'submit', preventDefault() {} });
  expect(app.getState().intentHistory).toHaveLength(before);
  expect(root.querySelector('.app-visual-view .plan45-recovery').textContent).toContain('positive denominator');
  expect(root.querySelector('.app-visual-view [data-plan51-focus="denominator"]').getAttribute('aria-describedby')).toBe('plan51-feedback-visual');
  root.querySelector('.app-view-toggle').click();
  expect(root.querySelector('.app-linear-view [data-plan51-focus="numerator"]').value).toBe('1');
  expect(document.activeElement).toBe(root.querySelector('.app-linear-view [data-plan51-focus="numerator"]'));
  app.destroy();
});

it('progresses through all four ordered records and finishes directly', () => {
  const document = setupMockDOM();
  const root = document.createElement('div'); document.body.appendChild(root);
  const app = createFractionFlowApp({ root, presentationMode: 'instant-test' }).mount();
  root.querySelector('[data-practice-type="fraction-distance"]').click();
  const answers = [['<', '4', '8'], ['>', '4', '8'], ['>', '1', '3'], ['>', '1', '2']];
  for (let index = 0; index < answers.length; index += 1) {
    const [relation, numerator, denominator] = answers[index];
    expect(app.getState().taskContext.itemId).toBe(`distance-0${index + 1}`);
    const option = [...root.querySelectorAll('.app-visual-view .plan45-relation-option input')].find(node => node.value === relation);
    option.checked = true; option.dispatchEvent({ type: 'change' });
    root.querySelector('.app-visual-view .plan51-response').dispatchEvent({ type: 'submit', preventDefault() {} });
    for (const [key, value] of [['numerator', numerator], ['denominator', denominator]]) {
      const input = root.querySelector(`.app-visual-view [data-plan51-focus="${key}"]`);
      input.value = value; input.dispatchEvent({ type: 'input' });
    }
    root.querySelector('.app-visual-view .plan51-response').dispatchEvent({ type: 'submit', preventDefault() {} });
    expect(app.getState().established.distance).toEqual({ numerator, denominator });
    const next = root.querySelector('.app-visual-view .plan51-next');
    expect(next.textContent).toBe(index === 3 ? 'Back to start' : 'Next problem');
    next.click();
  }
  expect(root.querySelector('.app-episode').hasAttribute('hidden')).toBe(true);
  app.destroy();
});

it('retains accepted work when a mounted next item cannot be prepared', () => {
  const document = setupMockDOM();
  const root = document.createElement('div'); document.body.appendChild(root);
  const broken = { ...PLAN51_DISTANCE_PRACTICE_TYPE, items: [PLAN51_DISTANCE_PRACTICE_TYPE.items[0],
    { ...PLAN51_DISTANCE_PRACTICE_TYPE.items[1], id: 'distance-unknown' }] };
  const app = createFractionFlowApp({ root, practiceTypes: [broken], presentationMode: 'instant-test' }).mount();
  root.querySelector('[data-practice-type="fraction-distance"]').click();
  const relation = [...root.querySelectorAll('.app-visual-view .plan45-relation-option input')].find(node => node.value === '<');
  relation.checked = true; relation.dispatchEvent({ type: 'change' });
  root.querySelector('.app-visual-view .plan51-response').dispatchEvent({ type: 'submit', preventDefault() {} });
  for (const [key, value] of [['numerator', '1'], ['denominator', '2']]) {
    const input = root.querySelector(`.app-visual-view [data-plan51-focus="${key}"]`);
    input.value = value; input.dispatchEvent({ type: 'input' });
  }
  root.querySelector('.app-visual-view .plan51-response').dispatchEvent({ type: 'submit', preventDefault() {} });
  const accepted = app.getState();
  root.querySelector('.app-visual-view .plan51-next').click();
  expect(app.getState()).toBe(accepted);
  expect(root.querySelector('.app-navigation-notice').hasAttribute('hidden')).toBe(false);
  expect(document.activeElement).toBe(root.querySelector('.app-navigation-notice'));
  app.destroy();
});
