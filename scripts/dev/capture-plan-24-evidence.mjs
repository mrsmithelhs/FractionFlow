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
const options = { headless: true };
if (process.platform === 'win32' && fsSync.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')) options.channel = 'msedge';
const browser = await chromium.launch(options);
const records = [];

async function openAtDecide({ height, profile, view, interaction }) {
  const context = await browser.newContext({
    viewport: { width: 360, height },
    hasTouch: interaction === 'touch',
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const viewSelector = `.app-${view}-view`;
  await page.goto(baseUrl);
  if (profile === 'medium') {
    await page.locator('.app-gear-button').click();
    await page.locator('[data-support-id="medium-support"]').click();
  }
  await page.locator('.app-practice-button').click();
  if (view === 'linear') await page.locator('.app-view-toggle').click();
  await page.locator(`${viewSelector} .active-beat-prompt`).waitFor({ state: 'visible' });
  const activate = async (locator) => {
    if (interaction === 'keyboard') { await locator.focus(); await locator.press('Enter'); }
    else if (interaction === 'touch') await locator.tap();
    else await locator.click();
  };
  await activate(page.locator(`${viewSelector} .control-btn`));
  await activate(page.locator(`${viewSelector} .control-choice-btn >> nth=1`));
  return { context, page, viewSelector, activate };
}

async function capture(page, { height, profile, view, interaction, stage, denominator = null }) {
  const sample = await page.evaluate(({ viewName, profileName, stageName, targetDenominator }) => {
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: Math.round(r.left * 100) / 100, top: Math.round(r.top * 100) / 100, right: Math.round(r.right * 100) / 100, bottom: Math.round(r.bottom * 100) / 100, width: Math.round(r.width * 100) / 100, height: Math.round(r.height * 100) / 100 };
    };
    const visible = (el) => !!el && !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    const view = document.querySelector(`.app-${viewName}-view`);
    const active = view.querySelector('.active-beat-section');
    const controls = view.querySelector('.active-beat-controls');
    const prompt = active.querySelector('.active-beat-prompt');
    const response = controls.querySelector('input.control-numeric-input, .control-choice-fieldset');
    const help = controls.querySelector('.app-secondary-button');
    const cue = controls.querySelector('.active-denominator-help-cue');
    const headerPrompt = active.querySelector('.active-beat-header .active-beat-prompt');
    const questionText = prompt?.textContent?.trim() || '';
    const associatedLabel = prompt?.tagName === 'LABEL'
      ? prompt.htmlFor === response?.id
      : prompt?.tagName === 'LEGEND' && prompt.parentElement === response;
    const questions = [...active.querySelectorAll('.active-beat-prompt')].filter(visible);
    const docWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    return {
      profile: profileName,
      view: viewName,
      stage: stageName,
      targetDenominator,
      viewport: { width: innerWidth, height: innerHeight },
      question: rect(prompt),
      questionText,
      questionTag: prompt?.tagName || null,
      visibleTaskQuestionCount: questions.length,
      redundantHeaderQuestionVisible: visible(headerPrompt),
      questionAssociatedWithResponse: associatedLabel,
      response: rect(response),
      help: rect(help),
      cue: rect(cue),
      helpText: help?.textContent?.trim() || null,
      cueText: cue?.textContent?.trim() || null,
      recoveryText: controls.querySelector('.recovery-feedback')?.textContent?.trim() || null,
      selectedUnitSummary: view.querySelector('.selected-unit-help summary')?.textContent?.trim() || null,
      selectedUnitDetailsOpen: view.querySelector('.selected-unit-help')?.open || false,
      document: { width: docWidth, height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), horizontalOverflow: docWidth > innerWidth },
    };
  }, { viewName: view, profileName: profile, stageName: stage, targetDenominator: denominator });
  sample.interaction = interaction;
  sample.computedAccessibleRole = sample.questionTag === 'LEGEND' ? 'group' : 'spinbutton';
  const namedControl = page.getByRole(sample.computedAccessibleRole, { name: sample.questionText, exact: true });
  sample.computedAccessibleNameMatches = await namedControl.count() === 1;
  if (!sample.questionAssociatedWithResponse || sample.visibleTaskQuestionCount !== 1 || sample.redundantHeaderQuestionVisible) {
    throw new Error(`${profile}/${view}/${stage}: task question is duplicated or not associated with its response: ${JSON.stringify(sample)}`);
  }
  if (!sample.computedAccessibleNameMatches) {
    throw new Error(`${profile}/${view}/${stage}: ${sample.computedAccessibleRole} accessible name does not match the visible question "${sample.questionText}"`);
  }
  const suffix = denominator ? `-${denominator}` : '';
  const name = `plan24-${profile}-${view}-${stage}${suffix}-360x${height}.png`;
  await page.screenshot({ path: path.join(outputDir, name), animations: 'disabled' });
  sample.screenshot = name;
  records.push(sample);
}

