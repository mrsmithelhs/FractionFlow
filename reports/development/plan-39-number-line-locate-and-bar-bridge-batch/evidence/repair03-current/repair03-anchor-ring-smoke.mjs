import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createRequire } from 'node:module';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('../../../../../scripts/dev/run-route-matrix.js');
const evidenceRoot = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(evidenceRoot, `anchor-ring-${new Date().toISOString().replace(/[-:.]/g, '')}`);
await mkdir(outputDir, { recursive: true });
const server = createStaticServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1 });
const evidence = { browser: 'installed Chrome via Playwright channel', viewport: { width: 360, height: 740 }, checks: [] };
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));

async function dragFrom({ grip, targetRatio }) {
  const token = page.locator('.app-visual-view .plan39-repair-token');
  const frame = page.locator('.app-visual-view .plan39-axis-frame');
  const start = await token.boundingBox();
  const track = await frame.boundingBox();
  const gripX = grip === 'center' ? start.x + start.width / 2 : start.x + start.width - 2;
  const gripY = start.y + start.height / 2;
  const targetAnchorX = track.x + track.width * targetRatio;
  const targetX = targetAnchorX + (gripX - (start.x + start.width / 2));
  const targetY = gripY;
  const initialId = await token.getAttribute('data-candidate-id');
  await page.mouse.move(gripX, gripY);
  await page.mouse.down();
  await page.mouse.move(targetX, targetY, { steps: 8 });
  const during = await frame.evaluate((element, pointX) => {
    const tokenEl = document.querySelector('.app-visual-view .plan39-repair-token');
    const tokenRect = tokenEl.getBoundingClientRect();
    const anchor = { x: tokenRect.left + tokenRect.width / 2, y: tokenRect.bottom };
    const points = [...element.querySelectorAll('.plan39-candidate-point')].map((point) => {
      const rect = point.getBoundingClientRect();
      return { id: point.getAttribute('data-candidate-id'), x: rect.left + rect.width / 2 };
    });
    const expected = points.reduce((best, item) => Math.abs(item.x - anchor.x) < Math.abs(best.x - anchor.x)
      ? item : best);
    const rings = [...element.querySelectorAll('.plan39-candidate-point.is-drop-preview')]
      .map((point) => point.getAttribute('data-candidate-id'));
    return { anchor, points, expectedId: expected.id, rings, pointerX: pointX };
  }, targetX);
  assert(Math.abs(during.anchor.x - targetAnchorX) < 1,
    `bottom-centre anchor must follow pointer with preserved grip offset: ${JSON.stringify({ anchorX: during.anchor.x, targetAnchorX })}`);
  assert.equal(during.rings.length, 1, 'eligible drag must show exactly one neutral offered-point ring');
  assert.equal(during.rings[0], during.expectedId, 'live ring must equal shared nearest-offered release result');
  await page.screenshot({ path: path.join(outputDir, `repair03-ring-${grip}.png`), fullPage: true });
  await page.mouse.up();
  assert.equal(await token.getAttribute('data-candidate-id'), during.expectedId, 'release must choose the highlighted candidate');
  assert.equal(await frame.locator('.is-drop-preview').count(), 0, 'release must clear the transient ring');
  return { grip, initialId, targetRatio, ...during, releasedId: await token.getAttribute('data-candidate-id') };
}

