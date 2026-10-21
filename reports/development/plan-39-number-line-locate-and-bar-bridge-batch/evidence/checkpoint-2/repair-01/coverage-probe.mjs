import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { PLAN37_BAR_TO_LINE_BRIDGE_RECORDS } from '../../../../../../src/content/data/plan37-bar-to-line-bridge-records.js';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('../../../../../../scripts/dev/run-route-matrix.js');
const server = createStaticServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const failures = [];
const results = [];
let currentScenario = 'startup';
const sameAmount = (a, b) => BigInt(a.numerator) * BigInt(b.denominator) === BigInt(b.numerator) * BigInt(a.denominator);

async function launchScenario({ width, height, dpr, support, targetIndex }) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.on('pageerror', (error) => failures.push(`${width}x${height} item${targetIndex + 1}: ${error.message}`));
  await page.goto(`http://127.0.0.1:${port}/FractionFlow/`, { waitUntil: 'domcontentloaded' });
  const runtimeViewport = await page.evaluate(() => ({ innerWidth, innerHeight, devicePixelRatio }));
  assert.deepEqual(runtimeViewport, { innerWidth: width, innerHeight: height, devicePixelRatio: dpr }, `actual browser viewport/DPR must match ${width}x${height} DPR ${dpr}`);
  await page.locator('.app-gear-button').click();
  await page.locator(`[data-support-id="${support}-support"]`).click();
  await page.locator('[data-practice-type="bar-to-line-same-amount"]').click();
  await page.locator('.app-visual-view .plan39-continue').click();

  async function assertViewportAndControls(view) {
    const region = page.locator(`.app-${view}-view .plan39-number-line`);
    await region.scrollIntoViewIfNeeded();
    const prompt = await region.locator('.active-beat-prompt').boundingBox();
    const controls = await region.locator('.plan39-controls').boundingBox();
    assert(prompt && controls, `${view}: active prompt and controls must be measurable`);
    assert(prompt.y >= 0 && prompt.y + prompt.height <= height, `${view}: prompt must fit viewport after one scroll`);
    assert(controls.y >= 0 && controls.y + controls.height <= height, `${view}: all controls must fit in the same viewport position (${JSON.stringify({ prompt, controls, height, scrollY: await page.evaluate(() => scrollY) })})`);
    const boxes = [];
    if (view === 'visual') {
      for (const locator of [region.locator('.plan39-stepper-previous'), region.locator('.plan39-stepper-next'), region.locator('.plan39-check-position')]) {
        const box = await locator.boundingBox();
        assert(box && box.width >= 44 && box.height >= 44, 'visual controls must meet 44px minimum');
        if (!(await locator.isDisabled())) {
          const isHit = await locator.evaluate((node) => {
            const r = node.getBoundingClientRect();
            return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest('button') === node;
          });
          assert(isHit, 'stepper/check center must hit the same real button');
          boxes.push(box);
        }
      }
    } else {
      const labels = region.locator('.plan39-candidate');
      for (let i = 0; i < await labels.count(); i += 1) {
        const label = labels.nth(i); const box = await label.boundingBox();
        assert(box && box.width >= 44 && box.height >= 44, 'linear label target must meet 44px minimum');
        const isHit = await label.evaluate((node) => {
          const r = node.getBoundingClientRect();
          return node.contains(document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2));
        });
        assert(isHit, 'linear label center must hit its label');
        boxes.push(box);
      }
    }
    for (let i = 0; i < boxes.length; i += 1) for (let j = i + 1; j < boxes.length; j += 1) {
      const dx = Math.min(boxes[i].x + boxes[i].width, boxes[j].x + boxes[j].width) - Math.max(boxes[i].x, boxes[j].x);
      const dy = Math.min(boxes[i].y + boxes[i].height, boxes[j].y + boxes[j].height) - Math.max(boxes[i].y, boxes[j].y);
      assert(dx <= 0 || dy <= 0, `${view}: controls must not overlap`);
    }
    return { prompt, controls, scrollY: await page.evaluate(() => scrollY) };
  }

  async function solveAndAdvance(index) {
    const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[index];
    let choiceIndex;
    if (support === 'high') choiceIndex = Number(record.sourceForm.numerator);
    else choiceIndex = record.sparseCandidates.findIndex((candidate) => sameAmount(candidate.form, record.sourceForm));
    assert(choiceIndex >= 0, `source choice should be offered for ${record.itemId}`);
    const right = page.locator('.app-visual-view .plan39-stepper-next');
    for (let i = 0; i < choiceIndex + 1; i += 1) await right.click();
    await page.locator('.app-visual-view .plan39-check-position').click();
    assert.equal(await page.locator('.app-visual-view .plan39-accepted-point').count(), 1, 'Check should accept the exact source amount');
    await page.locator('.app-visual-view .plan39-finish').click();
    await page.locator('.app-next-button').click();
    await page.locator('.app-visual-view .plan39-continue').click();
  }

  for (let index = 0; index < targetIndex; index += 1) await solveAndAdvance(index);
  const record = PLAN37_BAR_TO_LINE_BRIDGE_RECORDS[targetIndex];
  const expectedCount = support === 'high' ? Number(record.partitionDenominator) + 1 : 4;
  assert.equal(await page.locator('.app-visual-view .plan39-candidate-point').count(), expectedCount);
  assert.equal(await page.locator('.app-visual-view .plan39-check-position').isDisabled(), true, 'no correct point is preselected');
  const visualBounds = await assertViewportAndControls('visual');
  const visualMetrics = await page.evaluate(() => {
    const bar = document.querySelector('.app-visual-view .plan39-bar-track');
    const frame = document.querySelector('.app-visual-view .plan39-axis-frame');
    const axis = frame.querySelector('.plan39-axis-line');
    const b = bar.getBoundingClientRect(); const a = axis.getBoundingClientRect(); const f = frame.getBoundingClientRect();
    const segments = [...bar.querySelectorAll('.plan39-bar-part-shaded')].map((node) => node.getBoundingClientRect());
    const points = [...frame.querySelectorAll('.plan39-candidate-point')].map((node) => { const r = node.getBoundingClientRect(); return r.left + r.width / 2; });
    return { bar: { left: b.left, right: b.right, top: b.top, bottom: b.bottom }, axis: { left: a.left, right: a.right, centerY: a.top + a.height / 2 }, shadedStart: segments[0]?.left, shadedEnd: segments.at(-1)?.right, pointEnds: [points[0], points.at(-1)], pointCount: points.length, frame: { left: f.left, right: f.right } };
  });
  assert(Math.abs(visualMetrics.bar.left - visualMetrics.axis.left) <= 1 && Math.abs(visualMetrics.bar.right - visualMetrics.axis.right) <= 1, 'bar and line unit endpoints must align within 1px');
  assert(Math.abs(visualMetrics.shadedStart - visualMetrics.axis.left) <= 1, 'zero and shaded-bar start endpoints must align');
  if (support === 'high') assert(Math.abs(visualMetrics.pointEnds[0] - visualMetrics.axis.left) <= 1 && Math.abs(visualMetrics.pointEnds[1] - visualMetrics.axis.right) <= 1, `both line endpoint candidates must remain visible and on endpoints: ${JSON.stringify(visualMetrics)}`);
  const scenarioSlug = `${support}-${record.itemId}-${width}x${height}-dpr${dpr}`;
  await page.locator('.app-visual-view .plan39-number-line').screenshot({ path: `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/checkpoint-2/repair-01/${scenarioSlug}-visual.png` });
  if (targetIndex === 5 || targetIndex === 7) await page.screenshot({ path: `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/checkpoint-2/repair-01/${scenarioSlug}-visual-viewport.png` });
  await page.locator('.app-view-toggle').click();
  const linearBounds = await assertViewportAndControls('linear');
  const linear = page.locator('.app-linear-view .plan39-candidate input[type=radio]');
  assert.equal(await linear.count(), expectedCount, 'linear radio options must match active support candidates');
  const accessibleNames = [];
  for (let i = 0; i < await linear.count(); i += 1) accessibleNames.push(await linear.nth(i).getAttribute('aria-label'));
  assert.equal(new Set(accessibleNames).size, expectedCount, 'candidate descriptions must be distinct');
  assert(accessibleNames.every((label) => !/\b\d+\s*\/\s*\d+\b/.test(label)), 'linear descriptions must not reveal literal option fractions');
  await page.locator('.app-linear-view .plan39-number-line').screenshot({ path: `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/checkpoint-2/repair-01/${scenarioSlug}-linear.png` });
  if (targetIndex === 5 || targetIndex === 7) await page.screenshot({ path: `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/checkpoint-2/repair-01/${scenarioSlug}-linear-viewport.png` });
  const radio0 = linear.nth(0); await radio0.focus(); await radio0.press('ArrowRight');
  assert.equal(await linear.nth(1).isChecked(), true, 'native arrow-key navigation should preview the next option');
  assert.equal(await page.locator('.app-linear-view .plan39-feedback').count(), 0, 'linear keyboard movement must not grade');
  await page.locator('.app-view-toggle').click();
  assert.equal(await page.locator('.app-visual-view .plan39-stepper-status').getAttribute('data-candidate-id'), await linear.nth(1).getAttribute('data-candidate-id'), 'preview selection must survive a view change');
  const correctIndex = support === 'high' ? Number(record.sourceForm.numerator) : record.sparseCandidates.findIndex((candidate) => sameAmount(candidate.form, record.sourceForm));
  const currentId = await page.locator('.app-visual-view .plan39-stepper-status').getAttribute('data-candidate-id');
  const currentIndex = await linear.evaluateAll((nodes, id) => nodes.findIndex((node) => node.dataset.candidateId === id), currentId);
  const right = page.locator('.app-visual-view .plan39-stepper-next');
  for (let i = currentIndex; i < correctIndex; i += 1) await right.click();
  assert.equal(await page.locator('.app-visual-view .plan39-check-position').isDisabled(), false, `${scenarioSlug} preview should enable Check (current ${currentIndex}, correct ${correctIndex})`);
  assert.equal(await page.locator('.app-visual-view .plan39-feedback').count(), 0, 'preview should remain ungraded before Check');
  await page.locator('.app-visual-view .plan39-check-position').click();
  assert.equal(await page.locator('.app-visual-view .plan39-accepted-point').count(), 1);
  const connector = await page.evaluate(() => {
    const stack = document.querySelector('.app-visual-view .plan39-representation-stack');
    const line = stack.querySelector('.plan39-connector-overlay line');
    const svg = stack.querySelector('.plan39-connector-overlay');
    const p = stack.querySelector('.plan39-accepted-point').getBoundingClientRect();
    const bar = stack.querySelector('.plan39-bar-track'); const barRect = bar.getBoundingClientRect();
    const shaded = [...bar.querySelectorAll('.plan39-bar-part-shaded')].at(-1).getBoundingClientRect(); const s = stack.getBoundingClientRect();
    return { source: { x: s.left + Number(line.getAttribute('x1')), y: s.top + Number(line.getAttribute('y1')) }, target: { x: s.left + Number(line.getAttribute('x2')), y: s.top + Number(line.getAttribute('y2')) }, shade: { x: shaded.right, y: barRect.bottom }, point: { x: p.left + p.width / 2, y: p.top + p.height / 2 }, svg: svg.getBoundingClientRect().toJSON() };
  });
  assert(Math.abs(connector.source.x - connector.shade.x) <= 1 && Math.abs(connector.source.y - connector.shade.y) <= 1, 'connector source must meet the shade edge');
  assert(Math.abs(connector.target.x - connector.point.x) <= 1 && Math.abs(connector.target.y - connector.point.y) <= 1, 'connector target must meet accepted point center');
  assert(Math.abs(connector.shade.x - connector.point.x) <= 1, 'source shaded edge must align with accepted point at resolve');
  await page.locator('.app-visual-view .plan39-number-line').screenshot({ path: `reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/checkpoint-2/repair-01/${scenarioSlug}-resolved.png` });
  await page.locator('.app-visual-view .plan39-finish').click();
  assert.equal(await page.locator('.app-visual-view .plan39-finish').count(), 0, 'Finish must disappear after completion');
  await context.close();
  return { scenario: scenarioSlug, expectedCount, visualBounds, linearBounds, visualMetrics, connector, runtimeViewport };
}

