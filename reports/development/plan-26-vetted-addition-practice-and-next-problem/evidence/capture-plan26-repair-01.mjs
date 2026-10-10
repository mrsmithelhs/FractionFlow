import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mkdirSync, writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const { createStaticServer } = require('../../../../scripts/dev/run-route-matrix.js');
const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const server = createStaticServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const records = [];
let selectedJourneys = [];

const journeys = [
  { id: 'bundle-1-visual-high-standard-12-keyboard', condition: 'phase2-bundle-1', view: 'visual', support: 'high-support', motion: 'standard', denominator: '12', touch: false, premise: null, expected: 'match-b', keyboardNext: true },
  { id: 'bundle-2-linear-medium-reduced-6-touch', condition: 'phase2-bundle-2', view: 'linear', support: 'medium-support', motion: 'reduced', denominator: '6', touch: true, premise: null, expected: 'match-b', keyboardNext: false },
  { id: 'bundle-3-visual-medium-standard-6', condition: 'phase2-bundle-3', view: 'visual', support: 'medium-support', motion: 'standard', denominator: '6', touch: false, premise: null, expected: 'match-b', keyboardNext: false },
  { id: 'bundle-4-linear-high-reduced-6-no', condition: 'phase2-bundle-4', view: 'linear', support: 'high-support', motion: 'reduced', denominator: '6', touch: false, premise: 'No', expected: null, keyboardNext: false },
  { id: 'bundle-4-visual-medium-standard-12-yes', condition: 'phase2-bundle-4', view: 'visual', support: 'medium-support', motion: 'standard', denominator: '12', touch: false, premise: 'Yes', expected: null, keyboardNext: false },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function click(page, selector, { touch = false } = {}) {
  const locator = page.locator(selector).first();
  await locator.waitFor({ state: 'visible' });
  if (!touch) return locator.click();
  const box = await locator.boundingBox();
  assert(box && box.width > 0 && box.height > 0, `Cannot touch ${selector}: missing bounds`);
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
}

async function measure(page, journey, viewport, stage, screenshot) {
  const view = journey.view || 'visual';
  const selectors = {
    question: `.app-${view}-view .active-beat-prompt`,
    controls: `.app-${view}-view .active-beat-controls`,
    fractionTrack: view === 'visual' ? '.app-visual-view .fraction-bar-track' : '.app-linear-view .linear-context-expression',
  };
  const data = await page.evaluate((viewSelectors) => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, top: box.top, bottom: box.bottom, width: box.width, height: box.height,
        visibleTop: Math.max(0, box.top), visibleBottom: Math.min(innerHeight, box.bottom) };
    };
    return {
      viewport: { width: innerWidth, height: innerHeight, devicePixelRatio },
      document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight,
        scrollY, verticalScrollRange: document.documentElement.scrollHeight - innerHeight },
      question: rect(viewSelectors.question),
      controls: rect(viewSelectors.controls),
      viewToggle: rect('.app-view-toggle'),
      navNext: rect('.app-next-button:not([hidden])'),
      navNotice: rect('.app-navigation-notice:not([hidden])'),
      fractionTrack: rect(viewSelectors.fractionTrack),
      activeElement: document.activeElement?.className || document.activeElement?.tagName || null,
      visibleHeadings: [...document.querySelectorAll('h1,h2,h3')].filter((el) => {
        const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0;
      }).map((el) => el.textContent.trim()),
      bodyText: document.body.innerText,
    };
  }, selectors);
  assert(data.document.width <= data.viewport.width, `${journey.id} ${viewport.label} horizontal overflow`);
  records.push({ journey: journey.id, condition: journey.condition, view: journey.view, support: journey.support,
    motion: journey.motion, denominator: journey.denominator, touchContext: journey.touch,
    viewport: viewport.label, stage, screenshot: path.basename(screenshot), ...data });
}

