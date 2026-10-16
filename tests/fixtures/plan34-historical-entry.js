import '../../src/app/styles.css';
import '../../src/styles/render.css';
import { createFractionFlowApp } from '../../src/app/app.js';
import { LEGACY_PRACTICE_TYPES_V4 } from '../../src/app/practice-types.js';

const root = document.querySelector('#app');
if (!root) throw new Error('FractionFlow historical fixture root is missing');

if (LEGACY_PRACTICE_TYPES_V4[0]?.setRevision !== '4'
  || LEGACY_PRACTICE_TYPES_V4[0]?.items?.length !== 11) {
  throw new Error('FractionFlow historical fixture did not load the pinned v4 practice set');
}

createFractionFlowApp({ root, practiceTypes: LEGACY_PRACTICE_TYPES_V4 }).mount();
