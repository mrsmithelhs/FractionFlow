import { PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE } from '../../src/app/practice-types.js';
import {
  PLAN40_RECIPE_IDS,
  PLAN40_SUBTRACTION_RECIPE_RECORDS,
} from '../../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import { resolveCuratedFixture } from '../../src/content/authored-content-catalog.js';
import {
  convertToDenominator,
  createFraction,
  equalFractions,
  subtractAtCommonDenominator,
} from '../../src/math/index.js';

const TYPE = PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE;
const RECORDS = new Map(PLAN40_SUBTRACTION_RECIPE_RECORDS.map((record) => [record.itemId, record]));

function action(method, target, extra = {}) { return { method, target, ...extra }; }
function fraction(form) { return createFraction(BigInt(form.numerator), BigInt(form.denominator)); }

function formsFor(item, fixture, denominator) {
  const target = BigInt(denominator);
  const left = convertToDenominator(fraction(fixture.left), target);
  const right = convertToDenominator(fraction(fixture.right), target);
  const difference = subtractAtCommonDenominator(fraction(fixture.left), fraction(fixture.right), target);
  return { left, right, difference };
}

function appendPlan40Recipe(actions, { item, record, fixture, view, index }) {
  const host = view === 'visual' ? '.app-visual-view' : '.app-linear-view';
  const control = `${host} .active-beat-controls`;
  const input = (id) => `${host} #${view === 'linear' ? 'linear-' : ''}${id}`;
  const submit = (description) => actions.push(action('click', `${host} .control-submit-btn`, { description }));
  const append = (method, target, description, extra = {}) => actions.push(action(method, target, { description, ...extra }));
  const denominator = item.targetDenominator;
  const { left, right, difference } = formsFor(item, fixture, denominator);
  const numerators = { left: String(left.numerator), right: String(right.numerator) };
  const recipe = item.patternId;

  // 1. Encounter beat
  append('click', `${control} button`, `Plan40 ${index + 1}: acknowledge ${recipe} encounter (${item.id})`);

  // 2. Decide beat (identify recipe only)
  if (recipe === PLAN40_RECIPE_IDS.identify) {
    const requiredSide = record.requiredSide;
    append('click', `${host} .nested-side-choice >> nth=${requiredSide === 'left' ? 0 : 1}`, `Plan40 ${index + 1}: identify required ${requiredSide} side`);
  }

  // 3. Transform beat
  const requiredSides = recipe === PLAN40_RECIPE_IDS.identify ? [record.requiredSide] : ['left', 'right'];
  for (const side of requiredSides) {
    if (recipe === PLAN40_RECIPE_IDS.inspect) {
      const candidate = record.candidates[side];
      const exact = equalFractions(fraction(candidate), fraction({ numerator: numerators[side], denominator }));
      if (exact) {
        append('click', `${control} button[aria-label="Keep new fraction ${candidate.numerator} over ${candidate.denominator}"]`, `Plan40 ${index + 1}: keep valid ${side} candidate`);
      } else {
        append('click', `${control} .inspect-change-button`, `Plan40 ${index + 1}: repair false ${side} candidate`);
        append('fill', input(`transform-num-input-${side}`), `Plan40 ${index + 1}: enter exact ${side} equivalent`, { value: numerators[side] });
        submit(`Plan40 ${index + 1}: submit exact ${side} repair`);
      }
    } else {
      append('fill', input(`transform-num-input-${side}`), `Plan40 ${index + 1}: enter exact ${side} equivalent`, { value: numerators[side] });
      submit(`Plan40 ${index + 1}: submit exact ${side} conversion`);
    }
  }

  // 4. Operate beat
  append('fill', input('operate-fraction-numerator-input'), `Plan40 ${index + 1}: enter exact difference numerator`, { value: String(difference.numerator) });
  append('fill', input('operate-fraction-denominator-input'), `Plan40 ${index + 1}: enter exact difference denominator`, { value: String(difference.denominator) });
  if (view === 'linear' && index === 0) {
    actions.push(action('screenshot', null, {
      file: 'reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/linear-operate-360x752.png',
      caption: 'Unlike subtraction item 1 linear operate beat at 360x752',
      measureLayout: true,
      description: 'Plan40 1: capture linear operate layout at 360x752',
    }));
  }
  submit(`Plan40 ${index + 1}: submit exact difference result`);

  // 5. Resolve beat
  append('click', `${control} button`, `Plan40 ${index + 1}: finish completed recipe task`);

  // 6. Navigation
  if (index < TYPE.items.length - 1) {
    append('click', '.app-next-button', `Plan40 ${index + 1}: advance only after completion`);
  }
}

export function buildPlan40SubtractionSetActions({ view, supportProfile }) {
  if (!['visual', 'linear'].includes(view)) throw new TypeError('Plan40 route view must be visual or linear');
  if (!['high-support', 'medium-support'].includes(supportProfile)) throw new TypeError('Plan40 support must be registered');
  if (TYPE?.setRevision !== '1' || TYPE.items.length !== 9) throw new Error('Plan40 helper requires the exact registered set@1 with 9 items');
  const actions = [];
  TYPE.items.forEach((item, index) => {
    const fixture = resolveCuratedFixture(item.fixtureId, item.authoringRevision);
    if (!fixture) throw new Error(`missing exact Plan40 route fixture ${item.fixtureId}@${item.authoringRevision}`);
    const record = RECORDS.get(item.id);
    if (!record) throw new Error(`missing exact Plan40 recipe association ${item.id}`);
    appendPlan40Recipe(actions, { item, record, fixture, view, index });
  });

  // Exhaustion assertion on final item
  actions.push(action('assert', '.app-navigation-notice', {
    assertions: [
      { type: 'containsText', target: '.app-navigation-notice', value: 'You’ve tried every problem in this set.' },
      { type: 'notHasSelector', target: '.app-next-button:not([hidden])' },
    ],
    description: 'Plan40 set is exhausted after the 9th learner-completed task',
  }));

  // Return to entry page
  actions.push(action('click', '.app-return-button', {
    description: 'Return to entry after completing the unlike-subtraction set',
  }));
  actions.push(action('assertFocused', '.app-entry-title', {
    description: 'Verify focus on entry title after return',
  }));

  // Re-enter the set
  actions.push(action('click', '[data-practice-type="unlike-denominator-subtraction"]', {
    description: 'Re-enter unlike-subtraction practice set',
  }));
  if (view === 'linear') {
    actions.push(action('click', '.app-view-controls .app-secondary-button', {
      description: 'Switch to linear path on re-entry',
    }));
  }
  const host = view === 'visual' ? '.app-visual-view' : '.app-linear-view';
  actions.push(action('assert', host, {
    assertions: [
      { type: 'containsText', target: `${host} .active-beat-controls button`, value: 'Next' },
      { type: 'containsText', target: `${host} .active-beat-prompt`, value: 'Look at these two fractions.' },
      { type: 'containsText', target: `${host} .symbolic-expression`, value: '1' },
      { type: 'containsText', target: `${host} .symbolic-expression`, value: '2' },
      { type: 'containsText', target: `${host} .symbolic-expression`, value: '5' },
      { type: 'notHasSelector', target: `${host} .recovery-feedback` },
      { type: 'notHasSelector', target: `${host} [id$="-subtraction-task-help"]` },
      { type: 'notHasSelector', target: `${host} input` },
    ],
    description: 'Re-entry resets to fresh item 1 identity (1/2 - 1/5) with cleared draft, help, and recovery',
  }));

  return actions;
}
