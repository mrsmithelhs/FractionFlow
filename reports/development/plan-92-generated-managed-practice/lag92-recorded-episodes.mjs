// Isolated, mounted-browser driver for Plan 92's recorded-lag policy evidence.
// It intentionally uses the owner preview seam and real Start/response/Next
// actions. It never writes episode observations directly to IndexedDB.
import {createServer} from 'vite';
import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
import {PLAN40_SUBTRACTION_RECIPE_RECORDS} from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import {createFraction,convertToDenominator,equalFractions,subtractAtCommonDenominator} from '../../../src/math/index.js';

const dir='reports/development/plan-92-generated-managed-practice';
const server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0},logLevel:'error'});
const records=new Map(PLAN40_SUBTRACTION_RECIPE_RECORDS.map(x=>[x.itemId,x]));
const descriptorById=new Map((await import('../../../src/app/plan92-catalog.js')).allGate92Descriptors().map(x=>[x.identity.itemId,x]));
const outputPath=`${dir}/lag92-recorded-episodes.json`;
const seeds=[0,2,4,3,...Array.from({length:24},(_,i)=>i).filter(i=>![0,2,4,3].includes(i))];
let browser,context,currentVisit=null;
const result={scope:'isolated mounted owner preview; synthetic browser interaction, not ordinary activation or learner evidence',requiredExposures:10,minimumVerifiedExposures:0,visits:[],witnesses:{recent:null,olderReview:null},controls:{clear:null,stop:null,optInOff:null,legacy:null},pageErrors:[],limitations:[]};
let positiveExposureCount=0;const positiveTokens=new Set();
const fraction=f=>createFraction(BigInt(f.numerator),BigInt(f.denominator));
const check=(value,message)=>{if(!value)throw new Error(message)};

async function solve(page,id,{wrong=false}={}){
 const host=page.locator('.app-visual-view:not([hidden])');
 if(id.startsWith('plan45-')){
  const answer=id==='plan45-compare-10'?'<':'>';
  if(wrong){await host.locator(`.plan45-relation-option input[value="${answer==='<'?'>':'<'}"]`).check();await host.locator('.plan45-check-button').click();}
  await host.locator(`.plan45-relation-option input[value="${answer}"]`).check();
  await host.locator('.plan45-check-button').click();
  await host.locator('.plan45-progression-button').click();
  await page.waitForFunction(old=>{const app=window.owner92?.app;return !app||app.getManagedSessionWitness?.()==null||app.getState()?.taskContext?.itemId!==old},id);return;
 }
 const record=records.get(id);check(record,`No solver record for ${id}`);
 await host.locator('.active-beat-controls button').first().click();
 if(record.recipeId.endsWith('identify-side-construct'))await host.locator('.nested-side-choice').nth(record.requiredSide==='left'?0:1).click();
 const target=BigInt(record.targetDenominator),forms=Object.fromEntries(['left','right'].map(side=>[side,convertToDenominator(fraction(record.sourceForms[side]),target)]));
 for(const side of record.recipeId.endsWith('identify-side-construct')?[record.requiredSide]:['left','right']){
  if(record.recipeId.endsWith('inspect-keep-repair')){
   const offered=record.candidates[side];
   if(equalFractions(fraction(offered),forms[side])){await host.locator(`.active-beat-controls button[aria-label="Keep new fraction ${offered.numerator} over ${offered.denominator}"]`).click();continue;}
   await host.locator('.inspect-change-button').click();
  }
  await host.locator(`#transform-num-input-${side}`).fill(String(forms[side].numerator));
  await host.locator('.active-beat-controls .control-submit-btn').click();
 }
 const answer=subtractAtCommonDenominator(fraction(record.sourceForms.left),fraction(record.sourceForms.right),target);
 await host.locator('#operate-fraction-numerator-input').fill(String(answer.numerator));
 await host.locator('#operate-fraction-denominator-input').fill(String(answer.denominator));
 await host.locator('.active-beat-controls .control-submit-btn').click();
 await host.locator('.active-beat-controls button').first().click();
 await page.waitForFunction(old=>{const app=window.owner92?.app;return !app||app.getManagedSessionWitness?.()==null||app.getState()?.taskContext?.itemId!==old},id);
}

