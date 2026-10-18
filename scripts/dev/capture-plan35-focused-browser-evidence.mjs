import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { fileURLToPath } from 'node:url';
import { PLAN35_PRACTICE_TYPES_V7 } from '../../src/app/practice-types.js';
import { PLAN35_ADDITION_RECIPE_RECORDS } from '../../src/content/data/plan35-addition-recipe-records.js';
import { resolveCuratedFixture } from '../../src/content/authored-content-catalog.js';
import { addAtCommonDenominator, convertToDenominator, createFraction, equalFractions } from '../../src/math/index.js';

const output = new URL('../../reports/development/plan-35-reusable-task-recipes-and-authored-batch/plan35-focused-browser-results.json', import.meta.url);
const server = await createServer({ server: { host: '127.0.0.1', port: 0, hmr: false } });
let browser;
const measurements = [];
const journeys = [];
const pageErrors = [];
const failedResponses = [];
const failedRequests = [];
const consoleErrors = [];
const motionEvidence = [];
const seeds = [];
const type = PLAN35_PRACTICE_TYPES_V7.find((entry) => entry.id === 'sum-under-one');
const records = new Map(PLAN35_ADDITION_RECIPE_RECORDS.map((record) => [record.itemId, record]));
const fraction = (form) => createFraction(BigInt(form.numerator), BigInt(form.denominator));

function forms(item) {
  const fixture = resolveCuratedFixture(item.fixtureId, item.authoringRevision);
  const d = BigInt(item.targetDenominator);
  const left = convertToDenominator(fraction(fixture.left), d);
  const right = convertToDenominator(fraction(fixture.right), d);
  const total = addAtCommonDenominator(fraction(fixture.left), fraction(fixture.right), d);
  return { fixture, left, right, total };
}

async function measure(page, label, { requireFull = false } = {}) {
  const data = await page.evaluate(() => {
    const visible = (selector) => {
      const element = [...document.querySelectorAll(selector)].find((node) => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
      });
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      const left = Math.max(0, rect.left);
      const top = Math.max(0, rect.top);
      const right = Math.min(innerWidth, rect.right);
      const bottom = Math.min(innerHeight, rect.bottom);
      return { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height, viewportIntersection: Math.max(0, right - left) * Math.max(0, bottom - top), fullyWithinViewport: rect.left >= -0.5 && rect.top >= -0.5 && rect.right <= innerWidth + 0.5 && rect.bottom <= innerHeight + 0.5 };
    };
    const root = document.documentElement;
    return {
      cssViewport: { width: innerWidth, height: innerHeight },
      visualViewport: window.visualViewport ? { width: visualViewport.width, height: visualViewport.height, scale: visualViewport.scale } : null,
      document: { width: root.scrollWidth, height: root.scrollHeight, horizontalOverflow: root.scrollWidth > root.clientWidth },
      scroll: { x: scrollX, y: scrollY },
      question: visible('.active-beat-prompt'),
      controls: visible('.active-beat-controls'),
      headings: [...document.querySelectorAll('.app-visual-view h1, .app-visual-view h2, .app-linear-view h1, .app-linear-view h2')]
        .filter((element) => getComputedStyle(element).display !== 'none' && getComputedStyle(element).visibility !== 'hidden').map((element) => element.innerText),
      promptCount: [...document.querySelectorAll('.active-beat-prompt')].filter((element) => {
        const r = element.getBoundingClientRect(); return r.width > 0 && r.height > 0;
      }).length,
      visibleText: document.querySelector('.app-episode')?.innerText ?? '',
    };
  });
  assert.ok(data.question && data.question.viewportIntersection > 0, `${label}: active question intersects viewport`);
  assert.ok(data.controls && data.controls.viewportIntersection > 0, `${label}: active controls intersect viewport`);
  assert.equal(data.document.horizontalOverflow, false, `${label}: no horizontal document overflow`);
  assert.equal(data.promptCount, 1, `${label}: exactly one visible task question`);
  if (requireFull) {
    assert.equal(data.question.fullyWithinViewport, true, `${label}: active question fully fits viewport within half-pixel rounding tolerance`);
    assert.equal(data.controls.fullyWithinViewport, true, `${label}: active controls fully fit viewport within half-pixel rounding tolerance`);
  }
  assert.doesNotMatch(data.visibleText, /fixtureProfileId|recipeId|taskDataRevision|sourceForms/i, `${label}: no authoring language shown`);
  measurements.push({ label, ...data });
}

