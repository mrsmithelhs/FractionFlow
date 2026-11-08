import { deepFreeze } from '../schema.js';

export const PLAN35_RECIPE_DEFINITION_ID = 'phase-3-reusable-addition-recipes';
export const PLAN35_RECIPE_DEFINITION_REVISION = '1';
export const PLAN35_RECIPE_TASK_DATA_ID = 'plan35-addition-recipe-task-data';
export const PLAN35_RECIPE_TASK_DATA_REVISION = '1';
export const PLAN35_RECIPE_IDS = deepFreeze({
  construct: 'full-addition.construct-equivalent',
  inspect: 'full-addition.inspect-keep-repair',
  identify: 'full-addition.identify-side-construct',
});

const fraction = (numerator, denominator) => ({ kind: 'fraction', numerator, denominator });
const records = [
  {
    itemId: 'two-thirds-plus-one-fourth', fixtureId: 'curated-relatively-prime-addition-non-least', authoringRevision: 'plan03-fixtures-v1',
    sourceForms: { left: fraction('2', '3'), right: fraction('1', '4') }, recipeId: PLAN35_RECIPE_IDS.construct, targetDenominator: '12',
  },
  {
    itemId: 'one-half-plus-one-third', fixtureId: 'curated-relatively-prime-addition-one-half-one-third', authoringRevision: 'plan26-fixtures-v1',
    sourceForms: { left: fraction('1', '2'), right: fraction('1', '3') }, recipeId: PLAN35_RECIPE_IDS.inspect, targetDenominator: '12',
    stimulusId: 'plan34-one-half-plus-one-third-inspect-candidate', stimulusRevision: '1', candidates: { left: fraction('5', '12'), right: fraction('4', '12') },
  },
  {
    itemId: 'one-third-plus-one-fourth', fixtureId: 'curated-relatively-prime-addition-one-third-one-fourth', authoringRevision: 'plan32-record-v1',
    sourceForms: { left: fraction('1', '3'), right: fraction('1', '4') }, recipeId: PLAN35_RECIPE_IDS.inspect, targetDenominator: '12',
    stimulusId: 'plan34-one-third-plus-one-fourth-inspect-candidate', stimulusRevision: '1', candidates: { left: fraction('4', '12'), right: fraction('7', '12') },
  },
  {
    itemId: 'nested-one-half-plus-three-eighths', fixtureId: 'curated-nested-addition-one-half-three-eighths', authoringRevision: 'plan18-record-v1',
    sourceForms: { left: fraction('1', '2'), right: fraction('3', '8') }, recipeId: PLAN35_RECIPE_IDS.identify, targetDenominator: '8', requiredSide: 'left',
  },
  {
    itemId: 'nested-three-eighths-plus-one-half', fixtureId: 'curated-nested-addition-three-eighths-one-half', authoringRevision: 'plan18-record-v1',
    sourceForms: { left: fraction('3', '8'), right: fraction('1', '2') }, recipeId: PLAN35_RECIPE_IDS.identify, targetDenominator: '8', requiredSide: 'right',
  },
  {
    itemId: 'plan35-construct-half-fifth-10', fixtureId: 'curated-relatively-prime-addition-one-half-one-fifth', authoringRevision: 'plan32-record-v1',
    sourceForms: { left: fraction('1', '2'), right: fraction('1', '5') }, recipeId: PLAN35_RECIPE_IDS.construct, targetDenominator: '10',
  },
  {
    itemId: 'plan35-construct-three-fifths-third-30', fixtureId: 'curated-relatively-prime-addition-three-fifths-one-third', authoringRevision: 'plan32-record-v1',
    sourceForms: { left: fraction('3', '5'), right: fraction('1', '3') }, recipeId: PLAN35_RECIPE_IDS.construct, targetDenominator: '30',
  },
  {
    itemId: 'plan35-inspect-third-eighth-24', fixtureId: 'curated-plan35-inspect-one-third-one-eighth', authoringRevision: 'plan35-record-v1',
    fixtureProfileId: 'curated-review', fixtureSelector: 'relatively-prime-addition', fixtureOverlays: [],
    sourceForms: { left: fraction('1', '3'), right: fraction('1', '8') }, recipeId: PLAN35_RECIPE_IDS.inspect, targetDenominator: '24',
    stimulusId: 'plan35-stim-third-eighth-24', stimulusRevision: '1', candidates: { left: fraction('5', '24'), right: fraction('3', '24') },
  },
  {
    itemId: 'plan35-inspect-fifth-third-30', fixtureId: 'curated-plan35-inspect-one-fifth-one-third', authoringRevision: 'plan35-record-v1',
    fixtureProfileId: 'curated-review', fixtureSelector: 'relatively-prime-addition', fixtureOverlays: [],
    sourceForms: { left: fraction('1', '5'), right: fraction('1', '3') }, recipeId: PLAN35_RECIPE_IDS.inspect, targetDenominator: '30',
    stimulusId: 'plan35-stim-fifth-third-30', stimulusRevision: '1', candidates: { left: fraction('6', '30'), right: fraction('11', '30') },
  },
  {
    itemId: 'plan35-identify-half-three-tenths-10', fixtureId: 'curated-plan35-identify-one-half-three-tenths', authoringRevision: 'plan35-record-v1',
    fixtureProfileId: 'curated-review', fixtureSelector: 'nested-denominator-addition', fixtureOverlays: ['reducible-result'],
    sourceForms: { left: fraction('1', '2'), right: fraction('3', '10') }, recipeId: PLAN35_RECIPE_IDS.identify, targetDenominator: '10', requiredSide: 'left',
  },
  {
    itemId: 'plan35-identify-three-tenths-half-10', fixtureId: 'curated-plan35-identify-three-tenths-one-half', authoringRevision: 'plan35-record-v1',
    fixtureProfileId: 'curated-review', fixtureSelector: 'nested-denominator-addition', fixtureOverlays: ['reducible-result'],
    sourceForms: { left: fraction('3', '10'), right: fraction('1', '2') }, recipeId: PLAN35_RECIPE_IDS.identify, targetDenominator: '10', requiredSide: 'right',
  },
  {
    itemId: 'plan35-identify-third-five-twelfths-12', fixtureId: 'curated-plan35-identify-one-third-five-twelfths', authoringRevision: 'plan35-record-v1',
    fixtureProfileId: 'curated-review', fixtureSelector: 'nested-denominator-addition', fixtureOverlays: ['reducible-result'],
    sourceForms: { left: fraction('1', '3'), right: fraction('5', '12') }, recipeId: PLAN35_RECIPE_IDS.identify, targetDenominator: '12', requiredSide: 'left',
  },
  {
    itemId: 'plan35-identify-five-twelfths-third-12', fixtureId: 'curated-plan35-identify-five-twelfths-one-third', authoringRevision: 'plan35-record-v1',
    fixtureProfileId: 'curated-review', fixtureSelector: 'nested-denominator-addition', fixtureOverlays: ['reducible-result'],
    sourceForms: { left: fraction('5', '12'), right: fraction('1', '3') }, recipeId: PLAN35_RECIPE_IDS.identify, targetDenominator: '12', requiredSide: 'right',
  },
  {
    itemId: 'plan35-holdout-construct-fifth-sixth-30', fixtureId: 'curated-plan35-holdout-one-fifth-one-sixth-construct', authoringRevision: 'plan35-record-v1',
    fixtureProfileId: 'curated-review', fixtureSelector: 'relatively-prime-addition', fixtureOverlays: [],
    sourceForms: { left: fraction('1', '5'), right: fraction('1', '6') }, recipeId: PLAN35_RECIPE_IDS.construct, targetDenominator: '30',
    taskDataRevision: '2',
  },
  {
    itemId: 'plan35-holdout-inspect-half-fifth-20', fixtureId: 'curated-plan35-holdout-half-fifth-inspect', authoringRevision: 'plan35-record-v1',
    fixtureProfileId: 'curated-review', fixtureSelector: 'relatively-prime-addition', fixtureOverlays: [],
    sourceForms: { left: fraction('1', '2'), right: fraction('1', '5') }, recipeId: PLAN35_RECIPE_IDS.inspect, targetDenominator: '20',
    taskDataRevision: '2', stimulusId: 'plan35-stim-holdout-half-fifth-20', stimulusRevision: '1',
    candidates: { left: fraction('9', '20'), right: fraction('4', '20') },
  },
  {
    itemId: 'plan86-add-inspect-two-thirds-one-fourth-12', fixtureId: 'curated-relatively-prime-addition-non-least', authoringRevision: 'plan03-fixtures-v1',
    sourceForms: { left: fraction('2', '3'), right: fraction('1', '4') }, recipeId: PLAN35_RECIPE_IDS.inspect, targetDenominator: '12',
    stimulusId: 'plan86-add-inspect-7-3-twelfths', stimulusRevision: '1', candidates: { left: fraction('7', '12'), right: fraction('3', '12') },
  },
];

