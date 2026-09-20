import { describe, expect, it } from 'vitest';
import {
  deepFreeze,
  PHASE1_GOLDEN_CASES,
  validateCuratedFixtures,
  validateProblemInstance,
  reflectionChoicesForInstance,
} from '../src/content/index.js';

describe('Plan 03 curated synthetic content', () => {
  it('validates every curated fixture through the common generated/curated pipeline', () => {
    const results = validateCuratedFixtures();
    expect(results).toHaveLength(PHASE1_GOLDEN_CASES.length);
    for (const result of results) {
      expect(result.validation.valid, `${result.fixture.id}: ${JSON.stringify(result.validation.errors)}`).toBe(true);
      expect(result.instance.source).toBe('curated');
      expect(result.instance.provenance).toEqual({
        kind: 'curated',
        fixtureId: result.fixture.id,
        authoringRevision: result.fixture.authoringRevision,
      });
      expect(result.instance.provenance.seed).toBeUndefined();
      expect(result.instance.provenance.selectedCandidateIndex).toBeUndefined();
      expect(result.instance.provenance.selection).toBeUndefined();
      expect(Object.isFrozen(result.instance)).toBe(true);
    }
  });

  it('preserves immutable source forms while recording the reviewed simplify-first transformation', () => {
    const result = validateCuratedFixtures().find((entry) => entry.fixture.id === 'curated-simplify-first-state');
    expect(result.instance.operands.left.initialForm).toEqual({
      kind: 'fraction',
      numerator: '2',
      denominator: '4',
    });
    expect(result.instance.operands.left.currentForm).toEqual(result.instance.operands.left.initialForm);
    expect(result.instance.operands.left.exactValue).toEqual({
      kind: 'fraction',
      numerator: '1',
      denominator: '2',
    });
    expect(result.instance.operands.left.acceptedFormTransitions[0]).toMatchObject({
      type: 'simplify-first',
      target: 'left',
      toForm: { kind: 'fraction', numerator: '1', denominator: '2' },
      preservesExactValue: true,
    });
  });

  it('rejects a forged reviewed transition while preserving the authored current form', () => {
    const source = validateCuratedFixtures().find((entry) => entry.fixture.id === 'curated-simplify-first-state').instance;
    const forged = structuredClone(source);
    forged.operands.left.acceptedFormTransitions[0].preservesExactValue = false;
    deepFreeze(forged);
    const validation = validateProblemInstance(forged);
    expect(validation.valid).toBe(false);
    expect(validation.checks.find((check) => check.id.startsWith('left-transition-contract')).valid).toBe(false);
    expect(forged.operands.left.currentForm).toEqual(forged.operands.left.initialForm);
  });

  it('rejects blank curated provenance identifiers', () => {
    const source = validateCuratedFixtures()[0].instance;
    const forged = structuredClone(source);
    forged.provenance.fixtureId = '';
    deepFreeze(forged);
    expect(validateProblemInstance(forged).valid).toBe(false);
  });

  it('supplies correctness-free authored CM-01 matching choices for the ready subset', () => {
    const instance = validateCuratedFixtures().find((entry) => (
      entry.fixture.id === 'curated-relatively-prime-addition-non-least'
    )).instance;
    const choices = reflectionChoicesForInstance(instance);

    expect(choices).toHaveLength(3);
    expect(choices.map((choice) => choice.id)).toEqual(['match-a', 'match-b', 'match-c']);
    expect(choices.map((choice) => `${choice.form.numerator}/${choice.form.denominator}`))
      .toEqual(['8/12', '7/12', '9/12']);
    expect(choices.every((choice) => !Object.prototype.hasOwnProperty.call(choice, 'correct'))).toBe(true);
    expect(Object.isFrozen(choices)).toBe(true);
  });
});
