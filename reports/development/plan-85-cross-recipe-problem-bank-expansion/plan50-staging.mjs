// Report-local candidate enumeration. It does not alter production membership.
import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { PLAN50_RECORDS } from '../../../src/content/data/plan50-number-line-collection-records.js';
import { admitPlan50Record, resolvePlan50Context } from '../../../src/content/plan50-number-line-collection-task.js';
import { PRACTICE_TYPES } from '../../../src/app/practice-types.js';

const gcd=(a,b)=>b?gcd(b,a%b):a;
const rational=({numerator,denominator})=>{const n=Number(numerator),d=Number(denominator),g=gcd(n,d);return `${n/g}/${d/g}`;};
const key=r=>r.members.map(m=>rational(m.form)).sort().join('|');
const known=new Set(PLAN50_RECORDS.map(key));
assert.equal(known.size,PLAN50_RECORDS.length);
const buckets=new Map();
for(const lattice of [4,6,8]) {
  const forms=[];
  for(const d of [2,3,4,6,8]) for(let n=0;n<=d;n++) if((n*lattice)%d===0) forms.push({numerator:String(n),denominator:String(d)});
  for(let a=0;a<forms.length;a++) for(let b=a+1;b<forms.length;b++) for(let c=b+1;c<forms.length;c++) {
    const selected=[forms[a],forms[b],forms[c]], values=selected.map(rational), distinct=new Set(values).size;
    if(distinct<2) continue;
    // Repeated zero or one spellings mostly vary notation, not the intended
    // equivalence reasoning; reserve equivalence pairs for interior amounts.
    if(distinct===2 && ['0/1','1/1'].some(v=>values.filter(x=>x===v).length>1)) continue;
    const candidate={itemId:'collection-stage-placeholder',itemRevision:'1',purpose:distinct===2?'equivalent-pair-and-contrast':'distinct-ordering',lattice,members:selected.map((form,i)=>({id:String.fromCharCode(97+i),form}))};
    try { admitPlan50Record(candidate); } catch { continue; }
    const k=key(candidate); if(known.has(k)) continue;
    const endpoints=values.some(v=>v==='0/1'||v==='1/1');
    const group=`${distinct}-${endpoints?'endpoint':'interior'}-${lattice}`;
    if(!buckets.has(group)) buckets.set(group,new Map());
    if(!buckets.get(group).has(k)) buckets.get(group).set(k,candidate);
  }
}
const rank=k=>createHash('sha256').update(`plan85-collection-v1:${k}`).digest('hex');
const queues=[...buckets].sort(([a],[b])=>a.localeCompare(b)).map(([group,map])=>({group,rows:[...map].sort(([a],[b])=>rank(a).localeCompare(rank(b))),index:0}));
const candidates=[];
while(candidates.length<26) {
  let added=false;
  for(const q of queues) {
    while(q.index<q.rows.length && known.has(q.rows[q.index][0])) q.index++;
    if(q.index===q.rows.length) continue;
    const [k,r]=q.rows[q.index++]; known.add(k); r.itemId=`collection-plan85-${String(candidates.length+1).padStart(2,'0')}`;
    candidates.push(r); added=true; if(candidates.length===26) break;
  }
  if(!added) throw Error('not enough distinct candidates');
}
for(const record of [...PLAN50_RECORDS,...candidates]) admitPlan50Record(record);
assert.equal(new Set([...PLAN50_RECORDS,...candidates].map(key)).size,30);
for(const r of candidates) assert.throws(()=>resolvePlan50Context(r.itemId));
const active=PRACTICE_TYPES.find(t=>t.id==='number-line-collection').items.map(i=>i.id);
assert.deepEqual(active,PLAN50_RECORDS.map(i=>i.itemId));
const invalid=structuredClone(candidates[0]); invalid.members[0].form.denominator='9';
assert.throws(()=>admitPlan50Record(invalid));
await writeFile(new URL('./plan50-candidates.json',import.meta.url),JSON.stringify({baseline:'e3507cde52abc8d959c9f881441fc92ed8371f35',activeIds:active,candidates},null,2)+'\n');
console.log(JSON.stringify({live:active.length,staged:candidates.length,totalDistinct:known.size,groups:queues.map(q=>({group:q.group,used:candidates.filter(r=>`${new Set(r.members.map(m=>rational(m.form))).size}-${r.members.some(m=>['0/1','1/1'].includes(rational(m.form)))?'endpoint':'interior'}-${r.lattice}`===q.group).length}))}));
