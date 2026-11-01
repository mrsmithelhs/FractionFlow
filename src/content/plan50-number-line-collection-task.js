import { createFraction, equalFractions } from '../math/index.js';
import { deepFreeze } from './schema.js';
import { PLAN50_RECORDS } from './data/plan50-number-line-collection-records.js';

export const PLAN50_IDENTITY = deepFreeze({ setId: 'number-line-collection', setRevision: '1', definitionId: 'phase-4-number-line-collection', definitionRevision: '1' });
const keys = (v, k) => v && typeof v === 'object' && !Array.isArray(v) && JSON.stringify(Object.keys(v).sort()) === JSON.stringify([...k].sort());
const id = v => typeof v === 'string' && /^[a-z][a-z0-9-]{0,63}$/.test(v);
const integer = v => typeof v === 'string' && /^(0|[1-9][0-9]?)$/.test(v);
const invalid = message => { throw new TypeError(`invalid collection content: ${message}`); };
export function admitPlan50Record(record) {
  if (!keys(record, ['itemId','itemRevision','purpose','lattice','members']) || !id(record.itemId) || record.itemRevision !== '1' || !id(record.purpose) || ![4,6,8].includes(record.lattice) || !Array.isArray(record.members) || record.members.length !== 3) invalid('record shape or identity');
  const candidates = Array.from({ length: record.lattice + 1 }, (_, i) => ({ id: `step-${i}`, form: { numerator: String(i), denominator: String(record.lattice) } }));
  const values = record.members.map(m => {
    if (!keys(m, ['id','form']) || !id(m.id) || !keys(m.form, ['numerator','denominator']) || !integer(m.form.numerator) || !integer(m.form.denominator)) invalid('member shape');
    const n = BigInt(m.form.numerator), d = BigInt(m.form.denominator);
    if (d < 1n || d > 8n || n > d) invalid('source capability');
    return createFraction(n,d);
  });
  if (new Set(record.members.map(m => m.id)).size !== 3) invalid('duplicate member');
  const matches = values.map(v => candidates.filter(c => equalFractions(v, createFraction(BigInt(c.form.numerator), BigInt(c.form.denominator)))));
  if (matches.some(x => x.length !== 1)) invalid('value outside lattice');
  const positions = matches.map(x => x[0].id);
  if (new Set(positions).size < 2 || new Set(positions).size >= candidates.length) invalid('collection diversity');
  return deepFreeze({ record: structuredClone(record), candidates, correctPositions: Object.fromEntries(record.members.map((m,i) => [m.id,positions[i]])) });
}
export function resolvePlan50Context(itemId) {
  const record = PLAN50_RECORDS.find(r => r.itemId === itemId);
  if (!record) invalid('unknown item');
  admitPlan50Record(record);
  return deepFreeze({ ...PLAN50_IDENTITY, ...structuredClone(record) });
}
export function validatePlan50Context(context) {
  if (!keys(context, [...Object.keys(PLAN50_IDENTITY),'itemId','itemRevision','purpose','lattice','members'])) invalid('context shape');
  const expected = resolvePlan50Context(context.itemId);
  const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])])) : value;
  if (JSON.stringify(canonical(context)) !== JSON.stringify(canonical(expected))) invalid('unregistered or changed context');
  return expected;
}
