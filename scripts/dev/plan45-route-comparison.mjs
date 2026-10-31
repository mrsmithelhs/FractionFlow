import { PLAN45_COMPARISON_RECORDS } from '../../src/content/data/plan45-symbolic-fraction-comparison-records.js';
import { compareFractions, createFraction } from '../../src/math/index.js';

function action(method, target, extra = {}) {
  return { method, target, ...extra };
}

function expectedRelation(record) {
  const toFraction = ({ numerator, denominator }) => createFraction(BigInt(numerator), BigInt(denominator));
  const result = compareFractions(toFraction(record.sourceForms.first), toFraction(record.sourceForms.second));
  return result < 0 ? '<' : result > 0 ? '>' : '=';
}

export function buildPlan45ComparisonActions({
  itemIndex = 0,
  routeId = `item-${itemIndex + 1}`,
  support = 'medium-support',
  model = 'first',
  inputMode = 'mouse',
  startView = 'visual',
  exerciseTextScale = false,
  exerciseResize = false,
  originalViewport = null,
} = {}) {
  const targetRecord = PLAN45_COMPARISON_RECORDS[itemIndex];
  if (!targetRecord) throw new RangeError(`Unknown Plan 45 browser evidence item index: ${itemIndex}`);
  if (!['first', 'second'].includes(model)) throw new RangeError(`Unknown Plan 45 source model: ${model}`);
  const actions = [];
  const host = (view) => `.app-${view}-view`;
  const interact = (target, description) => inputMode === 'touch'
    ? action('tap', target, { description })
    : inputMode === 'keyboard'
      ? action('keyboardActivate', target, {
        ...(target.includes('.plan45-relation-option input')
          ? { focusGroup: `${target.slice(0, target.indexOf('.plan45-relation-option input'))}.plan45-relation-option input` }
          : {}),
        description,
      })
      : action('click', target, { description });
  const screenshot = (view, name, state, layout = false) => action('screenshot', '', {
    file: `reports/development/plan-45-symbolic-fraction-comparison/evidence/screenshots/${routeId.toLowerCase()}-${name}.png`,
    caption: `Plan 45 ${state} at ${view} viewport`,
    description: `Capture ${state} in the ${view} view`,
    measureLayout: layout,
    scrollTop: state === 'initial',
    settleAnimations: true,
  });
  const assert = (target, description, assertions) => action('assert', target, { description, assertions });

  actions.push(interact('.app-gear-button', 'Open display and support settings'));
  actions.push(interact(`[data-support-id="${support}"]`, `Select ${support} support profile`));
  actions.push(interact('[data-practice-type="symbolic-fraction-comparison"]', 'Start Compare fractions'));
  if (startView === 'linear') actions.push(interact('.app-view-toggle', 'Switch to the linear view'));
  const initialHost = host(startView);
  if (itemIndex > 0) {
    for (let index = 0; index < itemIndex; index += 1) {
      const relation = expectedRelation(PLAN45_COMPARISON_RECORDS[index]);
      actions.push(interact(`${initialHost} .plan45-relation-option input[value="${relation}"]`, `Item ${index + 1}: choose exact relation`));
      actions.push(interact(`${initialHost} .plan45-check-button`, `Item ${index + 1}: check relation`));
      actions.push(interact(`${initialHost} .plan45-progression-button`, `Advance to item ${index + 2}`));
    }
  }
  const itemSelector = `.app-episode[data-current-item-id="${targetRecord.itemId}"]`;
  actions.push(assert(itemSelector, 'Assert the selected registered comparison item is mounted', [
    { type: 'hasSelector', target: itemSelector },
    { type: 'notHasSelector', target: '.plan45-model' },
    { type: 'notHasSelector', target: '[data-expected-relation], [data-correct="true"], [data-answer]' },
  ]));
  actions.push(assert(`${host(startView)} .plan45-relation-options`, 'Measure relation response target size before interaction', [
    { type: 'visibleGeometry', target: `${host(startView)} .plan45-relation-option`, minCount: 3, minWidth: 44, minHeight: 44 },
  ]));
  actions.push(screenshot(startView, `journey-${itemIndex + 1}-${startView}-initial`, 'initial', true));

  const beforeAcceptHost = host(startView);
  actions.push(interact(`${beforeAcceptHost} [data-plan45-focus-key="help-summary"]`, 'Open the optional help disclosure'));
  actions.push(interact(`${beforeAcceptHost} [data-plan45-focus-key="notation"]`, 'Request notation help'));
  actions.push(interact(`${beforeAcceptHost} [data-plan45-focus-key="reasoning"]`, 'Request the item reasoning cue'));
  actions.push(interact(`${beforeAcceptHost} [data-plan45-focus-key="model-${model}"]`, `Choose the ${model} source fraction model`));
  actions.push(assert(beforeAcceptHost, 'Assert exactly the chosen source model is shown before acceptance', [
    { type: 'hasSelector', target: `${beforeAcceptHost} .plan45-model, ${beforeAcceptHost} .plan45-linear-model` },
    { type: 'notHasSelector', target: `${beforeAcceptHost} .plan45-model-pair, ${beforeAcceptHost} .plan45-linear-model-pair` },
    ...(startView === 'visual' ? [{
      type: 'plan45ModelFidelity',
      models: [{
        side: model,
        numerator: targetRecord.sourceForms[model].numerator,
        denominator: targetRecord.sourceForms[model].denominator,
      }],
    }] : [{
      type: 'plan45LinearModel',
      side: model,
      numerator: targetRecord.sourceForms[model].numerator,
      denominator: targetRecord.sourceForms[model].denominator,
    }]),
  ]));
  actions.push(screenshot(startView, `journey-${itemIndex + 1}-${startView}-chosen-model`, 'chosen model', true));
  actions.push(interact(`${beforeAcceptHost} [data-plan45-focus-key="help-summary"]`, 'Close help while retaining the model choice'));
  actions.push(interact(`${beforeAcceptHost} [data-plan45-focus-key="help-summary"]`, 'Reopen help while retaining the model choice'));
  const rightRelation = expectedRelation(targetRecord);
  const wrongRelation = ['<', '=', '>'].find((candidate) => candidate !== rightRelation);
  actions.push(interact(`${beforeAcceptHost} .plan45-relation-option input[value="${wrongRelation}"]`, 'Select a relation to exercise local recovery'));
  actions.push(interact(`${beforeAcceptHost} .plan45-check-button`, 'Check the first relation'));
  actions.push(assert(beforeAcceptHost, 'Assert wrong response keeps one chosen source model and stays local', [
    { type: 'hasSelector', target: `${beforeAcceptHost} .plan45-recovery` },
    { type: 'notHasSelector', target: `${beforeAcceptHost} .plan45-model-pair, ${beforeAcceptHost} .plan45-linear-model-pair` },
  ]));
  actions.push(screenshot(startView, `journey-${itemIndex + 1}-${startView}-wrong`, 'wrong response', true));
  actions.push(interact(`${beforeAcceptHost} .plan45-relation-option input[value="${rightRelation}"]`, 'Revise the selected relation to the exact result'));
  if (exerciseResize && originalViewport) {
    actions.push(action('resizeViewport', '', { width: 360, height: 740, description: 'Resize with the selected relation and source model retained' }));
    if (exerciseTextScale) actions.push(action('textScale', beforeAcceptHost, { value: '200%', description: 'Scale visible learner text to 200%' }));
    actions.push(assert(beforeAcceptHost, 'Assert resize and 200% text scaling preserve the draft, chosen model, and no-overflow layout', [
      { type: 'hasSelector', target: `${beforeAcceptHost} .plan45-relation-option input[value="${rightRelation}"]:checked` },
      { type: 'hasSelector', target: `${beforeAcceptHost} .plan45-model, ${beforeAcceptHost} .plan45-linear-model` },
      { type: 'viewportLayout', requireNoHorizontalOverflow: true, selectors: {
        prompt: `${beforeAcceptHost} .plan45-prompt`,
        response: `${beforeAcceptHost} .plan45-response-region`,
      }, requireVisibleElements: true },
    ]));
    if (exerciseTextScale) {
      actions.push(action('scrollIntoView', `${beforeAcceptHost} .plan45-check-button`, { description: 'Bring the active Check control into view at 200% text scale' }));
      actions.push(assert(beforeAcceptHost, 'Assert the active Check control is visible at 200% text scale', [
        { type: 'viewportLayout', requireNoHorizontalOverflow: true, selectors: {
          activeControl: `${beforeAcceptHost} .plan45-check-button`,
        }, requireVisibleElements: true },
      ]));
      actions.push(screenshot(startView, `journey-${itemIndex + 1}-${startView}-200-percent-type`, '200 percent text scale', true));
      actions.push(action('textScale', beforeAcceptHost, { value: '100%', description: 'Restore the initial learner text scale' }));
    }
    actions.push(action('resizeViewport', '', { ...originalViewport, description: 'Restore the route viewport' }));
  }
  actions.push(interact('.app-view-toggle', `Switch to ${startView === 'visual' ? 'linear' : 'visual'} to verify draft persistence`));
  const acceptedView = startView === 'visual' ? 'linear' : 'visual';
  const acceptedHost = host(acceptedView);
  actions.push(assert(acceptedHost, 'Assert the selected relation draft persists through view change', [
    { type: 'hasSelector', target: `${acceptedHost} .plan45-relation-option input[value="${rightRelation}"]:checked` },
    { type: 'notHasSelector', target: `${acceptedHost} .plan45-model-pair, ${acceptedHost} .plan45-linear-model-pair` },
  ]));
  actions.push(interact(`${acceptedHost} .plan45-check-button`, 'Accept the revised relation'));
  actions.push(assert(acceptedHost, 'Assert accepted paired verification and direct local progression', [
    { type: 'hasSelector', target: `${acceptedHost} .plan45-expression` },
    { type: 'hasSelector', target: `${acceptedHost} .plan45-progression-button` },
    ...(acceptedView === 'visual' ? [{
      type: 'plan45ModelFidelity',
      models: ['first', 'second'].map((side) => ({
        side,
        numerator: targetRecord.sourceForms[side].numerator,
        denominator: targetRecord.sourceForms[side].denominator,
      })),
    }] : [{ type: 'hasSelector', target: `${acceptedHost} .plan45-linear-model-pair` }]),
  ]));
  actions.push(screenshot(acceptedView, `journey-${itemIndex + 1}-${acceptedView}-accepted`, 'accepted verification', true));
  if (itemIndex === PLAN45_COMPARISON_RECORDS.length - 1) {
    actions.push(interact(`${acceptedHost} .plan45-progression-button`, 'Return to practice start after final item'));
    actions.push(assert('.app-entry-page', 'Assert honest final return with no extra Finish step', [
      { type: 'hasSelector', target: '[data-practice-type="symbolic-fraction-comparison"]' },
      { type: 'notVisible', target: '.app-episode' },
    ]));
    actions.push(interact('[data-practice-type="symbolic-fraction-comparison"]', 'Re-enter a fresh comparison attempt'));
    actions.push(assert('.app-episode', 'Assert re-entry starts with no retained model choice or selected relation', [
      { type: 'notHasSelector', target: '.plan45-model, .plan45-linear-model, .plan45-relation-option input:checked' },
    ]));
  } else {
    actions.push(interact(`${acceptedHost} .plan45-progression-button`, 'Advance locally to a fresh comparison'));
    actions.push(assert('.app-episode', 'Assert Next presents a fresh item without duplicate header navigation', [
      { type: 'notHasSelector', target: '.plan45-recovery' },
      { type: 'hasSelector', target: '.app-next-button[hidden]' },
    ]));
  }
  actions.push(screenshot(acceptedView, `journey-${itemIndex + 1}-${acceptedView}-next`, 'fresh next item', true));
  return actions;
}
