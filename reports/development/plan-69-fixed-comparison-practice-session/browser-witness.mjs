import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
const dir='reports/development/plan-69-fixed-comparison-practice-session/evidence'; await mkdir(dir,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true}); const results=[];
try {
 for (const [name,viewport,touch] of [['phone',{width:360,height:740},true],['chromebook',{width:1366,height:768},false]]) {
  const context=await browser.newContext({viewport,hasTouch:touch,isMobile:touch}); const page=await context.newPage();
  await page.goto('http://127.0.0.1:5274/FractionFlow/');
  const launch=page.locator('[data-session-entry="comparison"]'); await launch.waitFor();
  await page.screenshot({path:`${dir}/${name}-entry.png`,fullPage:true});
  if(name==='phone') { await page.addStyleTag({content:'html { font-size: 200% !important; }'}); await page.screenshot({path:`${dir}/phone-entry-enlarged.png`,fullPage:true}); await page.reload(); }
  if(touch) await launch.tap(); else await launch.click();
  const episode=page.locator('.app-episode'); const ids=[];
  for(const [i,id,relation] of [[0,'plan45-compare-02','>'],[1,'plan45-compare-09','>'],[2,'plan45-compare-11','='],[3,'plan45-compare-10','<']]) {
   const actual=await episode.getAttribute('data-current-item-id'); if(actual!==id)throw Error(`expected ${id}, got ${actual}`); ids.push(actual);
   const form=page.locator('.app-visual-view .plan45-response-region');
   if(i===0) { await page.locator('.app-visual-view .plan45-comparison details summary').click(); await page.getByRole('button',{name:'Use the same denominator'}).first().click(); await form.locator('input[value="<"]').check(); await form.locator('button[type="submit"]').click(); }
   await form.locator(`input[value="${relation}"]`).check(); await form.locator('button[type="submit"]').click();
   const next=page.locator('.app-visual-view .plan45-progression-button'); await next.waitFor({state:'visible'});
   if(i===0) await page.screenshot({path:`${dir}/${name}-accepted.png`,fullPage:true});
   if(i===3) { if((await next.innerText())!=='Back to start')throw Error('missing final return'); await page.screenshot({path:`${dir}/${name}-complete.png`,fullPage:true}); }
   if(touch) await next.tap(); else await next.click();
  }
  await launch.waitFor({state:'visible'}); await launch.click(); if(await episode.getAttribute('data-current-item-id')!=='plan45-compare-02')throw Error('fresh start');
  await page.locator('.app-return-button').click(); await page.getByRole('button',{name:'Stay',exact:true}).click(); await page.locator('.app-return-button').click(); await page.getByRole('button',{name:'Leave',exact:true}).click();
  results.push({name,viewport,touch,ids,retry:true,construction:true,finalReturn:true,freshStart:true,stayLeave:true}); await context.close();
 }
 const context=await browser.newContext({viewport:{width:1366,height:768}}); const page=await context.newPage();
 await page.goto('http://127.0.0.1:5274/FractionFlow/'); await page.locator('.app-gear-button').click(); await page.locator('[data-support-id="medium-support"]').click(); await page.locator('.comparison-record-panel summary').click();
 await page.getByRole('button',{name:'Start remembering',exact:true}).click(); await page.getByText('Remembering comparison activity on this browser.',{exact:false}).waitFor();
 await page.locator('[data-session-entry="comparison"]').click(); await page.getByRole('button',{name:'Read the steps'}).click();
 const linear=page.locator('.app-linear-view .plan45-response-region'); await linear.locator('input[value=">"]').check(); await linear.locator('button[type="submit"]').click();
 await page.locator('.app-linear-view .plan45-progression-button').waitFor({state:'visible'}); await page.locator('.app-return-button').click();
 await page.locator('.comparison-record-panel summary').click().catch(()=>{});
 if(!await page.locator('.comparison-record-panel').evaluate(el=>el.open)) await page.locator('.comparison-record-panel summary').click();
 await page.getByRole('button',{name:'View record',exact:true}).click(); await page.getByText('Compared correctly.',{exact:false}).waitFor();
 await page.getByRole('button',{name:'Clear record',exact:true}).first().click(); await page.getByRole('button',{name:'Clear record',exact:true}).last().click();
 await page.getByText('Record cleared.',{exact:false}).waitFor(); await page.locator('[data-entry-chooser]').click(); await page.locator('[data-session-entry="magnitude"]').click();
 if(await page.locator('.app-episode').getAttribute('data-current-item-id')!=='plan45-compare-02')throw Error('legacy session launch');
 await page.locator('.app-return-button').click(); await page.getByRole('button',{name:'Leave',exact:true}).click(); await page.locator('[data-entry-chooser]').click();
 await page.locator('[data-entry-role="browse"][data-practice-type="symbolic-fraction-comparison"]').click();
 if(await page.locator('.app-episode').getAttribute('data-current-item-id')!=='plan45-compare-01')throw Error('standalone comparison launch');
 results.push({name:'linear-record-regressions',support:'medium',remembering:true,recordObserved:true,clear:true,legacySession:true,standalone:true}); await context.close();
 await writeFile(`${dir}/browser-witness.json`,JSON.stringify({browser:'Edge headless',results},null,2));
} finally { await browser.close(); }
