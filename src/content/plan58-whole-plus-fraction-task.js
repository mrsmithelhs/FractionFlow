import { createFraction } from '../math/index.js';
import { deepFreeze } from './schema.js';
import { PLAN58_RECORDS } from './data/plan58-whole-plus-fraction-records.js';

export const PLAN58_IDENTITY = deepFreeze({ setId: 'whole-plus-fraction-construction', setRevision: '1',
  definitionId: 'phase-4-whole-plus-fraction-construction', definitionRevision: '1' });
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const same = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
const fail = () => { throw new TypeError('invalid whole-plus-fraction content'); };
export function admitPlan58Record(record) {
  const registered = PLAN58_RECORDS.find(item => same(item, record));
  if (!registered || !['2', '4'].includes(record.form.denominator)
    || !/^(0|[1-9][0-9]*)$/.test(record.form.numerator)
    || BigInt(record.form.numerator) > 2n * BigInt(record.form.denominator)) fail();
  return { record: structuredClone(registered), value: createFraction(BigInt(record.form.numerator), BigInt(record.form.denominator)) };
}
export function resolvePlan58Context(itemId) {
  const record = PLAN58_RECORDS.find(item => item.itemId === itemId);
  if (!record) fail();
  admitPlan58Record(record);
  return deepFreeze({ ...PLAN58_IDENTITY, ...structuredClone(record) });
}
export function validatePlan58Context(context) {
  if (!context || !same(context, resolvePlan58Context(context.itemId))) fail();
  return resolvePlan58Context(context.itemId);
}