async function pageFor(seed,name){
 const page=await context.newPage();page.on('dialog',dialog=>dialog.accept());
 page.on('pageerror',error=>result.pageErrors.push({seed,message:String(error?.stack||error)}));
 const url=`http://127.0.0.1:${server.httpServer.address().port}/${dir}/owner92-preview.html?seed=${seed}&name=${encodeURIComponent(name)}`;
 await page.goto(url);await page.waitForFunction(()=>window.owner92);return page;
}
async function historySnapshot(page){
 await page.evaluate(()=>owner92.observer.settled());
 const [history,diagnostics,snapshot]=await page.evaluate(async()=>[
  await owner92.readRecordedHistory(),
  await owner92.getDiagnostics(),
  await owner92.readRecordedLagSnapshot(),
 ]);
 return {history,diagnostics,snapshot};
}

try{
 await server.listen();browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});context=await browser.newContext({viewport:{width:1093,height:614}});
 const name=`lag92-${Date.now()}`;
 let page=await pageFor(0,name);
 await page.locator('.comparison-record-panel summary').click();
 // Keep the separate legacy choice enabled to exercise preservation and its
 // own opt-out path while expanded history is independently enabled.
 await page.locator('[data-record-control="toggle"]').click();
 await page.waitForFunction(()=>document.querySelector('.comparison-record-panel')?.textContent.includes('Remembering comparison activity'));
 result.controls.legacy={enabledThroughVisibleControl:true};
 await page.getByRole('button',{name:'Remember practice on this browser'}).click();
 await page.waitForFunction(async()=>(await owner92.bridge.readExpandedMeta())?.enabled===true);

 // A clean same-origin database records the seed-only selected IDs. It is
 // never used for the positive recorded-lag exposures.
 const cleanName=`${name}-clean`;
 for(const seed of seeds){
  const baseline=await pageFor(seed,cleanName);
  await baseline.locator('[data-session-entry="comparison"]').click();
  await baseline.waitForFunction(()=>owner92.app.getManagedSessionWitness()?.shapeId);
  result.visits.push({seed,baseline:(await baseline.evaluate(()=>owner92.app.getManagedSessionWitness())).selected.map(x=>({role:x.role,itemId:x.identity.itemId}))});
  await baseline.evaluate(async()=>{await owner92.releaseRecorder();owner92.app.destroy();owner92.panel.destroy();owner92.bridge.close()});await baseline.close();
 }
 // Replace baseline rows with a lookup while retaining their exact seed values.
 const baselineBySeed=new Map(result.visits.map(v=>[v.seed,v.baseline]));result.visits=[];
 for(const seed of seeds){
  page=await pageFor(seed,name);
  await page.locator('[data-session-entry="comparison"]').click();
  await page.waitForFunction(()=>owner92.app.getManagedSessionWitness()?.shapeId);
  const witness=await page.evaluate(()=>owner92.app.getManagedSessionWitness());
  const before=await historySnapshot(page);
  check(before.history?.meta?.enabled===true,'Expanded history was not enabled for a visit');
  check(before.diagnostics.length>0,'Preview returned no ranking diagnostics');
  check(before.snapshot,'Preview lacks the required recorded snapshot API');
  check(before.snapshot.lagWindow?.reliable===true&&before.snapshot.lagWindow?.ordering==='continuous','Storage snapshot does not attest eligible recorded ordering');
  const baseline=baselineBySeed.get(seed);
  const visit={seed,selected:witness.selected.map(x=>({role:x.role,itemId:x.identity.itemId})),baseline,diagnostics:before.diagnostics,snapshot:before.snapshot,exposureSnapshots:[]};currentVisit=visit;
  for(const row of before.diagnostics){
   const role=descriptorById.get(row.item)?.role;
   const selected=visit.selected.find(x=>x.role===role&&x.itemId===row.item);
   const seedChoice=baseline.find(x=>x.role===role);
   if(!selected||!seedChoice||selected.itemId===seedChoice.itemId)continue;
   const baselineRank=before.diagnostics.find(x=>x.item===seedChoice.itemId);
   if(!Number.isSafeInteger(row.priority)||!Number.isSafeInteger(baselineRank?.priority)||row.priority>=baselineRank.priority)continue;
   const lag=Number.isSafeInteger(row.recordedLag)?row.recordedLag:null;
   const startOrdinal=before.snapshot.lagWindow.earliestOrdinal,endOrdinal=before.snapshot.lagWindow.latestOrdinal;
   const latestComparable=before.snapshot.entries.find(e=>e.epoch===before.snapshot.meta.epoch&&e.token===row.recordedOlderEndpointToken&&e.ordinal===row.recordedOlderEndpointOrdinal)??null;
   const newest=before.snapshot.entries.find(e=>e.epoch===before.snapshot.meta.epoch&&e.token===row.recordedNewerEndpointToken&&e.ordinal===row.recordedNewerEndpointOrdinal)??null;
   const intervening=latestComparable&&newest?newest.ordinal-latestComparable.ordinal-1:null;
   const witnessRecord={seed,role,chosenItemId:selected.itemId,seedOnlyItemId:seedChoice.itemId,chosenPriority:row.priority,seedOnlyCandidatePriority:baselineRank.priority,diagnostic:row,
    snapshotRange:{earliestOrdinal:startOrdinal,latestOrdinal:endOrdinal,retainedEventCount:before.snapshot.lagWindow.retainedCount},
    latestComparableEndpoint:latestComparable&&{itemId:latestComparable.identity.itemId,token:latestComparable.token,ordinal:latestComparable.ordinal},
    newestRecordedEndpoint:newest&&{itemId:newest.identity.itemId,token:newest.token,ordinal:newest.ordinal},
    candidateExposureEvents:before.snapshot.entries.filter(e=>e.epoch===before.snapshot.meta.epoch&&e.identity.itemId===row.item).map(e=>({itemId:e.identity.itemId,token:e.token,ordinal:e.ordinal})),
    interveningRecordedExposureCount:intervening,policyReportedLag:lag};
   if(row.reason==='recent-skill-return'&&row.recentSkillReturn===true&&lag===intervening&&intervening>=2&&intervening<=6&&!result.witnesses.recent)result.witnesses.recent=witnessRecord;
   if(row.reason==='older-review-draw'&&row.reviewOpportunity===true&&lag===intervening&&intervening>=7&&!result.witnesses.olderReview)result.witnesses.olderReview=witnessRecord;
  }
  // Solve every installed episode using the learner-facing controls, wait for
  // observer writes, and store the resulting durable snapshot after each Next.
  for(const [index,selected] of witness.selected.entries()){const current=await historySnapshot(page);const pending=current.history?.entries?.filter(e=>e.identity.itemId===selected.identity.itemId&&e.epoch===current.history.meta.epoch&&e.first==='unknown').at(-1);await solve(page,selected.identity.itemId,{wrong:seed===0&&index===0});const captured=await historySnapshot(page);const recorded=pending&&captured.history?.entries?.find(e=>e.token===pending.token);if(recorded){check(recorded.first===(seed===0&&index===0?'retry':'accepted')&&recorded.accepted==='yes',`Observed mounted episode ${selected.identity.itemId} did not produce expected first-response and completion writes`);if(!positiveTokens.has(recorded.token)){positiveTokens.add(recorded.token);positiveExposureCount++;}visit.exposureSnapshots.push({recorded:true,itemId:selected.identity.itemId,token:recorded.token,ordinal:recorded.ordinal,first:recorded.first,accepted:recorded.accepted});if(positiveExposureCount>=10&&!result.evidenceSnapshotAfterTen)result.evidenceSnapshotAfterTen={actualRecordedExposures:positiveExposureCount,seed,history:captured.snapshot,diagnostics:captured.diagnostics};}else visit.exposureSnapshots.push({recorded:false,itemId:selected.identity.itemId,reason:'no pending expanded observer event existed for this mounted episode'});}
  result.minimumVerifiedExposures=Math.max(result.minimumVerifiedExposures,(await page.evaluate(async()=> (await owner92.readRecordedHistory())?.entries.length??0)));
  result.visits.push(visit);currentVisit=null;
  await page.evaluate(async()=>{await owner92.releaseRecorder();owner92.app.destroy();owner92.panel.destroy();owner92.bridge.close()});await page.close();
  if(result.minimumVerifiedExposures>=10&&result.witnesses.recent&&result.witnesses.olderReview)break;
 }
 check(result.minimumVerifiedExposures>=10,'Fewer than ten actual observer-recorded exposures were retained');
 check(result.witnesses.recent,'No recent recorded-lag choice changed from its seed-only baseline');
 check(result.witnesses.olderReview,'No older-review choice changed from its seed-only baseline');

 // Visible controls are exercised on the populated record. Clear includes the
 // independent legacy record, Stop preserves stored expanded events, and
 // opt-in-off means the mounted preview starts without expanded observation.
 page=await pageFor(0,name);
 await page.locator('.comparison-record-panel summary').click();
 const legacyEntryCount=(await page.evaluate(()=>owner92.bridge.read())).entries.length;
 await page.locator('[data-record-control="toggle"]').click();
 await page.locator('[data-record-control="confirm"]').click();
 await page.waitForFunction(async()=>!(await owner92.bridge.read()).enabled);
 check((await page.evaluate(()=>owner92.bridge.read())).entries.length===legacyEntryCount,'Legacy Stop did not retain its earlier entries');
 await page.locator('[data-record-control="toggle"]').click();
 await page.waitForFunction(async()=>(await owner92.bridge.read()).enabled===true);
 check((await page.evaluate(()=>owner92.bridge.read())).entries.length===legacyEntryCount,'Legacy opt-in did not preserve earlier entries');
 const retained=(await page.evaluate(()=>owner92.bridge.inspectHistory())).entries.length;
 await page.locator('#expanded-record').getByRole('button',{name:'Stop remembering'}).click();
 await page.waitForFunction(async()=>(await owner92.bridge.readExpandedMeta())?.enabled===false);
 await page.evaluate(()=>owner92.observer.settled());
 check((await page.evaluate(()=>owner92.bridge.inspectHistory())).entries.length===retained,'Stop did not retain the earlier expanded record');
 result.controls.stop={passed:true,retainedEntries:retained};
 const legacyBeforeClear=await page.evaluate(()=>owner92.bridge.read());
 check(legacyBeforeClear?.enabled===true&&legacyBeforeClear.entries.length>0,'The legacy control did not retain actual mounted comparison activity');
 result.controls.legacy={passed:true,enabledThroughVisibleControl:true,stopRetainedEntries:true,reEnableRetainedEntries:true,enabled:legacyBeforeClear.enabled,recordedEntries:legacyBeforeClear.entries.length};
 await page.locator('[data-session-entry="comparison"]').click();
 await page.waitForFunction(()=>owner92.app.getManagedSessionWitness()?.shapeId);
 await page.evaluate(()=>owner92.observer.settled());
 check(await page.evaluate(()=>owner92.readRecordedHistory())===null,'Expanded history remained readable as active scheduler history while opt-in was off');
 const offAfter=await page.evaluate(()=>owner92.bridge.inspectHistory());
 check(offAfter.entries.length===retained,'Expanded history received a new exposure while opt-in was off');
 result.controls.optInOff={passed:true,expandedHistoryNotUsed:true,noNewExposure:true};
 await page.getByRole('button',{name:'Remember practice on this browser'}).click();
 await page.waitForFunction(async()=>(await owner92.bridge.readExpandedMeta())?.enabled===true);
 await page.getByRole('button',{name:'Clear both practice records'}).click();
 await page.waitForFunction(()=>document.querySelector('#expanded-record section [role=status]')?.textContent.includes('cleared'));
 check((await page.evaluate(()=>owner92.bridge.inspectHistory())).entries.length===0,'Clear did not clear expanded history');
 const legacyAfterClear=await page.evaluate(()=>owner92.bridge.read());
 check(legacyAfterClear?.entries?.length===0&&legacyAfterClear?.enabled===true,'Clear did not preserve legacy opt-in while clearing its entries');
 result.controls.clear={passed:true,expandedEntriesAfterClear:0,legacyEntriesAfterClear:0,legacyStillEnabled:true};
 result.controls.legacy.afterClear='legacy enabled state preserved and legacy entries cleared';
 await page.evaluate(async()=>{await owner92.releaseRecorder();owner92.app.destroy();owner92.panel.destroy();owner92.bridge.close()});
 await page.evaluate(name=>new Promise((resolve,reject)=>{const r=indexedDB.deleteDatabase(name);r.onsuccess=resolve;r.onerror=()=>reject(r.error)}),name);
 await writeFile(outputPath,JSON.stringify(result,null,2)+'\n');
}catch(error){
 if(currentVisit&&!result.visits.includes(currentVisit))result.visits.push(currentVisit);
 result.limitations.push(String(error?.stack||error));
 await writeFile(outputPath,JSON.stringify(result,null,2)+'\n').catch(()=>{});
 throw error;
}finally{await context?.close();await browser?.close();await server.close();}