async function completeEpisode(page, journey, view, denominator, { first = false, captureReflection = null } = {}) {
  const scope = `.app-${view}-view`;
  await click(page, `${scope} .control-btn`);
  await click(page, `${scope} .control-choice-btn >> nth=1`);
  if (journey.support === 'high-support') {
    await click(page, `${scope} .control-choice-btn >> nth=${first || denominator === '6' ? 0 : 1}`);
  } else {
    const denominatorField = page.locator(`${scope} input.control-numeric-input`).first();
    await denominatorField.fill(denominator);
    await click(page, `${scope} .control-submit-btn`);
  }
  const values = first ? ['8', '3', '11'] : (denominator === '12' ? ['6', '4', '10'] : ['3', '2', '5']);
  for (const value of values) {
    await page.locator(`${scope} input.control-numeric-input`).fill(value);
    await click(page, `${scope} .control-submit-btn`);
  }
  await click(page, `${scope} .control-btn`);
  if (captureReflection) {
    const reflectionImage = path.join(evidenceDir, `${captureReflection.journey}-${captureReflection.viewport.label}-reflection.png`);
    await page.screenshot({ path: reflectionImage, fullPage: true });
    await measure(page, journey, captureReflection.viewport, 'second-item-reflection-before-answer', reflectionImage);
    const originalScrollY = await page.evaluate(() => window.scrollY);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const scrolledImage = path.join(evidenceDir, `${captureReflection.journey}-${captureReflection.viewport.label}-reflection-scrolled-controls.png`);
    await page.screenshot({ path: scrolledImage, fullPage: true });
    await measure(page, journey, captureReflection.viewport, 'second-item-reflection-controls-scrolled', scrolledImage);
    await page.evaluate((y) => window.scrollTo(0, y), originalScrollY);
  }
  if (journey.condition === 'phase2-bundle-4') {
    const premiseAnswer = first ? 'No' : journey.premise;
    const button = page.getByRole('button', { name: new RegExp(`^${premiseAnswer}\\b`, 'i') });
    await button.waitFor({ state: 'visible' });
    await button.click();
  } else {
    await click(page, `${scope} .control-choice-btn >> nth=${first ? 0 : 1}`);
  }
  try {
    await page.locator('.app-next-button:not([hidden]), .app-navigation-notice:not([hidden])').waitFor({ state: 'visible' });
  } catch (error) {
    console.error(`Unresolved ${journey.condition} denominator ${denominator} premise ${journey.premise}:`, await page.locator(scope).innerText());
    throw error;
  }
}

async function exerciseRetry(page, journey, viewport, view) {
  const scope = `.app-${view}-view`;
  await click(page, `${scope} .control-btn`);
  await click(page, `${scope} .control-choice-btn >> nth=0`);
  await click(page, `${scope} .control-choice-btn >> nth=1`);
  await click(page, `${scope} .control-choice-btn >> nth=0`);
  await page.locator(`${scope} input.control-numeric-input`).fill('7');
  await click(page, `${scope} .control-submit-btn`);
  await page.locator(`${scope} input.control-numeric-input`).fill('8');
  await click(page, `${scope} .control-submit-btn`);
  await click(page, `${scope} .active-beat-controls .app-secondary-button`);
  const helperSelector = view === 'visual'
    ? '#transform-help-multiplier-right'
    : '#linear-transform-help-multiplier-right';
  const helper = page.locator(`${scope} ${helperSelector}`);
  await helper.fill('3');
  const replay = page.getByRole('button', { name: 'Replay the last change' });
  await replay.click();
  assert(await replay.getAttribute('aria-pressed') === 'true', `${journey.id}: Replay opened before Retry`);
  await replay.click();
  const dirtyScreen = path.join(evidenceDir, `${journey.id}-${viewport.label}-before-retry.png`);
  await page.screenshot({ path: dirtyScreen, fullPage: true });
  await measure(page, journey, viewport, 'wrong-answer-accepted-work-help-draft-and-replay-before-retry', dirtyScreen);
  await click(page, '.app-restart-button');
  assert(await page.locator('.app-episode').evaluate((el) => el === document.activeElement), `${journey.id}: Retry focus`);
  assert(await helper.count() === 0, `${journey.id}: Retry removes task-help draft`);
  assert(await replay.getAttribute('aria-pressed') === 'false', `${journey.id}: Retry clears Replay state`);
  assert(await page.locator('.recovery-feedback').count() === 0, `${journey.id}: Retry clears recovery UI`);
  await page.keyboard.press('Tab');
  assert(await page.locator('.app-view-toggle').evaluate((el) => el === document.activeElement), `${journey.id}: first Tab after Retry reaches view control`);
  const activeAfterRetryTab = await page.evaluate(() => ({ tag: document.activeElement.tagName, className: document.activeElement.className }));
  records.push({ journey: journey.id, viewport: viewport.label, stage: 'first-tab-after-retry', activeElement: activeAfterRetryTab });
}

