// Historical PRE-registration experiment: the adjacent JSON records the
// intermediate dual-persistence failure. The current registered API is tested
// by lag92-registration-browser.mjs; this old adapter call shape is retained
// for audit and is not a current-version reproducer.
import {createServer} from 'vite';import {chromium} from 'playwright';import {writeFile} from 'node:fs/promises';
const dir='reports/development/plan-92-generated-managed-practice',server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0},logLevel:'error'});let browser,context;const results={};
const check=(v,label)=>{if(!v)throw Error(label);results[label]='passed'};
try{
 await server.listen();browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});context=await browser.newContext();const [a,b]=await Promise.all([context.newPage(),context.newPage()]),base=`http://127.0.0.1:${server.httpServer.address().port}/${dir}/storage92-fixture.html`,name=`recorded92-${Date.now()}`;
 for(const p of [a,b]){await p.goto(base);await p.waitForFunction(()=>window.storage92);await p.evaluate(name=>{window.store=storage92.createPlan92RecordStorage({name,allowUpgrade:true})},name)}
 let meta=await a.evaluate(()=>store.enable());for(const n of [1,2,3,4])await a.evaluate(({epoch,n})=>store.writeExposure(epoch,storage92.identity,n.toString(16).padStart(32,'0')),{epoch:meta.epoch,n});
 let snapshot=await a.evaluate(()=>store.readLagSnapshot());check(snapshot?.entries.length===4&&snapshot.meta.coverage==='unknown'&&snapshot.lagWindow.reliable,'retained ordered snapshot does not assert all-practice coverage');
 const lag=await a.evaluate(({epoch,from,to})=>store.lagWitness(epoch,from,to),{epoch:meta.epoch,from:snapshot.entries[0].token,to:snapshot.entries[3].token});check(lag?.lag===2,'lag counts only recorded episodes strictly between endpoints');
 await b.evaluate(epoch=>store.writeExposure(epoch,storage92.identity,'5'.padStart(32,'0')),meta.epoch);
 check(await a.evaluate(s=>store.installRecordedChoice(s,()=>{}),snapshot)==='stale','Start refuses changed snapshot');
 check(await a.evaluate(s=>store.installRecordedChoice(s,()=>{},{allowNewer:true}),snapshot)==='installed','Next accepts appended records with original endpoints intact');
 await b.evaluate(({epoch,token})=>store.recordFirst(epoch,token,'retry','unknown'),{epoch:meta.epoch,token:snapshot.entries[0].token});
 check(await a.evaluate(s=>store.installRecordedChoice(s,()=>{},{allowNewer:true}),snapshot)==='stale','Next rejects changed captured outcome');
 snapshot=await a.evaluate(()=>store.readLagSnapshot());
 const failure=await a.evaluate(async({epoch,token})=>{const put=IDBObjectStore.prototype.put;IDBObjectStore.prototype.put=function(value,key){if(this.name==='expanded'&&key==='events'){IDBObjectStore.prototype.put=put;throw new DOMException('synthetic outcome write failure','QuotaExceededError')}return put.call(this,value,key)};try{await store.recordAcceptance(epoch,token,'unknown');return false}catch{return true}finally{IDBObjectStore.prototype.put=put}},{epoch:meta.epoch,token:snapshot.entries[0].token});
 check(failure&&await b.evaluate(()=>store.readLagSnapshot())===null,'failed outcome write fences lag in another tab');
 await b.evaluate(()=>store.close());await b.evaluate(name=>{window.store=storage92.createPlan92RecordStorage({name})},name);check(await b.evaluate(()=>store.readLagSnapshot())===null,'committed failure fence survives reopen');
 await a.evaluate(()=>store.clear());meta=await a.evaluate(()=>store.readMeta());for(const n of [10,11,12])await a.evaluate(({epoch,n})=>store.writeExposure(epoch,storage92.identity,n.toString(16).padStart(32,'0')),{epoch:meta.epoch,n});
 snapshot=await a.evaluate(()=>store.readLagSnapshot());check(snapshot?.entries.length===3&&snapshot.meta.epoch===meta.epoch,'Clear retires old fence and permits a fresh enabled generation');
 await a.evaluate(()=>store.stop());await a.evaluate(()=>store.enable());check((await a.evaluate(()=>store.readLagSnapshot()))?.entries?.length===0,'Stop and re-enable exclude old-generation endpoints');
 check(await b.evaluate(s=>store.installRecordedChoice(s,()=>{}),snapshot)==='stale','generation change refuses old recorded choice');
 // Demonstrate, rather than conceal, the residual dual-storage failure case.
 const dual=await a.evaluate(async name=>{const dbName=name+'-dual',s=storage92.createPlan92RecordStorage({name:dbName,allowUpgrade:true}),m=await s.enable();for(const n of [1,2])await s.writeExposure(m.epoch,storage92.identity,n.toString(16).padStart(32,'0'));
  const put=IDBObjectStore.prototype.put,set=Storage.prototype.setItem;IDBObjectStore.prototype.put=function(value,key){if(this.name==='expanded'&&key==='intent')throw new DOMException('synthetic marker failure','QuotaExceededError');return put.call(this,value,key)};Storage.prototype.setItem=function(key,value){if(key.includes('fractionflow-plan92-ordering-taint-v1'))throw new DOMException('synthetic taint failure','QuotaExceededError');return set.call(this,key,value)};
  let rejected=false;try{await s.writeExposure(m.epoch,storage92.identity,'3'.padStart(32,'0'))}catch{rejected=true}finally{IDBObjectStore.prototype.put=put;Storage.prototype.setItem=set}
  const liveSuppressed=(await s.readLagSnapshot())===null;s.close();const reopened=storage92.createPlan92RecordStorage({name:dbName});const afterReopen=await reopened.readLagSnapshot();await reopened.clear();reopened.close();await new Promise((resolve,reject)=>{const r=indexedDB.deleteDatabase(dbName);r.onsuccess=resolve;r.onerror=()=>reject(r.error)});return {rejected,liveSuppressed,reopenedCouldNotDetectFailure:!!afterReopen};},name);
 check(dual.rejected&&dual.liveSuppressed,'simultaneous marker failures suppress lag in the reporting tab');
 results['dual persistent failure after all tabs close']=dual.reopenedCouldNotDetectFailure?'UNFENCED: owner disposition required':'suppressed';
 await a.evaluate(()=>store.close());await b.evaluate(()=>store.close());await a.evaluate(name=>new Promise((resolve,reject)=>{const r=indexedDB.deleteDatabase(name);r.onsuccess=resolve;r.onerror=()=>reject(r.error)}),name);
 await writeFile(`${dir}/recorded92-storage-browser.json`,JSON.stringify({scope:'Real isolated v2 adapter and two Chrome tabs, disposable database; synthetic IndexedDB outcome-write failure.',browser:browser.version(),results},null,2)+'\n');console.log(JSON.stringify(results));
}finally{await context?.close();await browser?.close();await server.close()}
