import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const { createStaticServer } = require('./run-route-matrix.js');

import { beginTokenDrag, moveTokenDrag, endTokenDrag } from './plan39-repair02-playwright-helpers.mjs';
import { PLAN37_BAR_TO_LINE_BRIDGE_RECORDS } from '../../src/content/data/plan37-bar-to-line-bridge-records.js';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const evidenceDir = path.join(
  rootDir,
  'reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/repair04-current'
);

function ensureDirectory(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

export async function assertTokenContainment(page, hostSelector = '.app-visual-view') {
  return page.locator(`${hostSelector} .plan39-repair-token`).evaluate((token) => {
    const bounds = (el) => {
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
    };
    const style = getComputedStyle(token);
    const tile = bounds(token);
    const glyphs = [...token.querySelectorAll('.symbolic-fraction, .symbolic-numerator, .symbolic-denominator')].map(bounds);
    const overflow = glyphs.some((g) => g.left < tile.left + 1 || g.right > tile.right - 1 || g.top < tile.top + 1 || g.bottom > tile.bottom - 1);
    return {
      tile,
      glyphs,
      overflow,
      width: tile.width,
      height: tile.height,
      backgroundColor: style.backgroundColor,
      cursor: style.cursor,
      zIndex: style.zIndex,
    };
  });
}

export async function measureGeometry(page, hostSelector = '.app-visual-view') {
  return page.evaluate(({ host }) => {
    const rootEl = document.querySelector(host);
    if (!rootEl) return null;
    const bounds = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
    };

    const header = rootEl.querySelector('.plan39-header-region');
    const introHeader = rootEl.querySelector('.plan39-intro-header');
    const acceptedHeader = rootEl.querySelector('.plan39-accepted-header');
    const prompt = rootEl.querySelector('.active-beat-prompt');
    const tray = rootEl.querySelector('.plan39-token-tray');
    const token = rootEl.querySelector('.plan39-repair-token');
    const stack = rootEl.querySelector('.plan39-representation-stack');
    const frame = rootEl.querySelector('.plan39-axis-frame');
    const axisLine = frame?.querySelector('.plan39-axis-line');
    const bar = rootEl.querySelector('.plan39-bar-track');
    const connector = rootEl.querySelector('.plan39-connector-overlay');
    const resolution = rootEl.querySelector('.plan39-resolution-description');
    const finishBtn = rootEl.querySelector('.plan39-finish');

    const barBounds = bounds(bar);
    const axisLineBounds = bounds(axisLine);
    const trayBounds = bounds(tray);
    const frameBounds = bounds(frame);

    let barToAxisClearSpace = null;
    if (barBounds && axisLineBounds) {
      barToAxisClearSpace = Math.round((axisLineBounds.top - barBounds.bottom) * 100) / 100;
    }

    let traySeparation = null;
    if (trayBounds && axisLineBounds) {
      traySeparation = Math.round((axisLineBounds.top - trayBounds.bottom) * 100) / 100;
    }

    return {
      viewport: { width: window.innerWidth, height: window.innerHeight, dpr: window.devicePixelRatio },
      header: bounds(header),
      introHeader: bounds(introHeader),
      acceptedHeader: bounds(acceptedHeader),
      prompt: bounds(prompt),
      tray: trayBounds,
      token: bounds(token),
      stack: bounds(stack),
      frame: frameBounds,
      axisLine: axisLineBounds,
      bar: barBounds,
      connector: bounds(connector),
      resolution: bounds(resolution),
      finishBtn: bounds(finishBtn),
      barToAxisClearSpace,
      traySeparation,
      trayOutsideBand: trayBounds && frameBounds ? trayBounds.bottom < frameBounds.top : false,
      tokenInTray: tray && token ? tray.contains(token) : false,
      tokenInStack: stack && token ? stack.contains(token) : false,
    };
  }, { host: hostSelector });
}

