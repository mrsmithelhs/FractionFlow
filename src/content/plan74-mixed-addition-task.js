import { deepFreeze } from './schema.js';
import { createFraction, createMixedNumber, addMixedNumbers, addFractions, mixedToImproper, equalFractions } from '../math/index.js';

export const PLAN74_IDENTITY = deepFreeze({ setId: 'mixed-number-addition-with-regrouping', setRevision: '1', definitionId: 'phase-5-mixed-number-addition-with-regrouping', definitionRevision: '1' });
export const PLAN74_RECORDS = deepFreeze([
  ['plan74-add-01', ['1','3','8'], ['2','5','8']],
  ['plan74-add-02', ['1','5','8'], ['2','6','8']],
].map(([itemId, a, b]) => ({ itemId, itemRevision: '1', operands: [a,b].map(([whole,numerator,denominator]) => ({ whole,numerator,denominator })) })));
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
const same = (a,b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
const fail = () => { throw new TypeError('invalid mixed-number addition content'); };
export function validatePlan74Operands(record) {
  if (!record || !Array.isArray(record.operands) || record.operands.length !== 2) fail();
  const operands = record.operands.map(form => {
    if (!form || !same(Object.keys(form).sort(), ['denominator','numerator','whole']) || !Object.values(form).every(s => typeof s === 'string' && /^[1-9][0-9]*$/.test(s))) fail();
    const [w,n,d] = [form.whole,form.numerator,form.denominator].map(BigInt);
    if (n >= d) fail();
    return createMixedNumber(w, createFraction(n,d));
  });
  const [a,b] = operands;
  if (a.fraction.denominator !== 8n || b.fraction.denominator !== 8n || a.fraction.numerator + b.fraction.numerator < 8n || a.fraction.numerator + b.fraction.numerator >= 16n) fail();
  const pooled = a.fraction.numerator + b.fraction.numerator;
  const result = createMixedNumber(a.whole + b.whole + pooled / 8n, createFraction(pooled % 8n, 8n));
  const coreResult = addMixedNumbers(a,b);
  if (coreResult.whole !== result.whole || coreResult.fraction.numerator !== result.fraction.numerator || coreResult.fraction.denominator !== 8n || !equalFractions(mixedToImproper(result), addFractions(mixedToImproper(a),mixedToImproper(b)))) fail();
  return { operands, result };
}
export function admitPlan74Record(record) {
  if (!PLAN74_RECORDS.some(item => same(item, record))) fail();
  return validatePlan74Operands(record);
}
export function resolvePlan74Context(itemId) {
  const record = PLAN74_RECORDS.find(item => item.itemId === itemId);
  if (!record) fail();
  admitPlan74Record(record);
  return deepFreeze({ ...PLAN74_IDENTITY, ...structuredClone(record) });
}
export function validatePlan74Context(context) {
  if (!context || !same(context, resolvePlan74Context(context.itemId))) fail();
  return resolvePlan74Context(context.itemId);
}
