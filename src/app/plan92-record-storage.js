import { emptyRoot, validateRoot, applyObservation } from './comparison-record.js';
import { randomRecordToken } from './comparison-record-storage.js';
import { allGate92Descriptors } from './plan92-catalog.js';

// Isolated v2 seam. It is not imported by the app or activated on ordinary Start.
const LEGACY='record', EXPANDED='expanded', LEGACY_KEY='root', META_KEY='meta', EVENTS_KEY='events', LIMIT=100;
const exact=(v,keys)=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).sort().join('|')===[...keys].sort().join('|');
const tokenOk=v=>typeof v==='string'&&/^[0-9a-f]{32}$/.test(v);
const canonical=v=>Array.isArray(v)?v.map(canonical):v&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k])])):v;
const same=(a,b)=>JSON.stringify(canonical(a))===JSON.stringify(canonical(b));
const assistance=v=>['unknown','assisted','unassisted'].includes(v);
export function emptyPlan92Meta(epoch,enabled=false){
 if(!tokenOk(epoch)||typeof enabled!=='boolean')throw new TypeError('invalid expanded metadata');
 return {schema:1,epoch,enabled,nextOrdinal:1,earliestOrdinal:1,coverage:'unknown'};
}
export function validatePlan92Meta(meta){
 if(!exact(meta,['schema','epoch','enabled','nextOrdinal','earliestOrdinal','coverage'])||meta.schema!==1||!tokenOk(meta.epoch)||typeof meta.enabled!=='boolean'||!Number.isSafeInteger(meta.nextOrdinal)||meta.nextOrdinal<1||!Number.isSafeInteger(meta.earliestOrdinal)||meta.earliestOrdinal<1||meta.earliestOrdinal>meta.nextOrdinal||!['unknown','continuous'].includes(meta.coverage))throw new TypeError('invalid expanded metadata');
 return structuredClone(meta);
}
function descriptorFor(identity){return allGate92Descriptors().find(d=>same(d.identity,identity))??null;}
function validateEntries(events,meta){
 if(!Array.isArray(events)||events.length>LIMIT)throw new TypeError('invalid expanded events');
 const seen=new Set();let previous=0;
 for(const e of events){
  if(!exact(e,['token','ordinal','identity','role','demand','first','accepted','firstAssistance','acceptedAssistance'])||!tokenOk(e.token)||seen.has(e.token)||!Number.isSafeInteger(e.ordinal)||e.ordinal<=previous||e.ordinal<meta.earliestOrdinal||e.ordinal>=meta.nextOrdinal)throw new TypeError('invalid expanded event');
  const d=descriptorFor(e.identity);if(!d||e.role!==d.role||e.demand!==JSON.stringify(d.decision))throw new TypeError('invalid expanded identity');
  if(!['unknown','accepted','retry'].includes(e.first)||!['unknown','yes'].includes(e.accepted)||!assistance(e.firstAssistance)||!assistance(e.acceptedAssistance))throw new TypeError('invalid expanded observation');
  if(e.first==='unknown'&&(e.accepted!=='unknown'||e.firstAssistance!=='unknown'||e.acceptedAssistance!=='unknown'))throw new TypeError('outcome without first response');
  if(e.accepted==='unknown'&&e.acceptedAssistance!=='unknown')throw new TypeError('assistance without acceptance');
  if(e.firstAssistance==='assisted'&&e.accepted==='yes'&&e.acceptedAssistance==='unassisted')throw new TypeError('inconsistent assistance');
  if(e.firstAssistance==='unknown'&&e.first==='retry'&&e.accepted==='yes'&&e.acceptedAssistance==='unassisted')throw new TypeError('unsupported independence');
  seen.add(e.token);previous=e.ordinal;
 }
 return structuredClone(events);
}
export function createPlan92RecordStorage({indexedDB=globalThis.indexedDB,crypto=globalThis.crypto,locks=globalThis.navigator?.locks,name='fractionflow-comparison-record-v1',allowUpgrade=false}={}){
 let dbPromise;const token=()=>randomRecordToken(crypto);
 function open(){
  if(dbPromise)return dbPromise;let retired=false;
  const pending=new Promise((resolve,reject)=>{
   if(!indexedDB?.open)return reject(new Error('storage unavailable'));let req;try{req=allowUpgrade?indexedDB.open(name,2):indexedDB.open(name)}catch(e){reject(e);return;}
   req.onupgradeneeded=event=>{
    if(retired||!allowUpgrade){req.transaction.abort();return;}
    try{
     const db=req.result,tx=req.transaction;if(!db.objectStoreNames.contains(LEGACY))db.createObjectStore(LEGACY);if(!db.objectStoreNames.contains(EXPANDED))db.createObjectStore(EXPANDED);
     if(![0,1].includes(event.oldVersion)){tx.abort();return;}
     const legacy=tx.objectStore(LEGACY).get(LEGACY_KEY);
     legacy.onsuccess=()=>{try{if(legacy.result!==undefined)validateRoot(legacy.result);tx.objectStore(EXPANDED).put(emptyPlan92Meta(token(),false),META_KEY);}catch{tx.abort();}};
    }catch{req.transaction.abort();}
   };
   req.onerror=()=>{retired=true;reject(req.error||new Error('open failed'));};
   req.onblocked=()=>{retired=true;reject(new Error('upgrade blocked'));};
   req.onsuccess=()=>{const db=req.result;if(retired){db.close();return;}if(db.version!==2){db.close();reject(new Error('expanded version unavailable'));return;}db.onversionchange=()=>{db.close();if(dbPromise===cached)dbPromise=null};resolve(db);};
  });
  const cached=pending.catch(e=>{if(dbPromise===cached)dbPromise=null;throw e});dbPromise=cached;return cached;
 }
 async function transact(fn,{legacy=false,expanded=true,events='never'}={}){
  const db=await open();return new Promise((resolve,reject)=>{
   let tx,result,failure;try{tx=db.transaction([...(legacy?[LEGACY]:[]),...(expanded?[EXPANDED]:[])],'readwrite');}catch(e){reject(e);return;}
   tx.oncomplete=()=>resolve(result);tx.onabort=()=>reject(failure||tx.error||new Error('transaction aborted'));tx.onerror=()=>{};
   const ls=legacy?tx.objectStore(LEGACY):null,es=expanded?tx.objectStore(EXPANDED):null,lr=ls?.get(LEGACY_KEY),mr=es?.get(META_KEY);let ld=!legacy,md=!expanded;
   function finish(){if(!ld||!md)return;try{
    const old=legacy&&lr.result!==undefined?validateRoot(lr.result):null;
    if(expanded&&mr.result===undefined)throw new TypeError('missing expanded metadata');
    const meta=expanded?validatePlan92Meta(mr.result):null;
    const readEvents=typeof events==='function'?events(meta):events==='always';
    const apply=values=>{try{const change=fn(old,meta,values);result=change.result;if(change.legacy!==undefined)ls.put(validateRoot(change.legacy),LEGACY_KEY);if(change.meta!==undefined)es.put(validatePlan92Meta(change.meta),META_KEY);if(change.events!==undefined)es.put(validateEntries(change.events,change.meta??meta),EVENTS_KEY);if(change.clearEvents)es.delete(EVENTS_KEY);}catch(e){failure=e;tx.abort();}};
    if(readEvents){const er=es.get(EVENTS_KEY);er.onerror=()=>{failure=er.error||new Error('event read failed')};er.onsuccess=()=>{try{apply(er.result===undefined?[]:validateEntries(er.result,meta));}catch(e){failure=e;tx.abort();}};}else apply(null);
   }catch(e){failure=e;tx.abort();}}
   if(lr){lr.onerror=()=>{failure=lr.error||new Error('legacy read failed')};lr.onsuccess=()=>{ld=true;finish()};}
   if(mr){mr.onerror=()=>{failure=mr.error||new Error('metadata read failed')};mr.onsuccess=()=>{md=true;finish()};}
  });
 }
 const withLock=callback=>!locks?.request?Promise.reject(new Error('history lock unavailable')):locks.request('fractionflow-plan92-history',{mode:'exclusive'},callback);
 return Object.freeze({
  // Call only after affirmative expanded consent; the app has no such wiring yet.
  async enable(){return withLock(()=>transact((_l,m)=>{const meta={...m,enabled:true,epoch:token(),coverage:'unknown'};return {meta,result:structuredClone(meta)}}));},
  async readLegacy(){return transact(l=>({result:l}),{legacy:true,expanded:false});},
  async enableLegacy(){return transact(l=>{const next=l||emptyRoot(token());next.enabled=true;next.generation=token();return {legacy:next,result:structuredClone(next)}},{legacy:true,expanded:false});},
  async stopLegacy(){return transact(l=>{if(!l)return {result:null};const next={...l,enabled:false,generation:token()};return {legacy:next,result:structuredClone(next)}},{legacy:true,expanded:false});},
  async recordLegacy(generation,observation){const copy=structuredClone(observation);return transact(l=>{if(!l)return {result:'stale'};const applied=applyObservation(l,generation,copy);return {...(['inserted','updated'].includes(applied.result)?{legacy:applied.root}:{}),result:applied.result}},{legacy:true,expanded:false});},
  async stop(){return withLock(()=>transact((_l,m)=>({meta:{...m,enabled:false,epoch:token(),coverage:'unknown'},result:'stopped'})));},
  async clear(){return withLock(()=>transact((l,m)=>({...(l?{legacy:emptyRoot(token(),l.enabled)}:{}),meta:emptyPlan92Meta(token(),m.enabled),clearEvents:true,result:{legacyEnabled:l?.enabled??false,expandedEnabled:m.enabled}}),{legacy:true}));},
  async readMeta(){return transact((_l,m)=>({result:structuredClone(m)}));},
  // Explicit inspection is user initiated; unlike scheduler reads, it can
  // show retained entries after remembering has been stopped.
  async inspectHistory(){return transact((_l,m,events)=>({result:{meta:structuredClone(m),entries:events}}),{events:'always'});},
  // Disabled access never requests the separate event key; scheduler must not call it at all when off.
  async readHistory(){return transact((_l,m,events)=>({result:m.enabled?{meta:structuredClone(m),entries:events}:null}),{events:m=>m.enabled});},
  async writeExposure(epoch,identity,episodeToken){
   if(!tokenOk(episodeToken))throw new TypeError('invalid episode token');const d=descriptorFor(identity);if(!d)throw new TypeError('unapproved identity');
   return transact((_l,m,events)=>{if(!m.enabled||m.epoch!==epoch)return {result:'stale'};if(events.some(e=>e.token===episodeToken))return {result:'duplicate'};
    if(m.nextOrdinal>=Number.MAX_SAFE_INTEGER)throw new TypeError('ordinal exhausted');const e={token:episodeToken,ordinal:m.nextOrdinal,identity:structuredClone(d.identity),role:d.role,demand:JSON.stringify(d.decision),first:'unknown',accepted:'unknown',firstAssistance:'unknown',acceptedAssistance:'unknown'};
    const next=[...events,e],meta={...m,nextOrdinal:m.nextOrdinal+1};if(next.length>LIMIT){next.shift();meta.earliestOrdinal=next[0]?.ordinal??meta.nextOrdinal;meta.coverage='unknown';}return {meta,events:next,result:'inserted'};
   },{events:m=>m.enabled&&m.epoch===epoch});
  },
  async recordFirst(epoch,episodeToken,result,usedAssistance='unknown'){
   if(!tokenOk(episodeToken)||!['accepted','retry'].includes(result)||!assistance(usedAssistance))throw new TypeError('invalid first observation');
   return transact((_l,m,events)=>{if(!m.enabled||m.epoch!==epoch)return {result:'stale'};const index=events.findIndex(e=>e.token===episodeToken);if(index<0)return {result:'missing'};const old=events[index];if(old.first!=='unknown')return {result:'duplicate'};const entries=events.slice();entries[index]={...old,first:result,firstAssistance:usedAssistance};return {events:entries,result:'updated'};},{events:m=>m.enabled&&m.epoch===epoch});
  },
  async recordAcceptance(epoch,episodeToken,usedAssistance='unknown'){
   if(!tokenOk(episodeToken)||!assistance(usedAssistance))throw new TypeError('invalid acceptance');
   return transact((_l,m,events)=>{if(!m.enabled||m.epoch!==epoch)return {result:'stale'};const index=events.findIndex(e=>e.token===episodeToken);if(index<0)return {result:'missing'};const old=events[index];if(old.first==='unknown')return {result:'missing-first'};if(old.accepted==='yes')return {result:'duplicate'};const adjusted=old.firstAssistance==='assisted'?'assisted':old.firstAssistance==='unknown'&&usedAssistance==='unassisted'?'unknown':usedAssistance;const entries=events.slice();entries[index]={...old,accepted:'yes',acceptedAssistance:adjusted};return {events:entries,result:'updated'};},{events:m=>m.enabled&&m.epoch===epoch});
  },
  // Clear, Stop and synchronous history-choice installation use one shared origin lock.
  async installHistoryChoice(epoch,install){if(typeof install!=='function'||install.constructor?.name==='AsyncFunction')throw new TypeError('synchronous install required');return withLock(async()=>{const valid=await transact((_l,m)=>({result:m.enabled&&m.epoch===epoch}));if(!valid)return 'stale';const result=install();if(result&&typeof result.then==='function')throw new Error('synchronous install required');return 'installed';});},
  close(){if(dbPromise)dbPromise.then(db=>db.close()).catch(()=>{});dbPromise=null;},
 });
}
