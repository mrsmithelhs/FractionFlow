import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('../../../../scripts/dev/run-route-matrix.js');
const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const server = createStaticServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}/FractionFlow/`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function completeCurrentItem(page, answers, { final = false } = {}) {
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.getByRole('button', { name: 'No, different sizes' }).click();
  await page.getByRole('button', { name: `Common denominator ${answers.target}` }).click();
  for (const value of [answers.left, answers.right, answers.sum]) {
    await page.locator('.app-visual-view input.control-numeric-input').fill(String(value));
    await page.locator('.app-visual-view .control-submit-btn').click();
  }
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.locator('.app-visual-view .matching-choice-btn').nth(answers.correctChoiceIndex).click();
  if (final) {
    await page.locator('.app-navigation-notice').waitFor({ state: 'visible' });
    const notice = await page.locator('.app-navigation-notice').innerText();
    if (!notice.includes('every problem in this set')) throw new Error(`Unexpected final-set notice: ${notice}`);
    return;
  }
  await page.getByRole('button', { name: 'Next problem' }).waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Next problem' }).click();
}

try {
  const measurements = [];
  for (const viewport of [{ width: 360, height: 740 }, { width: 1366, height: 768 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: 'no-preference' });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    await page.goto(baseUrl);
    await page.waitForSelector('.fractionflow-app');
    await page.locator('.app-practice-button').click();

    await completeCurrentItem(page, { target: 12, left: 8, right: 3, sum: 11, correctChoiceIndex: 0 });
    await completeCurrentItem(page, { target: 6, left: 3, right: 2, sum: 5, correctChoiceIndex: 1 });

    const itemLabels = await page.locator('.app-visual-view').evaluate((surface) => (
      [...surface.querySelectorAll('[aria-label], img')]
        .map((element) => element.getAttribute('aria-label') || element.getAttribute('alt') || '')
    ));
    if (!itemLabels.some((label) => label.includes('First fraction bar: 1 of 2'))
      || !itemLabels.some((label) => label.includes('Second fraction bar: 1 of 5'))) {
      throw new Error(`Expected Next to reach 1/2 + 1/5 at ${viewport.width}px; accessible labels were: ${JSON.stringify(itemLabels)}`);
    }
    const bounds = await page.evaluate(() => {
      const app = document.querySelector('.fractionflow-app');
      const surface = document.querySelector('.app-visual-view');
      const rect = surface.getBoundingClientRect();
      const question = document.querySelector('.app-visual-view .active-beat-prompt')?.getBoundingClientRect();
      const controls = document.querySelector('.app-visual-view .active-beat-controls')?.getBoundingClientRect();
      const box = (value) => value ? { x: value.x, y: value.y, width: value.width, height: value.height } : null;
      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        document: { scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight },
        app: { scrollWidth: app.scrollWidth, scrollHeight: app.scrollHeight },
        surface: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        question: box(question),
        controls: box(controls),
      };
    });
    const screenshot = `plan32-new-item-${viewport.width}x${viewport.height}.png`;
    await page.screenshot({ path: path.join(evidenceDir, screenshot), fullPage: true });

    await completeCurrentItem(page, { target: 10, left: 5, right: 2, sum: 7, correctChoiceIndex: 2 });
    await completeCurrentItem(page, { target: 10, left: 5, right: 4, sum: 9, correctChoiceIndex: 0 });
    await completeCurrentItem(page, { target: 12, left: 4, right: 3, sum: 7, correctChoiceIndex: 1 });
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.getByRole('button', { name: 'No, different sizes' }).click();
    await page.getByRole('button', { name: 'Common denominator 30' }).click();
    for (const value of [10, 6, 16]) {
      await page.locator('.app-visual-view input.control-numeric-input').fill(String(value));
      await page.locator('.app-visual-view .control-submit-btn').click();
    }
    await page.getByRole('button', { name: 'Continue' }).click();
    const largestLabels = await page.locator('.app-visual-view').evaluate((surface) => (
      [...surface.querySelectorAll('[aria-label], img')]
        .map((element) => element.getAttribute('aria-label') || element.getAttribute('alt') || '')
    ));
    if (!largestLabels.some((label) => label.includes('First fraction bar: 10 of 30'))
      || !largestLabels.some((label) => label.includes('Second fraction bar: 6 of 30'))) {
      throw new Error(`Expected 10/30 + 6/30 at ${viewport.width}px; accessible labels were: ${JSON.stringify(largestLabels)}`);
    }
    const largestScreenshot = `plan32-largest-admitted-unit-${viewport.width}x${viewport.height}.png`;
    await page.screenshot({ path: path.join(evidenceDir, largestScreenshot), fullPage: true });
    const largestBounds = await page.evaluate(() => {
      const app = document.querySelector('.fractionflow-app');
      const surface = document.querySelector('.app-visual-view');
      const rect = surface.getBoundingClientRect();
      const question = document.querySelector('.app-visual-view .active-beat-prompt')?.getBoundingClientRect();
      const controls = document.querySelector('.app-visual-view .active-beat-controls')?.getBoundingClientRect();
      const box = (value) => value ? { x: value.x, y: value.y, width: value.width, height: value.height } : null;
      return {
        viewport: { width: window.innerWidth, height: window.innerHeight },
        document: { scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight },
        app: { scrollWidth: app.scrollWidth, scrollHeight: app.scrollHeight },
        surface: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
        question: box(question),
        controls: box(controls),
      };
    });

    await page.locator('.app-visual-view .matching-choice-btn').nth(2).click();
    await page.getByRole('button', { name: 'Next problem' }).click();
    await completeCurrentItem(page, { target: 30, left: 10, right: 12, sum: 22, correctChoiceIndex: 1 });
    await completeCurrentItem(page, { target: 30, left: 20, right: 6, sum: 26, correctChoiceIndex: 2 });
    await completeCurrentItem(page, { target: 30, left: 18, right: 10, sum: 28, correctChoiceIndex: 2 }, { final: true });
    const exhaustion = await page.locator('.app-navigation-notice').innerText();
    const exhaustedNavigation = await page.evaluate(() => ({
      focusedNotice: document.activeElement?.matches('.app-navigation-notice') === true,
      nextHidden: document.querySelector('.app-next-button')?.hasAttribute('hidden') === true,
      returnEnabled: document.querySelector('.app-return-button')?.disabled === false,
    }));
    if (!exhaustion.includes('every problem in this set')
      || !exhaustedNavigation.focusedNotice
      || !exhaustedNavigation.nextHidden
      || !exhaustedNavigation.returnEnabled) {
      throw new Error(`Set exhaustion contract failed at ${viewport.width}px: ${JSON.stringify({ exhaustion, exhaustedNavigation })}`);
    }
    const exhaustionScreenshot = `plan32-set-exhaustion-${viewport.width}x${viewport.height}.png`;
    await page.screenshot({ path: path.join(evidenceDir, exhaustionScreenshot), fullPage: true });
    await page.locator('.app-return-button').click();
    await page.locator('.app-practice-button').click();
    const reentryLabels = await page.locator('.app-visual-view').evaluate((surface) => (
      [...surface.querySelectorAll('[aria-label], img')]
        .map((element) => element.getAttribute('aria-label') || element.getAttribute('alt') || '')
    ));
    if (!reentryLabels.some((label) => label.includes('First fraction bar: 2 of 3'))
      || !reentryLabels.some((label) => label.includes('Second fraction bar: 1 of 4'))) {
      throw new Error(`Back-to-start did not restart the fixed set at ${viewport.width}px: ${JSON.stringify(reentryLabels)}`);
    }
    measurements.push(
      { viewport, screenshot, visibleItem: '1/2 + 1/5', bounds },
      { viewport, screenshot: largestScreenshot, visibleItem: '10/30 + 6/30 after exact 1/3 + 1/5 conversion', scaleFactors: [10, 6], bounds: largestBounds },
      { viewport, screenshot: exhaustionScreenshot, visibleItem: 'all nine items completed; notice focused, Next hidden, Back to start enabled', exhaustionNotice: exhaustion, exhaustedNavigation, reentryItem: '2/3 + 1/4 after Back to start' },
    );
    await context.close();
  }
  writeFileSync(
    path.join(evidenceDir, 'browser-measurements.json'),
    `${JSON.stringify({ route: 'two preserved completions followed by actual Next to first compact authored item', measurements }, null, 2)}\n`,
    'utf8',
  );
  console.log(`Captured ${measurements.length} mounted browser viewport states.`);
} finally {
  await browser.close();
  server.close();
}
