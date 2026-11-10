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
const publicMeta=meta=>{const copy=structuredClone(meta);delete copy.registrationSchema;delete copy.writerRegistration;return copy;};
export function emptyPlan92Meta(epoch,enabled=false){
 if(!tokenOk(epoch)||typeof enabled!=='boolean')throw new TypeError('invalid expanded metadata');
 return {schema:1,epoch,enabled,nextOrdinal:1,earliestOrdinal:1,coverage:'unknown',ordering:'unknown',revision:0,registrationSchema:1,writerRegistration:null};
}
export function clearedPlan92Meta(epoch,meta){
 meta=validatePlan92Meta(meta);
 if(meta.registrationSchema===1)return emptyPlan92Meta(epoch,meta.enabled);
 return {schema:1,epoch,enabled:meta.enabled,nextOrdinal:1,earliestOrdinal:1,coverage:'unknown',ordering:'unknown',revision:0};
}
export function validatePlan92Meta(meta){
 const base=['schema','epoch','enabled','nextOrdinal','earliestOrdinal','coverage'];
 const shapes=[base,[...base,'ordering'],[...base,'ordering','revision'],[...base,'ordering','revision','registrationSchema','writerRegistration']];
 if(!shapes.some(keys=>exact(meta,keys))||meta.schema!==1||!tokenOk(meta.epoch)||typeof meta.enabled!=='boolean'||!Number.isSafeInteger(meta.nextOrdinal)||meta.nextOrdinal<1||!Number.isSafeInteger(meta.earliestOrdinal)||meta.earliestOrdinal<1||meta.earliestOrdinal>meta.nextOrdinal||!['unknown','continuous'].includes(meta.coverage)||(meta.ordering!==undefined&&!['unknown','continuous'].includes(meta.ordering))||(meta.revision!==undefined&&(!Number.isSafeInteger(meta.revision)||meta.revision<0)))throw new TypeError('invalid expanded metadata');
 if(meta.registrationSchema!==undefined&&meta.registrationSchema!==1)throw new TypeError('invalid registration schema');
 const writer=meta.writerRegistration;
 if(meta.registrationSchema===1&&writer===undefined)throw new TypeError('missing writer registration');
 if(writer!==undefined&&writer!==null&&(!exact(writer,['epoch','token','state'])||!tokenOk(writer.epoch)||!tokenOk(writer.token)||!['active','clean','faulted'].includes(writer.state)))throw new TypeError('invalid writer registration');
 return {...structuredClone(meta),ordering:meta.ordering??'unknown',revision:meta.revision??0};
}
function descriptorFor(identity){return allGate92Descriptors().find(d=>same(d.identity,identity))??null;}
function validateEntries(events,meta){
 if(!Array.isArray(events)||events.length>LIMIT)throw new TypeError('invalid expanded events');
 const seen=new Set();let previous=0;
 for(const e of events){
  // `epoch` was added after the original v2 event shape. Old rows remain
  // readable, but are deliberately ineligible for same-generation ordering.
  const oldShape=exact(e,['token','ordinal','identity','role','demand','first','accepted','firstAssistance','acceptedAssistance']);
  const currentShape=exact(e,['token','ordinal','epoch','identity','role','demand','first','accepted','firstAssistance','acceptedAssistance']);
  if((!oldShape&&!currentShape)||(currentShape&&!tokenOk(e.epoch))||!tokenOk(e.token)||seen.has(e.token)||!Number.isSafeInteger(e.ordinal)||e.ordinal<=previous||e.ordinal<meta.earliestOrdinal||e.ordinal>=meta.nextOrdinal)throw new TypeError('invalid expanded event');
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
/** Pure conservative witness: lag counts retained exposures in the same epoch only. */
export function plan92LagWitness(meta,events,epoch,fromToken,toToken){
 try{
  meta=validatePlan92Meta(meta);events=validateEntries(events,meta);
  if(!meta.enabled||meta.epoch!==epoch||meta.ordering!=='continuous')return null;
  const sameGeneration=events.filter(e=>e.epoch===epoch);
  const from=sameGeneration.findIndex(e=>e.token===fromToken),to=sameGeneration.findIndex(e=>e.token===toToken);
  if(from<0||to<=from)return null;
  if(sameGeneration.slice(from,to+1).some((e,i,rows)=>i>0&&e.ordinal!==rows[i-1].ordinal+1))return null;
  return Object.freeze({epoch,fromOrdinal:sameGeneration[from].ordinal,toOrdinal:sameGeneration[to].ordinal,lag:to-from-1});
 }catch{return null;}
}
export function createPlan92RecordStorage({indexedDB=globalThis.indexedDB,crypto=globalThis.crypto,locks=globalThis.navigator?.locks,name='fractionflow-comparison-record-v1',allowUpgrade=false}={}){
 let dbPromise,volatileTaint=false;const token=()=>randomRecordToken(crypto);
 const taintKey=`fractionflow-plan92-ordering-taint-v1:${encodeURIComponent(name)}`;
 const channel=typeof BroadcastChannel==='function'?new BroadcastChannel(`fractionflow-plan92-history-fence:${encodeURIComponent(name)}`):null;
 // A delayed clear hint from another tab must never erase a newer local taint.
 // A tab that observed a failure stays conservative until its own Clear or a
 // fresh instance; hints can add a fence but cannot remove one.
 if(channel)channel.onmessage=event=>{if(event.data==='taint')volatileTaint=true;};
 const storageEvent=event=>{if(event.key===taintKey&&event.newValue==='tainted')volatileTaint=true;};
 globalThis.addEventListener?.('storage',storageEvent);
 const persistedTaint=()=>{try{return !globalThis.localStorage||globalThis.localStorage.getItem(taintKey)==='tainted';}catch{return true;}};
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
 async function transact(fn,{legacy=false,expanded=true,events='never',intent=false}={}){
  const db=await open();return new Promise((resolve,reject)=>{
   let tx,result,failure;try{tx=db.transaction([...(legacy?[LEGACY]:[]),...(expanded?[EXPANDED]:[])],'readwrite');}catch(e){reject(e);return;}
   tx.oncomplete=()=>resolve(result);tx.onabort=()=>reject(failure||tx.error||new Error('transaction aborted'));tx.onerror=()=>{};
   const ls=legacy?tx.objectStore(LEGACY):null,es=expanded?tx.objectStore(EXPANDED):null,lr=ls?.get(LEGACY_KEY),mr=es?.get(META_KEY),ir=intent?es?.get('intent'):null;let ld=!legacy,md=!expanded,id=!intent;
   function finish(){if(!ld||!md||!id)return;try{
    const old=legacy&&lr.result!==undefined?validateRoot(lr.result):null;
    if(expanded&&mr.result===undefined)throw new TypeError('missing expanded metadata');
    const meta=expanded?validatePlan92Meta(mr.result):null;
    const readEvents=typeof events==='function'?events(meta):events==='always';
    const apply=values=>{try{const change=fn(old,meta,values,ir?.result!==undefined);result=change.result;if(change.legacy!==undefined)ls.put(validateRoot(change.legacy),LEGACY_KEY);if(change.events!==undefined){const nextMeta=validatePlan92Meta(change.meta??meta);if(nextMeta.revision>=Number.MAX_SAFE_INTEGER)throw new TypeError('revision exhausted');es.put({...nextMeta,revision:nextMeta.revision+1},META_KEY);es.put(validateEntries(change.events,nextMeta),EVENTS_KEY);}else if(change.meta!==undefined)es.put(validatePlan92Meta(change.meta),META_KEY);if(change.intent===true)es.put(true,'intent');if(change.intent===false)es.delete('intent');if(change.clearEvents){es.delete(EVENTS_KEY);es.delete('intent');}}catch(e){failure=e;tx.abort();}};
    if(readEvents){const er=es.get(EVENTS_KEY);er.onerror=()=>{failure=er.error||new Error('event read failed')};er.onsuccess=()=>{try{apply(er.result===undefined?[]:validateEntries(er.result,meta));}catch(e){failure=e;tx.abort();}};}else apply(null);
   }catch(e){failure=e;tx.abort();}}
   if(lr){lr.onerror=()=>{failure=lr.error||new Error('legacy read failed')};lr.onsuccess=()=>{ld=true;finish()};}
   if(mr){mr.onerror=()=>{failure=mr.error||new Error('metadata read failed')};mr.onsuccess=()=>{md=true;finish()};}
   if(ir){ir.onerror=()=>{failure=ir.error||new Error('intent read failed')};ir.onsuccess=()=>{id=true;finish()};}
  });
 }
 const withLock=callback=>!locks?.request?Promise.reject(new Error('history lock unavailable')):locks.request('fractionflow-plan92-history',{mode:'exclusive'},callback);
 const ownsRecorder=(meta,registrationToken,epoch=meta?.epoch)=>Boolean(meta?.registrationSchema===1&&tokenOk(registrationToken)&&meta.writerRegistration?.state==='active'&&meta.writerRegistration.token===registrationToken&&meta.writerRegistration.epoch===meta.epoch&&meta.epoch===epoch);
 const taint=()=>{volatileTaint=true;try{globalThis.localStorage?.setItem(taintKey,'tainted');}catch{}try{channel?.postMessage('taint');}catch{}};
 const fencedWrite=callback=>withLock(async()=>{
  let priorIntent=false;
  try{priorIntent=await transact((_l,m,_events,hasIntent)=>({intent:true,result:hasIntent}),{intent:true});}
  catch(error){taint();try{await transact((_l,m)=>({intent:true,result:null}));}catch{}throw error;}
  try{
   const result=await callback();
   if(!['inserted','updated','duplicate','stale'].includes(result)){taint();return result;}
   if(!priorIntent)await transact((_l,m)=>({intent:false,result:null}));else taint();
   return result;
  }
  catch(error){taint();throw error;}
 }).catch(error=>{taint();throw error;});
 async function claimRecorder(registrationToken){
  if(!tokenOk(registrationToken))throw new TypeError('invalid recorder token');
  const claim=await withLock(()=>transact((_l,m,_events,hasIntent)=>{
   if(m.registrationSchema!==1||!m.enabled)return {result:null};
   const old=m.writerRegistration,tainted=volatileTaint||persistedTaint();
   if(old?.token===registrationToken&&old.state==='active'&&old.epoch===m.epoch&&!hasIntent&&!tainted)return {result:{epoch:m.epoch,recovered:false}};
   const cleanRelease=old?.state==='clean'&&old.epoch===m.epoch&&!hasIntent&&!tainted;
   const freshWindow=old===null&&!hasIntent&&!tainted;
   const epoch=cleanRelease||freshWindow?m.epoch:token();
   const next={...m,epoch,ordering:'continuous',revision:m.revision+1,writerRegistration:{epoch,token:registrationToken,state:'active'}};
   return {meta:next,intent:false,result:{epoch,recovered:!cleanRelease&&!freshWindow}};
  },{intent:true}));
  if(claim?.recovered){try{globalThis.localStorage?.removeItem(taintKey);}catch{}volatileTaint=false;try{channel?.postMessage('recovered');}catch{}}
  return claim;
 }
 async function releaseRecorder(registrationToken){
  return withLock(()=>transact((_l,m,_events,hasIntent)=>{
   if(!ownsRecorder(m,registrationToken))return {result:'stale'};
   if(hasIntent||volatileTaint||persistedTaint()){
    const meta={...m,ordering:'unknown',revision:m.revision+1,writerRegistration:{...m.writerRegistration,state:'faulted'}};
    return {meta,result:'faulted'};
   }
   const meta={...m,revision:m.revision+1,writerRegistration:{...m.writerRegistration,state:'clean'}};
   return {meta,result:'released'};
  },{intent:true}));
 }
 async function faultRecorder(registrationToken){
  return withLock(()=>transact((_l,m)=>{
   if(!ownsRecorder(m,registrationToken))return {result:'stale'};
   const meta={...m,ordering:'unknown',revision:m.revision+1,writerRegistration:{...m.writerRegistration,state:'faulted'}};
   return {meta,result:'faulted'};
  }));
 }
 return Object.freeze({
  // Call only after affirmative expanded consent; the app has no such wiring yet.
  async enable(){return withLock(()=>transact((_l,m)=>{if(m.registrationSchema!==1)return {result:'unsupported'};const meta={...m,enabled:true,epoch:token(),coverage:'unknown',ordering:'unknown',writerRegistration:null,revision:m.revision+1};return {meta,result:structuredClone(meta)}},{intent:true}));},
  async readLegacy(){return transact(l=>({result:l}),{legacy:true,expanded:false});},
  async enableLegacy(){return transact(l=>{const next=l||emptyRoot(token());next.enabled=true;next.generation=token();return {legacy:next,result:structuredClone(next)}},{legacy:true,expanded:false});},
  async stopLegacy(){return transact(l=>{if(!l)return {result:null};const next={...l,enabled:false,generation:token()};return {legacy:next,result:structuredClone(next)}},{legacy:true,expanded:false});},
  async recordLegacy(generation,observation){const copy=structuredClone(observation);return transact(l=>{if(!l)return {result:'stale'};const applied=applyObservation(l,generation,copy);return {...(['inserted','updated'].includes(applied.result)?{legacy:applied.root}:{}),result:applied.result}},{legacy:true,expanded:false});},
  async stop(){return withLock(()=>transact((_l,m)=>({meta:{...m,enabled:false,epoch:token(),coverage:'unknown',...(m.registrationSchema===1?{ordering:'unknown',writerRegistration:null,revision:m.revision+1}:{})},result:'stopped'})));},
  async clear(){return withLock(async()=>{const result=await transact((l,m)=>({...(l?{legacy:emptyRoot(token(),l.enabled)}:{}),meta:clearedPlan92Meta(token(),m),clearEvents:true,result:{legacyEnabled:l?.enabled??false,expandedEnabled:m.enabled}}),{legacy:true});try{globalThis.localStorage?.removeItem(taintKey);}catch{}volatileTaint=false;try{channel?.postMessage('clear');}catch{}return result;});},
  async readMeta(){return transact((_l,m)=>({result:publicMeta(m)}));},
  claimRecorder,
  releaseRecorder,
  faultRecorder,
  // Explicit inspection is user initiated; unlike scheduler reads, it can
  // show retained entries after remembering has been stopped.
  async inspectHistory(){return transact((_l,m,events)=>({result:{meta:publicMeta(m),entries:events}}),{events:'always'});},
  // Disabled access never requests the separate event key; scheduler must not call it at all when off.
  async readHistory(registrationToken){return transact((_l,m,events)=>({result:ownsRecorder(m,registrationToken)?{meta:publicMeta(m),entries:events}:null}),{events:m=>ownsRecorder(m,registrationToken)});},
  async writeExposure(epoch,identity,episodeToken,registrationToken){
    return fencedWrite(()=>{if(!tokenOk(episodeToken))throw new TypeError('invalid episode token');const d=descriptorFor(identity);if(!d)throw new TypeError('unapproved identity');return transact((_l,m,events)=>{if(!ownsRecorder(m,registrationToken,epoch))return {result:'stale'};if(events.some(e=>e.token===episodeToken))return {result:'duplicate'};
    if(m.nextOrdinal>=Number.MAX_SAFE_INTEGER)throw new TypeError('ordinal exhausted');const e={token:episodeToken,ordinal:m.nextOrdinal,epoch,identity:structuredClone(d.identity),role:d.role,demand:JSON.stringify(d.decision),first:'unknown',accepted:'unknown',firstAssistance:'unknown',acceptedAssistance:'unknown'};
    const next=[...events,e],meta={...m,nextOrdinal:m.nextOrdinal+1};if(next.length>LIMIT){next.shift();meta.earliestOrdinal=next[0]?.ordinal??meta.nextOrdinal;}return {meta,events:next,result:'inserted'};
     },{events:m=>ownsRecorder(m,registrationToken,epoch)});});
  },
  // Reads the authoritative metadata and bounded event set in one IDB
  // transaction. IndexedDB commits metadata and events atomically, so a
  // rejected/crashed write cannot advance the committed exposure sequence.
  async lagWitness(epoch,fromToken,toToken,registrationToken){return transact((_l,m,events,hasIntent)=>({result:volatileTaint||persistedTaint()||hasIntent||!ownsRecorder(m,registrationToken,epoch)?null:plan92LagWitness(m,events,epoch,fromToken,toToken)}),{events:m=>ownsRecorder(m,registrationToken,epoch),intent:true});},
  async readLagSnapshot(registrationToken){return transact((_l,m,events,hasIntent)=>{
   if(volatileTaint||persistedTaint()||hasIntent||!ownsRecorder(m,registrationToken))return {result:null};
   const current=events.filter(e=>e.epoch===m.epoch);
   if(current.some((e,i)=>i&&e.ordinal!==current[i-1].ordinal+1)||(current.length&&current.at(-1).ordinal!==m.nextOrdinal-1))return {result:null};
   return {result:{meta:publicMeta(m),entries:current,lagWindow:{epoch:m.epoch,revision:m.revision,earliestOrdinal:current[0]?.ordinal??null,latestOrdinal:current.at(-1)?.ordinal??null,earliestToken:current[0]?.token??null,latestToken:current.at(-1)?.token??null,retainedCount:current.length,ordering:'continuous',reliable:true}}};
  },{events:m=>ownsRecorder(m,registrationToken),intent:true});},
  async installRecordedChoice(snapshot,install,{allowNewer=false}={},registrationToken){
   if(!snapshot?.lagWindow||typeof install!=='function'||install.constructor?.name==='AsyncFunction'||typeof allowNewer!=='boolean')throw new TypeError('invalid recorded choice');
   const w=snapshot.lagWindow;let captured,capturedEntries;
   try{
    const meta=validatePlan92Meta({...snapshot.meta,registrationSchema:1,writerRegistration:{epoch:snapshot.meta.epoch,token:registrationToken,state:'active'}}),entries=validateEntries(snapshot.entries,meta);
    const endpoints=entries.filter(e=>e.epoch===w.epoch);
    if(!meta.enabled||meta.epoch!==w.epoch||meta.ordering!=='continuous'||meta.revision!==w.revision||w.ordering!=='continuous'||w.reliable!==true||endpoints[0]?.token!==w.earliestToken||endpoints.at(-1)?.token!==w.latestToken||endpoints[0]?.ordinal!==w.earliestOrdinal||endpoints.at(-1)?.ordinal!==w.latestOrdinal) return 'stale';
    captured=meta;capturedEntries=endpoints;
   }catch{return 'stale';}
   return withLock(async()=>{
    const valid=await transact((_l,m,events,hasIntent)=>{
     if(volatileTaint||persistedTaint()||hasIntent||!ownsRecorder(m,registrationToken,w.epoch)||m.ordering!=='continuous'||m.revision<captured.revision)return {result:false};
     if((allowNewer?m.revision<w.revision:m.revision!==w.revision))return {result:false};
     if(!w.earliestToken||!w.latestToken)return {result:false};
     const current=events.filter(e=>e.epoch===m.epoch);
     const from=current.findIndex(e=>e.token===w.earliestToken),to=current.findIndex(e=>e.token===w.latestToken);
     const unchanged=capturedEntries.every(row=>{const live=current.find(e=>e.token===row.token);return live&&same(live,row);});
     return {result:from>=0&&to>=from&&unchanged};
    },{events:m=>ownsRecorder(m,registrationToken,w.epoch),intent:true});
    if(!valid)return 'stale';
    const result=install();if(result&&typeof result.then==='function')throw new TypeError('synchronous install required');return 'installed';
   });
  },
  async recordFirst(epoch,episodeToken,result,usedAssistance='unknown',registrationToken){
   return fencedWrite(()=>{if(!tokenOk(episodeToken)||!['accepted','retry'].includes(result)||!assistance(usedAssistance))throw new TypeError('invalid first observation');return transact((_l,m,events)=>{if(!ownsRecorder(m,registrationToken,epoch))return {result:'stale'};const index=events.findIndex(e=>e.token===episodeToken);if(index<0)return {result:'missing'};const old=events[index];if(old.first!=='unknown')return {result:'duplicate'};const entries=events.slice();entries[index]={...old,first:result,firstAssistance:usedAssistance};return {events:entries,result:'updated'};},{events:m=>ownsRecorder(m,registrationToken,epoch)});});
  },
  async recordAcceptance(epoch,episodeToken,usedAssistance='unknown',registrationToken){
   return fencedWrite(()=>{if(!tokenOk(episodeToken)||!assistance(usedAssistance))throw new TypeError('invalid acceptance');return transact((_l,m,events)=>{if(!ownsRecorder(m,registrationToken,epoch))return {result:'stale'};const index=events.findIndex(e=>e.token===episodeToken);if(index<0)return {result:'missing'};const old=events[index];if(old.first==='unknown')return {result:'missing-first'};if(old.accepted==='yes')return {result:'duplicate'};const adjusted=old.firstAssistance==='assisted'?'assisted':old.firstAssistance==='unknown'&&usedAssistance==='unassisted'?'unknown':usedAssistance;const entries=events.slice();entries[index]={...old,accepted:'yes',acceptedAssistance:adjusted};return {events:entries,result:'updated'};},{events:m=>ownsRecorder(m,registrationToken,epoch)});});
  },
  // Clear, Stop and synchronous history-choice installation use one shared origin lock.
  async installHistoryChoice(epoch,install,registrationToken){if(typeof install!=='function'||install.constructor?.name==='AsyncFunction')throw new TypeError('synchronous install required');return withLock(async()=>{const valid=await transact((_l,m,_events,hasIntent)=>({result:ownsRecorder(m,registrationToken,epoch)&&!hasIntent&&!volatileTaint&&!persistedTaint()}),{intent:true});if(!valid)return 'stale';const result=install();if(result&&typeof result.then==='function')throw new Error('synchronous install required');return 'installed';});},
  close(){channel?.close();globalThis.removeEventListener?.('storage',storageEvent);if(dbPromise)dbPromise.then(db=>db.close()).catch(()=>{});dbPromise=null;},
 });
}
