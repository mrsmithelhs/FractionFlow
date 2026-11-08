import { deepFreeze } from './schema.js';
import { PLAN78_DATA, PLAN78_SET_V1, PLAN78_SET_V2 } from './data/plan78-mixed-subtraction.js';
import { createFraction, createMixedNumber, subtractMixedNumbers, equalMixedNumbers } from '../math/index.js';

export const PLAN78_IDENTITY = deepFreeze({setId:'mixed-number-subtraction-without-decomposition',setRevision:'1',definitionId:'phase-5-mixed-number-subtraction-without-decomposition',definitionRevision:'1'});
const canon = x => Array.isArray(x) ? x.map(canon) : x && typeof x === 'object' ? Object.fromEntries(Object.keys(x).sort().map(k => [k,canon(x[k])])) : x;
const same = (a,b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));
const fail = () => { throw new TypeError('invalid mixed-number subtraction content'); };
export function validatePlan78Operands(record) {
  if (!Array.isArray(record?.operands) || record.operands.length !== 2) fail();
  const forms=record.operands.map(o => {
    if (!o || !same(Object.keys(o).sort(),['denominator','numerator','whole']) || !Object.values(o).every(v => typeof v === 'string' && /^[1-9][0-9]*$/.test(v))) fail();
    const [w,n,d]=[o.whole,o.numerator,o.denominator].map(BigInt);
    if (d!==8n || n>=d) fail();
    return createMixedNumber(w,createFraction(n,d));
  });
  const [a,b]=forms;
  if (a.whole<b.whole || a.fraction.numerator<b.fraction.numerator) fail();
  const result=createMixedNumber(a.whole-b.whole,createFraction(a.fraction.numerator-b.fraction.numerator,8n));
  if (result.whole>3n || !equalMixedNumbers(result,subtractMixedNumbers(a,b))) fail();
  return {operands:forms,result};
}
export function validatePlan78Batch(records,membership) {
  const errors=[], byId=new Map();
  const add=(item,reason)=>errors.push({item,reason});
  const text=x=>typeof x==='string' && x.length>0 && x.trim()===x;
  if (!Array.isArray(records)) add('records','expected an array');
  else Array.from(records).forEach((r,i)=>{
    const label=text(r?.itemId)?r.itemId:`record[${i}]`;
    if (!r || !same(Object.keys(r).sort(),['itemId','itemRevision','operands']) || !text(r.itemId) || !text(r.itemRevision)) {add(label,'invalid record identity');return;}
    if (byId.has(r.itemId)) add(label,'duplicate item ID'); else byId.set(r.itemId,r);
    if (!Array.isArray(r.operands) || r.operands.length!==2 || r.operands.some(o=>!Array.isArray(o)||o.length!==3)) {add(label,'invalid operands');return;}
    try { validatePlan78Operands({operands:r.operands.map(([whole,numerator,denominator])=>({whole,numerator,denominator}))}); }
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
if (validatePlan78Batch(PLAN78_DATA,PLAN78_SET_V1).length || PLAN78_SET_V1.setId!==PLAN78_IDENTITY.setId || PLAN78_SET_V1.setRevision!=='1' || validatePlan78Batch(PLAN78_DATA,PLAN78_SET_V2).length || PLAN78_SET_V2.setId!==PLAN78_IDENTITY.setId || PLAN78_SET_V2.setRevision!=='2') fail();
function materialize(membership) { return deepFreeze(membership.items.map(({itemId,itemRevision})=>{
  const record=PLAN78_DATA.find(r=>r.itemId===itemId && r.itemRevision===itemRevision);
  return {itemId,itemRevision,operands:record.operands.map(([whole,numerator,denominator])=>({whole,numerator,denominator}))};
})); }
export const PLAN78_RECORDS=materialize(PLAN78_SET_V1);
export const PLAN78_RECORDS_V2=materialize(PLAN78_SET_V2);
export function admitPlan78Record(record) { if (!PLAN78_RECORDS_V2.some(r=>same(r,record))) fail(); return validatePlan78Operands(record); }
export function resolvePlan78Context(itemId, identity=PLAN78_IDENTITY) {
  const {setId,setRevision}=identity??{};
  if (setId!==PLAN78_IDENTITY.setId) fail();
  const records=setRevision==='1'?PLAN78_RECORDS:setRevision==='2'?PLAN78_RECORDS_V2:null;
  if (!records) fail();
  const record=records.find(r=>r.itemId===itemId); if (!record) fail();
  admitPlan78Record(record); return deepFreeze({...PLAN78_IDENTITY,setRevision,...structuredClone(record)});
}
export function validatePlan78Context(context) {
  if (!context || !same(context,resolvePlan78Context(context.itemId,{setId:context.setId,setRevision:context.setRevision}))) fail();
  return resolvePlan78Context(context.itemId,{setId:context.setId,setRevision:context.setRevision});
}
