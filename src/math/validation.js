import {
  addFractions,
  areEquivalent,
  createFraction,
  gcd,
  isCommonDenominator,
  isFraction,
  leastCommonDenominator,
  subtractFractions,
} from './fraction.js';
import {
  isMixedNumber,
  mixedToImproper,
} from './mixed-number.js';

function toPositiveBigInt(value, name) {
  if (typeof value === 'bigint') {
    if (value <= 0n) throw new RangeError(`${name} must be positive`);
    return value;
  }
  if (typeof value === 'number' && Number.isSafeInteger(value)) {
    if (value <= 0) throw new RangeError(`${name} must be positive`);
    return BigInt(value);
  }
  if (isFraction(value)) {
    return value.denominator;
  }
  throw new TypeError(`${name} must be a positive integer or fraction`);
}

/**
 * Validate a proposed common denominator for two denominators or fractions.
 * Per 03-math-and-content-model.md §§10, 11, 26, 59.
 * Validity is decided by exact divisibility; least/non-least is an efficiency dimension.
 */
export function validateCommonDenominator(candidate, left, right) {
  const leftDenominator = toPositiveBigInt(left, 'left denominator');
  const rightDenominator = toPositiveBigInt(right, 'right denominator');

  let proposed;
  try {
    proposed = toPositiveBigInt(candidate, 'candidate denominator');
  } catch {
    return Object.freeze({
      validity: 'invalid',
      efficiency: 'not-applicable',
      classification: 'invalid',
      proposedDenominator: null,
      leastCommonDenominator: leastCommonDenominator(leftDenominator, rightDenominator),
      scaleFactors: null,
      reasons: ['not-a-positive-integer'],
    });
  }

  const lcd = leastCommonDenominator(leftDenominator, rightDenominator);
  const isValid = isCommonDenominator(proposed, leftDenominator, rightDenominator);

  if (!isValid) {
    const reasons = [];
    if (proposed % leftDenominator !== 0n) {
      reasons.push('not-divisible-by-left-denominator');
    }
    if (proposed % rightDenominator !== 0n) {
      reasons.push('not-divisible-by-right-denominator');
    }

    return Object.freeze({
      validity: 'invalid',
      efficiency: 'not-applicable',
      classification: 'invalid',
      proposedDenominator: proposed,
      leastCommonDenominator: lcd,
      scaleFactors: null,
      reasons,
    });
  }

  const isLeast = proposed === lcd;
  const efficiency = isLeast ? 'least' : 'non-least';
  const classification = isLeast ? 'valid-least' : 'valid-non-least';

  return Object.freeze({
    validity: 'valid',
    efficiency,
    classification,
    proposedDenominator: proposed,
    leastCommonDenominator: lcd,
    scaleFactors: Object.freeze({
      left: proposed / leftDenominator,
      right: proposed / rightDenominator,
    }),
    reasons: [],
  });
}

/**
 * Validate a proposed equivalent fraction against an original fraction.
 * Per 03-math-and-content-model.md §§7, 13, 60.
 */
export function validateEquivalentFraction(proposed, original, targetDenominator = null) {
  if (!isFraction(proposed) || !isFraction(original)) {
    throw new TypeError('proposed and original values must be fractions');
  }

  const isEquivalent = areEquivalent(proposed, original);
  const target = targetDenominator === null
    ? null
    : toPositiveBigInt(targetDenominator, 'target denominator');

  const matchesTargetDenominator = target === null
    ? true
    : proposed.denominator === target;

  const isValid = isEquivalent && matchesTargetDenominator;

  let scaleFactor = null;
  if (isEquivalent && proposed.denominator % original.denominator === 0n) {
    scaleFactor = proposed.denominator / original.denominator;
  }

  const reasons = [];
  if (!isEquivalent) {
    reasons.push('not-equivalent-in-value');
  }
  if (!matchesTargetDenominator) {
    reasons.push('denominator-does-not-match-target');
  }

  return Object.freeze({
    validity: isValid ? 'valid' : 'invalid',
    isEquivalent,
    matchesTargetDenominator,
    scaleFactor,
    proposed,
    original,
    reasons,
  });
}

/**
 * Validate a proposed mixed-number form against an original value.
 * Per 03-math-and-content-model.md §§61, 85.
 * Distinguishes canonical proper-remainder forms from valid intermediate regrouped forms.
 */
