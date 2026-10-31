import { describe, expect, it } from 'vitest';
import {
  PLAN45_COMPARISON_PRACTICE_SET,
  PLAN45_COMPARISON_RECORDS,
} from '../src/content/data/plan45-symbolic-fraction-comparison-records.js';
import {
  PLAN45_COMPARISON_CONDITION_CAPABILITY,
  PLAN45_MORE_SUPPORT_STRATEGY_CUE,
  plan45ComparisonHelpText,
  resolvePlan45ComparisonContext,
  validatePlan45ComparisonBatch,
  validatePlan45ComparisonContext,
  validatePlan45ComparisonRecord,
} from '../src/content/plan45-symbolic-fraction-comparison-task.js';
import { compareFractions, createFraction } from '../src/math/index.js';

function asMath(form) {
  return createFraction(BigInt(form.numerator), BigInt(form.denominator));
}

describe('Plan 45 comparison content and pure admission', () => {
  it('validates the exact ordered 12-record batch and derives the balanced relations', () => {
    const batch = validatePlan45ComparisonBatch();
    expect(batch.recordCount).toBe(12);
    expect(batch.relationCounts).toEqual({ less: 4, equal: 4, greater: 4 });
    expect(batch.maxSourceDenominator).toBe(10);
    expect(PLAN45_COMPARISON_RECORDS.map(({ itemId }) => itemId)).toEqual(PLAN45_COMPARISON_PRACTICE_SET.itemIds);

    for (const record of PLAN45_COMPARISON_RECORDS) {
      const checked = validatePlan45ComparisonRecord(record);
      const exact = compareFractions(asMath(record.sourceForms.first), asMath(record.sourceForms.second));
      expect([-1, 0, 1]).toContain(exact);
      expect(checked.record.sourceForms).toEqual(record.sourceForms);
      expect(checked.record).not.toHaveProperty('expectedRelation');
      expect(checked.record).not.toHaveProperty('correctOption');
    }
  });

  it('preserves raw order while deriving normalized identities and contextual targets', () => {
    const record = PLAN45_COMPARISON_RECORDS[2];
    const equal = validatePlan45ComparisonRecord(record);
    expect(equal.record.sourceForms).toEqual({
      first: { numerator: '4', denominator: '6' },
      second: { numerator: '6', denominator: '9' },
    });
    expect(equal.normalizedIdentity).toEqual({
      first: { numerator: '2', denominator: '3' },
      second: { numerator: '2', denominator: '3' },
    });
    expect(equal).not.toHaveProperty('expectedRelation');
    expect(resolvePlan45ComparisonContext(record.itemId)).not.toHaveProperty('normalizedIdentity');

    const half = resolvePlan45ComparisonContext('plan45-compare-10');
    expect(half.hintContext).toEqual({ kind: 'half-benchmark', benchmark: 'half' });
    const close = resolvePlan45ComparisonContext('plan45-compare-01');
    expect(close.hintContext).toEqual({ kind: 'common-unit-target', denominator: '15' });
    expect(plan45ComparisonHelpText(close, 'reasoning')).toBe('Try naming each amount in parts out of 15.');
    const beyondLegacyBarCap = resolvePlan45ComparisonContext('plan45-compare-10');
    expect(beyondLegacyBarCap.hintContext.kind).toBe('half-benchmark');
    expect(plan45ComparisonHelpText(beyondLegacyBarCap, 'reasoning')).toBe('Could one half separate these two amounts?');
    expect(plan45ComparisonHelpText(resolvePlan45ComparisonContext('plan45-compare-03'), 'reasoning'))
      .toBe('Try simplifying both fractions.');
    for (const record of PLAN45_COMPARISON_RECORDS) {
      const text = plan45ComparisonHelpText(resolvePlan45ComparisonContext(record.itemId), 'reasoning');
      expect(text).not.toMatch(/[<=>]/);
    }
    expect(PLAN45_MORE_SUPPORT_STRATEGY_CUE).toBe('Try a benchmark or compare same-size parts.');
    expect(PLAN45_COMPARISON_CONDITION_CAPABILITY.unsupportedDisplay).toEqual(['D-01-A', 'D-01-B']);
    expect(PLAN45_COMPARISON_CONDITION_CAPABILITY.unsupportedChoreography).toEqual(['D-02-M', 'D-02-J', 'D-02-S']);
  });

  it('refuses malformed records, unsupported eligibility and altered identities', () => {
    const base = PLAN45_COMPARISON_RECORDS[0];
    expect(() => validatePlan45ComparisonRecord({ ...base, answer: '<' })).toThrow(/exactly the registered keys/);
    expect(() => validatePlan45ComparisonRecord({ ...base, cueId: 'compare.answer-key' })).toThrow(/cueId is not registered/);
    expect(() => validatePlan45ComparisonRecord({
      ...base,
      sourceForms: { ...base.sourceForms, first: { numerator: '2', denominator: '11' } },
    })).toThrow(/denominator exceeds/);
    expect(() => validatePlan45ComparisonRecord({
      ...base,
      sourceForms: { ...base.sourceForms, first: { numerator: '3', denominator: '3' } },
    })).toThrow(/proper fraction/);
    expect(() => resolvePlan45ComparisonContext('plan45-compare-01', { practiceSetRevision: '2' })).toThrow(/registered practice-set/);

    const context = resolvePlan45ComparisonContext(base.itemId);
    expect(() => validatePlan45ComparisonContext({ ...context, cueId: 'compare.answer-key' })).toThrow(/authoritative ordered item record/);
  });
});
