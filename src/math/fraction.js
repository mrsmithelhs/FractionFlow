const FRACTION_KIND = 'fraction';

const BENCHMARKS = Object.freeze({
  zero: Object.freeze({ kind: FRACTION_KIND, numerator: 0n, denominator: 1n }),
  half: Object.freeze({ kind: FRACTION_KIND, numerator: 1n, denominator: 2n }),
  one: Object.freeze({ kind: FRACTION_KIND, numerator: 1n, denominator: 1n }),
  two: Object.freeze({ kind: FRACTION_KIND, numerator: 2n, denominator: 1n }),
});

function toExactInteger(value, name) {
  if (typeof value === 'bigint') {
    return value;
  }

  if (typeof value === 'number' && Number.isSafeInteger(value)) {
    return BigInt(value);
  }

  throw new TypeError(`${name} must be a bigint or a safe integer number`);
}

function toNonnegativeInteger(value, name) {
  const integer = toExactInteger(value, name);
  if (integer < 0n) {
    throw new RangeError(`${name} must be nonnegative`);
  }
  return integer;
}

function toPositiveInteger(value, name) {
  const integer = toExactInteger(value, name);
  if (integer <= 0n) {
    throw new RangeError(`${name} must be positive`);
  }
  return integer;
}

/**
 * Create an exact, nonnegative fraction while preserving its current form.
 * Construction does not simplify the numerator and denominator.
 */
export function createFraction(numerator, denominator) {
  const exactNumerator = toNonnegativeInteger(numerator, 'numerator');
  const exactDenominator = toPositiveInteger(denominator, 'denominator');

  return Object.freeze({
    kind: FRACTION_KIND,
    numerator: exactNumerator,
    denominator: exactDenominator,
  });
}

/** @returns {boolean} whether a value has the supported fraction shape. */
export function isFraction(value) {
  return Boolean(
    value
      && value.kind === FRACTION_KIND
      && typeof value.numerator === 'bigint'
      && typeof value.denominator === 'bigint'
      && value.numerator >= 0n
      && value.denominator > 0n,
  );
}

function assertFraction(value, name = 'fraction') {
  if (!isFraction(value)) {
    throw new TypeError(`${name} must be a nonnegative fraction with a positive denominator`);
  }
  return value;
}

/** Greatest common divisor of integer inputs, returned as a nonnegative bigint. */
export function gcd(left, right) {
  let a = toExactInteger(left, 'left');
  let b = toExactInteger(right, 'right');

  if (a < 0n) a = -a;
  if (b < 0n) b = -b;

  while (b !== 0n) {
    [a, b] = [b, a % b];
  }

  return a;
}

/** Least common multiple of integer inputs, returned as a nonnegative bigint. */
export function lcm(left, right) {
  const a = toExactInteger(left, 'left');
  const b = toExactInteger(right, 'right');
  if (a === 0n || b === 0n) return 0n;
  return ((a < 0n ? -a : a) / gcd(a, b)) * (b < 0n ? -b : b);
}

/** Whether candidate is a positive common multiple of every supplied denominator. */
export function isCommonDenominator(candidate, ...denominators) {
  const target = toPositiveInteger(candidate, 'candidate denominator');
  if (denominators.length === 0) {
    throw new RangeError('at least one denominator is required');
  }

  return denominators.every((denominator, index) => {
    const positiveDenominator = toPositiveInteger(denominator, `denominator ${index + 1}`);
    return target % positiveDenominator === 0n;
  });
}

/** Least positive common multiple of one or more positive denominators. */
export function leastCommonDenominator(...denominators) {
  if (denominators.length === 0) {
    throw new RangeError('at least one denominator is required');
  }

  return denominators.reduce(
    (current, denominator, index) => lcm(current, toPositiveInteger(denominator, `denominator ${index + 1}`)),
    1n,
  );
}

/** Compare two exact fractions: -1, 0, or 1. */
export function compareFractions(left, right) {
  const leftFraction = assertFraction(left, 'left fraction');
  const rightFraction = assertFraction(right, 'right fraction');
  const leftCrossProduct = leftFraction.numerator * rightFraction.denominator;
  const rightCrossProduct = rightFraction.numerator * leftFraction.denominator;

  if (leftCrossProduct < rightCrossProduct) return -1;
  if (leftCrossProduct > rightCrossProduct) return 1;
  return 0;
}

