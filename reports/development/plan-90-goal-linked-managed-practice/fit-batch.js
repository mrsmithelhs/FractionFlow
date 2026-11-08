import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import { createFractionFlowApp } from '../../../src/app/app.js';
import { PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE, PLAN51_DISTANCE_PRACTICE_TYPE } from '../../../src/app/practice-types.js';
import { PLAN45_COMPARISON_RECORDS } from '../../../src/content/data/plan45-symbolic-fraction-comparison-records.js';
import { PLAN51_DISTANCE_RECORDS } from '../../../src/content/data/plan51-distance-records.js';

const records = new Map([...PLAN45_COMPARISON_RECORDS, ...PLAN51_DISTANCE_RECORDS].map(record => [record.itemId, record]));
const query = new URLSearchParams(location.search);
const itemId = query.get('item');
const supportId = query.get('support');
const startView = query.get('view');
const record = records.get(itemId);
if (!record || !['high-support', 'medium-support'].includes(supportId) || !['visual', 'linear'].includes(startView)) {
  throw new Error('Expected exact item, support and view query parameters.');
}
const distance = itemId.startsWith('distance-');
const base = distance ? PLAN51_DISTANCE_PRACTICE_TYPE : PLAN45_SYMBOLIC_COMPARISON_PRACTICE_TYPE;
const definition = base.items.find(item => item.id === itemId);
if (!definition) throw new Error(`Public practice type does not contain ${itemId}.`);
const practiceType = Object.freeze({ ...base, items: Object.freeze([definition]) });
const app = createFractionFlowApp({ root: document.querySelector('#app'), practiceTypes: [practiceType], presentationMode: 'instant-test' });
app.mount();

function ensureChooser() {
  const chooser = document.querySelector('[data-entry-chooser]');
  if (chooser?.getAttribute('aria-expanded') === 'false') chooser.click();
}
const gear = document.querySelector('.app-gear-button');
if (!gear) throw new Error('Support settings control missing.');
gear.click();
const support = document.querySelector(`[data-support-id="${supportId}"]`);
if (!support) throw new Error(`Support option missing: ${supportId}`);
support.click();
ensureChooser();
const launch = document.querySelector(`[data-entry-role="browse"][data-practice-type="${base.id}"]`);
if (!launch) throw new Error(`Public launch route missing for ${base.id}`);
launch.click();
if (startView === 'linear') document.querySelector('.app-view-toggle')?.click();
window.fitBatch = { itemId, supportId, startView, app, record, distance };
