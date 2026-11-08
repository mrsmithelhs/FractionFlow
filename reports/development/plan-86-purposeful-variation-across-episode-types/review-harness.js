// Local review only. Each launch selects one registered association explicitly.
import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import { createFractionFlowApp } from '../../../src/app/app.js';
import { PLAN35_PRACTICE_TYPES_V7, PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE } from '../../../src/app/practice-types.js';
import { PLAN35_ADDITION_RECIPE_RECORDS, PLAN35_ADDITION_RECIPE_PRACTICE_SET, PLAN86_ADDITION_REVIEW_SET } from '../../../src/content/data/plan35-addition-recipe-records.js';
import { PLAN40_SUBTRACTION_RECIPE_RECORDS, PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET, PLAN86_SUBTRACTION_REVIEW_SET } from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';

const cases = {
  'add-baseline': [PLAN35_PRACTICE_TYPES_V7.find(type => type.id === 'sum-under-one'), PLAN35_ADDITION_RECIPE_PRACTICE_SET, PLAN35_ADDITION_RECIPE_RECORDS, 'two-thirds-plus-one-fourth'],
  'add-variant': [PLAN35_PRACTICE_TYPES_V7.find(type => type.id === 'sum-under-one'), PLAN86_ADDITION_REVIEW_SET, PLAN35_ADDITION_RECIPE_RECORDS, 'plan86-add-inspect-two-thirds-one-fourth-12'],
  'subtract-baseline': [PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE, PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET, PLAN40_SUBTRACTION_RECIPE_RECORDS, 'plan40-construct-half-fifth-10'],
  'subtract-variant': [PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE, PLAN86_SUBTRACTION_REVIEW_SET, PLAN40_SUBTRACTION_RECIPE_RECORDS, 'plan86-subtract-inspect-half-fifth-10'],
};
const selected = cases[new URLSearchParams(location.search).get('case')];
if (!selected) throw new Error('Select a known Plan 86 review case.');
const [base, set, records, id] = selected;
if (!set.itemIds.includes(id)) throw new Error('Review item is not in the selected association set.');
const r = records.find(record => record.itemId === id);
if (!r) throw new Error('Missing review record.');
const item = { id: r.itemId, fixtureId: r.fixtureId, authoringRevision: r.authoringRevision,
  episodeDefinitionId: r.definitionId, episodeDefinitionRevision: r.definitionRevision,
  patternId: r.recipeId, patternRevision: r.patternRevision, targetDenominator: r.targetDenominator,
  taskDataId: r.taskDataId, taskDataRevision: r.taskDataRevision };
window.plan86ReviewApp = createFractionFlowApp({ root: document.querySelector('#app'),
  practiceTypes: [{ ...base, setId: set.id, setRevision: set.revision, items: [item] }], presentationMode: 'instant-test' });
window.plan86ReviewApp.mount();
