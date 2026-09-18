import { describe, expect, it } from 'vitest';
import {
  addAtCommonDenominator,
  addFractions,
  addMixedNumbers,
  areEquivalent,
  classifyFractionResult,
  classifyMixedRegrouping,
  createFraction,
  createMixedNumber,
  denominatorRelationship,
  leastCommonDenominator,
  simplifyFraction,
  subtractFractions,
  subtractMixedNumbers,
  validateCommonDenominator,
  validateMixedNumberForm,
  validateOperationResult,
} from '../src/math/index.js';
import { GOLDEN_CASES } from './fixtures/math-golden-cases.js';

describe('Plan 02 Golden Cases Execution', () => {
  for (const testCase of GOLDEN_CASES) {
    it(`executes golden case: ${testCase.id} (${testCase.description})`, () => {
      if (testCase.category === 'fraction-addition' || testCase.category === 'fraction-subtraction') {
        const left = createFraction(BigInt(testCase.left.numerator), BigInt(testCase.left.denominator));
        const right = createFraction(BigInt(testCase.right.numerator), BigInt(testCase.right.denominator));

        // 1. Verify denominator relationship and LCD
        const rel = denominatorRelationship(left, right);
        expect(rel).toBe(testCase.denominatorRelationship);

        const lcd = leastCommonDenominator(left.denominator, right.denominator);
        expect(lcd).toBe(BigInt(testCase.leastCommonDenominator));

        // 2. Verify raw result at LCD
        const rawResult = testCase.operation === 'add'
          ? addFractions(left, right)
          : subtractFractions(left, right);

        expect(rawResult.numerator).toBe(BigInt(testCase.expectedRawLcd.numerator));
        expect(rawResult.denominator).toBe(BigInt(testCase.expectedRawLcd.denominator));

        // 3. Verify simplified result
        const simplifiedResult = simplifyFraction(rawResult);
        expect(simplifiedResult.numerator).toBe(BigInt(testCase.expectedSimplified.numerator));
        expect(simplifiedResult.denominator).toBe(BigInt(testCase.expectedSimplified.denominator));

        // 4. Verify classifications
        const classification = classifyFractionResult(rawResult);
        expect(classification.resultForm).toBe(testCase.resultForm);
        expect(classification.simplificationStatus).toBe(testCase.simplificationStatus);
        expect(classification.crossesWhole).toBe(testCase.crossesWhole);

        // 5. Verify validation
        const val = validateOperationResult(rawResult, left, right, testCase.operation);
        expect(val.validity).toBe('valid');

        // 6. If an explicit alternate common denominator path was chosen
        if (testCase.path === 'non-least' && testCase.chosenDenominator) {
          const chosenDenom = BigInt(testCase.chosenDenominator);
          const nonLeastRaw = addAtCommonDenominator(left, right, chosenDenom);
          expect(nonLeastRaw.numerator).toBe(BigInt(testCase.expectedRawChosen.numerator));
          expect(nonLeastRaw.denominator).toBe(BigInt(testCase.expectedRawChosen.denominator));

          const denomVal = validateCommonDenominator(chosenDenom, left.denominator, right.denominator);
          expect(denomVal.validity).toBe('valid');
          expect(denomVal.efficiency).toBe('non-least');
          expect(denomVal.classification).toBe('valid-non-least');

          if (testCase.simplificationStatusChosen) {
            expect(classifyFractionResult(nonLeastRaw).simplificationStatus).toBe(testCase.simplificationStatusChosen);
          }
        }
      } else if (testCase.category === 'mixed-addition' || testCase.category === 'mixed-subtraction') {
        const left = createMixedNumber(
          BigInt(testCase.leftMixed.whole),
          createFraction(BigInt(testCase.leftMixed.fraction.numerator), BigInt(testCase.leftMixed.fraction.denominator)),
        );
        const right = createMixedNumber(
          BigInt(testCase.rightMixed.whole),
          createFraction(BigInt(testCase.rightMixed.fraction.numerator), BigInt(testCase.rightMixed.fraction.denominator)),
        );

        // 1. Verify regrouping classification
        const regrouping = classifyMixedRegrouping(left, right, testCase.operation);
        expect(regrouping.regroupingType).toBe(testCase.regroupingType);

        // 2. Verify operation execution
        const resultMixed = testCase.operation === 'add'
          ? addMixedNumbers(left, right)
          : subtractMixedNumbers(left, right);

        expect(resultMixed.whole).toBe(BigInt(testCase.expectedMixedCanonical.whole));
        expect(resultMixed.fraction.numerator).toBe(BigInt(testCase.expectedMixedCanonical.fraction.numerator));
        expect(resultMixed.fraction.denominator).toBe(BigInt(testCase.expectedMixedCanonical.fraction.denominator));

        // 3. Verify intermediate regrouped minuend when decomposition occurred
        if (testCase.regroupingType === 'decomposition' && testCase.intermediateRegroupedMinuend) {
          const expectedRegrouped = createMixedNumber(
            BigInt(testCase.intermediateRegroupedMinuend.whole),
            createFraction(
              BigInt(testCase.intermediateRegroupedMinuend.fraction.numerator),
              BigInt(testCase.intermediateRegroupedMinuend.fraction.denominator),
            ),
          );
          const regroupedVal = validateMixedNumberForm(expectedRegrouped, left);
          expect(regroupedVal.validity).toBe('valid');
          expect(regroupedVal.isRegrouped).toBe(true);
        }
      }
    });
  }
});

