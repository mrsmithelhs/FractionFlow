import '../../../src/app/styles.css';
import '../../../src/styles/render.css';
import {createFractionFlowApp} from '../../../src/app/app.js';
import {createPlan92RecordBridge} from '../../../src/app/plan92-record-bridge.js';
import {createPlan92RecorderLease,PLAN92_REVIEW_DB_NAME} from '../../../src/app/plan92-recorder-lease.js';
import {createPlan92RecordPanel} from '../../../src/app/plan92-record-panel.js';
import {createPlan92Observer} from '../../../src/app/plan92-observer.js';
import {allGate92Descriptors} from '../../../src/app/plan92-catalog.js';
import {selectPlan92Sync} from '../../../src/app/plan92-managed-selector.js';
import {rankPlan92HistoryCandidates} from '../../../src/app/plan92-history-policy.js';

const query=new URLSearchParams(location.search),name=query.get('name')||PLAN92_REVIEW_DB_NAME,seed=Number(query.get('seed')??0)>>>0;
if(!/^(?:ff92-review-|owner92-|lag92-|ff92-no-lock-|ff92-no-storage-)[a-z0-9-]+$/i.test(name))throw new Error('Preview requires a dedicated review database name');
const bridge=createPlan92RecordBridge({name,...(query.has('no-lock')?{locks:null}:{}),...(query.has('no-storage')?{indexedDB:null}:{})});
const leaseHost=createPlan92RecorderLease({storage:bridge,...(query.has('no-lock')?{locks:null}:{})});let recorder=null;
const recorderBridge={
 writeExposure:(epoch,identity,token)=>recorder?.epoch===epoch?recorder.writeExposure(identity,token):Promise.resolve('stale'),
 recordFirst:(epoch,token,result,assistance)=>recorder?.epoch===epoch?recorder.recordFirst(token,result,assistance):Promise.resolve('stale'),
 recordAcceptance:(epoch,token,assistance)=>recorder?.epoch===epoch?recorder.recordAcceptance(token,assistance):Promise.resolve('stale'),
};
const observer=createPlan92Observer({bridge:recorderBridge,onError:()=>{void recorder?.fault();document.querySelector('#preview-status').textContent='Practice is available, but remembering could not be confirmed.';}});
const descriptors=allGate92Descriptors(),versionInputs={catalogRevision:'ff92-catalog@1',policyRevision:'ff92-policy@1',compatibilityRevision:'ff92-compat@1',demandsRevision:'ff92-demands@1'};
let ranks=new Map(),diagnostics=[],busy=false,choiceEpoch=null,choiceSnapshot=null,freshSuffix=false;const status=document.createElement('p');status.id='preview-status';status.setAttribute('role','status');document.querySelector('#expanded-record').appendChild(status);
const panel=createPlan92RecordPanel({root:document.querySelector('#expanded-record'),bridge});
async function start(core){
 if(busy)return;busy=true;status.textContent='';
 try{
  // Finish this tab's observation queue before taking a record snapshot.
  await observer.settled();
  for(let attempt=0;attempt<2;attempt++){
   const meta=await bridge.readExpandedMeta();
   if(!meta?.enabled){ranks=new Map();diagnostics=[];choiceEpoch=null;choiceSnapshot=null;observer.beginVisit(null);core();return;}
   recorder=await leaseHost.acquire();
   if(!recorder){ranks=new Map();diagnostics=[];choiceEpoch=null;choiceSnapshot=null;observer.beginVisit(null);core();status.textContent='Practice started without using the record; another tab may be remembering.';return;}
   if(recorder.epoch!==meta.epoch&&!await recorder.reregister())continue;
   const history=await recorder.readHistory();if(!history?.meta?.enabled)continue;
   const possibleSnapshot=await recorder.readLagSnapshot(),recordedSnapshot=possibleSnapshot?.lagWindow?.retainedCount>=2?possibleSnapshot:null;
   if(recordedSnapshot&&(recordedSnapshot.meta.epoch!==history.meta.epoch||recordedSnapshot.meta.revision!==history.meta.revision))continue;
   const snapshot=recordedSnapshot??history;
   const sample=selectPlan92Sync({...versionInputs,seed,candidates:descriptors.map(d=>({...d,fit:true}))});
   const reviewOpportunity=sample.witness.reviewOpportunity;
   ranks=new Map();diagnostics=[];for(const role of ['C','I','S','T']){
    const ranked=rankPlan92HistoryCandidates({candidates:descriptors.filter(d=>d.role===role),events:history.entries,coverage:history.meta.coverage,recordedSnapshot,reviewOpportunity});
    for(const row of ranked){ranks.set(row.candidate.identity.itemId,row.priority??row.rank);diagnostics.push({item:row.candidate.identity.itemId,priority:row.priority,...row.evidence});}
   }
   const install=()=>{choiceEpoch=snapshot.meta.epoch;choiceSnapshot=recordedSnapshot;observer.beginVisit(snapshot.meta.epoch);core()};
   const outcome=recordedSnapshot?await recorder.installRecordedChoice(recordedSnapshot,install):await recorder.installHistoryChoice(snapshot.meta.epoch,install);
   if(outcome==='installed')return;
  }
  ranks=new Map();diagnostics=[];choiceEpoch=null;choiceSnapshot=null;observer.beginVisit(null);core();status.textContent='Practice started without using the record.';
 }catch{ranks=new Map();diagnostics=[];choiceEpoch=null;choiceSnapshot=null;observer.beginVisit(null);core();status.textContent='Practice started without using the record.';}
 finally{busy=false;}
}
async function next(core){
 if(busy)return;busy=true;
 try{
  if(!choiceEpoch){core();return;}
  const installed=choiceSnapshot?await recorder?.installRecordedChoice(choiceSnapshot,core,{allowNewer:true}):await recorder?.installHistoryChoice(choiceEpoch,core);
  if(installed==='installed')return;
  // The old suffix was chosen using a retired record. Rebuild its unstarted
  // roles using only the seed, under the current epoch when available.
  ranks=new Map();diagnostics=[];choiceSnapshot=null;
  const meta=await bridge.readExpandedMeta();
  if(meta?.enabled&&await recorder?.reregister()&&await recorder.installHistoryChoice(recorder.epoch,()=>{choiceEpoch=recorder.epoch;observer.beginVisit(recorder.epoch);freshSuffix=true;core()})==='installed')return;
  choiceEpoch=null;choiceSnapshot=null;observer.beginVisit(null);freshSuffix=true;core();
 }catch{choiceEpoch=null;choiceSnapshot=null;observer.beginVisit(null);freshSuffix=true;core();}
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
panel.refresh();window.owner92={app,bridge,observer,panel,async readRecordedHistory(){return recorder?.readHistory()??null},async readRecordedLagSnapshot(){return recorder?.readLagSnapshot()??null},recorderState(){return {active:recorder?.active===true,faulted:recorder?.faulted===true,epoch:recorder?.epoch??null}},async releaseRecorder(){await observer.settled();if(!recorder)return 'absent';const value=await recorder.release();recorder=null;choiceEpoch=null;choiceSnapshot=null;return value},async getDiagnostics(){const meta=await bridge.readExpandedMeta();if(!choiceEpoch||!meta?.enabled||meta.epoch!==choiceEpoch){ranks=new Map();diagnostics=[];return []}if(choiceSnapshot){let value=[];const result=await recorder?.installRecordedChoice(choiceSnapshot,()=>{value=structuredClone(diagnostics)},{allowNewer:true});if(result!=='installed'){ranks=new Map();diagnostics=[];return []}return value}return structuredClone(diagnostics)}};
