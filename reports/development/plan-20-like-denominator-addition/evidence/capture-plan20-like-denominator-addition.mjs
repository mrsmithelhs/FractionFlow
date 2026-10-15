import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('../../../../scripts/dev/run-route-matrix.js');
const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
mkdirSync(evidenceDir, { recursive: true });
const server = createStaticServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}/FractionFlow/`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });

async function capture(page, filename, label) {
  await page.screenshot({ path: path.join(evidenceDir, filename), fullPage: true });
  const data = await page.evaluate(() => {
    const box = (element) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    };
    const app = document.querySelector('.fractionflow-app');
    const active = document.querySelector('.app-visual-view:not([hidden]), .app-linear-view:not([hidden])');
    const operationFields = [...(active?.querySelectorAll('.control-fraction-input') || [])];
    return {
      viewport: { width: window.innerWidth, height: window.innerHeight },
      document: { scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight },
      app: { x: app.getBoundingClientRect().x, y: app.getBoundingClientRect().y, width: app.getBoundingClientRect().width, height: app.getBoundingClientRect().height, scrollWidth: app.scrollWidth, scrollHeight: app.scrollHeight },
      activePath: active?.classList.contains('app-linear-view') ? 'linear' : 'visual',
      prompt: box(active?.querySelector('.active-beat-prompt')),
      feedback: box(active?.querySelector('.recovery-feedback')),
      feedbackText: active?.querySelector('.recovery-feedback')?.textContent?.trim() || '',
      helpCueText: active?.querySelector('.active-denominator-help-cue')?.textContent?.trim() || '',
      helpExpanded: active?.querySelector('.active-beat-controls .app-secondary-button')?.getAttribute('aria-expanded') || 'false',
      visibleText: active?.innerText || '',
      responseFields: operationFields.map((input) => ({
        id: input.id,
        label: input.labels?.[0]?.textContent?.trim() || '',
        inputMode: input.inputMode,
        min: input.min,
        max: input.max,
        box: box(input),
      })),
      submit: box(active?.querySelector('.control-submit-btn')),
      supportLevel: app.dataset.supportLevel,
      conditionId: app.dataset.conditionId,
      hiddenConversionOrDecisionControls: [...document.querySelectorAll(
        '#decide-common-denominator-input, #transform-num-input-left, #transform-num-input-right, #transform-help-multiplier-left, #transform-help-multiplier-right',
      )].length,
      reflectionControls: [...document.querySelectorAll('.app-reflection, .matching-choice-btn')].length,
    };
  });
  return { label, screenshot: filename, ...data };
}

async function begin(page, { support, linear }) {
  const activate = (locator) => linear ? locator.tap() : locator.click();
  await page.goto(baseUrl);
  await page.waitForSelector('.fractionflow-app');
  await page.locator('.app-gear-button').click();
  await page.locator('[data-condition-id="phase2-bundle-1"]').click();
  await page.locator('.app-gear-button').click();
  await activate(page.locator(`[data-support-id="${support}"]`));
  await activate(page.locator('[data-practice-type="like-denominator-addition"]'));
  if (linear) await activate(page.locator('.app-view-toggle'));
  const surface = linear ? '.app-linear-view' : '.app-visual-view';
  await activate(page.locator(`${surface} .control-btn`));
  return surface;
}

try {
  const evidence = [];
  const entryScreens = [];
  const cases = [
    { width: 360, height: 740, support: 'high-support', linear: false, key: 'visual-740' },
    { width: 360, height: 752, support: 'medium-support', linear: true, key: 'linear-752' },
  ];
  for (const run of cases) {
    const context = await browser.newContext({
      viewport: { width: run.width, height: run.height },
      reducedMotion: 'reduce',
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    const activate = (locator) => run.linear ? locator.tap() : locator.click();
    await page.goto(baseUrl);
    await page.waitForSelector('.fractionflow-app');
    const entryButtons = page.locator('.app-entry-page [data-practice-type]');
    if (await entryButtons.count() !== 2) throw new Error(`${run.key}: expected both staged practice goals on entry`);
    const entryLabels = await entryButtons.allTextContents();
    if (entryLabels[0] !== 'Add fractions with different denominators'
      || entryLabels[1] !== 'Add fractions with the same denominator') {
      throw new Error(`${run.key}: entry order/labels changed: ${JSON.stringify(entryLabels)}`);
    }
    const entryLayout = await page.evaluate(() => {
      const rect = (element) => {
        const value = element.getBoundingClientRect();
        return { x: value.x, y: value.y, width: value.width, height: value.height };
      };
      const page = document.querySelector('.app-entry-page');
      return {
        viewport: { width: innerWidth, height: innerHeight },
        document: { scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight },
        entryPage: rect(page),
        practiceButtons: [...page.querySelectorAll('[data-practice-type]')].map((element) => ({
          id: element.dataset.practiceType,
          label: element.textContent.trim(),
          disabled: element.disabled,
          box: rect(element),
        })),
        gear: rect(page.querySelector('.app-gear-button')),
      };
    });
    const entryScreenshot = `plan20-entry-${run.width}x${run.height}.png`;
    await page.screenshot({ path: path.join(evidenceDir, entryScreenshot), fullPage: true });
    entryScreens.push({ screenshot: entryScreenshot, ...entryLayout });
    const surface = await begin(page, run);
    await activate(page.locator(`${surface} .control-choice-btn`).nth(1));
    const notice = await page.locator(`${surface} .recovery-feedback`).innerText();
    if (notice !== 'Both bars have 7 equal parts. Those parts are the same size.') {
      throw new Error(`${run.key}: unexpected same-unit notice recovery: ${notice}`);
    }
    evidence.push(await capture(page, `plan20-${run.key}-wrong-notice.png`, 'wrong notice recovery'));
    await activate(page.locator(`${surface} .control-choice-btn`).nth(0));

    const numerator = surface === '.app-visual-view'
      ? '#operate-fraction-numerator-input'
      : '#linear-operate-fraction-numerator-input';
    const denominator = surface === '.app-visual-view'
      ? '#operate-fraction-denominator-input'
      : '#linear-operate-fraction-denominator-input';
    const beforeAnswer = await page.locator('.fractionflow-app').evaluate((root) => {
      const active = root.querySelector('.app-visual-view:not([hidden]), .app-linear-view:not([hidden])');
      const accessibleLabels = [...(active?.querySelectorAll('[aria-label]') || [])]
        .filter((element) => element.getAttribute('aria-hidden') !== 'true')
        .map((element) => element.getAttribute('aria-label'))
        .join(' ');
      return `${root.innerText} ${accessibleLabels}`;
    });
    const leakMatch = beforeAnswer.match(/5\/7|10\/14|5\/14|common denominator|renam(?:e|ing)/i);
    if (leakMatch) {
      const leakIndex = leakMatch.index;
      throw new Error(`${run.key}: a final answer or skipped unlike-denominator task leaked before the learner response: ${beforeAnswer.slice(Math.max(0, leakIndex - 120), leakIndex + 140)}`);
    }
    evidence.push({
      label: 'pre-response absence checks',
      viewport: { width: run.width, height: run.height },
      activePath: run.linear ? 'linear' : 'visual',
      skippedControlsAbsent: true,
      answerAndUnlikeTaskTextAbsent: true,
      reflectionControls: await page.locator('.app-reflection, .matching-choice-btn').count(),
    });
    for (const input of [numerator, denominator]) {
      if (await page.locator(input).count() !== 1) throw new Error(`${run.key}: expected one mounted field ${input}`);
    }
    await page.locator(numerator).fill('5');
    await page.locator(denominator).fill('14');
    await activate(page.locator(`${surface} .control-submit-btn`));
    if (await page.locator(numerator).inputValue() !== '5'
      || await page.locator(denominator).inputValue() !== '14') {
      throw new Error(`${run.key}: the incorrect 5/14 response was not retained for repair`);
    }
    const arithmeticRecovery = await page.locator(`${surface} .recovery-feedback`).innerText();
    if (arithmeticRecovery !== 'The denominator stays the same. Add only the top numbers.') {
      throw new Error(`${run.key}: unexpected arithmetic recovery: ${arithmeticRecovery}`);
    }
    evidence.push(await capture(page, `plan20-${run.key}-5-over-14-recovery.png`, '5/14 arithmetic recovery'));

    await activate(page.locator(`${surface} .active-beat-controls .app-secondary-button`));
    const helpCue = await page.locator(`${surface} .active-denominator-help-cue`).innerText();
    if (helpCue !== 'Add the top numbers. Keep the same bottom number.') {
      throw new Error(`${run.key}: expected visible task-local help, got ${helpCue}`);
    }
    evidence.push(await capture(page, `plan20-${run.key}-local-help.png`, 'visible local operation help'));
    await activate(page.locator(`${surface} .active-beat-controls .app-secondary-button`));

    if (run.linear) {
      await page.locator(numerator).fill('10');
      await page.locator(denominator).fill('14');
      await activate(page.locator(`${surface} .control-submit-btn`));
    } else {
      await page.locator(numerator).press('Control+A');
      await page.locator(numerator).pressSequentially('10');
      await page.locator(denominator).press('Tab');
      await page.locator(`${surface} .control-submit-btn`).press('Enter');
    }
    await page.getByRole('button', { name: 'Finish', exact: true }).waitFor({ state: 'visible' });
    const resolveText = await page.locator(`${surface} .active-beat-prompt`).innerText();
    if (!resolveText.includes('That names the same amount.')) throw new Error(`${run.key}: expected the short equivalent-answer success cue, got ${resolveText}`);
    const completedSummary = await page.locator(`${surface} .completed-beats-section`).innerText();
    if (!completedSummary.includes('10/14')) throw new Error(`${run.key}: completed summary did not preserve the actual submitted 10/14 form`);
    if (await page.locator('.app-reflection, .matching-choice-btn').count() !== 0) {
      throw new Error(`${run.key}: a reflection control appeared despite includeReflection=false`);
    }
    const acceptedCapture = await capture(page, `plan20-${run.key}-accepted-10-over-14.png`, 'accepted equivalent unsimplified answer');
    acceptedCapture.keyboardCorrection = run.linear ? null : 'Control+A, type 10, Tab to Submit, Enter';
    evidence.push(acceptedCapture);
    await activate(page.getByRole('button', { name: 'Finish', exact: true }));
    await page.locator('.app-episode').evaluate((element) => element === document.activeElement || element.focus());
    evidence.push(await capture(page, `plan20-${run.key}-finished.png`, 'finished single-item goal'));
    const retainedFocus = await page.locator('.app-episode').evaluate((element) => element === document.activeElement);
    if (!retainedFocus) throw new Error(`${run.key}: Finish did not retain focus on the episode landmark`);
    await context.close();
  }

  writeFileSync(
    path.join(evidenceDir, 'browser-measurements.json'),
    `${JSON.stringify({ plan: 'plan-20', browser: 'Chrome via Playwright', motion: 'prefers-reduced-motion', entryScreens, evidence }, null, 2)}\n`,
    'utf8',
  );
  console.log(`Captured ${evidence.length} mounted Plan 20 states across the required mobile viewport heights.`);
} finally {
  await browser.close();
  server.close();
}
