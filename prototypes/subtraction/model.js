import {
  areEquivalent,
  convertToDenominator,
  createFraction,
  leastCommonDenominator,
  subtractAtCommonDenominator,
  subtractFractions,
} from '../../src/math/fraction.js';

export const SUBTRACTION_FIXTURES = Object.freeze([
  Object.freeze({
    id: 'like-denominators',
    left: Object.freeze([4, 7]),
    right: Object.freeze([1, 7]),
  }),
  Object.freeze({
    id: 'nested-denominators',
    left: Object.freeze([5, 6]),
    right: Object.freeze([1, 3]),
  }),
  Object.freeze({
    id: 'unlike-denominators',
    left: Object.freeze([3, 4]),
    right: Object.freeze([1, 3]),
  }),
  Object.freeze({
    id: 'small-difference',
    left: Object.freeze([5, 8]),
    right: Object.freeze([1, 2]),
  }),
]);

export function makeFraction(pair) {
  return createFraction(pair[0], pair[1]);
}

export function describeFraction(fraction) {
  return fraction.numerator.toString() + '/' + fraction.denominator.toString();
}

export function deriveFixture(definition) {
  const left = makeFraction(definition.left);
  const right = makeFraction(definition.right);
  const commonDenominator = leastCommonDenominator(left.denominator, right.denominator);
  const renamedLeft = convertToDenominator(left, commonDenominator);
  const renamedRight = convertToDenominator(right, commonDenominator);
  const exactDifference = subtractFractions(left, right);
  const displayedDifference = subtractAtCommonDenominator(
    renamedLeft,
    renamedRight,
    commonDenominator,
  );

  if (!areEquivalent(exactDifference, displayedDifference)) {
    throw new Error('The exact and displayed subtraction results do not match.');
  }

  return Object.freeze({
    id: definition.id,
    left,
    right,
    commonDenominator,
    renamedLeft,
    renamedRight,
    exactDifference,
    displayedDifference,
  });
}

export const SUBTRACTION_FIXTURE_MODELS = Object.freeze(
  SUBTRACTION_FIXTURES.map(deriveFixture),
);

export function isCorrectAnswer(numeratorText, denominatorText, expected) {
  if (!/^\d+$/.test(numeratorText) || !/^\d+$/.test(denominatorText)) {
    return false;
  }

  try {
    const answer = createFraction(BigInt(numeratorText), BigInt(denominatorText));
    return areEquivalent(answer, expected);
  } catch {
    return false;
  }
}
