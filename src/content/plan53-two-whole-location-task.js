import { createFraction, equalFractions, improperToMixed } from '../math/index.js';
import { deepFreeze } from './schema.js';
import { PLAN53_RECORDS } from './data/plan53-two-whole-location-records.js';

export const PLAN53_IDENTITY = deepFreeze({
  setId: 'two-whole-location', setRevision: '1',
  definitionId: 'phase-4-two-whole-location', definitionRevision: '1',
});
const keys = (value, expected) => value && typeof value === 'object' && !Array.isArray(value)
  && JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...expected].sort());
const fail = () => { throw new TypeError('invalid two-whole location content'); };
const canonical = value => Array.isArray(value) ? value.map(canonical)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]))
    : value;

export function admitPlan53Record(record) {
  if (!keys(record, ['itemId', 'itemRevision', 'purpose', 'form'])
    || typeof record.itemId !== 'string' || !/^[a-z][a-z0-9-]{0,63}$/.test(record.itemId)
    || record.itemRevision !== '1' || typeof record.purpose !== 'string'
    || !/^[a-z][a-z0-9-]{0,63}$/.test(record.purpose)
    || !keys(record.form, ['numerator', 'denominator'])
    || typeof record.form.numerator !== 'string' || !/^(0|[1-9][0-9]?)$/.test(record.form.numerator)
    || !['2', '4', '8'].includes(record.form.denominator)) fail();
  const numerator = BigInt(record.form.numerator);
  const denominator = BigInt(record.form.denominator);
  if (numerator > 2n * denominator) fail();
  const value = createFraction(numerator, denominator);
  const mixed = improperToMixed(value);
  const candidates = Array.from({ length: Number(2n * denominator) + 1 }, (_, index) => ({
    id: `step-${index}`, form: { numerator: String(index), denominator: record.form.denominator },
  }));
  const matches = candidates.filter(candidate => equalFractions(
    value, createFraction(BigInt(candidate.form.numerator), denominator),
  ));
  if (matches.length !== 1) fail();
  return deepFreeze({
    record: structuredClone(record), candidates, correctPosition: matches[0].id,
    verification: { whole: String(mixed.whole), remainder: {
      numerator: String(mixed.fraction.numerator), denominator: String(mixed.fraction.denominator),
    } },
  });
}
export function resolvePlan53Context(itemId) {
  const record = PLAN53_RECORDS.find(candidate => candidate.itemId === itemId);
  if (!record) fail();
  admitPlan53Record(record);
  return deepFreeze({ ...PLAN53_IDENTITY, ...structuredClone(record) });
}
export function validatePlan53Context(context) {
  if (!keys(context, [...Object.keys(PLAN53_IDENTITY), 'itemId', 'itemRevision', 'purpose', 'form'])) fail();
  const expected = resolvePlan53Context(context.itemId);
  if (JSON.stringify(canonical(context)) !== JSON.stringify(canonical(expected))) fail();
  return expected;
}
