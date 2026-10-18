import { PLAN35_PRACTICE_TYPES_V7 } from '../../src/app/practice-types.js';
import { PLAN35_ADDITION_RECIPE_RECORDS, PLAN35_RECIPE_IDS } from '../../src/content/data/plan35-addition-recipe-records.js';
import { resolveCuratedFixture } from '../../src/content/authored-content-catalog.js';
import { addAtCommonDenominator, convertToDenominator, createFraction, equalFractions } from '../../src/math/index.js';

const TYPE = PLAN35_PRACTICE_TYPES_V7.find((entry) => entry.id === 'sum-under-one');
const RECORDS = new Map(PLAN35_ADDITION_RECIPE_RECORDS.map((record) => [record.itemId, record]));
const PLAN35_DEFINITION = 'phase-3-reusable-addition-recipes';

function action(method, target, extra = {}) { return { method, target, ...extra }; }
function fraction(form) { return createFraction(BigInt(form.numerator), BigInt(form.denominator)); }

function formsFor(item, fixture, denominator) {
  const target = BigInt(denominator);
  const left = convertToDenominator(fraction(fixture.left), target);
  const right = convertToDenominator(fraction(fixture.right), target);
  const total = addAtCommonDenominator(fraction(fixture.left), fraction(fixture.right), target);
  return { left, right, total };
}

function appendPlan35Recipe(actions, { item, record, fixture, view, index }) {
  const host = view === 'visual' ? '.app-visual-view' : '.app-linear-view';
  const control = `${host} .active-beat-controls`;
  const input = (id) => `${host} #${view === 'linear' ? 'linear-' : ''}${id}`;
  const submit = (description) => actions.push(action('click', `${host} .control-submit-btn`, { description }));
  const append = (method, target, description, extra = {}) => actions.push(action(method, target, { description, ...extra }));
  const denominator = item.targetDenominator;
  const { left, right, total } = formsFor(item, fixture, denominator);
  const numerators = { left: String(left.numerator), right: String(right.numerator) };
  const recipe = item.patternId;

  append('click', `${control} .control-btn`, `Plan35 ${index + 1}: acknowledge ${recipe} encounter (${item.id})`);
  if (recipe === PLAN35_RECIPE_IDS.identify) {
    const requiredSide = record.requiredSide;
    append('click', `${host} .nested-side-choice >> nth=${requiredSide === 'left' ? 0 : 1}`, `Plan35 ${index + 1}: identify required ${requiredSide} side`);
  }

  for (const side of record.requiredSides) {
    if (recipe === PLAN35_RECIPE_IDS.inspect) {
      const candidate = record.candidates[side];
      const exact = equalFractions(fraction(candidate), fraction({ numerator: numerators[side], denominator }));
      if (exact) {
        append('click', `${control} button[aria-label="Keep new fraction ${candidate.numerator} over ${candidate.denominator}"]`, `Plan35 ${index + 1}: keep valid ${side} candidate`);
      } else {
        append('click', `${control} .inspect-change-button`, `Plan35 ${index + 1}: repair false ${side} candidate`);
        append('fill', input(`transform-num-input-${side}`), `Plan35 ${index + 1}: enter exact ${side} equivalent`, { value: numerators[side] });
        submit(`Plan35 ${index + 1}: submit exact ${side} repair`);
      }
    } else {
      append('fill', input(`transform-num-input-${side}`), `Plan35 ${index + 1}: enter exact ${side} equivalent`, { value: numerators[side] });
      submit(`Plan35 ${index + 1}: submit exact ${side} conversion`);
    }
  }
  if (recipe === PLAN35_RECIPE_IDS.identify) {
    append('click', '.app-replay-button', `Plan35 ${index + 1}: replay the required conversion`);
    append('click', '.app-replay-button', `Plan35 ${index + 1}: return from conversion Replay`);
  }
  append('fill', input('operate-sum-input'), `Plan35 ${index + 1}: enter exact operation result`, { value: String(total.numerator) });
  submit(`Plan35 ${index + 1}: submit exact operation result`);
  append('click', `${control} .control-btn`, `Plan35 ${index + 1}: finish completed recipe task`);
  if (index < TYPE.items.length - 1) append('click', '.app-next-button', `Plan35 ${index + 1}: advance only after completion`);
}

