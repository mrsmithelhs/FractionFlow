import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('./run-route-matrix.js');
const outputDir = path.resolve('reports/development/plan-24-common-denominator-finding-support/evidence');
await fs.mkdir(outputDir, { recursive: true });
const server = createStaticServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}/FractionFlow/`;
const browserOptions = { headless: true };
if (process.platform === 'win32' && fsSync.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')) browserOptions.channel = 'msedge';
const browser = await chromium.launch(browserOptions);
const observations = [];

function whole(value) {
  return { numerator: String(value), denominator: '1' };
}

async function begin({ height, conditionId = 'phase2-bundle-1', selectDenominator = true }) {
  const context = await browser.newContext({ viewport: { width: 360, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(baseUrl);
  if (conditionId !== 'phase2-bundle-1') {
    await page.locator('.app-gear-button').click();
    await page.locator(`[data-condition-id="${conditionId}"]`).click();
  }
  await page.locator('.app-practice-button').click();
  await page.locator('.app-view-toggle').click();
  await page.locator('.app-linear-view .control-btn').click();
  await page.locator('.app-linear-view .control-choice-btn >> nth=1').click();
  if (selectDenominator) {
    await page.locator('.app-linear-view .control-choice-btn').filter({ hasText: /^12$/ }).click();
  }
  return { context, page };
}

async function submitNumber(page, selector, value) {
  await page.locator(`.app-linear-view ${selector}`).fill(String(value));
  await page.locator('.app-linear-view .control-submit-btn').click();
}

async function afterFirstConversion(session) {
  await submitNumber(session.page, '#linear-transform-num-input-left', 8);
}

async function toResolved(session) {
  await afterFirstConversion(session);
  await submitNumber(session.page, '#linear-transform-num-input-right', 3);
  await submitNumber(session.page, '#linear-operate-sum-input', 11);
}

async function capture(session, {
  height,
  stateName,
  expectedName,
  expectedQuestion = null,
  expectedVisibleText = null,
  expectedHiddenText = [],
}) {
  const { page } = session;
  const result = await page.evaluate(() => {
    const rect = (element) => {
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return {
        left: Math.round(box.left * 100) / 100,
        top: Math.round(box.top * 100) / 100,
        right: Math.round(box.right * 100) / 100,
        bottom: Math.round(box.bottom * 100) / 100,
        width: Math.round(box.width * 100) / 100,
        height: Math.round(box.height * 100) / 100,
      };
    };
    const context = document.querySelector('.app-linear-view .linear-context-section');
    const expression = context.querySelector('[role="math"]');
    const question = document.querySelector('.app-linear-view .active-beat-prompt');
    const children = [...expression.querySelectorAll('.symbolic-fraction, .symbolic-operator, .linear-premise-row')];
    const width = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    return {
      viewport: { width: innerWidth, height: innerHeight },
      context: rect(context),
      expression: rect(expression),
      expressionRole: expression.getAttribute('role'),
      accessibleName: expression.getAttribute('aria-label'),
      hiddenVisualChildren: children.length > 0 && children.every((child) => child.getAttribute('aria-hidden') === 'true'),
      childCount: children.length,
      transitionText: [...context.querySelectorAll('.linear-transition-details li')].map((item) => item.textContent.trim()),
      premiseLabels: [...context.querySelectorAll('.linear-premise-label')].map((item) => item.textContent.trim()),
      questionText: question?.textContent.trim() || null,
      question: rect(question),
      document: { width, height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), horizontalOverflow: width > innerWidth },
    };
  });
  result.state = stateName;
  result.screenshot = `plan24-linear-context-${stateName}-360x${height}.png`;
  const accessibleExpression = page.getByRole('math', { name: expectedName, exact: true });
  if (await accessibleExpression.count() !== 1) throw new Error(`${stateName}: expected one math expression named "${expectedName}"`);
  if (expectedQuestion && result.questionText !== expectedQuestion) {
    throw new Error(`${stateName}: expected active question "${expectedQuestion}", got "${result.questionText}"`);
  }
  if (stateName === 'ordinary-decide') {
    const responseGroup = page.getByRole('group', { name: expectedQuestion, exact: true });
    const candidateCount = await page.locator('.app-linear-view .active-beat-controls .control-choice-fieldset .control-choice-btn').count();
    const transformInputCount = await page.locator('.app-linear-view input[id^="linear-transform"]').count();
    if (await responseGroup.count() !== 1 || candidateCount < 2 || transformInputCount !== 0) {
      throw new Error('ordinary-decide: capture did not stop on the denominator decision state');
    }
    result.taskBeat = 'decide';
  }
  if (result.accessibleName !== expectedName || !result.hiddenVisualChildren || result.document.horizontalOverflow) {
    throw new Error(`${stateName}: accessible expression, hidden visual children, or viewport check failed: ${JSON.stringify(result)}`);
  }
  if (expectedVisibleText && !result.transitionText.join(' ').includes(expectedVisibleText)) {
    throw new Error(`${stateName}: missing exceptional transition/replay wording "${expectedVisibleText}"`);
  }
  const visibleContextText = await page.locator('.app-linear-view .linear-context-section').innerText();
  for (const text of expectedHiddenText) {
    if (visibleContextText.includes(text)) throw new Error(`${stateName}: unexpected surrounding copy remains: "${text}"`);
  }
  await page.screenshot({ path: path.join(outputDir, result.screenshot), animations: 'disabled' });
  observations.push(result);
}

try {
  for (const height of [740, 752]) {
    let session = await begin({ height, selectDenominator: false });
    await capture(session, {
      height,
      stateName: 'ordinary-decide',
      expectedName: '2 over 3 plus 1 over 4',
      expectedQuestion: 'Choose a common denominator for both fractions.',
      expectedHiddenText: ['Problem and Quantities', 'Problem:', 'First fraction:', 'Second fraction:'],
    });
    await session.context.close();

    session = await begin({ height, conditionId: 'phase2-bundle-2' });
    await afterFirstConversion(session);
    await capture(session, {
      height,
      stateName: 'juxtaposed-transition',
      expectedName: '8 over 12 plus 1 over 4',
      expectedVisibleText: 'started as 2 of 3 equal parts, now renamed to 8 of 12 equal parts',
      expectedHiddenText: ['Problem:', 'Second fraction:'],
    });
    await session.context.close();

    session = await begin({ height, conditionId: 'phase2-bundle-3' });
    await afterFirstConversion(session);
    await capture(session, {
      height,
      stateName: 'sequential-transition',
      expectedName: '8 over 12 plus 1 over 4',
      expectedVisibleText: 'Step 1 was 2 of 3 equal parts. Step 2 is 8 of 12 equal parts',
      expectedHiddenText: ['Problem:', 'Second fraction:'],
    });
    await session.context.close();

    session = await begin({ height });
    await afterFirstConversion(session);
    await session.page.locator('.app-support-controls .app-secondary-button').nth(1).click();
    await capture(session, {
      height,
      stateName: 'in-place-replay',
      expectedName: '8 over 12 plus 1 over 4',
      expectedVisibleText: 'First fraction replaying: started with 2 of 3 equal parts',
      expectedHiddenText: ['Problem:', 'Second fraction:'],
    });
    await session.context.close();

    session = await begin({ height });
    await toResolved(session);
    await capture(session, {
      height,
      stateName: 'converted-resolve',
      expectedName: '8 over 12 plus 3 over 12',
      expectedHiddenText: ['Problem and Quantities', 'Problem:', 'First fraction:', 'Second fraction:', '11'],
    });
    await session.context.close();

    session = await begin({ height, conditionId: 'phase2-bundle-4' });
    await toResolved(session);
    await session.page.locator('.app-linear-view .control-btn').click();
    await capture(session, {
      height,
      stateName: 'premise-comparison',
      expectedName: 'Starting fraction: 2 over 3. New parts: 7 over 12.',
      expectedQuestion: 'Does the "New parts" fraction show the same amount as the starting fraction?',
      expectedHiddenText: ['Problem:', 'Problem and Quantities', 'First fraction:', 'Second fraction:'],
    });
    await session.context.close();
  }
} finally {
  await browser.close();
  server.close();
}

const evidence = {
  captureDate: new Date().toISOString().slice(0, 10),
  browser: { engine: 'Chromium via Playwright', channel: browserOptions.channel || 'bundled Chromium' },
  limitations: [
    'Computed accessible names were checked through Playwright browser role queries; no screen reader or assistive technology was used.',
    'These rendered-state checks do not establish learner understanding or instructional efficacy.',
  ],
  observations,
};
await fs.writeFile(path.join(outputDir, 'linear-context-measurements.json'), `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({ outputDir, observations: observations.length, screenshots: observations.map((item) => item.screenshot) }, null, 2));