try {
  const targets = [
    { support: 'high', targetIndex: 5 },
    { support: 'high', targetIndex: 3 },
    { support: 'medium', targetIndex: 6 },
    { support: 'medium', targetIndex: 7 },
  ];
  for (const target of targets) for (const viewport of [{ width: 360, height: 740, dpr: 1 }, { width: 1093, height: 614, dpr: 1.25 }]) {
    currentScenario = `${target.support}-record-${target.targetIndex + 1}-${viewport.width}x${viewport.height}-dpr${viewport.dpr}`;
    results.push(await launchScenario({ ...target, ...viewport }));
  }
  assert.equal(failures.length, 0, `browser page errors: ${failures.join('; ')}`);
  const report = { results, failures, browser: 'Chrome channel, headless', reducedMotion: true };
  await writeFile('reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/checkpoint-2/repair-01/coverage-results.json', `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ scenarios: results.map(({ scenario }) => scenario), failures }, null, 2));
} catch (error) {
  const failureReport = {
    status: 'failed',
    currentScenario,
    error: error.stack ?? error.message,
    completedResults: results,
    browserErrors: failures,
    browser: 'Chrome channel, headless',
    reducedMotion: true,
  };
  await writeFile('reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/checkpoint-2/repair-01/coverage-failure.json', `${JSON.stringify(failureReport, null, 2)}\n`);
  throw error;
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
