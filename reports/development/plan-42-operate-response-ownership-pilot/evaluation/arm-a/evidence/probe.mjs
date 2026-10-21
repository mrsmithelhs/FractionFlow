import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const server = require('../../../../scripts/dev/run-route-matrix.js').createStaticServer();
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const baseUrl = "http://127.0.0.1:" + server.address().port + "/FractionFlow/";

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 360, height: 780 }, reducedMotion: 'reduce' });
const page = await context.newPage();
page.setDefaultTimeout(7000);
const receipt = { browser: 'Chrome channel via Playwright', inputMode: 'mouse/DOM fill', viewport: { width: 360, height: 780 }, reducedMotion: true, views: [] };
const check = (ok, message) => { if (!ok) throw new Error(message); };
try {
  await page.goto(baseUrl);
  await page.locator('[data-practice-type="unlike-denominator-subtraction"]').click();
  await page.locator('.app-visual-view .active-beat-controls button').click();
  await page.locator('#transform-num-input-left').fill('5');
  await page.locator('.app-visual-view .control-submit-btn').click();
  await page.locator('#transform-num-input-right').fill('2');
  await page.locator('.app-visual-view .control-submit-btn').click();
  await page.locator('.app-visual-view #operate-fraction-numerator-input').waitFor();
  const toggle = page.locator('.app-view-toggle');
  for (const [view, prefix] of [['visual', ''], ['linear', 'linear-']]) {
    if (view === 'linear') {
      await page.goto(baseUrl);
      await page.locator('[data-practice-type="unlike-denominator-subtraction"]').click();
      await page.locator('.app-visual-view .active-beat-controls button').click();
      await page.locator('#transform-num-input-left').fill('5');
      await page.locator('.app-visual-view .control-submit-btn').click();
      await page.locator('#transform-num-input-right').fill('2');
      await page.locator('.app-visual-view .control-submit-btn').click();
      await page.locator('.app-visual-view #operate-fraction-numerator-input').waitFor();
      await toggle.click();
    }
    const host = page.locator(`.app-${view}-view`);
    const num = host.locator(`#${prefix}operate-fraction-numerator-input`);
    const den = host.locator(`#${prefix}operate-fraction-denominator-input`);
    const button = host.locator('.control-fraction-response-wrapper .control-submit-btn');
    const group = host.locator('.control-fraction-response-wrapper');
    const help = host.locator('.active-beat-controls .app-secondary-button').filter({ hasText: 'Need help?' });
    check(await help.isVisible(), `${view}: task help visible at operate`);
    await help.click();
    check(await host.locator(`#${view}-subtraction-task-help`).isVisible(), `${view}: task help opens`);
    await host.locator('.active-beat-controls .app-secondary-button').filter({ hasText: 'Close help' }).click();
    if (view === 'visual') {
      await num.fill('3'); await den.fill('10');
      await toggle.click();
      check(await page.locator('#linear-operate-fraction-numerator-input').inputValue() === '3', 'visual draft copied to linear view');
      check(await page.locator('#linear-operate-fraction-denominator-input').inputValue() === '10', 'visual denominator draft copied to linear view');
      await toggle.click();
      check(await num.inputValue() === '3' && await den.inputValue() === '10', 'draft restored to visual view');
      await page.locator('.app-restart-button').click();
      await host.locator('.active-beat-controls button').click();
      await page.locator('#transform-num-input-left').fill('5');
      await page.locator('.app-visual-view .control-submit-btn').click();
      await page.locator('#transform-num-input-right').fill('2');
      await page.locator('.app-visual-view .control-submit-btn').click();
      check(await num.inputValue() === '' && await den.inputValue() === '', 'restart cleared the operation draft');
      receipt.draftAndReset = true;
      await num.fill('99'); await den.fill('10');
      await button.click();
      check((await host.locator('.recovery-feedback').textContent()).trim() === 'Check the parts left. Try again.', 'shell recovery feedback remains separate and unchanged');
      await page.locator('.app-restart-button').click();
      await host.locator('.active-beat-controls button').click();
      await page.locator('#transform-num-input-left').fill('5');
      await page.locator('.app-visual-view .control-submit-btn').click();
      await page.locator('#transform-num-input-right').fill('2');
      await page.locator('.app-visual-view .control-submit-btn').click();
      receipt.recoveryFeedbackUnchanged = true;
    }
    check((await group.getAttribute('aria-label')) === 'Your answer', `${view}: group label`);
    check((await button.textContent()).trim() === 'Check answer', `${view}: submit label`);
    await page.evaluate(([n,d]) => { document.querySelector(n).setAttribute('aria-describedby', 'existing-help-token'); document.querySelector(d).setAttribute('aria-describedby', 'other-token'); }, [`#${prefix}operate-fraction-numerator-input`, `#${prefix}operate-fraction-denominator-input`]);
    await button.click();
    const alert = host.locator('.control-fraction-error');
    const id = await alert.getAttribute('id');
    check(Boolean(id), `${view}: error has id`);
    for (const input of [num, den]) check((await input.getAttribute('aria-describedby')).split(/\s+/).includes(id), `${view}: alert associated`);
    const idsFirst = await page.locator('.control-fraction-error').evaluateAll(es => es.map(e => e.id));
    await button.click();
    const idsSecond = await page.locator('.control-fraction-error').evaluateAll(es => es.map(e => e.id));
    check(JSON.stringify(idsFirst) === JSON.stringify(idsSecond), `${view}: repeated submit stable ids`);
    check((await num.getAttribute('aria-describedby')).split(/\s+/).filter(x => x === id).length === 1, `${view}: no duplicate token`);
    if (view === 'visual') await page.screenshot({ path: 'reports/development/plan-42-maintenance-arm/evidence/visual-invalid.png', fullPage: true });
    await num.fill('3');
    check((await num.getAttribute('aria-describedby')).includes('existing-help-token'), `${view}: preserved unrelated numerator description`);
    check(!(await num.getAttribute('aria-describedby') || '').split(/\s+/).includes(id), `${view}: clear on input removes alert token`);
    check((await den.getAttribute('aria-describedby')) === 'other-token', `${view}: preserves denominator description`);
    await button.click();
    await num.evaluate((el) => { el.value = '3'; });
    await den.evaluate((el) => { el.value = '10'; });
    await page.evaluate(([n, d]) => { window.__answerInputs = [document.querySelector(n), document.querySelector(d)]; }, [`#${prefix}operate-fraction-numerator-input`, `#${prefix}operate-fraction-denominator-input`]);
    await button.click();
    check(await host.locator('.control-fraction-error').count() === 0, `${view}: valid submit clears local alert as operation resolves`);
    check(await page.evaluate((token) => window.__answerInputs.every(el => !(el.getAttribute('aria-describedby') || '').split(/\s+/).includes(token)), id), `${view}: valid submit cleans alert token before rerender`);
    if (view === 'linear') await page.screenshot({ path: 'reports/development/plan-42-maintenance-arm/evidence/linear-valid.png', fullPage: true });
    receipt.views.push({ view, label: 'Your answer', submit: 'Check answer', alertId: id, malformedRepeated: true, unrelatedTokensPreserved: true, clearOnInput: true, validSubmitCleanup: true });
  }
  // Return visual, verify help/recovery/reset affordances and reduced-motion / width.
  await toggle.click();
  const rect = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, motion: matchMedia('(prefers-reduced-motion: reduce)').matches }));
  check(rect.width === 360 && rect.scrollWidth <= 360 && rect.motion, '360px/reduced motion');
  receipt.viewportResult = rect;
  receipt.limitations = ['Mouse/DOM-fill browser input only; no physical touch or assistive technology validation.', 'Valid answer traversed actual mounted local controls; no episode state was injected.'];
} finally { await fs.writeFile('reports/development/plan-42-maintenance-arm/evidence/browser-receipt.json', JSON.stringify(receipt, null, 2)); await context.close(); await browser.close(); await new Promise(resolve => server.close(resolve)); }



