import { describe, expect, test } from 'vitest';

import {
  addAtCommonDenominator,
  addFractions,
  areEquivalent,
  benchmarkFraction,
  compareFractions,
  compareMixedNumbers,
  compareToBenchmark,
  composeMixedNumber,
  createFraction,
  createMixedNumber,
  equalFractions,
  equalMixedNumbers,
  gcd,
  improperToMixed,
  isCommonDenominator,
  isFraction,
  isMixedNumber,
  lcm,
  leastCommonDenominator,
  mixedToImproper,
  regroupForSubtraction,
  scaleFactorForDenominator,
  simplifyFraction,
  subtractAtCommonDenominator,
  subtractFractions,
  subtractMixedNumbers,
  addMixedNumbers,
  convertByScaleFactor,
  convertToDenominator,
} from '../src/math/index.js';

function signOfBigInt(value) {
  if (value < 0n) return -1;
  if (value > 0n) return 1;
  return 0;
}

function diagnosticValue(value) {
  if (typeof value === 'bigint') return `${value}n`;
  if (Array.isArray(value)) return value.map(diagnosticValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, diagnosticValue(nested)]));
  }
  return value;
}

function diagnosticText(value) {
  return JSON.stringify(diagnosticValue(value));
}

function makeRng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0;
    return state;
  };
}

function nextInt(rng, minimum, maximum) {
  return minimum + (rng() % (maximum - minimum + 1));
}

function generatedFraction(rng, maximumDenominator = 240) {
  const denominator = nextInt(rng, 1, maximumDenominator);
  const numerator = nextInt(rng, 0, denominator * 3);
  return createFraction(numerator, denominator);
}

function fractionVariants(value) {
  const numerators = new Set([0n, 1n, value.numerator / 2n, value.numerator]);
  const denominators = new Set([1n, 2n, value.denominator / 2n, value.denominator]);
  const variants = [];

  for (const numerator of numerators) {
    for (const denominator of denominators) {
      if (denominator > 0n) variants.push(createFraction(numerator, denominator));
    }
  }

  return variants;
}

function shrinkPair(state) {
  const candidates = [];
  for (const left of fractionVariants(state.left)) {
    candidates.push({ ...state, left });
  }
  for (const right of fractionVariants(state.right)) {
    candidates.push({ ...state, right });
  }
  return candidates.sort((first, second) => {
    const firstSize = first.left.numerator + first.left.denominator + first.right.numerator + first.right.denominator;
    const secondSize = second.left.numerator + second.left.denominator + second.right.numerator + second.right.denominator;
    return firstSize < secondSize ? -1 : firstSize > secondSize ? 1 : 0;
  });
}

function shrinkMixed(state) {
  const candidates = [];
  for (const fraction of fractionVariants(state.mixed.fraction)) {
    candidates.push({ ...state, mixed: createMixedNumber(state.mixed.whole, fraction) });
  }
  for (const whole of [0n, 1n, state.mixed.whole / 2n, state.mixed.whole]) {
    if (whole >= 0n) candidates.push({ ...state, mixed: createMixedNumber(whole, state.mixed.fraction) });
  }
  return candidates;
}

function minimizeFailingState(state, shrink, stillFails) {
  let current = state;
  let changed = true;

  while (changed) {
    changed = false;
    for (const candidate of shrink(current)) {
      if (stillFails(candidate)) {
        current = candidate;
        changed = true;
        break;
      }
    }
  }

  return current;
}

function runGeneratedInvariant({ name, seed, count, generate, shrink, assertInvariant }) {
  const rng = makeRng(seed);

  for (let caseIndex = 0; caseIndex < count; caseIndex += 1) {
    const state = generate(rng);
    try {
      assertInvariant(state);
    } catch (error) {
      const stillFails = (candidate) => {
        try {
          assertInvariant(candidate);
          return false;
        } catch {
          return true;
        }
      };
      const minimized = minimizeFailingState(state, shrink, stillFails);
      throw new Error(
        [
          `Generated invariant failed: ${name}`,
          `seed=${seed}`,
          `caseIndex=${caseIndex}`,
          `state=${diagnosticText(state)}`,
          `minimized=${diagnosticText(minimized)}`,
          `cause=${error instanceof Error ? error.message : String(error)}`,
        ].join('\n'),
        { cause: error },
      );
    }
  }
}

