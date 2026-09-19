import { describe, expect, it } from 'vitest';
import {
  ContentConfigurationError,
  deepFreeze,
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
      expect(() => JSON.stringify(instance)).not.toThrow();
      expect(instance.representationFacts.eligibility.numberLine).toBe('not-in-phase-2');
      expect(instance.representationFacts.eligibility.symbolic).toBe('eligible');
      expect(Object.values(instance.representationFacts.eligibility)).not.toContain('deferred');
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

  it('keeps the seven ordinary like-denominator cases broadly comparable', () => {
    const counts = new Map();
    for (let index = 0; index < 7000; index += 1) {
      const instance = generateProblem({
        selector: 'like-denominator-addition',
        seed: `repair-01-sweep-${index}`,
      });
      counts.set(instance.id, (counts.get(instance.id) ?? 0) + 1);
    }
    const values = [...counts.values()].sort((left, right) => left - right);
    expect(counts.size).toBe(7);
    expect(values[0]).toBeGreaterThanOrEqual(900);
    expect(values.at(-1)).toBeLessThanOrEqual(1100);
  });

  it('rejects deeply frozen forgeries of every remaining consumer-derived field group', () => {
    const source = generateProblem({
      selector: 'like-denominator-addition',
      seed: 'derived-content-boundary',
    });
    const mutations = [
      (instance) => {
        instance.operands.left.currentForm = { kind: 'fraction', numerator: '99', denominator: '100' };
      },
      (instance) => {
        instance.classification.magnitude.benchmarkRegion = 'exact-zero';
      },
      (instance) => {
        instance.representationFacts.canonicalDenominator = '999';
      },
      (instance) => {
        instance.reviewMetadata.intendedTargetConcept = 'forged-target';
      },
    ];
    for (const mutate of mutations) {
      const forged = structuredClone(source);
      mutate(forged);
      deepFreeze(forged);
      expect(validateProblemInstance(forged).valid).toBe(false);
    }
  });

  it('returns a normal invalid result for missing and malformed provenance', () => {
    const source = generateProblem({
      selector: 'like-denominator-addition',
      seed: 'provenance-boundary',
    });
    const missing = structuredClone(source);
    delete missing.provenance;
    deepFreeze(missing);
    expect(() => validateProblemInstance(missing)).not.toThrow();
    expect(validateProblemInstance(missing).valid).toBe(false);

    const malformed = structuredClone(source);
    malformed.provenance = {
      kind: 'curated',
      fixtureId: 'forged-fixture',
      authoringRevision: 'forged-revision',
      selectedCandidateIndex: '0',
    };
    deepFreeze(malformed);
    expect(() => validateProblemInstance(malformed)).not.toThrow();
    expect(validateProblemInstance(malformed).valid).toBe(false);
  });

  it('rejects generated provenance whose seed no longer replays its selected eligible ordinal', () => {
    const source = generateProblem({
      selector: 'like-denominator-addition',
      seed: 'seed-a',
    });
    const forged = structuredClone(source);
    forged.provenance.seed = 'seed-b-replay-mismatch';
    deepFreeze(forged);
    const validation = validateProblemInstance(forged);
    expect(validation.valid).toBe(false);
    expect(validation.checks.find((check) => check.id === 'generated-provenance:seed-replays-selection').valid).toBe(false);
  });
});
