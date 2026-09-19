import {
  classifyConversionResponse as classifyMathConversionResponse,
  classifyOperationResponse as classifyMathOperationResponse,
  PATTERNS,
  validateCommonDenominator,
  validateEquivalentFraction,
  validateOperationResult,
} from '../math/index.js';
import {
  evaluateProposedPathEligibility,
} from '../content/eligibility.js';
import { wireToFraction } from '../content/schema.js';

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
    kind: matchesUnits === expected ? 'correct' : 'incorrect-notice',
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
      kind: 'invalid-common-denominator',
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
        ? 'denominator-changed-without-numerator'
        : 'incorrect-equivalent-numerator',
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
    ? 'incorrect-numerator-arithmetic'
    : validation.classification === 'correct-unsimplified'
      ? 'correct-unsimplified'
      : 'correct-simplified';
  return {
    kind,
    validity: validation.validity,
    mathClassification: validation.classification,
    patterns: [...patterns.patterns],
    targetDenominator: target.toString(),
    proposed,
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
  return {
    kind: validation.validity !== 'valid'
      ? 'incorrect-resolution'
      : validation.classification === 'correct-unsimplified'
        ? 'correct-unsimplified'
        : 'correct-simplified',
    validity: validation.validity,
    mathClassification: validation.classification,
    proposed,
    reasons: [...validation.reasons],
  };
}