export const PLAN35_ADDITION_RECIPE_RECORDS = deepFreeze(records.map((record) => ({
  ...record,
  definitionId: PLAN35_RECIPE_DEFINITION_ID,
  definitionRevision: PLAN35_RECIPE_DEFINITION_REVISION,
  patternRevision: '1',
  taskDataId: PLAN35_RECIPE_TASK_DATA_ID,
  taskDataRevision: record.taskDataRevision ?? PLAN35_RECIPE_TASK_DATA_REVISION,
  requiredSides: record.requiredSide ? [record.requiredSide] : ['left', 'right'],
  stimulusId: record.stimulusId ?? null,
  stimulusRevision: record.stimulusRevision ?? null,
  candidates: record.candidates ?? null,
})));

export const PLAN35_ADDITION_RECIPE_FIXTURES = deepFreeze([
  ...records.filter((record) => record.fixtureProfileId).map((record) => ({
    id: record.fixtureId, authoringRevision: record.authoringRevision,
    profileId: record.fixtureProfileId, selector: record.fixtureSelector,
    overlays: record.fixtureOverlays, left: record.sourceForms.left, right: record.sourceForms.right,
  })),
]);

export const PLAN35_ADDITION_RECIPE_PRACTICE_SET = deepFreeze({
  id: 'unlike-addition-vetted-set', revision: '7', itemIds: [
    'two-thirds-plus-one-fourth', 'one-half-plus-one-third', 'one-half-plus-one-fifth',
    'one-half-plus-two-fifths', 'one-third-plus-one-fourth', 'one-third-plus-one-fifth',
    'one-third-plus-two-fifths', 'two-thirds-plus-one-fifth', 'three-fifths-plus-one-third',
    'one-sixth-plus-one-fourth', 'two-thirds-plus-three-fourths',
    'nested-one-half-plus-three-eighths', 'nested-three-eighths-plus-one-half',
    'plan35-construct-half-fifth-10', 'plan35-construct-three-fifths-third-30',
    'plan35-inspect-third-eighth-24', 'plan35-inspect-fifth-third-30',
    'plan35-identify-half-three-tenths-10', 'plan35-identify-three-tenths-half-10',
    'plan35-identify-third-five-twelfths-12', 'plan35-identify-five-twelfths-third-12',
  ],
});

