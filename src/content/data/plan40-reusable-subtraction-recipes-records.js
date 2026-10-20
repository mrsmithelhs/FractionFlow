import { deepFreeze } from '../schema.js';

export const PLAN40_RECIPE_DEFINITION_ID = 'phase-3-reusable-subtraction-recipes';
export const PLAN40_RECIPE_DEFINITION_REVISION = '1';
export const PLAN40_RECIPE_TASK_DATA_ID = 'plan40-subtraction-recipe-task-data';
export const PLAN40_RECIPE_TASK_DATA_REVISION = '1';

export const PLAN40_RECIPE_IDS = deepFreeze({
  construct: 'unlike-subtraction.construct-equivalent',
  inspect: 'unlike-subtraction.inspect-keep-repair',
  identify: 'unlike-subtraction.identify-side-construct',
});

const fraction = (numerator, denominator) => ({ kind: 'fraction', numerator, denominator });

const records = [
  // --- Recipe 1: unlike-subtraction.construct-equivalent (3 items) ---
  {
    itemId: 'plan40-construct-half-fifth-10',
    fixtureId: 'curated-plan40-construct-one-half-one-fifth',
    authoringRevision: 'plan40-record-v1',
    fixtureProfileId: 'curated-review',
    fixtureSelector: 'relatively-prime-subtraction',
    fixtureOverlays: [],
    sourceForms: { left: fraction('1', '2'), right: fraction('1', '5') },
    recipeId: PLAN40_RECIPE_IDS.construct,
    targetDenominator: '10',
  },
  {
    itemId: 'plan40-construct-three-fourths-two-fifths-20',
    fixtureId: 'curated-relatively-prime-subtraction',
    authoringRevision: 'plan03-fixtures-v1',
    sourceForms: { left: fraction('3', '4'), right: fraction('2', '5') },
    recipeId: PLAN40_RECIPE_IDS.construct,
    targetDenominator: '20',
  },
  {
    itemId: 'plan40-construct-five-sixths-three-eighths-24',
    fixtureId: 'curated-shared-factor-subtraction',
    authoringRevision: 'plan03-fixtures-v1',
    sourceForms: { left: fraction('5', '6'), right: fraction('3', '8') },
    recipeId: PLAN40_RECIPE_IDS.construct,
    targetDenominator: '24',
  },

  // --- Recipe 2: unlike-subtraction.inspect-keep-repair (3 items) ---
  {
    itemId: 'plan40-inspect-two-thirds-one-fourth-12',
    fixtureId: 'curated-plan40-inspect-two-thirds-one-fourth',
    authoringRevision: 'plan40-record-v1',
    fixtureProfileId: 'curated-review',
    fixtureSelector: 'relatively-prime-subtraction',
    fixtureOverlays: [],
    sourceForms: { left: fraction('2', '3'), right: fraction('1', '4') },
    recipeId: PLAN40_RECIPE_IDS.inspect,
    targetDenominator: '12',
    stimulusId: 'plan40-stim-inspect-two-thirds-one-fourth-12',
    stimulusRevision: '1',
    candidates: { left: fraction('5', '12'), right: fraction('3', '12') },
  },
  {
    itemId: 'plan40-inspect-seven-tenths-one-fourth-20',
    fixtureId: 'curated-plan40-inspect-seven-tenths-one-fourth',
    authoringRevision: 'plan40-record-v1',
    fixtureProfileId: 'curated-review',
    fixtureSelector: 'shared-factor-subtraction',
    fixtureOverlays: [],
    sourceForms: { left: fraction('7', '10'), right: fraction('1', '4') },
    recipeId: PLAN40_RECIPE_IDS.inspect,
    targetDenominator: '20',
    stimulusId: 'plan40-stim-inspect-seven-tenths-one-fourth-20',
    stimulusRevision: '1',
    candidates: { left: fraction('14', '20'), right: fraction('7', '20') },
  },
  {
    itemId: 'plan40-inspect-five-sixths-seven-tenths-30',
    fixtureId: 'curated-plan40-inspect-five-sixths-seven-tenths',
    authoringRevision: 'plan40-record-v1',
    fixtureProfileId: 'curated-review',
    fixtureSelector: 'shared-factor-subtraction',
    fixtureOverlays: ['reducible-result'],
    sourceForms: { left: fraction('5', '6'), right: fraction('7', '10') },
    recipeId: PLAN40_RECIPE_IDS.inspect,
    targetDenominator: '30',
    stimulusId: 'plan40-stim-inspect-five-sixths-seven-tenths-30',
    stimulusRevision: '1',
    candidates: { left: fraction('22', '30'), right: fraction('21', '30') },
  },

  // --- Recipe 3: unlike-subtraction.identify-side-construct (3 items) ---
  {
    itemId: 'plan40-identify-five-sixths-one-third-6',
    fixtureId: 'curated-nested-subtraction-reducible',
    authoringRevision: 'plan03-fixtures-v1',
    sourceForms: { left: fraction('5', '6'), right: fraction('1', '3') },
    recipeId: PLAN40_RECIPE_IDS.identify,
    targetDenominator: '6',
    requiredSide: 'right',
  },
  {
    itemId: 'plan40-identify-one-half-one-eighth-8',
    fixtureId: 'curated-plan40-identify-one-half-one-eighth',
    authoringRevision: 'plan40-record-v1',
    fixtureProfileId: 'curated-review',
    fixtureSelector: 'nested-denominator-subtraction',
    fixtureOverlays: [],
    sourceForms: { left: fraction('1', '2'), right: fraction('1', '8') },
    recipeId: PLAN40_RECIPE_IDS.identify,
    targetDenominator: '8',
    requiredSide: 'left',
  },
  {
    itemId: 'plan40-identify-two-thirds-five-twelfths-12',
    fixtureId: 'curated-plan40-identify-two-thirds-five-twelfths',
    authoringRevision: 'plan40-record-v1',
    fixtureProfileId: 'curated-review',
    fixtureSelector: 'nested-denominator-subtraction',
    fixtureOverlays: ['reducible-result'],
    sourceForms: { left: fraction('2', '3'), right: fraction('5', '12') },
    recipeId: PLAN40_RECIPE_IDS.identify,
    targetDenominator: '12',
    requiredSide: 'left',
  },

  // --- Data-Only Holdouts (2 items) ---
  {
    itemId: 'plan40-holdout-construct-three-fifths-one-half-10',
    fixtureId: 'curated-plan40-holdout-three-fifths-one-half-construct',
    authoringRevision: 'plan40-record-v1',
    fixtureProfileId: 'curated-review',
    fixtureSelector: 'relatively-prime-subtraction',
    fixtureOverlays: [],
    sourceForms: { left: fraction('3', '5'), right: fraction('1', '2') },
    recipeId: PLAN40_RECIPE_IDS.construct,
    targetDenominator: '10',
    taskDataRevision: '2',
  },
  {
    itemId: 'plan40-holdout-inspect-three-fourths-one-sixth-12',
    fixtureId: 'curated-plan40-holdout-three-fourths-one-sixth-inspect',
    authoringRevision: 'plan40-record-v1',
    fixtureProfileId: 'curated-review',
    fixtureSelector: 'shared-factor-subtraction',
    fixtureOverlays: [],
    sourceForms: { left: fraction('3', '4'), right: fraction('1', '6') },
    recipeId: PLAN40_RECIPE_IDS.inspect,
    targetDenominator: '12',
    taskDataRevision: '2',
    stimulusId: 'plan40-stim-holdout-three-fourths-one-sixth-12',
    stimulusRevision: '1',
    candidates: { left: fraction('9', '12'), right: fraction('5', '12') },
  },
];