async function runJourney(journey, viewport) {
  console.log(`Running ${journey.id} at ${viewport.label}`);
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: journey.motion === 'reduced' ? 'reduce' : 'no-preference',
    hasTouch: journey.touch,
    isMobile: journey.touch,
  });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}/FractionFlow/`);
    await click(page, '.app-gear-button');
    await click(page, `[data-condition-id="${journey.condition}"]`);
    if (journey.support !== 'high-support') {
      await click(page, '.app-gear-button');
      await click(page, `[data-support-id="${journey.support}"]`);
    }
    await click(page, '.app-practice-button');
    if (journey.view === 'linear') await click(page, '.app-view-toggle');
    const view = journey.view;
    if (journey.keyboardNext) await exerciseRetry(page, journey, viewport, view);
    await assertScreens(page, journey, viewport, view);
    await completeEpisode(page, { ...journey, premise: null }, view, '12', { first: true });
    const nextScreenshot = path.join(evidenceDir, `${journey.id}-${viewport.label}-next-ready.png`);
    await page.screenshot({ path: nextScreenshot, fullPage: true });
    await measure(page, journey, viewport, 'first-item-complete-next-ready', nextScreenshot);
    if (journey.keyboardNext) {
      await page.locator('.app-view-toggle').focus();
      await page.keyboard.press('Tab');
      assert(await page.locator('.app-next-button').evaluate((el) => el === document.activeElement), `${journey.id}: Tab from view control reaches Next`);
      await page.keyboard.press('Enter');
    } else if (journey.touch) {
      await click(page, '.app-next-button', { touch: true });
    } else {
      await click(page, '.app-next-button');
    }
    assert(await page.locator('.app-episode').evaluate((el) => el === document.activeElement), `${journey.id}: Next focus`);
    await page.keyboard.press('Tab');
    assert(await page.locator('.app-view-toggle').evaluate((el) => el === document.activeElement), `${journey.id}: first Tab after Next reaches view control`);
    records.push({ journey: journey.id, viewport: viewport.label, stage: 'first-tab-after-next',
      activeElement: await page.evaluate(() => ({ tag: document.activeElement.tagName, className: document.activeElement.className })) });

    const newItem = path.join(evidenceDir, `${journey.id}-${viewport.label}-new-item.png`);
    await page.screenshot({ path: newItem, fullPage: true });
    await measure(page, journey, viewport, 'second-item-entry', newItem);
    if (view === 'visual') {
      const operandLabels = await page.locator('.app-visual-view .symbolic-fraction[role="math"]')
        .evaluateAll((items) => items.map((item) => item.getAttribute('aria-label')));
      assert(operandLabels.includes('1 over 2') && operandLabels.includes('1 over 3'), `${journey.id}: second operands ${operandLabels.join(', ')}`);
    } else {
      const expression = await page.locator('.app-linear-view .linear-context-expression').getAttribute('aria-label');
      assert(expression === '1 over 2 plus 1 over 3', `${journey.id}: second expression ${expression}`);
    }
    assert(!(await page.locator('.app-episode').innerText()).includes('5/6'), `${journey.id}: answer must remain withheld at second-item entry`);
    await completeEpisode(page, journey, view, journey.denominator, {
      captureReflection: { journey: journey.id, viewport },
    });
    const completion = path.join(evidenceDir, `${journey.id}-${viewport.label}-completion.png`);
    await page.screenshot({ path: completion, fullPage: true });
    await measure(page, journey, viewport, 'second-item-exhaustion', completion);
    assert((await page.locator('.app-navigation-notice').innerText()).includes('You’ve tried both problems.'), `${journey.id}: exhaustion`);
    const exhaustionNotice = page.locator('.app-navigation-notice');
    assert(await exhaustionNotice.evaluate((el) => el === document.activeElement), `${journey.id}: exhaustion transition focus`);
    await page.emulateMedia({ reducedMotion: journey.motion === 'reduced' ? 'no-preference' : 'reduce' });
    assert(await exhaustionNotice.evaluate((el) => el === document.activeElement), `${journey.id}: motion rerender preserves exhaustion focus`);
    await click(page, '.app-view-toggle');
    assert(await page.locator('.app-view-toggle').evaluate((el) => el === document.activeElement), `${journey.id}: view toggle click focus`);
    await page.emulateMedia({ reducedMotion: journey.motion === 'reduced' ? 'reduce' : 'no-preference' });
    assert(await page.locator('.app-view-toggle').evaluate((el) => el === document.activeElement), `${journey.id}: motion rerender preserves learner focus`);
    await click(page, '.app-return-button');
    assert(await page.locator('.app-entry-title').evaluate((el) => el === document.activeElement), `${journey.id}: return focus`);
    await click(page, '.app-practice-button');
    assert(await page.locator('.app-episode').evaluate((el) => el === document.activeElement), `${journey.id}: re-entry focus`);
  } finally {
    await context.close();
  }
}

async function assertScreens(page, journey, viewport, view) {
  const initial = path.join(evidenceDir, `${journey.id}-${viewport.label}-initial.png`);
  await page.screenshot({ path: initial, fullPage: true });
  await measure(page, journey, viewport, 'first-item-initial', initial);
  const promptSelector = `.app-${view}-view .active-beat-prompt`;
  await page.locator(promptSelector).waitFor({ state: 'visible' });
  const before = await page.evaluate((selector) => ({ y: scrollY, bottom: document.querySelector(selector).getBoundingClientRect().bottom }), promptSelector);
  const controlBottom = await page.locator(`.app-${view}-view .active-beat-controls`).evaluate((el) => el.getBoundingClientRect().bottom);
  if (controlBottom > viewport.height) {
    await page.locator(`.app-${view}-view .active-beat-controls`).scrollIntoViewIfNeeded();
    const scrolled = path.join(evidenceDir, `${journey.id}-${viewport.label}-scrolled-controls.png`);
    await page.screenshot({ path: scrolled, fullPage: true });
    await measure(page, journey, viewport, 'first-item-controls-scrolled-into-view', scrolled);
  }
  await page.evaluate((y) => window.scrollTo(0, y), before.y);
}

async function runRefusal(viewport, corruption) {
  const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  const page = await context.newPage();
  page.setDefaultTimeout(8000);
  await page.route('**/assets/*.js', async (route) => {
    const response = await route.fetch();
    const source = await response.text();
    const tableKey = '"curated-relatively-prime-addition-one-half-one-third":{6:[';
    const start = source.indexOf(tableKey);
    assert(start >= 0, 'Test harness could not find the second fixture table in the built bundle');
    const end = source.indexOf(']', start);
    const section = source.slice(start, end + 1);
    const matchC = ',{id:"match-c",form:{kind:"fraction",numerator:"4",denominator:"6"}}';
    assert(section.includes(matchC), 'Test harness did not match the expected authored 6ths choices');
    const replacement = corruption === 'two-choices'
      ? section.replace(matchC, '')
      : section.replace('numerator:"4",denominator:"6"', 'numerator:"7",denominator:"6"');
    await route.fulfill({ response, body: source.slice(0, start) + replacement + source.slice(end + 1) });
  });
  try {
    await page.goto(`http://127.0.0.1:${server.address().port}/FractionFlow/`);
    await click(page, '.app-practice-button');
    const controlJourney = { condition: 'phase2-bundle-1', support: 'high-support', premise: null };
    await completeEpisode(page, controlJourney, 'visual', '12', { first: true });
    const previousReflection = await page.locator('.app-visual-view .active-beat-section').innerText();
    const faultedReplayState = await page.getByRole('button', { name: 'Replay the last change' }).getAttribute('aria-pressed');
    await click(page, '.app-next-button');
    const notice = page.locator('.app-navigation-notice');
    assert((await notice.innerText()) === 'This problem is not ready. Try again or go back to start.', `refusal copy: ${await notice.innerText()}`);
    assert(await notice.evaluate((el) => el === document.activeElement), 'refusal transition must focus the recovery notice');
    assert(await page.locator('.app-visual-view .active-beat-section').innerText() === previousReflection, 'refusal must preserve completed reflection UI');
    assert(await page.getByRole('button', { name: 'Replay the last change' }).getAttribute('aria-pressed') === faultedReplayState, 'refusal must preserve Replay state');
    assert(await page.locator('.app-restart-button').isEnabled(), 'Retry remains enabled after refusal');
    assert(await page.locator('.app-return-button').isEnabled(), 'return remains enabled after refusal');
    const refusalImage = path.join(evidenceDir, `corrupt-${corruption}-${viewport.label}-refusal.png`);
    await page.screenshot({ path: refusalImage, fullPage: true });
    const refusalJourney = { id: `corrupt-${corruption}-refusal`, condition: 'phase2-bundle-1', view: 'visual', support: 'high-support', motion: 'standard', denominator: '6', touchContext: false };
    await measure(page, refusalJourney, viewport, 'second-item-admission-refusal', refusalImage);

    await click(page, '.app-view-toggle');
    assert(await page.locator('.app-view-toggle').evaluate((el) => el === document.activeElement), 'view change after refusal must not re-focus refusal');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert(await page.locator('.app-view-toggle').evaluate((el) => el === document.activeElement), 'motion change after refusal must preserve current learner focus');
    if (viewport.width === 360) {
      await click(page, '.app-restart-button');
      assert(await page.locator('.app-episode').evaluate((el) => el === document.activeElement), 'Retry after refusal focuses the fresh episode');
      await page.keyboard.press('Tab');
      assert(await page.locator('.app-view-toggle').evaluate((el) => el === document.activeElement), 'first Tab after Retry reaches the view control');
    } else {
      await click(page, '.app-return-button');
      assert(await page.locator('.app-entry-title').evaluate((el) => el === document.activeElement), 'return after refusal focuses the entry heading');
      await click(page, '.app-practice-button');
      assert(await page.locator('.app-episode').evaluate((el) => el === document.activeElement), 're-entry after refusal focuses the episode');
    }
    records.push({ journey: refusalJourney.id, viewport: viewport.label, stage: 'refusal-rerender-focus-retained', corruption });
  } finally {
    await context.close();
  }
}

