import {
  convertToDenominator,
  equalFractions,
  subtractAtCommonDenominator,
  validateCommonDenominator,
  validateOperationResult,
} from '../math/index.js';
import { deepFreeze } from './schema.js';
import { evaluateProposedPathEligibility } from './eligibility.js';
import { getProfile } from './profiles.js';
import { resolveCuratedFixture } from './authored-content-catalog.js';
import {
  PLAN40_SUBTRACTION_RECIPE_RECORDS,
  PLAN40_RECIPE_DEFINITION_ID,
  PLAN40_RECIPE_DEFINITION_REVISION,
  PLAN40_RECIPE_IDS,
  resolvePlan40RecipeAssociationSet,
} from './data/plan40-reusable-subtraction-recipes-records.js';

export const EXACT_PLAN40_TASK_CONTEXT_KEYS = Object.freeze([
  'practiceSetId',
  'practiceSetRevision',
  'itemId',
  'fixtureId',
  'authoringRevision',
  'definitionId',
  'definitionRevision',
  'patternId',
  'patternRevision',
  'targetDenominator',
  'taskDataId',
  'taskDataRevision',
  'stimulusId',
  'stimulusRevision',
  'candidates',
  'requiredSides',
  'sourceForms',
]);

const VALID_RECIPE_IDS = new Set([
  PLAN40_RECIPE_IDS.construct,
  PLAN40_RECIPE_IDS.inspect,
  PLAN40_RECIPE_IDS.identify,
  'full-subtraction.construct-equivalent',
  'full-subtraction.inspect-keep-repair',
  'full-subtraction.identify-side-construct',
]);

function taskError(message) {
  const error = new TypeError(`invalid Plan 40 subtraction recipe context: ${message}`);
  error.code = 'INVALID_PLAN40_SUBTRACTION_TASK';
  return error;
}