describe('D-17 Golden Cases Diversity Assertion', () => {
  it('verifies that the golden case suite exhibits required structural and categorical diversity', () => {
    expect(GOLDEN_CASES.length).toBeGreaterThanOrEqual(15);

    const resultForms = new Set();
    const simplificationStatuses = new Set();
    const regroupingTypes = new Set();
    const relationships = new Set();
    const paths = new Set();
    const crossesWholeValues = new Set();
    const rawNumerators = new Set();
    const rawDenominators = new Set();

    for (const c of GOLDEN_CASES) {
      if (c.resultForm) resultForms.add(c.resultForm);
      if (c.simplificationStatus) simplificationStatuses.add(c.simplificationStatus);
      if (c.regroupingType) regroupingTypes.add(c.regroupingType);
      if (c.denominatorRelationship) relationships.add(c.denominatorRelationship);
      if (c.path) paths.add(c.path);
      if (typeof c.crossesWhole === 'boolean') crossesWholeValues.add(c.crossesWhole);

      if (c.expectedRawLcd) {
        rawNumerators.add(c.expectedRawLcd.numerator);
        rawDenominators.add(c.expectedRawLcd.denominator);
      }
    }

    // 1. Result forms must cover all primary core categories
    expect(resultForms).toContain('proper');
    expect(resultForms).toContain('improper');
    expect(resultForms).toContain('exactly-one');
    expect(resultForms).toContain('zero');
    expect(resultForms).toContain('whole-greater-than-one');
    expect(resultForms).toContain('mixed');

    // 2. Simplification statuses must include both simplified and reducible
    expect(simplificationStatuses).toContain('already-simplified');
    expect(simplificationStatuses).toContain('reducible');

    // 3. Regrouping must include none, composition, and decomposition
    expect(regroupingTypes).toContain('none');
    expect(regroupingTypes).toContain('composition');
    expect(regroupingTypes).toContain('decomposition');

    // 4. Denominator relationships must cover all 4 founding categories
    expect(relationships).toContain('same');
    expect(relationships).toContain('nested');
    expect(relationships).toContain('shared-factor');
    expect(relationships).toContain('relatively-prime');

    // 5. Paths must include both lcd and non-least
    expect(paths).toContain('lcd');
    expect(paths).toContain('non-least');

    // 6. Whole crossing must have both true and false
    expect(crossesWholeValues).toContain(true);
    expect(crossesWholeValues).toContain(false);

    // 7. No single coincidental equality shared across cases
    expect(rawNumerators.size).toBeGreaterThanOrEqual(8);
    expect(rawDenominators.size).toBeGreaterThanOrEqual(6);
  });
});
