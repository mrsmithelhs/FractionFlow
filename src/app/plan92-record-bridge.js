import {createComparisonRecordStorage} from './comparison-record-storage.js';
import {createPlan92RecordStorage} from './plan92-record-storage.js';

// Isolated integration seam; ordinary application initialization does not use it.
// A versionless probe aborts creation of a missing DB. Only explicit expanded
// consent may open version 2 with upgrade permission.
export function createPlan92RecordBridge({indexedDB=globalThis.indexedDB,crypto=globalThis.crypto,locks=globalThis.navigator?.locks,name='fractionflow-comparison-record-v1'}={}){
 const options={indexedDB,crypto,locks,name};
 const legacy=createComparisonRecordStorage(options);
 const existing=createPlan92RecordStorage(options);
 const upgrading=createPlan92RecordStorage({...options,allowUpgrade:true});
 function version(){return new Promise((resolve,reject)=>{
  if(!indexedDB?.open){reject(new Error('storage unavailable'));return;}
  let absent=false,retired=false,req;try{req=indexedDB.open(name)}catch(e){reject(e);return;}
  req.onupgradeneeded=()=>{absent=true;req.transaction.abort()};
  req.onblocked=()=>{retired=true;reject(new Error('version probe blocked'))};
  req.onerror=()=>{if(retired)return;if(absent)resolve(0);else reject(req.error||new Error('version probe failed'))};
  req.onsuccess=()=>{const db=req.result;if(retired){db.close();return}const value=db.version;db.close();if(![1,2].includes(value)){reject(new Error('unsupported record version'));return}resolve(value)};
 });}
 async function route(v1,v2){
  // A v1 connection can lose an upgrade race. Retry discovery once; never
  // create or upgrade v2 from a legacy action.
  for(let attempt=0;attempt<2;attempt++){
   const v=await version();try{return v===2?await v2():await v1()}catch(e){if(v!==2&&e?.name==='VersionError'&&attempt===0)continue;throw e}
  }
  throw new Error('record version changed');
 }
 return Object.freeze({
  version,
  read:()=>route(()=>legacy.read(),()=>existing.readLegacy()),
  enable:()=>route(()=>legacy.enable(),()=>existing.enableLegacy()),
  stop:()=>route(()=>legacy.stop(),()=>existing.stopLegacy()),
  record:(generation,observation)=>route(()=>legacy.record(generation,observation),()=>existing.recordLegacy(generation,observation)),
  clear:()=>route(()=>legacy.clear(),async()=>{await existing.clear();return existing.readLegacy()}),
  reset:()=>route(()=>legacy.reset(),()=>Promise.reject(new Error('v2 recovery requires explicit disposition'))),
  readHistory:recorderToken=>route(()=>null,()=>existing.readHistory(recorderToken)),
  readExpandedMeta:()=>route(()=>null,()=>existing.readMeta()),
  readLagSnapshot:recorderToken=>route(()=>null,()=>existing.readLagSnapshot(recorderToken)),
  inspectHistory:()=>route(()=>null,()=>existing.inspectHistory()),
  async enableExpanded(){if(!locks?.request)throw new Error('history lock unavailable');legacy.close();return upgrading.enable()},
  stopExpanded:()=>route(()=>null,()=>existing.stop()),
  claimRecorder:token=>route(()=>null,()=>existing.claimRecorder(token)),
  releaseRecorder:token=>route(()=> 'stale',()=>existing.releaseRecorder(token)),
  faultRecorder:token=>route(()=> 'stale',()=>existing.faultRecorder(token)),
  writeExposure:(epoch,identity,token,recorderToken)=>route(()=> 'stale',()=>existing.writeExposure(epoch,identity,token,recorderToken)),
  recordFirst:(epoch,token,result,assistance,recorderToken)=>route(()=> 'stale',()=>existing.recordFirst(epoch,token,result,assistance,recorderToken)),
  recordAcceptance:(epoch,token,assistance,recorderToken)=>route(()=> 'stale',()=>existing.recordAcceptance(epoch,token,assistance,recorderToken)),
  installHistoryChoice:(epoch,install,recorderToken)=>route(()=> 'stale',()=>existing.installHistoryChoice(epoch,install,recorderToken)),
  installRecordedChoice:(snapshot,install,options,recorderToken)=>route(()=> 'stale',()=>existing.installRecordedChoice(snapshot,install,options,recorderToken)),
  close(){legacy.close();existing.close();upgrading.close()},
 });
}