describe('exact fraction primitives', () => {
  test('preserves raw current forms and freezes returned fractions', () => {
    const raw = createFraction(2, 4);

    expect(raw).toEqual({ kind: 'fraction', numerator: 2n, denominator: 4n });
    expect(Object.isFrozen(raw)).toBe(true);
    expect(isFraction(raw)).toBe(true);
    expect(simplifyFraction(raw)).toEqual(createFraction(1, 2));
    expect(raw).toEqual(createFraction(2, 4));
  });

  test('rejects unsupported fraction input at the boundary', () => {
    expect(() => createFraction(1, 0)).toThrow(/denominator.*positive/i);
    expect(() => createFraction(-1, 2)).toThrow(/numerator.*nonnegative/i);
    expect(() => createFraction(1, -2)).toThrow(/denominator.*positive/i);
    expect(() => createFraction(1.5, 2)).toThrow(/safe integer/i);
    expect(() => createFraction(Number.MAX_SAFE_INTEGER + 1, 2)).toThrow(/safe integer/i);
    expect(() => createFraction('1', 2)).toThrow(/bigint or a safe integer/i);
    expect(isFraction({ kind: 'fraction', numerator: 1n, denominator: 0n })).toBe(false);
  });

  test('computes exact gcd, lcm, common denominators, and scale factors', () => {
    expect(gcd(54, 24)).toBe(6n);
    expect(gcd(-54, 24)).toBe(6n);
    expect(gcd(0, 24)).toBe(24n);
    expect(lcm(3, 4)).toBe(12n);
    expect(lcm(-3, 4)).toBe(12n);
    expect(lcm(0, 4)).toBe(0n);
    expect(isCommonDenominator(24, 3, 4)).toBe(true);
    expect(isCommonDenominator(10, 3, 4)).toBe(false);
    expect(leastCommonDenominator(3, 4)).toBe(12n);
    expect(leastCommonDenominator(3, 4, 6)).toBe(12n);

    const third = createFraction(1, 3);
    expect(scaleFactorForDenominator(third, 24)).toBe(8n);
    expect(convertToDenominator(third, 24)).toEqual(createFraction(8, 24));
    expect(convertByScaleFactor(third, 5)).toEqual(createFraction(5, 15));
    expect(() => scaleFactorForDenominator(third, 10)).toThrow(/divisible/i);
  });

  test('compares and equates repeating-decimal values exactly', () => {
    const exactCases = [
      [createFraction(1, 3), createFraction(2, 6)],
      [createFraction(2, 7), createFraction(6, 21)],
      [createFraction(5, 12), createFraction(25, 60)],
      [createFraction(7, 15), createFraction(35, 75)],
    ];

    for (const [left, right] of exactCases) {
      expect(equalFractions(left, right)).toBe(true);
      expect(areEquivalent(left, right)).toBe(true);
      expect(compareFractions(left, right)).toBe(0);
    }

    expect(compareFractions(createFraction(1, 3), createFraction(1, 2))).toBe(-1);
    expect(compareFractions(createFraction(5, 6), createFraction(4, 5))).toBe(1);
  });

  test('returns exact raw arithmetic results and supports alternate valid denominators', () => {
    expect(addFractions(createFraction(1, 2), createFraction(1, 2))).toEqual(createFraction(2, 2));
    expect(addFractions(createFraction(1, 2), createFraction(1, 4))).toEqual(createFraction(3, 4));
    expect(addFractions(createFraction(1, 6), createFraction(1, 4))).toEqual(createFraction(5, 12));
    expect(addFractions(createFraction(1, 3), createFraction(1, 4))).toEqual(createFraction(7, 12));
    expect(addFractions(createFraction(7, 8), createFraction(3, 8))).toEqual(createFraction(10, 8));
    expect(subtractFractions(createFraction(3, 4), createFraction(1, 4))).toEqual(createFraction(2, 4));
    expect(subtractFractions(createFraction(3, 8), createFraction(3, 8))).toEqual(createFraction(0, 8));
    expect(addAtCommonDenominator(createFraction(1, 3), createFraction(1, 4), 24)).toEqual(createFraction(14, 24));
    expect(subtractAtCommonDenominator(createFraction(1, 3), createFraction(1, 4), 24)).toEqual(createFraction(2, 24));
    expect(() => addAtCommonDenominator(createFraction(1, 3), createFraction(1, 4), 10)).toThrow(/divisible/i);
    expect(() => subtractFractions(createFraction(1, 4), createFraction(1, 2))).toThrow(/negative/i);
  });

  test('simplifies only when explicitly requested and remains exact', () => {
    const raw = createFraction(10, 8);
    const simplified = simplifyFraction(raw);

    expect(simplified).toEqual(createFraction(5, 4));
    expect(equalFractions(raw, simplified)).toBe(true);
    expect(simplifyFraction(simplified)).toEqual(simplified);
    expect(simplifyFraction(createFraction(8, 4))).toEqual(createFraction(2, 1));
    expect(simplifyFraction(createFraction(0, 7))).toEqual(createFraction(0, 1));
  });

  test('compares exact benchmark values without decimal conversion', () => {
    expect(benchmarkFraction('half')).toEqual(createFraction(1, 2));
    expect(compareToBenchmark(createFraction(1, 3), 'half')).toBe(-1);
    expect(compareToBenchmark(createFraction(2, 4), 'half')).toBe(0);
    expect(compareToBenchmark(createFraction(9, 4), 'two')).toBe(1);
    expect(compareToBenchmark(createFraction(7, 4), 2n)).toBe(-1);
    expect(() => benchmarkFraction('quarter')).toThrow(/unknown benchmark/i);
    expect(() => benchmarkFraction('toString')).toThrow(/unknown benchmark/i);
  });
});

