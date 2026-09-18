import { describe, expect, it } from 'vitest';
import {
  classifyConversionResponse,
  classifyOperationResponse,
  classifyRegroupingResponse,
  createFraction,
  createMixedNumber,
  PATTERNS,
  validateCommonDenominator,
  validateEquivalentFraction,
  validateMixedNumberForm,
  validateOperationResult,
  validateRegroupedState,
} from '../src/math/index.js';

describe('validateCommonDenominator', () => {
  it('identifies least common denominator as valid-least', () => {
    const result = validateCommonDenominator(12, 3, 4);
    expect(result.validity).toBe('valid');
    expect(result.efficiency).toBe('least');
    expect(result.classification).toBe('valid-least');
    expect(result.proposedDenominator).toBe(12n);
    expect(result.leastCommonDenominator).toBe(12n);
    expect(result.scaleFactors.left).toBe(4n);
    expect(result.scaleFactors.right).toBe(3n);
  });

  it('identifies valid non-least common denominator without calling it invalid', () => {
    const result = validateCommonDenominator(24, 3, 4);
    expect(result.validity).toBe('valid');
    expect(result.efficiency).toBe('non-least');
    expect(result.classification).toBe('valid-non-least');
    expect(result.proposedDenominator).toBe(24n);
    expect(result.leastCommonDenominator).toBe(12n);
    expect(result.scaleFactors.left).toBe(8n);
    expect(result.scaleFactors.right).toBe(6n);
  });

  it('identifies invalid common denominators', () => {
    const result = validateCommonDenominator(10, 3, 4);
    expect(result.validity).toBe('invalid');
    expect(result.efficiency).toBe('not-applicable');
    expect(result.classification).toBe('invalid');
    expect(result.scaleFactors).toBe(null);
    expect(result.reasons).toContain('not-divisible-by-left-denominator');
    expect(result.reasons).toContain('not-divisible-by-right-denominator');
  });

  it('handles invalid non-integer inputs gracefully', () => {
    const result = validateCommonDenominator('abc', 3, 4);
    expect(result.validity).toBe('invalid');
    expect(result.reasons).toContain('not-a-positive-integer');
  });
});

describe('validateEquivalentFraction', () => {
  it('validates an exact equivalent fraction', () => {
    const orig = createFraction(1, 2);
    const proposed = createFraction(4, 8);
    const result = validateEquivalentFraction(proposed, orig);
    expect(result.validity).toBe('valid');
    expect(result.isEquivalent).toBe(true);
    expect(result.scaleFactor).toBe(4n);
  });

  it('validates equivalent fraction with matching target denominator', () => {
    const orig = createFraction(2, 3);
    const proposed = createFraction(8, 12);
    const result = validateEquivalentFraction(proposed, orig, 12);
    expect(result.validity).toBe('valid');
    expect(result.matchesTargetDenominator).toBe(true);
    expect(result.scaleFactor).toBe(4n);
  });

  it('rejects an equivalent fraction that does not match target denominator', () => {
    const orig = createFraction(2, 3);
    const proposed = createFraction(16, 24);
    const result = validateEquivalentFraction(proposed, orig, 12);
    expect(result.validity).toBe('invalid');
    expect(result.isEquivalent).toBe(true);
    expect(result.matchesTargetDenominator).toBe(false);
    expect(result.reasons).toContain('denominator-does-not-match-target');
  });

  it('rejects a non-equivalent fraction', () => {
    const orig = createFraction(1, 2);
    const proposed = createFraction(2, 5);
    const result = validateEquivalentFraction(proposed, orig);
    expect(result.validity).toBe('invalid');
    expect(result.isEquivalent).toBe(false);
    expect(result.reasons).toContain('not-equivalent-in-value');
  });
});

