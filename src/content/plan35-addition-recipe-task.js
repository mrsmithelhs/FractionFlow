import { addAtCommonDenominator, convertToDenominator, equalFractions, validateCommonDenominator, validateOperationResult } from '../math/index.js';
import { deepFreeze } from './schema.js';
import { evaluateProposedPathEligibility } from './eligibility.js';
import { getProfile } from './profiles.js';
import { resolveCuratedFixture } from './authored-content-catalog.js';
import { PLAN35_ADDITION_RECIPE_RECORDS, PLAN35_RECIPE_DEFINITION_ID, PLAN35_RECIPE_DEFINITION_REVISION, PLAN35_RECIPE_IDS, resolvePlan35RecipeAssociationSet } from './data/plan35-addition-recipe-records.js';

const exactKeys = [
  'practiceSetId', 'practiceSetRevision', 'itemId', 'fixtureId', 'authoringRevision',
  'definitionId', 'definitionRevision', 'patternId', 'patternRevision', 'targetDenominator',
  'taskDataId', 'taskDataRevision', 'stimulusId', 'stimulusRevision', 'candidates',
  'requiredSides', 'sourceForms',
];

function taskError(message) {
  const error = new TypeError(`invalid Plan 35 addition recipe context: ${message}`);
  error.code = 'INVALID_PLAN35_ADDITION_TASK';
  return error;
}

function same(left, right) { return JSON.stringify(left) === JSON.stringify(right); }
function toForm(form) { return { kind: 'fraction', numerator: BigInt(form.numerator), denominator: BigInt(form.denominator) }; }

export function validatePlan35AdditionRecipeRecord(instance, record) {
  if (!record || ![PLAN35_RECIPE_IDS.construct, PLAN35_RECIPE_IDS.inspect, PLAN35_RECIPE_IDS.identify].includes(record.recipeId)
    || record.patternRevision !== '1') throw taskError('recipe identity and revision must be registered');
  const fixture = resolveCuratedFixture(record.fixtureId, record.authoringRevision);
  if (!fixture || !same(record.sourceForms.left, instance?.operands?.left?.initialForm)
    || !same(record.sourceForms.right, instance?.operands?.right?.initialForm)
    || !same(record.sourceForms.left, fixture.left) || !same(record.sourceForms.right, fixture.right)
    || instance?.provenance?.fixtureId !== record.fixtureId || instance?.provenance?.authoringRevision !== record.authoringRevision
    || instance?.request?.profileId !== fixture.profileId || instance?.request?.profileVersion !== getProfile(fixture.profileId).version
    || instance?.request?.selector !== fixture.selector) {
    throw taskError('source forms do not match the exact authored fixture and instance');
  }
  if (!['relatively-prime-addition', 'nested-denominator-addition', 'shared-factor-addition'].includes(instance.request.selector) || instance.request.operation !== 'add'
    || !same(instance.request.overlays, fixture.overlays) || instance.source !== 'curated') throw taskError('only exact reviewed proper addition records are admitted');
  if (typeof record.targetDenominator !== 'string' || !/^[1-9][0-9]*$/.test(record.targetDenominator)) throw taskError('target denominator must be a canonical positive integer string');
  let target;
  try {
    target = BigInt(record.targetDenominator);
  } catch {
    throw taskError('target denominator must be a canonical positive integer');
  }
  const path = validateCommonDenominator(target, toForm(record.sourceForms.left), toForm(record.sourceForms.right));
  if (path.validity !== 'valid') throw taskError('target is not a common denominator');
  const derivedSides = ['left', 'right'].filter((side) => {
    const converted = convertToDenominator(toForm(record.sourceForms[side]), target);
    return converted.denominator.toString() !== record.sourceForms[side].denominator;
  });
  const identify = record.recipeId === PLAN35_RECIPE_IDS.identify;
  const expectedSides = identify ? [record.requiredSide] : ['left', 'right'];
  if (!same(derivedSides, expectedSides)) throw taskError('recipe required sides do not match exact conversion truth');
  if (identify) {
    const untouched = record.requiredSide === 'left' ? 'right' : 'left';
    if (record.sourceForms[untouched].denominator !== record.targetDenominator) throw taskError('identify-side target must be the other operand denominator');
  } else if (record.requiredSide) throw taskError('two-side recipes cannot pin one side');

  const left = convertToDenominator(toForm(record.sourceForms.left), target);
  const right = convertToDenominator(toForm(record.sourceForms.right), target);
  const result = addAtCommonDenominator(toForm(record.sourceForms.left), toForm(record.sourceForms.right), target);
  if (result.numerator >= result.denominator || validateOperationResult(result, left, right, 'add', target).validity !== 'valid') {
    throw taskError('exact sum must be a valid proper addition result');
  }
  const eligibility = evaluateProposedPathEligibility(instance, record.targetDenominator);
  if (eligibility.mathematicalValidity !== 'valid' || eligibility.rendering !== 'eligible'
    || eligibility.authoredCoverage === 'outside-authored-coverage') throw taskError('target exceeds the admitted authored representation capability');

  if (record.recipeId === PLAN35_RECIPE_IDS.inspect) {
    let trueCount = 0;
    for (const side of ['left', 'right']) {
      const candidate = record.candidates?.[side];
      if (!candidate || candidate.kind !== 'fraction'
        || typeof candidate.numerator !== 'string' || !/^(0|[1-9][0-9]*)$/.test(candidate.numerator)
        || candidate.denominator !== record.targetDenominator) throw taskError(`invalid exact ${side} inspect candidate`);
      if (BigInt(candidate.numerator) > target) throw taskError(`inspect candidate ${side} exceeds the target denominator`);
      if (equalFractions(toForm(record.sourceForms[side]), toForm(candidate))) trueCount += 1;
    }
    if (trueCount !== 1 || !record.stimulusId || record.stimulusRevision !== '1') throw taskError('inspect stimulus must contain one valid and one invalid authored candidate');
  } else if (record.candidates || record.stimulusId || record.stimulusRevision) {
    throw taskError('only inspect recipes may carry candidate stimuli');
  }
  return derivedSides;
}

