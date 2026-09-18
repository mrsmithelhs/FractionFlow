import { describe, expect, it } from 'vitest';
import {
  classifyFractionResult,
  classifyMagnitude,
  classifyMixedRegrouping,
  createFraction,
  createMixedNumber,
  denominatorRelationship,
  operandsRequiringRenaming,
} from '../src/math/index.js';

describe('denominatorRelationship', () => {
  it('classifies equal denominators as same', () => {
    expect(denominatorRelationship(5, 5)).toBe('same');
    expect(denominatorRelationship(8n, 8n)).toBe('same');
    expect(denominatorRelationship(createFraction(1, 7), createFraction(3, 7))).toBe('same');
  });

  it('classifies nested denominators when one divides the other', () => {
    expect(denominatorRelationship(3, 12)).toBe('nested');
    expect(denominatorRelationship(12, 3)).toBe('nested');
    expect(denominatorRelationship(2, 8)).toBe('nested');
    expect(denominatorRelationship(createFraction(1, 2), createFraction(3, 8))).toBe('nested');
  });

  it('classifies shared-factor denominators that share a factor > 1 without dividing', () => {
    expect(denominatorRelationship(6, 8)).toBe('shared-factor');
    expect(denominatorRelationship(8, 6)).toBe('shared-factor');
    expect(denominatorRelationship(10, 15)).toBe('shared-factor');
    expect(denominatorRelationship(9, 12)).toBe('shared-factor');
    expect(denominatorRelationship(createFraction(5, 6), createFraction(3, 8))).toBe('shared-factor');
  });

  it('classifies relatively prime denominators with gcd == 1', () => {
    expect(denominatorRelationship(3, 4)).toBe('relatively-prime');
    expect(denominatorRelationship(4, 3)).toBe('relatively-prime');
    expect(denominatorRelationship(5, 7)).toBe('relatively-prime');
    expect(denominatorRelationship(8, 9)).toBe('relatively-prime');
    expect(denominatorRelationship(createFraction(2, 3), createFraction(1, 4))).toBe('relatively-prime');
  });

  it('rejects zero or negative denominators', () => {
    expect(() => denominatorRelationship(0, 4)).toThrow(RangeError);
    expect(() => denominatorRelationship(3, -4)).toThrow(RangeError);
  });
});

describe('operandsRequiringRenaming', () => {
  it('indicates neither operand requires renaming when denominators are same', () => {
    const left = createFraction(1, 5);
    const right = createFraction(2, 5);
    const result = operandsRequiringRenaming(left, right);
    expect(result.left).toBe(false);
    expect(result.right).toBe(false);
    expect(result.targetDenominator).toBe(5n);
  });

  it('indicates only the smaller denominator requires renaming for nested denominators', () => {
    const left = createFraction(1, 2);
    const right = createFraction(3, 8);
    const result = operandsRequiringRenaming(left, right);
    expect(result.left).toBe(true);
    expect(result.right).toBe(false);
    expect(result.targetDenominator).toBe(8n);
  });

  it('indicates both operands require renaming for relatively prime and shared-factor denominators at LCD', () => {
    const left = createFraction(2, 3);
    const right = createFraction(1, 4);
    const relPrime = operandsRequiringRenaming(left, right);
    expect(relPrime.left).toBe(true);
    expect(relPrime.right).toBe(true);
    expect(relPrime.targetDenominator).toBe(12n);

    const leftSf = createFraction(5, 6);
    const rightSf = createFraction(3, 8);
    const sharedFactor = operandsRequiringRenaming(leftSf, rightSf);
    expect(sharedFactor.left).toBe(true);
    expect(sharedFactor.right).toBe(true);
    expect(sharedFactor.targetDenominator).toBe(24n);
  });

  it('supports explicit target common denominators', () => {
    const left = createFraction(2, 3);
    const right = createFraction(1, 4);
    const result = operandsRequiringRenaming(left, right, 24);
    expect(result.left).toBe(true);
    expect(result.right).toBe(true);
    expect(result.targetDenominator).toBe(24n);
  });

  it('rejects invalid target denominators that do not divide both operands', () => {
    const left = createFraction(2, 3);
    const right = createFraction(1, 4);
    expect(() => operandsRequiringRenaming(left, right, 10)).toThrow(RangeError);
  });
});

describe('classifyFractionResult', () => {
  it('classifies zero results', () => {
    const result = classifyFractionResult(createFraction(0, 5));
    expect(result.resultForm).toBe('zero');
    expect(result.isWholeValued).toBe(true);
    expect(result.crossesWhole).toBe(false);
    expect(result.isProper).toBe(false);
    expect(result.simplificationStatus).toBe('reducible'); // gcd(0, 5) = 5 > 1
  });

  it('classifies proper fractions', () => {
    const simplest = classifyFractionResult(createFraction(3, 5));
    expect(simplest.resultForm).toBe('proper');
    expect(simplest.simplificationStatus).toBe('already-simplified');
    expect(simplest.isProper).toBe(true);
    expect(simplest.crossesWhole).toBe(false);

    const reducible = classifyFractionResult(createFraction(4, 6));
    expect(reducible.resultForm).toBe('proper');
    expect(reducible.simplificationStatus).toBe('reducible');
    expect(reducible.isProper).toBe(true);
  });

  it('classifies exactly one', () => {
    const result = classifyFractionResult(createFraction(5, 5));
    expect(result.resultForm).toBe('exactly-one');
    expect(result.isWholeValued).toBe(true);
    expect(result.crossesWhole).toBe(false);
    expect(result.simplificationStatus).toBe('reducible'); // gcd(5, 5) = 5
  });

  it('classifies whole numbers greater than one', () => {
    const result = classifyFractionResult(createFraction(9, 3));
    expect(result.resultForm).toBe('whole-greater-than-one');
    expect(result.isWholeValued).toBe(true);
    expect(result.crossesWhole).toBe(true);
  });

  it('classifies improper fractions', () => {
    const result = classifyFractionResult(createFraction(11, 4));
    expect(result.resultForm).toBe('improper');
    expect(result.isWholeValued).toBe(false);
    expect(result.crossesWhole).toBe(true);
    expect(result.simplificationStatus).toBe('already-simplified');
  });

  it('rejects invalid inputs', () => {
    expect(() => classifyFractionResult(null)).toThrow(TypeError);
    expect(() => classifyFractionResult({ numerator: 1n, denominator: 2n })).toThrow(TypeError);
  });
});

