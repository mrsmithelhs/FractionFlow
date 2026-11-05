import { chromium } from 'playwright';
import { createServer } from 'vite';
import { PRACTICE_TYPES } from '../../../src/app/practice-types.js';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = fileURLToPath(new URL('.', import.meta.url));
const server = await createServer({server:{host:'127.0.0.1',port:5198,strictPort:true}}); await server.listen();
const browser = await chromium.launch({headless:true, executablePath: process.env.FF67_CHROME});
const sourceHashes = {};
for (const path of ['src/app/app.js','src/app/styles.css','src/app/entry-projection.js']) sourceHashes[path] = createHash('sha256').update(await fs.readFile(path)).digest('hex');
const results = [{ capturedAt: new Date().toISOString(), sourceHashes }];
try {
 for (const [width,height] of [[360,740],[1093,614]]) {
  for (const scale of [100,200]) {
   const page = await browser.newPage({ viewport:{width,height}, reducedMotion:'reduce' });
   await page.goto('http://127.0.0.1:5198/FractionFlow/');
   await page.evaluate(scale => document.documentElement.style.fontSize = `${scale}%`, scale);
   const title = page.locator('.app-entry-title'), chooser = page.locator('[data-entry-chooser]');
   await page.screenshot({path:`${root}entry-${width}-${scale}-closed.png`,fullPage:true});
   if (!(await page.locator('.app-gear-button').isVisible()) || !(await page.locator('.app-about-link').isVisible())) throw Error('secondary controls not visible');
   await page.keyboard.press('Tab'); if (await page.locator(':focus').getAttribute('data-entry-role') !== 'primary') throw Error('first Tab');
   await page.keyboard.press('Tab'); if (!(await chooser.evaluate(e=>e===document.activeElement))) throw Error('second Tab');
   await page.keyboard.press('Enter'); if (await chooser.getAttribute('aria-expanded') !== 'true') throw Error('chooser did not open');
   const geometry = await page.evaluate(() => {const t=document.querySelector('.app-entry-title').getBoundingClientRect(); return { title: {left:t.left,right:t.right,top:t.top,bottom:t.bottom}, viewport:innerWidth, scrollWidth:document.documentElement.scrollWidth };});
   if (geometry.title.left < 0 || geometry.title.right > width || geometry.scrollWidth > width) throw Error(`overflow ${JSON.stringify(geometry)}`);
   await page.screenshot({path:`${root}entry-${width}-${scale}.png`,fullPage:true});
   if (!(await chooser.evaluate(e => e === document.activeElement))) throw Error('toggle lost focus');
   await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
   if (await page.locator('.app-episode').getAttribute('data-current-item-id') !== 'two-thirds-plus-one-fourth') throw Error('keyboard goal identity');
   await page.locator('.app-return-button').click();
   if (!(await title.evaluate(e=>e===document.activeElement)) || await chooser.getAttribute('aria-expanded') !== 'false') throw Error('return focus/closure');
   results.push({width,height,scale,geometry,keyboardLaunch:true,returnFocus:true});
   await page.close();
  }
 }
 const page = await browser.newPage();
 await page.goto('http://127.0.0.1:5198/FractionFlow/');
 const zoomBefore = await page.evaluate(() => ({dpr:devicePixelRatio,width:innerWidth}));
 await page.keyboard.press('Control++');
 const zoomAfter = await page.evaluate(() => ({dpr:devicePixelRatio,width:innerWidth}));
 results.push({browserZoomAttempt:{before:zoomBefore,after:zoomAfter,verified:zoomBefore.dpr !== zoomAfter.dpr || zoomBefore.width !== zoomAfter.width}});
 for (const type of PRACTICE_TYPES) {
  await page.goto('http://127.0.0.1:5198/FractionFlow/');
  await page.locator('[data-entry-chooser]').click();
  await page.locator(`[data-entry-role="browse"][data-practice-type="${type.id}"]`).click();
  const item = await page.locator('.app-episode').getAttribute('data-current-item-id');
  if (item !== type.items[0].id) throw Error(`${type.id}: ${item} != ${type.items[0].id}`);
  results.push({id:type.id,item});
 }
 await page.goto('http://127.0.0.1:5198/FractionFlow/');
 await page.locator('[data-entry-chooser]').click(); await page.locator('[data-session-entry="magnitude"]').click();
 const item=await page.locator('.app-episode').getAttribute('data-current-item-id'); if(item!=='plan45-compare-02') throw Error(`session ${item}`);
 results.push({session:'short-magnitude-practice',item});
 await fs.writeFile(`${root}entry-browser-results.json`,JSON.stringify(results,null,2));
 console.log(JSON.stringify(results));
} finally { await browser.close(); await server.close(); }
