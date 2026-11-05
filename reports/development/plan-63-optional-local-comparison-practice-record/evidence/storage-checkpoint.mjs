import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({server:{host:'127.0.0.1',port:5197,strictPort:true},logLevel:'silent'});
await server.listen();
const browser = await chromium.launch({channel:'chrome',headless:true});
const context = await browser.newContext();
const a = await context.newPage(), b = await context.newPage();
try {
  await Promise.all([a.goto('http://127.0.0.1:5197/FractionFlow/'),b.goto('http://127.0.0.1:5197/FractionFlow/')]);
  for (const p of [a,b]) await p.evaluate(async () => {
    const m=await import('/FractionFlow/src/app/comparison-record-storage.js');
    const c=await import('/FractionFlow/src/app/comparison-record.js');
    const task=await import('/FractionFlow/src/interaction/plan49-comparison-construction.js');
    window.db=m.createComparisonRecordStorage({name:'plan63-checkpoint-isolated'});
    window.id=c.identityFromContext(task.resolvePlan49Context('plan45-compare-02'));
    window.obs=(n,kind='first-retry')=>({kind,token:n.toString(16).padStart(32,'0'),identity:window.id,support:'high',assistance:{model:'no',help:'no',construction:'no'}});
  });
  const root=await a.evaluate(()=>db.enable());
  const duplicate=await Promise.all([a.evaluate(g=>db.record(g,obs(1)),root.generation),b.evaluate(g=>db.record(g,obs(1)),root.generation)]);
  assert.deepEqual(duplicate.sort(),['duplicate','inserted']);
  assert.equal((await b.evaluate(()=>db.read())).entries.length,1);
  await a.evaluate(g=>db.record(g,obs(1,'acceptance')),root.generation);
  assert.equal((await b.evaluate(()=>db.read())).entries[0].outcome,'accepted');
  await b.evaluate(()=>db.clear());
  assert.equal(await a.evaluate(g=>db.record(g,obs(2)),root.generation),'stale');
  assert.equal((await a.evaluate(()=>db.read())).entries.length,0);
  const r2=await a.evaluate(()=>db.read());
  await a.evaluate(g=>db.record(g,obs(3)),r2.generation);
  await b.evaluate(()=>db.stop());
  assert.equal(await a.evaluate(g=>db.record(g,obs(4)),r2.generation),'stale');
  const stopped=await a.evaluate(()=>db.read());
  assert.equal(stopped.enabled,false); assert.equal(stopped.entries.length,1);
  // Queue a delayed transaction behind a held real IDB write transaction.
  const fresh=await a.evaluate(()=>db.enable());
  await a.evaluate(async () => {
    const open=indexedDB.open('plan63-checkpoint-isolated',1);
    const connection=await new Promise((resolve,reject)=>{open.onsuccess=()=>resolve(open.result);open.onerror=()=>reject(open.error);});
    window.holdConnection=connection; window.hold=true;
    const tx=connection.transaction('record','readwrite'), store=tx.objectStore('record');
    window.holdDone=new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error);});
    const spin=()=>{if(window.hold){const q=store.get('root');q.onsuccess=spin;}}; spin();
  });
  const pendingRetry=a.evaluate(g=>db.record(g,obs(5)),fresh.generation);
  const pendingAccept=b.evaluate(g=>db.record(g,obs(5,'acceptance')),fresh.generation);
  await new Promise(r=>setTimeout(r,100));
  await a.evaluate(()=>{window.hold=false;});
  await a.evaluate(async()=>{await window.holdDone;window.holdConnection.close();});
  assert.equal(await pendingRetry,'inserted'); assert.equal(await pendingAccept,'updated');
  assert.equal((await a.evaluate(()=>db.read())).entries.at(-1).outcome,'accepted');
  // Clear queued ahead of a stale writer while a real write transaction is held.
  const raceRoot=await a.evaluate(()=>db.read());
  await a.evaluate(async () => {
    const request=indexedDB.open('plan63-checkpoint-isolated',1);
    const connection=await new Promise((resolve,reject)=>{request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});
    window.holdConnection=connection;window.hold=true;
    const tx=connection.transaction('record','readwrite'),store=tx.objectStore('record');
    window.holdDone=new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error);});
    const spin=()=>{if(window.hold){const q=store.get('root');q.onsuccess=spin;}};spin();
  });
  const pendingClear=a.evaluate(()=>db.clear());
  await new Promise(r=>setTimeout(r,50));
  const staleWrite=b.evaluate(g=>db.record(g,obs(6)),raceRoot.generation);
  await new Promise(r=>setTimeout(r,50));
  await a.evaluate(()=>{window.hold=false;});
  await a.evaluate(async()=>{await window.holdDone;window.holdConnection.close();});
  await pendingClear; assert.equal(await staleWrite,'stale');
  assert.equal((await a.evaluate(()=>db.read())).entries.length,0);
  // Corrupt roots must not be silently overwritten, including on enable.
  await a.evaluate(async()=>{const req=indexedDB.open('plan63-checkpoint-isolated',1);const raw=await new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});await new Promise((resolve,reject)=>{const tx=raw.transaction('record','readwrite');tx.objectStore('record').put({bad:'synthetic'},'root');tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error);});raw.close();});
  assert.equal(await a.evaluate(async()=>{try{await db.enable();return false;}catch{return true;}}),true);
  await Promise.all([a.evaluate(()=>db.close()),b.evaluate(()=>db.close())]);
  const reset=await a.evaluate(()=>db.reset()); assert.equal(reset.enabled,false); assert.equal(reset.entries.length,0);
  assert.equal((await b.evaluate(()=>db.read())).entries.length,0);
  await Promise.all([a.evaluate(()=>db.close()),b.evaluate(()=>db.close())]);
  console.log(JSON.stringify({browser:browser.version(),origin:'isolated localhost:5197',duplicate,clear:'old generation rejected; zero entries',stop:'old generation rejected; prior entry retained',retryThenAccepted:'same entry updated',note:'synthetic direct adapter probe; no mounted episode or learner evidence'}));
  await Promise.all([a.evaluate(()=>db.close()),b.evaluate(()=>db.close())]);
} finally { await context.close(); await browser.close(); await server.close(); }
