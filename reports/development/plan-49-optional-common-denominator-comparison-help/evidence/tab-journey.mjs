import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:360,height:740},reducedMotion:'reduce'});
await page.goto('http://127.0.0.1:5199/FractionFlow/');
await page.locator('[data-practice-type="symbolic-fraction-comparison"]').click();
await page.evaluate(()=>document.activeElement.blur());
const focusLog=[];
async function tabUntil(selector, limit=35) {
 for(let i=0;i<limit;i++){
  await page.keyboard.press('Tab');
  const item=await page.evaluate(sel=>{const e=document.activeElement;return {tag:e.tagName,text:(e.textContent||'').trim().slice(0,80),connected:e.isConnected,match:e.matches(sel)};},selector);
  focusLog.push(item); if(item.match) return;
 }
 throw Error(`Tab did not reach ${selector}`);
}
await tabUntil('.app-visual-view summary.plan45-help-summary'); await page.keyboard.press('Enter');
await tabUntil('.app-visual-view .plan49-construction button');
assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Use the same denominator'); await page.keyboard.press('Enter');
assert.equal(await page.evaluate(()=>document.activeElement.matches('.app-visual-view .plan49-helper-input') && document.activeElement.isConnected),true);
await page.getByRole('textbox',{name:'Choose a denominator both fractions can use.'}).waitFor();
await page.keyboard.type('15'); await tabUntil('.app-visual-view .plan49-helper-form button[type="submit"]'); await page.keyboard.press('Enter');
assert.equal(await page.evaluate(()=>document.activeElement.matches('.app-visual-view .plan49-helper-input') && document.activeElement.isConnected),true);
const renamed=page.getByRole('textbox',{name:/How many parts out of 15 make the same amount as 2 over 3/}); await renamed.waitFor();
await page.keyboard.type('10'); await tabUntil('.app-visual-view .plan49-helper-form button[type="submit"]'); await page.keyboard.press('Enter');
assert.equal(await page.evaluate(()=>document.activeElement.matches('.app-visual-view .plan49-helper-input') && document.activeElement.isConnected),true);
await page.getByRole('textbox',{name:/How many parts out of 15 make the same amount as 3 over 5/}).waitFor();
await writeFile('reports/development/plan-49-optional-common-denominator-comparison-help/evidence/tab-journey.json',JSON.stringify({completed:true,focusedTransitionsConnected:true,accessibleNamesVerified:true,focusLog},null,2)+'\n');
await browser.close();
