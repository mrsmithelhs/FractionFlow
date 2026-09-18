import {
  areEquivalent,
  createFraction,
  gcd,
  isCommonDenominator,
  isFraction,
  leastCommonDenominator,
} from './fraction.js';
import { isMixedNumber } from './mixed-number.js';

export const PATTERNS = Object.freeze({
  ADD_NUMERATORS_AND_DENOMINATORS: 'ADD_NUMERATORS_AND_DENOMINATORS',
  SUBTRACT_NUMERATORS_AND_DENOMINATORS: 'SUBTRACT_NUMERATORS_AND_DENOMINATORS',
  DENOMINATOR_CHANGED_NUMERATOR_FIXED: 'DENOMINATOR_CHANGED_NUMERATOR_FIXED',
  NUMERATOR_CHANGED_INCORRECT_SCALE: 'NUMERATOR_CHANGED_INCORRECT_SCALE',
  INVALID_COMMON_DENOMINATOR: 'INVALID_COMMON_DENOMINATOR',
  CORRECT_DENOMINATOR_INCORRECT_NUMERATOR: 'CORRECT_DENOMINATOR_INCORRECT_NUMERATOR',
  CORRECT_CONVERSIONS_ARITHMETIC_ERROR: 'CORRECT_CONVERSIONS_ARITHMETIC_ERROR',
  CORRECT_UNSIMPLIFIED_RESULT: 'CORRECT_UNSIMPLIFIED_RESULT',
  EQUIVALENT_ALTERNATE_FORM: 'EQUIVALENT_ALTERNATE_FORM',
  INCORRECT_REGROUPING_QUANTITY: 'INCORRECT_REGROUPING_QUANTITY',
});

/**
 * Classify response patterns for a proposed operation result.
 * Per 03-math-and-content-model.md §62.
 * Returns mathematical pattern classifications without psychological attribution.
 */
export function classifyOperationResponse({
  operation,
  left,
  right,
  proposed,
  targetDenominator = null,
}) {
  if (!isFraction(left) || !isFraction(right) || !isFraction(proposed)) {
    throw new TypeError('operands and proposed result must be fractions');
  }

  const detected = [];
  const details = {};

  const lcd = leastCommonDenominator(left.denominator, right.denominator);
  const commonDenom = targetDenominator !== null
    ? BigInt(targetDenominator)
    : lcd;

  // 1. ADD_NUMERATORS_AND_DENOMINATORS: (a+c)/(b+d)
  if (operation === 'add') {
    const rawSumNum = left.numerator + right.numerator;
    const rawSumDenom = left.denominator + right.denominator;
    if (
      proposed.numerator === rawSumNum
      && proposed.denominator === rawSumDenom
    ) {
      detected.push(PATTERNS.ADD_NUMERATORS_AND_DENOMINATORS);
      details.addNumeratorsAndDenominators = {
        expectedNumerator: rawSumNum,
        expectedDenominator: rawSumDenom,
      };
    }
  }

  // 2. SUBTRACT_NUMERATORS_AND_DENOMINATORS: (a-c)/(b-d)
  if (operation === 'subtract') {
    const rawDiffNum = left.numerator - right.numerator;
    const rawDiffDenom = left.denominator - right.denominator;
    if (
      rawDiffNum >= 0n
      && rawDiffDenom > 0n
      && proposed.numerator === rawDiffNum
      && proposed.denominator === rawDiffDenom
    ) {
      detected.push(PATTERNS.SUBTRACT_NUMERATORS_AND_DENOMINATORS);
      details.subtractNumeratorsAndDenominators = {
        expectedNumerator: rawDiffNum,
        expectedDenominator: rawDiffDenom,
      };
    }
  }

  // 3. DENOMINATOR_CHANGED_NUMERATOR_FIXED:
  // Denominator matches a common denominator, but numerator was merely added/subtracted without scaling
  if (
    isCommonDenominator(proposed.denominator, left.denominator, right.denominator)
    && proposed.denominator !== left.denominator
    && proposed.denominator !== right.denominator
  ) {
    const unscaledNumerator = operation === 'add'
      ? left.numerator + right.numerator
      : left.numerator - right.numerator;

    if (unscaledNumerator >= 0n && proposed.numerator === unscaledNumerator) {
      detected.push(PATTERNS.DENOMINATOR_CHANGED_NUMERATOR_FIXED);
      details.denominatorChangedNumeratorFixed = {
        unscaledNumerator,
        commonDenominator: proposed.denominator,
      };
    }
  }

  // Check correct value and simplification
  const expectedConvertedLeft = (left.numerator * commonDenom) / left.denominator;
  const expectedConvertedRight = (right.numerator * commonDenom) / right.denominator;
  const expectedNumerator = operation === 'add'
    ? expectedConvertedLeft + expectedConvertedRight
    : expectedConvertedLeft - expectedConvertedRight;

  const exactExpectedFraction = createFraction(expectedNumerator, commonDenom);
  const isEquivalent = areEquivalent(proposed, exactExpectedFraction);

  if (isEquivalent) {
    const commonFactor = gcd(proposed.numerator, proposed.denominator);
    if (commonFactor > 1n) {
      detected.push(PATTERNS.CORRECT_UNSIMPLIFIED_RESULT);
      details.correctUnsimplified = {
        commonFactor,
      };
    }

    if (proposed.denominator !== lcd) {
      detected.push(PATTERNS.EQUIVALENT_ALTERNATE_FORM);
      details.equivalentAlternateForm = {
        leastCommonDenominator: lcd,
        usedDenominator: proposed.denominator,
      };
    }
  } else {
    // Value is incorrect
    const isCommon = isCommonDenominator(proposed.denominator, left.denominator, right.denominator);
    if (isCommon) {
      detected.push(PATTERNS.CORRECT_DENOMINATOR_INCORRECT_NUMERATOR);
      details.correctDenominatorIncorrectNumerator = {
        expectedNumeratorAtDenominator: (expectedNumerator * proposed.denominator) / commonDenom,
        actualNumerator: proposed.numerator,
      };

      // Check if conversion scale was applied but arithmetic had an off-by-small error
      const actualAtCommon = (expectedNumerator * proposed.denominator) / commonDenom;
      const difference = proposed.numerator > actualAtCommon
        ? proposed.numerator - actualAtCommon
        : actualAtCommon - proposed.numerator;

      if (difference > 0n && difference <= 5n) {
        detected.push(PATTERNS.CORRECT_CONVERSIONS_ARITHMETIC_ERROR);
        details.arithmeticErrorDifference = difference;
      }
    } else {
      detected.push(PATTERNS.INVALID_COMMON_DENOMINATOR);
      details.invalidDenominator = {
        proposedDenominator: proposed.denominator,
      };
    }
  }

  return Object.freeze({
    patterns: Object.freeze(detected),
    hasPattern: (pattern) => detected.includes(pattern),
    details: Object.freeze(details),
  });
}

