import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('./run-route-matrix.js');

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const evidenceDir = path.join(rootDir, 'reports/development/plan-38-like-denominator-subtraction-batch/evidence');
if (!fs.existsSync(evidenceDir)) {
  fs.mkdirSync(evidenceDir, { recursive: true });
}

let browserChannel = null;
if (process.platform === 'win32') {
  if (fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')) {
    browserChannel = 'msedge';
  } else if (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')) {
    browserChannel = 'chrome';
  }
}

const server = createStaticServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}/FractionFlow/`;

async function measureLayout(page, label) {
  const data = await page.evaluate(() => {
    const root = document.documentElement;
    const findVisible = (selector) => {
      return [...document.querySelectorAll(selector)].find((node) => {
        const s = getComputedStyle(node);
        const r = node.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
      }) || null;
    };
    const getMetrics = (selector) => {
      const el = findVisible(selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const intersectsViewport = r.bottom > 0 && r.right > 0 && r.top < window.innerHeight && r.left < window.innerWidth;
      const withinViewport = r.top >= 0 && r.left >= 0 && r.bottom <= window.innerHeight && r.right <= window.innerWidth;
      return {
        x: Math.round(r.x * 100) / 100,
        y: Math.round(r.y * 100) / 100,
        width: Math.round(r.width * 100) / 100,
        height: Math.round(r.height * 100) / 100,
        visible: true,
        intersectsViewport,
        withinViewport,
      };
    };

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      document: { width: root.scrollWidth, height: root.scrollHeight },
      scroll: { x: window.scrollX, y: window.scrollY },
      horizontalOverflow: root.scrollWidth > root.clientWidth,
      verticalScrollRange: Math.max(0, root.scrollHeight - window.innerHeight),
      elements: {
        prompt: getMetrics('.active-beat-prompt'),
        controls: getMetrics('.active-beat-controls'),
        episode: getMetrics('.app-episode'),
        takeawayContainer: getMetrics('.fraction-bar-takeaway-container, .app-linear-view .symbolic-expression'),
      },
    };
  });

  assert.equal(data.horizontalOverflow, false, `${label}: zero horizontal overflow`);
  assert.ok(
    data.elements.prompt && data.elements.prompt.visible && data.elements.prompt.withinViewport,
    `${label}: prompt visible within viewport`,
  );
  assert.ok(
    data.elements.controls && data.elements.controls.visible && data.elements.controls.withinViewport,
    `${label}: controls visible within viewport`,
  );
  return { label, ...data };
}

async function run() {
  const launchOptions = { headless: true };
  if (browserChannel) launchOptions.channel = browserChannel;
  const browser = await chromium.launch(launchOptions);
  const measurements = [];

  try {
    // 1. Viewport 360x740 (Visual View)
    {
      const context = await browser.newContext({ viewport: { width: 360, height: 740 } });
      const page = await context.newPage();
      await page.goto(baseUrl);
      await page.waitForSelector('.fractionflow-app');

      // Select subtraction
      await page.click('[data-practice-type="like-denominator-subtraction"]');
      await page.waitForSelector('.app-episode');

      // Encounter beat
      const encMeasure = await measureLayout(page, 'encounter-360x740');
      measurements.push(encMeasure);
      await page.screenshot({ path: path.join(evidenceDir, 'encounter-360x740.png') });

      // Click Take away -> Operate beat
      await page.click('.app-visual-view .active-beat-controls button');
      await page.waitForSelector('#operate-fraction-numerator-input');
      const opMeasure = await measureLayout(page, 'operate-hatch-360x740');
      measurements.push(opMeasure);
      await page.screenshot({ path: path.join(evidenceDir, 'operate-hatch-360x740.png') });

      // Open Help
      await page.click('.app-visual-view .app-secondary-button');
      await page.waitForSelector('#visual-subtraction-task-help');
      const helpMeasure = await measureLayout(page, 'help-360x740');
      measurements.push(helpMeasure);
      await page.screenshot({ path: path.join(evidenceDir, 'help-360x740.png') });

      // Fill answer and submit -> Resolve beat
      await page.fill('#operate-fraction-numerator-input', '3');
      await page.fill('#operate-fraction-denominator-input', '8');
      await page.click('.app-visual-view .control-submit-btn');
      await page.waitForSelector('.app-visual-view .active-beat-controls button');
      const resMeasure = await measureLayout(page, 'resolve-360x740');
      measurements.push(resMeasure);
      await page.screenshot({ path: path.join(evidenceDir, 'resolve-360x740.png') });

      await context.close();
    }

    // 2. Viewport 360x752 (Linear View)
    {
      const context = await browser.newContext({ viewport: { width: 360, height: 752 } });
      const page = await context.newPage();
      await page.goto(baseUrl);
      await page.waitForSelector('.fractionflow-app');

      // Select subtraction and switch to linear
      await page.click('[data-practice-type="like-denominator-subtraction"]');
      await page.waitForSelector('.app-episode');
      await page.click('.app-view-controls .app-secondary-button');
      await page.waitForSelector('.app-linear-view');

      // Linear encounter
      const encMeasure = await measureLayout(page, 'linear-encounter-360x752');
      measurements.push(encMeasure);
      await page.screenshot({ path: path.join(evidenceDir, 'linear-encounter-360x752.png') });

      // Click Take away -> Linear operate
      await page.click('.app-linear-view .active-beat-controls button');
      await page.waitForSelector('#linear-operate-fraction-numerator-input');
      const opMeasure = await measureLayout(page, 'linear-operate-360x752');
      measurements.push(opMeasure);
      await page.screenshot({ path: path.join(evidenceDir, 'linear-operate-360x752.png') });

      // Open linear help
      await page.click('.app-linear-view .app-secondary-button');
      await page.waitForSelector('#linear-subtraction-task-help');
      const helpMeasure = await measureLayout(page, 'linear-help-360x752');
      measurements.push(helpMeasure);
      await page.screenshot({ path: path.join(evidenceDir, 'linear-help-360x752.png') });

      // Fill answer and submit -> Linear resolve
      await page.fill('#linear-operate-fraction-numerator-input', '3');
      await page.fill('#linear-operate-fraction-denominator-input', '8');
      await page.click('.app-linear-view .control-submit-btn');
      await page.waitForSelector('.app-linear-view .active-beat-controls button');
      const resMeasure = await measureLayout(page, 'linear-resolve-360x752');
      measurements.push(resMeasure);
      await page.screenshot({ path: path.join(evidenceDir, 'linear-resolve-360x752.png') });

      await context.close();
    }

    // 3. Viewport 1366x768 (Desktop Chromebook Wide)
    {
      const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
      const page = await context.newPage();
      await page.goto(baseUrl);
      await page.waitForSelector('.fractionflow-app');

      // Select subtraction
      await page.click('[data-practice-type="like-denominator-subtraction"]');
      await page.waitForSelector('.app-episode');

      const wideEncMeasure = await measureLayout(page, 'wide-encounter-1366x768');
      measurements.push(wideEncMeasure);
      await page.screenshot({ path: path.join(evidenceDir, 'wide-encounter-1366x768.png') });

      await page.click('.app-visual-view .active-beat-controls button');
      await page.waitForSelector('#operate-fraction-numerator-input');
      const wideOpMeasure = await measureLayout(page, 'wide-operate-1366x768');
      measurements.push(wideOpMeasure);
      await page.screenshot({ path: path.join(evidenceDir, 'wide-operate-1366x768.png') });

      await context.close();
    }

    // 4. Viewport 1093x614 at DPR 1.25 (125% Enlarged Text / Zoom Emulation)
    {
      const context = await browser.newContext({
        viewport: { width: 1093, height: 614 },
        deviceScaleFactor: 1.25,
      });
      const page = await context.newPage();
      await page.goto(baseUrl);
      await page.waitForSelector('.fractionflow-app');

      // Select subtraction
      await page.click('[data-practice-type="like-denominator-subtraction"]');
      await page.waitForSelector('.app-episode');

      await page.click('.app-visual-view .active-beat-controls button');
      await page.waitForSelector('#operate-fraction-numerator-input');
      const zoomMeasure = await measureLayout(page, 'zoom-operate-1093x614-dpr125');
      measurements.push(zoomMeasure);
      await page.screenshot({ path: path.join(evidenceDir, 'zoom-operate-1093x614-dpr125.png') });

      await context.close();
    }

    // Write aggregated viewport measurements
    const measurementsFilePath = path.join(evidenceDir, 'plan38-viewport-measurements.json');
    fs.writeFileSync(measurementsFilePath, JSON.stringify({
      capturedAt: new Date().toISOString(),
      measurements,
    }, null, 2) + '\n');

    console.log(`Successfully captured ${measurements.length} viewport measurements and screenshots.`);
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