export const PLAN40_SUBTRACTION_RECIPE_RECORDS = deepFreeze(records.map((record) => ({
  ...record,
  definitionId: PLAN40_RECIPE_DEFINITION_ID,
  definitionRevision: PLAN40_RECIPE_DEFINITION_REVISION,
  patternRevision: '1',
  taskDataId: PLAN40_RECIPE_TASK_DATA_ID,
  taskDataRevision: record.taskDataRevision ?? PLAN40_RECIPE_TASK_DATA_REVISION,
  requiredSides: record.requiredSide ? [record.requiredSide] : ['left', 'right'],
  stimulusId: record.stimulusId ?? null,
  stimulusRevision: record.stimulusRevision ?? null,
  candidates: record.candidates ?? null,
})));

export const PLAN40_SUBTRACTION_RECIPE_FIXTURES = deepFreeze([
  ...records.filter((record) => record.fixtureProfileId).map((record) => ({
    id: record.fixtureId,
    authoringRevision: record.authoringRevision,
    profileId: record.fixtureProfileId,
    selector: record.fixtureSelector,
    overlays: record.fixtureOverlays,
    left: record.sourceForms.left,
    right: record.sourceForms.right,
  })),
]);

export const PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID = 'unlike-subtraction-vetted-set';
export const PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_REVISION = '1';
export const PLAN40_DATA_ONLY_HOLDOUTS_ID = 'plan40-data-only-holdouts';
export const PLAN40_DATA_ONLY_HOLDOUTS_REVISION = '1';

