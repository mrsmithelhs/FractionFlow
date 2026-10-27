import { createServer } from 'vite';
import { chromium } from 'playwright';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { beginTokenDrag, moveTokenDrag, endTokenDrag } from '../../../../../scripts/dev/plan39-repair02-playwright-helpers.mjs';

const dir = fileURLToPath(new URL('.', import.meta.url));
const server = await createServer({ base: '/', server: { host: '127.0.0.1', port: 0 } });
await server.listen();
let browser;
const result = { source: 'current source via Vite', observations: [] };
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  for (const width of [360, 1366]) {
    const page = await browser.newPage({ viewport: { width, height: width === 360 ? 740 : 768 }, reducedMotion: 'reduce' });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(server.resolvedUrls.local[0]);
    await page.locator('[data-practice-type="bar-to-line-same-amount"]').click();
    const geometry = () => page.evaluate(() => {
      const host = document.querySelector('.app-visual-view');
      const rect = s => { const r = host.querySelector(s).getBoundingClientRect(); return { x: r.x, y: r.y + window.scrollY, width: r.width, height: r.height }; };
      return { axis: rect('.plan39-axis-line'), tray: rect('.plan39-token-tray'), token: rect('.plan39-repair-token') };
    });
    const before = await geometry();
    const gesture = await beginTokenDrag(page);
    await moveTokenDrag(page, gesture, { ratio: 0.5 });
    const during = await geometry();
    await endTokenDrag(page, gesture);
    const after = await geometry();
    await page.screenshot({ path: `${dir}pending-${width}.png` });
    await page.locator('.app-visual-view .plan39-check-position').click();
    await page.locator('.app-view-toggle').count().then(async count => {
      if (count) await page.locator('.app-view-toggle').click();
      else await page.getByRole('button', { name: 'Read the steps', exact: true }).click();
    });
    const linearText = await page.locator('.app-linear-view').innerText();
    await page.screenshot({ path: `${dir}linear-${width}.png` });
    await page.locator('.app-linear-view .plan39-finish').click();
    const next = await page.evaluate(() => ({ itemId: document.querySelector('.app-episode').dataset.currentItemId, focusClass: document.activeElement.className, focusTag: document.activeElement.tagName }));
    result.observations.push({ width, before, during, after, axisShiftDuring: during.axis.y - before.axis.y, axisShiftAfter: after.axis.y - before.axis.y, linearText, next, errors });
    await page.close();
  }
} finally {
  await browser?.close();
  await server.close();
  fs.writeFileSync(`${dir}receipt.json`, JSON.stringify(result, null, 2));
}
console.log(JSON.stringify(result));
