import {
  createFraction,
  subtractAtCommonDenominator,
  validateOperationResult,
} from '../math/index.js';
import { deepFreeze } from './schema.js';
import { getProfile } from './profiles.js';
import { resolveCuratedFixture } from './authored-content-catalog.js';
import {
  PLAN36_SUBTRACTION_AUTHORING_REVISION,
  PLAN36_SUBTRACTION_DEFINITION_ID,
  PLAN36_SUBTRACTION_DEFINITION_REVISION,
  PLAN36_SUBTRACTION_PRACTICE_SET_ID,
  PLAN36_SUBTRACTION_PRACTICE_SET_REVISION,
  PLAN36_SUBTRACTION_PROFILE_ID,
  PLAN36_SUBTRACTION_RECIPE_ID,
  PLAN36_SUBTRACTION_RECIPE_REVISION,
  PLAN36_SUBTRACTION_RECORDS,
  PLAN36_SUBTRACTION_SELECTOR,
  PLAN36_SUBTRACTION_TASK_DATA_ID,
  PLAN36_SUBTRACTION_TASK_DATA_REVISION,
  resolvePlan36SubtractionAssociationSet,
} from './data/plan36-like-denominator-subtraction-records.js';

export const EXACT_PLAN36_TASK_CONTEXT_KEYS = Object.freeze([
  'practiceSetId',
  'practiceSetRevision',
  'itemId',
  'fixtureId',
  'authoringRevision',
  'definitionId',
  'definitionRevision',
  'recipeId',
  'recipeRevision',
  'taskDataId',
  'taskDataRevision',
  'sourceForms',
]);

function taskError(message) {
  const error = new TypeError(`invalid Plan 36 subtraction task context: ${message}`);
  error.code = 'INVALID_PLAN36_SUBTRACTION_TASK';
  return error;
}

