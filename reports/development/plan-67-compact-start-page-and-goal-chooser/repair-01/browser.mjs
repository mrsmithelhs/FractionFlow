import { chromium } from 'playwright';
import { createServer } from 'vite';
import { createHash } from 'node:crypto';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const out = fileURLToPath(new URL('.', import.meta.url));
const server = await createServer({server:{host:'127.0.0.1',port:5198,strictPort:true}}); await server.listen();
const browser = await chromium.launch({headless:true,executablePath:process.env.FF67_CHROME});
const results=[];
try {
 const hashes={}; for(const f of ['src/app/app.js','src/app/entry-projection.js','src/app/styles.css']) hashes[f]=createHash('sha256').update(await fs.readFile(f)).digest('hex');
 results.push({capturedAt:new Date().toISOString(),hashes});
 for (const [day,id,item] of [[0,'sum-under-one','two-thirds-plus-one-fourth'],[1,'symbolic-fraction-comparison','plan45-compare-01']]) {
  for (const scale of [100,200]) {
   const page = await browser.newPage({viewport:{width:360,height:740},reducedMotion:'reduce'});
   await page.clock.setFixedTime(new Date(`1970-01-0${day+1}T12:00:00Z`));
   await page.goto('http://127.0.0.1:5198/FractionFlow/');
   await page.evaluate(scale=>document.documentElement.style.fontSize=`${scale}%`,scale);
   const primary=page.locator('[data-entry-role="primary"]'), chooser=page.locator('[data-entry-chooser]');
   if(await primary.getAttribute('data-practice-type')!==id) throw Error(`day ${day} featured wrong`);
   const label=await primary.innerText();
   const bounds=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth})); if(bounds.scrollWidth>bounds.width) throw Error('overflow');
   await page.screenshot({path:`${out}day-${day}-text-${scale}.png`,fullPage:true});
   await page.clock.setFixedTime(new Date('1970-01-04T12:00:00Z'));
   await primary.click(); if(await page.locator('.app-episode').getAttribute('data-current-item-id')!==item) throw Error('featured wrong item');
   await page.locator('.app-return-button').click();
   if(!(await page.locator('.app-entry-title').evaluate(e=>e===document.activeElement)) || await chooser.getAttribute('aria-expanded')!=='false') throw Error('return failed');
   await page.keyboard.press('Tab'); if(!(await primary.evaluate(e=>e===document.activeElement))) throw Error('first tab');
   await chooser.click(); const other = id==='sum-under-one'?'symbolic-fraction-comparison':'sum-under-one';
   await page.locator(`[data-entry-role="browse"][data-practice-type="${other}"]`).click();
   const otherItem=await page.locator('.app-episode').getAttribute('data-current-item-id');
   if(otherItem!==(other==='sum-under-one'?'two-thirds-plus-one-fourth':'plan45-compare-01')) throw Error('browse wrong item');
   await page.locator('.app-return-button').click();
   if(await primary.getAttribute('data-practice-type')!==id || await chooser.getAttribute('aria-expanded')!=='false') throw Error('rotation changed on return');
   results.push({day,id,item,otherItem,scale,label,bounds,returnAndFirstTab:true,stableAfterDateChange:true}); await page.close();
  }
 }
 await fs.writeFile(`${out}browser-results.json`,JSON.stringify(results,null,2)); console.log(JSON.stringify(results));
} finally { await browser.close(); await server.close(); }
