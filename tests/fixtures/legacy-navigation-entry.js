import '../../src/app/styles.css';
import '../../src/styles/render.css';
import { createFractionFlowApp } from '../../src/app/app.js';
import { PRACTICE_TYPES } from '../../src/app/practice-types.js';

const root = document.querySelector('#app');
if (!root) throw new Error('Legacy navigation fixture root is missing');

createFractionFlowApp({
  root,
  practiceTypes: PRACTICE_TYPES,
  navigationMode: 'legacy-acknowledged',
}).mount();
