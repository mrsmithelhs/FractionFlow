import { deepFreeze } from '../schema.js';

export const PLAN45_COMPARISON_SET_ID = 'symbolic-fraction-comparison-vetted-set';
export const PLAN45_COMPARISON_SET_REVISION = '1';
export const PLAN45_COMPARISON_TASK_DATA_ID = 'plan45-symbolic-fraction-comparison-task-data';
export const PLAN45_COMPARISON_TASK_DATA_REVISION = '1';
export const PLAN45_COMPARISON_RECIPE_ID = 'symbolic-fraction-comparison';
export const PLAN45_COMPARISON_RECIPE_REVISION = '1';
export const PLAN45_COMPARISON_AUTHORING_REVISION = 'plan45-record-v1';

// Authored operands and teaching cues only. Relation truth and cue context are
// derived from exact math APIs by plan45-symbolic-fraction-comparison-task.js.
const authoredPairs = [
  { itemId: 'plan45-compare-01', sourceForms: { first: { numerator: '2', denominator: '3' }, second: { numerator: '3', denominator: '5' } }, teachingIntentId: 'compare.symbolic-magnitude', cueId: 'compare.shared-unit-close' },
  { itemId: 'plan45-compare-02', sourceForms: { first: { numerator: '5', denominator: '8' }, second: { numerator: '3', denominator: '8' } }, teachingIntentId: 'compare.symbolic-magnitude', cueId: 'compare.same-denominator' },
  { itemId: 'plan45-compare-03', sourceForms: { first: { numerator: '4', denominator: '6' }, second: { numerator: '6', denominator: '9' } }, teachingIntentId: 'compare.symbolic-magnitude', cueId: 'compare.equivalence' },
  { itemId: 'plan45-compare-04', sourceForms: { first: { numerator: '6', denominator: '9' }, second: { numerator: '4', denominator: '6' } }, teachingIntentId: 'compare.symbolic-magnitude', cueId: 'compare.equivalence' },
  { itemId: 'plan45-compare-05', sourceForms: { first: { numerator: '3', denominator: '4' }, second: { numerator: '5', denominator: '6' } }, teachingIntentId: 'compare.symbolic-magnitude', cueId: 'compare.complements-to-one' },
  { itemId: 'plan45-compare-06', sourceForms: { first: { numerator: '5', denominator: '6' }, second: { numerator: '3', denominator: '4' } }, teachingIntentId: 'compare.symbolic-magnitude', cueId: 'compare.complements-to-one' },
  { itemId: 'plan45-compare-07', sourceForms: { first: { numerator: '2', denominator: '3' }, second: { numerator: '7', denominator: '10' } }, teachingIntentId: 'compare.symbolic-magnitude', cueId: 'compare.shared-unit-close' },
  { itemId: 'plan45-compare-08', sourceForms: { first: { numerator: '3', denominator: '8' }, second: { numerator: '5', denominator: '8' } }, teachingIntentId: 'compare.symbolic-magnitude', cueId: 'compare.same-denominator' },
  { itemId: 'plan45-compare-09', sourceForms: { first: { numerator: '3', denominator: '5' }, second: { numerator: '3', denominator: '7' } }, teachingIntentId: 'compare.symbolic-magnitude', cueId: 'compare.same-count-unit-size' },
  { itemId: 'plan45-compare-10', sourceForms: { first: { numerator: '3', denominator: '8' }, second: { numerator: '5', denominator: '9' } }, teachingIntentId: 'compare.symbolic-magnitude', cueId: 'compare.half-benchmark' },
  { itemId: 'plan45-compare-11', sourceForms: { first: { numerator: '4', denominator: '8' }, second: { numerator: '1', denominator: '2' } }, teachingIntentId: 'compare.symbolic-magnitude', cueId: 'compare.equivalence' },
  { itemId: 'plan45-compare-12', sourceForms: { first: { numerator: '1', denominator: '2' }, second: { numerator: '4', denominator: '8' } }, teachingIntentId: 'compare.symbolic-magnitude', cueId: 'compare.equivalence' },
];

export const PLAN45_COMPARISON_RECORDS = deepFreeze(authoredPairs.map((record) => ({
  ...record,
  authoringRevision: PLAN45_COMPARISON_AUTHORING_REVISION,
  taskDataId: PLAN45_COMPARISON_TASK_DATA_ID,
  taskDataRevision: PLAN45_COMPARISON_TASK_DATA_REVISION,
  recipeId: PLAN45_COMPARISON_RECIPE_ID,
  recipeRevision: PLAN45_COMPARISON_RECIPE_REVISION,
})));

export const PLAN45_COMPARISON_PRACTICE_SET = deepFreeze({
  id: PLAN45_COMPARISON_SET_ID,
  revision: PLAN45_COMPARISON_SET_REVISION,
  itemIds: PLAN45_COMPARISON_RECORDS.map(({ itemId }) => itemId),
});
