import { createFraction, equalFractions, improperToMixed } from '../math/index.js';
import { deepFreeze } from './schema.js';
import { PLAN53_RECORDS } from './data/plan53-two-whole-location-records.js';
export const PLAN53_IDENTITY = deepFreeze({setId:'two-whole-location',setRevision:'1',definitionId:'phase-4-two-whole-location',definitionRevision:'1'});
const keys=(v,k)=>v && typeof v==='object' && !Array.isArray(v) && JSON.stringify(Object.keys(v).sort())===JSON.stringify([...k].sort());
const fail=()=>{throw new TypeError('invalid two-whole location content');};
const canonical=v=>Array.isArray(v)?v.map(canonical):v && typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
export function admitPlan53Record(r) {
  if(!keys(r,['itemId','itemRevision','purpose','form']) || typeof r.itemId!=='string' || !/^[a-z][a-z0-9-]{0,63}$/.test(r.itemId) || r.itemRevision!=='1' || typeof r.purpose!=='string' || !/^[a-z][a-z0-9-]{0,63}$/.test(r.purpose) || !keys(r.form,['numerator','denominator']) || typeof r.form.numerator!=='string' || !/^(0|[1-9][0-9]?)$/.test(r.form.numerator) || !['2','4','8'].includes(r.form.denominator)) fail();
  const n=BigInt(r.form.numerator), d=BigInt(r.form.denominator);
  if(n>2n*d) fail();
  const value=createFraction(n,d), mixed=improperToMixed(value);
  const candidates=Array.from({length:Number(2n*d)+1},(_,i)=>({id:`step-${i}`,form:{numerator:String(i),denominator:r.form.denominator}}));
  const matches=candidates.filter(c=>equalFractions(value,createFraction(BigInt(c.form.numerator),d)));
  if(matches.length!==1) fail();
  return deepFreeze({record:structuredClone(r),candidates,correctPosition:matches[0].id,verification:{whole:String(mixed.whole),remainder:{numerator:String(mixed.fraction.numerator),denominator:String(mixed.fraction.denominator)}}});
}
export function resolvePlan53Context(itemId) {
  const record=PLAN53_RECORDS.find(r=>r.itemId===itemId); if(!record) fail();
  admitPlan53Record(record); return deepFreeze({...PLAN53_IDENTITY,...structuredClone(record)});
}
export function validatePlan53Context(c) {
  if(!keys(c,[...Object.keys(PLAN53_IDENTITY),'itemId','itemRevision','purpose','form'])) fail();
  const expected=resolvePlan53Context(c.itemId);
  if(JSON.stringify(canonical(c))!==JSON.stringify(canonical(expected))) fail(); return expected;
}