function same(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

function toForm(form) {
  return {
    kind: 'fraction',
    numerator: BigInt(form.numerator),
    denominator: BigInt(form.denominator),
  };
}

export function validatePlan40SubtractionRecipeRecord(instance, record) {
  if (!record || !VALID_RECIPE_IDS.has(record.recipeId) || record.patternRevision !== '1') {
    throw taskError('recipe identity and revision must be registered');
  }

  const fixture = resolveCuratedFixture(record.fixtureId, record.authoringRevision);
  if (!fixture
    || !same(record.sourceForms.left, instance?.operands?.left?.initialForm)
    || !same(record.sourceForms.right, instance?.operands?.right?.initialForm)
    || !same(record.sourceForms.left, fixture.left)
    || !same(record.sourceForms.right, fixture.right)
    || instance?.provenance?.fixtureId !== record.fixtureId
    || instance?.provenance?.authoringRevision !== record.authoringRevision
    || instance?.request?.profileId !== fixture.profileId
    || instance?.request?.profileVersion !== getProfile(fixture.profileId).version
    || instance?.request?.selector !== fixture.selector) {
    throw taskError('source forms do not match the exact authored fixture and instance');
  }

  if (!['relatively-prime-subtraction', 'nested-denominator-subtraction', 'shared-factor-subtraction'].includes(instance.request.selector)
    || instance.request.operation !== 'subtract'
    || !same(instance.request.overlays, fixture.overlays)
    || instance.source !== 'curated') {
    throw taskError('only exact reviewed proper subtraction records are admitted');
  }

  if (typeof record.targetDenominator !== 'string' || !/^[1-9][0-9]*$/.test(record.targetDenominator)) {
    throw taskError('target denominator must be a canonical positive integer string');
  }

  let target;
  try {
    target = BigInt(record.targetDenominator);
  } catch {
    throw taskError('target denominator must be a canonical positive integer');
  }

  const path = validateCommonDenominator(target, toForm(record.sourceForms.left), toForm(record.sourceForms.right));
  if (path.validity !== 'valid') {
    throw taskError('target is not a common denominator');
  }

  const derivedSides = ['left', 'right'].filter((side) => {
    const converted = convertToDenominator(toForm(record.sourceForms[side]), target);
    return converted.denominator.toString() !== record.sourceForms[side].denominator;
  });

  const identify = record.recipeId === PLAN40_RECIPE_IDS.identify
    || record.recipeId === 'full-subtraction.identify-side-construct';
  const expectedSides = identify ? [record.requiredSide] : ['left', 'right'];
  if (!same(derivedSides, expectedSides)) {
    throw taskError('recipe required sides do not match exact conversion truth');
  }

  if (identify) {
    const untouched = record.requiredSide === 'left' ? 'right' : 'left';
    if (record.sourceForms[untouched].denominator !== record.targetDenominator) {
      throw taskError('identify-side target must be the other operand denominator');
    }
  } else if (record.requiredSide) {
    throw taskError('two-side recipes cannot pin one side');
  }

  const left = convertToDenominator(toForm(record.sourceForms.left), target);
  const right = convertToDenominator(toForm(record.sourceForms.right), target);
  const result = subtractAtCommonDenominator(toForm(record.sourceForms.left), toForm(record.sourceForms.right), target);
  if (result.numerator <= 0n
    || result.numerator >= result.denominator
    || validateOperationResult(result, left, right, 'subtract', target).validity !== 'valid') {
    throw taskError('exact difference must be a valid positive proper subtraction result');
  }

  const eligibility = evaluateProposedPathEligibility(instance, record.targetDenominator);
  if (eligibility.mathematicalValidity !== 'valid'
    || eligibility.rendering !== 'eligible'
    || eligibility.authoredCoverage === 'outside-authored-coverage') {
    throw taskError('target exceeds the admitted authored representation capability');
  }

  const isInspect = record.recipeId === PLAN40_RECIPE_IDS.inspect
    || record.recipeId === 'full-subtraction.inspect-keep-repair';
  if (isInspect) {
    let trueCount = 0;
    for (const side of ['left', 'right']) {
      const candidate = record.candidates?.[side];
      if (!candidate
        || candidate.kind !== 'fraction'
        || typeof candidate.numerator !== 'string'
        || !/^(0|[1-9][0-9]*)$/.test(candidate.numerator)
        || candidate.denominator !== record.targetDenominator) {
        throw taskError(`invalid exact ${side} inspect candidate`);
      }
      if (BigInt(candidate.numerator) > target) {
        throw taskError(`inspect candidate ${side} exceeds the target denominator`);
      }
      if (equalFractions(toForm(record.sourceForms[side]), toForm(candidate))) {
        trueCount += 1;
      }
    }
    if (trueCount !== 1 || !record.stimulusId || record.stimulusRevision !== '1') {
      throw taskError('inspect stimulus must contain one valid and one invalid authored candidate');
    }
  } else if (record.candidates || record.stimulusId || record.stimulusRevision) {
    throw taskError('only inspect recipes may carry candidate stimuli');
  }

  return derivedSides;
}

function recordFor(instance, itemId) {
  const matches = PLAN40_SUBTRACTION_RECIPE_RECORDS.filter((record) => (
    record.itemId === itemId
      && record.fixtureId === instance?.provenance?.fixtureId
      && record.authoringRevision === instance?.provenance?.authoringRevision
  ));
  return matches.length === 1 ? matches[0] : null;
}

export function resolvePlan40SubtractionRecipeContext(
  instance,
  itemId,
  { practiceSetId = 'unlike-subtraction-vetted-set', practiceSetRevision = '1' } = {},
) {
  const record = recordFor(instance, itemId);
  const registeredSet = record && resolvePlan40RecipeAssociationSet(practiceSetId, practiceSetRevision, itemId);
  if (!record || !registeredSet) {
    throw taskError('exact registered practice-set and item membership is required');
  }
  const requiredSides = validatePlan40SubtractionRecipeRecord(instance, record);
  return deepFreeze({
    practiceSetId,
    practiceSetRevision: String(practiceSetRevision),
    itemId: record.itemId,
    fixtureId: record.fixtureId,
    authoringRevision: record.authoringRevision,
    definitionId: PLAN40_RECIPE_DEFINITION_ID,
    definitionRevision: PLAN40_RECIPE_DEFINITION_REVISION,
    patternId: record.recipeId,
    patternRevision: record.patternRevision,
    targetDenominator: record.targetDenominator,
    taskDataId: record.taskDataId,
    taskDataRevision: record.taskDataRevision,
    stimulusId: record.stimulusId,
    stimulusRevision: record.stimulusRevision,
    candidates: record.candidates,
    requiredSides,
    sourceForms: record.sourceForms,
  });
}

export function validatePlan40SubtractionRecipeContext(instance, context) {
  if (!context || typeof context !== 'object' || Array.isArray(context)
    || !same(Object.keys(context).sort(), [...EXACT_PLAN40_TASK_CONTEXT_KEYS].sort())) {
    throw taskError('exact task context shape is required');
  }
  const expected = resolvePlan40SubtractionRecipeContext(instance, context.itemId, {
    practiceSetId: context.practiceSetId,
    practiceSetRevision: context.practiceSetRevision,
  });
  for (const key of EXACT_PLAN40_TASK_CONTEXT_KEYS) {
    if (!same(context[key], expected[key])) {
      throw taskError(`${key} does not match its immutable authored association`);
    }
  }
  return expected;
}

export function isPlan40SubtractionRecipeDefinition(definition) {
  return definition?.id === PLAN40_RECIPE_DEFINITION_ID
    && definition?.revision === PLAN40_RECIPE_DEFINITION_REVISION;
}

export function isPlan40IdentifyRecipe(context) {
  return context?.patternId === PLAN40_RECIPE_IDS.identify
    || context?.patternId === 'full-subtraction.identify-side-construct';
}

export function listPlan40RecipeRecords() {
  return PLAN40_SUBTRACTION_RECIPE_RECORDS;
}
