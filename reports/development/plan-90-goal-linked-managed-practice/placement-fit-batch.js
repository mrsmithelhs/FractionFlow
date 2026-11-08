import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import { createFractionFlowApp } from '../../../src/app/app.js';
import { PLAN39_BAR_TO_LINE_PRACTICE_TYPE } from '../../../src/app/practice-types.js';
import { PLAN37_BAR_TO_LINE_BRIDGE_RECORDS } from '../../../src/content/data/plan37-bar-to-line-bridge-records.js';

const query = new URLSearchParams(location.search);
const itemId = query.get('item');
const supportId = query.get('support');
const startView = query.get('view');
const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS.find(item => item.itemId === itemId);
if (!['bridge-06-three-eighths-8', 'bridge-02-fourth-4'].includes(itemId)
  || !record || !['high-support', 'medium-support'].includes(supportId)
  || !['visual', 'linear'].includes(startView)) {
  throw new Error('Expected an adopted placement candidate, registered support level and view.');
}
const item = PLAN39_BAR_TO_LINE_PRACTICE_TYPE.items.find(candidate => candidate.id === itemId);
if (!item || item.episodeDefinitionRevision !== '2') throw new Error('Exact Plan 39 definition @2 association missing.');
const practiceType = Object.freeze({ ...PLAN39_BAR_TO_LINE_PRACTICE_TYPE, items: Object.freeze([item]) });
const app = createFractionFlowApp({ root: document.querySelector('#app'), practiceTypes: [practiceType], presentationMode: 'instant-test' });
app.mount();
document.querySelector('.app-gear-button').click();
const support = document.querySelector(`[data-support-id="${supportId}"]`);
if (!support) throw new Error('Requested support option is unavailable.');
support.click();
if (app.getSelectedSupportLevel().id !== supportId) throw new Error('Requested support was not selected.');
const chooser = document.querySelector('[data-entry-chooser]');
if (chooser?.getAttribute('aria-expanded') === 'false') chooser.click();
const launch = document.querySelector('[data-entry-role="browse"][data-practice-type="bar-to-line-same-amount"]');
if (!launch) throw new Error('Public standalone placement chooser route missing.');
launch.click();
if (startView === 'linear') document.querySelector('.app-view-toggle')?.click();
window.placementBatch = { itemId, supportId, startView, definitionRevision: item.episodeDefinitionRevision, app, record };
