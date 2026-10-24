// Parent-owned supplemental witness. Uses unmodified admitted records and app
// direct default; isolates late-set records rather than replaying eleven prefixes.
import { createServer } from 'vite';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const output = path.dirname(fileURLToPath(import.meta.url));
const server = await createServer({ base: '/', server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 360, height: 752 }, reducedMotion: 'reduce' });
  page.setDefaultTimeout(6000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/__review-addition-identify', (route) => route.fulfill({
    contentType: 'text/html',
    body: `<html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head>
      <body><div id="app"></div><script type="module">
      import '/src/app/styles.css'; import '/src/styles/render.css';
      import { createFractionFlowApp } from '/src/app/app.js';
      import { PRACTICE_TYPES } from '/src/app/practice-types.js';
      const registered = PRACTICE_TYPES.find(p => p.id === 'sum-under-one');
      const ids = ['nested-one-half-plus-three-eighths', 'nested-three-eighths-plus-one-half'];
      const items = ids.map(id => registered.items.find(item => item.id === id));
      if (items.some(item => !item)) throw new Error('Missing admitted identify record');
      window.reviewApp = createFractionFlowApp({root:document.querySelector('#app'),
        practiceTypes:[{...registered, items}]}).mount();
      </script></body></html>`,
  }));
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/__review-addition-identify`);
  await page.locator('[data-practice-type="sum-under-one"]').click();
  const host = '.app-visual-view';
  await page.locator(`${host} .control-btn`).click();
  await page.locator(`${host} .nested-side-choice[aria-label^="First fraction"]`).click();
  await page.locator('#transform-num-input-left').fill('4');
  await page.locator(`${host} .control-submit-btn`).click();
  await page.locator('#operate-sum-input').fill('7');
  await page.locator(`${host} .control-submit-btn`).click();
  const before = await page.evaluate(() => ({
    item: document.querySelector('.app-episode').getAttribute('data-current-item-id'),
    beat: reviewApp.getState().beat,
    pattern: reviewApp.getState().taskContext.patternId,
    focusedText: document.activeElement.textContent,
  }));
  assert.equal(before.item, 'nested-one-half-plus-three-eighths');
  assert.equal(before.beat, 'resolve');
  assert.equal(before.pattern, 'full-addition.identify-side-construct');
  assert.equal(before.focusedText, 'Next problem');
  await page.screenshot({ path: path.join(output, 'addition-identify-before.png'), fullPage: true });
  await page.keyboard.press('Enter');
  const after = await page.evaluate(() => ({
    item: document.querySelector('.app-episode').getAttribute('data-current-item-id'),
    beat: reviewApp.getState().beat,
    historyLength: reviewApp.getState().intentHistory.length,
    recovery: reviewApp.getState().lastRecovery,
    focusedOnEpisode: document.activeElement === document.querySelector('.app-episode'),
    headerNextHidden: document.querySelector('.app-next-button').hidden,
  }));
  assert.equal(after.item, 'nested-three-eighths-plus-one-half');
  assert.equal(after.beat, 'encounter');
  assert.equal(after.historyLength, 0);
  assert.equal(after.recovery, null);
  assert.equal(after.focusedOnEpisode, true);
  assert.equal(after.headerNextHidden, true);
  assert.deepEqual(errors, []);
  await page.screenshot({ path: path.join(output, 'addition-identify-after.png'), fullPage: true });
  const result = { capturedAt: new Date().toISOString(), browser: 'installed Chrome',
    viewport: { width: 360, height: 752 }, reducedMotion: true,
    composition: 'Admitted two-record subset; same current app direct default, no record/definition changes',
    input: 'mouse setup and keyboard Enter continuation', before, after, pageErrors: errors };
  fs.writeFileSync(path.join(output, 'addition-identify-browser-check.json'), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result));
} finally {
  await browser.close();
  await server.close();
}
