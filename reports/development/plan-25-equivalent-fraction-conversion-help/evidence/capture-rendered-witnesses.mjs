import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const { createStaticServer } = require('../../../../scripts/dev/run-route-matrix.js');
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const server = createStaticServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const records = [];
try {
  for (const viewport of [
    { width: 360, height: 740, label: '360x740' },
    { width: 360, height: 752, label: '360x752' },
    { width: 1280, height: 800, label: '1280x800-wide' },
  ]) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:${server.address().port}/FractionFlow/`);
    await page.locator('.app-practice-button').click();
    await page.locator('.app-visual-view .control-btn').click();
    await page.locator('.app-visual-view .control-choice-btn').nth(1).click();
    await page.locator('.app-visual-view .control-choice-btn').nth(1).click();
    await page.locator('.app-visual-view .active-beat-controls .app-secondary-button').click();
    const helper = page.locator('.app-visual-view #transform-help-multiplier-left');
    await helper.waitFor({ state: 'visible' });
    const helperPath = path.join(scriptDir, `transform-helper-${viewport.label}.png`);
    await page.screenshot({ path: helperPath, fullPage: true });
    const measure = async (stage, pathName) => {
      const values = await page.evaluate(() => {
        const select = (selector) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
        };
        return {
          viewport: { width: innerWidth, height: innerHeight },
          document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
          prompt: select('.active-beat-prompt'),
          helperInput: select('#transform-help-multiplier-left'),
          submitButton: select('.app-visual-view .control-submit-btn'),
          hasMainNumerator: Boolean(document.querySelector('#transform-num-input-left')),
          helpExpanded: document.querySelector('.app-visual-view .active-beat-controls .app-secondary-button')?.getAttribute('aria-expanded'),
        };
      });
      records.push({ stage, viewport: viewport.label, screenshot: path.basename(pathName), ...values });
    };
    await measure('requested-multiplier', helperPath);

    await helper.fill('7');
    await page.locator('.app-visual-view .control-submit-btn').click();
    await page.locator('.app-visual-view .recovery-feedback').waitFor({ state: 'visible' });
    const errorPath = path.join(scriptDir, `transform-helper-error-${viewport.label}.png`);
    await page.screenshot({ path: errorPath, fullPage: true });
    const errorValues = await page.evaluate(() => {
      const rect = (selector) => {
        const element = document.querySelector(selector);
        if (!element) return null;
        const box = element.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height };
      };
      return {
        viewport: { width: innerWidth, height: innerHeight },
        document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
        prompt: rect('.active-beat-prompt'),
        helperInput: rect('#transform-help-multiplier-left'),
        error: rect('.app-visual-view .recovery-feedback'),
        errorText: document.querySelector('.app-visual-view .recovery-feedback')?.textContent,
        retainedValue: document.querySelector('#transform-help-multiplier-left')?.value,
        hasMainNumerator: Boolean(document.querySelector('#transform-num-input-left')),
      };
    });
    records.push({ stage: 'wrong-multiplier-recovery', viewport: viewport.label, screenshot: path.basename(errorPath), ...errorValues });
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

const output = {
  purpose: 'Rendered Plan 25 helper and wrong-multiplier recovery witnesses at 360x740, 360x752, and 1280px wide',
  browser: 'Microsoft Edge via Playwright; headless desktop browser',
  limits: 'Viewport measurements only; no physical Chromebook or assistive-technology testing.',
  captures: records,
};
writeFileSync(path.join(scriptDir, 'rendered-screen-measurements.json'), `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output, null, 2));
