import './styles.css';
import '../styles/render.css';
import { createFractionFlowApp } from './app.js';
import { createPlan92PracticeRecord } from './plan92-practice-record.js';
import { createPlan92RecordPanel } from './plan92-record-panel.js';

const root = document.querySelector('#app');
if (!root) throw new Error('FractionFlow app root is missing');

const practiceRecord = createPlan92PracticeRecord();
let panel;
createFractionFlowApp({ root, practiceRecordHooks: {
  ...practiceRecord.hooks,
  mountPracticeRecord(host) { panel = createPlan92RecordPanel({ root: host, bridge: practiceRecord.bridge }); void panel.refresh(); },
  setPracticeRecordNotice: handler => practiceRecord.setNotice(handler),
  destroyPracticeRecord() { panel?.destroy(); practiceRecord.destroy(); },
} }).mount();
