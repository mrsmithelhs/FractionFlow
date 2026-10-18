import { deepFreeze } from '../schema.js';

export const PLAN36_SUBTRACTION_RECIPE_ID = 'plan36.like-denominator-takeaway';
export const PLAN36_SUBTRACTION_RECIPE_REVISION = '1';
export const PLAN36_SUBTRACTION_DEFINITION_ID = 'phase-3-like-denominator-takeaway-subtraction';
export const PLAN36_SUBTRACTION_DEFINITION_REVISION = '1';
export const PLAN36_SUBTRACTION_TASK_DATA_ID = 'plan36-like-denominator-takeaway';
export const PLAN36_SUBTRACTION_TASK_DATA_REVISION = '1';
export const PLAN36_SUBTRACTION_PRACTICE_SET_ID = 'like-denominator-subtraction-vetted-set';
export const PLAN36_SUBTRACTION_PRACTICE_SET_REVISION = '1';
export const PLAN36_SUBTRACTION_AUTHORING_REVISION = 'plan36-record-v1';
export const PLAN36_SUBTRACTION_PROFILE_ID = 'plan36-subtraction-review';
export const PLAN36_SUBTRACTION_SELECTOR = 'like-denominator-subtraction';

const rawRecords = [
  { itemId: 'takeaway-8-5-minus-2', leftNumerator: '5', rightNumerator: '2', denominator: '8' },
  { itemId: 'takeaway-12-8-minus-3', leftNumerator: '8', rightNumerator: '3', denominator: '12' },
  { itemId: 'takeaway-10-7-minus-3', leftNumerator: '7', rightNumerator: '3', denominator: '10' },
  { itemId: 'takeaway-11-9-minus-4', leftNumerator: '9', rightNumerator: '4', denominator: '11' },
  { itemId: 'takeaway-9-6-minus-1', leftNumerator: '6', rightNumerator: '1', denominator: '9' },
  { itemId: 'takeaway-9-6-minus-6', leftNumerator: '6', rightNumerator: '6', denominator: '9' },
  { itemId: 'takeaway-6-5-minus-4', leftNumerator: '5', rightNumerator: '4', denominator: '6' },
  { itemId: 'takeaway-8-7-minus-1', leftNumerator: '7', rightNumerator: '1', denominator: '8' },
];

export const PLAN36_SUBTRACTION_RECORDS = deepFreeze(
  rawRecords.map((record) => ({
    itemId: record.itemId,
    fixtureId: `curated-plan36-${record.itemId}`,
    authoringRevision: PLAN36_SUBTRACTION_AUTHORING_REVISION,
    recipe: {
      id: PLAN36_SUBTRACTION_RECIPE_ID,
      revision: PLAN36_SUBTRACTION_RECIPE_REVISION,
    },
    taskData: {
      id: PLAN36_SUBTRACTION_TASK_DATA_ID,
      revision: PLAN36_SUBTRACTION_TASK_DATA_REVISION,
    },
    leftNumerator: record.leftNumerator,
    rightNumerator: record.rightNumerator,
    denominator: record.denominator,
  })),
);

export const PLAN36_SUBTRACTION_PRACTICE_SET = deepFreeze({
  id: PLAN36_SUBTRACTION_PRACTICE_SET_ID,
  revision: PLAN36_SUBTRACTION_PRACTICE_SET_REVISION,
  itemIds: PLAN36_SUBTRACTION_RECORDS.map((record) => record.itemId),
  recipe: {
    id: PLAN36_SUBTRACTION_RECIPE_ID,
    revision: PLAN36_SUBTRACTION_RECIPE_REVISION,
  },
  definition: {
    id: PLAN36_SUBTRACTION_DEFINITION_ID,
    revision: PLAN36_SUBTRACTION_DEFINITION_REVISION,
  },
  taskData: {
    id: PLAN36_SUBTRACTION_TASK_DATA_ID,
    revision: PLAN36_SUBTRACTION_TASK_DATA_REVISION,
  },
});

export const PLAN36_SUBTRACTION_TASK_DATA = deepFreeze({
  id: PLAN36_SUBTRACTION_TASK_DATA_ID,
  revision: PLAN36_SUBTRACTION_TASK_DATA_REVISION,
  recipe: {
    id: PLAN36_SUBTRACTION_RECIPE_ID,
    revision: PLAN36_SUBTRACTION_RECIPE_REVISION,
  },
  definition: {
    id: PLAN36_SUBTRACTION_DEFINITION_ID,
    revision: PLAN36_SUBTRACTION_DEFINITION_REVISION,
  },
  schedule: Object.freeze(['encounter', 'operate', 'resolve']),
  operationActionIntent: 'mark-subtrahend-amount',
  answerIntent: 'submit-subtraction-result',
  responsePolicyId: 'exact-equivalent-fraction-v1',
  prompts: Object.freeze({
    question: 'How much is left?',
    actionLabel: 'Take away',
    responseGroupLabel: 'Amount left',
    numeratorFieldLabel: 'Numerator of amount left',
    denominatorFieldLabel: 'Denominator of amount left',
    visualHelp: 'Count only the shaded parts without removal marks.',
    linearHelp: 'The second fraction is the amount taken away. Use the starting amount to work out what remains.',
    recoveryFeedback: 'Check the parts left. Try again.',
    correctFeedback: 'That amount is left.',
  }),
});

export const PLAN36_SUBTRACTION_FIXTURES = deepFreeze(
  PLAN36_SUBTRACTION_RECORDS.map((record) => ({
    id: record.fixtureId,
    authoringRevision: record.authoringRevision,
    profileId: PLAN36_SUBTRACTION_PROFILE_ID,
    selector: PLAN36_SUBTRACTION_SELECTOR,
    overlays: Object.freeze([]),
    left: Object.freeze({
      kind: 'fraction',
      numerator: record.leftNumerator,
      denominator: record.denominator,
    }),
    right: Object.freeze({
      kind: 'fraction',
      numerator: record.rightNumerator,
      denominator: record.denominator,
    }),
  })),
);

export const PLAN36_SUBTRACTION_ASSOCIATION_SETS = deepFreeze([
  PLAN36_SUBTRACTION_PRACTICE_SET,
]);

export function resolvePlan36SubtractionAssociationSet(setId, revision, itemId) {
  return PLAN36_SUBTRACTION_ASSOCIATION_SETS.find((set) => set.id === setId
    && set.revision === String(revision)
    && set.itemIds.includes(itemId)) ?? null;
}

export function findPlan36SubtractionAssociationSet(itemId) {
  const matches = PLAN36_SUBTRACTION_ASSOCIATION_SETS.filter((set) => set.itemIds.includes(itemId));
  return matches.length === 1 ? matches[0] : null;
}

export function isPlan36SubtractionRecord(record) {
  return record?.recipe?.id === PLAN36_SUBTRACTION_RECIPE_ID
    && record?.recipe?.revision === PLAN36_SUBTRACTION_RECIPE_REVISION;
}
