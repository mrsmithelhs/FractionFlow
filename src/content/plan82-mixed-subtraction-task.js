import { deepFreeze } from './schema.js';
import { PLAN82_DATA, PLAN82_SET_V1 } from './data/plan82-mixed-subtraction.js';
import { createFraction, createMixedNumber, subtractMixedNumbers, equalMixedNumbers, regroupForSubtraction } from '../math/index.js';

export const PLAN82_IDENTITY = deepFreeze({setId:'mixed-number-subtraction-with-decomposition',setRevision:'1',definitionId:'phase-5-mixed-number-subtraction-with-decomposition',definitionRevision:'1'});
const canon = x => Array.isArray(x) ? x.map(canon) : x && typeof x === 'object' ? Object.fromEntries(Object.keys(x).sort().map(k => [k,canon(x[k])])) : x;
const same = (a,b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));
const fail = () => { throw new TypeError('invalid mixed-number subtraction content'); };
export function validatePlan82Operands(record) {
  if (!Array.isArray(record?.operands) || record.operands.length !== 2) fail();
  const forms=record.operands.map(o => {
    if (!o || !same(Object.keys(o).sort(),['denominator','numerator','whole']) || !Object.values(o).every(v => typeof v === 'string' && /^[1-9][0-9]*$/.test(v))) fail();
    const [w,n,d]=[o.whole,o.numerator,o.denominator].map(BigInt);
    if (d!==8n || n>=d) fail();
    return createMixedNumber(w,createFraction(n,d));
  });
  const [a,b]=forms;
  if (a.whole<=b.whole || a.fraction.numerator>=b.fraction.numerator) fail();
  const renamed=regroupForSubtraction(a);
  const result=createMixedNumber(a.whole-b.whole-1n,createFraction(8n+a.fraction.numerator-b.fraction.numerator,8n));
  if (result.whole>3n || !equalMixedNumbers(renamed,a) || !equalMixedNumbers(result,subtractMixedNumbers(a,b)) || !equalMixedNumbers(result,subtractMixedNumbers(renamed,b))) fail();
  return {operands:forms,renamed,result};
}
export function validatePlan82Batch(records,membership) {
  const errors=[], byId=new Map();
  const add=(item,reason)=>errors.push({item,reason});
  const text=x=>typeof x==='string' && x.length>0 && x.trim()===x;
  if (!Array.isArray(records)) add('records','expected an array');
  else Array.from(records).forEach((r,i)=>{
    const label=text(r?.itemId)?r.itemId:`record[${i}]`;
    if (!r || !same(Object.keys(r).sort(),['itemId','itemRevision','operands']) || !text(r.itemId) || !text(r.itemRevision)) {add(label,'invalid record identity');return;}
    if (byId.has(r.itemId)) add(label,'duplicate item ID'); else byId.set(r.itemId,r);
    if (!Array.isArray(r.operands) || r.operands.length!==2 || r.operands.some(o=>!Array.isArray(o)||o.length!==3)) {add(label,'invalid operands');return;}
    try { validatePlan82Operands({operands:r.operands.map(([whole,numerator,denominator])=>({whole,numerator,denominator}))}); }
    catch {add(label,'ineligible operands or unreachable result');}
  });
  if (!membership || !same(Object.keys(membership).sort(),['items','setId','setRevision']) || !text(membership.setId) || !text(membership.setRevision) || !Array.isArray(membership.items) || !membership.items.length) add('membership','invalid membership');
  else {
    const seen=new Set();
    Array.from(membership.items).forEach((entry,i)=>{
      const label=text(entry?.itemId)?entry.itemId:`membership[${i}]`;
      if (!entry || !same(Object.keys(entry).sort(),['itemId','itemRevision']) || !text(entry.itemId) || !text(entry.itemRevision)) {add(label,'invalid entry');return;}
      if (seen.has(entry.itemId)) add(label,'duplicate membership'); seen.add(entry.itemId);
      if (!byId.has(entry.itemId) || byId.get(entry.itemId).itemRevision!==entry.itemRevision) add(label,'unknown item or revision');
    });
  }
  return errors;
}
if (validatePlan82Batch(PLAN82_DATA,PLAN82_SET_V1).length || PLAN82_SET_V1.setId!==PLAN82_IDENTITY.setId || PLAN82_SET_V1.setRevision!=='1') fail();
export const PLAN82_RECORDS=deepFreeze(PLAN82_SET_V1.items.map(({itemId,itemRevision})=>{
  const record=PLAN82_DATA.find(r=>r.itemId===itemId && r.itemRevision===itemRevision);
  return {itemId,itemRevision,operands:record.operands.map(([whole,numerator,denominator])=>({whole,numerator,denominator}))};
}));
export function admitPlan82Record(record) { if (!PLAN82_RECORDS.some(r=>same(r,record))) fail(); return validatePlan82Operands(record); }
export function resolvePlan82Context(itemId) {
  const record=PLAN82_RECORDS.find(r=>r.itemId===itemId); if (!record) fail();
  admitPlan82Record(record); return deepFreeze({...PLAN82_IDENTITY,...structuredClone(record)});
}
export function validatePlan82Context(context) {
  if (!context || !same(context,resolvePlan82Context(context.itemId))) fail();
  return resolvePlan82Context(context.itemId);
}
