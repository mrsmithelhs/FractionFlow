import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V3 as set, PLAN40_SUBTRACTION_RECIPE_RECORDS as records } from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';
const out=path.dirname(fileURLToPath(import.meta.url));
const server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0,strictPort:true},logLevel:'error'});
let browser;const results=[],errors=[];
try{
 await server.listen();const url=`http://127.0.0.1:${server.httpServer.address().port}/reports/development/plan-89-versioned-problem-bank-publication/review-harness.html`;
 browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});
 for(const config of [{name:'narrow-visual',width:360,height:740,linear:false,enlarged:false},{name:'enlarged-linear',width:1093,height:740,linear:true,enlarged:true}]){
  const context=await browser.newContext({viewport:{width:config.width,height:config.height}}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(`${config.name}: ${e.message}`));await page.goto(url);
  if(config.enlarged)await page.addStyleTag({content:'html { font-size: 200% !important; }'});
  const choice=page.locator('[data-practice-type="unlike-denominator-subtraction"]');if(!(await choice.isVisible()))await page.getByRole('button',{name:'Choose what to practice'}).click();await choice.click();
  if(config.linear)await page.locator('.app-view-toggle').click();
  const host=page.locator(config.linear?'.app-linear-view':'.app-visual-view');
  const prefix=config.linear?'linear-':'';const input=id=>host.locator(`#${prefix}${id}`),control=host.locator('.active-beat-controls');
  const states=[];
  for(let idx=0;idx<set.itemIds.length;idx++){
   const id=set.itemIds[idx],r=records.find(x=>x.itemId===id);const state=await page.evaluate(()=>window.plan89ReviewApp.getState());
   assert.equal(state.taskContext.itemId,id);assert.equal(state.taskContext.practiceSetRevision,'3');
   if(idx===17){assert.equal(state.beat,'encounter');assert.equal(await host.locator('input').count(),0);await page.screenshot({path:path.join(out,`${config.name}-first-new.png`),fullPage:true});}
   await control.locator('button').first().click();
   if(r.requiredSide)await host.locator('.nested-side-choice').nth(r.requiredSide==='left'?0:1).click();
   const t=BigInt(r.targetDenominator),conv=Object.fromEntries(['left','right'].map(side=>[side,String(BigInt(r.sourceForms[side].numerator)*(t/BigInt(r.sourceForms[side].denominator)))]));
   for(const side of r.requiredSide?[r.requiredSide]:['left','right']){
    if(r.candidates){const c=r.candidates[side];if(c.numerator===conv[side]){await control.locator(`button[aria-label="Keep new fraction ${c.numerator} over ${c.denominator}"]`).click();continue;}await control.locator('.inspect-change-button').click();}
    await input(`transform-num-input-${side}`).fill(conv[side]);await host.locator('.control-submit-btn').click();
   }
   if(idx===17){await input('operate-fraction-numerator-input').fill('99');await input('operate-fraction-denominator-input').fill('1');await host.locator('.control-submit-btn').click();assert.equal(await host.locator('.recovery-feedback').isVisible(),true);}
   const numerator=BigInt(conv.left)-BigInt(conv.right);
   await input('operate-fraction-numerator-input').fill(String(idx===17?numerator*2n:numerator));await input('operate-fraction-denominator-input').fill(String(idx===17?t*2n:t));
   if(idx===17){await page.locator('.app-view-toggle').click();await page.locator('.app-view-toggle').click();assert.equal(await input('operate-fraction-numerator-input').inputValue(),String(numerator*2n));assert.equal(await input('operate-fraction-denominator-input').inputValue(),String(t*2n));}
   await host.locator('.control-submit-btn').click();
   const after=await page.evaluate(()=>window.plan89ReviewApp.getState());assert.equal(after.beat,'resolve',`${config.name} ${idx+1} ${id} recovery ${JSON.stringify(after.lastRecovery)}`);states.push(id);
   const advance=control.locator('button').first();
   if(idx<set.itemIds.length-1){assert.match(await advance.innerText(),/next/i);await advance.click();}else{assert.match(await advance.innerText(),/back to start/i);await page.screenshot({path:path.join(out,`${config.name}-end.png`),fullPage:true});await advance.click();assert.equal(await page.locator('.app-entry-page').isVisible(),true);}
  }
  results.push({config,itemsCompleted:states.length,boundary:[states[16],states[17]],last:states.at(-1),endNextVisible:false});await context.close();
 }
 assert.deepEqual(errors,[]);await writeFile(path.join(out,'mounted-observations.json'),JSON.stringify({method:'local Vite report-only harness injects registered v3 practice type into real createFractionFlowApp; real chooser and controls',browser:browser.version(),results,pageErrors:errors},null,2)+'\n');console.log(JSON.stringify(results));
}finally{await browser?.close();await server.close();}
