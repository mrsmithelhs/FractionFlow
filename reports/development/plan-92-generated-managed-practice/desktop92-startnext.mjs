import {createServer} from 'vite';
import {chromium} from 'playwright';
import {writeFile} from 'node:fs/promises';
import {PLAN45_COMPARISON_RECORDS} from '../../../src/content/data/plan45-symbolic-fraction-comparison-records.js';
import {allGate92Descriptors} from '../../../src/app/plan92-catalog.js';
import {selectPlan92Sync} from '../../../src/app/plan92-managed-selector.js';
import {createFraction,compareFractions} from '../../../src/math/index.js';

const dir='reports/development/plan-92-generated-managed-practice';
const conditions=[{width:1024,height:614},{width:1200,height:740},{width:1366,height:768}];
const descriptors=allGate92Descriptors(),records=new Map(PLAN45_COMPARISON_RECORDS.map(x=>[x.itemId,x]));
const versions={catalogRevision:'ff92-catalog@1',policyRevision:'ff92-policy@1',compatibilityRevision:'ff92-compat@1',demandsRevision:'ff92-demands@1'};
const seed=Array.from({length:200},(_,i)=>i).find(n=>{const s=selectPlan92Sync({...versions,seed:n,candidates:descriptors.map(d=>({...d,fit:true}))});return s.witness.selected.length>1&&s.witness.selected[0].role==='C';});
if(seed===undefined)throw Error('Could not find deterministic multi-visit seed beginning with comparison.');
const server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:5193,strictPort:true},logLevel:'error'});let browser;const runs=[];
try{
 await server.listen();browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});
 for(const condition of conditions)for(const view of ['visual','linear']){
  const context=await browser.newContext({viewport:{width:condition.width,height:condition.height}}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(15000);page.setDefaultNavigationTimeout(30000);
  const result={...condition,rootText:16,view,seed,failures:[],stages:{}};
  try{
   await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/${dir}/desktop92-preview.html?seed=${seed}`,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>window.desktop92);
   result.stages.entry=await page.evaluate(()=>desktop92.measure());
   await page.locator('[data-session-entry="comparison"]').click();
   await page.waitForFunction(()=>window.desktop92.app.getState()?.taskContext?.itemId);
   if(view==='linear')await page.locator('.app-view-toggle').click();
   const witness=await page.evaluate(()=>desktop92.suppliedManifest.witness);
   result.shape=witness.shapeId;result.selected=witness.selected.map(x=>({role:x.role,itemId:x.identity.itemId}));
   const first=result.selected[0];if(first.role!=='C')throw Error(`Expected comparison first, got ${first.role}`);
   result.stages.started=await page.evaluate(()=>desktop92.measure());
   const id=first.itemId,record=records.get(id);if(!record)throw Error(`Comparison item record unavailable: ${id}`);
   const left=createFraction(BigInt(record.sourceForms.first.numerator),BigInt(record.sourceForms.first.denominator));
   const right=createFraction(BigInt(record.sourceForms.second.numerator),BigInt(record.sourceForms.second.denominator));
   const cmp=compareFractions(left,right),answer=cmp<0?'<':cmp>0?'>':'=';
   const host=page.locator(view==='linear'?'.app-linear-view:not([hidden])':'.app-visual-view:not([hidden])');
   await host.locator(`.plan45-relation-option input[value="${answer}"]`).check();await host.locator('.plan45-check-button').click();
   result.stages.completed=await page.evaluate(()=>desktop92.measure());
   await host.locator('.plan45-progression-button').click();
   await page.waitForFunction((item)=>window.desktop92.app.getState()?.taskContext?.itemId===item,result.selected[1].itemId);
   result.afterNextItem=await page.evaluate(()=>desktop92.app.getState()?.taskContext?.itemId);
   result.stages.afterNext=await page.evaluate(()=>desktop92.measure());
   if(errors.length)throw Error(`page errors: ${errors.join('; ')}`);
   result.completed=true;
  }catch(e){result.failures.push(e.stack||String(e));try{result.debug=await page.evaluate(()=>({supplied:window.desktop92?.suppliedManifest,state:window.desktop92?.app?.getState(),notice:document.querySelector('.app-session-entry-notice')?.textContent,body:document.body.innerText.slice(0,800)}));}catch{}result.completed=false;}
  runs.push(result);await context.close();console.log(`completed ${condition.width}x${condition.height} ${view}: ${result.completed}`);
 }
 const receipt={scope:'Mounted real app; synthetic selectManifest hook supplies a deterministic manifest and marks candidates fit, so production Plan 92 measured admission and its preflight are not under test. Start, comparison completion, Next, and fit/host geometry are captured. CSS root text remains 16px.',browser:browser.version(),seed,conditions,views:['visual','linear'],runs};
 await writeFile(`${dir}/desktop92-startnext.json`,JSON.stringify(receipt,null,2)+'\n');
 if(runs.some(x=>!x.completed))process.exitCode=1;
}finally{await browser?.close();await server.close();}
