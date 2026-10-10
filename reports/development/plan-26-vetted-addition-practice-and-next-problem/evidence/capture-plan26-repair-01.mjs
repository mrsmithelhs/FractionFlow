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

async function click(page, selector, { touch = false, metadata = null } = {}) {
  const locator = typeof selector === 'string' ? page.locator(selector).first() : selector;
  await locator.waitFor({ state: 'visible' });
  if (!touch) return locator.click();
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  assert(box && box.width > 0 && box.height > 0, `Cannot touch ${selector}: missing bounds`);
  const visible = await locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return rect.right > 0 && rect.bottom > 0 && rect.left < innerWidth && rect.top < innerHeight;
  });
  assert(visible, `Cannot touch ${selector}: target did not scroll into the CSS viewport`);
  await locator.evaluate((element) => {
    document.__plan26ExpectedTouchReached = false;
    document.addEventListener('click', (event) => {
      document.__plan26ExpectedTouchReached = event.composedPath().includes(element);
    }, {
      capture: true, once: true,
    });
  });
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  const delivered = await page.evaluate(() => document.__plan26ExpectedTouchReached === true);
  assert(delivered, `Touch tap did not activate the intended mounted control: ${selector}`);
  if (metadata) records.push({ journey: metadata.journey, viewport: metadata.viewport,
    stage: metadata.stage, action: 'touchscreen.tap', target: typeof selector === 'string' ? selector : metadata.stage,
    intendedTargetReceivedClick: true });
}

async function activate(page, selector, journey, viewport, stage) {
  return click(page, selector, {
    touch: journey.touch,
    metadata: journey.touch ? { journey: journey.id, viewport: viewport.label, stage } : null,
  });
}

async function fillInput(page, selector, value, journey, viewport, stage) {
  const input = page.locator(selector).first();
  if (journey.touch) {
    await click(page, input, {
      touch: true,
      metadata: { journey: journey.id, viewport: viewport.label, stage: `${stage}-input-focus-before-automated-entry` },
    });
    assert(await input.evaluate((element) => element === document.activeElement), `${journey.id}: touch did not focus ${stage} input before automated entry`);
  }
  await input.fill(value);
}

async function assertSecondItemFresh(page, journey, view, stage) {
  const scope = `.app-${view}-view`;
  assert((await page.locator(`${scope} .active-beat-prompt`).innerText()).includes('Look at these two fractions.'), `${journey.id}: ${stage} restores the second-item encounter`);
  assert(await page.locator(`${scope} input.control-numeric-input`).count() === 0, `${journey.id}: ${stage} clears prior numeric input`);
  assert(await page.locator('#linear-transform-help-multiplier-right, #transform-help-multiplier-right').count() === 0, `${journey.id}: ${stage} clears the helper input`);
  assert(await page.locator('.recovery-feedback').count() === 0, `${journey.id}: ${stage} clears recovery feedback`);
  assert(await page.getByRole('button', { name: 'Replay the last change' }).getAttribute('aria-pressed') === 'false', `${journey.id}: ${stage} clears Replay state`);
  if (view === 'visual') {
    const operands = await page.locator('.app-visual-view .symbolic-fraction[role="math"]')
      .evaluateAll((items) => items.map((item) => item.getAttribute('aria-label')));
    assert(operands.includes('1 over 2') && operands.includes('1 over 3'), `${journey.id}: ${stage} operands ${operands.join(', ')}`);
  } else {
    const expression = await page.locator('.app-linear-view .linear-context-expression').getAttribute('aria-label');
    assert(expression === '1 over 2 plus 1 over 3', `${journey.id}: ${stage} expression ${expression}`);
  }
  assert(await page.locator('.app-view-toggle').getAttribute('aria-pressed') === String(view === 'linear'), `${journey.id}: ${stage} retains selected view`);
  assert(await page.locator(`.app-display-options [data-condition-id="${journey.condition}"]`).getAttribute('aria-pressed') === 'true', `${journey.id}: ${stage} retains condition`);
  assert(await page.locator(`.app-support-options [data-support-id="${journey.support}"]`).getAttribute('aria-pressed') === 'true', `${journey.id}: ${stage} retains support`);
}

