import '../../src/app/styles.css';
import '../../src/styles/render.css';
import { createFractionFlowApp } from '../../src/app/app.js';
import { PRACTICE_TYPES, PLAN39_BAR_TO_LINE_V1_HISTORICAL_PRACTICE_TYPE } from '../../src/app/practice-types.js';

const root = document.querySelector('#app');
if (!root) throw new Error('Plan 39 historical revision-1 fixture root is missing');

const practiceTypes = PRACTICE_TYPES.map((practiceType) => (
  practiceType.id === PLAN39_BAR_TO_LINE_V1_HISTORICAL_PRACTICE_TYPE.id
    ? PLAN39_BAR_TO_LINE_V1_HISTORICAL_PRACTICE_TYPE
    : practiceType
));
const historicalPlan39 = practiceTypes.find((practiceType) => practiceType.id === 'bar-to-line-same-amount');
if (historicalPlan39?.episodeDefinition?.revision !== '1'
  || historicalPlan39?.items.length !== 8
  || historicalPlan39?.items.some((item) => item.episodeDefinitionRevision !== '1')) {
  throw new Error('Plan 39 historical fixture did not load all eight revision-1 items');
}

createFractionFlowApp({ root, practiceTypes, navigationMode: 'legacy-acknowledged', entryMode: 'historical-flat' }).mount();
