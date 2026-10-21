import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const output = path.join(here, 'results');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const records = await (async () => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5180/FractionFlow/');
  const result = await page.evaluate(async () => {
    const data = await import('/FractionFlow/src/content/data/plan37-bar-to-line-bridge-records.js');
    return data.PLAN37_BAR_TO_LINE_BRIDGE_RECORDS;
  });
  await context.close();
  return result;
})();

function targetId(record, supportMode) {
  if (supportMode === 'partitioned') return `partition-${record.sourceForm.numerator * Number(record.partitionDenominator) / Number(record.sourceForm.denominator)}-of-${record.partitionDenominator}`;
  return record.sparseCandidates.find(({ form }) => BigInt(form.numerator) * BigInt(record.sourceForm.denominator)
    === BigInt(record.sourceForm.numerator) * BigInt(form.denominator)).id;
}

async function clickCorrect(page, record, supportMode) {
  const host = '.app-visual-view';
  const correctId = targetId(record, supportMode);
  await page.locator(`${host} .plan39-continue`).click();
  await page.locator(`${host} .plan39-candidate-option[data-candidate-id="${correctId}"]`).click();
  await page.locator(`${host} .plan39-check-position`).click();
  await page.locator(`${host} .plan39-finish`).click();
}

async function enterItem(page, itemIndex, supportMode) {
  await page.goto('http://127.0.0.1:5180/FractionFlow/');
  if (supportMode === 'sparse-benchmarks') {
    await page.locator('.app-gear-button').click();
    await page.locator('[data-support-id="medium-support"]').click();
  }
  await page.locator('[data-practice-type="place-fractions-on-number-line"]').click();
  for (let index = 0; index < itemIndex; index += 1) {
    await clickCorrect(page, records[index], supportMode);
    await page.locator('.app-next-button').click();
  }
  await page.locator('.app-visual-view .plan39-continue').click();
}

async function snapshotGeometry(page, label, supportMode) {
  return page.evaluate(({ label, supportMode }) => {
    const episode = document.querySelector('.app-episode');
    const host = document.querySelector('.app-visual-view[hidden]')
      ? document.querySelector('.app-linear-view') : document.querySelector('.app-visual-view');
    const prompt = host.querySelector('.plan39-number-line > .active-beat-prompt');
    const promptRect = prompt.getBoundingClientRect();
    const controlRect = host.querySelector('.active-beat-controls').getBoundingClientRect();
    const promptInitial = { x: promptRect.x, y: promptRect.y, width: promptRect.width, height: promptRect.height,
      withinViewport: promptRect.top >= 0 && promptRect.bottom <= innerHeight };
    const controlsInitial = { x: controlRect.x, y: controlRect.y, width: controlRect.width, height: controlRect.height,
      withinViewport: controlRect.top >= 0 && controlRect.bottom <= innerHeight };
    const labels = [...host.querySelectorAll('.plan39-candidate')];
    const candidateGrid = host.querySelector('.plan39-candidates');
    const rects = labels.map((element) => {
      const initialRect = element.getBoundingClientRect();
      const documentX = initialRect.x + scrollX;
      const documentY = initialRect.y + scrollY;
      element.scrollIntoView({ block: 'center', inline: 'nearest' });
      const r = element.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const hit = document.elementFromPoint(cx, cy);
      return { text: element.textContent.trim(), x: documentX, y: documentY, width: r.width, height: r.height,
        centerHit: Boolean(hit && element.contains(hit)), centerHitTag: hit?.tagName ?? null };
    });
    const overlaps = [];
    for (let i = 0; i < rects.length; i += 1) for (let j = i + 1; j < rects.length; j += 1) {
      const a = rects[i]; const b = rects[j];
      if (a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height) overlaps.push([i, j]);
    }
    const bar = host.querySelector('.plan39-source-figure svg');
    const track = host.querySelector('.plan39-track-figure svg');
    const endpoints = bar && track ? (() => {
      const barRect = bar.getBoundingClientRect(); const trackRect = track.getBoundingClientRect();
      const x1 = Number(track.querySelector('.plan39-track').getAttribute('x1'));
      const x2 = Number(track.querySelector('.plan39-track').getAttribute('x2'));
      const getX = (svg, x, y) => {
        const point = svg.createSVGPoint(); point.x = x; point.y = y;
        return point.matrixTransform(svg.getScreenCTM()).x;
      };
      return {
        barStart: getX(bar, 42, 46), barEnd: getX(bar, 958, 46),
        lineStart: getX(track, x1, 79), lineEnd: getX(track, x2, 79),
        barBounds: { x: barRect.x, width: barRect.width }, trackBounds: { x: trackRect.x, width: trackRect.width },
      };
    })() : null;
    return {
      label, supportMode, viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
      document: { scrollY, scrollHeight: document.documentElement.scrollHeight, clientHeight: document.documentElement.clientHeight },
      prompt: promptInitial,
      controls: controlsInitial,
      candidateTargets: rects, pairwiseOverlaps: overlaps,
      candidateGrid: candidateGrid ? { display: getComputedStyle(candidateGrid).display,
        columns: getComputedStyle(candidateGrid).gridTemplateColumns } : null,
      allTargetsAtLeast44: rects.every((r) => r.width >= 44 && r.height >= 44),
      allCentersHitLabels: rects.every((r) => r.centerHit),
      endpoints, episodeWidth: episode.getBoundingClientRect().width,
    };
  }, { label, supportMode });
}

