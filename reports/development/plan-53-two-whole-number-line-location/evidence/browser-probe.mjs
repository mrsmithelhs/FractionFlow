import { createServer } from 'vite';
import { chromium } from 'playwright';
import { strict as assert } from 'node:assert';
import { writeFile } from 'node:fs/promises';
const server=await createServer({server:{host:'127.0.0.1',port:5295,strictPort:true}}); await server.listen();
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
 for (const config of [{width:360,height:740,dpr:1},{width:1093,height:614,dpr:1.25}]) {
  const context=await browser.newContext({viewport:{width:config.width,height:config.height},deviceScaleFactor:config.dpr,hasTouch:true});
  const page=await context.newPage(); const errors=[]; page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:5295/FractionFlow/#two-whole-location');
  for(const [index,n,d] of [[0,0,4],[1,3,4],[2,4,4],[3,5,4],[4,6,4],[5,3,2],[6,8,4],[7,10,8]]) {
   console.log('case',config.width,index,n,d);
   const host=page.locator('.app-visual-view:visible, .app-visual-host:visible');
   const axis=page.locator('.plan53-axis:visible'); await axis.waitFor();
   assert.equal(await page.locator('.plan53-bars:visible').count(),0);
   const box=await axis.boundingBox(); await page.mouse.click(box.x+Math.max(1,Math.min(box.width-1,box.width*n/(2*d))),box.y+box.height/2);
   await page.getByRole('button',{name:'Check',exact:true}).filter({visible:true}).click();
   await page.locator('.plan53-bar:visible').first().waitFor();
   const geometry=await page.evaluate(()=>{const a=document.querySelector('.plan53-axis');const bar=document.querySelector('.plan53-bar'); const mark=document.querySelector('.plan53-mark[data-candidate-id="step-10"]'); const x=a.getBoundingClientRect(), b=bar.getBoundingClientRect(); return {axisX:x.x,axisWidth:x.width,barX:b.x,barWidth:b.width,markCount:a.querySelectorAll('.plan53-mark').length,scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,step10:mark?.getBoundingClientRect().x, partialEnd:document.querySelectorAll('.plan53-bar')[1]?.querySelectorAll('.is-shaded')[1]?.getBoundingClientRect().right};});
   assert.ok(Math.abs(geometry.axisWidth/2-geometry.barWidth)<1, 'WITNESS_WHOLE_SCALE');assert.ok(Math.abs(geometry.axisX-geometry.barX)<1);assert.ok(geometry.scrollWidth<=geometry.viewport);
   if(n===10 && d===8) assert.ok(Math.abs((geometry.step10 + 1 - geometry.partialEnd)-geometry.axisWidth/2)<2, 'partial bar end must be one whole left of the line point');
   if (n === 10 && d === 8) await page.screenshot({path:`reports/development/plan-53-two-whole-number-line-location/evidence/accepted-eighths-${config.width}.png`,fullPage:true});
   results.push({config,index,n,d,geometry,spacing:box.width/(2*d)});
   const progression=page.locator('.plan53-location:visible [data-focus-key=next]');
   const nextBox=await progression.boundingBox(); assert.ok(nextBox.width>=44 && nextBox.height>=44);
   if(index<7) await progression.click();
   else assert.equal(await page.locator('.plan53-location:visible').getByRole('button',{name:'Back to start'}).count(),1);
  }
  assert.deepEqual(errors,[]); await context.close();
 }
 await writeFile('reports/development/plan-53-two-whole-number-line-location/evidence/browser-probe.json',JSON.stringify(results,null,2));
 console.log(JSON.stringify(results.filter(x=>x.d===8),null,2));
} finally {await browser.close();await server.close();}


