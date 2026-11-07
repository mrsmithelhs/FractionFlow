import { createFraction, createMixedNumber, mixedToImproper, equalFractions } from '../math/index.js';
import { deepFreeze } from './schema.js';
import { PLAN84_DATA, PLAN84_SET_V1, PLAN84_SETS, PLAN84_ACTIVE_SET } from './data/plan84-mixed-improper-records.js';

export const PLAN84_IDENTITY = deepFreeze({ setId:PLAN84_ACTIVE_SET.setId, setRevision:PLAN84_ACTIVE_SET.setRevision, definitionId:'phase-5-mixed-to-improper-bridge', definitionRevision:'1' });
const keys = (o,k) => o && typeof o === 'object' && !Array.isArray(o) && JSON.stringify(Object.keys(o).sort()) === JSON.stringify([...k].sort());
const canon = x => Array.isArray(x) ? x.map(canon) : x && typeof x === 'object' ? Object.fromEntries(Object.keys(x).sort().map(k => [k,canon(x[k])])) : x;
const same = (a,b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));
const fail = () => { throw new TypeError('invalid mixed-to-improper content'); };
const id = x => typeof x === 'string' && /^[a-z0-9][a-z0-9-]{0,63}$/.test(x);
const number = x => typeof x === 'string' && /^(0|[1-9][0-9]?)$/.test(x);

// Recipe eligibility is independent of registered membership and batch coverage.
export function validatePlan84Record(record) {
  if (!keys(record,['itemId','itemRevision','mixed','options']) || !id(record.itemId) || !id(record.itemRevision)
    || !Array.isArray(record.mixed) || record.mixed.length !== 3 || !record.mixed.every(number)
    || !Array.isArray(record.options) || record.options.length !== 4) fail();
  const [w,n,d] = record.mixed.map(BigInt);
  if (w !== 1n || ![2n,4n,8n].includes(d) || n <= 0n || n >= d) fail();
  const target = mixedToImproper(createMixedNumber(w, createFraction(n,d)));
  const values = record.options.map(o => {
    if (!Array.isArray(o) || o.length !== 2 || !o.every(number)) fail();
    const [a,b] = o.map(BigInt);
    if (b !== d || a > 2n*d) fail();
    return createFraction(a,b);
  });
  if (values.some((v,i) => values.slice(0,i).some(other => equalFractions(v,other)))) fail();
  const matches = values.map((v,i) => equalFractions(v,target) ? i : -1).filter(i => i >= 0);
  if (matches.length !== 1) fail();
  return { correctIndex: matches[0] };
}
export function validatePlan84Membership(records, membership) {
  if (!Array.isArray(records) || !keys(membership,['setId','setRevision','items']) || !id(membership.setId) || !id(membership.setRevision) || !Array.isArray(membership.items) || !membership.items.length) fail();
  const ids = new Set();
  for (const record of records) { validatePlan84Record(record); if (ids.has(record.itemId)) fail(); ids.add(record.itemId); }
  const seen = new Set();
  for (const item of membership.items) {
    if (!keys(item,['itemId','itemRevision']) || seen.has(item.itemId) || !records.some(r => r.itemId === item.itemId && r.itemRevision === item.itemRevision)) fail();
    seen.add(item.itemId);
  }
}
export function validatePlan84InitialCoverage(records) {
  if (!Array.isArray(records) || records.length !== 4 || new Set(records.map(r => validatePlan84Record(r).correctIndex)).size !== 4) fail();
}
for (const set of PLAN84_SETS) validatePlan84Membership(PLAN84_DATA, set);
if (!PLAN84_SETS.includes(PLAN84_ACTIVE_SET) || new Set(PLAN84_SETS.map(s => `${s.setId}/${s.setRevision}`)).size !== PLAN84_SETS.length || PLAN84_SETS.some(s => s.setId !== PLAN84_ACTIVE_SET.setId)) fail();
validatePlan84InitialCoverage(PLAN84_SET_V1.items.map(item => PLAN84_DATA.find(r => r.itemId === item.itemId && r.itemRevision === item.itemRevision)));
export const PLAN84_RECORDS = deepFreeze(PLAN84_ACTIVE_SET.items.map(item => structuredClone(PLAN84_DATA.find(r => r.itemId === item.itemId && r.itemRevision === item.itemRevision))));
export function admitPlan84Record(record) { if (!PLAN84_DATA.some(r => same(r,record)) || !PLAN84_SETS.some(set => set.items.some(item => item.itemId===record.itemId && item.itemRevision===record.itemRevision))) fail(); return validatePlan84Record(record); }
export function resolvePlan84Context(itemId, setRevision=PLAN84_ACTIVE_SET.setRevision) {
  const set=PLAN84_SETS.find(s => s.setId===PLAN84_ACTIVE_SET.setId && s.setRevision===setRevision);
  const member=set?.items.find(item => item.itemId===itemId);
  const record=member && PLAN84_DATA.find(r => r.itemId===member.itemId && r.itemRevision===member.itemRevision); if (!record) fail();
  return deepFreeze({...PLAN84_IDENTITY,setId:set.setId,setRevision:set.setRevision,...structuredClone(record)});
}
export function validatePlan84Context(context) {
  if (!context || !same(context,resolvePlan84Context(context.itemId,context.setRevision))) fail();
  return resolvePlan84Context(context.itemId,context.setRevision);
}