export async function runRepair04Witness({ seed = null } = {}) {
  ensureDirectory(evidenceDir);
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}/FractionFlow/`;

  let browserChannel = undefined;
  if (process.platform === 'win32') {
    if (fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')) {
      browserChannel = 'chrome';
    } else if (fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')) {
      browserChannel = 'msedge';
    }
  }

  const browser = await chromium.launch({
    headless: true,
    ...(browserChannel ? { channel: browserChannel } : {}),
  });

  const viewports = [
    { label: '360x740', width: 360, height: 740, dpr: 1 },
    { label: '360x752', width: 360, height: 752, dpr: 1 },
    { label: '1366x768', width: 1366, height: 768, dpr: 1 },
    { label: '1093x614-dpr125', width: 1093, height: 614, dpr: 1.25 },
  ];

  const receipts = [];

  try {
    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        deviceScaleFactor: vp.dpr,
      });
      const page = await context.newPage();
      await page.goto(baseUrl);
      await page.waitForSelector('[data-practice-type="bar-to-line-same-amount"]');
      await page.locator('[data-practice-type="bar-to-line-same-amount"]').click();
      await page.waitForSelector('.plan39-number-line');

      // Negative control: Seed tile overflow
      if (seed === 'seed-tile-overflow') {
        await page.evaluate(() => {
          const t = document.querySelector('.plan39-repair-token');
          t.style.height = '44px';
          t.style.maxHeight = '44px';
          t.style.padding = '0px';
        });
        const containment = await assertTokenContainment(page);
        if (containment.overflow || containment.height <= 44) {
          throw new Error('NC-4 detected: fraction tile clipped or overflowing fixed height container');
        }
      }

      // 1. Initial State Assertions
      const initialGeom = await measureGeometry(page);
      const initialContainment = await assertTokenContainment(page);
      assert(!initialContainment.overflow, 'Fraction glyphs must be contained in tile');
      assert(initialContainment.width >= 48 && initialContainment.height >= 48, 'Minimum touch dimensions 48px');
      assert.equal(initialGeom.tokenInTray, true, 'Unplaced token must be inside starting tray');
      assert.equal(initialGeom.tokenInStack, false, 'Unplaced token must not be inside line stack');

      // Negative control: Seed tray separation
      if (seed === 'seed-tray-separation') {
        await page.evaluate(() => {
          const tray = document.querySelector('.plan39-token-tray');
          const axis = document.querySelector('.plan39-axis-line');
          const r = axis.getBoundingClientRect();
          tray.style.position = 'fixed';
          tray.style.top = `${r.top}px`;
          tray.style.left = `${r.left + 50}px`;
        });
      }

      const traySeparation = await page.evaluate(() => {
        const tray = document.querySelector('.plan39-token-tray').getBoundingClientRect();
        const axis = document.querySelector('.plan39-axis-line').getBoundingClientRect();
        return axis.top - tray.bottom;
      });
      assert(traySeparation >= 12, `Starting tray must be clearly outside number-line region (saw ${traySeparation}px separation)`);

      assert.equal(await page.locator('.app-visual-view .plan39-check-position').isEnabled(), false, 'Check disabled initially');
      assert.equal(await page.locator('.app-visual-view .plan39-bar-track').count(), 0, 'No answer bar initially');
      assert.equal(await page.locator('.app-visual-view .plan39-accepted-header').count(), 0, 'No accepted header initially');

      // Screenshot: Initial State
      await page.screenshot({ path: path.join(evidenceDir, `initial-${vp.label}.png`), fullPage: false });

      // Negative control: Seed premature green header
      if (seed === 'seed-premature-green') {
        await page.evaluate(() => {
          const h = document.createElement('div');
          h.className = 'plan39-header-region plan39-accepted-header';
          document.querySelector('.plan39-number-line').prepend(h);
        });
        const headerCount = await page.locator('.app-visual-view .plan39-accepted-header').count();
        if (headerCount > 0) {
          throw new Error('NC-2 detected: accepted green header visible before correct Check');
        }
      }

      // 2. Drag from Tray to Number Line
      const gesture = await beginTokenDrag(page, { view: 'visual' });
      await moveTokenDrag(page, gesture, { ratio: 0.5 });

      // Check live drop preview ring
      const liveRings = await page.locator('.app-visual-view .plan39-candidate-point.is-drop-preview').count();
      assert.equal(liveRings, 1, 'Live drop preview ring must illuminate target during drag');

      // Release over candidate
      await endTokenDrag(page, gesture);

      // 3. Pending Placement State Assertions
      const pendingGeom = await measureGeometry(page);
      assert.equal(pendingGeom.tokenInTray, false, 'Placed token must leave the starting tray');
      assert.equal(pendingGeom.tokenInStack, true, 'Placed token must be inside line stack');
      assert.equal(await page.locator('.app-visual-view .plan39-token-tray .plan39-repair-token').count(), 0, 'No duplicate token in starting tray');
      assert.equal(await page.locator('.app-visual-view .plan39-check-position').isEnabled(), true, 'Check enabled after placement');
      assert.equal(await page.locator('.app-visual-view .plan39-bar-track').count(), 0, 'No bar before Check');
      assert.equal(await page.locator('.app-visual-view .plan39-accepted-header').count(), 0, 'No accepted green header before Check');

      // Screenshot: Pending Placement State
      await page.screenshot({ path: path.join(evidenceDir, `pending-${vp.label}.png`), fullPage: false });

      // Repositioning check: drag placed token to another candidate, then back
      await page.locator('.app-visual-view .plan39-stepper-next').click(); // moves to 2/2
      assert.equal(await page.locator('.app-visual-view .plan39-repair-token').getAttribute('data-candidate-id'), 'partition-2-of-2');

      // Deliberately wrong Check: Check at 2/2 (wrong)
      await page.locator('.app-visual-view .plan39-check-position').click();
      assert.equal(await page.locator('.app-visual-view .plan39-feedback').count(), 1, 'Recovery feedback appears on wrong Check');
      assert.equal(await page.locator('.app-visual-view .plan39-bar-track').count(), 0, 'Wrong Check never reveals answer bar');
      assert.equal(await page.locator('.app-visual-view .plan39-accepted-header').count(), 0, 'Wrong Check never reveals green accepted header');
      assert.equal(await page.locator('.app-visual-view .plan39-finish').count(), 0, 'Wrong Check does not show progression button');

      // Correct Check: move back to 1/2 and Check
      await page.locator('.app-visual-view .plan39-stepper-next').click();
      await page.locator('.app-visual-view .plan39-stepper-previous').click();
      await page.locator('.app-visual-view .plan39-check-position').click();

      // 4. Accepted Result State Assertions
      const acceptedGeom = await measureGeometry(page);
      assert.equal(await page.locator('.app-visual-view .plan39-accepted-header').count(), 1, 'Accepted header displayed');
      assert.equal(await page.locator('.app-visual-view .plan39-accepted-text').textContent(), 'That’s right.');
      assert.equal(await page.locator('.app-visual-view .plan39-accepted-fraction').count(), 1, 'Borderless fraction in accepted header');
      assert.equal(await page.locator('.app-visual-view .plan39-bar-track').count(), 1, 'Answer bar displayed');
      assert.equal(await page.locator('.app-visual-view .plan39-accepted-bar-figure .plan39-source-fraction').count(), 0, 'No fraction text above bar in accepted stack');
      assert.equal(await page.locator('.app-visual-view .plan39-connector-overlay').count(), 1, 'Connector overlay present');

      // Graphics separation measurement
      const clearSpace = acceptedGeom.barToAxisClearSpace;
      assert(clearSpace >= 20 && clearSpace <= 24, `Clear vertical space between bar and axis must be 20-24px (saw ${clearSpace}px)`);

      // Alignment check
      assert.equal(acceptedGeom.bar.left, acceptedGeom.frame.left, 'Bar left coordinate aligns with line zero');
      assert.equal(acceptedGeom.bar.width, acceptedGeom.frame.width, 'Bar width aligns with line width');

      // Progression button
      const progressionBtn = page.locator('.app-visual-view .plan39-finish');
      assert.equal(await progressionBtn.count(), 1, 'Progression button present');
      assert.equal(await progressionBtn.textContent(), 'Next problem');

      // Focus assertion
      const focusedTagName = await page.evaluate(() => document.activeElement.tagName.toLowerCase());
      const focusedClass = await page.evaluate(() => document.activeElement.className);
      assert(focusedClass.includes('plan39-finish'), `Focus must land on progression button (saw ${focusedTagName}.${focusedClass})`);

      // Screenshot: Accepted Result State
      await page.screenshot({ path: path.join(evidenceDir, `accepted-${vp.label}.png`), fullPage: false });

      // Negative control: Seed progression redundancy
      if (seed === 'seed-progression-redundancy') {
        await page.evaluate(() => {
          const btn = document.querySelector('.plan39-finish');
          btn.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
            btn.textContent = 'Confirm finish';
          }, true);
        });
        await page.locator('.app-visual-view .plan39-finish').click();
        const itemId = await page.locator('.app-episode').getAttribute('data-current-item-id');
        if (itemId !== 'bridge-02-fourth-4') {
          throw new Error('NC-3 detected: progression button exposed another step instead of advancing item');
        }
      }

      // 5. Direct Progression to Fresh Next Item
      await page.locator('.app-visual-view .plan39-finish').click();

      // Assert item 2 mounted fresh
      await page.waitForSelector('.app-episode[data-current-item-id="bridge-02-fourth-4"]');
      const nextItemGeom = await measureGeometry(page);
      assert.equal(nextItemGeom.tokenInTray, true, 'Item 2 unplaced token starts inside tray');
      assert.equal(await page.locator('.app-visual-view .plan39-check-position').isEnabled(), false, 'Item 2 Check button disabled');
      assert.equal(await page.locator('.app-visual-view .plan39-bar-track').count(), 0, 'Item 2 has no answer bar');
      assert.equal(await page.locator('.app-visual-view .plan39-accepted-header').count(), 0, 'Item 2 has no accepted header');
      assert.equal(await page.locator('.app-visual-view .plan39-feedback').count(), 0, 'Item 2 has no recovery feedback');

      // Screenshot: Fresh Next Item State
      await page.screenshot({ path: path.join(evidenceDir, `next-item-${vp.label}.png`), fullPage: false });

      // 6. Enlarged Type Check (200% font size)
      await page.evaluate(() => { document.documentElement.style.fontSize = '32px'; });
      const enlargedContainment = await assertTokenContainment(page);
      assert(!enlargedContainment.overflow, 'Enlarged type fraction glyphs contained in tile');
      const enlargedTrayH = await page.locator('.app-visual-view .plan39-token-tray').evaluate((t) => t.getBoundingClientRect().height);
      assert(enlargedTrayH >= enlargedContainment.height, 'Enlarged tray contains enlarged tile');
      await page.evaluate(() => { document.documentElement.style.fontSize = ''; });

      // 7. Final Item Return Check (run on 1366x768)
      if (vp.label === '1366x768') {
        // Fast-forward remaining items to final item (item 8, index 7)
        for (let i = 1; i < 8; i += 1) {
          const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[i];
          await page.waitForSelector(`.app-episode[data-current-item-id="${record.itemId}"]`);
          const num = Number(record.sourceForm.numerator);
          await page.locator('.app-visual-view .plan39-stepper-previous').click();
          for (let s = 0; s < num; s += 1) {
            await page.locator('.app-visual-view .plan39-stepper-next').click();
          }
          await page.locator('.app-visual-view .plan39-check-position').click();
          if (i < 7) {
            await page.locator('.app-visual-view .plan39-finish').click();
          }
        }

        // Final item assertions
        assert.equal(await page.locator('.app-visual-view .plan39-finish').textContent(), 'Back to start');
        assert.equal(await page.locator('.app-visual-view .progression-notice').textContent(), 'You’ve tried every problem in this set.');
        await page.screenshot({ path: path.join(evidenceDir, `final-item-accepted-${vp.label}.png`), fullPage: false });

        // Click Back to start -> returns to start
        await page.locator('.app-visual-view .plan39-finish').click();
        assert.equal(await page.locator('.app-episode').getAttribute('hidden'), '', 'Episode hidden after return');
      }

      receipts.push({
        viewport: vp,
        initialGeom,
        pendingGeom,
        acceptedGeom,
        nextItemGeom,
        enlargedContainment,
      });

      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  const receiptPath = path.join(evidenceDir, 'plan39-repair04-witness-receipt.json');
  fs.writeFileSync(receiptPath, JSON.stringify({ timestamp: new Date().toISOString(), receipts }, null, 2), 'utf8');
  return { receipts, receiptPath };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const seedArg = process.argv.find((a) => a.startsWith('--seed='));
  const seed = seedArg ? seedArg.split('=')[1] : null;
  runRepair04Witness({ seed })
    .then(({ receiptPath }) => {
      console.log(`Plan 39 Repair 04 witness completed successfully. Receipt: ${receiptPath}`);
      process.exit(0);
    })
    .catch((err) => {
      console.error(`Plan 39 Repair 04 witness failed: ${err.message}`);
      process.exit(1);
    });
}
