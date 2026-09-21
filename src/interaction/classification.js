import {
  classifyConversionResponse as classifyMathConversionResponse,
  classifyOperationResponse as classifyMathOperationResponse,
  equalFractions,
  PATTERNS,
  simplifyFraction,
  validateCommonDenominator,
  validateEquivalentFraction,
  validateOperationResult,
} from '../math/index.js';
import { reflectionChoicesForInstance } from '../content/data/reflection-choices.js';
import { premiseCheckForInstance } from '../content/data/premise-checks.js';
import {
  evaluateProposedPathEligibility,
} from '../content/eligibility.js';
import { fractionToWire, wireToFraction } from '../content/schema.js';

export const RECOVERY_KINDS = Object.freeze({
  DENOMINATOR_CHANGED_WITHOUT_NUMERATOR: 'denominator-changed-without-numerator',
  INCORRECT_EQUIVALENT_NUMERATOR: 'incorrect-equivalent-numerator',
  INCORRECT_NOTICE: 'incorrect-notice',
  INCORRECT_NUMERATOR_ARITHMETIC: 'incorrect-numerator-arithmetic',
  INCORRECT_REFLECTION: 'incorrect-reflection',
  INVALID_COMMON_DENOMINATOR: 'invalid-common-denominator',
  INVALID_REFLECTION_CHOICE: 'invalid-reflection-choice',
});

export const CLASSIFICATION_RECOVERY_KINDS = Object.freeze(
  Object.values(RECOVERY_KINDS).sort(),
);

export function fractionFromWire(value, name) {
  try {
    const parsed = wireToFraction(value);
    return {
      kind: 'fraction',
      numerator: parsed.numerator,
      denominator: parsed.denominator,
    };
  } catch (error) {
    throw new TypeError(`${name} must be a fraction wire value: ${error.message}`);
  }
}

export function wholeFromWire(value, name = 'whole value') {
  const parsed = fractionFromWire(value, name);
  if (parsed.denominator !== 1n) {
    throw new TypeError(`${name} must be encoded as a whole fraction`);
  }
  return parsed.numerator;
}

export function wholeToWire(value) {
  if (typeof value !== 'bigint') throw new TypeError('whole value must be a bigint');
  return {
    kind: 'fraction',
    numerator: value.toString(),
    denominator: '1',
  };
}

function wholeStringToExact(value, name) {
  return wholeFromWire({
    kind: 'fraction',
    numerator: value,
    denominator: '1',
  }, name);
}

function operands(instance) {
  return {
    left: fractionFromWire(instance.operands.left.initialForm, 'left operand'),
    right: fractionFromWire(instance.operands.right.initialForm, 'right operand'),
  };
}

export function classifyNoticeResponse(instance, matchesUnits) {
  if (typeof matchesUnits !== 'boolean') throw new TypeError('notice response must be boolean');
  const expected = instance.classification.denominator.relationship === 'same';
  return {
    kind: matchesUnits === expected ? 'correct' : RECOVERY_KINDS.INCORRECT_NOTICE,
    expectedMatches: expected,
    matchesUnits,
  };
}

export function classifyCommonDenominatorResponse(instance, proposedWire) {
  const targetDenominator = wholeFromWire(proposedWire, 'proposed denominator');
  const { left, right } = operands(instance);
  const validation = validateCommonDenominator(targetDenominator, left, right);
  if (validation.validity !== 'valid') {
    return {
      kind: RECOVERY_KINDS.INVALID_COMMON_DENOMINATOR,
      validity: validation.validity,
      mathClassification: validation.classification,
      targetDenominator: targetDenominator.toString(),
      reasons: [...validation.reasons],
      authoredCoverage: 'not-applicable',
      rendering: 'ineligible',
      continuation: 'local-recovery',
    };
  }

  const eligibility = evaluateProposedPathEligibility(instance, targetDenominator);
  const kind = eligibility.rendering === 'ineligible'
    ? 'valid-but-outside-representation-capability'
    : eligibility.authoredCoverage === 'outside-authored-coverage'
      ? 'valid-but-outside-authored-coverage'
      : 'valid-common-denominator';
  return {
    kind,
    validity: validation.validity,
    mathClassification: validation.classification,
    targetDenominator: targetDenominator.toString(),
    reasons: [...eligibility.reasons],
    authoredCoverage: eligibility.authoredCoverage,
    rendering: eligibility.rendering,
    continuation: eligibility.continuation,
  };
}

