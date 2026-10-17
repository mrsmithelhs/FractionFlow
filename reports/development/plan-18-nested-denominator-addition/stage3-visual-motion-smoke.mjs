import { chromium } from 'playwright';
import { createServer } from 'vite';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { executeAction, observeSubdivision } = require('../../../scripts/dev/run-route-matrix.js');
const folder = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(folder, '../../..');
const evidenceDir = path.join(folder, 'evidence');
await mkdir(evidenceDir, { recursive: true });

const server = await createServer({
  configFile: path.join(repoRoot, 'vite.config.js'),
  root: repoRoot,
  server: { host: '127.0.0.1', port: 0, strictPort: false },
  logLevel: 'error',
});
await server.listen();
const address = server.httpServer.address();
const port = typeof address === 'object' && address ? address.port : null;
if (!port) throw new Error('Vite did not allocate the local fixture server port.');

const browser = await chromium.launch({ channel: 'chrome', headless: true });
const cases = [
  { itemId: 'nested-one-half-plus-three-eighths', side: 'left', mode: 'standard-motion', height: 740 },
  { itemId: 'nested-three-eighths-plus-one-half', side: 'right', mode: 'standard-motion', height: 752 },
  { itemId: 'nested-one-half-plus-three-eighths', side: 'left', mode: 'reduced-motion', height: 752 },
  { itemId: 'nested-three-eighths-plus-one-half', side: 'right', mode: 'reduced-motion', height: 740 },
];

function closeEnough(a, b) {
  return Math.abs(a - b) <= 0.75;
}

async function quietly(run) {
  const original = console.log;
  console.log = () => {};
  try { return await run(); } finally { console.log = original; }
}

async function trackSnapshot(page, host, side) {
  return page.locator(`${host} .fraction-bar-container[data-side="${side}"]`).evaluate((root) => {
    const track = root.querySelector('.fraction-bar-track');
    const fill = track?.querySelector('.fraction-bar-fill');
    if (!track || !fill) throw new Error('nested visual fixture has no mounted fraction track and fill');
    const box = (element) => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x + scrollX, y: rect.y + scrollY, width: rect.width, height: rect.height };
    };
    return {
      numerator: track.dataset.numerator,
      denominator: track.dataset.denominator,
      whole: box(track),
      fill: box(fill),
      activeAnimations: track.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length,
      newBoundaries: [...track.querySelectorAll('.fraction-bar-boundary-new')].length,
      highlightedBoundaries: [...track.querySelectorAll('.fraction-bar-boundary')]
        .filter((boundary) => getComputedStyle(boundary).boxShadow !== 'none').length,
    };
  });
}

