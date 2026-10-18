import { afterEach, describe, expect, it } from 'vitest';
import { PRACTICE_TYPES, PLAN18_PRACTICE_TYPES_V6 } from '../src/app/practice-types.js';
import { createFractionFlowApp } from '../src/app/app.js';
import { addAtCommonDenominator, convertToDenominator, equalFractions } from '../src/math/index.js';
import { PLAN35_RECIPE_IDS, PLAN35_RECIPE_DEFINITION_ID, PLAN35_ADDITION_RECIPE_PRACTICE_SET, PLAN35_DATA_ONLY_HOLDOUT_SET } from '../src/content/data/plan35-addition-recipe-records.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

const type = PRACTICE_TYPES.find((entry) => entry.id === 'sum-under-one');
const mathematical = (form) => ({ kind: 'fraction', numerator: BigInt(form.numerator), denominator: BigInt(form.denominator) });
const wire = (form) => ({ kind: 'fraction', numerator: form.numerator.toString(), denominator: form.denominator.toString() });

function expectedEquivalent(instance, side, target) {
  return wire(convertToDenominator(mathematical(instance.operands[side].initialForm), BigInt(target)));
}

function expectedSum(instance, target) {
  return wire(addAtCommonDenominator(
    mathematical(instance.operands.left.initialForm),
    mathematical(instance.operands.right.initialForm),
    BigInt(target),
  ));
}

function setupJourney({ itemId, view, support }) {
  const index = type.items.findIndex((item) => item.id === itemId);
  const focusedType = Object.freeze({ ...type, items: Object.freeze(type.items.slice(index, index + 2)) });
  const document = setupMockDOM();
  const root = document.createElement('div');
  document.body.appendChild(root);
  const app = createFractionFlowApp({ root, practiceTypes: [focusedType], presentationMode: 'instant-test' });
  app.mount();
  root.querySelector('.app-gear-button').click();
  root.querySelector(`[data-support-id="${support}-support"]`).click();
  root.querySelector('.app-practice-button').click();
  if (view === 'linear') root.querySelector('.app-view-toggle').click();
  const host = () => root.querySelector(view === 'visual' ? '.app-visual-view' : '.app-linear-view');
  return { app, document, root, focusedType, host };
}

function activeControls(host) { return host().querySelector('.active-beat-controls'); }
function transformInput(host, side) { return host().querySelector(`#${host().classList.contains('app-linear-view') ? 'linear-transform' : 'transform'}-num-input-${side}`); }
function submitInput(input) { input.parentNode.parentNode.querySelector('.control-submit-btn').click(); }

function finishJourney(app, root, host, document) {
  const state = app.getState();
  const operationId = host().classList.contains('app-linear-view') ? 'linear-operate-sum-input' : 'operate-sum-input';
  let operation = host().querySelector(`#${operationId}`);
  operation.value = '0';
  submitInput(operation);
  expect(app.getState().lastRecovery?.beat).toBe('operate');
  operation = host().querySelector(`#${operationId}`);
  expect(document.activeElement).toBe(operation);
  const expected = expectedSum(state.content, state.taskContext.targetDenominator);
  operation.value = expected.numerator;
  submitInput(operation);
  expect(app.getState().established.operation.proposed).toEqual(expected);
  expect(app.getState().beat).toBe('resolve');
  activeControls(host).querySelector('.control-btn').click();
  expect(app.getState().status).toBe('resolved');
  expect(root.querySelector('.app-next-button').hasAttribute('hidden')).toBe(false);
  root.querySelector('.app-next-button').click();
  const next = app.getState();
  expect(next.taskContext.itemId).toBe(type.items[type.items.findIndex((item) => item.id === state.taskContext.itemId) + 1].id);
  expect(next.revision).toBe(0);
  expect(next.status).toBe('active');
  expect(next.support.label).toBe(state.support.label);
  expect(document.activeElement).toBe(root.querySelector('.app-episode'));
  root.querySelector('.app-restart-button').click();
  expect(app.getState().taskContext.itemId).toBe(next.taskContext.itemId);
  expect(app.getState().revision).toBe(0);
  expect(app.getState().beat).toBe('encounter');
}

