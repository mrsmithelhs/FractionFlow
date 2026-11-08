import { writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { PLAN40_SUBTRACTION_RECIPE_PRACTICE_SET_V3 as set40 } from '../../../src/content/data/plan40-reusable-subtraction-recipes-records.js';
import { PLAN74_RECORDS_V2 } from '../../../src/content/plan74-mixed-addition-task.js';
import { PLAN78_RECORDS_V2 } from '../../../src/content/plan78-mixed-subtraction-task.js';
import { PLAN82_RECORDS_V2 } from '../../../src/content/plan82-mixed-subtraction-task.js';
const families={40:set40.itemIds,74:PLAN74_RECORDS_V2.map(r=>r.itemId),78:PLAN78_RECORDS_V2.map(r=>r.itemId),82:PLAN82_RECORDS_V2.map(r=>r.itemId)};
const configs=[{name:'narrow',width:360,height:740,enlarged:false},{name:'narrow-enlarged',width:360,height:740,enlarged:true},{name:'wide',width:1093,height:740,enlarged:false}];
const server=await createServer({configFile:false,root:process.cwd(),server:{host:'127.0.0.1',port:0,strictPort:true},logLevel:'error'}); let browser;
const results=[], errors=[];
try {
 await server.listen(); const base=`http://127.0.0.1:${server.httpServer.address().port}/reports/development/plan-87-capability-aware-practice-selection/measurement-harness.html`;
 browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});
 for(const config of configs){const context=await browser.newContext({viewport:{width:config.width,height:config.height}});const page=await context.newPage();page.on('pageerror',e=>errors.push(`${config.name}: ${e.message}`));
 for(const [family,items] of Object.entries(families))for(const item of [items[0],items[14],items[29]]){
  const page=await context.newPage();page.on('pageerror',e=>errors.push(config.name + ': ' + e.message));
  await page.goto(`${base}?family=${family}&item=${encodeURIComponent(item)}`);
  if(config.enlarged) await page.addStyleTag({content:'html { font-size: 200% !important; }'});
  const button=page.locator('[data-practice-type]').first();if(!(await button.isVisible()))await page.getByRole('button',{name:'Choose what to practice'}).click();await button.click();
  const obs=await page.evaluate(()=>{const episode=document.querySelector('.app-episode'),host=document.querySelector('.app-visual-view');const rect=e=>{if(!e)return null;const r=e.getBoundingClientRect();return {width:r.width,height:r.height,x:r.x,y:r.y,clientWidth:e.clientWidth,scrollWidth:e.scrollWidth};}; const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&!e.closest('[hidden]');};const controls=[...host.querySelectorAll('button,input,select')].filter(visible).map(e=>({tag:e.tagName,label:e.getAttribute('aria-label')||e.textContent.trim()||e.id,...rect(e)}));return {item:window.measurementApp.getState()?.taskContext?.itemId,beat:window.measurementApp.getState()?.beat,rootFont:getComputedStyle(document.documentElement).fontSize,episode:rect(episode),workingArea:rect(host),documentWidth:document.documentElement.clientWidth,documentScrollWidth:document.documentElement.scrollWidth,controls};});
  if(obs.item!==item)throw Error(`identity mismatch ${family}/${item}/${obs.item}`);results.push({config:config.name,family:Number(family),...obs}); await page.close();
 }
 await context.close(); console.log(`${config.name}: ${results.length} total observations`);
 }
 await writeFile('reports/development/plan-87-capability-aware-practice-selection/measurement-observations.json',JSON.stringify({method:'Initial visible episode only; real registered item and real app mounted via report-local single-item injection. CSS root enlargement is not browser zoom.',browser:browser.version(),configs,results,errors},null,2)+'\n');if(errors.length)throw Error(errors.join('\n'));
} finally {await browser?.close();await server.close();}
