import {
  benchmarkFraction,
  compareFractions,
  createFraction,
  gcd,
  isFraction,
  leastCommonDenominator,
} from './fraction.js';
import { isMixedNumber } from './mixed-number.js';

function toExactPositiveBigInt(value, name) {
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
 * Classify the relationship between two denominators per 03-math-and-content-model.md §12.
 * Returns: 'same' | 'nested' | 'shared-factor' | 'relatively-prime'
 */
export function denominatorRelationship(left, right) {
  const b = toExactPositiveBigInt(left, 'left denominator');
  const d = toExactPositiveBigInt(right, 'right denominator');

  if (b === d) {
    return 'same';
  }

  if (b % d === 0n || d % b === 0n) {
    return 'nested';
  }

  const commonFactor = gcd(b, d);
  if (commonFactor > 1n) {
    return 'shared-factor';
  }

  return 'relatively-prime';
}

/**
 * Determine which operands require renaming to be expressed at targetDenominator.
 * If targetDenominator is omitted, defaults to leastCommonDenominator.
 */
export function operandsRequiringRenaming(left, right, targetDenominator = null) {
  if (!isFraction(left) || !isFraction(right)) {
    throw new TypeError('left and right operands must be fractions');
  }

  const target = targetDenominator === null
    ? leastCommonDenominator(left.denominator, right.denominator)
    : toExactPositiveBigInt(targetDenominator, 'target denominator');

  if (target % left.denominator !== 0n || target % right.denominator !== 0n) {
    throw new RangeError('target denominator must be a common multiple of both operands');
  }

  return Object.freeze({
    left: left.denominator !== target,
    right: right.denominator !== target,
    targetDenominator: target,
  });
}

/**
 * Classify a fraction's result form, simplification status, and whole boundaries.
 * Per 03-math-and-content-model.md §§8, 23.
 */
export function classifyFractionResult(value) {
  if (!isFraction(value)) {
    throw new TypeError('value must be an exact fraction');
  }

  const { numerator, denominator } = value;

  let resultForm;
  if (numerator === 0n) {
    resultForm = 'zero';
  } else if (numerator < denominator) {
    resultForm = 'proper';
  } else if (numerator === denominator) {
    resultForm = 'exactly-one';
  } else if (numerator % denominator === 0n) {
    resultForm = 'whole-greater-than-one';
  } else {
    resultForm = 'improper';
  }

  const commonFactor = gcd(numerator, denominator);
  const simplificationStatus = commonFactor === 1n
    ? 'already-simplified'
    : 'reducible';

  const isWholeValued = numerator % denominator === 0n;
  const crossesWhole = numerator > denominator;
  const isProper = numerator > 0n && numerator < denominator;

  return Object.freeze({
    resultForm,
    simplificationStatus,
    isWholeValued,
    crossesWhole,
    isProper,
    numerator,
    denominator,
    greatestCommonDivisor: commonFactor,
  });
}

/**
 * Classify whether a mixed-number operation requires regrouping (composition or decomposition).
 * Per 03-math-and-content-model.md §§19-22.
 * Returns: 'none' | 'composition' | 'decomposition'
 */
export function classifyMixedRegrouping(left, right, operation = 'add') {
  if (!isMixedNumber(left) || !isMixedNumber(right)) {
    throw new TypeError('operands must be mixed numbers');
  }

  if (operation === 'add') {
    const fractionalSumNumerator = left.fraction.numerator * right.fraction.denominator
      + right.fraction.numerator * left.fraction.denominator;
    const commonDenominator = left.fraction.denominator * right.fraction.denominator;

    if (fractionalSumNumerator >= commonDenominator) {
      return Object.freeze({
        process: 'regrouping',
        regroupingType: 'composition',
        requiresRegrouping: true,
        wholeUnitsCreated: fractionalSumNumerator / commonDenominator,
      });
    }

    return Object.freeze({
      process: 'regrouping',
      regroupingType: 'none',
      requiresRegrouping: false,
      wholeUnitsCreated: 0n,
    });
  }

  if (operation === 'subtract') {
    const leftScaled = left.fraction.numerator * right.fraction.denominator;
    const rightScaled = right.fraction.numerator * left.fraction.denominator;

    if (leftScaled < rightScaled) {
      return Object.freeze({
        process: 'regrouping',
        regroupingType: 'decomposition',
        requiresRegrouping: true,
        wholeUnitsRenamed: 1n,
      });
    }

    return Object.freeze({
      process: 'regrouping',
      regroupingType: 'none',
      requiresRegrouping: false,
      wholeUnitsRenamed: 0n,
    });
  }

  throw new RangeError(`unsupported operation: ${String(operation)}`);
}

/**
 * Classify exact magnitude facts relative to benchmarks 0, 1/2, 1, 2, and nearby wholes.
 * Per 03-math-and-content-model.md §24.
 */
export function classifyMagnitude(value) {
  if (!isFraction(value)) {
    throw new TypeError('value must be an exact fraction');
  }

  const relativeToZero = compareFractions(value, benchmarkFraction('zero'));
  const relativeToHalf = compareFractions(value, benchmarkFraction('half'));
  const relativeToOne = compareFractions(value, benchmarkFraction('one'));
  const relativeToTwo = compareFractions(value, benchmarkFraction('two'));

  const lowerWhole = value.numerator / value.denominator;
  const upperWhole = value.numerator % value.denominator === 0n
    ? lowerWhole
    : lowerWhole + 1n;

  let benchmarkRegion;
  if (relativeToZero === 0) {
    benchmarkRegion = 'exact-zero';
  } else if (relativeToHalf === 0) {
    benchmarkRegion = 'exact-half';
  } else if (relativeToOne === 0) {
    benchmarkRegion = 'exact-one';
  } else if (relativeToTwo === 0) {
    benchmarkRegion = 'exact-two';
  } else if (relativeToHalf < 0) {
    benchmarkRegion = 'between-0-and-half';
  } else if (relativeToOne < 0) {
    benchmarkRegion = 'between-half-and-1';
  } else if (relativeToTwo < 0) {
    benchmarkRegion = 'between-1-and-2';
  } else {
    benchmarkRegion = 'greater-than-2';
  }

  return Object.freeze({
    relativeToZero,
    relativeToHalf,
    relativeToOne,
    relativeToTwo,
    lowerWhole,
    upperWhole,
    benchmarkRegion,
  });
}
