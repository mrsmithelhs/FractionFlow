import { describe, it, expect } from 'vitest';
import { PLAN78_DATA, PLAN78_SET_V1, PLAN78_SET_V2 } from '../src/content/data/plan78-mixed-subtraction.js';
import { PLAN78_RECORDS, PLAN78_RECORDS_V2, admitPlan78Record, resolvePlan78Context, validatePlan78Batch, validatePlan78Context } from '../src/content/plan78-mixed-subtraction-task.js';

describe('Plan 89 Plan 78 bank publication', () => {
  it('keeps the historical v1 prefix and explicitly registers exactly 30 v2 identities', () => {
    expect(PLAN78_SET_V1.items.map(x => x.itemId)).toEqual([
      'plan78-subtract-01','plan78-subtract-02','plan78-subtract-03','plan78-subtract-04',
    ]);
    expect(PLAN78_SET_V2.setId).toBe(PLAN78_SET_V1.setId);
    expect(PLAN78_SET_V2.setRevision).toBe('2');
    expect(PLAN78_SET_V2.items).toHaveLength(30);
    expect(Object.isFrozen(PLAN78_SET_V2)).toBe(true);
    expect(Object.isFrozen(PLAN78_SET_V2.items)).toBe(true);
    expect(PLAN78_SET_V2.items.every(Object.isFrozen)).toBe(true);
    expect(PLAN78_SET_V2.items.map(x => x.itemId)).toEqual(PLAN78_DATA.map(x => x.itemId));
    expect(PLAN78_RECORDS).toHaveLength(4);
    expect(PLAN78_RECORDS_V2).toHaveLength(30);
    expect(validatePlan78Batch(PLAN78_DATA, PLAN78_SET_V1)).toEqual([]);
    expect(validatePlan78Batch(PLAN78_DATA, PLAN78_SET_V2)).toEqual([]);
  });

  it('admits all 30 distinct operand pairs within the Plan 78 representation bounds', () => {
    const pairs = PLAN78_RECORDS_V2.map(record => JSON.stringify(record.operands));
    expect(new Set(pairs).size).toBe(30);
    for (const record of PLAN78_RECORDS_V2) {
      const { operands, result } = admitPlan78Record(record);
      expect(operands).toHaveLength(2);
      expect(operands.every(x => x.fraction.denominator === 8n && x.fraction.numerator < 8n)).toBe(true);
      expect(result.whole).toBeGreaterThanOrEqual(0n);
      expect(result.whole).toBeLessThanOrEqual(3n);
      expect(result.fraction.denominator).toBe(8n);
      expect(resolvePlan78Context(record.itemId, { setId: PLAN78_SET_V2.setId, setRevision: '2' }).operands).toEqual(record.operands);
    }
  });

  it('defaults to historical v1 and validates contexts against their stated revision', () => {
    const old = resolvePlan78Context('plan78-subtract-01');
    expect(old.setRevision).toBe('1');
    expect(validatePlan78Context(old)).toEqual(old);
    expect(resolvePlan78Context('plan78-subtract-05', { setId: PLAN78_SET_V2.setId, setRevision: '2' }).setRevision).toBe('2');
    expect(() => validatePlan78Context({ ...resolvePlan78Context('plan78-subtract-05', { setId: PLAN78_SET_V2.setId, setRevision: '2' }), setRevision: '1' })).toThrow();
  });

  it('rejects unknown identities, revisions, sets and cross-membership', () => {
    expect(() => resolvePlan78Context('unknown')).toThrow();
    expect(() => resolvePlan78Context('plan78-subtract-05')).toThrow();
    expect(() => resolvePlan78Context('plan78-subtract-01', { setId: PLAN78_SET_V2.setId, setRevision: '3' })).toThrow();
    expect(() => resolvePlan78Context('plan78-subtract-01', { setId: 'other-set', setRevision: '1' })).toThrow();
    expect(() => resolvePlan78Context('plan78-subtract-05', { setId: PLAN78_SET_V2.setId, setRevision: '1' })).toThrow();
    expect(() => resolvePlan78Context('plan78-subtract-01', { setId: PLAN78_SET_V2.setId, setRevision: '2' })).not.toThrow();
  });

  it('retains zero and nonzero fractional remainders', () => {
    const results = PLAN78_RECORDS_V2.map(record => admitPlan78Record(record).result);
    expect(results.some(x => x.fraction.numerator === 0n)).toBe(true);
    expect(results.some(x => x.fraction.numerator > 0n)).toBe(true);
  });
});