/**
 * Classify response patterns during equivalent fraction conversion.
 */
export function classifyConversionResponse({ original, proposed, targetDenominator = null }) {
  if (!isFraction(original) || !isFraction(proposed)) {
    throw new TypeError('original and proposed values must be fractions');
  }

  const detected = [];
  const details = {};

  const target = targetDenominator !== null ? BigInt(targetDenominator) : proposed.denominator;

  // Denominator changed while numerator stayed fixed (e.g. 1/3 -> 1/12)
  if (proposed.denominator !== original.denominator && proposed.numerator === original.numerator) {
    detected.push(PATTERNS.DENOMINATOR_CHANGED_NUMERATOR_FIXED);
    details.fixedNumerator = original.numerator;
  }

  // Check if numerator changed with incorrect scale
  if (
    proposed.denominator !== original.denominator
    && proposed.denominator % original.denominator === 0n
  ) {
    const requiredScale = proposed.denominator / original.denominator;
    const isEquiv = areEquivalent(original, proposed);
    if (!isEquiv && proposed.numerator !== original.numerator) {
      detected.push(PATTERNS.NUMERATOR_CHANGED_INCORRECT_SCALE);
      details.requiredScale = requiredScale;
      details.actualScale = proposed.numerator / original.numerator;
    }
  }

  if (targetDenominator !== null && proposed.denominator !== target) {
    detected.push(PATTERNS.INVALID_COMMON_DENOMINATOR);
  }

  return Object.freeze({
    patterns: Object.freeze(detected),
    hasPattern: (pattern) => detected.includes(pattern),
    details: Object.freeze(details),
  });
}

/**
 * Classify response patterns during mixed-number regrouping (decomposition).
 */
export function classifyRegroupingResponse({ original, proposed, type = 'decomposition' }) {
  if (!isMixedNumber(original) || !isMixedNumber(proposed)) {
    throw new TypeError('original and proposed values must be mixed numbers');
  }

  const detected = [];
  const details = {};

  if (type === 'decomposition') {
    const expectedFractionNum = original.fraction.numerator + original.fraction.denominator;
    const expectedWhole = original.whole - 1n;

    const wholeDecreased = proposed.whole === expectedWhole;
    const fractionIncremented = proposed.fraction.numerator === expectedFractionNum
      && proposed.fraction.denominator === original.fraction.denominator;

    if (!wholeDecreased || !fractionIncremented) {
      detected.push(PATTERNS.INCORRECT_REGROUPING_QUANTITY);
      details.expected = {
        whole: expectedWhole,
        numerator: expectedFractionNum,
        denominator: original.fraction.denominator,
      };
      details.actual = {
        whole: proposed.whole,
        numerator: proposed.fraction.numerator,
        denominator: proposed.fraction.denominator,
      };
    }
  }

  return Object.freeze({
    patterns: Object.freeze(detected),
    hasPattern: (pattern) => detected.includes(pattern),
    details: Object.freeze(details),
  });
}