const results = [];
const scenarios = [
  { itemIndex: 5, supportMode: 'partitioned', label: 'high-b8' },
  { itemIndex: 3, supportMode: 'partitioned', label: 'high-odd-thirds' },
  { itemIndex: 6, supportMode: 'sparse-benchmarks', label: 'medium-item07' },
  { itemIndex: 7, supportMode: 'sparse-benchmarks', label: 'medium-item08' },
];
try {
  for (const dimensions of [
    { width: 360, height: 740, deviceScaleFactor: 1, hasTouch: true, reducedMotion: 'reduce' },
    { width: 1093, height: 614, deviceScaleFactor: 1.25, hasTouch: false, reducedMotion: 'reduce' },
  ]) {
    for (const scenario of scenarios) {
      const { width, height, ...contextOptions } = dimensions;
      const context = await browser.newContext({ ...contextOptions, viewport: { width, height } });
      const page = await context.newPage();
      await page.goto('http://127.0.0.1:5180/FractionFlow/');
      await enterItem(page, scenario.itemIndex, scenario.supportMode);
      const label = `${scenario.label}-${dimensions.width}x${dimensions.height}-dpr${dimensions.deviceScaleFactor}`;
      const locateVisual = await snapshotGeometry(page, `${label}-visual`, scenario.supportMode);
      if (scenario.label === 'high-b8') await page.screenshot({
        path: path.join(output, `${label}-locate.png`), fullPage: true, animations: 'disabled',
      });
      if (dimensions.hasTouch) await page.locator('.app-visual-view .plan39-candidate-option').first().tap();
      const visualTapPreview = await page.locator('.app-visual-view .plan39-candidate-option[aria-pressed="true"]').count();
      const firstRadio = page.locator('.app-view-toggle');
      await firstRadio.focus();
      await page.locator('.app-view-toggle').click();
      const linearChoice = page.locator('.app-linear-view input[type="radio"]').first();
      await linearChoice.focus();
      await page.keyboard.press('ArrowRight');
      const keyboardSelected = await page.locator('.app-linear-view input[type="radio"]:checked').count();
      const checkStillRequired = await page.locator('.app-visual-view .plan39-check-position').isVisible()
        && await page.locator('.app-visual-view .plan39-finish').count() === 0;
      const locateLinear = await snapshotGeometry(page, `${label}-linear`, scenario.supportMode);
      const id = targetId(records[scenario.itemIndex], scenario.supportMode);
      const radio = page.locator(`.app-linear-view input[data-candidate-id="${id}"]`);
      if (dimensions.hasTouch) await radio.locator('xpath=..').tap();
      else await radio.check();
      await page.locator('.app-linear-view .plan39-check-position').click();
      await page.locator('.app-linear-view .plan39-finish').click();
      const finishedNavigation = await page.evaluate(() => ({
        spentFinishCount: document.querySelectorAll('.plan39-finish').length,
        nextVisible: !document.querySelector('.app-next-button').hasAttribute('hidden'),
        noticeVisible: !document.querySelector('.app-navigation-notice').hasAttribute('hidden'),
        noticeText: document.querySelector('.app-navigation-notice').textContent,
        heading: document.querySelector('.app-visual-view .active-beat-prompt').textContent,
      }));
      await page.locator('.app-view-toggle').click();
      const resolveVisual = await snapshotGeometry(page, `${label}-resolve-visual`, scenario.supportMode);
      const acceptedAlignment = await page.evaluate(() => {
        const host = document.querySelector('.app-visual-view');
        const bar = host.querySelector('.plan39-source-figure svg');
        const track = host.querySelector('.plan39-track-figure svg');
        const accepted = host.querySelector('.plan39-accepted-connector');
        const point = track.querySelector('.plan39-accepted-point');
        if (!accepted || !point) return { missingConnector: !accepted, missingPoint: !point,
          overlays: host.querySelectorAll('.plan39-connector-overlay').length };
        const n = document.querySelector('.app-visual-view .plan39-source-fraction span:first-child').textContent;
        const d = document.querySelector('.app-visual-view .plan39-source-fraction span:last-child').textContent;
        const screenX = (svg, x, y) => { const p=svg.createSVGPoint();p.x=x;p.y=y;return p.matrixTransform(svg.getScreenCTM()).x; };
        const sourceP = bar.createSVGPoint(); sourceP.x=42+(958-42)*Number(n)/Number(d); sourceP.y=94;
        const source=sourceP.matrixTransform(bar.getScreenCTM());
        const overlay=accepted.ownerSVGElement;
        const lineP1=overlay.createSVGPoint();lineP1.x=Number(accepted.getAttribute('x1'));lineP1.y=Number(accepted.getAttribute('y1'));
        const lineP2=overlay.createSVGPoint();lineP2.x=Number(accepted.getAttribute('x2'));lineP2.y=Number(accepted.getAttribute('y2'));
        const actualStart=lineP1.matrixTransform(overlay.getScreenCTM());
        const actualEnd=lineP2.matrixTransform(overlay.getScreenCTM());
        const pointP=track.createSVGPoint();pointP.x=Number(point.getAttribute('cx'));pointP.y=Number(point.getAttribute('cy'));
        const acceptedPoint=pointP.matrixTransform(track.getScreenCTM());
        const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
        return { connectorToSourceShadeEndDelta: distance(source,actualStart), connectorToPointDelta: distance(actualEnd,acceptedPoint), connectorScreenLength: distance(actualStart,actualEnd) };
      });
      const screenshot = path.join(output, `${label}-resolve.png`);
      await page.screenshot({ path: screenshot, fullPage: true, animations: 'disabled' });
      results.push({ dimensions, scenario, locateVisual, locateLinear, resolveVisual, keyboardSelected,
        visualTapPreview, checkStillRequired, finishedNavigation, acceptedAlignment, screenshot: path.relative(here, screenshot) });
      await context.close();
    }
  }
  await writeFile(path.join(output, 'results.json'), JSON.stringify({ chrome: browser.version(), generatedAt: new Date().toISOString(), results }, null, 2));
} finally {
  await browser.close();
}
