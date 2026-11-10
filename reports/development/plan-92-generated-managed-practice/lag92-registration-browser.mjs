// Browser-level integration driver for the isolated Plan 92 recorder lease.
// Positive exposure events are produced only by mounted Start/response/Next
// interactions. Only the fault-recovery case injects storage failures.
import {createServer} from 'vite';
import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {PLAN40_SUBTRACTION_RECIPE_RECORDS} from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import {createFraction,convertToDenominator,equalFractions,subtractAtCommonDenominator} from '../../../src/math/index.js';
import {allGate92Descriptors} from '../../../src/app/plan92-catalog.js';

const dir='reports/development/plan-92-generated-managed-practice';
const outputPath=`${dir}/lag92-registration-browser.json`;
const server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0},logLevel:'error'});
const recipes=new Map(PLAN40_SUBTRACTION_RECIPE_RECORDS.map(x=>[x.itemId,x]));
const result={executionStatus:'not-started',scope:'isolated mounted preview, disposable same-origin browser databases',apiPreflight:null,checks:{},phases:{},failures:[],limitations:[]};
let browser,context;
const check=(value,message)=>{if(!value)throw new Error(message);result.checks[message]='passed'};
const fraction=f=>createFraction(BigInt(f.numerator),BigInt(f.denominator));

async function openPage(name,seed=0){
 const page=await context.newPage();page.on('dialog',dialog=>dialog.accept());
 const url=`http://127.0.0.1:${server.httpServer.address().port}/${dir}/owner92-preview.html?seed=${seed}&name=${encodeURIComponent(name)}`;
 await page.goto(url);await page.waitForFunction(()=>Boolean(window.owner92));
 page.on('pageerror',error=>result.failures.push({name,message:String(error?.stack||error)}));
 return page;
}
async function pageEval(page,fn,...args){return page.evaluate(fn,...args)}
async function requireLeaseApi(page){
 const readiness=await pageEval(page,async()=>({
  release:typeof owner92.releaseRecorder==='function',
  recorderState:typeof owner92.recorderState==='function',
  inspect:typeof owner92.bridge.inspectHistory==='function',
  history:typeof owner92.readRecordedHistory==='function',
  lagSnapshot:typeof owner92.readRecordedLagSnapshot==='function',
  state:typeof owner92.recorderState==='function'?await owner92.recorderState():null,
 }));
 result.apiPreflight=readiness;
 check(readiness.release&&readiness.recorderState&&readiness.inspect&&readiness.history&&readiness.lagSnapshot,
  'Lease API exposes releaseRecorder, recorderState, retained history inspection, and current-owner reads');
 return readiness;
}
async function recorderState(page){return pageEval(page,()=>owner92.recorderState())}
function stateParts(value){
 if(typeof value==='string')return {status:value,epoch:null,active:['active','writer','owned'].includes(value)};
 const status=value?.status??value?.state??value?.writerRegistration?.state??null;
 const epoch=value?.epoch??value?.writerRegistration?.epoch??null;
 return {status,epoch,active:value?.active===true||value?.isWriter===true||['active','writer','owned'].includes(status)};
}
async function inspect(page){await pageEval(page,()=>owner92.observer.settled());return pageEval(page,()=>owner92.bridge.inspectHistory())}
async function ownerHistory(page){return pageEval(page,()=>owner92.readRecordedHistory())}
async function lagSnapshot(page){return pageEval(page,()=>owner92.readRecordedLagSnapshot())}
async function metadata(page){return pageEval(page,()=>owner92.bridge.readExpandedMeta())}
async function optIn(page){
 await page.getByRole('button',{name:'Remember practice on this browser'}).click();
 await page.waitForFunction(async()=>Boolean((await owner92.bridge.readExpandedMeta())?.enabled));
}
async function start(page){
 await page.locator('[data-session-entry="comparison"]').click();
 await page.waitForFunction(()=>Boolean(owner92.app.getManagedSessionWitness()?.shapeId));
 await pageEval(page,()=>owner92.observer.settled());
 return pageEval(page,()=>owner92.app.getManagedSessionWitness());
}
async function drainAndRelease(page){return pageEval(page,()=>owner92.releaseRecorder())}