function recordFor(instance, itemId) {
  const matches = PLAN35_ADDITION_RECIPE_RECORDS.filter((record) => (
    record.itemId === itemId && record.fixtureId === instance?.provenance?.fixtureId
      && record.authoringRevision === instance?.provenance?.authoringRevision
  ));
  return matches.length === 1 ? matches[0] : null;
}

export function resolvePlan35AdditionRecipeContext(instance, itemId, { practiceSetId = 'unlike-addition-vetted-set', practiceSetRevision = '7' } = {}) {
  const record = recordFor(instance, itemId);
  const registeredSet = record && resolvePlan35RecipeAssociationSet(practiceSetId, practiceSetRevision, itemId);
  if (!record || !registeredSet) throw taskError('exact registered practice-set and item membership is required');
  const requiredSides = validatePlan35AdditionRecipeRecord(instance, record);
  return deepFreeze({
    practiceSetId, practiceSetRevision: String(practiceSetRevision), itemId: record.itemId,
    fixtureId: record.fixtureId, authoringRevision: record.authoringRevision,
    definitionId: PLAN35_RECIPE_DEFINITION_ID, definitionRevision: PLAN35_RECIPE_DEFINITION_REVISION,
    patternId: record.recipeId, patternRevision: record.patternRevision,
    targetDenominator: record.targetDenominator, taskDataId: record.taskDataId,
    taskDataRevision: record.taskDataRevision, stimulusId: record.stimulusId,
    stimulusRevision: record.stimulusRevision, candidates: record.candidates,
    requiredSides, sourceForms: record.sourceForms,
  });
}

export function validatePlan35AdditionRecipeContext(instance, context) {
  if (!context || typeof context !== 'object' || Array.isArray(context)
    || !same(Object.keys(context).sort(), [...exactKeys].sort())) throw taskError('exact task context shape is required');
  const expected = resolvePlan35AdditionRecipeContext(instance, context.itemId, {
    practiceSetId: context.practiceSetId, practiceSetRevision: context.practiceSetRevision,
  });
  for (const key of exactKeys) if (!same(context[key], expected[key])) throw taskError(`${key} does not match its immutable authored association`);
  return expected;
}

export function isPlan35AdditionRecipeDefinition(definition) {
  return definition?.id === PLAN35_RECIPE_DEFINITION_ID && definition?.revision === PLAN35_RECIPE_DEFINITION_REVISION;
}

export function isPlan35IdentifyRecipe(context) { return context?.patternId === PLAN35_RECIPE_IDS.identify; }
export function listPlan35RecipeRecords() { return PLAN35_ADDITION_RECIPE_RECORDS; }
