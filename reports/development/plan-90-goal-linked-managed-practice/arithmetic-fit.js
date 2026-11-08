import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import { createFractionFlowApp } from '../../../src/app/app.js';
import { PLAN35_PRACTICE_TYPES_V7, PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE } from '../../../src/app/practice-types.js';
import { PLAN35_ADDITION_RECIPE_RECORDS } from '../../../src/content/data/plan35-addition-recipe-records.js';
import { PLAN40_SUBTRACTION_RECIPE_RECORDS } from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';

const selected = new Set([
  'plan35-identify-half-three-tenths-10', 'one-half-plus-one-third', 'plan35-construct-half-fifth-10',
  'plan40-identify-one-half-one-eighth-8', 'plan40-inspect-two-thirds-one-fourth-12', 'plan40-construct-half-fifth-10',
]);
const additionBase = PLAN35_PRACTICE_TYPES_V7.find(type => type.id === 'sum-under-one');
const additionItems = additionBase.items.filter(item => selected.has(item.id));
const subtractionItems = PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE.items.filter(item => selected.has(item.id));
if (additionItems.length !== 3 || subtractionItems.length !== 3) throw new Error('Exact six public arithmetic candidates are not registered.');
const requested = new URLSearchParams(location.search).get('item');
if (!selected.has(requested)) throw new Error('Expected one adopted arithmetic candidate.');
const oneItem = (base, items) => Object.freeze({ ...base, items: Object.freeze(items.filter(item => item.id === requested)) });
const type = additionItems.some(item => item.id === requested)
  ? oneItem(additionBase, additionItems) : oneItem(PLAN40_UNLIKE_SUBTRACTION_PRACTICE_TYPE, subtractionItems);
const types = [type];
const app = createFractionFlowApp({ root: document.querySelector('#app'), practiceTypes: types, presentationMode: 'instant-test' }).mount();
window.arithmeticFit = { app, records: [...PLAN35_ADDITION_RECIPE_RECORDS, ...PLAN40_SUBTRACTION_RECIPE_RECORDS] };
