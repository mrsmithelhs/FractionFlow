import {writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
import {chromium} from 'playwright';
import {PLAN74_RECORDS_V2,admitPlan74Record} from '../../../src/content/plan74-mixed-addition-task.js';
import {PLAN78_RECORDS_V2,admitPlan78Record} from '../../../src/content/plan78-mixed-subtraction-task.js';
import {PLAN82_RECORDS_V2,admitPlan82Record} from '../../../src/content/plan82-mixed-subtraction-task.js';
const families=[{n:74,id:'mixed-number-addition-with-regrouping',records:PLAN74_RECORDS_V2,admit:admitPlan74Record,old:2},{n:78,id:'mixed-number-subtraction-without-decomposition',records:PLAN78_RECORDS_V2,admit:admitPlan78Record,old:4},{n:82,id:'mixed-number-subtraction-with-decomposition',records:PLAN82_RECORDS_V2,admit:admitPlan82Record,old:4}];
const out=path.dirname(fileURLToPath(import.meta.url)),server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0,strictPort:true},logLevel:'error'});let browser;const results=[],errors=[];
try{
 await server.listen();const base=`http://127.0.0.1:${server.httpServer.address().port}/reports/development/plan-89-versioned-problem-bank-publication/mixed-review-harness.html`;
 browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});
 for(const config of [{name:'narrow-visual',width:360,height:740,linear:false,enlarged:false},{name:'enlarged-linear',width:1093,height:740,linear:true,enlarged:true}])for(const f of families){
  const context=await browser.newContext({viewport:{width:config.width,height:config.height}}),page=await context.newPage();page.on('pageerror',e=>errors.push(`${config.name}/${f.n}: ${e.message}`));await page.goto(`${base}?family=${f.n}`);
  if(config.enlarged)await page.addStyleTag({content:'html { font-size: 200% !important; }'});
  const choice=page.locator(`[data-practice-type="${f.id}"]`);if(!(await choice.isVisible()))await page.getByRole('button',{name:'Choose what to practice'}).click();await choice.click();if(config.linear)await page.locator('.app-view-toggle').click();
  const host=page.locator(config.linear?'.app-linear-view':'.app-visual-view'),root=host.locator(f.n===74?'.plan74-addition':`.plan${f.n}-subtraction`),seen=[];
  for(let i=0;i<f.records.length;i++){
   const r=f.records[i],state=await page.evaluate(()=>window.mixedReviewApp.getState());assert.equal(state.taskContext.itemId,r.itemId);assert.equal(state.taskContext.setRevision,'2');
   if(i===f.old){assert.deepEqual(state.draft,{whole:'',pieces:''});await page.screenshot({path:path.join(out,`mixed-${f.n}-${config.name}-first-new.png`),fullPage:true});}
   const inputs=root.locator('.plan58-controls input'),check=root.getByRole('button',{name:'Check',exact:true});
   if(i===f.old){await inputs.nth(0).fill('0');await inputs.nth(1).fill('0');await check.click();assert.equal((await page.evaluate(()=>window.mixedReviewApp.getState())).status,'active');}
   const result=f.admit(r).result;await inputs.nth(0).fill(String(result.whole));await inputs.nth(1).fill(String(result.fraction.numerator));await check.click();assert.equal((await page.evaluate(()=>window.mixedReviewApp.getState())).status,'resolved');seen.push(r.itemId);
   const next=root.locator(`.plan${f.n}-result button`);if(i<f.records.length-1){assert.match(await next.innerText(),/next/i);await next.click();}else{assert.match(await next.innerText(),/back to start/i);await page.screenshot({path:path.join(out,`mixed-${f.n}-${config.name}-end.png`),fullPage:true});await next.click();assert.equal(await page.locator('.app-entry-page').isVisible(),true);}
  }
  results.push({family:f.n,config,itemsCompleted:seen.length,boundary:[seen[f.old-1],seen[f.old]],last:seen.at(-1),returnedToStart:true});await context.close();
 }
 assert.deepEqual(errors,[]);await writeFile(path.join(out,'mixed-mounted-observations.json'),JSON.stringify({method:'local Vite report-only harness injects registered family v2 records into real createFractionFlowApp; real chooser and controls',browser:browser.version(),results,pageErrors:errors},null,2)+'\n');console.log(JSON.stringify(results));
}finally{await browser?.close();await server.close();}