describe('mixed-number exact forms', () => {
  test('round-trips proper mixed numbers and freezes nested state', () => {
    const mixed = createMixedNumber(2, createFraction(3, 4));
    const improper = mixedToImproper(mixed);

    expect(mixed).toEqual({
      kind: 'mixed-number',
      whole: 2n,
      fraction: createFraction(3, 4),
    });
    expect(Object.isFrozen(mixed)).toBe(true);
    expect(Object.isFrozen(mixed.fraction)).toBe(true);
    expect(isMixedNumber(mixed)).toBe(true);
    expect(improper).toEqual(createFraction(11, 4));
    expect(improperToMixed(improper)).toEqual(mixed);
    expect(composeMixedNumber(improper)).toEqual(mixed);
  });

  test('copies mutable input forms so returned nested state is independently immutable', () => {
    const mutableFraction = { kind: 'fraction', numerator: 3n, denominator: 4n };
    const mixed = createMixedNumber(2, mutableFraction);

    mutableFraction.numerator = 1n;
    mutableFraction.denominator = 2n;

    expect(mixed.fraction).toEqual(createFraction(3, 4));
    expect(Object.isFrozen(mixed.fraction)).toBe(true);
  });

  test('preserves transient improper fractional components and exact decomposition', () => {
    const canonical = createMixedNumber(3, createFraction(2, 8));
    const regrouped = regroupForSubtraction(canonical);

    expect(regrouped).toEqual(createMixedNumber(2, createFraction(10, 8)));
    expect(equalFractions(mixedToImproper(canonical), mixedToImproper(regrouped))).toBe(true);
    expect(() => regroupForSubtraction(createMixedNumber(0, createFraction(2, 8)))).toThrow(/no whole/i);
    expect(improperToMixed(createFraction(11, 8))).toEqual(createMixedNumber(1, createFraction(3, 8)));
  });

  test('adds and subtracts mixed numbers through exact improper forms', () => {
    const sum = addMixedNumbers(
      createMixedNumber(1, createFraction(1, 2)),
      createMixedNumber(2, createFraction(1, 4)),
    );
    const difference = subtractMixedNumbers(
      createMixedNumber(3, createFraction(1, 4)),
      createMixedNumber(1, createFraction(5, 8)),
    );

    expect(sum).toEqual(createMixedNumber(3, createFraction(3, 4)));
    expect(difference).toEqual(createMixedNumber(1, createFraction(5, 8)));
    expect(compareMixedNumbers(sum, createMixedNumber(3, createFraction(3, 4)))).toBe(0);
    expect(equalMixedNumbers(difference, createMixedNumber(1, createFraction(5, 8)))).toBe(true);
    expect(() => subtractMixedNumbers(
      createMixedNumber(1, createFraction(1, 4)),
      createMixedNumber(2, createFraction(1, 4)),
    )).toThrow(/negative/i);
  });
});

