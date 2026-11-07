import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { PLAN74_DATA, PLAN74_SET_V1 } from '../src/content/data/plan74-mixed-addition.js';
import { PLAN74_RECORDS, admitPlan74Record, resolvePlan74Context, validatePlan74Batch, validatePlan74Operands } from '../src/content/plan74-mixed-addition-task.js';
import { replayEpisode } from '../src/interaction/replay.js';
const copy = x => structuredClone(x);
const baseline = JSON.parse(readFileSync(new URL('../reports/development/plan-77-mixed-addition-modular-authoring-pilot/v17-baseline.json', import.meta.url), 'utf8').replace(/^\uFEFF/, ''));
describe('Plan 77 content seam', () => {
  it('preserves both frozen v17 envelopes, complete replay states, live order and contexts', () => {
    expect(PLAN74_RECORDS.map(r => r.itemId)).toEqual(['plan74-add-01','plan74-add-02']);
    for (const {envelope,state} of baseline) {
      expect(resolvePlan74Context(envelope.taskContext.itemId)).toEqual(envelope.taskContext);
      expect(replayEpisode(envelope)).toEqual(state);
    }
    expect(validatePlan74Batch(PLAN74_DATA, PLAN74_SET_V1)).toEqual([]);
  });
  it('diagnoses malformed, duplicate, ineligible, unreachable and invalid membership', () => {
    const checks = [
      [r => r[0].operands[0][0] = '0', m => {}, /positive integer/],
      [r => r.push(copy(r[0])), m => {}, /duplicate item ID/],
      [r => r[0].operands[1][1] = '4', m => {}, /exactly one whole/],
      [r => r[0].operands[0][0] = '9', m => {}, /response limit/],
      [r => {}, m => m.items.push(copy(m.items[0])), /duplicate membership/],
      [r => {}, m => m.items[0].itemId = 'missing', /unknown item/],
      [r => {}, m => m.items[0].itemRevision = '2', /revision does not match/],
    ];
    for (const [editRecords,editSet,reason] of checks) {
      const records=copy(PLAN74_DATA), set=copy(PLAN74_SET_V1); editRecords(records); editSet(set);
      expect(validatePlan74Batch(records,set).some(x => x.item && reason.test(x.reason))).toBe(true);
    }
  });
  it('diagnoses sparse record, membership, operand and tuple slots without throwing', () => {
    const records = copy(PLAN74_DATA), membership = copy(PLAN74_SET_V1);
    const sparseRecords = [records[0], ,];
    expect(validatePlan74Batch(sparseRecords, {...membership, items: [membership.items[0]]})).toContainEqual({item:'record[1]', reason:'missing record slot'});
    expect(validatePlan74Batch([records[0]], {...membership, items: Array(1)})).toContainEqual({item:'membership[0]', reason:'missing membership slot'});
    for (const operands of [[['1', , '8'], ['2','5','8']], [,['2','5','8']]]) {
      const invalid = {...records[0], operands};
      expect(validatePlan74Batch([invalid], {...membership, items:[membership.items[0]]})).toContainEqual({item:records[0].itemId, reason:'operands must be two [whole, numerator, denominator] arrays of positive integer strings'});
    }
  });
  it('does not widen live admission and preserves arithmetic eligibility independent of response limit', () => {
    const record=copy(PLAN74_RECORDS[0]); record.itemId='trial'; record.operands[0].whole='9';
    expect(() => validatePlan74Operands(record)).not.toThrow();
    expect(() => admitPlan74Record(record)).toThrow();
    expect(() => resolvePlan74Context('trial')).toThrow();
  });
});