try {
  mkdirSync(evidenceDir, { recursive: true });
  selectedJourneys = process.env.PLAN26_ONLY
    ? journeys.filter((journey) => journey.id.includes(process.env.PLAN26_ONLY))
    : journeys;
  assert(selectedJourneys.length > 0 || process.env.PLAN26_ONLY?.includes('refusal'),
    `PLAN26_ONLY matched no journey or refusal case: ${process.env.PLAN26_ONLY}`);
  for (const journey of selectedJourneys) {
    for (const viewport of [
      { width: 360, height: 740, label: '360x740' },
      { width: 1366, height: 768, label: '1366x768' },
    ]) {
      await runJourney(journey, viewport);
    }
  }
  if (!process.env.PLAN26_ONLY || process.env.PLAN26_ONLY.includes('refusal')) {
    await runRefusal({ width: 360, height: 740, label: '360x740' }, 'two-choices');
    await runRefusal({ width: 1366, height: 768, label: '1366x768' }, 'out-of-whole');
  }
} finally {
  await browser.close();
  server.close();
}

const output = {
  purpose: 'Plan 26 Repair 01 mounted two-item journeys across registered conditions, views, supports, motion modes, denominator paths, premise outcomes and touch context.',
  browser: 'Microsoft Edge via Playwright; headless desktop browser.',
  viewportConfiguration: 'CSS pixels; default browser zoom; devicePixelRatio recorded per capture.',
  filter: process.env.PLAN26_ONLY || null,
  limits: 'Automated text entry; no native mobile keyboard, physical Chromebook/touch device, assistive technology, or learning-transfer evidence.',
  journeys: selectedJourneys.map(({ id, condition, view, support, motion, denominator, touch, premise }) => ({ id, condition, view, support, motion, denominator, touchContext: touch, premiseOutcome: premise })),
  captures: records,
};
const filterSlug = process.env.PLAN26_ONLY
  ? `-${process.env.PLAN26_ONLY.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  : '';
writeFileSync(path.join(evidenceDir, `rendered-screen-measurements${filterSlug}.json`), `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({ journeyCount: selectedJourneys.length, filter: process.env.PLAN26_ONLY || null, captures: records.length, evidenceDir }, null, 2));