describe('generated exact-arithmetic invariants', () => {
  test('holds for 10,000 deterministic fraction-pair cases', () => {
    runGeneratedInvariant({
      name: 'fraction-pair primitives',
      seed: 0xF0201,
      count: 10_000,
      generate: (rng) => ({
        left: generatedFraction(rng),
        right: generatedFraction(rng),
        scaleFactor: nextInt(rng, 1, 12),
      }),
      shrink: shrinkPair,
      assertInvariant: ({ left, right, scaleFactor }) => {
        const leftScaled = convertByScaleFactor(left, scaleFactor);
        expect(equalFractions(left, leftScaled)).toBe(true);
        expect(leftScaled.numerator).toBe(left.numerator * BigInt(scaleFactor));
        expect(leftScaled.denominator).toBe(left.denominator * BigInt(scaleFactor));

        const expectedComparison = signOfBigInt(
          left.numerator * right.denominator - right.numerator * left.denominator,
        );
        expect(compareFractions(left, right)).toBe(expectedComparison);

        const sum = addFractions(left, right);
        const expectedSum = createFraction(
          left.numerator * right.denominator + right.numerator * left.denominator,
          left.denominator * right.denominator,
        );
        expect(equalFractions(sum, expectedSum)).toBe(true);

        const larger = compareFractions(left, right) >= 0 ? left : right;
        const smaller = larger === left ? right : left;
        const difference = subtractFractions(larger, smaller);
        const expectedDifference = createFraction(
          larger.numerator * smaller.denominator - smaller.numerator * larger.denominator,
          larger.denominator * smaller.denominator,
        );
        expect(equalFractions(difference, expectedDifference)).toBe(true);

        const simplified = simplifyFraction(left);
        expect(equalFractions(left, simplified)).toBe(true);
        expect(simplifyFraction(simplified)).toEqual(simplified);

        const lcd = leastCommonDenominator(left.denominator, right.denominator);
        expect(isCommonDenominator(lcd, left.denominator, right.denominator)).toBe(true);
        expect(lcd).toBe(
          (left.denominator / gcd(left.denominator, right.denominator)) * right.denominator,
        );
      },
    });
  });

  test('holds for 5,000 deterministic mixed-number and composition cases', () => {
    runGeneratedInvariant({
      name: 'mixed-number conversion and composition',
      seed: 0xF0202,
      count: 5_000,
      generate: (rng) => {
        const denominator = nextInt(rng, 1, 120);
        const remainder = nextInt(rng, 0, denominator - 1);
        const whole = nextInt(rng, 0, 20);
        const improperNumerator = nextInt(rng, 0, denominator * 3);
        return {
          mixed: createMixedNumber(whole, createFraction(remainder, denominator)),
          improper: createFraction(improperNumerator, denominator),
        };
      },
      shrink: shrinkMixed,
      assertInvariant: ({ mixed, improper }) => {
        const mixedImproper = mixedToImproper(mixed);
        expect(equalFractions(mixedImproper, mixedImproper)).toBe(true);
        expect(improperToMixed(mixedImproper)).toEqual(mixed);

        const composed = composeMixedNumber(improper);
        expect(equalFractions(mixedToImproper(composed), improper)).toBe(true);
        expect(composed.fraction.numerator).toBeLessThan(composed.fraction.denominator);
        expect(Object.isFrozen(composed)).toBe(true);
        expect(Object.isFrozen(composed.fraction)).toBe(true);
      },
    });
  });

  test('holds for 5,000 deterministic nonnegative subtraction cases', () => {
    runGeneratedInvariant({
      name: 'nonnegative subtraction',
      seed: 0xF0203,
      count: 5_000,
      generate: (rng) => ({
        left: generatedFraction(rng, 120),
        right: generatedFraction(rng, 120),
      }),
      shrink: shrinkPair,
      assertInvariant: ({ left, right }) => {
        const larger = compareFractions(left, right) >= 0 ? left : right;
        const smaller = larger === left ? right : left;
        const result = subtractFractions(larger, smaller);
        expect(compareFractions(result, createFraction(0, 1))).toBeGreaterThanOrEqual(0);
        expect(equalFractions(
          addFractions(result, smaller),
          larger,
        )).toBe(true);
      },
    });
  });

  test('proves LCD minimality exhaustively for denominator pairs 1..20', () => {
    for (let left = 1n; left <= 20n; left += 1n) {
      for (let right = 1n; right <= 20n; right += 1n) {
        const lcd = leastCommonDenominator(left, right);
        expect(isCommonDenominator(lcd, left, right)).toBe(true);
        for (let candidate = 1n; candidate < lcd; candidate += 1n) {
          expect(isCommonDenominator(candidate, left, right)).toBe(false);
        }
      }
    }
  });
});
