import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('../../../../../../scripts/dev/run-route-matrix.js');
const server = createStaticServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1 });
const errors = [];
let currentStep = 'startup';
page.on('pageerror', (error) => errors.push(error.message));
try {
  currentStep = 'open locate and measure controls';
  await page.goto(`http://127.0.0.1:${port}/FractionFlow/#bar-to-line-same-amount`, { waitUntil: 'domcontentloaded' });
  await page.locator('.app-visual-view .plan39-number-line').waitFor();
  await page.locator('.app-visual-view .plan39-continue').click();
  const locate = page.locator('.app-visual-view .plan39-number-line');
  await locate.scrollIntoViewIfNeeded();
  const measured = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    const rect = (node) => { const r = node.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }; };
    const bar = q('.app-visual-view .plan39-bar-track');
    const frame = q('.app-visual-view .plan39-axis-frame');
    const axis = q('.app-visual-view .plan39-axis-line');
    const prompt = q('.app-visual-view .active-beat-prompt');
    const controls = q('.app-visual-view .plan39-controls');
    const buttons = [...controls.querySelectorAll('button')].map((node) => ({ label: node.textContent, rect: rect(node), disabled: node.disabled }));
    const shaded = [...bar.querySelectorAll('.plan39-bar-part-shaded')].map(rect);
    return { dpr: devicePixelRatio, viewport: { width: innerWidth, height: innerHeight }, scrollY, prompt: rect(prompt), controls: rect(controls), bar: rect(bar), frame: rect(frame), axis: rect(axis), shadedStart: shaded[0]?.left, shadedEnd: shaded.at(-1)?.right, buttons, candidatePoints: [...frame.querySelectorAll('.plan39-candidate-point')].map(rect) };
  });
  assert.equal(measured.dpr, 1);
  assert.equal(measured.viewport.width, 360);
  assert(Math.abs(measured.shadedStart - measured.axis.left) <= 1, 'bar zero endpoint and line zero endpoint must align within 1px');
  assert(Math.abs(measured.shadedEnd - (measured.axis.left + measured.axis.width / 2)) <= 1, 'half shade endpoint must align with line midpoint within 1px');
  assert(Math.abs(measured.shadedEnd - (measured.candidatePoints[1].left + measured.candidatePoints[1].width / 2)) <= 1, 'half shade endpoint must align with candidate dot within 1px');
  const controls = page.locator('.app-visual-view .plan39-controls');
  const check = page.locator('.app-visual-view .plan39-check-position');
  const assertControlContract = async () => {
    const promptRect = await page.locator('.app-visual-view .active-beat-prompt').boundingBox();
    const controlsRect = await controls.boundingBox();
    const viewport = page.viewportSize();
    assert(promptRect && controlsRect, 'prompt and response controls must have rendered bounds');
    assert(promptRect.y >= 0 && promptRect.y + promptRect.height <= viewport.height, 'prompt must be in viewport');
    assert(controlsRect.y >= 0 && controlsRect.y + controlsRect.height <= viewport.height, 'full response controls must be in the same viewport');
    const boxes = [];
    for (const button of await controls.locator('button').all()) {
      const box = await button.boundingBox();
      if (!box || (await button.isDisabled())) continue;
      assert(box.width >= 44 && box.height >= 44, 'active response target must be at least 44x44 CSS pixels');
      const center = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
      const hit = await button.evaluate((element, { x, y }) => element === document.elementFromPoint(x, y)?.closest('button'), center);
      assert(hit, 'target center must hit that real button');
      boxes.push(box);
    }
    for (let i = 0; i < boxes.length; i += 1) for (let j = i + 1; j < boxes.length; j += 1) {
      const overlapX = Math.min(boxes[i].x + boxes[i].width, boxes[j].x + boxes[j].width) - Math.max(boxes[i].x, boxes[j].x);
      const overlapY = Math.min(boxes[i].y + boxes[i].height, boxes[j].y + boxes[j].height) - Math.max(boxes[i].y, boxes[j].y);
      assert(overlapX <= 0 || overlapY <= 0, 'active response controls must not overlap');
    }
  };
  await assertControlContract();
  const preview = page.locator('.app-visual-view .plan39-stepper-status');
  assert.equal(await check.isDisabled(), true, 'Check must be disabled before a preview is selected');
  const failingFirst = [];
  const assertNoGradeBeforeCheck = async () => {
    assert.equal(await page.locator('.app-visual-view .plan39-feedback').count(), 0, 'selection alone must not grade');
    assert.equal(await page.locator('.app-visual-view .plan39-accepted-point').count(), 0, 'selection alone must not accept a point');
    assert.equal((await page.locator('.app-visual-view .active-beat-prompt').textContent()).trim(), 'Place the same amount on the number line.');
  };
  currentStep = 'failing-first early Check assertion';
  await page.evaluate(() => { const button = document.querySelector('.app-visual-view .plan39-check-position'); button.disabled = false; });
  try {
    assert.equal(await check.isDisabled(), true, 'Check must stay disabled until learner selection');
  } catch (error) { failingFirst.push({ probe: 'bypass-check-state', rejected: true, message: error.message }); }
  assert.equal(failingFirst.length, 1, 'the normal preselection assertion must reject bypassed Check state');
  await page.evaluate(() => { const button = document.querySelector('.app-visual-view .plan39-check-position'); button.disabled = true; });
  currentStep = 'failing-first selection auto-submit assertion';
  await page.evaluate(() => {
    const next = document.querySelector('.app-visual-view .plan39-stepper-next');
    const checkButton = document.querySelector('.app-visual-view .plan39-check-position');
    next.addEventListener('click', () => checkButton.click(), { once: true });
  });
  await page.locator('.app-visual-view .plan39-stepper-next').click();
  try { await assertNoGradeBeforeCheck(); } catch (error) { failingFirst.push({ probe: 'selection-auto-submission', rejected: true, message: error.message }); }
  assert.equal(failingFirst.length, 2, 'the normal no-grade-before-Check assertion must reject selection auto-submission');
  await page.locator('.app-restart-button').click();
  await page.locator('.app-visual-view .plan39-continue').click();
  assert.equal(await page.locator('.app-visual-view .plan39-check-position').isDisabled(), true);
  assert.equal(await page.locator('.app-visual-view .plan39-feedback').count(), 0);
  await page.locator('.app-visual-view .plan39-stepper-next').click();
  assert.equal(await check.isDisabled(), false, 'Check enables only after a stepper selection');
  await page.locator('.app-visual-view .plan39-stepper-next').click();
  assert.equal(await page.locator('.app-visual-view .plan39-preview-marker').count(), 1);
  assert.equal(await page.locator('.app-visual-view .plan39-accepted-point').count(), 0, 'preview must not expose an accepted point');
  assert.equal(await page.locator('.app-visual-view .plan39-feedback').count(), 0, 'preview must not grade');
  await locate.screenshot({ path: 'reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/checkpoint-2/repair-01/locate-360.png' });
  const selected = await preview.getAttribute('data-candidate-id');
  currentStep = 'failing-first undersized stepper target assertion';
  await page.evaluate(() => { const button = document.querySelector('.app-visual-view .plan39-stepper-next'); button.style.transform = 'scale(0.5)'; });
  try {
    await assertControlContract();
  } catch (error) { failingFirst.push({ probe: 'undersized-stepper-target', rejected: true, message: error.message }); }
  assert.equal(failingFirst.length, 3, 'normal assertions must reject early Check, selection auto-submit, and undersized target seeds');
  currentStep = 'clean preview and explicit Check';
  await page.evaluate(() => { const button = document.querySelector('.app-visual-view .plan39-stepper-next'); button.style.transform = ''; });
  await assertControlContract();
  await page.locator('.app-visual-view .plan39-check-position').click();
  assert.equal(await page.locator('.app-visual-view .plan39-preview-marker').count(), 0);
  assert.equal(await page.locator('.app-visual-view .plan39-accepted-point').count(), 1);
  const connector = await page.evaluate(() => {
    const stack = document.querySelector('.app-visual-view .plan39-representation-stack');
    const svg = stack.querySelector('.plan39-connector-overlay');
    const line = svg?.querySelector('line');
    const point = stack.querySelector('.plan39-accepted-point');
    const bar = stack.querySelector('.plan39-bar-track');
    const shaded = [...bar.querySelectorAll('.plan39-bar-part-shaded')];
    const axis = stack.querySelector('.plan39-axis-line');
    if (!line || !point) return null;
    const stackRect = stack.getBoundingClientRect(); const pointRect = point.getBoundingClientRect();
    const barRect = bar.getBoundingClientRect(); const shadedRect = shaded.at(-1).getBoundingClientRect(); const axisRect = axis.getBoundingClientRect();
    return { lineSource: { x: stackRect.left + Number(line.getAttribute('x1')), y: stackRect.top + Number(line.getAttribute('y1')) }, lineTarget: { x: stackRect.left + Number(line.getAttribute('x2')), y: stackRect.top + Number(line.getAttribute('y2')) }, shadeTarget: { x: shadedRect.right, y: barRect.bottom }, acceptedPoint: { x: pointRect.left + pointRect.width / 2, y: pointRect.top + pointRect.height / 2 }, axis: { left: axisRect.left, right: axisRect.right } };
  });
  assert(connector, 'resolved visual view must render the source-to-point connector');
  assert(Math.abs(connector.lineSource.x - connector.shadeTarget.x) <= 1 && Math.abs(connector.lineSource.y - connector.shadeTarget.y) <= 1, 'connector must begin at the bar shaded edge');
  assert(Math.abs(connector.lineTarget.x - connector.acceptedPoint.x) <= 1 && Math.abs(connector.lineTarget.y - connector.acceptedPoint.y) <= 1, `connector must end at the accepted point: ${JSON.stringify(connector)}`);
  assert(Math.abs(connector.shadeTarget.x - connector.acceptedPoint.x) <= 1, 'source shade end and accepted point must align at this exact half task');
  currentStep = 'complete resolved episode';
  await page.locator('.app-visual-view .plan39-finish').click();
  assert.equal(await page.locator('.app-visual-view .plan39-finish').count(), 0, 'resolved episodes must not retain spent Finish control');
  assert(errors.length === 0, `browser page errors: ${errors.join('; ')}`);
  console.log(JSON.stringify({ viewport: page.viewportSize(), selected, measured, connector, failingFirst, browserErrors: errors }, null, 2));
} catch (error) {
  let diagnostics = null;
  try {
    diagnostics = await page.evaluate(() => ({
      url: location.href,
      viewport: { innerWidth, innerHeight, devicePixelRatio },
      prompt: document.querySelector('.app-visual-view .active-beat-prompt')?.textContent ?? null,
      candidateId: document.querySelector('.app-visual-view .plan39-stepper-status')?.getAttribute('data-candidate-id') ?? null,
      checkDisabled: document.querySelector('.app-visual-view .plan39-check-position')?.disabled ?? null,
      feedback: document.querySelector('.app-visual-view .plan39-feedback')?.textContent ?? null,
      acceptedPointCount: document.querySelectorAll('.app-visual-view .plan39-accepted-point').length,
      activeElement: document.activeElement?.outerHTML?.slice(0, 500) ?? null,
      scrollY,
    }));
  } catch (diagnosticError) { diagnostics = { diagnosticError: diagnosticError.message }; }
  await writeFile('reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/checkpoint-2/repair-01/mounted-repair-failure.json', `${JSON.stringify({ status: 'failed', currentStep, error: error.stack ?? error.message, diagnostics, browserErrors: errors }, null, 2)}\n`);
  throw error;
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