describe('validateMixedNumberForm', () => {
  it('validates a canonical mixed number', () => {
    const original = createFraction(5, 4);
    const proposed = createMixedNumber(1, createFraction(1, 4));
    const result = validateMixedNumberForm(proposed, original);
    expect(result.validity).toBe('valid');
    expect(result.isEquivalent).toBe(true);
    expect(result.isCanonical).toBe(true);
    expect(result.isRegrouped).toBe(false);
  });

  it('recognizes a valid non-canonical intermediate regrouped state (e.g. 2 10/8 for 3 2/8)', () => {
    const original = createMixedNumber(3, createFraction(2, 8));
    const proposed = createMixedNumber(2, createFraction(10, 8));
    const result = validateMixedNumberForm(proposed, original);
    expect(result.validity).toBe('valid');
    expect(result.isEquivalent).toBe(true);
    expect(result.isCanonical).toBe(false);
    expect(result.isRegrouped).toBe(true);
  });

  it('rejects an incorrect mixed-number form', () => {
    const original = createMixedNumber(3, createFraction(2, 8));
    const proposed = createMixedNumber(2, createFraction(5, 8));
    const result = validateMixedNumberForm(proposed, original);
    expect(result.validity).toBe('invalid');
    expect(result.isEquivalent).toBe(false);
  });
});

describe('validateRegroupedState', () => {
  it('validates a correct decomposition step for subtraction', () => {
    const original = createMixedNumber(3, createFraction(1, 4));
    const proposed = createMixedNumber(2, createFraction(5, 4));
    const result = validateRegroupedState(proposed, original, 'decomposition');
    expect(result.validity).toBe('valid');
    expect(result.isEquivalent).toBe(true);
    expect(result.structureMatches).toBe(true);
  });

  it('rejects an invalid decomposition step where whole was not decremented', () => {
    const original = createMixedNumber(3, createFraction(1, 4));
    const proposed = createMixedNumber(3, createFraction(5, 4));
    const result = validateRegroupedState(proposed, original, 'decomposition');
    expect(result.validity).toBe('invalid');
    expect(result.isEquivalent).toBe(false);
  });

  it('validates a correct composition step for addition', () => {
    const original = createMixedNumber(1, createFraction(9, 8));
    const proposed = createMixedNumber(2, createFraction(1, 8));
    const result = validateRegroupedState(proposed, original, 'composition');
    expect(result.validity).toBe('valid');
    expect(result.isEquivalent).toBe(true);
    expect(result.structureMatches).toBe(true);
  });
});

describe('validateOperationResult', () => {
  it('validates correct and simplified result', () => {
    const left = createFraction(1, 3);
    const right = createFraction(1, 4);
    const proposed = createFraction(7, 12);
    const result = validateOperationResult(proposed, left, right, 'add');
    expect(result.validity).toBe('valid');
    expect(result.classification).toBe('correct-simplified');
    expect(result.isSimplified).toBe(true);
  });

  it('recognizes correct but unsimplified result without labeling it simply incorrect', () => {
    const left = createFraction(1, 4);
    const right = createFraction(1, 4);
    const proposed = createFraction(2, 4);
    const result = validateOperationResult(proposed, left, right, 'add');
    expect(result.validity).toBe('valid');
    expect(result.classification).toBe('correct-unsimplified');
    expect(result.isSimplified).toBe(false);
  });

  it('classifies incorrect result', () => {
    const left = createFraction(1, 3);
    const right = createFraction(1, 4);
    const proposed = createFraction(2, 7);
    const result = validateOperationResult(proposed, left, right, 'add');
    expect(result.validity).toBe('invalid');
    expect(result.classification).toBe('incorrect');
  });
});

