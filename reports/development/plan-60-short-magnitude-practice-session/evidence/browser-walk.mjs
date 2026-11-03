import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5214','--strictPort'],{stdio:'pipe'});
await new Promise((resolve,reject)=>{ server.stdout.on('data', x=>{if(String(x).includes('Local:')) resolve()}); server.on('exit',()=>reject(Error('server exited'))); });
process.on('uncaughtException', error => { console.error(error); server.kill(); process.exit(1); });
const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
for (const [name, viewport, scale, linear] of [['narrow',{width:360,height:740},1,false],['chromebook',{width:1093,height:614},1.25,true]]) {
 const context=await browser.newContext({viewport,deviceScaleFactor:scale,reducedMotion:'reduce'}); const page=await context.newPage();
 await page.goto('http://127.0.0.1:5214/FractionFlow/');
 if(name==='narrow') await page.addStyleTag({content:'html { font-size: 200% !important; }'});
 await page.evaluate(() => { window.__writes=[]; const original=Storage.prototype.setItem; Storage.prototype.setItem=function(...a){window.__writes.push(a[0]);return original.apply(this,a)}; });
 await page.locator('[data-session-entry="magnitude"]').click();
 if(linear) await page.locator('.app-view-toggle').click();
 const host=page.locator(linear?'.app-linear-view':'.app-visual-view');
 for (const [id,answer] of [['plan45-compare-02','>'],['plan45-compare-08','<'],['plan45-compare-11','=']]) {
  assert.equal(await page.locator('.app-episode').getAttribute('data-current-item-id'),id);
  if(id.endsWith('02')) { await host.locator('.plan45-relation-option input[value="<"]').check(); await host.locator('.plan45-response-region').evaluate(e=>e.requestSubmit()); assert.equal(await page.locator('.app-episode').getAttribute('data-current-item-id'),id); }
  if(id.endsWith('08')) { await host.locator('.plan45-help-summary').click(); await host.getByText('Use the same denominator',{exact:true}).click(); await host.locator('.plan49-helper-input').fill('8'); await page.getByRole('button',{name:'Try this problem again'}).click(); assert.equal(await page.locator('.app-episode').getAttribute('data-current-item-id'),id); }
  const choice=host.locator(`.plan45-relation-option input[value="${answer}"]`); if(linear) { await choice.focus(); await page.keyboard.press('Space'); await host.locator('.plan45-response-region button[type=submit]').focus(); await page.keyboard.press('Enter'); } else { await choice.check(); await host.locator('.plan45-response-region').evaluate(e=>e.requestSubmit()); }
  if(id.endsWith('11')) assert.match(await host.locator('.plan45-progression-button').innerText(),/compare and find the distance/);
  if(linear) { await host.locator('.plan45-progression-button').focus(); await page.keyboard.press('Enter'); } else await host.locator('.plan45-progression-button').click();
 }
 assert.equal(await page.locator('.app-episode').getAttribute('data-current-item-id'),'distance-01');
 const relation=host.locator('.plan45-relation-option input[value="<"]'); if(linear) { await relation.focus(); await page.keyboard.press('Space'); await host.locator('.plan51-response button[type=submit]').focus(); await page.keyboard.press('Enter'); } else { await relation.check(); await host.locator('.plan51-response').evaluate(e=>e.requestSubmit()); }
 await host.locator('[data-plan51-focus="numerator"]').fill('4'); await host.locator('[data-plan51-focus="denominator"]').fill('8'); if(linear) await page.keyboard.press('Enter'); else await host.locator('.plan51-response').evaluate(e=>e.requestSubmit());
 assert.equal(await host.locator('.plan51-next').innerText(),'Back to practice');
 await page.screenshot({path:`reports/development/plan-60-short-magnitude-practice-session/evidence/${name}-final.png`});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'horizontal overflow');
 await host.locator('.plan51-next').click(); await page.locator('[data-session-entry="magnitude"]').click();
 await page.locator('.app-return-button').click(); assert.equal(await page.locator('[role=dialog]').isVisible(),true); await page.getByRole('button',{name:'Stay',exact:true}).click();
 await page.locator('.app-return-button').focus(); await page.evaluate(()=>{location.hash='fraction-distance'}); await page.waitForTimeout(100); assert.equal(await page.locator('[role=dialog]').isVisible(),true); await page.evaluate(()=>{location.hash='symbolic-fraction-comparison'}); await page.waitForTimeout(100); await page.getByRole('button',{name:'Stay',exact:true}).click(); assert.equal(await page.evaluate(()=>document.activeElement.classList.contains('app-return-button')),true); assert.equal(await page.evaluate(()=>location.hash),'');
 const writes=await page.evaluate(()=>window.__writes); assert.deepEqual(writes,[]); const cookies=await context.cookies(); assert.deepEqual(cookies,[]); const databases=await page.evaluate(()=>indexedDB.databases()); assert.deepEqual(databases,[]); await page.evaluate(()=>{location.hash='fraction-distance'}); await page.waitForTimeout(100); await page.getByRole('button',{name:'Leave',exact:true}).click(); assert.equal(await page.locator('.app-episode').getAttribute('data-current-item-id'),'distance-01'); await page.goto('http://127.0.0.1:5214/FractionFlow/'); await page.locator('[data-session-entry="magnitude"]').click(); await page.reload(); assert.equal(await page.locator('.app-entry-page').isVisible(),true);
 console.log(JSON.stringify({name,complete:true,earlyExitStay:true,hashStay:true,hashLeaveStandalone:true,reloadEntry:true,horizontalOverflow:false,observedStorageSetItem:writes, cookies:cookies.length,indexedDatabases:databases.length})); await context.close();
}
await browser.close(); server.kill();