describe('classifyMixedRegrouping', () => {
  it('classifies addition without composition', () => {
    const left = createMixedNumber(1, createFraction(1, 8));
    const right = createMixedNumber(2, createFraction(3, 8));
    const result = classifyMixedRegrouping(left, right, 'add');
    expect(result.requiresRegrouping).toBe(false);
    expect(result.regroupingType).toBe('none');
    expect(result.wholeUnitsCreated).toBe(0n);
  });

  it('classifies addition with composition when fractional sum >= 1', () => {
    const left = createMixedNumber(1, createFraction(5, 8));
    const right = createMixedNumber(2, createFraction(7, 8));
    const result = classifyMixedRegrouping(left, right, 'add');
    expect(result.requiresRegrouping).toBe(true);
    expect(result.regroupingType).toBe('composition');
    expect(result.wholeUnitsCreated).toBe(1n);
  });

  it('classifies subtraction without decomposition when minuend fractional part >= subtrahend', () => {
    const left = createMixedNumber(4, createFraction(5, 8));
    const right = createMixedNumber(2, createFraction(3, 8));
    const result = classifyMixedRegrouping(left, right, 'subtract');
    expect(result.requiresRegrouping).toBe(false);
    expect(result.regroupingType).toBe('none');
  });

  it('classifies subtraction with decomposition when minuend fractional part < subtrahend', () => {
    const left = createMixedNumber(3, createFraction(1, 4)); // 2/8
    const right = createMixedNumber(1, createFraction(5, 8)); // 5/8
    const result = classifyMixedRegrouping(left, right, 'subtract');
    expect(result.requiresRegrouping).toBe(true);
    expect(result.regroupingType).toBe('decomposition');
    expect(result.wholeUnitsRenamed).toBe(1n);
  });

  it('rejects invalid inputs', () => {
    expect(() => classifyMixedRegrouping(createFraction(1, 2), createFraction(1, 3), 'add')).toThrow(TypeError);
    expect(() => classifyMixedRegrouping(
      createMixedNumber(1, createFraction(1, 2)),
      createMixedNumber(1, createFraction(1, 2)),
      'multiply',
    )).toThrow(RangeError);
  });
});

describe('classifyMagnitude', () => {
  it('correctly compares to benchmarks and determines intervals', () => {
    const zero = classifyMagnitude(createFraction(0, 5));
    expect(zero.benchmarkRegion).toBe('exact-zero');
    expect(zero.relativeToZero).toBe(0);

    const quarter = classifyMagnitude(createFraction(1, 4));
    expect(quarter.benchmarkRegion).toBe('between-0-and-half');
    expect(quarter.relativeToZero).toBe(1);
    expect(quarter.relativeToHalf).toBe(-1);
    expect(quarter.lowerWhole).toBe(0n);
    expect(quarter.upperWhole).toBe(1n);

    const half = classifyMagnitude(createFraction(3, 6));
    expect(half.benchmarkRegion).toBe('exact-half');
    expect(half.relativeToHalf).toBe(0);

    const threeQuarters = classifyMagnitude(createFraction(3, 4));
    expect(threeQuarters.benchmarkRegion).toBe('between-half-and-1');
    expect(threeQuarters.relativeToHalf).toBe(1);
    expect(threeQuarters.relativeToOne).toBe(-1);

    const one = classifyMagnitude(createFraction(4, 4));
    expect(one.benchmarkRegion).toBe('exact-one');
    expect(one.relativeToOne).toBe(0);
    expect(one.lowerWhole).toBe(1n);
    expect(one.upperWhole).toBe(1n);

    const oneAndHalf = classifyMagnitude(createFraction(3, 2));
    expect(oneAndHalf.benchmarkRegion).toBe('between-1-and-2');
    expect(oneAndHalf.relativeToOne).toBe(1);
    expect(oneAndHalf.relativeToTwo).toBe(-1);
    expect(oneAndHalf.lowerWhole).toBe(1n);
    expect(oneAndHalf.upperWhole).toBe(2n);

    const two = classifyMagnitude(createFraction(6, 3));
    expect(two.benchmarkRegion).toBe('exact-two');
    expect(two.relativeToTwo).toBe(0);

    const big = classifyMagnitude(createFraction(7, 3));
    expect(big.benchmarkRegion).toBe('greater-than-2');
    expect(big.relativeToTwo).toBe(1);
    expect(big.lowerWhole).toBe(2n);
    expect(big.upperWhole).toBe(3n);
  });
});
