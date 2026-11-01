import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true,channel:'msedge'});
const results=[];
for (const [name,viewport,deviceScaleFactor,touch] of [['narrow',{width:360,height:740},1,false],['chromebook',{width:1093,height:614},1.25,true]]) {
 const context=await browser.newContext({viewport,deviceScaleFactor,hasTouch:touch,isMobile:false,reducedMotion:'reduce'}); const page=await context.newPage();
 await page.goto('http://127.0.0.1:5199/FractionFlow/');
 if(touch) { await page.locator('.app-gear-button').tap(); await page.locator('[data-support-id="medium-support"]').tap(); }
 await page.locator('[data-practice-type="symbolic-fraction-comparison"]').click();
 const activate=async loc=>{if(touch) await loc.tap(); else await loc.press('Enter');};
 const host=page.locator('.app-visual-view'); await activate(host.locator('summary.plan45-help-summary'));
 await activate(host.getByRole('button',{name:'Model first amount'}));
 await activate(host.getByRole('button',{name:'Use the same denominator'}));
 await activate(host.getByRole('button',{name:'Help me find one'}));
 const fill=async n=>{const input=host.locator('.plan49-helper-input'); await input.fill(n);await activate(host.locator('.plan49-helper-form button[type=submit]'));};
 await fill('14'); assert.match(await host.locator('.plan49-helper-recovery').innerText(),/not a common/); await fill('15');
 await activate(host.getByRole('button',{name:'Help with this renaming'})); await fill('4'); await fill('5'); await fill('11'); await fill('10');
 await activate(host.getByRole('button',{name:'Change denominator'})); await fill('15'); await fill('10');
 await host.locator('.plan49-helper-input').fill('9'); await activate(host.locator('summary.plan45-help-summary')); await activate(host.locator('summary.plan45-help-summary')); assert.equal(await host.locator('.plan49-helper-input').inputValue(),'9');
 assert.equal(await host.locator('.plan45-model').count(),1); assert.equal(await host.locator('.plan49-accepted-form').count(),1);
 const question=host.locator('.plan49-helper-question'), input=host.locator('.plan49-helper-input'); await host.locator('.plan49-helper-form button[type=submit]').scrollIntoViewIfNeeded();
 const measure=await page.evaluate(()=>{const h=document.querySelector('.app-visual-view');const box=e=>{let r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,bottom:r.bottom}};return {question:box(h.querySelector('.plan49-helper-question')),input:box(h.querySelector('.plan49-helper-input')),check:box(h.querySelector('.plan49-helper-form button[type=submit]')),scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,scrollHeight:document.documentElement.scrollHeight};});
 assert.ok(measure.scrollWidth<=measure.clientWidth); await page.screenshot({path:`reports/development/plan-49-optional-common-denominator-comparison-help/evidence/${name}-second.png`});
 await activate(page.locator('.app-view-toggle')); const linear=page.locator('.app-linear-view'); assert.equal(await linear.locator('.plan49-helper-input').inputValue(),'9'); await activate(linear.locator('.plan49-helper-form button[type=submit]'));
 const relation=linear.locator('.plan45-relation-option input[value=">"]'); if(touch) await relation.tap(); else await relation.press('Space'); await activate(linear.locator('.plan45-check-button')); assert.equal(await linear.locator('.plan45-linear-model').count(),2); assert.equal(await linear.locator('.plan45-progression-button').count(),1);
 results.push({name,viewport,deviceScaleFactor,touchContext:touch,actionMode:touch?'non-drag touch activation':'keyboard activation',support:touch?'Less':'default More',measure,completed:true});await context.close();
}
await browser.close(); await writeFile('reports/development/plan-49-optional-common-denominator-comparison-help/evidence/browser-journeys.json',JSON.stringify(results,null,2)+'\n');