async function clickVisible(page, selector) { await page.locator(selector).first().click(); }
async function tabTo(page, selector, label, maximum = 80) {
  for (let index = 0; index < maximum; index += 1) {
    await page.keyboard.press('Tab');
    if (await page.evaluate((candidate) => document.activeElement?.matches(candidate) ?? false, selector)) return index + 1;
  }
  const buttons = await page.locator('.app-linear-view .active-beat-controls button').evaluateAll((nodes) => nodes.map((node) => ({ text: node.innerText, label: node.getAttribute('aria-label'), hidden: node.hidden, disabled: node.disabled })));
  throw new Error(`Keyboard Tab could not reach ${label} (${selector}); controls=${JSON.stringify(buttons)}`);
}
async function enterByKeyboard(page, selector, label) {
  const tabs = await tabTo(page, selector, label);
  await page.keyboard.press('Enter');
  return tabs;
}
async function typeAndEnterByKeyboard(page, selector, value, label) {
  const tabs = await tabTo(page, selector, label);
  await page.keyboard.type(String(value));
  await page.keyboard.press('Enter');
  return tabs;
}
async function assertAnswerWithheldFromEpisode(page, answer) {
  const episode = page.locator('.app-episode');
  const renderedText = await episode.innerText();
  const accessibleLabels = await episode.locator('[aria-label]').evaluateAll((nodes) => nodes
    .filter((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    })
    .map((node) => node.getAttribute('aria-label'))
    .filter(Boolean));
  const normalized = `${renderedText} ${accessibleLabels.join(' ')}`.toLowerCase().replace(/\s+/g, ' ');
  const variants = [
    `${answer.numerator}/${answer.denominator}`,
    `${answer.numerator} / ${answer.denominator}`,
    `${answer.numerator} over ${answer.denominator}`,
    `${answer.numerator} ${answer.denominator}`,
  ];
  const leakedVariant = variants.find((variant) => normalized.includes(variant.toLowerCase())) ?? null;
  assert.equal(leakedVariant, null, `correct candidate/equivalent ${answer.numerator}/${answer.denominator} is withheld from visible and accessible episode content`);
  return { renderedText, accessibleLabels, withheld: true, testedVariants: variants };
}
async function submit(page, host, selector, value, key = null) {
  const field = page.locator(selector).first();
  await field.fill(String(value));
  if (key) await field.press(key);
  else await page.locator(`${host} .active-beat-controls .control-submit-btn`).first().click();
}

