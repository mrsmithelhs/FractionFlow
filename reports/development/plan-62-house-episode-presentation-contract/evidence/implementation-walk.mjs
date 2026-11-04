import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
const dir='reports/development/plan-62-house-episode-presentation-contract/evidence';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','5227','--strictPort']);
const results=[];
try {
 await new Promise((ok,fail)=>{server.stdout.on('data',s=>{if(String(s).includes('Local:'))ok()});server.on('exit',()=>fail(Error('server exited')))});
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 for(const [name,viewport,large,linear] of [['narrow',{width:360,height:740},false,false],['chromebook',{width:1093,height:614},false,true],['large',{width:360,height:740},true,true]]){
  const page=await browser.newPage({viewport,reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:5227/FractionFlow/'); if(large) await page.addStyleTag({content:'html {font-size:200% !important}'});
  await page.locator('[data-session-entry="magnitude"]').click(); if(linear) await page.locator('.app-view-toggle').click();
  let host=page.locator(linear?'.app-linear-view':'.app-visual-view');
  const capture=async label=>{await page.screenshot({path:`${dir}/${name}-${label}.png`});const m=await host.evaluate(e=>{const r=e.firstElementChild;const rect=x=>{const b=x.getBoundingClientRect();return {x:b.x,y:b.y,width:b.width,height:b.height}};const q=s=>r.querySelector(s);return {root:rect(r),help:q('.plan45-help')&&rect(q('.plan45-help')),form:q('form')&&rect(q('form')),focus:document.activeElement?.outerHTML.slice(0,250),scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,children:[...r.children].map(n=>n.className),gap:getComputedStyle(r).gap}});results.push({name,label,...m});};
  await capture('comparison-initial');
  await host.locator('.plan45-help-summary').click(); await host.locator('.plan45-help-choices button').first().click();
  await host.locator('.plan45-relation-option input[value="<"]').check(); await host.locator('.plan45-response-region button[type=submit]').click(); await capture('comparison-retry');
  for(const [idx,answer] of [['02','>'],['08','<'],['11','=']]){
    assert.ok((await page.locator('.app-episode').getAttribute('data-current-item-id')).endsWith(idx));
    await host.locator(`.plan45-relation-option input[value="${answer}"]`).check(); await host.locator('.plan45-response-region button[type=submit]').click(); await host.locator('.plan45-progression-button').click();
  }
  await capture('distance-compare');
  await host.locator('.plan45-help-summary').focus(); await page.keyboard.press('Tab'); assert.equal(await page.evaluate(()=>document.activeElement.type),'radio');
  assert.equal(await host.locator('.plan45-expression-separator').innerText(),'?');
  await host.locator('.plan45-help-summary').click(); await host.getByRole('button',{name:'Symbol tip'}).click();
  assert.equal(await page.evaluate(()=>document.activeElement.className),'plan45-help-summary');
  await host.locator('.plan45-relation-option input[value=">"]').check(); await host.locator('.plan51-response button[type=submit]').click(); await capture('distance-retry');
  assert.ok(await host.locator('.plan45-relation-group').getAttribute('aria-describedby'));
  await host.locator('.plan45-relation-option input[value="<"]').check(); await host.locator('.plan51-response button[type=submit]').click();
  assert.equal(await page.evaluate(()=>document.activeElement.dataset.plan51Focus),'numerator'); await capture('distance-fields');
  await host.locator('[data-plan51-focus=numerator]').focus(); await host.locator('.plan45-help-summary').focus(); await page.locator('.app-view-toggle').click(); host=page.locator(linear?'.app-visual-view':'.app-linear-view'); results.push({name,label:'help-to-view-switch',focus:await page.evaluate(()=>document.activeElement.outerHTML.slice(0,250))}); await page.locator('.app-view-toggle').click(); host=page.locator(linear?'.app-linear-view':'.app-visual-view');
  await host.locator('[data-plan51-focus=numerator]').fill('3'); await host.locator('[data-plan51-focus=denominator]').fill('8'); await host.locator('.plan51-response button[type=submit]').click();
  assert.ok(await host.locator('[data-plan51-focus=numerator]').getAttribute('aria-describedby'));
  await host.locator('[data-plan51-focus=numerator]').focus(); await page.locator('.app-view-toggle').click(); host=page.locator(linear?'.app-visual-view':'.app-linear-view');
  assert.equal(await host.locator('[data-plan51-focus=numerator]').inputValue(),'3'); assert.equal(await page.evaluate(()=>document.activeElement.dataset.plan51Focus),'numerator');
  await host.locator('[data-plan51-focus=numerator]').fill('4'); await host.locator('.plan51-response button[type=submit]').focus(); await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(()=>document.activeElement.className),'plan51-next'); await capture('distance-success');
  assert.match(await host.locator('.plan51-next').innerText(),/Back to practice/); await host.locator('.plan51-next').click();
  await page.goto('http://127.0.0.1:5227/FractionFlow/#fraction-distance'); host=page.locator('.app-visual-view:visible, .app-linear-view:visible'); assert.equal(await host.locator('.plan45-expression-separator').innerText(),'?');
  await host.locator('.plan45-relation-option input[value="<"]').check(); await host.locator('.plan51-response button[type=submit]').click(); await host.locator('[data-plan51-focus=numerator]').fill('4'); await host.locator('[data-plan51-focus=denominator]').fill('8'); await host.locator('.plan51-response button[type=submit]').click(); assert.match(await host.locator('.plan51-next').innerText(),/Next problem/); await host.locator('.plan51-next').click();
  assert.equal(await page.locator('.app-episode').getAttribute('data-current-item-id'),'distance-02'); await page.close();
 }
 await browser.close(); await writeFile(`${dir}/implementation-walk.json`,JSON.stringify(results,null,2));
} finally {server.kill()}
