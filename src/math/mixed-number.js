import {
  addFractions,
  compareFractions,
  createFraction,
  isFraction,
  subtractFractions,
} from './fraction.js';

const MIXED_NUMBER_KIND = 'mixed-number';

function assertFraction(value, name = 'fraction') {
  if (!isFraction(value)) {
    throw new TypeError(`${name} must be a nonnegative fraction with a positive denominator`);
  }
  return value;
}

function assertMixedNumber(value, name = 'mixed number') {
  if (
    !value
    || value.kind !== MIXED_NUMBER_KIND
    || typeof value.whole !== 'bigint'
    || value.whole < 0n
  ) {
    throw new TypeError(`${name} must have a nonnegative whole-number part`);
  }
  assertFraction(value.fraction, `${name} fractional part`);
  return value;
}

/** Create an immutable mixed-number form, preserving even an improper fractional component. */
export function createMixedNumber(whole, fractionalPart) {
  if (typeof whole !== 'bigint' && !(typeof whole === 'number' && Number.isSafeInteger(whole))) {
    throw new TypeError('whole must be a bigint or a safe integer number');
  }
  const exactWhole = typeof whole === 'bigint' ? whole : BigInt(whole);
  if (exactWhole < 0n) {
    throw new RangeError('whole must be nonnegative');
  }

  const fraction = assertFraction(fractionalPart, 'fractional part');
  const copiedFraction = createFraction(fraction.numerator, fraction.denominator);

  return Object.freeze({
    kind: MIXED_NUMBER_KIND,
    whole: exactWhole,
    fraction: copiedFraction,
  });
}

export function isMixedNumber(value) {
  return Boolean(
    value
      && value.kind === MIXED_NUMBER_KIND
      && typeof value.whole === 'bigint'
      && value.whole >= 0n
      && isFraction(value.fraction),
  );
}

/** Convert any mixed-number form, including a transient improper remainder, to a fraction. */
export function mixedToImproper(value) {
  const mixed = assertMixedNumber(value);
  return createFraction(
    mixed.whole * mixed.fraction.denominator + mixed.fraction.numerator,
    mixed.fraction.denominator,
  );
}

/** Convert an improper fraction to a mixed form with a proper remainder. */
export function improperToMixed(value) {
  const fraction = assertFraction(value);
  const whole = fraction.numerator / fraction.denominator;
  const remainder = fraction.numerator % fraction.denominator;
  return createMixedNumber(whole, createFraction(remainder, fraction.denominator));
}

/** Canonicalize a mixed form by converting through its exact improper value. */
export function canonicalizeMixedNumber(value) {
  return improperToMixed(mixedToImproper(value));
}

/** Compose a fractional/improper value into a whole part and a proper remainder. */
export const composeMixedNumber = improperToMixed;

/** Rename one whole as fractional units for a nonnegative subtraction path. */
export function regroupForSubtraction(value) {
  const mixed = assertMixedNumber(value);
  if (mixed.whole === 0n) {
    throw new RangeError('cannot decompose a mixed number with no whole unit');
  }

  return createMixedNumber(
    mixed.whole - 1n,
    createFraction(
      mixed.fraction.numerator + mixed.fraction.denominator,
      mixed.fraction.denominator,
    ),
  );
}

/** Add mixed numbers exactly and return the resulting mixed representation. */
export function addMixedNumbers(left, right) {
  return improperToMixed(addFractions(mixedToImproper(left), mixedToImproper(right)));
}

/** Subtract mixed numbers exactly and reject a negative result. */
export function subtractMixedNumbers(left, right) {
  return improperToMixed(subtractFractions(mixedToImproper(left), mixedToImproper(right)));
}

/** Compare mixed-number values through exact improper-fraction values. */
export function compareMixedNumbers(left, right) {
  return compareFractions(mixedToImproper(left), mixedToImproper(right));
}

export function equalMixedNumbers(left, right) {
  return compareMixedNumbers(left, right) === 0;
}

export { MIXED_NUMBER_KIND };