export function validateMixedNumberForm(proposed, originalValue) {
  if (!isMixedNumber(proposed)) {
    throw new TypeError('proposed value must be a mixed number');
  }

  const originalImproper = isMixedNumber(originalValue)
    ? mixedToImproper(originalValue)
    : isFraction(originalValue)
      ? originalValue
      : null;

  if (!originalImproper) {
    throw new TypeError('originalValue must be a fraction or mixed number');
  }

  const proposedImproper = mixedToImproper(proposed);
  const isEquivalent = areEquivalent(proposedImproper, originalImproper);
  const isCanonical = proposed.fraction.numerator < proposed.fraction.denominator;
  const isRegrouped = isEquivalent && !isCanonical;

  const reasons = [];
  if (!isEquivalent) {
    reasons.push('not-equivalent-in-value');
  }

  return Object.freeze({
    validity: isEquivalent ? 'valid' : 'invalid',
    isEquivalent,
    isCanonical,
    isRegrouped,
    proposed,
    reasons,
  });
}

/**
 * Validate an intermediate regrouped state (composition or decomposition).
 * Per 03-math-and-content-model.md §§19-21, 61.
 */
export function validateRegroupedState(proposed, original, expectedType) {
  if (!isMixedNumber(proposed) || !isMixedNumber(original)) {
    throw new TypeError('proposed and original values must be mixed numbers');
  }

  const mixedValidation = validateMixedNumberForm(proposed, original);
  if (mixedValidation.validity !== 'valid') {
    return Object.freeze({
      validity: 'invalid',
      expectedType,
      isEquivalent: false,
      structureMatches: false,
      reasons: ['not-equivalent-in-value'],
    });
  }

  if (expectedType === 'decomposition') {
    const isExpectedStructure = proposed.whole === original.whole - 1n
      && proposed.fraction.denominator === original.fraction.denominator
      && proposed.fraction.numerator === original.fraction.numerator + original.fraction.denominator;

    return Object.freeze({
      validity: isExpectedStructure ? 'valid' : 'invalid',
      expectedType,
      isEquivalent: true,
      structureMatches: isExpectedStructure,
      reasons: isExpectedStructure ? [] : ['structure-does-not-match-one-whole-decomposition'],
    });
  }

  if (expectedType === 'composition') {
    const wholeGain = original.fraction.numerator / original.fraction.denominator;
    const remainderNumerator = original.fraction.numerator % original.fraction.denominator;
    const isExpectedStructure = proposed.whole === original.whole + wholeGain
      && proposed.fraction.denominator === original.fraction.denominator
      && proposed.fraction.numerator === remainderNumerator;

    return Object.freeze({
      validity: isExpectedStructure ? 'valid' : 'invalid',
      expectedType,
      isEquivalent: true,
      structureMatches: isExpectedStructure,
      reasons: isExpectedStructure ? [] : ['structure-does-not-match-composition-to-proper-remainder'],
    });
  }

  throw new RangeError(`unknown expected regrouping type: ${String(expectedType)}`);
}

/**
 * Validate an operation result (addition or subtraction of fractions).
 * Per 03-math-and-content-model.md §§26, 57, 83.
 * Distinguishes correct-simplified, correct-unsimplified, and incorrect results.
 */
export function validateOperationResult(proposed, left, right, operation, targetDenominator = null) {
  if (!isFraction(proposed) || !isFraction(left) || !isFraction(right)) {
    throw new TypeError('operands and proposed result must be fractions');
  }

  let exactExpected;
  if (operation === 'add') {
    exactExpected = addFractions(left, right);
  } else if (operation === 'subtract') {
    exactExpected = subtractFractions(left, right);
  } else {
    throw new RangeError(`unsupported operation: ${String(operation)}`);
  }

  const isEquivalent = areEquivalent(proposed, exactExpected);
  const commonFactor = gcd(proposed.numerator, proposed.denominator);
  const isSimplified = commonFactor === 1n;

  const target = targetDenominator === null
    ? null
    : toPositiveBigInt(targetDenominator, 'target denominator');

  const matchesTargetDenominator = target === null
    ? true
    : proposed.denominator === target;

  let classification;
  if (!isEquivalent) {
    classification = 'incorrect';
  } else if (isSimplified) {
    classification = 'correct-simplified';
  } else {
    classification = 'correct-unsimplified';
  }

  const reasons = [];
  if (!isEquivalent) {
    reasons.push('value-incorrect');
  }
  if (!matchesTargetDenominator) {
    reasons.push('denominator-differs-from-target');
  }

  return Object.freeze({
    validity: isEquivalent ? 'valid' : 'invalid',
    classification,
    isEquivalent,
    isSimplified,
    matchesTargetDenominator,
    proposed,
    expectedLcdRaw: exactExpected,
    reasons,
  });
}
