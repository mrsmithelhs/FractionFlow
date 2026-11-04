import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5216','--strictPort'], {stdio:'pipe'});
process.on('uncaughtException', error => { console.error(error); server.kill(); process.exit(1); });
await new Promise((resolve,reject) => { server.stdout.on('data', x => { if (String(x).includes('Local:')) resolve(); }); server.on('exit', () => reject(Error('server exited'))); });
const browser = await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const results=[];
for (const [name,viewport,scale,textScale] of [['narrow',{width:360,height:740},1,100],['chromebook',{width:1093,height:614},1.25,100],['large-text',{width:360,height:740},1,200]]) {
 const context=await browser.newContext({viewport,deviceScaleFactor:scale,reducedMotion:'reduce'}); const page=await context.newPage();
 await page.goto('http://127.0.0.1:5216/FractionFlow/');
 if(textScale===200) await page.addStyleTag({content:'html { font-size: 200% !important; }'});
 const data=await page.evaluate(()=>{
  const session=document.querySelector('[data-session-entry="magnitude"]');
  const neighbor=document.querySelector('[data-practice-type="directed-number-line-endpoint"]') || [...document.querySelectorAll('[data-practice-type]')].at(-1);
  const cue=document.getElementById(session.getAttribute('aria-describedby'));
  const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right};};
  const choices=[...document.querySelectorAll('.app-entry-page button')].filter(e=>e.offsetParent!==null);
  const wrapper=session.parentElement; wrapper.before(session); const baselineScrollWidth=document.documentElement.scrollWidth; wrapper.appendChild(session);
  return {session:rect(session),sessionScrollWidth:session.scrollWidth,sessionClientWidth:session.clientWidth,baselineScrollWidth,neighbor:rect(neighbor),cue:rect(cue),cueText:cue.textContent,entry:rect(document.querySelector('.app-entry-page')),scrollWidth:document.documentElement.scrollWidth,innerWidth,firstButton:choices[0]?.getAttribute('data-practice-type'),secondButton:choices[1]?.className,about:!!document.querySelector('.app-about-link'),credit:!!document.querySelector('.app-creator-credit')};
 });
 assert.ok(Math.abs(data.session.x-data.neighbor.x)<1, 'left alignment');
 assert.ok(data.session.width<=data.entry.width+1 && data.sessionScrollWidth<=data.sessionClientWidth+1, 'session overflow');
 assert.ok(data.scrollWidth<=data.innerWidth || (textScale===200 && data.scrollWidth===data.baselineScrollWidth), 'new document overflow');
 assert.ok(data.session.y>=data.neighbor.y+data.neighbor.height-1, 'session order');
 assert.equal(data.cueText,'Your place in this practice is not saved.');
 assert.equal(data.firstButton,'sum-under-one'); assert.match(data.secondButton,/app-gear-button/); assert.ok(data.about && data.credit);
 await page.keyboard.press('Tab'); assert.equal(await page.evaluate(()=>document.activeElement.getAttribute('data-practice-type')),'sum-under-one'); await page.keyboard.press('Tab'); assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('app-gear-button')),true); await page.locator('.app-about-link').focus(); assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('app-about-link')),true);
 if(name==='chromebook') assert.ok(data.session.width<data.entry.width-20,'entry button stretched');
 await page.locator('[data-session-entry="magnitude"]').scrollIntoViewIfNeeded();
 await page.screenshot({path:`reports/development/plan-60-short-magnitude-practice-session/evidence/repair02-${name}.png`});
 await page.locator('[data-session-entry="magnitude"]').focus(); await page.keyboard.press('Enter');
 assert.equal(await page.locator('.app-episode').getAttribute('data-current-item-id'),'plan45-compare-02');
 assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('app-episode')),true);
 results.push({name,viewport,deviceScaleFactor:scale,textScale, ...data, sessionStarts:true, focus:'episode'}); await context.close();
}
await writeFile('reports/development/plan-60-short-magnitude-practice-session/evidence/repair02-measurements.json',JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results)); await browser.close();server.kill();
