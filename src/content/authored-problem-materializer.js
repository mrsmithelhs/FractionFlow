import {
  convertToDenominator,
  createFraction,
  equalFractions,
} from '../math/index.js';
import { buildCuratedProblem } from './generator.js';
import { deepFreeze, fractionToWire, wireToForm } from './schema.js';
import { evaluateInstanceEligibility } from './eligibility.js';
import { COMPACT_ADDITION_RECORDS } from './data/compact-addition-records.js';

export const PLAN32_RECIPE_ID = 'plan32-reviewed-addition';
export const PLAN32_RECIPE_REVISION = '1';
export const PLAN32_TASK_DATA_REVISION = 'plan32-task-data-v1';

const PREMISE_RULES = new Set(['P-EQUIVALENT', 'P-ADJACENT-UNIT']);
const REFLECTION_RULES = new Set(['R-CORRECT', 'R-KEEP-NUMERATOR', 'R-ADJACENT-UNIT']);
const CHOICE_IDS = Object.freeze(['match-a', 'match-b', 'match-c']);

function requireValid(condition, message) {
  if (!condition) throw new TypeError(`invalid Plan 32 compact record: ${message}`);
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
  requireValid(record.authoringRevision === 'plan32-record-v1'
    && record.taskDataRevision === PLAN32_TASK_DATA_REVISION,
  'record and task-data revisions must be pinned');
  exactKeys(record.recipe, ['id', 'revision'], 'recipe');
  requireValid(record.recipe.id === PLAN32_RECIPE_ID
    && record.recipe.revision === PLAN32_RECIPE_REVISION,
  'unknown recipe identity');
  requireValid(record.profileId === 'curated-review'
    && record.selector === 'relatively-prime-addition'
    && Array.isArray(record.overlays)
    && record.overlays.length === 0,
  'only overlay-free relatively-prime addition is supported');
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
  for (const target of targets) {
    const path = record.paths[target];
    premiseChecks[target] = materializePremise(record, path, left, target);
    reflectionChoices[target] = materializeChoices(path, left, target);
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
  });
}

/** Materialize independently per record; input enumeration cannot affect outputs. */
export function materializeCompactAdditionRecords(records = COMPACT_ADDITION_RECORDS) {
  requireValid(Array.isArray(records), 'records must be an array');
  const itemIds = new Set();
  const fixtureKeys = new Set();
  return deepFreeze(records.map((record) => {
    validateRecord(record);
    const fixtureKey = `${record.fixtureId}@${record.authoringRevision}`;
    requireValid(!itemIds.has(record.itemId) && !fixtureKeys.has(fixtureKey), 'item and fixture identities must be unique');
    itemIds.add(record.itemId);
    fixtureKeys.add(fixtureKey);
    return materializeOne(record);
  }));
}

export const MATERIALIZED_PLAN32_ADDITIONS = materializeCompactAdditionRecords();
