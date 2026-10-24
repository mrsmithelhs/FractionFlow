import '../../src/app/styles.css';
import '../../src/styles/render.css';
import { createFractionFlowApp } from '../../src/app/app.js';
import { PLAN18_PRACTICE_TYPES_V6 } from '../../src/app/practice-types.js';

const root = document.querySelector('#app');
if (!root) throw new Error('FractionFlow Plan 18 historical fixture root is missing');

const type = PLAN18_PRACTICE_TYPES_V6.find((entry) => entry.id === 'sum-under-one');
if (type?.setRevision !== '6' || type.items.length !== 13) {
  throw new Error('Plan 18 historical fixture did not load the pinned set@6');
}

createFractionFlowApp({ root, practiceTypes: PLAN18_PRACTICE_TYPES_V6, navigationMode: 'legacy-acknowledged' }).mount();
