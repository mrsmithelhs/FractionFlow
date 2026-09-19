import { describe, expect, it } from 'vitest';
import {
  PHASE1_GOLDEN_CASES,
  validateCuratedFixtures,
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
      expect(result.instance.provenance.acceptedCandidateIndex).toBeUndefined();
      expect(result.instance.provenance.attempts).toBeUndefined();
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
});
