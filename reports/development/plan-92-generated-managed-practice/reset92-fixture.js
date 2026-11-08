// Test fixture only. The caller supplies a unique disposable database name.
import { createComparisonRecordStorage, randomRecordToken } from '../../../src/app/comparison-record-storage.js';
import { emptyRoot, validateRoot } from '../../../src/app/comparison-record.js';
let old, db;
const request = req => new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
function openV2(name) {
 return new Promise((resolve,reject)=>{
  let retired=false; const req=indexedDB.open(name,2);
  req.onblocked=()=>{retired=true;reject(new Error('upgrade-blocked'));};
  req.onerror=()=>reject(req.error);
  req.onupgradeneeded=()=>{if(retired){req.transaction.abort();return;} if(!req.result.objectStoreNames.contains('record'))req.result.createObjectStore('record'); if(!req.result.objectStoreNames.contains('expanded'))req.result.createObjectStore('expanded');};
  req.onsuccess=()=>{if(retired){req.result.close();return;}db=req.result;db.onversionchange=()=>db.close();resolve();};
 });
}
function transaction(fn){return new Promise((resolve,reject)=>{
 const tx=db.transaction(['record','expanded'],'readwrite'),legacy=tx.objectStore('record'),expanded=tx.objectStore('expanded');let result,err;
 tx.oncomplete=()=>resolve(result);tx.onabort=()=>reject(err||tx.error);tx.onerror=()=>{};
 const a=legacy.get('root'),b=expanded.get('root');let ar=false,br=false;
 function run(){if(!ar||!br)return;try{result=fn(a.result,b.result,legacy,expanded);}catch(e){err=e;tx.abort();}}
 a.onsuccess=()=>{ar=true;run();};b.onsuccess=()=>{br=true;run();};
 });}
const lock=fn=>{if(!navigator.locks?.request)throw new Error('lock-unavailable');return navigator.locks.request('ff92-disposable-probe',{mode:'exclusive'},fn);};
window.resetProbe={
 oldOpen:async name=>{old=createComparisonRecordStorage({name});return old.enable();},
 oldRead:()=>old.read(),oldWrite:(generation,observation)=>old.record(generation,observation), oldClose:()=>old.close(),
 upgrade:openV2,
 initialize:()=>transaction((legacy,expanded,ls,es)=>{const root=legacy?validateRoot(legacy):emptyRoot(randomRecordToken());if(!legacy)ls.put(root,'root');if(!expanded)es.put({epoch:randomRecordToken(),enabled:true,entries:[]},'root');return {legacyEnabled:root.enabled};}),
 snapshot:()=>transaction((legacy,expanded)=>({legacy,expanded})),
 add:(epoch,value)=>transaction((legacy,expanded,ls,es)=>{if(!expanded||expanded.epoch!==epoch||!expanded.enabled)return 'stale';es.put({...expanded,entries:[...expanded.entries,value]},'root');return 'written';}),
 clear:()=>lock(()=>transaction((legacy,expanded,ls,es)=>{const l=validateRoot(legacy),next=emptyRoot(randomRecordToken(),l.enabled);ls.put(next,'root');es.put({epoch:randomRecordToken(),enabled:expanded.enabled,entries:[]},'root');return 'cleared';})),
 stop:()=>lock(()=>transaction((legacy,expanded,ls,es)=>{es.put({...expanded,enabled:false,epoch:randomRecordToken()},'root');return 'stopped';})),
 choice:(epoch,callback)=>lock(async()=>{const s=await transaction((legacy,expanded)=>({epoch:expanded.epoch,enabled:expanded.enabled}));if(!s.enabled||s.epoch!==epoch)return 'stale';callback();return 'installed';}),
 close:()=>{old?.close();db?.close();},
};window.resetReady=true;
