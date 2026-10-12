import {
  convertToDenominator,
  createFraction,
  equalFractions,
  improperToMixed,
} from '../math/index.js';
import { buildCuratedProblem } from './generator.js';
import { deepFreeze, fractionToWire, wireToForm } from './schema.js';
import { evaluateInstanceEligibility } from './eligibility.js';
import { COMPACT_ADDITION_RECORDS } from './data/compact-addition-records.js';
import { SHARED_FACTOR_ADDITION_RECORDS } from './data/shared-factor-addition-records.js';
import { CROSSING_ADDITION_RECORDS } from './data/crossing-addition-records.js';

export const PLAN32_RECIPE_ID = 'plan32-reviewed-addition';
export const PLAN32_RECIPE_REVISION = '1';
export const PLAN32_TASK_DATA_REVISION = 'plan32-task-data-v1';
export const PLAN19_RECIPE_ID = 'plan19-reviewed-shared-factor-addition';
export const PLAN19_RECIPE_REVISION = '1';
export const PLAN19_TASK_DATA_REVISION = 'plan19-task-data-v1';
export const PLAN17_RECIPE_ID = 'plan17-reviewed-crossing-addition';
export const PLAN17_RECIPE_REVISION = '1';
export const PLAN17_TASK_DATA_REVISION = 'plan17-task-data-v1';

const PREMISE_RULES = new Set(['P-EQUIVALENT', 'P-ADJACENT-UNIT']);
const REFLECTION_RULES = new Set(['R-CORRECT', 'R-KEEP-NUMERATOR', 'R-ADJACENT-UNIT']);
const CHOICE_IDS = Object.freeze(['match-a', 'match-b', 'match-c']);

function requireValid(condition, message) {
  if (!condition) throw new TypeError(`invalid compact addition record: ${message}`);
}

function exactKeys(value, keys, name) {
  requireValid(value && typeof value === 'object' && !Array.isArray(value), `${name} must be an object`);
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  requireValid(JSON.stringify(actual) === JSON.stringify(expected), `${name} fields are not supported`);
}

function validWireFraction(value, name) {
  exactKeys(value, ['kind', 'numerator', 'denominator'], name);
  requireValid(value.kind === 'fraction'
    && typeof value.numerator === 'string'
    && /^(0|[1-9][0-9]*)$/.test(value.numerator)
    && typeof value.denominator === 'string'
    && /^[1-9][0-9]*$/.test(value.denominator), `${name} must be a nonnegative fraction wire form`);
  const numerator = BigInt(value.numerator);
  const denominator = BigInt(value.denominator);
  requireValid(numerator <= denominator, `${name} must be a proper fraction`);
  return wireToForm(value);
}

function safeForm(form, target, name) {
  const numerator = Number(form.numerator);
  const denominator = Number(form.denominator);
  requireValid(form.kind === 'fraction'
    && Number.isSafeInteger(numerator)
    && Number.isSafeInteger(denominator)
    && denominator === Number(target)
    && numerator >= 0
    && numerator <= denominator,
  `${name} is outside the supported presentation range for ${target}`);
  return form;
}