export function equalFractions(left, right) {
  return compareFractions(left, right) === 0;
}

export const areEquivalent = equalFractions;

/** Explicitly simplify a fraction; ordinary construction and arithmetic do not call this. */
export function simplifyFraction(value) {
  const fraction = assertFraction(value);
  const commonFactor = gcd(fraction.numerator, fraction.denominator);
  return createFraction(
    fraction.numerator / commonFactor,
    fraction.denominator / commonFactor,
  );
}

/** Return the positive scale factor needed to express a fraction at targetDenominator. */
export function scaleFactorForDenominator(value, targetDenominator) {
  const fraction = assertFraction(value);
  const target = toPositiveInteger(targetDenominator, 'target denominator');
  if (target % fraction.denominator !== 0n) {
    throw new RangeError('target denominator must be divisible by the fraction denominator');
  }
  return target / fraction.denominator;
}

/** Rename a fraction by a positive integer scale factor without simplifying it. */
export function convertByScaleFactor(value, scaleFactor) {
  const fraction = assertFraction(value);
  const factor = toPositiveInteger(scaleFactor, 'scale factor');
  return createFraction(
    fraction.numerator * factor,
    fraction.denominator * factor,
  );
}

/** Rename a fraction at any valid target denominator without simplifying it. */
export function convertToDenominator(value, targetDenominator) {
  const fraction = assertFraction(value);
  const factor = scaleFactorForDenominator(fraction, targetDenominator);
  return convertByScaleFactor(fraction, factor);
}

function addAtDenominator(left, right, targetDenominator, operationName) {
  const leftFraction = assertFraction(left, 'left fraction');
  const rightFraction = assertFraction(right, 'right fraction');
  const target = toPositiveInteger(targetDenominator, 'target denominator');
  const convertedLeft = convertToDenominator(leftFraction, target);
  const convertedRight = convertToDenominator(rightFraction, target);
  const numerator = operationName === 'subtract'
    ? convertedLeft.numerator - convertedRight.numerator
    : convertedLeft.numerator + convertedRight.numerator;

  if (numerator < 0n) {
    throw new RangeError('subtraction would produce a negative fraction');
  }

  return createFraction(numerator, target);
}

/** Add fractions at their least common denominator, preserving the raw result form. */
export function addFractions(left, right) {
  const leftFraction = assertFraction(left, 'left fraction');
  const rightFraction = assertFraction(right, 'right fraction');
  return addAtDenominator(
    leftFraction,
    rightFraction,
    leastCommonDenominator(leftFraction.denominator, rightFraction.denominator),
    'add',
  );
}

/** Add fractions at an explicitly selected valid common denominator. */
export function addAtCommonDenominator(left, right, targetDenominator) {
  return addAtDenominator(left, right, targetDenominator, 'add');
}

/** Subtract fractions at their least common denominator, rejecting negative results. */
export function subtractFractions(left, right) {
  const leftFraction = assertFraction(left, 'left fraction');
  const rightFraction = assertFraction(right, 'right fraction');
  return addAtDenominator(
    leftFraction,
    rightFraction,
    leastCommonDenominator(leftFraction.denominator, rightFraction.denominator),
    'subtract',
  );
}

/** Subtract fractions at an explicitly selected valid common denominator. */
export function subtractAtCommonDenominator(left, right, targetDenominator) {
  return addAtDenominator(left, right, targetDenominator, 'subtract');
}

/** Return an exact benchmark fraction for the supported named benchmarks. */
export function benchmarkFraction(name) {
  if (typeof name !== 'string' || !Object.hasOwn(BENCHMARKS, name)) {
    throw new RangeError(`unknown benchmark: ${String(name)}`);
  }
  return BENCHMARKS[name];
}

/** Compare a fraction exactly to a named benchmark, fraction, or whole integer. */
export function compareToBenchmark(value, benchmark) {
  const fraction = assertFraction(value);
  const target = typeof benchmark === 'string'
    ? benchmarkFraction(benchmark)
    : isFraction(benchmark)
      ? benchmark
      : createFraction(benchmark, 1n);
  return compareFractions(fraction, target);
}

export { FRACTION_KIND };
