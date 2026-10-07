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
const round = (n) => Math.round(n * 100) / 100;
try {
  for (const height of [740, 752]) {
    for (const profile of ['high', 'medium']) {
      for (const view of ['visual', 'linear']) {
        const interaction = profile === 'high' && view === 'visual' ? 'keyboard' : profile === 'medium' && view === 'linear' ? 'touch' : 'click';
        const context = await browser.newContext({ viewport: { width: 360, height }, hasTouch: interaction === 'touch', deviceScaleFactor: 1, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const v = `.app-${view}-view`;
        const activate = async (locator) => {
          if (interaction === 'keyboard') { await locator.focus(); await locator.press('Enter'); }
          else if (interaction === 'touch') await locator.tap();
          else await locator.click();
        };
        await page.goto(baseUrl);
        if (profile === 'medium') {
          await page.locator('.app-gear-button').click();
          await page.locator('[data-support-id="medium-support"]').click();
        }
        await page.locator('.app-practice-button').click();
        if (view === 'linear') await page.locator('.app-view-toggle').click();
        await page.locator(`${v} .active-beat-prompt`).waitFor({ state: 'visible' });
        await activate(page.locator(`${v} .control-btn`));
        await activate(page.locator(`${v} .control-choice-btn >> nth=1`));
        const input = page.locator(`${v} input.control-numeric-input`);
        const initialDenominator = profile === 'medium' ? '8' : null;
        if (initialDenominator) { await input.fill(initialDenominator); await input.focus(); }
        const helpButton = page.locator(`${v} .active-beat-controls .app-secondary-button`);
        await activate(helpButton);
        await page.locator(`${v} .active-denominator-help-cue`).waitFor({ state: 'visible' });
        if (profile === 'medium') {
          await input.focus();
          await page.locator('.app-view-toggle').click();
          const otherView = view === 'visual' ? 'linear' : 'visual';
          const transferredInput = page.locator(`.app-${otherView}-view input.control-numeric-input`);
          if (await transferredInput.inputValue() !== '8'
            || !await transferredInput.evaluate((element) => element === document.activeElement)) {
            throw new Error(`${profile}/${view}: draft or focus did not transfer to ${otherView} view`);
          }
          await page.locator('.app-view-toggle').click();
          if (!await input.evaluate((element) => element === document.activeElement)) {
            throw new Error(`${profile}/${view}: focus did not return to ${view} response`);
          }
        }
        const capture = async (stage) => {
          const sample = await page.evaluate(({ viewName, profileName, stageName }) => {
            const rect = (el) => {
              if (!el) return null;
              const r = el.getBoundingClientRect();
              return { left: Math.round(r.left * 100) / 100, top: Math.round(r.top * 100) / 100, right: Math.round(r.right * 100) / 100, bottom: Math.round(r.bottom * 100) / 100, width: Math.round(r.width * 100) / 100, height: Math.round(r.height * 100) / 100 };
            };
            const view = document.querySelector(`.app-${viewName}-view`);
            const active = view.querySelector('.active-beat-section');
            const controls = view.querySelector('.active-beat-controls');
            const question = active.querySelector('.active-beat-prompt');
            const response = controls.querySelector('input.control-numeric-input, .control-choice-fieldset');
            const help = controls.querySelector('.app-secondary-button');
            const cue = controls.querySelector('.active-denominator-help-cue');
            return { profile: profileName, view: viewName, stage: stageName, viewport: { width: innerWidth, height: innerHeight }, question: rect(question), response: rect(response), help: rect(help), cue: rect(cue), helpText: help?.textContent, cueText: cue?.textContent, document: { width: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth), height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > innerWidth } };
          }, { viewName: view, profileName: profile, stageName: stage });
          sample.interaction = interaction;
          const name = `plan24-${profile}-${view}-${stage}-360x${height}.png`;
          await page.screenshot({ path: path.join(outputDir, name), animations: 'disabled' });
          sample.screenshot = name;
          records.push(sample);
        };
        await capture('help-open');
        await activate(helpButton);
        if (profile === 'medium') {
          const currentInput = page.locator(`${v} input.control-numeric-input`);
          if (await currentInput.inputValue() !== '8') throw new Error(`${profile}/${view}: denominator draft was not retained after close`);
          await currentInput.fill('8');
          await currentInput.press('Enter');
          await page.locator(`${v} .recovery-feedback`).waitFor({ state: 'visible' });
          const feedback = await page.locator(`${v} .recovery-feedback`).textContent();
          if (feedback !== '8 is a multiple of 4, but not 3. Try another number.') throw new Error(`Unexpected one-sided recovery: ${feedback}`);
          await capture('one-sided-recovery');
          await page.locator(`${v} input.control-numeric-input`).fill('24');
          await page.locator(`${v} .control-submit-btn`).click();
        } else {
          const selected = page.locator(`${v} .control-choice-btn >> nth=1`);
          await activate(selected);
        }
        await page.locator(`${v} .selected-unit-help`).waitFor({ state: 'attached' });
        await capture('selected-unit');
        const explanation = await page.locator(`${v} .selected-unit-help`).textContent();
        if (!explanation.includes(profile === 'medium' ? '24 is 8 groups of 3 and 6 groups of 4' : '24 is 8 groups of 3 and 6 groups of 4')) throw new Error(`Missing selected-unit explanation: ${explanation}`);
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
  server.close();
}
const evidence = { captureDate: new Date().toISOString().slice(0, 10), browser: { engine: 'Chromium via Playwright', channel: options.channel || 'bundled Chromium' }, limitations: ['Touch checks use Playwright tap events in a touch-enabled browser context; no physical device or native on-screen keyboard was used.', 'Keyboard checks use a focused mounted help control with Enter; no assistive technology was tested.', 'These are static rendered-state checks and do not measure learner understanding or independent discovery.'], observations: records };
await fs.writeFile(path.join(outputDir, 'measurements.json'), `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({ outputDir, observations: records.length, screenshots: records.map((r) => r.screenshot) }, null, 2));