async function solveCurrent(page,id){
 const host=page.locator('.app-visual-view:not([hidden])');
 if(id.startsWith('plan45-')){
  const answer=id==='plan45-compare-10'?'<':'>';
  await host.locator(`.plan45-relation-option input[value="${answer}"]`).check();
  await host.locator('.plan45-check-button').click();
  await host.locator('.plan45-progression-button').click();
  return;
 }
 const rec=recipes.get(id);check(Boolean(rec),`Fault recovery solver has a mounted recipe for ${id}`);
 await host.locator('.active-beat-controls button').first().click();
 if(rec.recipeId.endsWith('identify-side-construct'))await host.locator('.nested-side-choice').nth(rec.requiredSide==='left'?0:1).click();
 const target=BigInt(rec.targetDenominator),forms=Object.fromEntries(['left','right'].map(side=>[side,convertToDenominator(fraction(rec.sourceForms[side]),target)]));
 for(const side of rec.recipeId.endsWith('identify-side-construct')?[rec.requiredSide]:['left','right']){
  if(rec.recipeId.endsWith('inspect-keep-repair')){
   const offered=rec.candidates[side];
   if(equalFractions(fraction(offered),forms[side])){await host.locator(`.active-beat-controls button[aria-label="Keep new fraction ${offered.numerator} over ${offered.denominator}"]`).click();continue;}
   await host.locator('.inspect-change-button').click();
  }
  await host.locator(`#transform-num-input-${side}`).fill(String(forms[side].numerator));
  await host.locator('.active-beat-controls .control-submit-btn').click();
 }
 const ans=subtractAtCommonDenominator(fraction(rec.sourceForms.left),fraction(rec.sourceForms.right),target);
 await host.locator('#operate-fraction-numerator-input').fill(String(ans.numerator));
 await host.locator('#operate-fraction-denominator-input').fill(String(ans.denominator));
 await host.locator('.active-beat-controls .control-submit-btn').click();
 await host.locator('.active-beat-controls button').first().click();
}
async function cleanupDb(page,name){
 try{await pageEval(page,()=>{owner92.app.destroy();owner92.panel.destroy();owner92.bridge.close()})}catch{}
 try{await pageEval(page,n=>new Promise(resolve=>{const request=indexedDB.deleteDatabase(n);request.onsuccess=resolve;request.onerror=resolve;request.onblocked=resolve}),name)}catch{}
}
async function phaseDb(prefix){return `lag92-${prefix}-${Date.now()}-${Math.random().toString(16).slice(2,8)}`}
const token=()=>randomBytes(16).toString('hex');
async function createLegacyV2Fixture(page,name){
 const descriptor=allGate92Descriptors().find(d=>d.role==='C');
 const epoch=token(),eventToken=token(),entry={token:eventToken,ordinal:1,identity:descriptor.identity,role:descriptor.role,demand:JSON.stringify(descriptor.decision),first:'accepted',accepted:'yes',firstAssistance:'unassisted',acceptedAssistance:'unassisted'};
 await pageEval(page,({name,epoch,entry})=>new Promise((resolve,reject)=>{
  const request=indexedDB.open(name,2);
  request.onupgradeneeded=()=>{const db=request.result;if(!db.objectStoreNames.contains('record'))db.createObjectStore('record');if(!db.objectStoreNames.contains('expanded'))db.createObjectStore('expanded')};
  request.onerror=()=>reject(request.error);
  request.onsuccess=()=>{const db=request.result,tx=db.transaction(['expanded'],'readwrite'),store=tx.objectStore('expanded');
   store.put({schema:1,epoch,enabled:true,nextOrdinal:2,earliestOrdinal:1,coverage:'unknown',ordering:'continuous',revision:0},'meta');
   store.put([entry],'events');tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error('fixture transaction aborted'));
  };
 }),{name,epoch,entry});
 return {epoch,entry};
}