function appendLegacy(actions, { item, fixture, view, index, supportProfile }) {
  const host = view === 'visual' ? '.app-visual-view' : '.app-linear-view';
  const controls = `${host} .active-beat-controls`;
  const append = (method, target, description, extra = {}) => actions.push(action(method, target, { description, ...extra }));
  const target = item.targetDenominators?.[0] ?? item.targetDenominator;
  if (!target) throw new Error(`Plan35 route helper has no selected target for legacy item ${item.id}`);
  const { left, right, total } = formsFor(item, fixture, target);
  append('click', `${controls} .control-btn`, `Plan35 ${index + 1}: acknowledge legacy encounter (${item.id})`);
  append('click', `${controls} .control-choice-btn >> nth=1`, `Plan35 ${index + 1}: notice unlike units`);
  if (supportProfile === 'medium-support') {
    append('fill', `${host} input.control-numeric-input`, `Plan35 ${index + 1}: enter authored common denominator`, { value: String(target) });
    append('click', `${controls} .control-submit-btn`, `Plan35 ${index + 1}: submit denominator`);
  } else {
    append('click', `${controls} .control-choice-btn >> nth=0`, `Plan35 ${index + 1}: select authored common denominator`);
  }
  for (const [side, form] of [['left', left], ['right', right]]) {
    append('fill', `${host} input.control-numeric-input`, `Plan35 ${index + 1}: enter ${side} equivalent`, { value: String(form.numerator) });
    append('click', `${host} .control-submit-btn`, `Plan35 ${index + 1}: submit ${side} equivalent`);
  }
  append('fill', `${host} input.control-numeric-input`, `Plan35 ${index + 1}: enter exact operation result`, { value: String(total.numerator) });
  append('click', `${host} .control-submit-btn`, `Plan35 ${index + 1}: submit exact operation result`);
  append('click', `${controls} .control-btn`, `Plan35 ${index + 1}: finish legacy task`);
  append('clickEquivalentChoice', `${host} ${view === 'linear' ? '.linear-matching-choice-btn' : '.matching-choice-btn'}`, `Plan35 ${index + 1}: reflect on first operand`, {
    numerator: String(left.numerator), denominator: String(left.denominator),
  });
  if (index < TYPE.items.length - 1) append('click', '.app-next-button', `Plan35 ${index + 1}: advance only after completion`);
}

/** Build visible learner actions for the exact live v7 set; no app state injection. */
export function buildPlan35LiveSetActions({ view, supportProfile }) {
  if (!['visual', 'linear'].includes(view)) throw new TypeError('Plan35 route view must be visual or linear');
  if (!['high-support', 'medium-support'].includes(supportProfile)) throw new TypeError('Plan35 support must be registered');
  if (TYPE?.setRevision !== '7' || TYPE.items.length !== 21) throw new Error('Plan35 helper requires the exact registered set@7');
  const actions = [];
  TYPE.items.forEach((item, index) => {
    const fixture = resolveCuratedFixture(item.fixtureId, item.authoringRevision);
    if (!fixture) throw new Error(`missing exact Plan35 route fixture ${item.fixtureId}@${item.authoringRevision}`);
    if (item.episodeDefinitionId === PLAN35_DEFINITION) {
      const record = RECORDS.get(item.id);
      if (!record) throw new Error(`missing exact Plan35 recipe association ${item.id}`);
      appendPlan35Recipe(actions, { item, record, fixture, view, index });
    } else {
      appendLegacy(actions, { item, fixture, view, index, supportProfile });
    }
  });
  actions.push(action('assert', '.app-navigation-notice', 'Plan35 set is exhausted after the 21st learner-completed task', {
    assertions: [
      { type: 'containsText', target: '.app-navigation-notice', value: 'You’ve tried every problem in this set.' },
      { type: 'notHasSelector', target: '.app-next-button:not([hidden])' },
    ],
  }));
  actions.push(action('click', '.app-return-button', 'Return after completing the live set'));
  actions.push(action('click', '.app-practice-button', 'Re-enter the live set'));
  actions.push(action('assert', '.app-episode', 'Re-entry begins from the live set first item', {
    assertions: [
      { type: 'containsText', target: '.active-beat-prompt-context', value: 'Use twelfths.' },
    ],
  }));
  return actions;
}
