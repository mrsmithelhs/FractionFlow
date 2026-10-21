import { chromium } from 'playwright';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createStaticServer } = require('../../../scripts/dev/run-route-matrix.js');
import fs from 'node:fs/promises';
import path from 'node:path';
const out = path.resolve('reports/development/plan-42-maintenance-arm');
const server = createStaticServer();
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0,'127.0.0.1',resolve); });
const baseUrl = 'http://127.0.0.1:' + server.address().port + '/FractionFlow/';
let browser;
const receipt={browser:'Chrome channel, headless Chromium via Playwright', viewport:{width:360,height:740}, inputMode:'Playwright pointer and fill (touch emulation not enabled)', assertions:[], screenshots:[]};
const ok=(name,condition,details={})=>{if(!condition) throw new Error(name); receipt.assertions.push({name,pass:true,...details});};
try {
  const response=await fetch(baseUrl);
  ok('built static server serves registered app',response.ok);
  browser=await chromium.launch({channel:'chrome',headless:true});
  for(const view of ['visual','linear']){
    const context=await browser.newContext({viewport:{width:360,height:740},reducedMotion:'reduce'});
    const page=await context.newPage(); await page.goto(baseUrl);
    await page.locator('[data-practice-type="like-denominator-subtraction"]').click();
    if(view==='linear') await page.locator('.app-view-toggle').click();
    const host=`.app-${view}-view`;
    const op=page.locator(`${host} .active-beat-controls button`).first();
    await op.click(); await op.click();
    const n=page.locator(`${host} input.control-fraction-input`).nth(0), d=page.locator(`${host} input.control-fraction-input`).nth(1);
    await n.waitFor({state:'visible'});
    const group=page.locator(`${host} .control-fraction-response-wrapper`);
    ok(`${view}: learner-facing group and check copy`, (await group.getAttribute('aria-label'))==='Your answer' && (await page.locator(`${host} .control-submit-btn`).innerText())==='Check answer');
    await n.evaluate(e=>e.setAttribute('aria-describedby','learner-hint unrelated-token'));
    await d.evaluate(e=>e.setAttribute('aria-describedby','other-hint'));
    await page.locator(`${host} .control-submit-btn`).click();
    const alert=page.locator(`${host} .control-fraction-error`); const alertId=await alert.getAttribute('id');
    ok(`${view}: malformed local alert associated to both fields`, Boolean(alertId) && (await n.getAttribute('aria-describedby')).split(/\s+/).includes(alertId) && (await d.getAttribute('aria-describedby')).split(/\s+/).includes(alertId),{alertId});
    await page.locator(`${host} .control-submit-btn`).click();
    ok(`${view}: repeated invalid submit keeps unique alert and one token`, await page.locator(`${host} .control-fraction-error`).count()===1 && (await n.getAttribute('aria-describedby')).split(/\s+/).filter(x=>x===alertId).length===1 && await page.locator(`[id="${alertId}"]`).count()===1);
    await n.fill('1');
    ok(`${view}: input clears alert association and retains other descriptions`, !(await n.getAttribute('aria-describedby')).split(/\s+/).includes(alertId) && (await n.getAttribute('aria-describedby')).includes('learner-hint') && (await d.getAttribute('aria-describedby')).includes('other-hint') && !(await d.getAttribute('aria-describedby')).split(/\s+/).includes(alertId));
    await d.fill('5'); await page.locator(`${host} .control-submit-btn`).click();
    ok(`${view}: valid submit clears local error association`, !(await n.getAttribute('aria-describedby')||'').split(/\s+/).includes(alertId) && !(await d.getAttribute('aria-describedby')||'').split(/\s+/).includes(alertId));
    // Drafts survive representation switch through the real view control.
    const nextN=page.locator(`${host} input.control-fraction-input`).nth(0);
    await nextN.fill('3'); await page.locator(`${host} input.control-fraction-input`).nth(1).fill('8');
    await page.locator('.app-view-toggle').click();
    const newHost=view==='visual'?'.app-linear-view':'.app-visual-view';
    ok(`${view}: operation drafts preserved across view switch`, await page.locator(`${newHost} input.control-fraction-input`).nth(0).inputValue()==='3' && await page.locator(`${newHost} input.control-fraction-input`).nth(1).inputValue()==='8');
    await page.locator(`${newHost} button`).filter({hasText:'Need help?'}).click();
    ok(`${view}: help/recovery copy remains mounted`, await page.locator(`${newHost} .active-beat-help`).count()===1);
    // Focused viewport and reduced-motion observations in mounted operate state.
    const measure=await page.evaluate(()=>({width:document.documentElement.clientWidth,scrollWidth:document.documentElement.scrollWidth,reduced:matchMedia('(prefers-reduced-motion: reduce)').matches, visibleInputs:[...document.querySelectorAll('.app-linear-view input.control-fraction-input,.app-visual-view input.control-fraction-input')].filter(e=>e.getClientRects().length).length}));
    ok(`${view}: 360px no horizontal overflow and reduced motion preference`,measure.width===360&&measure.scrollWidth===360&&measure.reduced,{measure});
    const shot=path.join(out,`${view}-operate-help.png`); await page.screenshot({path:shot,fullPage:true}); receipt.screenshots.push(shot);
    await page.locator('.app-restart-button').click();
    ok(`${view}: restart resets to the registered initial encounter`,
      await page.locator('.app-visual-view .control-fraction-error,.app-linear-view .control-fraction-error').count()===0
      && await page.locator('.app-episode').getAttribute('hidden')===null);
    await context.close();
  }
  await fs.writeFile(path.join(out,'browser-receipt.json'),JSON.stringify(receipt,null,2));
  console.log(JSON.stringify(receipt,null,2));
} finally {if(browser) await browser.close(); await new Promise(resolve=>server.close(resolve));}




