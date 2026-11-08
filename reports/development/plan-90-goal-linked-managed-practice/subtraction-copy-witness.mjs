import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const dir='reports/development/plan-90-goal-linked-managed-practice';
const base=`http://127.0.0.1:5199/FractionFlow/${dir}/integration-preview.html`;
const browser=await chromium.launch({headless:true,channel:'chrome',args:['--no-proxy-server']});
const runs=[];
try {
  for(const mode of ['managed','standalone']) for(const view of ['visual','linear']) {
    const page=await browser.newPage({viewport:{width:570,height:668}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`${base}?seed=3`);
    if(mode==='managed') await page.locator('[data-session-entry="comparison"]').click();
    else { await page.locator('[data-entry-chooser]').click(); await page.locator('[data-practice-type="unlike-denominator-subtraction"]').click(); }
    if(view==='linear') await page.locator('.app-view-toggle').click();
    const host=page.locator(`.app-${view}-view`),prefix=view==='linear'?'linear-':'';
    const before=await page.evaluate(()=>window.integrationApp.getState().taskContext.itemId);
    await host.locator('.active-beat-controls button').first().click();
    if(mode==='managed') {
      await host.locator('.nested-side-choice').nth(0).click();
      await host.locator(`#${prefix}transform-num-input-left`).fill('4');
      await host.locator('.control-submit-btn').click();
    } else {
      await host.locator(`#${prefix}transform-num-input-left`).fill('5');
      await host.locator('.control-submit-btn').click();
      await host.locator(`#${prefix}transform-num-input-right`).fill('2');
      await host.locator('.control-submit-btn').click();
    }
    await host.locator(`#${prefix}operate-fraction-numerator-input`).fill('3');
    await host.locator(`#${prefix}operate-fraction-denominator-input`).fill(mode==='managed'?'8':'10');
    await host.locator('.control-submit-btn').click();
    assert.equal(await host.locator('.active-beat-prompt').innerText(),"That's right.");
    const equation=await host.locator('.symbolic-expression').first().evaluate(node=>({text:node.textContent,html:node.outerHTML}));
    assert.ok(equation.text.includes('3') && equation.text.includes(mode==='managed'?'8':'10'),`Missing result: ${JSON.stringify(equation)}`);
    assert.ok(equation.html.includes(`3 over ${mode==='managed'?'8':'10'}`),'Missing accessible result');
    let bar=null;
    if(view==='visual') { bar=await host.locator('.fraction-bar-takeaway-container').getAttribute('aria-label'); assert.ok(bar); assert.ok(await host.locator('.fraction-bar-takeaway-track').isVisible()); }
    const result={mode,view,item:before,banner:await host.locator('.active-beat-prompt').innerText(),equation,bar,button:await host.locator('.active-beat-controls button').first().innerText()};
    await host.locator('.active-beat-controls button').first().click();
    result.nextItem=await page.evaluate(()=>window.integrationApp.getState().taskContext.itemId);
    assert.notEqual(result.nextItem,before);assert.deepEqual(errors,[]);runs.push(result);await page.close();
  }
  await writeFile(`${dir}/subtraction-copy-observations.json`,JSON.stringify({browser:browser.version(),viewport:{width:570,height:668},runs},null,2)+'\n');
  console.log('Verified managed and standalone accepted results in both views.');
} finally { await browser.close(); }
