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

  {"itemId":"plan76-construct-two-thirds-one-fifth-15","fixtureId":"curated-plan76-construct-two-thirds-one-fifth-15","authoringRevision":"plan76-record-v1","fixtureProfileId":"curated-review","fixtureSelector":"relatively-prime-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"2","denominator":"3"},"right":{"kind":"fraction","numerator":"1","denominator":"5"}},"recipeId":"unlike-subtraction.construct-equivalent","targetDenominator":"15"},
  {"itemId":"plan76-construct-five-sixths-one-tenth-30","fixtureId":"curated-plan76-construct-five-sixths-one-tenth-30","authoringRevision":"plan76-record-v1","fixtureProfileId":"curated-review","fixtureSelector":"shared-factor-subtraction","fixtureOverlays":["reducible-result"],"sourceForms":{"left":{"kind":"fraction","numerator":"5","denominator":"6"},"right":{"kind":"fraction","numerator":"1","denominator":"10"}},"recipeId":"unlike-subtraction.construct-equivalent","targetDenominator":"30"},
  {"itemId":"plan76-construct-three-fifths-one-fourth-20","fixtureId":"curated-plan76-construct-three-fifths-one-fourth-20","authoringRevision":"plan76-record-v1","fixtureProfileId":"curated-review","fixtureSelector":"relatively-prime-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"3","denominator":"5"},"right":{"kind":"fraction","numerator":"1","denominator":"4"}},"recipeId":"unlike-subtraction.construct-equivalent","targetDenominator":"20"},
  {"itemId":"plan76-inspect-three-fourths-one-fifth-20","fixtureId":"curated-plan76-inspect-three-fourths-one-fifth-20","authoringRevision":"plan76-record-v1","fixtureProfileId":"curated-review","fixtureSelector":"relatively-prime-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"3","denominator":"4"},"right":{"kind":"fraction","numerator":"1","denominator":"5"}},"recipeId":"unlike-subtraction.inspect-keep-repair","targetDenominator":"20","stimulusId":"plan76-inspect-three-fourths-one-fifth-20-stimulus","stimulusRevision":"1","candidates":{"left":{"kind":"fraction","numerator":"15","denominator":"20"},"right":{"kind":"fraction","numerator":"5","denominator":"20"}}},
  {"itemId":"plan76-inspect-seven-eighths-one-sixth-24","fixtureId":"curated-plan76-inspect-seven-eighths-one-sixth-24","authoringRevision":"plan76-record-v1","fixtureProfileId":"curated-review","fixtureSelector":"shared-factor-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"7","denominator":"8"},"right":{"kind":"fraction","numerator":"1","denominator":"6"}},"recipeId":"unlike-subtraction.inspect-keep-repair","targetDenominator":"24","stimulusId":"plan76-inspect-seven-eighths-one-sixth-24-stimulus","stimulusRevision":"1","candidates":{"left":{"kind":"fraction","numerator":"20","denominator":"24"},"right":{"kind":"fraction","numerator":"4","denominator":"24"}}},
  {"itemId":"plan76-inspect-four-fifths-one-third-15","fixtureId":"curated-plan76-inspect-four-fifths-one-third-15","authoringRevision":"plan76-record-v1","fixtureProfileId":"curated-review","fixtureSelector":"relatively-prime-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"4","denominator":"5"},"right":{"kind":"fraction","numerator":"1","denominator":"3"}},"recipeId":"unlike-subtraction.inspect-keep-repair","targetDenominator":"15","stimulusId":"plan76-inspect-four-fifths-one-third-15-stimulus","stimulusRevision":"1","candidates":{"left":{"kind":"fraction","numerator":"11","denominator":"15"},"right":{"kind":"fraction","numerator":"5","denominator":"15"}}},
  {"itemId":"plan76-identify-seven-eighths-one-fourth-8","fixtureId":"curated-plan76-identify-seven-eighths-one-fourth-8","authoringRevision":"plan76-record-v1","fixtureProfileId":"curated-review","fixtureSelector":"nested-denominator-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"7","denominator":"8"},"right":{"kind":"fraction","numerator":"1","denominator":"4"}},"recipeId":"unlike-subtraction.identify-side-construct","targetDenominator":"8","requiredSide":"right"},
  {"itemId":"plan76-identify-three-fourths-one-eighth-8","fixtureId":"curated-plan76-identify-three-fourths-one-eighth-8","authoringRevision":"plan76-record-v1","fixtureProfileId":"curated-review","fixtureSelector":"nested-denominator-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"3","denominator":"4"},"right":{"kind":"fraction","numerator":"1","denominator":"8"}},"recipeId":"unlike-subtraction.identify-side-construct","targetDenominator":"8","requiredSide":"left"},

  // Plan 85 staged records, registered by Plan 89.
  {"itemId":"plan85-isolated-construct-five-sixths-one-fourth-12","fixtureId":"isolated-plan85-construct-five-sixths-one-fourth-12","authoringRevision":"plan85-isolated-v1","fixtureProfileId":"curated-review","fixtureSelector":"shared-factor-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"5","denominator":"6"},"right":{"kind":"fraction","numerator":"1","denominator":"4"}},"recipeId":"unlike-subtraction.construct-equivalent","targetDenominator":"12"},
  {"itemId":"plan85-isolated-construct-five-eighths-one-sixth-24","fixtureId":"isolated-plan85-construct-five-eighths-one-sixth-24","authoringRevision":"plan85-isolated-v1","fixtureProfileId":"curated-review","fixtureSelector":"shared-factor-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"5","denominator":"8"},"right":{"kind":"fraction","numerator":"1","denominator":"6"}},"recipeId":"unlike-subtraction.construct-equivalent","targetDenominator":"24"},
  {"itemId":"plan85-isolated-construct-seven-tenths-one-third-30","fixtureId":"isolated-plan85-construct-seven-tenths-one-third-30","authoringRevision":"plan85-isolated-v1","fixtureProfileId":"curated-review","fixtureSelector":"relatively-prime-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"7","denominator":"10"},"right":{"kind":"fraction","numerator":"1","denominator":"3"}},"recipeId":"unlike-subtraction.construct-equivalent","targetDenominator":"30"},
  {"itemId":"plan85-isolated-construct-four-fifths-one-sixth-30","fixtureId":"isolated-plan85-construct-four-fifths-one-sixth-30","authoringRevision":"plan85-isolated-v1","fixtureProfileId":"curated-review","fixtureSelector":"relatively-prime-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"4","denominator":"5"},"right":{"kind":"fraction","numerator":"1","denominator":"6"}},"recipeId":"unlike-subtraction.construct-equivalent","targetDenominator":"30"},
  {"itemId":"plan85-isolated-inspect-seven-eighths-one-third-24","fixtureId":"isolated-plan85-inspect-seven-eighths-one-third-24","authoringRevision":"plan85-isolated-v1","fixtureProfileId":"curated-review","fixtureSelector":"relatively-prime-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"7","denominator":"8"},"right":{"kind":"fraction","numerator":"1","denominator":"3"}},"recipeId":"unlike-subtraction.inspect-keep-repair","targetDenominator":"24","stimulusId":"isolated-plan85-stim-seven-eighths-one-third-24","stimulusRevision":"1","candidates":{"left":{"kind":"fraction","numerator":"21","denominator":"24"},"right":{"kind":"fraction","numerator":"9","denominator":"24"}}},
  {"itemId":"plan85-isolated-inspect-four-fifths-one-half-10","fixtureId":"isolated-plan85-inspect-four-fifths-one-half-10","authoringRevision":"plan85-isolated-v1","fixtureProfileId":"curated-review","fixtureSelector":"relatively-prime-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"4","denominator":"5"},"right":{"kind":"fraction","numerator":"1","denominator":"2"}},"recipeId":"unlike-subtraction.inspect-keep-repair","targetDenominator":"10","stimulusId":"isolated-plan85-stim-four-fifths-one-half-10","stimulusRevision":"1","candidates":{"left":{"kind":"fraction","numerator":"8","denominator":"10"},"right":{"kind":"fraction","numerator":"6","denominator":"10"}}},
  {"itemId":"plan85-isolated-inspect-five-sixths-one-fifth-30","fixtureId":"isolated-plan85-inspect-five-sixths-one-fifth-30","authoringRevision":"plan85-isolated-v1","fixtureProfileId":"curated-review","fixtureSelector":"relatively-prime-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"5","denominator":"6"},"right":{"kind":"fraction","numerator":"1","denominator":"5"}},"recipeId":"unlike-subtraction.inspect-keep-repair","targetDenominator":"30","stimulusId":"isolated-plan85-stim-five-sixths-one-fifth-30","stimulusRevision":"1","candidates":{"left":{"kind":"fraction","numerator":"25","denominator":"30"},"right":{"kind":"fraction","numerator":"5","denominator":"30"}}},
  {"itemId":"plan85-isolated-inspect-five-eighths-one-third-24","fixtureId":"isolated-plan85-inspect-five-eighths-one-third-24","authoringRevision":"plan85-isolated-v1","fixtureProfileId":"curated-review","fixtureSelector":"relatively-prime-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"5","denominator":"8"},"right":{"kind":"fraction","numerator":"1","denominator":"3"}},"recipeId":"unlike-subtraction.inspect-keep-repair","targetDenominator":"24","stimulusId":"isolated-plan85-stim-five-eighths-one-third-24","stimulusRevision":"1","candidates":{"left":{"kind":"fraction","numerator":"15","denominator":"24"},"right":{"kind":"fraction","numerator":"9","denominator":"24"}}},
  {"itemId":"plan85-isolated-identify-five-eighths-one-fourth-8","fixtureId":"isolated-plan85-identify-five-eighths-one-fourth-8","authoringRevision":"plan85-isolated-v1","fixtureProfileId":"curated-review","fixtureSelector":"nested-denominator-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"5","denominator":"8"},"right":{"kind":"fraction","numerator":"1","denominator":"4"}},"recipeId":"unlike-subtraction.identify-side-construct","targetDenominator":"8","requiredSide":"right"},
  {"itemId":"plan85-isolated-identify-three-fourths-one-half-4","fixtureId":"isolated-plan85-identify-three-fourths-one-half-4","authoringRevision":"plan85-isolated-v1","fixtureProfileId":"curated-review","fixtureSelector":"nested-denominator-subtraction","fixtureOverlays":[],"sourceForms":{"left":{"kind":"fraction","numerator":"3","denominator":"4"},"right":{"kind":"fraction","numerator":"1","denominator":"2"}},"recipeId":"unlike-subtraction.identify-side-construct","targetDenominator":"4","requiredSide":"right"},
  {"itemId":"plan85-isolated-identify-seven-twelfths-one-third-12","fixtureId":"isolated-plan85-identify-seven-twelfths-one-third-12","authoringRevision":"plan85-isolated-v1","fixtureProfileId":"curated-review","fixtureSelector":"nested-denominator-subtraction","fixtureOverlays":["reducible-result"],"sourceForms":{"left":{"kind":"fraction","numerator":"7","denominator":"12"},"right":{"kind":"fraction","numerator":"1","denominator":"3"}},"recipeId":"unlike-subtraction.identify-side-construct","targetDenominator":"12","requiredSide":"right"},
  {"itemId":"plan85-isolated-identify-two-thirds-one-sixth-6","fixtureId":"isolated-plan85-identify-two-thirds-one-sixth-6","authoringRevision":"plan85-isolated-v1","fixtureProfileId":"curated-review","fixtureSelector":"nested-denominator-subtraction","fixtureOverlays":["reducible-result"],"sourceForms":{"left":{"kind":"fraction","numerator":"2","denominator":"3"},"right":{"kind":"fraction","numerator":"1","denominator":"6"}},"recipeId":"unlike-subtraction.identify-side-construct","targetDenominator":"6","requiredSide":"left"},
  {"itemId":"plan85-isolated-identify-five-sixths-one-half-6","fixtureId":"isolated-plan85-identify-five-sixths-one-half-6","authoringRevision":"plan85-isolated-v1","fixtureProfileId":"curated-review","fixtureSelector":"nested-denominator-subtraction","fixtureOverlays":["reducible-result"],"sourceForms":{"left":{"kind":"fraction","numerator":"5","denominator":"6"},"right":{"kind":"fraction","numerator":"1","denominator":"2"}},"recipeId":"unlike-subtraction.identify-side-construct","targetDenominator":"6","requiredSide":"right"},

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
  {
    itemId: 'plan86-subtract-inspect-half-fifth-10',
    fixtureId: 'curated-plan40-construct-one-half-one-fifth', authoringRevision: 'plan40-record-v1',
    sourceForms: { left: fraction('1', '2'), right: fraction('1', '5') },
    recipeId: PLAN40_RECIPE_IDS.inspect, targetDenominator: '10',
    stimulusId: 'plan86-subtract-inspect-5-3-tenths', stimulusRevision: '1',
    candidates: { left: fraction('5', '10'), right: fraction('3', '10') },
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

export const PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2 = deepFreeze({
  id: PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID,
  revision: '2',
  itemIds: [...PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET.itemIds,
    'plan76-construct-two-thirds-one-fifth-15',
    'plan76-construct-five-sixths-one-tenth-30',
    'plan76-construct-three-fifths-one-fourth-20',
    'plan76-inspect-three-fourths-one-fifth-20',
    'plan76-inspect-seven-eighths-one-sixth-24',
    'plan76-inspect-four-fifths-one-third-15',
    'plan76-identify-seven-eighths-one-fourth-8',
    'plan76-identify-three-fourths-one-eighth-8',
  ],
});

// Registration order for review, not an approved pedagogical sequence.
export const PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V3 = deepFreeze({
  id: PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_ID,
  revision: '3',
  itemIds: [...PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2.itemIds,
    'plan85-isolated-construct-five-sixths-one-fourth-12',
    'plan85-isolated-construct-five-eighths-one-sixth-24',
    'plan85-isolated-construct-seven-tenths-one-third-30',
    'plan85-isolated-construct-four-fifths-one-sixth-30',
    'plan85-isolated-inspect-seven-eighths-one-third-24',
    'plan85-isolated-inspect-four-fifths-one-half-10',
    'plan85-isolated-inspect-five-sixths-one-fifth-30',
    'plan85-isolated-inspect-five-eighths-one-third-24',
    'plan85-isolated-identify-five-eighths-one-fourth-8',
    'plan85-isolated-identify-three-fourths-one-half-4',
    'plan85-isolated-identify-seven-twelfths-one-third-12',
    'plan85-isolated-identify-two-thirds-one-sixth-6',
    'plan85-isolated-identify-five-sixths-one-half-6',
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

export const PLAN86_SUBTRACTION_REVIEW_SET = deepFreeze({
  id: 'plan86-subtraction-review', revision: '1', itemIds: ['plan86-subtract-inspect-half-fifth-10'],
});

export const PLAN40_RECIPE_ASSOCIATION_SETS = deepFreeze([
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V2,
  PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V3,
  PLAN40_DATA_ONLY_HOLDOUT_SET,
  PLAN86_SUBTRACTION_REVIEW_SET,
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
