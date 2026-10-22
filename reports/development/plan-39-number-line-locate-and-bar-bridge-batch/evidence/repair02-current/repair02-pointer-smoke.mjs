import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('../../../../../scripts/dev/run-route-matrix.js');
const outputDir = path.dirname(fileURLToPath(import.meta.url));
const server = createStaticServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1 });
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));
const evidence = { browser: 'installed Chrome via Playwright channel', viewport: { width: 360, height: 740 }, checks: [] };

try {
  await page.goto(`http://127.0.0.1:${server.address().port}/FractionFlow/#bar-to-line-same-amount`, { waitUntil: 'domcontentloaded' });
  const visual = page.locator('.app-visual-view');
  await visual.locator('.plan39-repair-token').waitFor();
  assert.equal(await page.locator('.plan39-bar-track').count(), 0, 'no shaded bar may be present before Check');
  assert.equal(await page.locator('.plan39-repair-token').count(), 2, 'both active and hidden view retain an unplaced source token');
  const initial = await page.evaluate(() => {
    const rect = (selector) => { const r = document.querySelector(selector).getBoundingClientRect(); return { x:r.x,y:r.y,width:r.width,height:r.height,left:r.left,right:r.right,top:r.top,bottom:r.bottom }; };
    const token = document.querySelector('.app-visual-view .plan39-repair-token');
    const frame = document.querySelector('.app-visual-view .plan39-axis-frame');
    const source = token.getAttribute('aria-label').match(/(\d+)\/(\d+)/);
    return {
      source: { numerator: Number(source[1]), denominator: Number(source[2]) },
      points: [...frame.querySelectorAll('.plan39-candidate-point')].map((el) => ({ id:el.getAttribute('data-candidate-id'), ratio:parseFloat(el.style.left)/100 })),
      token: rect('.app-visual-view .plan39-repair-token'),
      tray: rect('.app-visual-view .plan39-token-tray'),
      frame: rect('.app-visual-view .plan39-axis-frame'),
      stepperButtons: [...document.querySelectorAll('.app-visual-view .plan39-stepper-move')].map((el) => { const r=el.getBoundingClientRect(); return { width:r.width,height:r.height }; }),
      initialStepperLabels: [...document.querySelectorAll('.app-visual-view .plan39-stepper-move')].map((el) => el.textContent.trim()),
      tokenTouchAction: getComputedStyle(token).touchAction,
      trackTouchAction: getComputedStyle(frame).touchAction,
    };
  });
  assert(initial.frame.height >= 44, 'track drop band must be at least 44px tall');
  assert(initial.token.width >= 44 && initial.token.height >= 44, 'token handle must be at least 44px');
  assert(initial.stepperButtons.every(({ width, height }) => width >= 44 && height >= 44), 'visual keyboard step controls must be at least 44px');
  assert.deepEqual(initial.initialStepperLabels, ['← Place at 1', 'Place at 0 →'], 'unplaced controls must name the endpoint they place at');
  assert.equal(initial.tokenTouchAction, 'none');
  assert.equal(initial.trackTouchAction, 'pan-y');
  await page.screenshot({ path: path.join(outputDir, 'repair02-initial-360x740.png'), fullPage: true });
  evidence.checks.push({ name: 'initial placement state', passed: true, measurements: initial, dom: { hiddenAndVisibleBars: 0, sourceTokens: 2 } });

  await visual.locator('.plan39-stepper-previous').click();
  assert.equal(await visual.locator('.plan39-repair-token').getAttribute('data-candidate-id'), initial.points.at(-1).id, 'initial left control places at 1');
  assert.equal(await visual.locator('.plan39-stepper-previous').textContent(), '← Move left', 'placed controls change to movement labels');
  await page.locator('.app-restart-button').click();
  await visual.locator('.plan39-repair-token').waitFor();
  assert.equal(await visual.locator('.plan39-repair-token').getAttribute('data-candidate-id'), null, 'Retry restores the unplaced state');
  evidence.checks.push({ name: 'initial left control places at 1, then changes to Move left; Retry clears placement', passed: true });

  const token = visual.locator('.plan39-repair-token');
  let tokenBox = await token.boundingBox();
  let frameBox = await visual.locator('.plan39-axis-frame').boundingBox();
  assert(tokenBox && frameBox);
  await page.mouse.move(tokenBox.x + tokenBox.width / 2, tokenBox.y + tokenBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(frameBox.x + frameBox.width / 2, frameBox.y + frameBox.height + 20, { steps: 6 });
  await page.mouse.up();
  assert.equal(await visual.locator('.plan39-check-position').isEnabled(), false, 'off-band release must not select');
  assert.equal(await token.getAttribute('data-candidate-id'), null, 'off-band release restores unplaced token');
  evidence.checks.push({ name: 'off-band drag restores unplaced token', passed: true });

  tokenBox = await token.boundingBox();
  frameBox = await visual.locator('.plan39-axis-frame').boundingBox();
  const tieX = frameBox.x + frameBox.width * (initial.points[0].ratio + initial.points[1].ratio) / 2;
  const axisY = await visual.locator('.plan39-axis-line').evaluate((el) => { const r=el.getBoundingClientRect(); return r.y+r.height/2; });
  await page.mouse.move(tokenBox.x + tokenBox.width / 2, tokenBox.y + tokenBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(tieX, axisY, { steps: 8 });
  await page.mouse.up();
  assert.equal(await token.getAttribute('data-candidate-id'), initial.points[0].id, 'equidistant drag must stably choose the lower position');
  assert.equal(await visual.locator('.plan39-check-position').isEnabled(), true);
  assert.equal(await page.locator('.plan39-bar-track').count(), 0, 'selection alone cannot reveal a shaded bar');
  const pending = await token.evaluate((el) => ({ border: getComputedStyle(el).borderTopColor, background: getComputedStyle(el).backgroundColor, aria: el.getAttribute('aria-label') }));
  assert.equal(pending.aria, `${initial.source.numerator}/${initial.source.denominator}, placed at ${initial.points[0].id.startsWith('partition-') ? `Step ${initial.points[0].id.match(/partition-(\d+)-of-(\d+)/)[1]} of ${initial.points[0].id.match(/partition-(\d+)-of-(\d+)/)[2]} equal steps from 0` : initial.points[0].id}`);
  assert.notEqual(pending.border, 'rgb(36, 93, 67)', 'pending marker paint is neutral, not accepted green');
  await page.screenshot({ path: path.join(outputDir, 'repair02-pending-neutral-360x740.png'), fullPage: true });
  evidence.checks.push({ name: 'drag snapping, lower tie, neutral pending paint and explicit Check', passed: true, selected: await token.getAttribute('data-candidate-id'), token: pending });

  // Escape during a second captured drag must restore the prior candidate.
  tokenBox = await token.boundingBox();
  await page.mouse.move(tokenBox.x + tokenBox.width / 2, tokenBox.y + tokenBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(frameBox.x + frameBox.width / 2, axisY, { steps: 5 });
  await page.keyboard.press('Escape');
  await page.mouse.up();
  assert.equal(await token.getAttribute('data-candidate-id'), initial.points[0].id, 'Escape must restore the pregesture placement');
  evidence.checks.push({ name: 'Escape restores pregesture placement', passed: true });

  await visual.locator('.plan39-check-position').click();
  assert.equal(await visual.locator('.plan39-feedback').count(), 1, 'incorrect offered endpoint is checked and receives recovery');
  assert.equal(await page.locator('.plan39-bar-track').count(), 0, 'incorrect check does not reveal the shaded bar');
  evidence.checks.push({ name: 'incorrect explicit Check returns to location without bar', passed: true });

  // A track tap after Check's redraw confirms that pointer handlers bind to the new frame.
  frameBox = await visual.locator('.plan39-axis-frame').boundingBox();
  const sourceX = frameBox.x + frameBox.width * initial.source.numerator / initial.source.denominator;
  const tapY = await visual.locator('.plan39-axis-line').evaluate((el) => { const r=el.getBoundingClientRect(); return r.y+r.height/2; });
  await page.mouse.click(sourceX, tapY);
  const expectedCandidate = initial.points.find(({ ratio }) => Math.abs(ratio - initial.source.numerator / initial.source.denominator) < 1e-9);
  assert(expectedCandidate, 'authored source amount must match one rendered offered location');
  assert.equal(await visual.locator('.plan39-repair-token').getAttribute('data-candidate-id'), expectedCandidate.id, 'tap-to-place selects the exact offered source location after error redraw');
  evidence.checks.push({ name: 'track tap after redraw snaps to exact offered source location', passed: true, selected: expectedCandidate.id });
  await visual.locator('.plan39-check-position').click();
  assert.equal(await visual.locator('.plan39-bar-track').count(), 1, 'accepted Check reveals exactly one visual shaded bar');
  assert.equal(await visual.locator('.plan39-connector-overlay').count(), 1, 'accepted state draws the bar-to-location connector');
  const accepted = await page.evaluate(() => {
    const bar = document.querySelector('.app-visual-view .plan39-bar-track');
    const shade = bar.querySelector('.plan39-bar-part-shaded').getBoundingClientRect();
    const frame = document.querySelector('.app-visual-view .plan39-axis-frame');
    const candidate = frame.querySelector('[data-accepted-position="true"]').getBoundingClientRect();
    const result = document.querySelector('.app-visual-view .plan39-resolution-description').textContent;
    return { shadedEnd: shade.right, markerCenter: candidate.left + candidate.width/2, result, linearSourceDescriptions: document.querySelectorAll('.app-linear-view .plan39-linear-source-description').length, linearTrackDescriptions: document.querySelectorAll('.app-linear-view .plan39-track-description').length };
  });
  assert(Math.abs(accepted.shadedEnd - accepted.markerCenter) <= 1, 'accepted shade endpoint aligns with accepted number-line point within 1px');
  assert.match(accepted.result, /^\d+ of \d+ equal steps from 0 is \d+\/\d+\.$/);
  assert.equal(accepted.linearSourceDescriptions, 0, 'linear resolution omits redundant bar explanation');
  assert.equal(accepted.linearTrackDescriptions, 0, 'linear resolution omits generic line explanation');
  await page.screenshot({ path: path.join(outputDir, 'repair02-accepted-aligned-360x740.png'), fullPage: true });
  evidence.checks.push({ name: 'accepted reveal and measured alignment', passed: true, measurements: accepted });

  await page.locator('.app-restart-button').click();
  await page.locator('.app-view-toggle').click();
  const linearRadio = page.locator(`.app-linear-view input[type="radio"][data-candidate-id="${expectedCandidate.id}"]`);
  assert.equal(await linearRadio.count(), 1);
  const radioLabel = await linearRadio.getAttribute('aria-label');
  assert.match(radioLabel, /equal steps from 0/);
  await linearRadio.press('Space');
  assert.equal(await linearRadio.evaluate((el) => el.checked), true, 'native radio must select from the keyboard');
  const linearCheck = page.locator('.app-linear-view .plan39-check-position');
  assert.equal(await linearCheck.isEnabled(), true);
  await linearCheck.press('Enter');
  assert.equal(await page.locator('.app-linear-view .plan39-resolution-description').count(), 1);
  assert.equal(await page.locator('.app-linear-view .plan39-linear-source-description').count(), 0);
  assert.equal(await page.locator('.app-linear-view .plan39-track-description').count(), 0);
  await page.screenshot({ path: path.join(outputDir, 'repair02-linear-keyboard-result-360x740.png'), fullPage: true });
  evidence.checks.push({ name: 'linear native radio and explicit Check operate by keyboard', passed: true, radioLabel });

  assert.deepEqual(pageErrors, [], 'page must not report runtime errors');
  evidence.pageErrors = pageErrors;
  evidence.outcome = 'PASS';
} catch (error) {
  evidence.outcome = 'FAIL';
  evidence.error = error.stack || error.message;
  evidence.pageErrors = pageErrors;
  throw error;
} finally {
  await writeFile(path.join(outputDir, 'repair02-pointer-smoke.json'), `${JSON.stringify(evidence, null, 2)}\n`);
  await browser.close();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
