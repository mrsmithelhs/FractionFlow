import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import {createFractionFlowApp} from '../../../src/app/app.js';
import {createPlan92RecordBridge} from '../../../src/app/plan92-record-bridge.js';
import {createPlan92RecordPanel} from '../../../src/app/plan92-record-panel.js';
import {createPlan92Observer} from '../../../src/app/plan92-observer.js';
import {allGate92Descriptors} from '../../../src/app/plan92-catalog.js';
import {selectPlan92Sync} from '../../../src/app/plan92-managed-selector.js';
import {rankPlan92HistoryCandidates} from '../../../src/app/plan92-history-policy.js';

const query=new URLSearchParams(location.search),name=query.get('name')||'ff92-owner-preview-only',seed=Number(query.get('seed')??0)>>>0;
const bridge=createPlan92RecordBridge({name,...(query.has('no-lock')?{locks:null}:{}),...(query.has('no-storage')?{indexedDB:null}:{})}),observer=createPlan92Observer({bridge,onError:()=>{document.querySelector('#preview-status').textContent='Practice is available, but remembering could not be confirmed.';}});
const descriptors=allGate92Descriptors(),versionInputs={catalogRevision:'ff92-catalog@1',policyRevision:'ff92-policy@1',compatibilityRevision:'ff92-compat@1',demandsRevision:'ff92-demands@1'};
let ranks=new Map(),diagnostics=[],busy=false,choiceEpoch=null,freshSuffix=false;const status=document.createElement('p');status.id='preview-status';status.setAttribute('role','status');document.querySelector('#expanded-record').appendChild(status);
const panel=createPlan92RecordPanel({root:document.querySelector('#expanded-record'),bridge});
async function start(core){
 if(busy)return;busy=true;status.textContent='';
 try{
  for(let attempt=0;attempt<2;attempt++){
   const meta=await bridge.readExpandedMeta();
   if(!meta?.enabled){ranks=new Map();diagnostics=[];choiceEpoch=null;observer.beginVisit(null);core();return;}
   const history=await bridge.readHistory();if(!history?.meta?.enabled)continue;
   const sample=selectPlan92Sync({...versionInputs,seed,candidates:descriptors.map(d=>({...d,fit:true}))});
   const reviewOpportunity=sample.witness.reviewOpportunity;
   ranks=new Map();diagnostics=[];for(const role of ['C','I','S','T']){
    const ranked=rankPlan92HistoryCandidates({candidates:descriptors.filter(d=>d.role===role),events:history.entries,coverage:history.meta.coverage,reviewOpportunity});
    for(const row of ranked){ranks.set(row.candidate.identity.itemId,row.priority??row.rank);diagnostics.push({item:row.candidate.identity.itemId,...row.evidence});}
   }
   const outcome=await bridge.installHistoryChoice(history.meta.epoch,()=>{choiceEpoch=history.meta.epoch;observer.beginVisit(history.meta.epoch);core()});
   if(outcome==='installed')return;
  }
  ranks=new Map();diagnostics=[];choiceEpoch=null;observer.beginVisit(null);core();status.textContent='Practice started without using the record.';
 }catch{ranks=new Map();diagnostics=[];choiceEpoch=null;observer.beginVisit(null);core();status.textContent='Practice started without using the record.';}
 finally{busy=false;}
}
async function next(core){
 if(busy)return;busy=true;
 try{
  if(!choiceEpoch){core();return;}
  if(await bridge.installHistoryChoice(choiceEpoch,core)==='installed')return;
  // The old suffix was chosen using a retired record. Rebuild its unstarted
  // roles using only the seed, under the current epoch when available.
  ranks=new Map();diagnostics=[];
  const meta=await bridge.readExpandedMeta();
  if(meta?.enabled&&await bridge.installHistoryChoice(meta.epoch,()=>{choiceEpoch=meta.epoch;observer.beginVisit(meta.epoch);freshSuffix=true;core()})==='installed')return;
  choiceEpoch=null;observer.beginVisit(null);freshSuffix=true;core();
 }catch{choiceEpoch=null;observer.beginVisit(null);freshSuffix=true;core();}
 finally{busy=false;}
}
function orderNext(current,candidates){
 if(!freshSuffix)return candidates;
 const pool=descriptors.filter(d=>d.role===current.role).map(d=>d.identity),sample=selectPlan92Sync({...versionInputs,seed,candidates:descriptors.map(d=>({...d,fit:true}))}),start=sample.witness.seedDraws[current.role]%pool.length;
 const order=[...pool.slice(start),...pool.slice(0,start)];return order.map(identity=>candidates.find(candidate=>candidate.itemId===identity.itemId));
}
const app=createFractionFlowApp({root:document.querySelector('#app'),presentationMode:'instant-test',sessionTestHooks:{
 selectionInput:()=>seed,recordStorage:bridge,comparisonClearIncludesExpanded:true,interceptStart:start,candidatePriority:d=>ranks.get(d.identity.itemId)??0,
 interceptTransition:next,orderNextCandidates:orderNext,
 onEpisodeInstalled:current=>{observer.install(current);freshSuffix=false},onEpisodeIntent:event=>observer.observe(event),onHelpOpened:()=>observer.helpOpened(),
}}).mount();
panel.refresh();window.owner92={app,bridge,observer,panel,async getDiagnostics(){const meta=await bridge.readExpandedMeta();if(!choiceEpoch||!meta?.enabled||meta.epoch!==choiceEpoch){ranks=new Map();diagnostics=[];return []}return structuredClone(diagnostics)}};