async function assertFirstItemFresh(page, journey, view) {
  assert((await page.locator(`.app-${view}-view .active-beat-prompt`).innerText()).includes('Look at these two fractions.'), `${journey.id}: re-entry restores the first-item encounter`);
  if (view === 'visual') {
    const operands = await page.locator('.app-visual-view .symbolic-fraction[role="math"]')
      .evaluateAll((items) => items.map((item) => item.getAttribute('aria-label')));
    assert(operands.includes('2 over 3') && operands.includes('1 over 4'), `${journey.id}: re-entry operands ${operands.join(', ')}`);
  } else {
    const expression = await page.locator('.app-linear-view .linear-context-expression').getAttribute('aria-label');
    assert(expression === '2 over 3 plus 1 over 4', `${journey.id}: re-entry expression ${expression}`);
  }
  assert(await page.locator(`.app-${view}-view input.control-numeric-input`).count() === 0, `${journey.id}: re-entry has no stale numeric input`);
  assert(await page.locator('#linear-transform-help-multiplier-right, #transform-help-multiplier-right').count() === 0, `${journey.id}: re-entry has no stale helper input`);
  assert(await page.locator('.recovery-feedback').count() === 0, `${journey.id}: re-entry has no stale recovery feedback`);
  assert(await page.getByRole('button', { name: 'Replay the last change' }).getAttribute('aria-pressed') === 'false', `${journey.id}: re-entry has no stale Replay state`);
  assert(await page.locator('.app-view-toggle').getAttribute('aria-pressed') === String(view === 'linear'), `${journey.id}: re-entry retains view`);
  assert(await page.locator(`.app-display-options [data-condition-id="${journey.condition}"]`).getAttribute('aria-pressed') === 'true', `${journey.id}: re-entry retains condition`);
  assert(await page.locator(`.app-support-options [data-support-id="${journey.support}"]`).getAttribute('aria-pressed') === 'true', `${journey.id}: re-entry retains support`);
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

async function completeEpisode(page, journey, view, denominator, { first = false, captureReflection = null, viewport } = {}) {
  const scope = `.app-${view}-view`;
  await activate(page, `${scope} .control-btn`, journey, viewport, 'acknowledge-encounter');
  await activate(page, `${scope} .control-choice-btn >> nth=1`, journey, viewport, 'answer-initial-question');
  if (journey.support === 'high-support') {
    await activate(page, `${scope} .control-choice-btn >> nth=${first || denominator === '6' ? 0 : 1}`, journey, viewport, 'choose-common-denominator');
  } else {
    await fillInput(page, `${scope} input.control-numeric-input`, denominator, journey, viewport, 'enter-common-denominator');
    await activate(page, `${scope} .control-submit-btn`, journey, viewport, 'submit-common-denominator');
  }
  const values = first ? ['8', '3', '11'] : (denominator === '12' ? ['6', '4', '10'] : ['3', '2', '5']);
  for (const [index, value] of values.entries()) {
    await fillInput(page, `${scope} input.control-numeric-input`, value, journey, viewport, `enter-answer-${index + 1}`);
    await activate(page, `${scope} .control-submit-btn`, journey, viewport, `submit-answer-${index + 1}`);
  }
  await activate(page, `${scope} .control-btn`, journey, viewport, 'open-reflection');
  if (captureReflection) {
    const reflectionImage = path.join(evidenceDir, `${captureReflection.journey}-${captureReflection.viewport.label}-reflection.png`);
    await page.screenshot({ path: reflectionImage, fullPage: true });
    await measure(page, journey, captureReflection.viewport, 'second-item-reflection-before-answer', reflectionImage);
    const originalScrollY = await page.evaluate(() => window.scrollY);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    const reachable = await page.evaluate((viewName) => {
      const fitsViewport = (element) => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0
          && rect.left >= 0 && rect.top >= 0
          && rect.right <= innerWidth && rect.bottom <= innerHeight;
      };
      return {
        question: fitsViewport(document.querySelector(`.app-${viewName}-view .active-beat-prompt`)),
        controls: fitsViewport(document.querySelector(`.app-${viewName}-view .active-beat-controls`)),
      };
    }, view);
    assert(reachable.question, `${journey.id} ${captureReflection.viewport.label}: scrolled reflection question must be reachable in the CSS viewport`);
    assert(reachable.controls, `${journey.id} ${captureReflection.viewport.label}: scrolled reflection controls must be reachable in the CSS viewport`);
    const scrolledImage = path.join(evidenceDir, `${captureReflection.journey}-${captureReflection.viewport.label}-reflection-scrolled-controls.png`);
    await page.screenshot({ path: scrolledImage, fullPage: true });
    await measure(page, journey, captureReflection.viewport, 'second-item-reflection-controls-scrolled', scrolledImage);
    await page.evaluate((y) => window.scrollTo(0, y), originalScrollY);
  }
  if (journey.condition === 'phase2-bundle-4') {
    const premiseAnswer = first ? 'No' : journey.premise;
    const button = page.getByRole('button', { name: new RegExp(`^${premiseAnswer}\\b`, 'i') });
    await button.waitFor({ state: 'visible' });
    await activate(page, button, journey, captureReflection?.viewport || viewport, `answer-premise-${premiseAnswer}`);
  } else {
    await activate(page, `${scope} .control-choice-btn >> nth=${first ? 0 : 1}`, journey,
      captureReflection?.viewport || viewport, 'answer-final-reflection');
  }
  try {
    await page.locator('.app-next-button:not([hidden]), .app-navigation-notice:not([hidden])').waitFor({ state: 'visible' });
  } catch (error) {
    console.error(`Unresolved ${journey.condition} denominator ${denominator} premise ${journey.premise}:`, await page.locator(scope).innerText());
    throw error;
  }
}