export const PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET = deepFreeze({
  id: PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID,
  revision: PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_REVISION,
  itemIds: [
    'plan40-construct-half-fifth-10',
    'plan40-construct-three-fourths-two-fifths-20',
    'plan40-construct-five-sixths-three-eighths-24',
    'plan40-inspect-two-thirds-one-fourth-12',
    'plan40-inspect-seven-tenths-one-fourth-20',
    'plan40-inspect-five-sixths-seven-tenths-30',
    'plan40-identify-five-sixths-one-third-6',
    'plan40-identify-one-half-one-eighth-8',
    'plan40-identify-two-thirds-five-twelfths-12',
  ],
});

export const PLAN40_DATA_ONLY_HOLDOUT_SET = deepFreeze({
  id: PLAN40_DATA_ONLY_HOLDOUTS_ID,
  revision: PLAN40_DATA_ONLY_HOLDOUTS_REVISION,
  itemIds: [
    'plan40-holdout-construct-three-fifths-one-half-10',
    'plan40-holdout-inspect-three-fourths-one-sixth-12',
  ],
});

export const PLAN40_RECIPE_ASSOCIATION_SETS = deepFreeze([
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET,
  PLAN40_DATA_ONLY_HOLDOUT_SET,
]);

export const PLAN40_VETTED_BATCH = deepFreeze(
  PLAN40_SUBTRACTION_RECIPE_RECORDS.filter((r) => PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET.itemIds.includes(r.itemId)),
);

export const PLAN40_DATA_ONLY_HOLDOUTS = deepFreeze(
  PLAN40_SUBTRACTION_RECIPE_RECORDS.filter((r) => PLAN40_DATA_ONLY_HOLDOUT_SET.itemIds.includes(r.itemId)),
);

export function resolvePlan40RecipeAssociationSet(setId, revision, itemId) {
  return PLAN40_RECIPE_ASSOCIATION_SETS.find((set) => set.id === setId
    && set.revision === String(revision) && set.itemIds.includes(itemId)) ?? null;
}

export function findPlan40RecipeAssociationSet(itemId) {
  const matches = PLAN40_RECIPE_ASSOCIATION_SETS.filter((set) => set.itemIds.includes(itemId));
  return matches.length === 1 ? matches[0] : null;
}

export function isPlan40SubtractionRecipeRecord(record) {
  return record?.definitionId === PLAN40_RECIPE_DEFINITION_ID
    && record?.definitionRevision === PLAN40_RECIPE_DEFINITION_REVISION;
}
