import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import { createFractionFlowApp } from '../../../src/app/app.js';
import { PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE } from '../../../src/app/practice-types.js';
import { PLAN40_SUBTRACTION_RECIPE_RECORDS } from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';

const allowed = new Set([
  'plan40-identify-one-half-one-eighth-8',
  'plan40-identify-two-thirds-five-twelfths-12',
  'plan76-identify-seven-eighths-one-fourth-8',
  'plan40-inspect-two-thirds-one-fourth-12',
  'plan76-inspect-three-fourths-one-fifth-20',
  'plan40-construct-half-fifth-10',
  'plan76-construct-five-sixths-one-tenth-30',
  'plan40-construct-five-sixths-three-eighths-24',
]);
const itemId = new URLSearchParams(location.search).get('item');
const supportId = new URLSearchParams(location.search).get('support');
const view = new URLSearchParams(location.search).get('view');
if (!allowed.has(itemId) || !['high-support', 'medium-support'].includes(supportId) || !['visual', 'linear'].includes(view)) throw new Error('Expected an exact Plan 92 candidate, support and view.');
const base = PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE;
const item = base.items.find(candidate => candidate.id === itemId);
if (!item) throw new Error(`Public subtraction route does not contain ${itemId}.`);
const app = createFractionFlowApp({ root: document.querySelector('#app'), practiceTypes: [Object.freeze({ ...base, items: Object.freeze([item]) })], presentationMode: 'instant-test' }).mount();
document.querySelector('.app-gear-button')?.click();
document.querySelector(`[data-support-id="${supportId}"]`)?.click();
const chooser = document.querySelector('[data-entry-chooser]');
if (chooser?.getAttribute('aria-expanded') === 'false') chooser.click();
document.querySelector(`[data-entry-role="browse"][data-practice-type="${base.id}"]`)?.click();
if (view === 'linear') document.querySelector('.app-view-toggle')?.click();
window.fit92 = { app, record: PLAN40_SUBTRACTION_RECIPE_RECORDS.find(record => record.itemId === itemId), itemId, supportId, view };
