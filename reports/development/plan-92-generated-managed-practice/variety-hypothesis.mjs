import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {selectPlan92Prototype} from '../../../src/app/plan92-managed-selector.js';
const dir='reports/development/plan-92-generated-managed-practice';
const ledger=JSON.parse(await readFile(`${dir}/candidate-ledger.json`,'utf8'));
const byId=new Map(ledger.entries.map(e=>[e.identity.itemId,e]));
const candidates=ledger.entries.map(e=>({role:e.role,fit:true,identity:{typeId:e.role==='C'?'symbolic-fraction-comparison':'unlike-denominator-subtraction',setId:e.identity.setId,setRevision:e.identity.setRevision,itemId:e.identity.itemId,itemRevision:e.identity.authoringRevision,definitionId:e.identity.definitionId,definitionRevision:e.identity.definitionRevision},problemKey:{key:e.role==='C'?JSON.stringify(e.exact.canonicalUnorderedKey):e.exact.canonicalProblemKey}}));
const shapes=[['C','I','T'],['C','S','T'],['C','I','S','T']];
const hash=(seed,domain)=>createHash('sha256').update(`ff92/v1:${seed}:${domain}`,'utf8').digest().readUInt32BE();
const base={policyRevision:'ff92-policy@1',catalogRevision:'ff92-catalog@1',compatibilityRevision:'ff92-compat@1',demandsRevision:'ff92-demands@1'};
const counts=items=>Object.fromEntries([...items.reduce((m,x)=>m.set(x,(m.get(x)||0)+1),new Map()).entries()].sort((a,b)=>a[0].localeCompare(b[0])));
const runs=[];
for(let seed=0;seed<64;seed++){
 const output=await selectPlan92Prototype({...base,seed,candidates});
 const roles=shapes[hash(seed,'shape')%3];
 const independent=roles.map(role=>{const p=candidates.filter(c=>c.role===role);return p[hash(seed,role)%p.length].identity.itemId;});
 const actual=output.manifest.entries.map(e=>e.itemId);
 if(JSON.stringify(independent)!==JSON.stringify(actual))throw Error(`reference disagreement ${seed}`);
 const decision=roles.map((role,i)=>{const e=byId.get(actual[i]);return role==='C'?`C:${e.decision.structure}`:role==='I'?`I:${e.decision.requiredSide}`:role==='S'?`S:${e.decision.judgments.left}/${e.decision.judgments.right}`:`T:${e.structure.denominatorRelation}`;}).join('|');
 runs.push({seed,shape:output.manifest.shapeId,ids:actual,problemKeys:output.witness.selected.map(x=>x.problemKey.key),decision});
}
const shapeCounts=counts(runs.map(r=>r.shape)), decisionCounts=counts(runs.map(r=>r.decision)), itineraryCounts=counts(runs.map(r=>r.ids.join('|'))), identityCounts=counts(runs.flatMap(r=>r.ids)), keyCounts=counts(runs.flatMap(r=>r.problemKeys));
const output={scope:'Hypothetical all-true fit for proposed 11-item batch only. These are not measured eligibility, managed admission, actual Start, learner evidence or a passed admission/variety gate. Structural T classes collapse numeric variations.',reference:'Independent node:crypto hash and direct indexing; identical roles and input order, no collisions in this batch.',shapes:shapeCounts,decisions:decisionCounts,itineraries:itineraryCounts,identities:identityCounts,problemKeys:keyCounts,distinct:{shapes:Object.keys(shapeCounts).length,decisions:Object.keys(decisionCounts).length,itineraries:Object.keys(itineraryCounts).length,identities:Object.keys(identityCounts).length,problemKeys:Object.keys(keyCounts).length},runs};
await writeFile(`${dir}/variety-hypothesis.json`,JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify(output.distinct));
