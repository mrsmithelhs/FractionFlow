import {readFile,writeFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
import {allGate92Descriptors,validateGate92Visit} from './gate92-catalog.mjs';import {selectPlan92Prototype} from '../../../src/app/plan92-managed-selector.js';
const dir='reports/development/plan-92-generated-managed-practice';const all=allGate92Descriptors(),ledger=JSON.parse(await readFile(`${dir}/candidate-ledger.json`,'utf8'));const scratch=JSON.parse(await readFile(`${dir}/scratch92-observations.json`,'utf8'));const narrowComparison=JSON.parse(await readFile(`${dir}/type92-after-narrow.json`,'utf8'));const allRuns=await Promise.all([1,2,3,4].map(n=>readFile(`${dir}/gate92-fit-bundle-${n}.json`,'utf8').then(JSON.parse)));const helpRuns=await Promise.all([1,2,3,4].map(n=>readFile(`${dir}/gate92-fit-operation-help-bundle-${n}.json`,'utf8').then(JSON.parse)));
const h=(s,d)=>createHash('sha256').update(`ff92/v1:${s}:${d}`).digest().readUInt32BE();const shapes=[['C','I','T'],['C','S','T'],['C','I','S','T']], count=xs=>Object.fromEntries([...xs.reduce((m,x)=>m.set(x,(m.get(x)||0)+1),new Map())].sort((a,b)=>a[0].localeCompare(b[0])));
const base={policyRevision:'ff92-policy@1',catalogRevision:'ff92-catalog@1',compatibilityRevision:'ff92-compat@1',demandsRevision:'ff92-demands@1'};
let matrix=[];
for(const descriptor of all){const id=descriptor.identity.itemId,authored=ledger.entries.find(e=>e.identity.itemId===id);if(!authored||authored.role!==descriptor.role)throw Error(`ledger role mismatch ${id}`);
 for(const [width,scale] of [[1093,100],[650,200],[600,200]]){
  const receipts=scratch.runs.filter(r=>r.width===width&&r.scale===scale),scratchPass=receipts.length===8&&receipts.every(r=>{let e=r.events.find(e=>e.item===id);return e?.mounted&&e.views.every(v=>v.hostMatch)});
  const matches=allRuns.flatMap((report,bundle)=>report.runs.filter(r=>r.itemId===id&&r.width===width&&r.rootScale===scale).map(r=>({bundle:bundle+1,...r})));
  const help=helpRuns.flatMap((report,bundle)=>report.runs.filter(r=>r.itemId===id&&r.width===width&&r.rootScale===scale).map(r=>({bundle:bundle+1,...r})));
  const narrowRuns=width===600&&descriptor.role==='C'?narrowComparison.runs.filter(r=>r.id===id&&r.width===width&&r.scale===scale):[];
  const journeyPass=width===600&&descriptor.role==='C'?narrowRuns.length===32&&narrowRuns.every(r=>r.errors.length===0&&r.wrongRejected&&r.accepted&&r.layout.scrollWidth<=r.layout.clientWidth+1):matches.length===16&&matches.every(r=>r.completed&&!r.failures.length&&r.stages.every(s=>s.document.scrollWidth<=s.document.clientWidth+1));
  const helpPass=descriptor.role==='C'?journeyPass:help.length===16&&help.every(r=>r.completed&&!r.failures.length&&['task-help-open','task-help-closed','operation-help-open','operation-help-closed'].every(stage=>r.stages.some(s=>s.stage===stage))&&r.stages.every(s=>s.document.scrollWidth<=s.document.clientWidth+1));
  matrix.push({itemId:id,role:descriptor.role,identity:descriptor.identity,decision:descriptor.decision,problemKey:descriptor.problemKey,width,scale,scratchReceipts:receipts.length,scratchPass,journeys:narrowRuns.length||matches.length,journeyPass,helpJourneys:help.length,helpPass,proposedScreen:scratchPass&&journeyPass&&helpPass,disposition:'not admitted; visual and gate review required'});
 }
}
let pools=[];for(const [width,scale] of [[1093,100],[650,200],[600,200]]){
 const entries=matrix.filter(x=>x.width===width&&x.scale===scale),eligible=new Set(entries.filter(x=>x.proposedScreen).map(x=>x.itemId));
 // This narrower pool admits no subtraction on the existing fit threshold. Comparisons
 // must also pass their own post-repair journey screen; unknowns remain excluded.
 const narrow=width===600;
 const candidates=all.map(d=>({role:d.role,identity:d.identity,problemKey:d.problemKey,fit:eligible.has(d.identity.itemId)}));const results=[];
 for(let seed=0;seed<64;seed++){
  const out=await selectPlan92Prototype({...base,seed,candidates});if(!out.manifest)throw Error('empty pool');const full=!narrow,roles=full?shapes[h(seed,'shape')%3]:['C'];const reference=roles.map(role=>{const p=all.filter(d=>d.role===role&&eligible.has(d.identity.itemId));if(!p.length)throw Error(`pool missing ${role}`);return p[h(seed,role)%p.length].identity.itemId;});const ids=out.manifest.entries.map(x=>x.itemId);if(JSON.stringify(ids)!==JSON.stringify(reference))throw Error(`reference mismatch ${width}/${seed}`);
  const ds=ids.map(id=>all.find(x=>x.identity.itemId===id));if(ds.length>1)validateGate92Visit(ds);const signature=ds.map(d=>JSON.stringify(d.decision)).join('|');results.push({seed,shape:out.manifest.shapeId,ids,problemKeys:ds.map(d=>d.problemKey),signature});
 }
 pools.push({width,scale,screen:narrow?'narrow quantitative comparison screen and subtraction fit-class refusal; no full-role visit':'full quantitative screen; visual/fit approval pending',eligible:[...eligible],excluded:all.map(d=>d.identity.itemId).filter(id=>!eligible.has(id)),shapes:count(results.map(x=>x.shape)),identities:count(results.flatMap(x=>x.ids)),problemKeys:count(results.flatMap(x=>x.problemKeys.map(k=>JSON.stringify(k)))),decisions:count(results.map(x=>x.signature)),itineraries:count(results.map(x=>x.ids.join('|'))),results});
}
await writeFile(`${dir}/gate92-reference.json`,JSON.stringify({scope:'Measured quantitative screens and independently calculated reference for an isolated prototype. Candidate fit/admission and real Start remain subject to orchestration review; unknown/failed screens excluded, and the narrow comparison fallback is not a full measured visit.',matrix,pools},null,2)+'\n');for(const p of pools)console.log(p.width,p.scale,'screened',p.eligible.length,'shapes',JSON.stringify(p.shapes),'decision signatures',Object.keys(p.decisions).length);