async function startPage({ viewport, reducedMotion = false, touch = false, group = '' } = {}) {
  const context = await browser.newContext({ viewport, reducedMotion: reducedMotion ? 'reduce' : 'no-preference', hasTouch: touch });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  cdp.on('Network.responseReceived', ({ response, type }) => { if (response.status >= 400) failedResponses.push({ status: response.status, url: response.url, resourceType: type, source: 'Chrome CDP Network.responseReceived' }); });
  page.on('pageerror', (error) => pageErrors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') { console.error('browser console:', message.text(), message.location()); consoleErrors.push({ text: message.text(), location: message.location() }); } });
  page.on('response', (response) => { if (response.status() >= 400) failedResponses.push({ status: response.status(), url: response.url(), resourceType: response.request().resourceType() }); });
  page.on('requestfailed', (request) => failedRequests.push({ url: request.url(), resourceType: request.resourceType(), failure: request.failure()?.errorText ?? 'unknown' }));
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/FractionFlow/tests/fixtures/plan35-sample-entry.html${group ? `?group=${group}` : ''}`);
  await page.waitForSelector('.fractionflow-app');
  return { context, page };
}

async function setSupport(page, support) {
  await page.locator('.app-gear-button').click();
  const selector = `[data-support-id="${support}-support"]`;
  if (!await page.locator(selector).isVisible()) await page.locator('.app-gear-button').click();
  await page.locator(selector).click();
}

async function begin(page) {
  await page.locator('.app-practice-button').click();
  await page.waitForSelector('.app-episode');
}

async function enterTask(page, host, recipe, id, view) {
  const item = type.items.find((candidate) => candidate.id === id);
  const record = records.get(id);
  const { fixture, left, right, total } = forms(item);
  assert.ok(item && record && fixture, `registered sample record ${id}`);
  await clickVisible(page, `${host} .active-beat-controls .control-btn`);
  if (recipe === 'identify') {
    const sideIndex = record.requiredSide === 'left' ? 0 : 1;
    const side = page.locator(`${host} .nested-side-choice`).nth(sideIndex);
    if (view === 'linear') await side.tap();
    else await side.click();
  }
  return { item, record, fixture, left, right, total };
}

async function finish(page, host, { hasNext = true } = {}) {
  await page.locator(`${host} .active-beat-controls .control-btn`).first().click();
  assert.equal(await page.locator('.app-next-button').isVisible(), hasNext, 'Next visibility matches set membership after task completion');
  if (hasNext) await page.locator('.app-next-button').click();
}

try {
  await server.listen();
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  let { context, page } = await startPage({ viewport: { width: 360, height: 740 }, touch: true });
  await setSupport(page, 'high');
  await begin(page);
  let host = '.app-visual-view';
  assert.equal(await page.locator('.app-support-panel button.app-secondary-button:not(.app-replay-button):not(.app-restart-button)').isVisible(), false, 'global help is hidden on generalized construct encounter');
  await measure(page, 'sample entry 360x740, high support, visual, construct 10');
  await page.screenshot({ path: fileURLToPath(new URL('../../reports/development/plan-35-reusable-task-recipes-and-authored-batch/plan35-construct-10-360x740.png', import.meta.url)) });

  let s = await enterTask(page, host, 'construct', 'plan35-construct-half-fifth-10', 'visual');
  const entryScrollBefore = await page.evaluate(() => ({ y: scrollY, height: document.documentElement.scrollHeight }));
  const help = page.locator(`${host} .active-beat-controls .app-secondary-button`).first();
  await help.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 1));
  const entryScrollAfter = await page.evaluate(() => ({ y: scrollY, height: document.documentElement.scrollHeight }));
  const entryHelpBounds = await help.boundingBox();
  assert.ok(entryHelpBounds && entryHelpBounds.y >= 0 && entryHelpBounds.y + entryHelpBounds.height <= 740.5, 'task-local Need help button fully fits after ordinary scroll within half-pixel tolerance');
  await measure(page, 'construct target10 transform after scrolling local help/response controls into view, 360x740', { requireFull: true });
  journeys.push({ itemId: s.item.id, action: 'transform help scroll', before: entryScrollBefore, after: entryScrollAfter, helpBounds: entryHelpBounds, evidence: 'question and task-local multiplier-help control fully visible after ordinary vertical scroll' });
  await page.screenshot({ path: fileURLToPath(new URL('../../reports/development/plan-35-reusable-task-recipes-and-authored-batch/plan35-construct-10-transform-help-360x740.png', import.meta.url)) });
  const leftInput = `${host} #transform-num-input-left`;
  await page.locator(leftInput).fill('9');
  await help.click();
  assert.match(await page.locator('.app-episode').innerText(), /× \? = 10/);
  await help.click();
  assert.equal(await page.locator(leftInput).inputValue(), '9', 'draft survives help opening and closing');
  await help.click();
  const multiplier = `${host} #transform-help-multiplier-left`;
  await submit(page, host, multiplier, '1');
  assert.equal(await page.locator(`${host} .recovery-feedback`).first().isVisible(), true, 'wrong multiplier stays local');
  await submit(page, host, `${host} #transform-help-multiplier-left`, '5');
  await page.locator(leftInput).fill('0');
  await page.locator(leftInput).press('Enter');
  assert.match(await page.locator('.app-episode').innerText(), /Try a different number of parts/);
  await submit(page, host, leftInput, s.left.numerator.toString());
  await submit(page, host, `${host} #transform-num-input-right`, s.right.numerator.toString());
  assert.equal(await page.locator('.app-support-panel button.app-secondary-button:not(.app-replay-button):not(.app-restart-button)').isVisible(), false, 'global help stays hidden in generalized construct operation');
  await submit(page, host, `${host} #operate-sum-input`, s.total.numerator.toString());
  assert.equal(await page.locator('.app-support-panel button.app-secondary-button:not(.app-replay-button):not(.app-restart-button)').isVisible(), false, 'global help stays hidden in generalized construct resolve');
  await finish(page, host);
  journeys.push({ itemId: s.item.id, recipe: 'construct', target: '10', view: 'visual', support: 'high', help: 'opened, closed, requested multiplier; wrong multiplier and numerator recovered; Enter submitted a wrong numerator' });

  s = await enterTask(page, host, 'construct', 'plan35-construct-three-fifths-third-30', 'visual');
  const motionInput = `${host} #transform-num-input-left`;
  const motionSubmit = `${host} #transform-num-input-left + .control-submit-btn`;
  await page.evaluate(() => {
    const original = Element.prototype.animate;
    window.__plan35Animations = [];
    Element.prototype.animate = function (keyframes, timing) {
      const animation = original.call(this, keyframes, timing);
      if (this.classList.contains('fraction-bar-boundary')) window.__plan35Animations.push({ element: this, animation, keyframes, timing });
      return animation;
    };
  });
  await page.locator(motionInput).fill(s.left.numerator.toString());
  const beforeMotion = await page.locator(`${host} .fraction-bar-container[data-side="left"] .fraction-bar-track`).evaluate((track) => {
    const rect = (node) => { const r = node.getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height }; };
    const right = document.querySelector('.app-visual-view .fraction-bar-container[data-side="right"] .fraction-bar-track');
    return { changed: { whole: rect(track), fill: rect(track.querySelector('.fraction-bar-fill')) }, unchanged: { whole: rect(right), fill: rect(right.querySelector('.fraction-bar-fill')), boundaryCount: right.querySelectorAll('.fraction-bar-boundary').length }, scrollX, scrollY };
  });
  await page.locator(motionSubmit).click();
  const observedMotion = await page.evaluate(async () => {
    const records = window.__plan35Animations ?? [];
    const record = records[0];
    if (!record) return { animationCount: 0 };
    const track = document.querySelector('.app-visual-view .fraction-bar-container[data-side="left"] .fraction-bar-track');
    const rightTrack = document.querySelector('.app-visual-view .fraction-bar-container[data-side="right"] .fraction-bar-track');
    const layer = track?.querySelector('.fraction-bar-boundary-layer');
    const interiorHeight = layer?.getBoundingClientRect().height ?? 0;
    const rect = (node) => { const r = node.getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height }; };
    const unchangedSnapshot = () => ({ whole: rect(rightTrack), fill: rect(rightTrack.querySelector('.fraction-bar-fill')), boundaryCount: rightTrack.querySelectorAll('.fraction-bar-boundary').length });
    let partial = null;
    let highlight = null;
    for (let frame = 0; frame < 120 && (!partial || !highlight); frame += 1) {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const progress = record.animation.effect?.getComputedTiming().progress;
      const box = record.element.getBoundingClientRect();
      if (Number.isFinite(progress) && box.height > 1 && box.height < interiorHeight - 1 && !partial) {
        partial = { progress, boundaryHeight: box.height, interiorHeight, whole: rect(track), fill: rect(track.querySelector('.fraction-bar-fill')), untouchedOperand: unchangedSnapshot(), keyframes: record.animation.effect.getKeyframes(), timing: record.timing };
      }
      const paint = getComputedStyle(record.element);
      const channels = paint.backgroundColor.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
      if (Number.isFinite(progress) && progress >= 0.41 && progress <= 0.7 && box.height >= interiorHeight - 0.5 && paint.boxShadow !== 'none' && channels.length === 3 && Math.max(...channels) < 180 && !highlight) {
        highlight = { progress, boundaryHeight: box.height, interiorHeight, whole: rect(track), fill: rect(track.querySelector('.fraction-bar-fill')), untouchedOperand: unchangedSnapshot(), boxShadow: paint.boxShadow, backgroundColor: paint.backgroundColor };
      }
    }
    await Promise.all(records.map(({ animation }) => animation.finished.catch(() => undefined)));
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const paintAfterSettle = getComputedStyle(record.element);
    const settled = { boundaryHeight: record.element.getBoundingClientRect().height, interiorHeight, untouchedOperand: unchangedSnapshot(), boxShadow: paintAfterSettle.boxShadow, backgroundColor: paintAfterSettle.backgroundColor, runningAnimations: track.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length, whole: rect(track), fill: rect(track.querySelector('.fraction-bar-fill')) };
    return { animationCount: records.length, partial, highlight, settled, documentPosition: { scrollX, scrollY }, numerator: track.dataset.numerator, denominator: track.dataset.denominator };
  });
  const coordinateDelta = (a, b) => Math.max(...['x','y','width','height'].map((key) => Math.abs(a[key] - b[key])));
  assert.ok(observedMotion.animationCount > 0 && observedMotion.partial?.boundaryHeight > 1 && observedMotion.partial.boundaryHeight < observedMotion.partial.interiorHeight - 1, 'distinct target30 conversion samples a partial boundary reveal');
  assert.ok(observedMotion.highlight?.boundaryHeight >= observedMotion.highlight.interiorHeight - 0.5 && observedMotion.highlight.boxShadow !== 'none', 'same new boundary reaches full-height highlighted state');
  assert.ok(observedMotion.settled.boundaryHeight >= observedMotion.settled.interiorHeight - 0.5 && observedMotion.settled.boxShadow === 'none' && observedMotion.settled.runningAnimations === 0, 'same boundary settles full-height with normal paint and no running animation');
  assert.ok(coordinateDelta(beforeMotion.changed.whole, observedMotion.settled.whole) <= 0.5 && coordinateDelta(beforeMotion.changed.fill, observedMotion.settled.fill) <= 0.5, 'changed operand whole bar and fill document coordinates are conserved through settle');
  for (const sample of [observedMotion.partial, observedMotion.highlight, observedMotion.settled]) {
    assert.ok(coordinateDelta(beforeMotion.changed.whole, sample.whole) <= 0.5
      && coordinateDelta(beforeMotion.changed.fill, sample.fill) <= 0.5,
    'changed operand whole and fill document coordinates are conserved at every motion phase');
    assert.ok(coordinateDelta(beforeMotion.unchanged.whole, sample.untouchedOperand.whole) <= 0.5
      && coordinateDelta(beforeMotion.unchanged.fill, sample.untouchedOperand.fill) <= 0.5
      && beforeMotion.unchanged.boundaryCount === sample.untouchedOperand.boundaryCount,
    'untouched operand geometry and boundary set remain unchanged at every motion phase');
  }
  assert.equal(observedMotion.numerator, s.left.numerator.toString());
  assert.equal(observedMotion.denominator, '30');
  motionEvidence.push({ itemId: s.item.id, target: '30', side: 'left', before: beforeMotion, observed: observedMotion, changedAndUnchangedOperandsConserved: true });
  await submit(page, host, `${host} #transform-num-input-right`, s.right.numerator.toString());
  await submit(page, host, `${host} #operate-sum-input`, s.total.numerator.toString());
  await finish(page, host);
  journeys.push({ itemId: s.item.id, recipe: 'construct', target: '30', view: 'visual', support: 'high' });

  s = await enterTask(page, host, 'inspect', 'plan35-inspect-third-eighth-24', 'visual');
  const falseLeft = s.record.candidates.left;
  assert.equal(equalFractions(fraction(falseLeft), fraction(s.left)), false);
  await page.locator(`${host} .active-beat-controls .inspect-change-button`).click();
  await submit(page, host, `${host} #transform-num-input-left`, '0');
  assert.equal(await page.locator(`${host} .recovery-feedback`).isVisible(), true);
  await submit(page, host, `${host} #transform-num-input-left`, s.left.numerator.toString());
  await page.getByRole('button', { name: 'Keep new fraction 3 over 24', exact: true }).click();
  assert.equal(await page.locator('.app-support-panel button.app-secondary-button:not(.app-replay-button):not(.app-restart-button)').isVisible(), false, 'global help is hidden during generalized inspect operation');
  await submit(page, host, `${host} #operate-sum-input`, s.total.numerator.toString());
  assert.equal(await page.locator('.app-support-panel button.app-secondary-button:not(.app-replay-button):not(.app-restart-button)').isVisible(), false, 'global help is hidden during generalized inspect resolve');
  await finish(page, host);
  journeys.push({ itemId: s.item.id, recipe: 'inspect', target: '24', view: 'visual', support: 'high', valid: 'right candidate kept', false: 'left candidate repaired after incorrect answer' });

  s = await enterTask(page, host, 'inspect', 'plan35-inspect-fifth-third-30', 'visual');
  assert.match(await page.locator(`${host} .active-beat-prompt`).innerText(), /new fraction/i);
  await measure(page, 'inspect target30 before response, high support, visual, 360x740');
  const inspectScrollBefore = await page.evaluate(() => ({ y: scrollY, height: document.documentElement.scrollHeight }));
  await page.locator(`${host} .active-beat-controls`).scrollIntoViewIfNeeded();
  const inspectScrollAfter = await page.evaluate(() => ({ y: scrollY, height: document.documentElement.scrollHeight }));
  await page.evaluate(() => window.scrollBy(0, 1));
  await measure(page, 'inspect target30 after scrolling response controls into view, 360x740', { requireFull: true });
  journeys.push({ itemId: s.item.id, action: 'inspect response scroll', before: inspectScrollBefore, after: inspectScrollAfter, evidence: 'question and all active response controls visible after ordinary vertical scroll' });
  await page.screenshot({ path: fileURLToPath(new URL('../../reports/development/plan-35-reusable-task-recipes-and-authored-batch/plan35-inspect-30-360x740.png', import.meta.url)) });
  await page.setViewportSize({ width: 360, height: 752 });
  await measure(page, 'inspect target30 before response, 360x752 CSS viewport');
  await page.setViewportSize({ width: 1366, height: 768 });
  await measure(page, 'inspect target30 before response, 1366x768 CSS viewport');
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1093, height: 614, deviceScaleFactor: 1.25, mobile: false });
  await page.locator(`${host} .active-beat-controls`).scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 1));
  const zoomScroll = await page.evaluate(() => ({ y: scrollY, viewportHeight: innerHeight, documentHeight: document.documentElement.scrollHeight }));
  await measure(page, 'inspect target30 after scrolling response controls into view, 125% zoom-equivalent viewport/DPR emulation: 1093x614 CSS at DPR1.25', { requireFull: true });
  await page.screenshot({ path: fileURLToPath(new URL('../../reports/development/plan-35-reusable-task-recipes-and-authored-batch/plan35-inspect-30-zoom-emulation.png', import.meta.url)) });
  journeys.push({ itemId: s.item.id, action: 'zoom-equivalent response scroll', after: zoomScroll, evidence: 'question and full response controls visible in final capture after ordinary vertical scroll' });
  await cdp.send('Emulation.clearDeviceMetricsOverride');
  await page.setViewportSize({ width: 360, height: 740 });
  await page.getByRole('button', { name: 'Keep new fraction 6 over 30', exact: true }).click();
  await page.locator(`${host} .active-beat-controls .inspect-change-button`).click();
  await submit(page, host, `${host} #transform-num-input-right`, '0');
  await submit(page, host, `${host} #transform-num-input-right`, s.right.numerator.toString());
  assert.equal(await page.locator('.app-support-panel button.app-secondary-button:not(.app-replay-button):not(.app-restart-button)').isVisible(), false, 'global help is hidden during second generalized inspect operation');
  await submit(page, host, `${host} #operate-sum-input`, s.total.numerator.toString());
  assert.equal(await page.locator('.app-support-panel button.app-secondary-button:not(.app-replay-button):not(.app-restart-button)').isVisible(), false, 'global help is hidden during second generalized inspect resolve');
  await finish(page, host);
  journeys.push({ itemId: s.item.id, recipe: 'inspect', target: '30', view: 'visual', support: 'high', valid: 'left candidate kept', false: 'right candidate repaired after incorrect answer' });
  await page.locator('.app-restart-button').click();
  assert.equal(await page.locator(`${host} .active-beat-controls .control-btn`).isVisible(), true, 'restart returns to the selected task encounter');
  journeys.push({ itemId: s.item.id, action: 'restart', evidence: 'mounted restart returns to the selected task encounter' });

  // Begin a separate subset to preserve actual, registered medium configuration and linear access.
  await context.close();
  const identifyRun = await startPage({ viewport: { width: 360, height: 752 }, touch: true, group: 'identify' });
  context = identifyRun.context;
  page = identifyRun.page;
  await setSupport(page, 'medium');
  await begin(page);
  assert.equal(await page.locator('.app-support-panel button.app-secondary-button:not(.app-replay-button):not(.app-restart-button)').isVisible(), true, 'generalized identify retains its historical pre-decision global help placement');
  await page.locator('.app-view-toggle').click();
  host = '.app-linear-view';
  for (const id of [
    'plan35-identify-half-three-tenths-10',
    'plan35-identify-three-tenths-half-10',
    'plan35-identify-third-five-twelfths-12',
    'plan35-identify-five-twelfths-third-12',
  ]) {
    const item = type.items.find((candidate) => candidate.id === id);
    s = await enterTask(page, host, 'identify', id, 'linear');
    assert.equal(await page.locator('.app-replay-button').isHidden(), true, 'Replay remains unavailable before conversion');
    const required = s.record.requiredSide;
    const source = required === 'left' ? s.fixture.left : s.fixture.right;
    const correct = convertToDenominator(fraction(source), BigInt(item.targetDenominator));
    await submit(page, host, `${host} #linear-transform-num-input-${required}`, '0');
    assert.equal(await page.locator(`${host} .recovery-feedback`).isVisible(), true);
    const conversionInput = `${host} #linear-transform-num-input-${required}`;
    await page.locator(conversionInput).fill('0');
    await page.locator(conversionInput).press('Enter');
    assert.equal(await page.locator(conversionInput).evaluate((element) => document.activeElement === element), true, 'keyboard response keeps focus on the active input');
    await submit(page, host, conversionInput, correct.numerator.toString(), id === 'plan35-identify-half-three-tenths-10' ? 'Enter' : null);
    assert.equal(await page.locator('.app-replay-button').isVisible(), true, 'Replay appears only after one conversion');
    let replayDraftEvidence = null;
    if (id === 'plan35-identify-half-three-tenths-10') {
      const operationInput = `${host} #linear-operate-sum-input`;
      await page.locator(operationInput).fill('7');
      await page.locator(operationInput).evaluate((element) => { window.__plan35ReplayDraftNode = element; });
    }
    await page.locator('.app-replay-button').click();
    await page.locator('.app-replay-button').click();
    if (id === 'plan35-identify-half-three-tenths-10') {
      replayDraftEvidence = await page.locator(`${host} #linear-operate-sum-input`).evaluate((element) => ({ sameNode: element === window.__plan35ReplayDraftNode, value: element.value }));
      assert.deepEqual(replayDraftEvidence, { sameNode: true, value: '7' }, 'identify Replay preserves the same mounted operation input node and its draft');
    }
    const operation = await addAtCommonDenominator(fraction(s.fixture.left), fraction(s.fixture.right), BigInt(item.targetDenominator));
    await submit(page, host, `${host} #linear-operate-sum-input`, operation.numerator.toString());
    await finish(page, host, { hasNext: id !== 'plan35-identify-five-twelfths-third-12' });
    journeys.push({ itemId: id, recipe: 'identify', target: item.targetDenominator, requiredSide: required, view: 'linear', support: 'medium', touchChoice: 'tap', replay: 'after conversion only', ...(replayDraftEvidence ? { replayDraftEvidence } : {}) });
  }

  await context.close();
  const reducedRun = await startPage({ viewport: { width: 360, height: 740 }, reducedMotion: true, group: 'construct30' });
  context = reducedRun.context;
  page = reducedRun.page;
  await setSupport(page, 'high');
  await begin(page);
  host = '.app-visual-view';
  s = await enterTask(page, host, 'construct', 'plan35-construct-three-fifths-third-30', 'visual');
  const reducedInput = `${host} #transform-num-input-left`;
  await page.evaluate(() => { window.__plan35BoundaryAnimationCalls = 0; const original = Element.prototype.animate; Element.prototype.animate = function (...args) { if (this.classList.contains('fraction-bar-boundary')) window.__plan35BoundaryAnimationCalls += 1; return original.apply(this, args); }; });
  await page.locator(reducedInput).fill(s.left.numerator.toString());
  const reducedDraft = await page.locator(reducedInput).inputValue();
  assert.equal(reducedDraft, motionEvidence[0].observed.numerator, 'reduced-motion run starts from the same target30 left-conversion draft');
  await page.locator(`${reducedInput} + .control-submit-btn`).click();
  const reducedEndpoint = await page.locator(`${host} .fraction-bar-container[data-side="left"] .fraction-bar-track`).evaluate((track) => ({ numerator: track.dataset.numerator, denominator: track.dataset.denominator, activeAnimations: track.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length }));
  const reducedCalls = await page.evaluate(() => window.__plan35BoundaryAnimationCalls);
  assert.equal(reducedCalls, 0, 'reduced-motion conversion does not invoke boundary WAAPI');
  assert.equal(reducedEndpoint.denominator, '30', 'reduced-motion conversion reaches the same target endpoint immediately');
  assert.equal(reducedEndpoint.numerator, reducedDraft, 'reduced-motion conversion retains the submitted exact numerator');
  assert.equal(reducedEndpoint.activeAnimations, 0, 'reduced-motion endpoint has no active boundary animation');
  motionEvidence.push({ itemId: s.item.id, target: '30', side: 'left', reducedMotion: true, sharedPreSubmitDraft: reducedDraft, endpoint: reducedEndpoint, boundaryAnimationCalls: reducedCalls });
  journeys.push({ itemId: s.item.id, action: 'reduced-motion matched conversion', view: 'visual', support: 'high', evidence: 'same target-30 numerator draft reaches identical immediate endpoint with no boundary WAAPI' });

  await context.close();
  const keyboardRun = await startPage({ viewport: { width: 360, height: 752 }, group: 'inspect' });
  context = keyboardRun.context;
  page = keyboardRun.page;
  const keyboardTabs = [];
  keyboardTabs.push({ control: 'support settings', tabs: await enterByKeyboard(page, '.app-gear-button', 'support settings') });
  keyboardTabs.push({ control: 'medium support', tabs: await enterByKeyboard(page, '[data-support-id="medium-support"]', 'medium support') });
  keyboardTabs.push({ control: 'start practice', tabs: await enterByKeyboard(page, '.app-practice-button', 'start practice') });
  keyboardTabs.push({ control: 'linear view', tabs: await enterByKeyboard(page, '.app-view-toggle', 'linear view') });
  host = '.app-linear-view';
  const keyboardItem = type.items.find((item) => item.id === 'plan35-inspect-third-eighth-24');
  const keyboardResult = addAtCommonDenominator(fraction(resolveCuratedFixture(keyboardItem.fixtureId, keyboardItem.authoringRevision).left), fraction(resolveCuratedFixture(keyboardItem.fixtureId, keyboardItem.authoringRevision).right), BigInt(keyboardItem.targetDenominator));
  keyboardTabs.push({ control: 'inspect encounter', tabs: await enterByKeyboard(page, `${host} .active-beat-controls .control-btn`, 'inspect encounter') });
  keyboardTabs.push({ control: 'change top number', tabs: await enterByKeyboard(page, `${host} .inspect-change-button`, 'change top number') });
  const correctLeft = convertToDenominator(fraction(resolveCuratedFixture(keyboardItem.fixtureId, keyboardItem.authoringRevision).left), BigInt(keyboardItem.targetDenominator));
  keyboardTabs.push({ control: 'repair top number', tabs: await typeAndEnterByKeyboard(page, `${host} #linear-transform-num-input-left`, correctLeft.numerator.toString(), 'equivalent numerator') });
  keyboardTabs.push({ control: 'keep equivalent candidate', tabs: await enterByKeyboard(page, `${host} button[aria-label="Keep new fraction 3 over 24"]`, 'valid equivalent candidate') });
  keyboardTabs.push({ control: 'enter exact sum and submit', tabs: await typeAndEnterByKeyboard(page, `${host} #linear-operate-sum-input`, keyboardResult.numerator.toString(), 'sum response') });
  keyboardTabs.push({ control: 'finish inspect task', tabs: await enterByKeyboard(page, `${host} .active-beat-controls .control-btn`, 'finish inspect task') });
  assert.equal(await page.locator('.app-next-button').isVisible(), true, 'keyboard-completed new task enables gated Next');
  assert.equal(await page.locator('.app-next-button').evaluate((button) => document.activeElement === button), false, 'keyboard task did not use a programmatic focus jump to Next');
  journeys.push({ itemId: keyboardItem.id, recipe: 'inspect', target: keyboardItem.targetDenominator, view: 'linear', support: 'medium', inputMethod: 'Tab traversal + Enter activation + keyboard.type numerator; no pointer clicks or locator.focus()', keyboardTabs, outcome: 'task completed; gated Next appeared' });

  // A clean rendered copy scan is recorded separately from a deliberate DOM leak seed.
  const seedPage = await context.newPage();
  await seedPage.goto(`http://127.0.0.1:${server.httpServer.address().port}/FractionFlow/tests/fixtures/plan35-sample-entry.html?group=inspect`);
  await seedPage.waitForSelector('.fractionflow-app');
  await begin(seedPage);
  await clickVisible(seedPage, '.app-visual-view .active-beat-controls .control-btn');
  const leakItem = type.items.find((item) => item.id === 'plan35-inspect-third-eighth-24');
  const leakRecord = records.get(leakItem.id);
  const leakExpected = convertToDenominator(fraction(resolveCuratedFixture(leakItem.fixtureId, leakItem.authoringRevision).left), 24n);
  const leakedAnswer = `${leakExpected.numerator}/24`;
  await seedPage.evaluate((text) => {
    const marker = document.createElement('span'); marker.className = 'seeded-answer-leak'; marker.textContent = text;
    document.querySelector('.app-episode').append(marker);
  }, leakedAnswer);
  let seededFailure = null;
  try {
    await assertAnswerWithheldFromEpisode(seedPage, { numerator: String(leakExpected.numerator), denominator: '24' });
  } catch (error) {
    seededFailure = error.message;
  }
  assert.ok(seededFailure, 'the same answer-withholding assertion fails on the injected leak seed');
  seeds.push({ kind: 'seeded answer leak', itemId: leakItem.id, expectedLeak: leakedAnswer, intendedAssertion: 'correct candidate/equivalent is absent from visible and accessible episode content before response', detectedAtIntendedAssertion: true, failure: seededFailure });
  await seedPage.locator('.seeded-answer-leak').evaluate((element) => element.remove());
  const cleanReceipt = await assertAnswerWithheldFromEpisode(seedPage, { numerator: String(leakExpected.numerator), denominator: '24' });
  seeds.push({ kind: 'clean copy receipt', itemId: leakItem.id, ...cleanReceipt });
  await seedPage.close();

  assert.deepEqual(pageErrors, []);
  await writeFile(output, JSON.stringify({
    entry: 'unshipped Vite fixture filtered from live set@7 associations; not the production default root',
    browser: 'native Chrome channel via Playwright; same-process Vite server with HMR disabled',
    journeys,
    measurements,
    seeds,
    motionEvidence,
    pageErrors,
    failedResponses,
    failedRequests,
    consoleErrors,
    limits: [
      'Focused sample covers eight recipe tasks, not the full live set; separate production-default route rows traverse all 21.',
      '1366x768 is a Chromebook-sized CSS viewport emulation, not physical Chromebook hardware.',
      'The 1093x614 CSS viewport at DPR1.25 is a 125%-zoom-equivalent viewport/DPR emulation, not browser zoom or physical hardware; no assistive-technology claim.',
      'Touch-context uses Playwright touch tap on registered nested choices; no drag gesture is involved.',
    ],
  }, null, 2) + '\n');
  console.log(JSON.stringify({ journeys: journeys.length, measurements: measurements.length, seeds: seeds.length, pageErrors }));
  await context.close();
} finally {
  if (browser) await browser.close();
  await server.close();
}