try {
  await page.goto(`http://127.0.0.1:${server.address().port}/FractionFlow/#bar-to-line-same-amount`, { waitUntil: 'domcontentloaded' });
  const token = page.locator('.app-visual-view .plan39-repair-token');
  await token.waitFor();
  assert.equal(await token.evaluate((element) => element.classList.contains('has-grab-cue')), true, 'first visible visual locate entry shows one-shot cue');
  assert.equal(await page.locator('.app-linear-view .plan39-repair-token').evaluate((element) => element.classList.contains('has-grab-cue')), false, 'hidden linear renderer does not consume or run the cue');
  await page.locator('.app-visual-view .plan39-stepper-previous').click();
  const centerGrip = await dragFrom({ grip: 'center', targetRatio: 0.5 });
  const edgeGrip = await dragFrom({ grip: 'edge', targetRatio: 1 });
  const tokenBox = await token.boundingBox();
  const frameBox = await page.locator('.app-visual-view .plan39-axis-frame').boundingBox();
  await page.mouse.move(tokenBox.x + tokenBox.width / 2, tokenBox.y + tokenBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(frameBox.x + frameBox.width * 0.5, tokenBox.y + tokenBox.height / 2, { steps: 6 });
  const defectWitness = await page.locator('.app-visual-view .plan39-axis-frame').evaluate((frame) => {
    const points = [...frame.querySelectorAll('.plan39-candidate-point')];
    const tokenEl = document.querySelector('.app-visual-view .plan39-repair-token');
    const rect = tokenEl.getBoundingClientRect();
    const anchorX = rect.left + rect.width / 2;
    const expected = points.reduce((best, point) => {
      const pointRect = point.getBoundingClientRect();
      return Math.abs(pointRect.left + pointRect.width / 2 - anchorX)
        < Math.abs(best.getBoundingClientRect().left + best.getBoundingClientRect().width / 2 - anchorX) ? point : best;
    });
    const wrong = points.find((point) => point !== expected);
    points.forEach((point) => point.classList.remove('is-drop-preview'));
    wrong.classList.add('is-drop-preview');
    return { expectedId: expected.getAttribute('data-candidate-id'), wrongId: wrong.getAttribute('data-candidate-id'), ringId: wrong.getAttribute('data-candidate-id') };
  });
  let defectDetected = false;
  try {
    assert.equal(defectWitness.ringId, defectWitness.expectedId, 'ordinary ring/drop assertion detects a deliberately mismatched highlight');
  } catch {
    defectDetected = true;
  }
  assert.equal(defectDetected, true, 'injected ring/anchor mismatch must fail the ordinary assertion');
  await page.keyboard.press('Escape');
  await page.mouse.up();
  assert.equal(await token.getAttribute('data-candidate-id'), edgeGrip.releasedId, 'mismatch seed cancellation restores the prior placement');
  assert.equal(await page.locator('.app-visual-view .plan39-check-position').isEnabled(), true, 'placement only enables explicit Check');
  assert.equal(await page.locator('.plan39-bar-track').count(), 0, 'dragging never auto-submits or reveals the bar');
  const reducedPage = await browser.newPage({ viewport: { width: 360, height: 740 }, reducedMotion: 'reduce' });
  await reducedPage.goto(`http://127.0.0.1:${server.address().port}/FractionFlow/#bar-to-line-same-amount`, { waitUntil: 'domcontentloaded' });
  const reducedCue = reducedPage.locator('.app-visual-view .plan39-repair-token');
  await reducedCue.waitFor();
  assert.equal(await reducedCue.evaluate((element) => element.classList.contains('has-grab-cue')), true, 'reduced-motion entry retains a static cue');
  assert.equal(await reducedCue.locator('.plan39-grab-cue').evaluate((element) => getComputedStyle(element).animationName), 'none', 'reduced-motion cue has no animation');
  await reducedPage.close();
  assert.deepEqual(pageErrors, [], 'browser has no page errors');
  evidence.checks.push({ name: 'visible-only one-shot cue and natural horizontal drags', passed: true, centerGrip, edgeGrip });
  evidence.checks.push({ name: 'ordinary assertion detects deliberately mismatched ring', passed: true, defectWitness });
  evidence.checks.push({ name: 'reduced-motion static cue', passed: true, animationName: 'none' });
  evidence.pageErrors = pageErrors;
  evidence.outcome = 'PASS';
} catch (error) {
  evidence.outcome = 'FAIL';
  evidence.error = error.stack || error.message;
  evidence.pageErrors = pageErrors;
  throw error;
} finally {
  await writeFile(path.join(outputDir, 'repair03-anchor-ring-smoke.json'), `${JSON.stringify(evidence, null, 2)}\n`);
  await browser.close();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
