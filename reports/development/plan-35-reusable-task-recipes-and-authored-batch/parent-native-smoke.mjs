import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const server = await createServer({ server: { host: '127.0.0.1', port: 0, hmr: false } });
let browser;
const observations = [];
const errors = [];
try {
  await server.listen();
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 360, height: 740 } });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/`);
  await page.locator('.app-practice-button').first().click();
  const active = '.app-visual-view .active-beat-controls';
  const next = async () => page.locator(`${active} .control-btn`).first().click();
  const submit = async (selector, value) => {
    await page.locator(selector).fill(value);
    await page.locator(`${active} .control-submit-btn`).first().click();
  };
  await next();
  await submit('#transform-num-input-left', '8');
  await submit('#transform-num-input-right', '3');
  await submit('#operate-sum-input', '11');
  await next();
  assert.equal(await page.locator('.app-next-button').isVisible(), true);
  observations.push('Current root construct: accepted 8/12 + 3/12, sum 11/12, Finish and Next visible.');
  await page.locator('.app-next-button').click();
  await next();
  const change = page.locator(`${active} .inspect-change-button`);
  assert.equal(await change.isVisible(), true);
  await change.click();
  await submit('#transform-num-input-left', '0');
  assert.match(await page.locator('.app-visual-view .active-beat-section').innerText(), /Not quite\./);
  await submit('#transform-num-input-left', '6');
  await page.getByRole('button', { name: 'Keep new fraction 4 over 12', exact: true }).click();
  await submit('#operate-sum-input', '10');
  await next();
  assert.equal(await page.locator('.app-next-button').isVisible(), true);
  observations.push('Current root Next reaches inspection: repaired 5/12 to 6/12 after wrong 0, kept 4/12, accepted raw 10/12 and finished.');
  assert.deepEqual(errors, []);
  const dimensions = await page.evaluate(() => ({
    viewport: { width: innerWidth, height: innerHeight },
    documentWidth: document.documentElement.scrollWidth,
    documentHeight: document.documentElement.scrollHeight,
  }));
  assert.ok(dimensions.documentWidth <= dimensions.viewport.width);
  await writeFile(new URL('./parent-native-smoke-results.json', import.meta.url), JSON.stringify({
    entry: 'current Vite root, no injected state or fixture',
    browser: 'native Chrome via Playwright',
    observations, errors, dimensions,
    limits: 'Two prefix tasks only; no full-bank, new-target, motion or physical-device claim.',
  }, null, 2) + '\n');
  console.log(JSON.stringify({ passed: observations.length, dimensions, errors }));
} finally {
  if (browser) await browser.close();
  await server.close();
}