describe('response-patterns classification', () => {
  it('detects ADD_NUMERATORS_AND_DENOMINATORS pattern (e.g. 1/3 + 1/4 = 2/7)', () => {
    const left = createFraction(1, 3);
    const right = createFraction(1, 4);
    const proposed = createFraction(2, 7);
    const result = classifyOperationResponse({ operation: 'add', left, right, proposed });
    expect(result.hasPattern(PATTERNS.ADD_NUMERATORS_AND_DENOMINATORS)).toBe(true);
    expect(result.details.addNumeratorsAndDenominators.expectedNumerator).toBe(2n);
    expect(result.details.addNumeratorsAndDenominators.expectedDenominator).toBe(7n);
  });

  it('detects SUBTRACT_NUMERATORS_AND_DENOMINATORS pattern', () => {
    const left = createFraction(3, 4);
    const right = createFraction(1, 2);
    const proposed = createFraction(2, 2);
    const result = classifyOperationResponse({ operation: 'subtract', left, right, proposed });
    expect(result.hasPattern(PATTERNS.SUBTRACT_NUMERATORS_AND_DENOMINATORS)).toBe(true);
  });

  it('detects DENOMINATOR_CHANGED_NUMERATOR_FIXED pattern in addition', () => {
    const left = createFraction(1, 3);
    const right = createFraction(1, 4);
    const proposed = createFraction(2, 12); // common denominator 12, but numerators 1+1 added unscaled
    const result = classifyOperationResponse({ operation: 'add', left, right, proposed });
    expect(result.hasPattern(PATTERNS.DENOMINATOR_CHANGED_NUMERATOR_FIXED)).toBe(true);
  });

  it('detects DENOMINATOR_CHANGED_NUMERATOR_FIXED pattern in fraction conversion', () => {
    const orig = createFraction(1, 3);
    const proposed = createFraction(1, 12);
    const result = classifyConversionResponse({ original: orig, proposed, targetDenominator: 12 });
    expect(result.hasPattern(PATTERNS.DENOMINATOR_CHANGED_NUMERATOR_FIXED)).toBe(true);
  });

  it('detects NUMERATOR_CHANGED_INCORRECT_SCALE in fraction conversion', () => {
    const orig = createFraction(2, 3);
    const proposed = createFraction(6, 12); // scale denominator is 4, but numerator scaled by 3
    const result = classifyConversionResponse({ original: orig, proposed });
    expect(result.hasPattern(PATTERNS.NUMERATOR_CHANGED_INCORRECT_SCALE)).toBe(true);
  });

  it('detects CORRECT_UNSIMPLIFIED_RESULT and EQUIVALENT_ALTERNATE_FORM', () => {
    const left = createFraction(2, 3);
    const right = createFraction(1, 4);
    const proposed = createFraction(22, 24); // using common denominator 24 instead of LCD 12
    const result = classifyOperationResponse({ operation: 'add', left, right, proposed });
    expect(result.hasPattern(PATTERNS.CORRECT_UNSIMPLIFIED_RESULT)).toBe(true);
    expect(result.hasPattern(PATTERNS.EQUIVALENT_ALTERNATE_FORM)).toBe(true);
  });

  it('handles zero numerator and non-integer scale factors without division by zero or truncation in conversion', () => {
    // 1. Zero numerator: converting 0/3 to 2/12
    const zeroOrig = createFraction(0, 3);
    const zeroProposed = createFraction(2, 12);
    const zeroResult = classifyConversionResponse({ original: zeroOrig, proposed: zeroProposed });
    expect(zeroResult.hasPattern(PATTERNS.NUMERATOR_CHANGED_INCORRECT_SCALE)).toBe(true);
    expect(zeroResult.details.actualScale).toBe(null);

    // 2. Non-integer scale: converting 2/3 to 5/12 (denominator scale 4, numerator scale 5/2)
    const nonIntOrig = createFraction(2, 3);
    const nonIntProposed = createFraction(5, 12);
    const nonIntResult = classifyConversionResponse({ original: nonIntOrig, proposed: nonIntProposed });
    expect(nonIntResult.hasPattern(PATTERNS.NUMERATOR_CHANGED_INCORRECT_SCALE)).toBe(true);
    expect(nonIntResult.details.actualScale.numerator).toBe(5n);
    expect(nonIntResult.details.actualScale.denominator).toBe(2n);
  });
});
