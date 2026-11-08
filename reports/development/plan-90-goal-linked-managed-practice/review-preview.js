import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import { createFractionFlowApp } from '../../../src/app/app.js';
import { selectPlan90ComparisonDistanceReview } from '../../../src/app/magnitude-session.js';

// Review-only injection. This fixture does not claim production fit eligibility.
const params = new URLSearchParams(location.search);
const eligible = params.get('pool') !== 'empty';
let failMount = false;
window.plan90FailMount = value => { failMount = value; };
window.plan90Review = createFractionFlowApp({ root: document.querySelector('#app'), presentationMode: 'instant-test',
  sessionTestHooks: { selectManifest: () => selectPlan90ComparisonDistanceReview(() => eligible),
    unavailableNotice: 'No practice fits this screen right now. Try a larger window or smaller text, or choose another practice.',
    afterDisplay: () => { if (failMount) throw new Error('review-forced post-mount failure'); } },
}).mount();