function validateRecord(record) {
  exactKeys(record, [
    'itemId', 'fixtureId', 'authoringRevision', 'taskDataRevision', 'recipe',
    'profileId', 'selector', 'overlays', 'left', 'right', 'paths',
  ], 'record');
  for (const field of ['itemId', 'fixtureId', 'authoringRevision', 'taskDataRevision']) {
    requireValid(typeof record[field] === 'string' && record[field].length > 0, `${field} is required`);
  }
  exactKeys(record.recipe, ['id', 'revision'], 'recipe');
  const plan32Recipe = record.recipe.id === PLAN32_RECIPE_ID
    && record.recipe.revision === PLAN32_RECIPE_REVISION;
  const plan19Recipe = record.recipe.id === PLAN19_RECIPE_ID
    && record.recipe.revision === PLAN19_RECIPE_REVISION;
  const plan17Recipe = record.recipe.id === PLAN17_RECIPE_ID
    && record.recipe.revision === PLAN17_RECIPE_REVISION;
  requireValid(plan32Recipe || plan19Recipe || plan17Recipe, 'unknown recipe identity');
  const plan32 = plan32Recipe
    && record.authoringRevision === 'plan32-record-v1'
    && record.taskDataRevision === PLAN32_TASK_DATA_REVISION
    && record.selector === 'relatively-prime-addition';
  const plan19 = plan19Recipe
    && record.authoringRevision === 'plan19-record-v1'
    && record.taskDataRevision === PLAN19_TASK_DATA_REVISION
    && record.selector === 'shared-factor-addition';
  const plan17 = plan17Recipe
    && record.authoringRevision === 'plan17-record-v1'
    && record.taskDataRevision === PLAN17_TASK_DATA_REVISION
    && record.selector === 'relatively-prime-addition'
    && record.fixtureId === 'curated-relatively-prime-addition-crossing-one-whole-two-thirds-three-fourths'
    && record.itemId === 'two-thirds-plus-three-fourths'
    && record.left?.numerator === '2'
    && record.left?.denominator === '3'
    && record.right?.numerator === '3'
    && record.right?.denominator === '4';
  requireValid(plan32 || plan19 || plan17, 'recipe, selector, and immutable revisions do not match an admitted recipe');
  const validOverlaySet = Array.isArray(record.overlays)
    && ((plan17 && record.overlays.length === 1 && record.overlays[0] === 'crosses-one-whole')
      || (!plan17 && record.overlays.length === 0));
  requireValid(record.profileId === 'curated-review' && validOverlaySet,
    'only reviewed curated-review addition overlay sets are supported');
  const left = validWireFraction(record.left, 'left operand');
  const right = validWireFraction(record.right, 'right operand');
  requireValid(Object.keys(record.paths).length > 0, 'at least one path is required');
  const targets = Object.keys(record.paths);
  requireValid(new Set(targets).size === targets.length
    && targets.every((target) => /^[1-9][0-9]*$/.test(target)), 'path targets must be unique positive integers');
  for (const target of targets) {
    const path = record.paths[target];
    exactKeys(path, ['premise', 'reflection'], `path ${target}`);
    exactKeys(path.premise, path.premise?.rule === 'P-EQUIVALENT'
      ? ['rule']
      : ['rule', 'offset'], `premise policy ${target}`);
    requireValid(PREMISE_RULES.has(path.premise.rule), `unknown premise rule at ${target}`);
    if (path.premise.rule === 'P-ADJACENT-UNIT') {
      requireValid(path.premise.offset === '-1' || path.premise.offset === '1', `invalid premise offset at ${target}`);
    }
    exactKeys(path.reflection, ['order', 'adjacentOffset', 'correctPosition'], `reflection policy ${target}`);
    requireValid(Array.isArray(path.reflection.order)
      && path.reflection.order.length === 3
      && new Set(path.reflection.order).size === 3
      && path.reflection.order.every((rule) => REFLECTION_RULES.has(rule)),
    `reflection order must contain each reviewed rule once at ${target}`);
    requireValid(path.reflection.adjacentOffset === '-1' || path.reflection.adjacentOffset === '1',
      `invalid reflection offset at ${target}`);
    requireValid(Number.isInteger(path.reflection.correctPosition)
      && path.reflection.correctPosition >= 1
      && path.reflection.correctPosition <= 3,
    `invalid correct answer position at ${target}`);
  }
  return { left, right, targets };
}

function materializePremise(record, path, left, target) {
  const converted = convertToDenominator(left, BigInt(target));
  const numerator = path.premise.rule === 'P-EQUIVALENT'
    ? converted.numerator
    : converted.numerator + BigInt(path.premise.offset);
  const presentedForm = safeForm(fractionToWire(createFraction(numerator, BigInt(target))), target, 'premise form');
  const isEquivalent = equalFractions(left, wireToForm(presentedForm));
  requireValid((path.premise.rule === 'P-EQUIVALENT') === isEquivalent,
    `premise rule truth does not match exact math at ${target}`);
  return deepFreeze({
    id: `premise-${record.itemId}-${target}`,
    fixtureId: record.fixtureId,
    targetDenominator: target,
    sourceForm: record.left,
    presentedForm,
    isEquivalent,
    expectedResponse: isEquivalent ? 'yes' : 'no',
    distractorType: isEquivalent ? null : 'adjacent-unit',
  });
}

function formForReflection(rule, left, target, adjacentOffset) {
  if (rule === 'R-CORRECT') return fractionToWire(convertToDenominator(left, BigInt(target)));
  if (rule === 'R-KEEP-NUMERATOR') {
    return { kind: 'fraction', numerator: left.numerator.toString(), denominator: target };
  }
  if (rule === 'R-ADJACENT-UNIT') {
    const converted = convertToDenominator(left, BigInt(target));
    return fractionToWire(createFraction(
      converted.numerator + BigInt(adjacentOffset),
      BigInt(target),
    ));
  }
  throw new TypeError(`unknown reflection rule: ${String(rule)}`);
}

function materializeChoices(path, left, target) {
  const choices = path.reflection.order.map((rule, index) => ({
    id: CHOICE_IDS[index],
    form: safeForm(formForReflection(rule, left, target, path.reflection.adjacentOffset), target, 'reflection choice'),
  }));
  let equivalentCount = 0;
  for (let index = 0; index < choices.length; index += 1) {
    if (equalFractions(left, wireToForm(choices[index].form))) equivalentCount += 1;
    for (let previous = 0; previous < index; previous += 1) {
      requireValid(!equalFractions(
        wireToForm(choices[index].form),
        wireToForm(choices[previous].form),
      ), `duplicate mathematical reflection choices at ${target}`);
    }
  }
  requireValid(equivalentCount === 1, `reflection must contain one exact answer at ${target}`);
  requireValid(path.reflection.order[path.reflection.correctPosition - 1] === 'R-CORRECT',
    `authored answer position does not match the exact answer at ${target}`);
  return deepFreeze(choices);
}

