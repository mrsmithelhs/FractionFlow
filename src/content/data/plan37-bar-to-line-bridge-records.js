import { deepFreeze } from '../schema.js';

const f = (numerator, denominator) => ({
  kind: 'fraction', numerator: String(numerator), denominator: String(denominator),
});
const c = (id, numerator, denominator) => ({ id: `candidate-${id}`, form: f(numerator, denominator) });

export const PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_ID = 'plan37-bar-to-line-same-amount';
export const PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_REVISION = '1';
export const PLAN37_BAR_TO_LINE_BRIDGE_AUTHORING_REVISION = 'plan37-record-v1';
export const PLAN37_BAR_TO_LINE_BRIDGE_RECIPE_ID = 'plan37.bar-to-line-same-amount';
export const PLAN37_BAR_TO_LINE_BRIDGE_RECIPE_REVISION = '1';
export const PLAN37_BAR_TO_LINE_BRIDGE_PRACTICE_SET_ID = 'bar-to-line-same-amount-vetted-set';
export const PLAN37_BAR_TO_LINE_BRIDGE_PRACTICE_SET_REVISION = '1';
export const PLAN37_BAR_TO_LINE_BRIDGE_DEFINITION_ID = 'phase-4-bar-to-line-same-amount';
export const PLAN37_BAR_TO_LINE_BRIDGE_DEFINITION_REVISION = '1';

export const PLAN37_BAR_TO_LINE_BRIDGE_RECORDS = deepFreeze([
  { itemId: 'bridge-01-half-2', fixtureId: 'curated-plan37-bridge-01-half-2', authoringRevision: PLAN37_BAR_TO_LINE_BRIDGE_AUTHORING_REVISION, taskDataId: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_ID, taskDataRevision: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_REVISION, recipe: { id: PLAN37_BAR_TO_LINE_BRIDGE_RECIPE_ID, revision: '1' }, sourceForm: f(1, 2), partitionDenominator: '2', sparseCandidates: [c('a', 0, 1), c('b', 1, 4), c('c', 1, 2), c('d', 1, 1)] },
  { itemId: 'bridge-02-fourth-4', fixtureId: 'curated-plan37-bridge-02-fourth-4', authoringRevision: PLAN37_BAR_TO_LINE_BRIDGE_AUTHORING_REVISION, taskDataId: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_ID, taskDataRevision: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_REVISION, recipe: { id: PLAN37_BAR_TO_LINE_BRIDGE_RECIPE_ID, revision: '1' }, sourceForm: f(1, 4), partitionDenominator: '4', sparseCandidates: [c('a', 0, 1), c('b', 1, 4), c('c', 3, 8), c('d', 1, 2)] },
  { itemId: 'bridge-03-three-fourths-4', fixtureId: 'curated-plan37-bridge-03-three-fourths-4', authoringRevision: PLAN37_BAR_TO_LINE_BRIDGE_AUTHORING_REVISION, taskDataId: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_ID, taskDataRevision: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_REVISION, recipe: { id: PLAN37_BAR_TO_LINE_BRIDGE_RECIPE_ID, revision: '1' }, sourceForm: f(3, 4), partitionDenominator: '4', sparseCandidates: [c('a', 1, 4), c('b', 1, 2), c('c', 3, 4), c('d', 1, 1)] },
  { itemId: 'bridge-04-two-thirds-3', fixtureId: 'curated-plan37-bridge-04-two-thirds-3', authoringRevision: PLAN37_BAR_TO_LINE_BRIDGE_AUTHORING_REVISION, taskDataId: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_ID, taskDataRevision: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_REVISION, recipe: { id: PLAN37_BAR_TO_LINE_BRIDGE_RECIPE_ID, revision: '1' }, sourceForm: f(2, 3), partitionDenominator: '3', sparseCandidates: [c('a', 0, 1), c('b', 1, 3), c('c', 1, 2), c('d', 2, 3)] },
  { itemId: 'bridge-05-two-fourths-half', fixtureId: 'curated-plan37-bridge-05-two-fourths-half', authoringRevision: PLAN37_BAR_TO_LINE_BRIDGE_AUTHORING_REVISION, taskDataId: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_ID, taskDataRevision: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_REVISION, recipe: { id: PLAN37_BAR_TO_LINE_BRIDGE_RECIPE_ID, revision: '1' }, sourceForm: f(2, 4), partitionDenominator: '4', sparseCandidates: [c('a', 1, 4), c('b', 2, 4), c('c', 3, 4), c('d', 1, 1)] },
  { itemId: 'bridge-06-three-eighths-8', fixtureId: 'curated-plan37-bridge-06-three-eighths-8', authoringRevision: PLAN37_BAR_TO_LINE_BRIDGE_AUTHORING_REVISION, taskDataId: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_ID, taskDataRevision: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_REVISION, recipe: { id: PLAN37_BAR_TO_LINE_BRIDGE_RECIPE_ID, revision: '1' }, sourceForm: f(3, 8), partitionDenominator: '8', sparseCandidates: [c('a', 1, 8), c('b', 2, 8), c('c', 3, 8), c('d', 1, 2)] },
  { itemId: 'bridge-07-one-third-med', fixtureId: 'curated-plan37-bridge-07-one-third-med', authoringRevision: PLAN37_BAR_TO_LINE_BRIDGE_AUTHORING_REVISION, taskDataId: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_ID, taskDataRevision: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_REVISION, recipe: { id: PLAN37_BAR_TO_LINE_BRIDGE_RECIPE_ID, revision: '1' }, sourceForm: f(1, 3), partitionDenominator: '3', sparseCandidates: [c('a', 1, 6), c('b', 1, 3), c('c', 1, 2), c('d', 2, 3)] },
  { itemId: 'bridge-08-five-sixths-med', fixtureId: 'curated-plan37-bridge-08-five-sixths-med', authoringRevision: PLAN37_BAR_TO_LINE_BRIDGE_AUTHORING_REVISION, taskDataId: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_ID, taskDataRevision: PLAN37_BAR_TO_LINE_BRIDGE_TASK_DATA_REVISION, recipe: { id: PLAN37_BAR_TO_LINE_BRIDGE_RECIPE_ID, revision: '1' }, sourceForm: f(5, 6), partitionDenominator: '6', sparseCandidates: [c('a', 2, 6), c('b', 3, 6), c('c', 4, 6), c('d', 5, 6)] },
]);

export const PLAN37_BAR_TO_LINE_BRIDGE_PRACTICE_SET = deepFreeze({
  id: PLAN37_BAR_TO_LINE_BRIDGE_PRACTICE_SET_ID,
  revision: PLAN37_BAR_TO_LINE_BRIDGE_PRACTICE_SET_REVISION,
  itemIds: PLAN37_BAR_TO_LINE_BRIDGE_RECORDS.map(({ itemId }) => itemId),
});