async function selectDenominator(session, { profile, denominator }) {
  const { page, viewSelector } = session;
  if (profile === 'medium') {
    const input = page.locator(`${viewSelector} input.control-numeric-input`);
    await input.fill(String(denominator));
    await page.locator(`${viewSelector} .control-submit-btn`).click();
  } else {
    await page.locator(`${viewSelector} .control-choice-btn`).filter({ hasText: String(denominator) }).click();
  }
  await page.locator(`${viewSelector} .selected-unit-help`).waitFor({ state: 'attached' });
  await page.locator(`${viewSelector} .active-beat-section .active-beat-prompt`).waitFor({ state: 'visible' });
}

try {
  for (const height of [740, 752]) {
    for (const profile of ['high', 'medium']) {
      for (const view of ['visual', 'linear']) {
        const interaction = profile === 'high' && view === 'visual' ? 'keyboard' : profile === 'medium' && view === 'linear' ? 'touch' : 'click';
        const decision = await openAtDecide({ height, profile, view, interaction });
        const { page, viewSelector, activate } = decision;
        const helpButton = page.locator(`${viewSelector} .active-beat-controls .app-secondary-button`);
        await capture(page, { height, profile, view, interaction, stage: 'help-closed' });
        if (profile === 'medium') {
          const input = page.locator(`${viewSelector} input.control-numeric-input`);
          await input.fill('8');
          await input.focus();
        }
        await activate(helpButton);
        await page.locator(`${viewSelector} .active-denominator-help-cue`).waitFor({ state: 'visible' });
        if (profile === 'medium') {
          const sourceInput = page.locator(`${viewSelector} input.control-numeric-input`);
          await sourceInput.focus();
          await page.locator('.app-view-toggle').click();
          const otherView = view === 'visual' ? 'linear' : 'visual';
          const transferredInput = page.locator(`.app-${otherView}-view input.control-numeric-input`);
          if (await transferredInput.inputValue() !== '8' || !await transferredInput.evaluate((el) => el === document.activeElement)) {
            throw new Error(`${profile}/${view}: draft or focus did not transfer to ${otherView} view`);
          }
          await page.locator('.app-view-toggle').click();
          if (!await sourceInput.evaluate((el) => el === document.activeElement)) throw new Error(`${profile}/${view}: focus did not return to response`);
        }
        await capture(page, { height, profile, view, interaction, stage: 'help-open' });
        await activate(helpButton);
        if (profile === 'medium') {
          const input = page.locator(`${viewSelector} input.control-numeric-input`);
          if (await input.inputValue() !== '8') throw new Error(`${profile}/${view}: denominator draft was not retained after closing help`);
          await input.press('Enter');
          await page.locator(`${viewSelector} .recovery-feedback`).waitFor({ state: 'visible' });
          const feedback = await page.locator(`${viewSelector} .recovery-feedback`).textContent();
          if (feedback !== '8 is a multiple of 4, but not 3. Try another number.') throw new Error(`Unexpected one-sided recovery: ${feedback}`);
          await capture(page, { height, profile, view, interaction, stage: 'one-sided-recovery' });
        }
        await decision.context.close();

        for (const denominator of [12, 24]) {
          const transform = await openAtDecide({ height, profile, view, interaction });
          const taskHelp = transform.page.locator(`${transform.viewSelector} .active-beat-controls .app-secondary-button`);
          await transform.activate(taskHelp);
          await transform.page.locator(`${transform.viewSelector} .active-denominator-help-cue`).waitFor({ state: 'visible' });
          await transform.activate(taskHelp);
          await selectDenominator(transform, { profile, denominator });
          const viewNode = transform.page.locator(transform.viewSelector);
          const explanation = await viewNode.locator('.selected-unit-help').textContent();
          if (!explanation.includes(`${denominator} is`)) throw new Error(`Missing ${denominator} selected-unit explanation: ${explanation}`);
          const transformPrompt = (await viewNode.locator('.active-beat-section .active-beat-prompt').textContent()).trim();
          if (!transformPrompt.includes(`out of ${denominator} make the same amount as 2/3?`)) throw new Error(`Unexpected transform question: ${transformPrompt}`);
          await capture(transform.page, { height, profile, view, interaction, stage: 'transform', denominator });
          await viewNode.locator('.selected-unit-help summary').click();
          await capture(transform.page, { height, profile, view, interaction, stage: 'selected-unit', denominator });
          await transform.context.close();
        }
      }
    }
  }
} finally {
  await browser.close();
  server.close();
}

const evidence = {
  captureDate: new Date().toISOString().slice(0, 10),
  browser: { engine: 'Chromium via Playwright', channel: options.channel || 'bundled Chromium' },
  limitations: [
    'Touch checks use Playwright tap events in a touch-enabled browser context; no physical device or native on-screen keyboard was used.',
    'Keyboard checks use a focused mounted help control with Enter; no assistive technology was tested.',
    'These are static rendered-state checks and do not measure learner understanding or independent discovery.',
  ],
  observations: records,
};
await fs.writeFile(path.join(outputDir, 'measurements.json'), `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({ outputDir, observations: records.length, screenshots: records.map((record) => record.screenshot) }, null, 2));
