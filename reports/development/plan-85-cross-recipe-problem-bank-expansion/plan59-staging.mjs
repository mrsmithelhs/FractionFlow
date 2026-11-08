// Materialize a disposable copy of the source graph to exercise the unchanged
// Plan 59 validator with report-local candidate records. Production is untouched.
import { mkdtemp, cp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { PLAN59_RECORDS } from '../../../src/content/data/plan59-directed-endpoint-records.js';
import { PRACTICE_TYPES } from '../../../src/app/practice-types.js';
import { resolvePlan59Context } from '../../../src/content/plan59-directed-endpoint-task.js';

const gcd=(a,b)=>b?gcd(b,a%b):a;
const f=(n,d)=>{const g=gcd(n,d);return `${n/g}/${d/g}`;};
const key=r=>`${f(Number(r.start.numerator),Number(r.start.denominator))}|${r.operation}|${f(Number(r.amount.numerator),Number(r.amount.denominator))}`;
const seen=new Set(PLAN59_RECORDS.map(key));
assert.equal(seen.size,PLAN59_RECORDS.length);
const rank=k=>createHash('sha256').update(`plan85-endpoint-v1:${k}`).digest('hex');
const buckets=[];
for(const d of [4,6,8]) for(const operation of ['add','subtract']) {
  const options=[];
  for(let n=1;n<d;n++) for(let m=1;m<d;m++) {
    const end=n+(operation==='add'?m:-m); if(end<=0||end>=d)continue;
    const r={itemId:'endpoint-placeholder',itemRevision:'1',start:{numerator:String(n),denominator:String(d)},operation,amount:{numerator:String(m),denominator:String(d)}};
    options.push(r);
  }
  options.sort((a,b)=>rank(key(a)).localeCompare(rank(key(b))));
  buckets.push({d,operation,options,index:0});
}
const candidates=[];
while(candidates.length<24) {
  let added=false;
  for(const q of buckets) {
    while(q.index<q.options.length && seen.has(key(q.options[q.index])))q.index++;
    if(q.index===q.options.length)continue;
    const r=q.options[q.index++]; seen.add(key(r)); r.itemId=`endpoint-plan85-${String(candidates.length+1).padStart(2,'0')}`;
    candidates.push(r); added=true;if(candidates.length===24)break;
  }
  if(!added)throw Error('candidate capacity exhausted');
}
const prefix=resolve(tmpdir(),'fractionflow-plan85-');
const sandbox=await mkdtemp(prefix);
try {
  await cp(new URL('../../../src/',import.meta.url),join(sandbox,'src'),{recursive:true});
  await writeFile(join(sandbox,'package.json'),'{"type":"module"}\n');
  // Only this isolated data file changes; the validator and math modules are copied unchanged.
  const bad=structuredClone(candidates[0]); bad.itemId='endpoint-negative-control'; bad.amount.numerator='0';
  await writeFile(join(sandbox,'src/content/data/plan59-directed-endpoint-records.js'),`export const PLAN59_RECORDS=${JSON.stringify([...PLAN59_RECORDS,...candidates,bad])};\n`);
  const {admitPlan59Record}=await import(pathToFileURL(join(sandbox,'src/content/plan59-directed-endpoint-task.js')).href);
  const derived=[];
  for(const r of [...PLAN59_RECORDS,...candidates]) { const result=admitPlan59Record(r); assert.ok(result.correctPosition); derived.push({itemId:r.itemId,correctPosition:result.correctPosition}); }
  assert.throws(()=>admitPlan59Record(bad));
  const unregistered=structuredClone(candidates[0]);unregistered.itemId='endpoint-unregistered';assert.throws(()=>admitPlan59Record(unregistered));
  for(const r of candidates)assert.throws(()=>resolvePlan59Context(r.itemId));
  const active=PRACTICE_TYPES.find(t=>t.id==='directed-number-line-endpoint').items.map(i=>i.id);
  assert.deepEqual(active,PLAN59_RECORDS.map(r=>r.itemId));
  assert.equal(seen.size,30);
  await writeFile(new URL('./plan59-candidates.json',import.meta.url),JSON.stringify({baseline:'e3507cde52abc8d959c9f881441fc92ed8371f35',activeIds:active,candidates,isolatedDerived:derived.filter(r=>candidates.some(c=>c.itemId===r.itemId))},null,2)+'\n');
  console.log(JSON.stringify({live:active.length,staged:candidates.length,totalDistinct:seen.size,byDenominator:Object.fromEntries([4,6,8].map(d=>[d,candidates.filter(r=>Number(r.start.denominator)===d).length])),byOperation:Object.fromEntries(['add','subtract'].map(op=>[op,candidates.filter(r=>r.operation===op).length]))}));
} finally {
  assert.ok(resolve(sandbox).startsWith(prefix));
  await rm(sandbox,{recursive:true,force:true});
}
