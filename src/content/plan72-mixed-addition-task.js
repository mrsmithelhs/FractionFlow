import { deepFreeze } from './schema.js';
import { createFraction, createMixedNumber, addMixedNumbers, addFractions, mixedToImproper, equalFractions } from '../math/index.js';

export const PLAN72_IDENTITY = deepFreeze({ setId: 'mixed-number-addition-without-regrouping', setRevision: '1', definitionId: 'phase-4-mixed-number-addition-without-regrouping', definitionRevision: '1' });
export const PLAN72_RECORDS = deepFreeze([
  ['plan72-add-01', ['1','1','4'], ['1','1','4']],
  ['plan72-add-02', ['1','1','3'], ['2','1','3']],
  ['plan72-add-03', ['2','1','4'], ['1','2','4']],
  ['plan72-add-04', ['1','1','8'], ['2','3','8']],
].map(([itemId, a, b]) => ({ itemId, itemRevision: '1', operands: [a,b].map(([whole,numerator,denominator]) => ({ whole,numerator,denominator })) })));
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
const same = (a,b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
const fail = () => { throw new TypeError('invalid mixed-number addition content'); };
export function admitPlan72Record(record) {
  if (!PLAN72_RECORDS.some(item => same(item, record))) fail();
  const operands = record.operands.map(form => {
    if (!Object.values(form).every(s => typeof s === 'string' && /^[1-9][0-9]*$/.test(s))) fail();
    const [w,n,d] = [form.whole,form.numerator,form.denominator].map(BigInt);
    if (n >= d) fail();
    return createMixedNumber(w, createFraction(n,d));
  });
  const [a,b] = operands;
  if (a.fraction.denominator !== b.fraction.denominator || a.fraction.numerator + b.fraction.numerator >= a.fraction.denominator) fail();
  const result = addMixedNumbers(a,b);
  if (result.fraction.denominator !== a.fraction.denominator || !equalFractions(mixedToImproper(result), addFractions(mixedToImproper(a),mixedToImproper(b)))) fail();
  return { operands, result };
}
export function resolvePlan72Context(itemId) {
  const record = PLAN72_RECORDS.find(item => item.itemId === itemId);
  if (!record) fail();
  admitPlan72Record(record);
  return deepFreeze({ ...PLAN72_IDENTITY, ...structuredClone(record) });
}
export function validatePlan72Context(context) {
  if (!context || !same(context, resolvePlan72Context(context.itemId))) fail();
  return resolvePlan72Context(context.itemId);
}