describe('Plan 35 mounted reusable recipes', () => {
  afterEach(() => { teardownMockDOM(); });

  it('activates the exact live set@7 and keeps test-only hold-outs unreachable', () => {
    expect(PLAN18_PRACTICE_TYPES_V6[0].setRevision).toBe('6');
    expect(PLAN18_PRACTICE_TYPES_V6[0].items).toHaveLength(13);
    expect(type.setRevision).toBe(PLAN35_ADDITION_RECIPE_PRACTICE_SET.revision);
    expect(type.items).toHaveLength(21);
    expect(type.items.map((item) => item.id)).toEqual(PLAN35_ADDITION_RECIPE_PRACTICE_SET.itemIds);
    expect(type.items.some((item) => PLAN35_DATA_ONLY_HOLDOUT_SET.itemIds.includes(item.id))).toBe(false);
    expect(type.items.filter((item) => item.episodeDefinitionId === PLAN35_RECIPE_DEFINITION_ID)).toHaveLength(13);
  });

  it.each([
    ['construct', 'plan35-construct-half-fifth-10', 'visual', 'high'],
    ['construct', 'plan35-construct-three-fifths-third-30', 'linear', 'medium'],
    ['inspect', 'plan35-inspect-third-eighth-24', 'linear', 'high'],
    ['inspect', 'plan35-inspect-fifth-third-30', 'visual', 'medium'],
    ['identify', 'plan35-identify-half-three-tenths-10', 'visual', 'high'],
    ['identify', 'plan35-identify-third-five-twelfths-12', 'linear', 'medium'],
  ])('mounts %s target task %s in %s view with %s support through recovery, finish, Next and reset', (recipe, itemId, view, support) => {
    const { app, document, root, host } = setupJourney({ itemId, view, support });
    const instance = app.getState().content;
    const task = app.getState().taskContext;
    expect(task.patternId).toBe(PLAN35_RECIPE_IDS[recipe]);
    expect(task.practiceSetRevision).toBe('7');
    expect(task.targetDenominator).toBe(type.items.find((item) => item.id === itemId).targetDenominator);
    const targetContext = root.querySelector('.active-beat-prompt-context');
    if (recipe === 'identify') {
      expect(targetContext).toBeNull();
      expect(root.textContent).not.toContain('Use twelfths.');
      expect(root.textContent).not.toMatch(/Use \d+ equal parts\./);
    } else {
      expect(targetContext?.textContent).toBe(`Use ${task.targetDenominator} equal parts.`);
    }
    root.querySelector(`${view === 'visual' ? '.app-visual-view' : '.app-linear-view'} .active-beat-controls .control-btn`).click();

    if (recipe === 'identify') {
      const target = task.requiredSides[0];
      const wrong = target === 'left' ? 'right' : 'left';
      const decideHelp = activeControls(host).querySelector('.app-secondary-button');
      decideHelp.click();
      expect(root.textContent).toContain(`Compare each bottom number with ${task.targetDenominator}.`);
      expect(activeControls(host).querySelector('fieldset legend').textContent).toBe('Which fraction needs a different denominator?');
      expect(activeControls(host).querySelectorAll('h2')).toHaveLength(0);
      activeControls(host).querySelectorAll('.nested-side-choice')[wrong === 'left' ? 0 : 1].click();
      expect(app.getState().lastRecovery.classification.kind).toBe('side-choice-needs-retry');
      expect(root.textContent).toContain(`already has ${task.targetDenominator} equal parts`);
      activeControls(host).querySelectorAll('.nested-side-choice')[target === 'left' ? 0 : 1].click();
      expect(document.activeElement).toBe(transformInput(host, target));
      expect(root.querySelector('.app-replay-button').hidden).toBe(true);
    }

    if (recipe === 'inspect') {
      const help = activeControls(host).querySelector('.app-secondary-button');
      help.click();
      expect(root.textContent).toContain('The top and bottom must use the same multiplier to keep the amount.');
      expect(root.textContent).not.toMatch(/correct|incorrect|answer/i);
      help.click();
    }

    for (const side of task.requiredSides) {
      if (recipe === 'inspect') {
        const candidate = task.candidates[side];
        const isValid = equalFractions(mathematical(candidate), mathematical(instance.operands[side].initialForm));
        if (!isValid) {
          const keep = [...activeControls(host).querySelectorAll('button')].find((button) => (
            button.getAttribute('aria-label') === `Keep new fraction ${candidate.numerator} over ${candidate.denominator}`
          ));
          keep.click();
          expect(app.getState().lastRecovery.classification.kind).toBe('false-candidate-kept');
          const change = activeControls(host).querySelector('.inspect-change-button');
          change.click();
          let input = transformInput(host, side);
          expect(document.activeElement).toBe(input);
          const correct = expectedEquivalent(instance, side, task.targetDenominator).numerator;
          input.value = '0';
          submitInput(input);
          expect(app.getState().lastRecovery).not.toBeNull();
          input = transformInput(host, side);
          input.value = correct;
          submitInput(input);
        } else {
          [...activeControls(host).querySelectorAll('button')].find((button) => (
            button.getAttribute('aria-label') === `Keep new fraction ${candidate.numerator} over ${candidate.denominator}`
          )).click();
        }
      } else {
        const help = activeControls(host).querySelector('.app-secondary-button');
        help.click();
        expect(app.getState().supportHistory.at(-1).type).toBe('task-help-request');
        expect(root.textContent).toContain(`× ? = ${task.targetDenominator}`);
        if (recipe === 'identify') expect(root.textContent).not.toContain('Compare each bottom number');
        const multiplier = host().querySelector(`#${view === 'visual' ? 'transform' : 'linear-transform'}-help-multiplier-${side}`);
        expect(multiplier).not.toBeNull();
        multiplier.value = '1';
        multiplier.parentNode.parentNode.querySelector('.control-submit-btn').click();
        expect(app.getState().supportHistory.at(-1).classification).toBe('incorrect');
        expect(app.getState().established.conversions[side]).toBeNull();
        const rightMultiplier = BigInt(task.targetDenominator) / BigInt(instance.operands[side].initialForm.denominator);
        const multiplierAgain = host().querySelector(`#${view === 'visual' ? 'transform' : 'linear-transform'}-help-multiplier-${side}`);
        multiplierAgain.value = rightMultiplier.toString();
        multiplierAgain.parentNode.parentNode.querySelector('.control-submit-btn').click();
        const input = transformInput(host, side);
        const correct = expectedEquivalent(instance, side, task.targetDenominator).numerator;
        input.value = String(Number(correct) + 1);
        submitInput(input);
        expect(app.getState().lastRecovery?.beat).toBe('transform');
        const retryInput = transformInput(host, side);
        retryInput.value = correct;
        submitInput(retryInput);
      }
    }

    if (recipe === 'identify') {
      const side = task.requiredSides[0];
      const replay = root.querySelector('.app-replay-button');
      expect(replay.hidden).toBe(false);
      replay.click();
      expect(app.getState().replayHistory.some((entry) => entry.type === 'replay')).toBe(true);
      expect(replay.getAttribute('aria-pressed')).toBe('true');
      expect(app.getState().established.conversions[side]).not.toBeNull();
      expect(app.getState().established.conversions[side === 'left' ? 'right' : 'left']).toBeNull();
    } else {
      expect(root.querySelector('.app-replay-button').hidden).toBe(true);
    }
    finishJourney(app, root, host, document);
    app.destroy();
  });
});
