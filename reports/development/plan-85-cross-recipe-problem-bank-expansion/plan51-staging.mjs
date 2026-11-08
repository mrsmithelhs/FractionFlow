// Report-local enumeration; the live Plan 51 array is not modified.
import { writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { PLAN51_DISTANCE_RECORDS } from '../../../src/content/data/plan51-distance-records.js';
import { admitPlan51Record,resolvePlan51Context } from '../../../src/content/plan51-distance-task.js';
import { PRACTICE_TYPES } from '../../../src/app/practice-types.js';
const gcd=(a,b)=>b?gcd(b,a%b):a;
const f=x=>{let n=Number(x.numerator),d=Number(x.denominator),g=gcd(n,d);return `${n/g}/${d/g}`;};
const key=r=>[f(r.sourceForms.first),f(r.sourceForms.second)].sort().join('|');
const live=PRACTICE_TYPES.find(x=>x.id==='fraction-distance').items.map(i=>i.id);
assert.deepEqual(live,PLAN51_DISTANCE_RECORDS.map(x=>x.itemId));
const existing=new Set(PLAN51_DISTANCE_RECORDS.map(key));assert.equal(existing.size,3);
const all=new Map();for(const d of [6,8])for(let a=1;a<d;a++)for(let b=a+1;b<d;b++){
  const r={itemId:'distance-placeholder',itemRevision:'1',sourceForms:{first:{numerator:String(a),denominator:String(d)},second:{numerator:String(b),denominator:String(d)}}};
  admitPlan51Record(r);all.set(key(r),r);
}
assert.equal(all.size,31);
const rank=k=>createHash('sha256').update(`plan85-distance-v1:${k}`).digest('hex');
const buckets=[6,8].flatMap(d=>Array.from({length:d-2},(_,i)=>({d,gap:i+1,rows:[],index:0})));
for(const [k,r] of all){if(existing.has(k))continue;const {first,second}=r.sourceForms;const q=buckets.find(x=>x.d===Number(first.denominator)&&x.gap===Number(second.numerator)-Number(first.numerator));q.rows.push([k,r]);}
for(const q of buckets)q.rows.sort(([a],[b])=>rank(a).localeCompare(rank(b)));
const seen=new Set(existing),candidates=[];
while(candidates.length<28){let added=false;for(const q of buckets){if(q.index===q.rows.length)continue;const [k,r]=q.rows[q.index++];if(seen.has(k))continue;seen.add(k);r.itemId=`distance-plan85-${String(candidates.length+1).padStart(2,'0')}`;if(candidates.length%2===1)[r.sourceForms.first,r.sourceForms.second]=[r.sourceForms.second,r.sourceForms.first];candidates.push(r);added=true;if(candidates.length===28)break;}if(!added)throw Error('insufficient distinct pairs');}
for(const r of candidates){admitPlan51Record(r);assert.throws(()=>resolvePlan51Context(r.itemId));}
const bad=structuredClone(candidates[0]);bad.sourceForms.second.denominator='4';assert.throws(()=>admitPlan51Record(bad));
const equal=structuredClone(candidates[0]);equal.sourceForms.second=structuredClone(equal.sourceForms.first);assert.throws(()=>admitPlan51Record(equal));
assert.equal(seen.size,31);
await writeFile(new URL('./plan51-candidates.json',import.meta.url),JSON.stringify({baseline:'318b83eb01f7bc8646e0472047bfda629a2aca14',liveIds:live,liveUnique:existing.size,maximumDistinct:all.size,candidates},null,2)+'\n');
console.log(JSON.stringify({liveIds:live.length,liveDistinct:existing.size,maximumDistinct:all.size,staged:candidates.length,totalDistinct:seen.size,stagedMembership:0,oneEligiblePairNotSelected:all.size-seen.size}));
