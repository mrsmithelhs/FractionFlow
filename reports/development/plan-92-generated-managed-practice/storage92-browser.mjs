import {createServer} from 'vite';
import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
const dir='reports/development/plan-92-generated-managed-practice';
const server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0},logLevel:'error'});
let browser,context;const results={};
const check=(condition,label)=>{if(!condition)throw Error(label);results[label]='passed';};
try{
 await server.listen();browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});context=await browser.newContext();
 const [a,b]=await Promise.all([context.newPage(),context.newPage()]);const url=`http://127.0.0.1:${server.httpServer.address().port}/${dir}/storage92-fixture.html`;
 await Promise.all([a,b].map(async p=>{await p.goto(url);await p.waitForFunction(()=>window.storage92);}));
 const name=`ff92-isolated-${Date.now()}-${Math.random().toString(16).slice(2)}`;
 const legacy=await a.evaluate(async name=>{window.old=storage92.createComparisonRecordStorage({name});return old.enable()},name);
 await b.evaluate(name=>{window.store=storage92.createPlan92RecordStorage({name,allowUpgrade:true});},name);
 const upgraded=await b.evaluate(async()=>({history:await store.readHistory(),legacy:await store.readLegacy()}));
 check(upgraded.history===null&&JSON.stringify(upgraded.legacy)===JSON.stringify(legacy),'upgrade preserves legacy and starts expanded off');
 const oldReopen=await a.evaluate(async()=>{try{await old.read();return 'unexpected'}catch(e){return e.name}});
 check(oldReopen==='VersionError','old adapter fails closed after version upgrade');
 await a.evaluate(name=>{window.store=storage92.createPlan92RecordStorage({name});},name);
 const disabled=await a.evaluate(async()=>{let reads=0;const original=IDBObjectStore.prototype.get;IDBObjectStore.prototype.get=function(key){if(this.name==='expanded'&&key==='events')reads++;return original.call(this,key)};try{return {value:await store.readHistory(),reads}}finally{IDBObjectStore.prototype.get=original}});
 check(disabled.value===null&&disabled.reads===0,'disabled access issues no event read');
 const enabled=await a.evaluate(()=>store.enable());const episode='1'.repeat(32);
 check(await a.evaluate(({epoch,episode})=>store.writeExposure(epoch,storage92.identity,episode),{epoch:enabled.epoch,episode})==='inserted','enabled exposure inserted');
 check(await b.evaluate(({epoch,episode})=>store.writeExposure(epoch,storage92.identity,episode),{epoch:enabled.epoch,episode})==='duplicate','duplicate token refused across tabs');
 await a.evaluate(async({epoch,episode})=>{await store.recordFirst(epoch,episode,'retry','unknown');await store.recordAcceptance(epoch,episode,'unassisted')},{epoch:enabled.epoch,episode});
 const history=await b.evaluate(()=>store.readHistory());
 check(history.entries.length===1&&history.entries[0].first==='retry'&&history.entries[0].accepted==='yes'&&history.entries[0].acceptedAssistance==='unknown','separate first and accepted outcomes retain unknown assistance');
 async function block(){await b.evaluate(name=>{const req=indexedDB.open(name,2);req.onsuccess=()=>{const db=req.result,tx=db.transaction(['record','expanded'],'readwrite'),s=tx.objectStore('expanded');let release=false;window.release=()=>{release=true};const loop=()=>{const r=s.get('meta');r.onsuccess=()=>{if(!release)loop()}};loop();window.held=true;tx.oncomplete=()=>{window.held=false;db.close()}}},name);await b.waitForFunction(()=>window.held)}
 for(const p of [a,b])await p.evaluate(()=>{const o=IDBDatabase.prototype.transaction;window.txCount=0;IDBDatabase.prototype.transaction=function(n,m,x){if(m==='readwrite')window.txCount++;return o.call(this,n,m,x)}});
 async function waitTx(p,old){await p.waitForFunction(n=>window.txCount>n,old)}
 await block();let ca=await a.evaluate(()=>txCount),cb=await b.evaluate(()=>txCount);
 const firstWrite=a.evaluate(({epoch})=>store.writeExposure(epoch,storage92.identity,'2'.repeat(32)),{epoch:enabled.epoch});await waitTx(a,ca);
 const firstClear=b.evaluate(()=>store.clear());await waitTx(b,cb);await b.evaluate(()=>release());
 const [w1,c1]=await Promise.all([firstWrite,firstClear]);
 check(w1==='inserted'&&c1.legacyEnabled&&c1.expandedEnabled&&(await a.evaluate(()=>store.readHistory())).entries.length===0,'write before clear is erased and both choices preserved');
 const next=await a.evaluate(()=>store.readHistory());await block();ca=await a.evaluate(()=>txCount);cb=await b.evaluate(()=>txCount);
 const secondClear=b.evaluate(()=>store.clear());await waitTx(b,cb);
 const secondWrite=a.evaluate(epoch=>store.writeExposure(epoch,storage92.identity,'3'.repeat(32)),next.meta.epoch);await waitTx(a,ca);await b.evaluate(()=>release());
 const [,w2]=await Promise.all([secondClear,secondWrite]);
 check(w2==='stale'&&(await a.evaluate(()=>store.readHistory())).entries.length===0,'clear before old write rejects stale generation');
 let installed=await a.evaluate(epoch=>store.installHistoryChoice(epoch,()=>{window.installed=true}),next.meta.epoch);
 check(installed==='stale'&&!await a.evaluate(()=>window.installed===true),'old history choice cannot install after clear');
 // Hold the shared origin lock so requests from separate tabs can be queued in
 // a witnessed order. The installed choice is a synthetic synchronous callback.
 async function holdLock(){await b.evaluate(()=>{window.lockHeld=false;window.lockBlock=navigator.locks.request('fractionflow-plan92-history',async()=>{window.lockHeld=true;await new Promise(resolve=>window.releaseLock=resolve)});});await b.waitForFunction(()=>window.lockHeld)}
 async function pending(count){await b.waitForFunction(async count=>(await navigator.locks.query()).pending.filter(x=>x.name==='fractionflow-plan92-history').length>=count,count)}
 let epoch=(await a.evaluate(()=>store.readHistory())).meta.epoch;
 await holdLock();await a.evaluate(epoch=>{window.choiceBefore=store.installHistoryChoice(epoch,()=>{window.choiceWasInstalled=true})},epoch);await pending(1);
 await b.evaluate(()=>{window.clearAfter=store.clear()});await pending(2);await b.evaluate(()=>releaseLock());
 const choiceBefore=await a.evaluate(()=>window.choiceBefore),clearAfter=await b.evaluate(()=>window.clearAfter);
 check(choiceBefore==='installed'&&clearAfter.expandedEnabled&&await a.evaluate(()=>window.choiceWasInstalled===true),'choice installed before clear is serialized ahead of clear');
 epoch=(await a.evaluate(()=>store.readHistory())).meta.epoch;
 await holdLock();await b.evaluate(()=>{window.clearBefore=store.clear()});await pending(1);
 await a.evaluate(epoch=>{window.choiceAfter=store.installHistoryChoice(epoch,()=>{window.staleChoiceInstalled=true})},epoch);await pending(2);await b.evaluate(()=>releaseLock());
 await b.evaluate(()=>window.clearBefore);const choiceAfter=await a.evaluate(()=>window.choiceAfter);
 check(choiceAfter==='stale'&&!await a.evaluate(()=>window.staleChoiceInstalled===true),'clear before queued choice prevents stale installation');
 const beforeStop=await a.evaluate(()=>store.readHistory());await b.evaluate(()=>store.stop());
 check(await a.evaluate(()=>store.readHistory())===null&&await a.evaluate(epoch=>store.writeExposure(epoch,storage92.identity,'4'.repeat(32)),beforeStop.meta.epoch)==='stale','stop disables reads and stale writes across tabs');
 const failures=await a.evaluate(async name=>{
  const makeV1=(dbName,bad)=>new Promise((resolve,reject)=>{const r=indexedDB.open(dbName,1);r.onupgradeneeded=()=>{const s=r.result.createObjectStore('record');if(bad)s.put({unexpected:'corrupt'},'root')};r.onerror=()=>reject(r.error);r.onsuccess=()=>resolve(r.result)});
  const badName=name+'-corrupt',blockedName=name+'-blocked',bad=await makeV1(badName,true);bad.close();
  const invalid=storage92.createPlan92RecordStorage({name:badName,allowUpgrade:true});let corruptRejected=false;try{await invalid.readHistory()}catch{corruptRejected=true}invalid.close();
  const holder=await makeV1(blockedName,false),blocked=storage92.createPlan92RecordStorage({name:blockedName,allowUpgrade:true});let blockedRejected=false;try{await blocked.readHistory()}catch(e){blockedRejected=/blocked/.test(e.message)}holder.close();blocked.close();
  const noLock=storage92.createPlan92RecordStorage({name,locks:null});let lockRejected=false;try{await noLock.enable()}catch(e){lockRejected=/lock unavailable/.test(e.message)}noLock.close();
  const del=n=>new Promise((resolve,reject)=>{const r=indexedDB.deleteDatabase(n);r.onsuccess=resolve;r.onerror=()=>reject(r.error)});await del(badName);await del(blockedName);
  return {corruptRejected,blockedRejected,lockRejected};
 },name);
 check(failures.corruptRejected&&failures.blockedRejected&&failures.lockRejected,'corrupt legacy blocked upgrade and missing lock fail closed');
 await a.evaluate(()=>store.close());await b.evaluate(()=>store.close());await a.evaluate(name=>new Promise((resolve,reject)=>{const r=indexedDB.deleteDatabase(name);r.onsuccess=resolve;r.onerror=()=>reject(r.error)}),name);
 await writeFile(`${dir}/storage92-browser.json`,JSON.stringify({scope:'Production isolated v2 seam, two same-origin Chrome tabs and disposable database; no app wiring or real learner data.',browser:browser.version(),results},null,2)+'\n');console.log(JSON.stringify(results));
}finally{await context?.close();await browser?.close();await server.close()}
