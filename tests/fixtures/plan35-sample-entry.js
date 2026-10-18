import '../../src/app/styles.css';
import '../../src/styles/render.css';
import { createFractionFlowApp } from '../../src/app/app.js';
import { PRACTICE_TYPES } from '../../src/app/practice-types.js';

const root = document.querySelector('#app');
if (!root) throw new Error('Plan 35 sample fixture root is missing');
const live = PRACTICE_TYPES.find((entry) => entry.id === 'sum-under-one');
const sampledIds = new Set([
  'plan35-construct-half-fifth-10',
  'plan35-construct-three-fifths-third-30',
  'plan35-inspect-third-eighth-24',
  'plan35-inspect-fifth-third-30',
  'plan35-identify-half-three-tenths-10',
  'plan35-identify-three-tenths-half-10',
  'plan35-identify-third-five-twelfths-12',
  'plan35-identify-five-twelfths-third-12',
]);
if (live?.setRevision !== '7') throw new Error('Plan 35 sample must derive from live set@7');
const params = new URLSearchParams(window.location.search);
const group = params.get('group');
const groupIds = group === 'identify'
  ? new Set([...sampledIds].filter((id) => id.includes('identify')))
  : group === 'inspect'
    ? new Set([...sampledIds].filter((id) => id.includes('inspect')))
    : group === 'construct30'
      ? new Set(['plan35-construct-three-fifths-third-30'])
    : sampledIds;
const sample = Object.freeze({ ...live, items: Object.freeze(live.items.filter((item) => groupIds.has(item.id))) });
if (sample.items.length !== groupIds.size) throw new Error('Plan 35 sample item manifest does not match live registry');
createFractionFlowApp({ root, practiceTypes: [sample] }).mount();
