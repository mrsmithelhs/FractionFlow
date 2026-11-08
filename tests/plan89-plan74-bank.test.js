import { describe, expect, it } from 'vitest';
import { PLAN74_DATA, PLAN74_SET_V1, PLAN74_SET_V2 } from '../src/content/data/plan74-mixed-addition.js';
import { PLAN74_RECORDS, PLAN74_RECORDS_V2, PLAN74_IDENTITY, resolvePlan74Context, validatePlan74Batch, validatePlan74Context } from '../src/content/plan74-mixed-addition-task.js';

const clone = value => structuredClone(value);
const ids = set => set.items.map(item => item.itemId);

describe('Plan 89 Plan 74 revision 2 bank', () => {
  it('preserves v1 membership and registers exactly the 30 staged records in v2', () => {
    expect(ids(PLAN74_SET_V1)).toEqual(['plan74-add-01', 'plan74-add-02']);
    expect(PLAN74_RECORDS).toHaveLength(2);
    expect(ids(PLAN74_SET_V2)).toEqual(PLAN74_DATA.map(record => record.itemId));
    expect(PLAN74_SET_V2.items.slice(0, 2)).toEqual(PLAN74_SET_V1.items);
    expect(PLAN74_RECORDS_V2).toHaveLength(30);
    expect(validatePlan74Batch(PLAN74_DATA, PLAN74_SET_V2)).toEqual([]);
    for (const record of PLAN74_RECORDS_V2) {
      const context = resolvePlan74Context(record.itemId, { setId: PLAN74_IDENTITY.setId, setRevision: '2' });
      expect(context.operands).toEqual(record.operands);
      expect(context.setRevision).toBe('2');
    }
  });

  it('keeps exact historical v1 contexts as the default and validates explicit identities', () => {
    for (const record of PLAN74_RECORDS) {
      const expected = { ...PLAN74_IDENTITY, ...record };
      expect(resolvePlan74Context(record.itemId)).toEqual(expected);
      expect(validatePlan74Context(expected)).toEqual(expected);
    }
    const freshId = PLAN74_SET_V2.items[29].itemId;
    expect(() => resolvePlan74Context(freshId)).toThrow();
    expect(() => resolvePlan74Context(freshId, { setId: PLAN74_IDENTITY.setId, setRevision: '1' })).toThrow();
    expect(() => resolvePlan74Context(PLAN74_SET_V1.items[0].itemId, { setId: 'wrong', setRevision: '2' })).toThrow();
    expect(() => resolvePlan74Context(freshId, { setId: PLAN74_IDENTITY.setId, setRevision: '3' })).toThrow();
    const wrongRevision = { ...resolvePlan74Context(freshId, { setId: PLAN74_IDENTITY.setId, setRevision: '2' }), setRevision: '1' };
    expect(() => validatePlan74Context(wrongRevision)).toThrow();
  });

  it('keeps all v2 operand pairs distinct and within exact response bounds', () => {
    const pairKeys = PLAN74_DATA.map(record => JSON.stringify(record.operands));
    expect(new Set(pairKeys).size).toBe(30);
    for (const record of PLAN74_RECORDS_V2) {
      const context = resolvePlan74Context(record.itemId, { setId: PLAN74_IDENTITY.setId, setRevision: '2' });
      const [a, b] = context.operands;
      expect(a.denominator).toBe('8');
      expect(b.denominator).toBe('8');
      expect(BigInt(a.numerator) + BigInt(b.numerator)).toBeGreaterThanOrEqual(8n);
      expect(BigInt(a.numerator) + BigInt(b.numerator)).toBeLessThan(16n);
      expect(BigInt(a.whole) + BigInt(b.whole) + 1n).toBeLessThanOrEqual(4n);
    }
  });

  it('rejects malformed membership, identity, duplicate membership and unreachable records', () => {
    const wrongIdentity = clone(PLAN74_SET_V2);
    wrongIdentity.setId = 'wrong';
    expect(validatePlan74Batch(PLAN74_DATA, wrongIdentity).length).toBe(0); // Structural validator; resolver enforces registered identity.
    expect(() => resolvePlan74Context(PLAN74_DATA[2].itemId, { setId: wrongIdentity.setId, setRevision: wrongIdentity.setRevision })).toThrow();
    const duplicate = clone(PLAN74_SET_V2);
    duplicate.items[1] = clone(duplicate.items[0]);
    expect(validatePlan74Batch(PLAN74_DATA, duplicate).some(error => /duplicate membership/.test(error.reason))).toBe(true);
    const unreachable = clone(PLAN74_DATA);
    unreachable[0].operands[0][0] = '9';
    expect(validatePlan74Batch(unreachable, PLAN74_SET_V2).some(error => /response limit/.test(error.reason))).toBe(true);
    const oldOnly = clone(PLAN74_SET_V1);
    expect(() => resolvePlan74Context(PLAN74_SET_V1.items[0].itemId, { setId: oldOnly.setId, setRevision: oldOnly.setRevision })).not.toThrow();
    expect(() => resolvePlan74Context(PLAN74_SET_V2.items[2].itemId, { setId: oldOnly.setId, setRevision: oldOnly.setRevision })).toThrow();
  });
});
