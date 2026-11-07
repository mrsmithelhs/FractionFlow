import { deepFreeze } from './schema.js';
import { PLAN74_DATA, PLAN74_SET_V1 } from './data/plan74-mixed-addition.js';
import { createFraction, createMixedNumber, addMixedNumbers, addFractions, mixedToImproper, equalFractions } from '../math/index.js';

export const PLAN74_IDENTITY = deepFreeze({ setId: 'mixed-number-addition-with-regrouping', setRevision: '1', definitionId: 'phase-5-mixed-number-addition-with-regrouping', definitionRevision: '1' });
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
// Offline authoring validation is deliberately separate from live admission.
export function validatePlan74Batch(records, membership, { checkReachability = true } = {}) {
  const errors = [];
  const add = (item, reason) => errors.push({ item, reason });
  const validText = x => typeof x === 'string' && x.length > 0 && x.trim() === x;
  const exactKeys = (o, keys) => o && typeof o === 'object' && !Array.isArray(o) && same(Object.keys(o).sort(), [...keys].sort());
  const byId = new Map();
  if (!Array.isArray(records)) add('records', 'expected an array');
  else records.forEach((record, index) => {
    const label = validText(record?.itemId) ? record.itemId : `record[${index}]`;
    if (!exactKeys(record, ['itemId','itemRevision','operands']) || !validText(record.itemId) || !validText(record.itemRevision)) {
      add(label, 'record requires only itemId, itemRevision and operands'); return;
    }
    if (byId.has(record.itemId)) add(label, 'duplicate item ID');
    else byId.set(record.itemId, record);
    if (!Array.isArray(record.operands) || record.operands.length !== 2 || record.operands.some(x => !Array.isArray(x) || x.length !== 3 || x.some(v => typeof v !== 'string' || !/^[1-9][0-9]*$/.test(v)))) {
      add(label, 'operands must be two [whole, numerator, denominator] arrays of positive integer strings'); return;
    }
    const operands = record.operands.map(([whole,numerator,denominator]) => ({whole,numerator,denominator}));
    if (operands.some(x => BigInt(x.numerator) >= BigInt(x.denominator))) { add(label, 'fractional parts must be proper'); return; }
    if (operands.some(x => x.denominator !== '8')) { add(label, 'both denominators must be 8'); return; }
    const pooled = operands.reduce((sum,x) => sum + BigInt(x.numerator), 0n);
    if (pooled < 8n || pooled >= 16n) { add(label, 'fractional parts must form exactly one whole'); return; }
    try {
      const { result } = validatePlan74Operands({operands});
      if (checkReachability && result.whole > 4n) add(label, 'organized whole exceeds the task response limit of 4');
    } catch { add(label, 'exact arithmetic validation failed'); }
  });
  if (!exactKeys(membership, ['setId','setRevision','items']) || !validText(membership.setId) || !validText(membership.setRevision) || !Array.isArray(membership.items) || membership.items.length === 0) {
    add('membership', 'requires setId, setRevision and a nonempty items array');
  } else {
    const seen = new Set();
    membership.items.forEach((entry,index) => {
      const label = validText(entry?.itemId) ? entry.itemId : `membership[${index}]`;
      if (!exactKeys(entry,['itemId','itemRevision']) || !validText(entry.itemId) || !validText(entry.itemRevision)) { add(label, 'membership entry requires itemId and itemRevision'); return; }
      if (seen.has(entry.itemId)) add(label, 'duplicate membership item ID');
      seen.add(entry.itemId);
      const record = byId.get(entry.itemId);
      if (!record) add(label, 'membership references an unknown item');
      else if (record.itemRevision !== entry.itemRevision) add(label, 'membership item revision does not match record');
    });
  }
  return errors;
}

function materializeLiveRecords(records, membership) {
  const errors = validatePlan74Batch(records, membership, { checkReachability: false });
  if (errors.length || membership.setId !== PLAN74_IDENTITY.setId || membership.setRevision !== PLAN74_IDENTITY.setRevision) fail();
  return deepFreeze(membership.items.map(({itemId,itemRevision}) => {
    const record = records.find(item => item.itemId === itemId && item.itemRevision === itemRevision);
    return {itemId, itemRevision, operands: record.operands.map(([whole,numerator,denominator]) => ({whole,numerator,denominator}))};
  }));
}
export const PLAN74_RECORDS = materializeLiveRecords(PLAN74_DATA, PLAN74_SET_V1);
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