try {
  for (const sample of cases) {
    const context = await browser.newContext({
      viewport: { width: 360, height: sample.height },
      reducedMotion: sample.mode === 'reduced-motion' ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    const pageErrors = [];
    const animationEvents = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    const basePath = `/FractionFlow/reports/development/plan-18-nested-denominator-addition/stage2-browser-smoke.html?item=${sample.itemId}`;
    await page.goto(`http://127.0.0.1:${port}${basePath}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      window.__plan18AnimationEvents = [];
      document.addEventListener('animationstart', (event) => window.__plan18AnimationEvents.push({ type: 'animationstart', name: event.animationName }));
      document.addEventListener('transitionrun', (event) => window.__plan18AnimationEvents.push({ type: 'transitionrun', property: event.propertyName }));
      const nativeAnimate = Element.prototype.animate;
      window.__plan18WAAPICalls = [];
      Element.prototype.animate = function (...args) {
        const bar = this.closest?.('.fraction-bar-container');
        if (bar) {
          window.__plan18WAAPICalls.push({
            side: bar.dataset.side ?? null,
            targetClass: typeof this.className === 'string' ? this.className : this.className?.baseVal ?? '',
          });
        }
        return nativeAnimate.apply(this, args);
      };
    });
    await page.locator('.app-gear-button').click();
    await page.locator('[data-condition-id="phase2-bundle-1"]').click();
    await page.locator('.app-gear-button').click();
    await page.locator('[data-support-id="medium-support"]').click();
    await page.locator('.app-practice-button').click();
    await page.locator('.app-visual-view .active-beat-controls .control-btn').click();
    const host = '.app-visual-view';
    const correctChoice = page.locator(`${host} .nested-side-choice`).nth(sample.side === 'left' ? 0 : 1);
    await correctChoice.click();
    const input = page.locator(`${host} #transform-num-input-${sample.side}`);
    await input.fill('4');
    const otherSide = sample.side === 'left' ? 'right' : 'left';
    const beforeAccepted = {
      converted: await trackSnapshot(page, host, sample.side),
      untouched: await trackSnapshot(page, host, otherSide),
      viewport: await page.evaluate(() => ({ width: innerWidth, height: innerHeight, documentWidth: document.documentElement.scrollWidth, scrollX, scrollY })),
    };
    await page.evaluate(() => { window.__plan18WAAPICalls = []; });
    if (sample.mode === 'standard-motion') {
      const transformObservation = await quietly(() => observeSubdivision(page, {
        step: 1,
        target: `${host} #transform-num-input-${sample.side} + .control-submit-btn`,
        container: `${host} .fraction-bar-container[data-side="${sample.side}"]`,
      }, `PLAN18-FIXTURE-${sample.itemId}-${sample.mode}`));
      if (transformObservation.settled.denominator !== '8' || transformObservation.settled.numerator !== '4') {
        throw new Error(`${sample.itemId}: standard conversion did not settle to 4/8`);
      }
      await quietly(() => executeAction(page, {
        method: 'assertNoSubdivisionMotion',
        container: `${host} .fraction-bar-container[data-side="${otherSide}"]`,
      }, `PLAN18-FIXTURE-${sample.itemId}-${sample.mode}`));
      const afterAccepted = {
        converted: await trackSnapshot(page, host, sample.side),
        untouched: await trackSnapshot(page, host, otherSide),
      };
      const conversionWAAPICalls = await page.evaluate(() => [...window.__plan18WAAPICalls]);
      if (!conversionWAAPICalls.some((call) => call.side === sample.side)
        || conversionWAAPICalls.some((call) => call.side === otherSide)) {
        throw new Error(`${sample.itemId}: standard conversion WAAPI calls did not stay on the converted side: ${JSON.stringify(conversionWAAPICalls)}`);
      }
      if (afterAccepted.untouched.numerator !== beforeAccepted.untouched.numerator
        || afterAccepted.untouched.denominator !== beforeAccepted.untouched.denominator
        || !closeEnough(afterAccepted.untouched.whole.x, beforeAccepted.untouched.whole.x)
        || !closeEnough(afterAccepted.untouched.fill.width, beforeAccepted.untouched.fill.width)) {
        throw new Error(`${sample.itemId}: untouched side changed form or geometry during standard conversion`);
      }
      const operationInput = page.locator(`${host} #operate-sum-input`);
      await operationInput.fill('7');
      await page.locator('.app-replay-button').click();
      await page.evaluate(() => { window.__plan18WAAPICalls = []; });
      const replayButton = page.locator(`${host} .fraction-bar-toggle-btn`);
      if (await replayButton.count() !== 1) throw new Error(`${sample.itemId}: Show new parts is not present in standard Replay`);
      const replayMotion = await quietly(() => observeSubdivision(page, {
        step: 2,
        target: `${host} .fraction-bar-toggle-btn`,
        container: `${host} .fraction-bar-container[data-side="${sample.side}"]`,
      }, `PLAN18-FIXTURE-${sample.itemId}-${sample.mode}-replay`));
      if (replayMotion.settled.denominator !== '8' || replayMotion.settled.numerator !== '4') {
        throw new Error(`${sample.itemId}: standard Show new parts did not settle to 4/8`);
      }
      const replayWAAPICalls = await page.evaluate(() => [...window.__plan18WAAPICalls]);
      if (!replayWAAPICalls.some((call) => call.side === sample.side)
        || replayWAAPICalls.some((call) => call.side === otherSide)) {
        throw new Error(`${sample.itemId}: standard Replay WAAPI calls did not stay on the converted side: ${JSON.stringify(replayWAAPICalls)}`);
      }
      await page.screenshot({ path: path.join(evidenceDir, `stage3-${sample.itemId}-standard-replay-${sample.height}.png`), fullPage: true });
      animationEvents.push(...await page.evaluate(() => window.__plan18AnimationEvents));
      const wholeFillConservation = {
        accepted: transformObservation.documentPositionDrift,
        replay: replayMotion.documentPositionDrift,
      };
      if (!transformObservation.conservedDocumentPosition || !replayMotion.conservedDocumentPosition) {
        throw new Error(`${sample.itemId}: whole/fill document coordinates did not conserve through accepted conversion and Replay`);
      }
      cases[cases.indexOf(sample)] = { ...sample, supportProfile: await page.locator('.fractionflow-app').getAttribute('data-support-level'), beforeAccepted, afterAccepted, transformObservation, conversionWAAPICalls, replayMotion, replayWAAPICalls, wholeFillConservation, animationEvents, pageErrors };
    } else {
      if (!await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)) {
        throw new Error(`${sample.itemId}: reduced-motion preference was not active before conversion`);
      }
      await page.locator(`${host} #transform-num-input-${sample.side} + .control-submit-btn`).click();
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const afterAccepted = {
        converted: await trackSnapshot(page, host, sample.side),
        untouched: await trackSnapshot(page, host, otherSide),
      };
      const conversionWAAPICalls = await page.evaluate(() => [...window.__plan18WAAPICalls]);
      if (afterAccepted.converted.numerator !== '4' || afterAccepted.converted.denominator !== '8'
        || afterAccepted.converted.activeAnimations !== 0 || afterAccepted.converted.highlightedBoundaries !== 0
        || conversionWAAPICalls.length !== 0
        || afterAccepted.untouched.numerator !== beforeAccepted.untouched.numerator
        || afterAccepted.untouched.denominator !== beforeAccepted.untouched.denominator
        || !closeEnough(afterAccepted.untouched.whole.x, beforeAccepted.untouched.whole.x)
        || !closeEnough(afterAccepted.untouched.fill.width, beforeAccepted.untouched.fill.width)) {
        throw new Error(`${sample.itemId}: reduced accepted conversion endpoint or untouched side is incorrect`);
      }
      const op = page.locator(`${host} #operate-sum-input`);
      await quietly(() => executeAction(page, { method: 'fillWithKnownSelection', target: `${host} #operate-sum-input`, value: '7', selectionStart: 0, selectionEnd: 1 }, `PLAN18-FIXTURE-${sample.itemId}`));
      await op.evaluate((element) => { window.__plan18OperationInput = element; });
      await page.locator('.app-replay-button').click();
      const replayTarget = `${host} .fraction-bar-toggle-btn`;
      if (await page.locator(replayTarget).count() !== 1) throw new Error(`${sample.itemId}: reduced Replay lacks Show new parts control`);
      const replayAction = {
        method: 'clickAndObserveReplayReveal',
        step: 3,
        target: replayTarget,
        container: `${host} .fraction-bar-container[data-side="${sample.side}"]`,
        responseInput: `${host} #operate-sum-input`,
        numerator: 4,
        denominator: 8,
      };
      await quietly(() => executeAction(page, replayAction, `PLAN18-FIXTURE-${sample.itemId}-reduced-replay`));
      const replayEndpoint = replayAction.motionEvidence || null;
      const replayWAAPICalls = await page.evaluate(() => [...window.__plan18WAAPICalls]);
      const inputAfterReplay = await op.evaluate((element) => ({ value: element.value, connected: element.isConnected, sameNode: element === window.__plan18OperationInput }));
      if (inputAfterReplay.value !== '7' || !inputAfterReplay.connected) throw new Error(`${sample.itemId}: operation response did not persist through reduced Replay`);
      await page.screenshot({ path: path.join(evidenceDir, `stage3-${sample.itemId}-reduced-replay-${sample.height}.png`), fullPage: true });
      animationEvents.push(...await page.evaluate(() => window.__plan18AnimationEvents));
      if (animationEvents.length !== 0) throw new Error(`${sample.itemId}: reduced conversion/Replay executed CSS animation or transition: ${JSON.stringify(animationEvents)}`);
      if (replayWAAPICalls.length !== 0) throw new Error(`${sample.itemId}: reduced conversion/Replay called Web Animations API: ${JSON.stringify(replayWAAPICalls)}`);
      const wholeFillConservation = {
        accepted: {
          whole: { x: afterAccepted.converted.whole.x - beforeAccepted.converted.whole.x, y: afterAccepted.converted.whole.y - beforeAccepted.converted.whole.y },
          fill: { x: afterAccepted.converted.fill.x - beforeAccepted.converted.fill.x, y: afterAccepted.converted.fill.y - beforeAccepted.converted.fill.y, width: afterAccepted.converted.fill.width - beforeAccepted.converted.fill.width },
        },
        replay: replayEndpoint?.settled?.anchorDrift || null,
      };
      if (Object.values(wholeFillConservation.accepted.whole).some((delta) => Math.abs(delta) > 0.75)
        || Object.values(wholeFillConservation.accepted.fill).some((delta) => Math.abs(delta) > 0.75)) {
        throw new Error(`${sample.itemId}: whole/fill document coordinates drifted under reduced motion`);
      }
      cases[cases.indexOf(sample)] = { ...sample, supportProfile: await page.locator('.fractionflow-app').getAttribute('data-support-level'), beforeAccepted, afterAccepted, conversionWAAPICalls, replayEndpoint, replayWAAPICalls, inputAfterReplay, wholeFillConservation, animationEvents, pageErrors };
    }
    const finalDocument = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewportWidth: innerWidth }));
    if (finalDocument.width > finalDocument.viewportWidth) {
      throw new Error(`${sample.itemId}: fixture produced horizontal overflow after Replay: ${JSON.stringify(finalDocument)}`);
    }
    if (pageErrors.length > 0) throw new Error(`${sample.itemId}: browser reported page errors: ${JSON.stringify(pageErrors)}`);
    cases[cases.findIndex((entry) => entry.itemId === sample.itemId && entry.mode === sample.mode)] = {
      ...cases[cases.findIndex((entry) => entry.itemId === sample.itemId && entry.mode === sample.mode)],
      finalDocument,
    };
    await context.close();
  }
} finally {
  await browser.close();
  await server.close();
}

await writeFile(path.join(folder, 'stage3-visual-motion-results.json'), `${JSON.stringify({
  fixture: 'unshipped one-item subset of exact registered set@6 items; visible learner controls only',
  browserChannel: 'chrome',
  selectedSupport: 'medium-support through visible gear menu',
  claims: 'presentation-mechanism sweep only; does not prove production entry-to-item reach',
  cases,
}, null, 2)}\n`);
console.log(JSON.stringify(cases, null, 2));
