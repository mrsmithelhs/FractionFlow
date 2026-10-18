import { afterEach, describe, expect, it } from 'vitest';
import { createFractionFlowApp } from '../src/app/app.js';
import { PLAN18_PRACTICE_TYPES_V6 } from '../src/app/practice-types.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

describe('Plan 18 mounted nested addition', () => {
  afterEach(() => { teardownMockDOM(); });

  it('shows one side question, task-local help, local recovery, one conversion and honest original operand in both views', () => {
    const document = setupMockDOM();
    const root = document.createElement('div');
    document.body.appendChild(root);
    const productionType = PLAN18_PRACTICE_TYPES_V6[0];
    for (const item of productionType.items.slice(11)) for (const view of ['visual', 'linear']) {
      const focusedType = Object.freeze({ ...productionType, items: Object.freeze([item]) });
      const app = createFractionFlowApp({ root, practiceTypes: [focusedType], presentationMode: 'instant-test' });
      app.mount();
      root.querySelector('.app-practice-button').click();
      if (view === 'linear') root.querySelector('.app-view-toggle').click();
      const host = view === 'visual' ? '.app-visual-view' : '.app-linear-view';
      root.querySelector(`${host} .active-beat-controls button`).click();
      const choiceGroup = root.querySelector(`${host} .active-beat-controls fieldset`);
      expect(choiceGroup.querySelector('legend').textContent).toBe('Which fraction needs a different denominator?');
      expect(choiceGroup.querySelectorAll('.nested-side-choice')).toHaveLength(2);
      expect(root.querySelectorAll(`${host} h2.active-beat-prompt`)).toHaveLength(0);

      const help = root.querySelector(`${host} .app-secondary-button`);
      help.click();
      expect(help.getAttribute('aria-expanded')).toBe('true');
      expect(root.textContent).toContain('Compare each bottom number with 8.');
      help.click();
      expect(help.getAttribute('aria-expanded')).toBe('false');

      const correctSide = item.id === 'nested-one-half-plus-three-eighths' ? 'left' : 'right';
      const wrongSide = correctSide === 'left' ? 'right' : 'left';
      choiceGroup.querySelectorAll('.nested-side-choice')[wrongSide === 'left' ? 0 : 1].click();
      expect(root.querySelector('.recovery-feedback').textContent).toContain('Check which fraction is already in eighths.');
      root.querySelectorAll(`${host} .nested-side-choice`)[correctSide === 'left' ? 0 : 1].click();

      root.querySelector(`${host} .app-secondary-button`).click();
      const multiplierId = `${view === 'visual' ? 'transform' : 'linear-transform'}-help-multiplier-${correctSide}`;
      const multiplierInput = root.querySelector(`#${multiplierId}`);
      expect(multiplierInput).not.toBeNull();
      multiplierInput.value = '4';
      multiplierInput.parentNode.parentNode.querySelector('.control-submit-btn').click();
      expect(app.getState().supportHistory.at(-1).classification).toBe('accepted');
      const numerator = root.querySelector(`#${view === 'visual' ? 'transform' : 'linear-transform'}-num-input-${correctSide}`);
      numerator.value = '4';
      root.querySelector(`${host} .control-submit-btn`).click();
      expect(app.getState().established.lastConversion.side).toBe(correctSide);
      expect(root.querySelector('.app-replay-button').hidden).toBe(false);
      const otherHost = view === 'visual' ? '.app-linear-view' : '.app-visual-view';
      root.querySelector('.app-view-toggle').click();
      expect(root.querySelector(otherHost).hasAttribute('hidden')).toBe(false);
      const original = correctSide === 'left' ? 'right' : 'left';
      const originalForm = app.getState().content.operands[original].initialForm;
      expect(root.querySelectorAll(`${otherHost} [role="math"]`).some((node) => node.getAttribute('aria-label').includes(`${originalForm.numerator} over ${originalForm.denominator}`))).toBe(true);
      expect(root.querySelectorAll(`${otherHost} .control-fraction-input`)).toHaveLength(0);
      root.querySelector('.app-view-toggle').click();
      const currentHost = view === 'visual' ? '.app-visual-view' : '.app-linear-view';
      root.querySelector(view === 'visual' ? '#operate-sum-input' : '#linear-operate-sum-input').value = '7';
      root.querySelector(`${currentHost} .control-submit-btn`).click();
      expect(app.getState().beat).toBe('resolve');
      const completionSummary = root.querySelector('.completed-beats-section').textContent;
      expect(completionSummary).not.toContain('same size parts');
      expect(completionSummary).toContain('1/2 = 4/8');
      root.querySelector(`${currentHost} .active-beat-controls button`).click();
      expect(app.getState().status).toBe('resolved');
      const finishedSummary = root.querySelector('.completed-beats-section').textContent;
      expect(finishedSummary).toContain('1/2 = 4/8');
      expect(finishedSummary).not.toContain('same size parts');
      app.destroy();
    }
  });
});
