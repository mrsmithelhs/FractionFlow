// Arithmetic/record-level witnesses for the adopted two-mode location bounds.
// These temporary records are not registered, published or authored batches.
import assert from 'node:assert/strict';
import { PLAN37_BAR_TO_LINE_BRIDGE_RECORDS } from '../../../src/content/data/plan37-bar-to-line-bridge-records.js';
import {validatePlan37BarToLineBridgeRecord,plan37ExactLocationScale} from '../../../src/content/plan37-bar-to-line-bridge-task.js';
const gcd=(a,b)=>b?gcd(b,a%b):a;
const key=(n,d)=>{const g=gcd(n,d);return `${n/g}/${d/g}`;};
const universe=new Map();
for(const d of [2,3,4,6,8])for(let n=0;n<=d;n++)if(!universe.has(key(n,d)))universe.set(key(n,d),{n,d});
assert.equal(universe.size,13);
const current=new Set(PLAN37_BAR_TO_LINE_BRIDGE_RECORDS.map(r=>key(Number(r.sourceForm.numerator),Number(r.sourceForm.denominator))));
assert.equal(current.size,7);
for(const {n,d} of universe.values()){
  // A two-part grid has only three points; use fourths for its sparse choices.
  const q=d===2?4:d,point=n*q/d;
  const choices=[...new Set([0,point,q,...Array.from({length:q+1},(_,i)=>i)])].slice(0,4);
  const record=structuredClone(PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[0]);
  record.sourceForm={kind:'fraction',numerator:String(n),denominator:String(d)};record.partitionDenominator=String(d);
  record.sparseCandidates=choices.map((x,i)=>({id:`candidate-${String.fromCharCode(97+i)}`,form:{kind:'fraction',numerator:String(x),denominator:String(q)}}));
  validatePlan37BarToLineBridgeRecord(record);
  for(const supportMode of ['partitioned','sparse-benchmarks']){
    const scale=plan37ExactLocationScale({...record,supportMode});
    assert.equal(scale.positions.filter(p=>key(Number(p.unitsFromZero),Number(p.totalUnits))===key(n,d)).length,1);
  }
}
console.log(JSON.stringify({bothModesAllAmounts:universe.size,properAmounts:universe.size-2,liveDistinct:current.size,unregisteredWitnesses:universe.size,publication:0}));