export const PLAN35_DATA_ONLY_HOLDOUT_SET = deepFreeze({
  id: 'plan35-data-only-holdouts', revision: '1', itemIds: [
    'plan35-holdout-construct-fifth-sixth-30',
    'plan35-holdout-inspect-half-fifth-20',
  ],
});

export const PLAN86_ADDITION_REVIEW_SET = deepFreeze({
  id: 'plan86-addition-review', revision: '1', itemIds: ['plan86-add-inspect-two-thirds-one-fourth-12'],
});

export const PLAN35_RECIPE_ASSOCIATION_SETS = deepFreeze([
  PLAN35_ADDITION_RECIPE_PRACTICE_SET,
  PLAN35_DATA_ONLY_HOLDOUT_SET,
  PLAN86_ADDITION_REVIEW_SET,
]);

export function resolvePlan35RecipeAssociationSet(setId, revision, itemId) {
  return PLAN35_RECIPE_ASSOCIATION_SETS.find((set) => set.id === setId
    && set.revision === String(revision) && set.itemIds.includes(itemId)) ?? null;
}

export function findPlan35RecipeAssociationSet(itemId) {
  const matches = PLAN35_RECIPE_ASSOCIATION_SETS.filter((set) => set.itemIds.includes(itemId));
  return matches.length === 1 ? matches[0] : null;
}

export function isPlan35AdditionRecipeRecord(record) {
  return record?.definitionId === PLAN35_RECIPE_DEFINITION_ID
    && record?.definitionRevision === PLAN35_RECIPE_DEFINITION_REVISION;
}