function same(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function toFraction(form) {
  return createFraction(BigInt(form.numerator), BigInt(form.denominator));
}

function isCanonicalDecimal(str) {
  return typeof str === 'string' && /^[1-9]\d*$/.test(str);
}

export function validatePlan36LikeDenominatorSubtractionRecord(instance, record) {
  if (!record
    || record.recipe?.id !== PLAN36_SUBTRACTION_RECIPE_ID
    || record.recipe?.revision !== PLAN36_SUBTRACTION_RECIPE_REVISION
    || record.taskData?.id !== PLAN36_SUBTRACTION_TASK_DATA_ID
    || record.taskData?.revision !== PLAN36_SUBTRACTION_TASK_DATA_REVISION
    || record.authoringRevision !== PLAN36_SUBTRACTION_AUTHORING_REVISION) {
    throw taskError('recipe, task-data, and authoring revision must match registered identities');
  }

  if (!isCanonicalDecimal(record.leftNumerator)
    || !isCanonicalDecimal(record.rightNumerator)
    || !isCanonicalDecimal(record.denominator)) {
    throw taskError('record numerators and denominator must be canonical positive decimal strings');
  }

  const leftNum = BigInt(record.leftNumerator);
  const rightNum = BigInt(record.rightNumerator);
  const den = BigInt(record.denominator);

  if (leftNum >= den || rightNum >= den) {
    throw taskError('operands must be proper fractions (numerator < denominator)');
  }
  if (rightNum > leftNum) {
    throw taskError('subtrahend numerator must not exceed minuend numerator (negative outcome refused)');
  }

  const fixture = resolveCuratedFixture(record.fixtureId, record.authoringRevision);
  const expectedSourceForms = {
    left: { kind: 'fraction', numerator: record.leftNumerator, denominator: record.denominator },
    right: { kind: 'fraction', numerator: record.rightNumerator, denominator: record.denominator },
  };

  if (!fixture
    || !same(expectedSourceForms.left, instance?.operands?.left?.initialForm)
    || !same(expectedSourceForms.right, instance?.operands?.right?.initialForm)
    || !same(expectedSourceForms.left, fixture.left)
    || !same(expectedSourceForms.right, fixture.right)
    || instance?.provenance?.fixtureId !== record.fixtureId
    || instance?.provenance?.authoringRevision !== record.authoringRevision
    || instance?.request?.profileId !== PLAN36_SUBTRACTION_PROFILE_ID
    || instance?.request?.profileVersion !== getProfile(PLAN36_SUBTRACTION_PROFILE_ID).version
    || instance?.request?.selector !== PLAN36_SUBTRACTION_SELECTOR
    || instance?.request?.operation !== 'subtract'
    || !same(instance?.request?.overlays, [])
    || instance?.source !== 'curated') {
    throw taskError('source forms and provenance do not match the exact authored fixture and instance');
  }

  const left = toFraction(expectedSourceForms.left);
  const right = toFraction(expectedSourceForms.right);
  const diff = subtractAtCommonDenominator(left, right, den);
  const validation = validateOperationResult(diff, left, right, 'subtract', den);
  if (validation.validity !== 'valid') {
    throw taskError('exact difference must pass mathematical validation');
  }

  return expectedSourceForms;
}

function recordFor(instance, itemId) {
  const matches = PLAN36_SUBTRACTION_RECORDS.filter((record) => (
    record.itemId === itemId
      && record.fixtureId === instance?.provenance?.fixtureId
      && record.authoringRevision === instance?.provenance?.authoringRevision
  ));
  return matches.length === 1 ? matches[0] : null;
}

export function resolvePlan36LikeDenominatorSubtractionContext(
  instance,
  itemId,
  {
    practiceSetId = PLAN36_SUBTRACTION_PRACTICE_SET_ID,
    practiceSetRevision = PLAN36_SUBTRACTION_PRACTICE_SET_REVISION,
  } = {},
) {
  const record = recordFor(instance, itemId);
  const registeredSet = record && resolvePlan36SubtractionAssociationSet(practiceSetId, practiceSetRevision, itemId);
  if (!record || !registeredSet) {
    throw taskError('exact registered practice-set and item membership is required');
  }

  const sourceForms = validatePlan36LikeDenominatorSubtractionRecord(instance, record);

  return deepFreeze({
    practiceSetId,
    practiceSetRevision: String(practiceSetRevision),
    itemId: record.itemId,
    fixtureId: record.fixtureId,
    authoringRevision: record.authoringRevision,
    definitionId: PLAN36_SUBTRACTION_DEFINITION_ID,
    definitionRevision: PLAN36_SUBTRACTION_DEFINITION_REVISION,
    recipeId: PLAN36_SUBTRACTION_RECIPE_ID,
    recipeRevision: PLAN36_SUBTRACTION_RECIPE_REVISION,
    taskDataId: PLAN36_SUBTRACTION_TASK_DATA_ID,
    taskDataRevision: PLAN36_SUBTRACTION_TASK_DATA_REVISION,
    sourceForms,
  });
}

export function validatePlan36LikeDenominatorSubtractionContext(instance, context) {
  if (!context || typeof context !== 'object' || Array.isArray(context)
    || !same(Object.keys(context).sort(), [...EXACT_PLAN36_TASK_CONTEXT_KEYS].sort())) {
    throw taskError('exact task context shape is required');
  }

  const expected = resolvePlan36LikeDenominatorSubtractionContext(instance, context.itemId, {
    practiceSetId: context.practiceSetId,
    practiceSetRevision: context.practiceSetRevision,
  });

  for (const key of EXACT_PLAN36_TASK_CONTEXT_KEYS) {
    if (!same(context[key], expected[key])) {
      throw taskError(`${key} does not match its immutable authored association`);
    }
  }

  return expected;
}

export function isPlan36SubtractionDefinition(definition) {
  return definition?.id === PLAN36_SUBTRACTION_DEFINITION_ID
    && definition?.revision === PLAN36_SUBTRACTION_DEFINITION_REVISION;
}