export function classifyConversionResponseForEpisode({ instance, targetDenominator, side, proposed }) {
  if (side !== 'left' && side !== 'right') throw new RangeError(`unsupported conversion side: ${String(side)}`);
  const target = wholeStringToExact(targetDenominator, 'target denominator');
  const source = fractionFromWire(instance.operands[side].initialForm, `${side} operand`);
  const proposedFraction = fractionFromWire(proposed, 'proposed equivalent form');
  const validation = validateEquivalentFraction(proposedFraction, source, target);
  const patterns = classifyMathConversionResponse({
    original: source,
    proposed: proposedFraction,
    targetDenominator: target,
  });
  if (validation.validity !== 'valid') {
    return {
      kind: patterns.hasPattern(PATTERNS.DENOMINATOR_CHANGED_NUMERATOR_FIXED)
        ? RECOVERY_KINDS.DENOMINATOR_CHANGED_WITHOUT_NUMERATOR
        : RECOVERY_KINDS.INCORRECT_EQUIVALENT_NUMERATOR,
      validity: validation.validity,
      mathClassification: 'invalid-equivalent-fraction',
      patterns: [...patterns.patterns],
      targetDenominator: target.toString(),
      side,
      reasons: [...validation.reasons],
    };
  }
  return {
    kind: 'correct-equivalent-form',
    validity: validation.validity,
    mathClassification: 'valid-equivalent-fraction',
    patterns: [...patterns.patterns],
    targetDenominator: target.toString(),
    side,
    reasons: [],
  };
}

export function classifyOperationResponseForEpisode({
  instance,
  targetDenominator,
  convertedLeft,
  convertedRight,
  proposed,
}) {
  const target = wholeStringToExact(targetDenominator, 'target denominator');
  const { left, right } = operands(instance);
  const leftForm = fractionFromWire(convertedLeft, 'converted left operand');
  const rightForm = fractionFromWire(convertedRight, 'converted right operand');
  const proposedResult = fractionFromWire(proposed, 'proposed operation result');
  const validation = validateOperationResult(
    proposedResult,
    left,
    right,
    instance.request.operation,
    target,
  );
  const patterns = classifyMathOperationResponse({
    operation: instance.request.operation,
    left,
    right,
    proposed: proposedResult,
    targetDenominator: target,
    convertedLeft: leftForm,
    convertedRight: rightForm,
  });
  const kind = validation.validity !== 'valid'
    ? RECOVERY_KINDS.INCORRECT_NUMERATOR_ARITHMETIC
    : validation.classification === 'correct-unsimplified'
      ? 'correct-unsimplified'
      : 'correct-simplified';
  const simplifiedResult = fractionToWire(simplifyFraction(proposedResult));
  return {
    kind,
    validity: validation.validity,
    mathClassification: validation.classification,
    patterns: [...patterns.patterns],
    targetDenominator: target.toString(),
    proposed,
    simplifiedResult,
    reasons: [...validation.reasons],
  };
}

export function classifyResolutionResponse({ instance, targetDenominator, proposed }) {
  const target = wholeStringToExact(targetDenominator, 'target denominator');
  const { left, right } = operands(instance);
  const proposedResult = fractionFromWire(proposed, 'proposed resolution');
  const validation = validateOperationResult(
    proposedResult,
    left,
    right,
    instance.request.operation,
    target,
  );
  const simplifiedResult = fractionToWire(simplifyFraction(proposedResult));
  return {
    kind: validation.validity !== 'valid'
      ? 'incorrect-resolution'
      : validation.classification === 'correct-unsimplified'
        ? 'correct-unsimplified'
        : 'correct-simplified',
    validity: validation.validity,
    mathClassification: validation.classification,
    proposed,
    simplifiedResult,
    reasons: [...validation.reasons],
  };
}

/**
 * Classify a reviewed matching-choice identity upstream of presentation.
 * Choice records remain correctness-free; the instructional layer compares the
 * selected authored form with the already-established equivalent form.
 */
export function classifyReflectionResponse({ instance, establishedDenominator, targetForm, response }) {
  const choices = reflectionChoicesForInstance(instance, establishedDenominator);
  const selected = choices?.find((choice) => choice.id === response);
  if (!selected) {
    return {
      kind: RECOVERY_KINDS.INVALID_REFLECTION_CHOICE,
      response,
      continuation: 'local-recovery',
    };
  }

  const target = fractionFromWire(targetForm, 'reflection target');
  const selectedExact = fractionFromWire(selected.form, 'reflection choice');
  const equivalent = equalFractions(selectedExact, target);
  return {
    kind: equivalent ? 'correct-reflection' : RECOVERY_KINDS.INCORRECT_REFLECTION,
    response,
    targetForm,
    selectedForm: selected.form,
    continuation: equivalent ? 'resolved' : 'local-recovery',
  };
}

/**
 * Classify a CM-01-P premise-check response ('yes' or 'no') upstream of presentation.
 * Evaluates the learner's response against the authored premise expectation.
 */
export function classifyPremiseResponse({ instance, establishedDenominator, response }) {
  if (response !== 'yes' && response !== 'no') {
    return {
      kind: RECOVERY_KINDS.INVALID_REFLECTION_CHOICE,
      response,
      continuation: 'local-recovery',
    };
  }
  const premiseCase = premiseCheckForInstance(instance, establishedDenominator);
  if (!premiseCase) {
    return {
      kind: RECOVERY_KINDS.INVALID_REFLECTION_CHOICE,
      response,
      continuation: 'local-recovery',
    };
  }

  const correct = response === premiseCase.expectedResponse;
  return {
    kind: correct ? 'correct-reflection' : RECOVERY_KINDS.INCORRECT_REFLECTION,
    response,
    premiseCase,
    continuation: correct ? 'resolved' : 'local-recovery',
  };
}
