import { afterEach, describe, expect, it } from 'vitest';
import { createFractionFlowApp } from '../src/app/app.js';
import { PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE, PRACTICE_TYPES } from '../src/app/practice-types.js';
import { PLAN45_COMPARISON_RECORDS } from '../src/content/data/plan45-symbolic-fraction-comparison-records.js';
import { compareFractions, createFraction } from '../src/math/index.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

function expectedRelation(forms) {
  const first = createFraction(BigInt(forms.first.numerator), BigInt(forms.first.denominator));
  const second = createFraction(BigInt(forms.second.numerator), BigInt(forms.second.denominator));
  const order = compareFractions(first, second);
  return order < 0 ? '<' : order > 0 ? '>' : '=';
}

function mount() {
  const document = setupMockDOM();
  const root = document.createElement('div');
  document.body.appendChild(root);
  const app = createFractionFlowApp({ root, presentationMode: 'instant-test' }).mount();
  root.querySelector('[data-practice-type="symbolic-fraction-comparison"]').click();
  return { root, app };
}

function relationInput(root, view, relation) {
  return [...root.querySelectorAll(`.app-${view}-view .plan45-relation-option input`)]
    .find((input) => input.value === relation) ?? null;
}

function chooseRelation(root, view, relation) {
  const input = relationInput(root, view, relation);
  [...root.querySelectorAll(`.app-${view}-view .plan45-relation-option input`)]
    .forEach((option) => { option.checked = false; });
  input.checked = true;
  input.dispatchEvent({ type: 'change' });
}

function submitCheck(root, view) {
  const form = root.querySelector(`.app-${view}-view .plan45-response-region`);
  form.dispatchEvent({
    type: 'submit',
    preventDefault() {},
  });
}

describe('Plan 45 comparison app integration', () => {
  afterEach(() => teardownMockDOM());

  it('registers one compare goal and withholds models and correctness before acceptance', () => {
    const { root, app } = mount();
    expect(PRACTICE_TYPES).toContain(PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE);
    expect(PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE.label).toBe('Compare fractions');
    expect(app.getState().taskContext.itemId).toBe(PLAN45_COMPARISON_RECORDS[0].itemId);
    expect(app.getState().activeCondition.id).toBe('plan45-static-comparison');
    expect(root.querySelector('.plan45-prompt').textContent).toBe('Compare these fractions.');
    expect(root.querySelectorAll('.plan45-model')).toHaveLength(0);
    expect(root.querySelectorAll('.plan45-model-track')).toHaveLength(0);
    expect(root.querySelectorAll('.app-visual-view .plan45-relation-option')).toHaveLength(3);
    expect(root.querySelector('.app-help-button')?.hasAttribute('hidden') ?? true).toBe(true);
    expect(root.querySelectorAll('[data-correct], [data-answer], [data-expected-relation]')).toHaveLength(0);
    expect(root.querySelector('.plan45-relation-option input').getAttribute('aria-label')).toContain('first fraction');
    root.querySelector('.app-gear-button').click();
    expect(root.querySelector('#fractionflow-condition-applicability').textContent)
      .toContain('fixed display');
    const conditionOption = root.querySelector('.app-display-options [data-condition-id]');
    conditionOption.click();
    expect(app.getState().activeCondition.id).toBe('plan45-static-comparison');
    app.destroy();
  });

  it('keeps one chosen source model and the selected relation through retry, view change, and fresh Next', () => {
    const { root, app } = mount();
    const wrong = ['<', '=', '>'].find((choice) => choice !== expectedRelation(app.getState().taskContext.sourceForms));
    app.dispatch({ type: 'request-comparison-help', helpKind: 'reasoning' });
    app.dispatch({ type: 'request-comparison-model', side: 'first' });
    expect(root.querySelectorAll('.app-visual-view .plan45-model')).toHaveLength(1);
    expect(root.querySelector('.app-visual-view .plan45-model-track').getAttribute('aria-label')).toContain('First fraction model');
    expect(root.querySelectorAll('.app-visual-view .plan45-help-choices [data-plan45-focus-key^="model-"]')).toHaveLength(0);

    chooseRelation(root, 'visual', wrong);
    submitCheck(root, 'visual');
    expect(app.getState().lastRecovery.classification.kind).toBe('comparison-retry');
    expect(app.getState().assistance.modelChoice).toBe('first');
    expect(relationInput(root, 'visual', wrong).checked).toBe(true);
    expect(root.querySelectorAll('.app-visual-view .plan45-model')).toHaveLength(1);

    chooseRelation(root, 'visual', expectedRelation(app.getState().taskContext.sourceForms));
    root.querySelector('.app-view-toggle').click();
    expect(relationInput(root, 'linear', expectedRelation(app.getState().taskContext.sourceForms)).checked).toBe(true);
    expect(root.querySelectorAll('.app-linear-view .plan45-linear-model')).toHaveLength(1);
    submitCheck(root, 'linear');
    expect(app.getState().status).toBe('resolved');
    expect(root.querySelector('.app-linear-view .plan45-expression').textContent).toContain(expectedRelation(app.getState().taskContext.sourceForms));
    expect(root.querySelectorAll('.app-linear-view .plan45-linear-model')).toHaveLength(2);
    expect(root.querySelectorAll('.app-linear-view .plan45-progression-button')).toHaveLength(1);
    root.querySelector('.app-linear-view .plan45-progression-button').click();
    expect(app.getState().taskContext.itemId).toBe(PLAN45_COMPARISON_RECORDS[1].itemId);
    expect(app.getState().assistance.modelChoice).toBeNull();
    expect(root.querySelectorAll('.app-linear-view .plan45-model')).toHaveLength(0);
    app.destroy();
  });

  it('checks mounted response and local progression on every registered item identity', () => {
    const { root, app } = mount();
    for (let index = 0; index < PLAN45_COMPARISON_RECORDS.length; index += 1) {
      const record = PLAN45_COMPARISON_RECORDS[index];
      const state = app.getState();
      expect(state.taskContext.itemId).toBe(record.itemId);
      const relation = expectedRelation(state.taskContext.sourceForms);
      chooseRelation(root, 'visual', relation);
      submitCheck(root, 'visual');
      expect(app.getState().status).toBe('resolved');
      expect(app.getState().established.comparison.acceptedRelation).toBe(relation);
      expect(root.querySelectorAll('.app-visual-view .plan45-model')).toHaveLength(2);
      if (index + 1 < PLAN45_COMPARISON_RECORDS.length) {
        root.querySelector('.app-visual-view .plan45-progression-button').click();
        expect(app.getState().taskContext.itemId).toBe(PLAN45_COMPARISON_RECORDS[index + 1].itemId);
      }
    }
    expect(app.getState().taskContext.itemId).toBe(PLAN45_COMPARISON_RECORDS.at(-1).itemId);
    expect(root.querySelector('.app-visual-view .plan45-progression-button').textContent).toBe('Back to start');
    root.querySelector('.app-visual-view .plan45-progression-button').click();
    expect(app.getState().taskContext.itemId).toBe(PLAN45_COMPARISON_RECORDS[0].itemId);
    app.destroy();
  });
});
