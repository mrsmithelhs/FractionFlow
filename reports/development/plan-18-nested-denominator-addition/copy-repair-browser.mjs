import { chromium } from 'playwright';
import { createServer } from 'vite';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const folder = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(folder, '../../..');
const server = await createServer({ root, server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
await server.listen();
const port = server.httpServer.address().port;
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
try {
  for (const item of ['nested-one-half-plus-three-eighths', 'nested-three-eighths-plus-one-half']) {
    for (const view of ['visual', 'linear']) {
      const page = await browser.newPage({ viewport: { width: 360, height: 740 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`http://127.0.0.1:${port}/FractionFlow/reports/development/plan-18-nested-denominator-addition/stage2-browser-smoke.html?item=${item}`);
      await page.locator('.app-practice-button').click();
      await page.locator('.app-visual-view .active-beat-controls .control-btn').click();
      if (view === 'linear') await page.locator('.app-view-toggle').click();
      const host = `.app-${view}-view`;
      const legend = page.locator(`${host} .active-beat-controls legend`);
      const question = await legend.innerText();
      if (question !== 'Which fraction needs a different denominator?') throw new Error(`Unexpected question: ${question}`);
      if (await page.locator(`${host} .nested-side-choice`).count() !== 2) throw new Error('Missing fraction choices');
      await legend.scrollIntoViewIfNeeded();
      const width = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
      if (width.document > width.viewport) throw new Error('Horizontal overflow');
      if (errors.length) throw new Error(errors.join('\n'));
      const screenshot = `evidence/copy-repair-${item}-${view}.png`;
      await page.screenshot({ path: path.join(folder, screenshot), fullPage: true });
      results.push({ item, view, question, width, pageErrors: errors, screenshot });
      await page.close();
    }
  }
} finally {
  await browser.close();
  await server.close();
}
await writeFile(path.join(folder, 'copy-repair-browser-results.json'), `${JSON.stringify({ scope: 'Unshipped focused fixture; copy verification only, not new production reach evidence', results }, null, 2)}\n`);
console.log(`Verified the revised question in ${results.length} Chrome cases.`);