async function exerciseRetry(page, journey, viewport, view, { secondItem = false, keepReplayOpen = false } = {}) {
  const scope = `.app-${view}-view`;
  const scenario = secondItem ? 'second-item-dirty-retry' : 'first-item-dirty-retry';
  await activate(page, `${scope} .control-btn`, journey, viewport, `${scenario}-acknowledge-encounter`);
  await activate(page, `${scope} .control-choice-btn >> nth=0`, journey, viewport, `${scenario}-wrong-notice-response`);
  await activate(page, `${scope} .control-choice-btn >> nth=1`, journey, viewport, `${scenario}-notice-recovery`);
  if (journey.support === 'high-support') {
    await activate(page, `${scope} .control-choice-btn >> nth=0`, journey, viewport, `${scenario}-accept-conversion-choice`);
    await fillInput(page, `${scope} input.control-numeric-input`, '7', journey, viewport, `${scenario}-incorrect-conversion`);
    await activate(page, `${scope} .control-submit-btn`, journey, viewport, `${scenario}-submit-incorrect-conversion`);
    await fillInput(page, `${scope} input.control-numeric-input`, '8', journey, viewport, `${scenario}-accepted-conversion`);
    await activate(page, `${scope} .control-submit-btn`, journey, viewport, `${scenario}-submit-accepted-conversion`);
  } else {
    await fillInput(page, `${scope} input.control-numeric-input`, '6', journey, viewport, `${scenario}-enter-common-denominator`);
    await activate(page, `${scope} .control-submit-btn`, journey, viewport, `${scenario}-submit-common-denominator`);
    await activate(page, `${scope} .active-beat-controls .app-secondary-button`, journey, viewport, `${scenario}-open-left-task-help`);
    await fillInput(page, `${scope} #linear-transform-help-multiplier-left`, '3', journey, viewport, `${scenario}-left-task-help-multiplier`);
    await activate(page, `${scope} .control-submit-btn`, journey, viewport, `${scenario}-accept-left-task-help`);
    await fillInput(page, `${scope} #linear-transform-num-input-left`, '7', journey, viewport, `${scenario}-incorrect-numerator`);
    await activate(page, `${scope} .control-submit-btn`, journey, viewport, `${scenario}-submit-incorrect-numerator`);
    await fillInput(page, `${scope} #linear-transform-num-input-left`, '3', journey, viewport, `${scenario}-accepted-numerator`);
    await activate(page, `${scope} .control-submit-btn`, journey, viewport, `${scenario}-submit-accepted-numerator`);
  }
  await activate(page, `${scope} .active-beat-controls .app-secondary-button`, journey, viewport, `${scenario}-open-task-help`);
  const helperSelector = view === 'visual'
    ? '#transform-help-multiplier-right'
    : '#linear-transform-help-multiplier-right';
  const helper = page.locator(`${scope} ${helperSelector}`);
  await fillInput(page, `${scope} ${helperSelector}`, '3', journey, viewport, `${scenario}-task-help-draft`);
  const replay = page.getByRole('button', { name: 'Replay the last change' });
  await activate(page, replay, journey, viewport, `${scenario}-activate-replay`);
  assert(await replay.getAttribute('aria-pressed') === 'true', `${journey.id}: Replay opened before Retry`);
  if (!keepReplayOpen) {
    await activate(page, replay, journey, viewport, `${scenario}-close-replay`);
  }
  const dirtyName = secondItem
    ? `${journey.id}-${viewport.label}-${scenario}.png`
    : `${journey.id}-${viewport.label}-before-retry.png`;
  const dirtyScreen = path.join(evidenceDir, dirtyName);
  await page.screenshot({ path: dirtyScreen, fullPage: true });
  await measure(page, journey, viewport, `${scenario}-before-retry-replay-${keepReplayOpen ? 'active' : 'closed'}`, dirtyScreen);
  await activate(page, '.app-restart-button', journey, viewport, `${scenario}-retry`);
  assert(await page.locator('.app-episode').evaluate((el) => el === document.activeElement), `${journey.id}: Retry focus`);
  assert(await helper.count() === 0, `${journey.id}: Retry removes task-help draft`);
  assert(await replay.getAttribute('aria-pressed') === 'false', `${journey.id}: Retry clears Replay state`);
  assert(await page.locator('.recovery-feedback').count() === 0, `${journey.id}: Retry clears recovery UI`);
  if (secondItem) await assertSecondItemFresh(page, journey, view, 'Retry');
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
    await activate(page, '.app-gear-button', journey, viewport, 'open-settings-condition');
    await activate(page, `[data-condition-id="${journey.condition}"]`, journey, viewport, 'select-condition');
    if (journey.support !== 'high-support') {
      await activate(page, '.app-gear-button', journey, viewport, 'open-settings-support');
      await activate(page, `[data-support-id="${journey.support}"]`, journey, viewport, 'select-support');
    }
    await activate(page, '.app-practice-button', journey, viewport, 'enter-practice');
    if (journey.view === 'linear') await activate(page, '.app-view-toggle', journey, viewport, 'select-linear-view');
    const view = journey.view;
    if (journey.keyboardNext) await exerciseRetry(page, journey, viewport, view);
    await assertScreens(page, journey, viewport, view);
    await completeEpisode(page, { ...journey, premise: null }, view, '12', { first: true, viewport });
    const nextScreenshot = path.join(evidenceDir, `${journey.id}-${viewport.label}-next-ready.png`);
    await page.screenshot({ path: nextScreenshot, fullPage: true });
    await measure(page, journey, viewport, 'first-item-complete-next-ready', nextScreenshot);
    if (journey.keyboardNext) {
      await page.locator('.app-view-toggle').focus();
      await page.keyboard.press('Tab');
      assert(await page.locator('.app-next-button').evaluate((el) => el === document.activeElement), `${journey.id}: Tab from view control reaches Next`);
      await page.keyboard.press('Enter');
    } else if (journey.touch) {
      await activate(page, '.app-next-button', journey, viewport, 'next-to-second-item');
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
    await assertSecondItemFresh(page, journey, view, 'Next');
    assert(!(await page.locator('.app-episode').innerText()).includes('5/6'), `${journey.id}: answer must remain withheld at second-item entry`);
    if (journey.touch) {
      await exerciseRetry(page, journey, viewport, view, { secondItem: true, keepReplayOpen: true });
      const retryScreen = path.join(evidenceDir, `${journey.id}-${viewport.label}-second-item-after-retry.png`);
      await page.screenshot({ path: retryScreen, fullPage: true });
      await measure(page, journey, viewport, 'second-item-clean-after-dirty-retry', retryScreen);
    }
    await completeEpisode(page, journey, view, journey.denominator, {
      captureReflection: { journey: journey.id, viewport },
      viewport,
    });
    const completion = path.join(evidenceDir, `${journey.id}-${viewport.label}-completion.png`);
    await page.screenshot({ path: completion, fullPage: true });
    await measure(page, journey, viewport, 'second-item-exhaustion', completion);
    assert((await page.locator('.app-navigation-notice').innerText()).includes('You’ve tried both problems.'), `${journey.id}: exhaustion`);
    const exhaustionNotice = page.locator('.app-navigation-notice');
    assert(await exhaustionNotice.evaluate((el) => el === document.activeElement), `${journey.id}: exhaustion transition focus`);
    await page.emulateMedia({ reducedMotion: journey.motion === 'reduced' ? 'no-preference' : 'reduce' });
    assert(await exhaustionNotice.evaluate((el) => el === document.activeElement), `${journey.id}: motion rerender preserves exhaustion focus`);
    await activate(page, '.app-view-toggle', journey, viewport, 'view-toggle-at-exhaustion');
    assert(await page.locator('.app-view-toggle').evaluate((el) => el === document.activeElement), `${journey.id}: view toggle click focus`);
    const retainedView = view === 'visual' ? 'linear' : 'visual';
    await page.emulateMedia({ reducedMotion: journey.motion === 'reduced' ? 'reduce' : 'no-preference' });
    assert(await page.locator('.app-view-toggle').evaluate((el) => el === document.activeElement), `${journey.id}: motion rerender preserves learner focus`);
    await activate(page, '.app-return-button', journey, viewport, 'return-to-entry');
    assert(await page.locator('.app-entry-title').evaluate((el) => el === document.activeElement), `${journey.id}: return focus`);
    await activate(page, '.app-practice-button', journey, viewport, 're-enter-practice');
    assert(await page.locator('.app-episode').evaluate((el) => el === document.activeElement), `${journey.id}: re-entry focus`);
    await assertFirstItemFresh(page, journey, retainedView);
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
