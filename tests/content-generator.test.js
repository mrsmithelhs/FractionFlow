import { describe, expect, it } from 'vitest';
import {
  ContentConfigurationError,
  generateProblem,
  inspectCandidateSpace,
  STRUCTURAL_SELECTOR_IDS,
  validateProblemInstance,
} from '../src/content/index.js';

const expectedEligibleCardinalities = [7, 7, 40, 40, 68, 68, 34, 34];

describe('Plan 03 structural selectors and generated contract', () => {
  it('implements all eight operation-specific selectors with approved default-space counts', () => {
    expect(STRUCTURAL_SELECTOR_IDS).toEqual([
      'like-denominator-addition',
      'like-denominator-subtraction',
      'nested-denominator-addition',
      'nested-denominator-subtraction',
      'shared-factor-addition',
      'shared-factor-subtraction',
      'relatively-prime-addition',
      'relatively-prime-subtraction',
    ]);
    const spaces = STRUCTURAL_SELECTOR_IDS.map((selector) => inspectCandidateSpace({ selector }));
    expect(spaces.map((space) => space.eligibleCardinality)).toEqual(expectedEligibleCardinalities);
  });

  it('generates immutable, fully classified instances through the Plan 02-backed validator', () => {
    for (const selector of STRUCTURAL_SELECTOR_IDS) {
      const instance = generateProblem({ selector, seed: `contract-${selector}` });
      const validation = validateProblemInstance(instance);
      expect(validation.valid, JSON.stringify(validation.errors)).toBe(true);
      expect(Object.isFrozen(instance)).toBe(true);
      expect(instance.source).toBe('generated');
      expect(instance.provenance.kind).toBe('generated');
      expect(instance.resultState.exactResult).toBeDefined();
      expect(instance.resultState.canonicalRawResultForm).toBeDefined();
      expect(instance.resultState.preferredFinalForm).toBeDefined();
      expect(instance.representationFacts.eligibility).toEqual({
        fractionBar: 'deferred',
        numberLine: 'deferred',
        symbolic: 'deferred',
      });
    }
  });

  it('validates canonical LCD and selected alternate exact paths', () => {
    const instance = generateProblem({
      selector: 'relatively-prime-addition',
      seed: 'alternate-path-test',
    });
    expect(instance.canonicalPath.targetDenominator).toBe(instance.classification.denominator.leastCommonDenominator);
    expect(instance.canonicalPath.status).toBe('canonical');
    expect(instance.alternatePaths.length).toBe(1);
    expect(instance.alternatePaths[0].status).toBe('alternate-valid');
    expect(BigInt(instance.alternatePaths[0].targetDenominator)).toBe(
      BigInt(instance.classification.denominator.leastCommonDenominator) * 2n,
    );
    expect(validateProblemInstance(instance).valid).toBe(true);
  });

  it('rejects incompatible overlay requests before sampling', () => {
    expect(() => generateProblem({
      selector: 'nested-denominator-subtraction',
      overlays: ['crosses-one-whole'],
      seed: 'bad\nseed-that-must-not-be-consumed',
    })).toThrowError(new ContentConfigurationError(
      'INCOMPATIBLE_OVERLAY',
      'nested-denominator-subtraction does not allow overlays: crosses-one-whole',
    ));
  });

  it('supports declared reducible, crossing, and combined addition overlays', () => {
    const reducible = generateProblem({
      selector: 'like-denominator-addition',
      overlays: ['reducible-result'],
      seed: 'overlay-reducible',
    });
    const crossing = generateProblem({
      selector: 'like-denominator-addition',
      overlays: ['crosses-one-whole'],
      seed: 'overlay-crossing',
    });
    const combined = generateProblem({
      selector: 'like-denominator-addition',
      overlays: ['crosses-one-whole', 'reducible-result'],
      seed: 'overlay-combined',
    });
    expect(reducible.classification.result.simplificationStatus).toBe('reducible');
    expect(crossing.classification.result.crossesWhole).toBe(true);
    expect(combined.classification.result.simplificationStatus).toBe('reducible');
    expect(combined.classification.result.crossesWhole).toBe(true);
  });

  it('fails closed for forged identity, profile, result state, and nested mutability', () => {
    const source = generateProblem({
      selector: 'like-denominator-addition',
      seed: 'validation-boundary',
    });
    const forged = {
      ...source,
      id: 'forged-id',
      request: { ...source.request, profileVersion: 'forged-profile-version' },
      resultState: {
        ...source.resultState,
        currentForm: { kind: 'fraction', numerator: '99', denominator: '1' },
      },
    };
    Object.freeze(forged);
    const validation = validateProblemInstance(forged);
    expect(validation.valid).toBe(false);
    expect(validation.checks.find((check) => check.id === 'immutable-source-contract').valid).toBe(false);
    expect(validation.checks.find((check) => check.id === 'instance-id').valid).toBe(false);
    expect(validation.checks.find((check) => check.id === 'request-profile-version').valid).toBe(false);
    expect(validation.checks.find((check) => check.id === 'result-state-current-form').valid).toBe(false);
  });
});
