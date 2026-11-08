import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import { createFractionFlowApp } from '../../../src/app/app.js';
import { selectManagedComparisonDistance } from '../../../src/app/magnitude-session.js';
import { measureReviewArea, classifyReviewArea } from './review-fit.js';

// Review-only injection. This fixture does not claim production fit eligibility.
const params = new URLSearchParams(location.search);
const eligible = params.get('pool') !== 'empty';
const measured = params.get('fit') === 'measured';
let failMount = false;
let eligibleIds = null, fitVersion = 0;
window.plan90FailMount = value => { failMount = value; };
window.plan90SetEligibility = ids => { eligibleIds = ids; fitVersion += 1; };
window.addEventListener('resize', () => { fitVersion += 1; });
const fit = () => measured ? measureReviewArea(document.querySelector('#app')) : null;
window.plan90Fit = fit;
window.plan90Review = createFractionFlowApp({ root: document.querySelector('#app'), presentationMode: 'instant-test',
  sessionTestHooks: { selectManifest: () => selectManagedComparisonDistance(() => eligible && (!measured || classifyReviewArea(fit()))),
    unavailableNotice: 'No practice fits this screen right now. Try a larger window or smaller text, or choose another practice.',
    eligibleForNext: entry => (eligibleIds === null || eligibleIds.includes(entry.itemId)) && (!measured || classifyReviewArea(fit())),
    fitRevision: () => JSON.stringify([fitVersion, fit()]),
    afterDisplay: () => { if (failMount) throw new Error('review-forced post-mount failure'); } },
}).mount();