try{
 await server.listen();browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});context=await browser.newContext({viewport:{width:1093,height:614}});

 // Fail closed before any consent or writes if the integrated preview has not
 // exposed the recorder ownership contract.
 const probeName=await phaseDb('probe'),probe=await openPage(probeName);await requireLeaseApi(probe);await cleanupDb(probe,probeName);await probe.close();
 result.executionStatus='running';

 // Two-tab contention and second-tab controls. Tab two may practice without
 // recording, and its visible Stop and Clear actions remain available.
 {
  const name=await phaseDb('contention'),first=await openPage(name),second=await openPage(name,2);
  await requireLeaseApi(first);await requireLeaseApi(second);await optIn(first);
  const firstWitness=await start(first),firstState=stateParts(await recorderState(first)),firstHistory=await inspect(first);
  check(firstState.active&&firstState.epoch===(await metadata(first)).epoch,'First tab owns the opted-in recorder epoch');
  check(firstHistory.entries.length>=1&&firstHistory.entries.some(e=>e.identity.itemId===firstWitness.selected[0].identity.itemId),'First mounted Start created a real observer exposure');
  const baseline=firstHistory.entries.map(e=>({token:e.token,ordinal:e.ordinal,epoch:e.epoch}));
  const secondBefore=stateParts(await recorderState(second));
  const secondWitness=await start(second);const secondHistory=await inspect(second);const secondAfter=stateParts(await recorderState(second));
  check(!secondBefore.active&&!secondAfter.active,'Second tab cannot acquire the active recorder lease');
  check(secondWitness?.shapeId&&secondHistory.entries.length===baseline.length&&secondHistory.entries.every((e,i)=>e.token===baseline[i].token&&e.ordinal===baseline[i].ordinal),'Second tab Start uses no-history selection and writes no expanded exposure');
  await second.locator('#expanded-record').getByRole('button',{name:'Stop remembering'}).click();
  await second.waitForFunction(async()=>!(await owner92.bridge.readExpandedMeta())?.enabled);
  check(!(await metadata(first)).enabled,'Second tab can Stop remembering while another tab holds the former lease');
  await second.getByRole('button',{name:'Clear both practice records'}).click();
  await second.waitForFunction(async()=>{const x=await owner92.bridge.inspectHistory();return x.entries.length===0});
  check((await inspect(first)).entries.length===0,'Second tab can Clear both retained records');
  result.phases.contention={firstRecorder:firstState,firstExposureCount:baseline.length,secondRecorderBefore:secondBefore,secondRecorderAfter:secondAfter,secondStartWitness:secondWitness.shapeId,stop:'passed',clear:'passed'};
  await drainAndRelease(first);await drainAndRelease(second);
  await first.close();await second.close();
 }

 // A clean explicit release keeps the epoch and every stored event on reopen.
 {
  const name=await phaseDb('clean'),first=await openPage(name);await requireLeaseApi(first);await optIn(first);
  await start(first);const history=await inspect(first),ownedHistory=await ownerHistory(first),meta=await metadata(first),state=stateParts(await recorderState(first));
  check(state.active&&history.entries.length>0&&ownedHistory?.entries?.length===history.entries.length,'Clean-release case has an active writer and a real exposure');
  const release=await drainAndRelease(first),afterRelease=stateParts(await recorderState(first));
  const releasedHistory=await inspect(first);
  check(['released','clean'].includes(typeof release==='string'?release:release?.status??release?.result),'releaseRecorder drains and records a clean release');
  check(releasedHistory.meta.epoch===meta.epoch&&releasedHistory.entries.length===history.entries.length,'Clean release preserves epoch and events');
  await first.close();
  const reopened=await openPage(name);await requireLeaseApi(reopened);
  await start(reopened);
  const reopenedState=stateParts(await recorderState(reopened)),reopenedHistory=await inspect(reopened),snapshot=await lagSnapshot(reopened);
  check(reopenedState.active&&reopenedState.epoch===meta.epoch,'Clean reopen reclaims the same epoch');
  check(history.entries.every(old=>reopenedHistory.entries.some(e=>e.token===old.token&&e.ordinal===old.ordinal&&e.epoch===old.epoch)),'Clean reopen preserves exact prior events');
  check(snapshot?.meta?.epoch===meta.epoch&&snapshot.entries.every(e=>e.epoch===meta.epoch),'Clean reopen retains lag endpoints in the same epoch');
  result.phases.cleanRelease={epoch:meta.epoch,release,afterRelease:afterRelease.status,events:history.entries.map(e=>({token:e.token,ordinal:e.ordinal,epoch:e.epoch})),reopenedState,snapshot:snapshot?.lagWindow};
  await drainAndRelease(reopened);await reopened.close();
 }

 // Closing a live owner without release is treated as recovery: retain old
 // event rows, rotate the epoch, and expose no endpoint from the old epoch.
 {
  const name=await phaseDb('abrupt'),first=await openPage(name);await requireLeaseApi(first);await optIn(first);await start(first);
  const prior=await inspect(first),priorEpoch=prior.meta.epoch,oldTokens=prior.entries.map(e=>e.token);
  check(oldTokens.length>0,'Abrupt-recovery case has real prior exposure rows');
  await first.close({runBeforeUnload:false});
  const reopened=await openPage(name);await requireLeaseApi(reopened);
  const lagBeforeStart=await lagSnapshot(reopened);
  const newWitness=await start(reopened);
  const freshState=stateParts(await recorderState(reopened)),retained=await inspect(reopened),emptyLag=lagBeforeStart;
  check(freshState.active&&freshState.epoch&&freshState.epoch!==priorEpoch,'Abrupt reopen rotates to a fresh active epoch');
  check(oldTokens.every(t=>retained.entries.some(e=>e.token===t)),'Abrupt recovery retains every old row');
  check(!emptyLag||emptyLag.entries.every(e=>e.epoch===freshState.epoch&& !oldTokens.includes(e.token)),'Abrupt recovery exposes no old event as a lag endpoint');
  const afterStart=await inspect(reopened),freshLag=await lagSnapshot(reopened);
  check(afterStart.entries.some(e=>e.epoch===freshState.epoch&&e.identity.itemId===newWitness.selected[0].identity.itemId),'Fresh epoch receives a real mounted exposure');
  check(freshLag?.entries?.length>0&&freshLag.entries.every(e=>e.epoch===freshState.epoch&&!oldTokens.includes(e.token)),'Fresh lag snapshot contains only new-epoch endpoints');
  result.phases.abruptRecovery={priorEpoch,freshEpoch:freshState.epoch,oldRowsRetained:oldTokens.length,lagBeforeStart:emptyLag?.lagWindow??null,lagAfterStart:freshLag.lagWindow};
  await drainAndRelease(reopened);await reopened.close();
 }

 // Dual marker/localStorage failure is deliberately injected only in this
 // negative recovery phase; all exposure creation still uses mounted UI.
 {
  const name=await phaseDb('dual-failure'),first=await openPage(name);await requireLeaseApi(first);await optIn(first);
  const witness=await start(first),before=await inspect(first),oldEpoch=before.meta.epoch;
  check(before.entries.length>0,'Dual-failure case has a real stored exposure before injection');
  const currentId=await pageEval(first,()=>owner92.app.getState()?.taskContext?.itemId);
  await pageEval(first,()=>{
   window.__lag92Faults={marker:0,localStorage:0};
   const put=IDBObjectStore.prototype.put;
   IDBObjectStore.prototype.put=function(value,key){if(this.name==='expanded'&&key==='intent'){window.__lag92Faults.marker++;throw new DOMException('injected recorder marker failure','UnknownError')}return put.call(this,value,key)};
   const set=Storage.prototype.setItem;
   Storage.prototype.setItem=function(key,value){if(String(key).startsWith('fractionflow-plan92-ordering-taint-v1:')){window.__lag92Faults.localStorage++;throw new DOMException('injected localStorage taint failure','QuotaExceededError')}return set.call(this,key,value)};
  });
  await solveCurrent(first,currentId);await pageEval(first,()=>owner92.observer.settled());
  const failures=await pageEval(first,()=>window.__lag92Faults),taintedLag=await lagSnapshot(first);
  check(failures.marker>0&&failures.localStorage>0,'Both marker and localStorage failure paths were injected during a real episode transition');
  result.phases.dualFailureBeforeRecovery={oldEpoch,injected:failures,lagResponse:taintedLag};
  check(!taintedLag?.lagWindow?.reliable,'Dual failure suppresses reliable lag endpoints before abrupt close');
  await first.close({runBeforeUnload:false});
  const reopened=await openPage(name);await requireLeaseApi(reopened);
  const preStartLag=await lagSnapshot(reopened),nextWitness=await start(reopened);
  const recovered=stateParts(await recorderState(reopened)),retained=await inspect(reopened),lag=preStartLag;
  check(recovered.active&&recovered.epoch!==oldEpoch,'Dual failure and abrupt close force a fresh epoch');
  check(before.entries.every(e=>retained.entries.some(x=>x.token===e.token)),'Dual-failure recovery retains pre-failure rows');
  check(!lag||lag.entries.every(e=>e.epoch===recovered.epoch&&!before.entries.some(old=>old.token===e.token)),'Dual-failure recovery excludes old rows from lag endpoints');
  const afterStart=await inspect(reopened),fresh=await lagSnapshot(reopened);
  check(afterStart.entries.some(e=>e.epoch===recovered.epoch&&e.identity.itemId===nextWitness.selected[0].identity.itemId),'Recovered writer records a real new-epoch exposure');
  check(fresh?.entries?.every(e=>e.epoch===recovered.epoch&&!before.entries.some(old=>old.token===e.token)),'Recovered lag snapshot contains no pre-failure endpoints');
  result.phases.dualFailure={oldEpoch,freshEpoch:recovered.epoch,injected:failures,preCloseLagSuppressed:true,retainedOldRows:before.entries.length,postRecoveryLag:fresh.lagWindow};
  await drainAndRelease(reopened);await reopened.close();
 }

 // A version 1 legacy comparison record remains usable and is preserved when
 // explicit expanded consent upgrades the disposable database to v2.
 {
  const name=await phaseDb('legacy-upgrade'),page=await openPage(name);await requireLeaseApi(page);
  await page.locator('.comparison-record-panel summary').click();
  await page.locator('[data-record-control="toggle"]').click();
  await page.waitForFunction(async()=>(await owner92.bridge.read())?.enabled===true);
  const legacyStart=await start(page),comparisonId=legacyStart.selected.find(x=>x.role==='C')?.identity.itemId;
  check(Boolean(comparisonId),'Legacy-upgrade case installs a real comparison episode');
  await solveCurrent(page,comparisonId);
  await page.waitForFunction(async()=>(await owner92.bridge.read())?.entries?.length>0);
  const beforeUpgrade=await pageEval(page,()=>owner92.bridge.read());
  await page.getByRole('button',{name:'Remember practice on this browser'}).click();
  await page.waitForFunction(async()=>(await owner92.bridge.readExpandedMeta())?.enabled===true);
  const afterUpgrade=await pageEval(page,()=>owner92.bridge.read()),version=await pageEval(page,()=>owner92.bridge.version());
  check(version===2&&afterUpgrade.enabled===true&&afterUpgrade.entries.length===beforeUpgrade.entries.length&&afterUpgrade.entries.every((e,i)=>e.token===beforeUpgrade.entries[i].token),'Explicit v1-to-v2 upgrade preserves the legacy record and enabled choice');
  await page.locator('.app-return-button').click();await page.getByRole('dialog').getByRole('button',{name:'Leave'}).click();
  const expandedWitness=await start(page),expandedState=stateParts(await recorderState(page)),expandedEvents=await inspect(page);
  check(expandedState.active&&expandedEvents.entries.some(e=>e.identity.itemId===expandedWitness.selected[0].identity.itemId),'Upgraded legacy database supports a real registered expanded exposure');
  result.phases.legacyUpgrade={version,legacyEnabled:afterUpgrade.enabled,legacyEntries:afterUpgrade.entries.map(e=>({itemId:e.identity.itemId,sequence:e.sequence,token:e.token})),expandedEpoch:expandedState.epoch,expandedEvents:expandedEvents.entries.length};
  await drainAndRelease(page);await page.close();
 }

 // An older v2 meta shape without registration fields remains inspectable but
 // cannot claim a writer or create new recorded exposures.
 {
  const name=await phaseDb('old-v2-schema'),page=await openPage(name);await pageEval(page,()=>owner92.bridge.close());const fixture=await createLegacyV2Fixture(page,name);
  await requireLeaseApi(page);
  const before=await inspect(page),metaBefore=await metadata(page);
  check(metaBefore.registrationSchema===undefined&&before.entries.length===1&&before.entries[0].token===fixture.entry.token,'Pre-registration v2 rows remain readable and inspectable');
  const witness=await start(page),state=stateParts(await recorderState(page)),after=await inspect(page),metaAfter=await metadata(page);
  check(Boolean(witness?.shapeId)&&!state.active&&await pageEval(page,()=>owner92.readRecordedHistory())===null,'Pre-registration v2 metadata fails closed for writer ownership');
  check(metaAfter.epoch===fixture.epoch&&metaAfter.nextOrdinal===metaBefore.nextOrdinal&&after.entries.length===1&&after.entries[0].token===fixture.entry.token,'Old v2 schema neither rotates nor appends through an unregistered preview');
  check(await lagSnapshot(page)===null,'Old v2 schema creates no current-owner lag snapshot');
  result.phases.oldV2Schema={schema:metaBefore.registrationSchema??'absent',epoch:metaBefore.epoch,retainedToken:fixture.entry.token,writerActive:state.active,entriesAfterStart:after.entries.length,nextOrdinal:metaAfter.nextOrdinal};
  await drainAndRelease(page);await cleanupDb(page,name);await page.close();
 }
 result.executionStatus='passed';
}catch(error){
 result.executionStatus=result.executionStatus==='not-started'?'held':'failed';
 result.limitations.push(String(error?.stack||error));
}finally{
 await writeFile(outputPath,JSON.stringify(result,null,2)+'\n');
 await context?.close();await browser?.close();await server.close();
}

if(result.executionStatus==='held'||result.executionStatus==='failed')process.exitCode=1;
