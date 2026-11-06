import { chromium } from 'playwright';
import { createServer } from 'vite';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs/promises';
const out=fileURLToPath(new URL('.',import.meta.url));
const server=await createServer({server:{host:'127.0.0.1',port:5198,strictPort:true}}); await server.listen();
const browser=await chromium.launch({headless:true,executablePath:process.env.FF67_CHROME});
const results=[];
try {
 const hashes={}; for(const f of ['src/app/app.js','src/app/styles.css','src/app/entry-projection.js']) hashes[f]=createHash('sha256').update(await fs.readFile(f)).digest('hex');
 results.push({capturedAt:new Date().toISOString(),hashes});
 for(const [width,height] of [[360,740],[1093,614]]) for(const scale of [100,200]) {
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  await page.clock.setFixedTime(new Date('1970-01-01T12:00:00Z'));
  await page.goto('http://127.0.0.1:5198/FractionFlow/');
  await page.evaluate(scale=>document.documentElement.style.fontSize=`${scale}%`,scale);
  const primary=page.getByRole('button',{name:'Add fractions with different denominators',exact:true}).first();
  const label=page.locator('.app-featured-label'),chooser=page.locator('[data-entry-chooser]');
  if(await page.locator('.app-entry-line').innerText()!=='Explore fractions with pictures and numbers.') throw Error('subtitle');
  if(await label.innerText()!=='Featured today') throw Error('featured label');
  if(!await label.evaluate(e=>e.nextElementSibling?.matches('[data-entry-role="primary"]'))) throw Error('label placement');
  const geometry=await page.evaluate(()=>{const a=document.querySelector('.app-featured-label').getBoundingClientRect(),b=document.querySelector('[data-entry-role="primary"]').getBoundingClientRect();return {labelBottom:a.bottom,buttonTop:b.top,scrollWidth:document.documentElement.scrollWidth,width:innerWidth}});
  if(geometry.labelBottom>geometry.buttonTop||geometry.scrollWidth>width) throw Error('layout bounds');
  await page.screenshot({path:`${out}entry-${width}-${scale}.png`,fullPage:true});
  await page.keyboard.press('Tab'); if(!await primary.evaluate(e=>e===document.activeElement)) throw Error('first tab');
  await page.keyboard.press('Tab'); if(!await chooser.evaluate(e=>e===document.activeElement)) throw Error('second tab');
  await page.keyboard.press('Tab'); if(!await page.locator('.app-entry-page .app-gear-button').evaluate(e=>e===document.activeElement)) throw Error('third tab');
  await primary.click(); if(await page.locator('.app-episode').getAttribute('data-current-item-id')!=='two-thirds-plus-one-fourth') throw Error('wrong item');
  await page.locator('.app-return-button').click();
  if(!await page.locator('.app-entry-title').evaluate(e=>e===document.activeElement)) throw Error('return focus');
  if(await primary.getAttribute('data-practice-type')!=='sum-under-one') throw Error('featured changed');
  results.push({width,height,scale,geometry,firstThreeTabs:true,correctItem:true,stableAfterReturn:true}); await page.close();
 }
 await fs.writeFile(`${out}browser-results.json`,JSON.stringify(results,null,2)); console.log(JSON.stringify(results));
} finally {await browser.close();await server.close();}
