// Ordinary-route, isolated browser investigation for Plan 92 recorded lag.
// Positive events are read only after real app controls cause observer writes.
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';

const dir='reports/development/plan-92-generated-managed-practice';
const database='fractionflow-comparison-record-v1';
const seeds=[0,2,4,3];
const {allGate92Descriptors}=await import('../../../src/app/plan92-catalog.js');
const {rankPlan92HistoryCandidates}=await import('../../../src/app/plan92-history-policy.js');
const {selectPlan92Sync}=await import('../../../src/app/plan92-managed-selector.js');
const server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0},logLevel:'error'});
let browser,context,page;
const result={scope:'ordinary production route /, isolated disposable Playwright BrowserContext, visible controls only; synthetic browser evidence, not learner evidence',database,seedControl:'test-only Crypto.getRandomValues shim for Uint32Array(1); secure token requests are untouched',visits:[],actualObserverEvents:[],baselineComparisons:[],limitations:[],pageErrors:[]};
const panel=p=>p.locator('.plan92-record-panel');
const appItem=p=>p.locator('.app-episode').getAttribute('data-current-item-id');
async function seedPage(seed,ctx=context){
 const p=await ctx.newPage();p.setDefaultTimeout(9000);p.setDefaultNavigationTimeout(30000);p.on('pageerror',e=>result.pageErrors.push(String(e?.stack||e)));
 await p.addInitScript(()=>{const native=crypto.getRandomValues.bind(crypto);window.__ff92TestSeedQueue=[];window.__ff92ConsumedSeeds=[];crypto.getRandomValues=function(array){if(array instanceof Uint32Array&&array.length===1&&window.__ff92TestSeedQueue.length){const seed=window.__ff92TestSeedQueue.shift();array[0]=seed;window.__ff92ConsumedSeeds.push(seed);return array}return native(array)}});
 await p.goto(`http://127.0.0.1:${server.httpServer.address().port}/`,{waitUntil:'domcontentloaded'});
 await p.locator('[data-session-entry="comparison"]').waitFor();return p;
}
async function readEvents(p){return p.evaluate(async name=>{
 const db=await new Promise((resolve,reject)=>{const r=indexedDB.open(name);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
 try {if(db.version!==2||!db.objectStoreNames.contains('expanded'))return null;return await new Promise((resolve,reject)=>{const tx=db.transaction('expanded','readonly'),s=tx.objectStore('expanded'),a=s.get('meta'),b=s.get('events'),c=s.get('intent');tx.oncomplete=()=>resolve({meta:a.result??null,entries:b.result??[],intent:c.result===true});tx.onerror=()=>reject(tx.error)})} finally {db.close()}
 },database)}
function snapshotFrom(readback){
 const m=readback?.meta,e=readback?.entries??[];if(!m||readback.intent||m.enabled!==true||m.ordering!=='continuous'||!e.length||e.length>100)return null;
 if(e.some((x,i)=>x.epoch!==m.epoch||x.ordinal!==(e[0].ordinal+i)||!(/^[0-9a-f]{32}$/.test(x.token))))return null;
 const first=e[0],last=e.at(-1);if(last.ordinal!==m.nextOrdinal-1||m.revision<1)return null;
 return {meta:{...m},entries:e,lagWindow:{epoch:m.epoch,revision:m.revision,earliestOrdinal:first.ordinal,latestOrdinal:last.ordinal,earliestToken:first.token,latestToken:last.token,retainedCount:e.length,ordering:'continuous',reliable:true}};
}
function offlineRanking(seed,readback){
 const recordedSnapshot=snapshotFrom(readback);if(!recordedSnapshot)return {reliable:false};
 const selection=selectPlan92Sync({catalogRevision:'ff92-catalog@1',policyRevision:'ff92-policy@1',compatibilityRevision:'ff92-compat@1',demandsRevision:'ff92-demands@1',seed,candidates:allGate92Descriptors().map(d=>({...d,fit:true}))});
 const byId={};for(const role of ['C','I','S','T'])for(const row of rankPlan92HistoryCandidates({candidates:allGate92Descriptors().filter(d=>d.role===role),events:readback.entries,coverage:readback.meta.coverage,recordedSnapshot,reviewOpportunity:selection.witness.reviewOpportunity}))byId[row.candidate.identity.itemId]=row;
 return {reliable:true,reviewOpportunity:selection.witness.reviewOpportunity,byId,snapshot:{earliestOrdinal:recordedSnapshot.lagWindow.earliestOrdinal,latestOrdinal:recordedSnapshot.lagWindow.latestOrdinal,retainedCount:recordedSnapshot.lagWindow.retainedCount}};
}
// Solver adapted from lag92-recorded-episodes.mjs. It uses only learner-facing
// mounted controls; all records it answers are source records in the content set.
async function solveMounted(p,id){
 const host=p.locator('.app-visual-view:not([hidden])');
 if(id.startsWith('plan45-')){const answer=id==='plan45-compare-10'?'<':'>';if(id==='plan45-compare-02'&&p.__forceWrong){await host.locator(`.plan45-relation-option input[value="${answer==='<'?'>':'<'}"]`).check();await host.locator('.plan45-check-button').click()}await host.locator(`.plan45-relation-option input[value="${answer}"]`).check();await host.locator('.plan45-check-button').click();await host.locator('.plan45-progression-button').click();return}
 const {PLAN40_SUBTRACTION_RECIPE_RECORDS}=await import('../../../src/content/data/plan40-reusable-subtraction-recipes-records.js');
 const {createFraction,convertToDenominator,equalFractions,subtractAtCommonDenominator}=await import('../../../src/math/index.js');
 const record=PLAN40_SUBTRACTION_RECIPE_RECORDS.find(x=>x.itemId===id);assert.ok(record,`No ordinary-route solver record for ${id}`);
 const f=x=>createFraction(BigInt(x.numerator),BigInt(x.denominator));
 await host.locator('.active-beat-controls button').first().click();
 if(record.recipeId.endsWith('identify-side-construct'))await host.locator('.nested-side-choice').nth(record.requiredSide==='left'?0:1).click();
 const target=BigInt(record.targetDenominator),forms=Object.fromEntries(['left','right'].map(side=>[side,convertToDenominator(f(record.sourceForms[side]),target)]));
 for(const side of record.recipeId.endsWith('identify-side-construct')?[record.requiredSide]:['left','right']){
  if(record.recipeId.endsWith('inspect-keep-repair')){const offered=record.candidates[side];if(equalFractions(f(offered),forms[side])){await host.locator(`.active-beat-controls button[aria-label="Keep new fraction ${offered.numerator} over ${offered.denominator}"]`).click();continue}await host.locator('.inspect-change-button').click()}
  await host.locator(`#transform-num-input-${side}`).fill(String(forms[side].numerator));await host.locator('.active-beat-controls .control-submit-btn').click();
 }
 const answer=subtractAtCommonDenominator(f(record.sourceForms.left),f(record.sourceForms.right),target);
 await host.locator('#operate-fraction-numerator-input').fill(String(answer.numerator));await host.locator('#operate-fraction-denominator-input').fill(String(answer.denominator));await host.locator('.active-beat-controls .control-submit-btn').click();
 await host.locator('.active-beat-controls button').first().click();
}
const descriptor=id=>allGate92Descriptors().find(d=>d.identity.itemId===id);
async function completeVisibleSession(p,{forceWrong=false}={}){
 const seen=[];let prior=null;
 for(let index=0;index<4;index++){
  const id=await appItem(p);if(!id||seen.includes(id))break;const d=descriptor(id);if(!d)throw Error(`Mounted ordinary item ${id} has no Plan 92 descriptor`);seen.push(id);p.__forceWrong=forceWrong&&index===0;
  await solveMounted(p,id);
  if(index===3)break;
  await p.waitForFunction(old=>document.querySelector('.app-episode')?.getAttribute('data-current-item-id')!==old,id,{timeout:7000}).catch(()=>{});
  const next=await appItem(p);if(!next||next===id||!descriptor(next))break;
 }
 p.__forceWrong=false;return seen.map(id=>({role:descriptor(id).role,itemId:id}));
}
async function waitReleased(p){
 const deadline=Date.now()+6000;let previous=null,stable=0,last=null;
 while(Date.now()<deadline){last=await readEvents(p);const active=last?.meta?.writerRegistration?.state==='active'||last?.intent===true;const sig=JSON.stringify([last?.meta?.revision,last?.meta?.nextOrdinal,last?.entries?.length]);if(!active&&sig===previous)stable++;else stable=0;previous=sig;if(stable>=2)return last;await p.waitForTimeout(120)}
 throw Error(`Recorder did not reach a stable released state: ${JSON.stringify({intent:last?.intent,writerState:last?.meta?.writerRegistration?.state,revision:last?.meta?.revision,nextOrdinal:last?.meta?.nextOrdinal})}`);
}
try{
 await server.listen();browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});context=await browser.newContext({viewport:{width:1093,height:750}});
 // Same-seed, no-history baselines for every role in each generated shape.
 for(const seed of seeds){const clean=await browser.newContext({viewport:{width:1093,height:750}});try{page=await seedPage(seed,clean);await page.evaluate(s=>window.__ff92TestSeedQueue.push(s),seed);await page.locator('[data-session-entry="comparison"]').click();await page.locator('.app-episode').waitFor({state:'visible'});const consumed=await page.evaluate(()=>window.__ff92ConsumedSeeds.slice());assert.deepEqual(consumed,[seed],`Baseline Start did not consume exactly seed ${seed}`);const selected=await completeVisibleSession(page);result.baselineComparisons.push({seed,consumedSeed:consumed[0],selected});}finally{await page?.close().catch(()=>{});await clean.close()}}
 page=await seedPage(seeds[0]);await panel(page).getByRole('button',{name:'Remember expanded practice on this browser'}).click();await panel(page).locator('[role="status"]').getByText('Expanded remembering is on for this browser.').waitFor();
 const storage=await readEvents(page);assert.equal(storage?.meta?.enabled,true,'Visible opt-in did not create enabled ordinary storage');
 let solved=0;
 for(let i=0;i<seeds.length;i++){
  if(i>0){const back=page.locator('.app-return-button');if(await back.isVisible()){await back.click();const leave=page.getByRole('dialog').getByRole('button',{name:'Leave'});if(await leave.count())await leave.click()}else await page.locator('[data-session-entry="comparison"]').waitFor({state:'visible'});await waitReleased(page)}
  const before=await readEvents(page);const consumedBefore=await page.evaluate(()=>window.__ff92ConsumedSeeds.length);await page.evaluate(s=>window.__ff92TestSeedQueue.push(s),seeds[i]);await page.locator('[data-session-entry="comparison"]').click();await page.locator('.app-episode').waitFor({state:'visible'});const consumed=await page.evaluate(n=>window.__ff92ConsumedSeeds.slice(n),consumedBefore);assert.deepEqual(consumed,[seeds[i]],`Ordinary Start ${i} did not consume exactly its requested test seed`);
  const selected=await completeVisibleSession(page,{forceWrong:i===0});const after=await readEvents(page);const added=(after?.entries??[]).filter(e=>!(before?.entries??[]).some(old=>old.token===e.token));result.actualObserverEvents.push(...added.map(e=>({itemId:e.identity?.itemId,role:e.role,token:e.token,ordinal:e.ordinal,first:e.first,accepted:e.accepted,epoch:e.epoch})));
  const ranking=offlineRanking(seeds[i],before);const baseline=result.baselineComparisons.find(x=>x.seed===seeds[i]);const roleComparisons=selected.map(choice=>{const baselineId=baseline.selected.find(x=>x.role===choice.role)?.itemId;const row=ranking.byId?.[choice.itemId],baseRow=ranking.byId?.[baselineId];const raised=Boolean(choice.itemId!==baselineId&&row&&baseRow&&row.priority<baseRow.priority);return {role:choice.role,itemId:choice.itemId,cleanSameSeedItemId:baselineId??null,chosenRank:row?{priority:row.priority,...row.evidence}:null,cleanBaselineRank:baseRow?{priority:baseRow.priority,...baseRow.evidence}:null,differsAndRanksHigher:raised}});
  result.visits.push({seed:seeds[i],consumedSeed:consumed[0],selected,beforeEntries:before?.entries?.length??null,afterEntries:after?.entries?.length??null,lagSnapshotReliable:ranking.reliable,lagSnapshot:ranking.snapshot??null,roleComparisons,observerCreatedEvents:added.map(e=>({itemId:e.identity?.itemId,role:e.role,ordinal:e.ordinal,first:e.first,accepted:e.accepted}))});
  for(const c of roleComparisons){if(!c.differsAndRanksHigher)continue;const witness={seed:seeds[i],role:c.role,chosenItemId:c.itemId,seedOnlyItemId:c.cleanSameSeedItemId,chosenPriority:c.chosenRank.priority,seedOnlyCandidatePriority:c.cleanBaselineRank.priority,reason:c.chosenRank.reason,recordedLag:c.chosenRank.recordedLag,olderEndpointOrdinal:c.chosenRank.recordedOlderEndpointOrdinal,newerEndpointOrdinal:c.chosenRank.recordedNewerEndpointOrdinal};if(c.chosenRank.reason==='recent-skill-return'&&!result.summary?.recentChoiceWitness)result.summary={...(result.summary??{}),recentChoiceWitness:witness};if(c.chosenRank.reason==='older-review-draw'&&!result.summary?.olderReviewChoiceWitness)result.summary={...(result.summary??{}),olderReviewChoiceWitness:witness}}
  if(added.length===selected.length)solved++;else result.limitations.push(`seed ${seeds[i]} produced ${added.length} read-back exposures for ${selected.length} selected roles`);
 }
 result.summary={...(result.summary??{}),completedAllRoleVisits:solved,readBackObserverEvents:result.actualObserverEvents.length,baselineSeeds:result.baselineComparisons.length,recentChoiceWitness:result.summary?.recentChoiceWitness??null,olderReviewChoiceWitness:result.summary?.olderReviewChoiceWitness??null};
 result.summary.readBackExposureCount=result.actualObserverEvents.length;
 result.summary.acceptedEvents=result.actualObserverEvents.filter(e=>e.first==='accepted'&&e.accepted==='yes').length;
 result.summary.exposuresWithUnknownFirstOrAcceptance=result.actualObserverEvents.filter(e=>e.first==='unknown'||e.accepted==='unknown').length;
 if(!result.summary.recentChoiceWitness)result.limitations.push('No ordinary recent-skill-return choice differing from its same-seed clean role baseline was verified.');
 if(!result.summary.olderReviewChoiceWitness)result.limitations.push('No ordinary older-review-draw choice differing from its same-seed clean role baseline was verified.');
 if(!result.summary.recentChoiceWitness)result.limitations.push('No verified ordinary recent-skill-return choice differing from its same-seed clean baseline was found in the sampled visits.');
 if(!result.summary.olderReviewChoiceWitness)result.limitations.push('No verified ordinary older-review-draw choice differing from its same-seed clean baseline was found in the sampled visits.');
 await writeFile(`${dir}/ordinary92-lag.json`,JSON.stringify(result,null,2)+'\n');
}catch(error){result.limitations.push(String(error?.stack||error));await writeFile(`${dir}/ordinary92-lag.json`,JSON.stringify(result,null,2)+'\n').catch(()=>{});throw error}
finally{await page?.close().catch(()=>{});await context?.close();await browser?.close();await server.close()}
