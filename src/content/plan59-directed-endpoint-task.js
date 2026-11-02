import { createFraction, addFractions, subtractFractions, compareFractions, equalFractions } from '../math/index.js';
import { deepFreeze } from './schema.js';
import { PLAN59_RECORDS } from './data/plan59-directed-endpoint-records.js';

export const PLAN59_IDENTITY = deepFreeze({
  setId: 'directed-number-line-endpoint', setRevision: '1',
  definitionId: 'phase-4-directed-number-line-endpoint', definitionRevision: '1',
});
const canonical = value => Array.isArray(value) ? value.map(canonical)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const same = (left, right) => JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));
const fail = () => { throw new TypeError('invalid directed endpoint content'); };

export function admitPlan59Record(record) {
  const registered = PLAN59_RECORDS.find(item => same(item, record));
  if (!registered || !['add', 'subtract'].includes(record.operation)
    || !['4', '6', '8'].includes(record.start.denominator)
    || record.amount.denominator !== record.start.denominator
    || !/^[1-9][0-9]*$/.test(record.start.numerator)
    || !/^[1-9][0-9]*$/.test(record.amount.numerator)) fail();
  const d = BigInt(record.start.denominator);
  const start = createFraction(BigInt(record.start.numerator), d);
  const amount = createFraction(BigInt(record.amount.numerator), d);
  const zero = createFraction(0, 1);
  const one = createFraction(1, 1);
  if (compareFractions(start, zero) <= 0 || compareFractions(start, one) >= 0
    || compareFractions(amount, zero) <= 0 || compareFractions(amount, one) >= 0) fail();
  const endpoint = record.operation === 'add' ? addFractions(start, amount) : subtractFractions(start, amount);
  if (compareFractions(endpoint, zero) <= 0 || compareFractions(endpoint, one) >= 0) fail();
  const candidates = Array.from({ length: Number(d) + 1 }, (_, i) => ({
    id: `step-${i}`, form: { numerator: String(i), denominator: record.start.denominator },
  }));
  const matches = candidates.filter(candidate => equalFractions(endpoint,
    createFraction(BigInt(candidate.form.numerator), d)));
  if (matches.length !== 1) fail();
  return deepFreeze({ record: structuredClone(registered), candidates, correctPosition: matches[0].id,
    verification: { start: structuredClone(record.start), amount: structuredClone(record.amount),
      direction: record.operation === 'add' ? 'right' : 'left',
      endpoint: { numerator: String(endpoint.numerator), denominator: String(endpoint.denominator) } } });
}
export function resolvePlan59Context(itemId) {
  const record = PLAN59_RECORDS.find(item => item.itemId === itemId);
  if (!record) fail();
  admitPlan59Record(record);
  return deepFreeze({ ...PLAN59_IDENTITY, ...structuredClone(record) });
}
export function validatePlan59Context(context) {
  if (!context || !same(context, resolvePlan59Context(context.itemId))) fail();
  return resolvePlan59Context(context.itemId);
}
export function plan59RecordFromContext(context) {
  return { itemId: context.itemId, itemRevision: context.itemRevision, start: context.start,
    operation: context.operation, amount: context.amount };
}