function materializeCrossingResultStack(left, right, target) {
  const denominator = BigInt(target);
  const leftAtTarget = convertToDenominator(left, denominator);
  const rightAtTarget = convertToDenominator(right, denominator);
  const rawNumerator = leftAtTarget.numerator + rightAtTarget.numerator;
  const rawResult = createFraction(rawNumerator, denominator);
  const mixed = improperToMixed(rawResult);
  requireValid(mixed.whole === 1n && mixed.fraction.numerator > 0n,
    `crossing result must occupy exactly two wholes at ${target}`);
  const remainder = convertToDenominator(mixed.fraction, denominator);
  const rawResultForm = {
    kind: 'fraction',
    numerator: rawNumerator.toString(),
    denominator: target,
  };
  return deepFreeze({
    targetDenominator: target,
    rawResult: rawResultForm,
    rows: [
      { kind: 'fraction', numerator: target, denominator: target },
      fractionToWire(createFraction(remainder.numerator, denominator)),
    ],
  });
}

function materializeOne(record) {
  const { left, right, targets } = validateRecord(record);
  const fixture = deepFreeze({
    id: record.fixtureId,
    authoringRevision: record.authoringRevision,
    profileId: record.profileId,
    selector: record.selector,
    overlays: record.overlays,
    left: record.left,
    right: record.right,
  });
  const instance = buildCuratedProblem({
    fixture,
    selector: record.selector,
    overlays: record.overlays,
    profileId: record.profileId,
    candidate: { left: record.left, right: record.right, reviewedTransitions: [] },
  });
  const eligibility = evaluateInstanceEligibility(instance);
  const eligibleTargets = [eligibility.paths.canonical, ...eligibility.paths.alternates]
    .filter((path) => path.rendering === 'eligible')
    .map((path) => path.targetDenominator);
  requireValid(JSON.stringify([...eligibleTargets].sort((a, b) => Number(a) - Number(b)))
    === JSON.stringify([...targets].sort((a, b) => Number(a) - Number(b))),
  'authored paths must equal the exact representation-eligible paths');

  const premiseChecks = {};
  const reflectionChoices = {};
  const resultStacks = {};
  for (const target of targets) {
    const path = record.paths[target];
    premiseChecks[target] = materializePremise(record, path, left, target);
    reflectionChoices[target] = materializeChoices(path, left, target);
    if (record.recipe.id === PLAN17_RECIPE_ID) {
      resultStacks[target] = materializeCrossingResultStack(left, right, target);
    }
  }
  return deepFreeze({
    itemId: record.itemId,
    fixtureId: record.fixtureId,
    authoringRevision: record.authoringRevision,
    taskDataRevision: record.taskDataRevision,
    recipe: record.recipe,
    fixture,
    premiseChecks,
    reflectionChoices,
    ...(record.recipe.id === PLAN17_RECIPE_ID ? { resultStacks } : {}),
  });
}

/** Materialize independently per record; input enumeration cannot affect outputs. */
function materializeRecords(records, expectedRecipe) {
  requireValid(Array.isArray(records), 'records must be an array');
  const itemIds = new Set();
  const fixtureKeys = new Set();
  return deepFreeze(records.map((record) => {
    validateRecord(record);
    requireValid(record.recipe.id === expectedRecipe.id
      && record.recipe.revision === expectedRecipe.revision,
    'record does not belong to this recipe collection');
    const fixtureKey = `${record.fixtureId}@${record.authoringRevision}`;
    requireValid(!itemIds.has(record.itemId) && !fixtureKeys.has(fixtureKey), 'item and fixture identities must be unique');
    itemIds.add(record.itemId);
    fixtureKeys.add(fixtureKey);
    return materializeOne(record);
  }));
}

export function materializeCompactAdditionRecords(records = COMPACT_ADDITION_RECORDS) {
  return materializeRecords(records, {
    id: PLAN32_RECIPE_ID,
    revision: PLAN32_RECIPE_REVISION,
  });
}

export function materializeSharedFactorAdditionRecords(records = SHARED_FACTOR_ADDITION_RECORDS) {
  return materializeRecords(records, {
    id: PLAN19_RECIPE_ID,
    revision: PLAN19_RECIPE_REVISION,
  });
}

export function materializeCrossingAdditionRecords(records = CROSSING_ADDITION_RECORDS) {
  return materializeRecords(records, {
    id: PLAN17_RECIPE_ID,
    revision: PLAN17_RECIPE_REVISION,
  });
}

export const MATERIALIZED_PLAN32_ADDITIONS = materializeCompactAdditionRecords();
export const MATERIALIZED_PLAN19_ADDITIONS = materializeSharedFactorAdditionRecords();
export const MATERIALIZED_PLAN17_ADDITIONS = materializeCrossingAdditionRecords();
