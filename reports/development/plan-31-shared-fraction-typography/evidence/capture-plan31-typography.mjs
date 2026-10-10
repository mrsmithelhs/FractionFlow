import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('../../../../scripts/dev/run-route-matrix.js');
const evidenceDir = path.resolve('reports/development/plan-31-shared-fraction-typography/evidence');
await fs.mkdir(evidenceDir, { recursive: true });

const server = createStaticServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}/FractionFlow/`;
const options = { headless: true, channel: 'msedge' };
const browser = await chromium.launch(options);
const captures = [];
const viewports = [
  { id: '360x740', width: 360, height: 740, zoomEquivalent: false },
  { id: '360x752', width: 360, height: 752, zoomEquivalent: false },
  { id: '1366x768', width: 1366, height: 768, zoomEquivalent: false },
  { id: '180x370-200pct-equivalent', width: 180, height: 370, zoomEquivalent: true },
];

async function startTransform(page, { conditionId, denominator }) {
  await page.goto(baseUrl);
  if (conditionId !== 'phase2-bundle-1') {
    await page.locator('.app-gear-button').click();
    await page.locator(`[data-condition-id="${conditionId}"]`).click();
  }
  await page.locator('.app-practice-button').click();
  await page.locator('.app-visual-view .control-btn').click();
  await page.locator('.app-visual-view .control-choice-btn').nth(1).click();
  await page.locator('.app-visual-view .control-choice-btn')
    .filter({ hasText: String(denominator) }).first().click();
  await page.locator('.app-visual-view #transform-num-input-left').waitFor({ state: 'visible' });
}

async function completeToReflection(page, denominator) {
  const numerators = denominator === 12 ? ['8', '3', '11'] : ['16', '6', '22'];
  for (const [side, value] of [['right', numerators[1]]]) {
    await page.locator(`.app-visual-view #transform-num-input-${side}`).fill(value);
    await page.locator('.app-visual-view .control-submit-btn').click();
  }
  await page.locator('.app-visual-view #operate-sum-input').fill(numerators[2]);
  await page.locator('.app-visual-view .control-submit-btn').click();
  await page.locator('.app-visual-view .control-btn').click();
  await page.locator('.app-view-toggle').click();
  await page.locator('.app-linear-view .linear-matching-choice-btn').first()
    .waitFor({ state: 'visible' });
}

async function submitLeftConversion(page, denominator) {
  const value = denominator === 12 ? '8' : '16';
  await page.locator('.app-visual-view #transform-num-input-left').fill(value);
  await page.locator('.app-visual-view .control-submit-btn').click();
  await page.locator('.app-visual-view #transform-num-input-right').waitFor({ state: 'visible' });
}

async function inspectAndCapture(page, { scenario, denominator, viewport, stage, ordinary }) {
  const measurement = await page.evaluate(({ scenarioId, targetDenominator, viewportId, stageName, ordinaryPath, zoom }) => {
    const rect = (element) => {
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return Object.fromEntries(['x', 'y', 'width', 'height', 'left', 'right', 'top', 'bottom']
        .map((key) => [key, Math.round(box[key] * 100) / 100]));
    };
    const readouts = [...document.querySelectorAll('.fraction-bar-readout')];
    const fractions = readouts.map((readout, index) => {
      const notation = readout.querySelector('.symbolic-fraction-compact');
      const numerator = notation?.querySelector('.symbolic-numerator');
      const denominator = notation?.querySelector('.symbolic-denominator');
      const divider = notation?.querySelector('.symbolic-bar');
      return {
        index,
        numerator: numerator?.textContent || '',
        denominator: denominator?.textContent || '',
        lane: rect(readout),
        notation: rect(notation),
        numeratorBox: rect(numerator),
        denominatorBox: rect(denominator),
        divider: rect(divider),
        visible: !!readout.getClientRects().length,
        ariaHidden: readout.getAttribute('aria-hidden') === 'true'
          && notation?.getAttribute('aria-hidden') === 'true',
      };
    });
    const wideHost = document.createElement('div');
    wideHost.style.cssText = 'position:fixed;left:-10000px;top:0;width:320px;height:auto;';
    const wideReadout = readouts[0]?.cloneNode(true);
    if (wideReadout) {
      wideReadout.style.width = '320px';
      wideReadout.style.minWidth = '320px';
      wideHost.appendChild(wideReadout);
      document.body.appendChild(wideHost);
    }
    const wideNotation = wideReadout?.querySelector('.symbolic-fraction-compact');
    const wideDivider = wideNotation?.querySelector('.symbolic-bar');
    const wideMeasurement = {
      host: rect(wideReadout),
      notation: rect(wideNotation),
      divider: rect(wideDivider),
    };
    wideHost.remove();

    const linearView = document.querySelector('.app-linear-view');
    const prompt = linearView?.querySelector('.active-beat-prompt');
    const fieldset = linearView?.querySelector('.control-choice-fieldset');
    const choices = [...(linearView?.querySelectorAll('.linear-matching-choice-btn') || [])];
    const documentWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    return {
      scenario: scenarioId,
      denominator: targetDenominator,
      viewport: { id: viewportId, width: innerWidth, height: innerHeight, zoomEquivalent: zoom },
      layout: {
        documentWidth,
        documentHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
        horizontalOverflow: documentWidth > innerWidth,
      },
      ordinaryReadoutConstructor: ordinaryPath,
      readouts: fractions,
      widerHostProbe: wideMeasurement,
      question: {
        visible: !!prompt && !!prompt.getClientRects().length,
        ariaHiddenVisual: prompt?.getAttribute('aria-hidden') === 'true',
        textSerialization: prompt?.textContent || '',
        notation: rect(prompt?.querySelector('.symbolic-fraction-compact')),
        legend: fieldset?.querySelector('.control-legend')?.textContent || '',
      },
      choices: choices.map((button) => ({
        name: button.getAttribute('aria-label'),
        box: rect(button),
        notation: rect(button.querySelector('.symbolic-fraction-compact')),
        notationHidden: button.querySelector('.symbolic-fraction-compact')
          ?.getAttribute('aria-hidden') === 'true',
      })),
    };
  }, {
    scenarioId: scenario,
    targetDenominator: denominator,
    viewportId: viewport.id,
    stageName: stage,
    ordinaryPath: ordinary,
    zoom: viewport.zoomEquivalent,
  });

  const visibleReadouts = measurement.readouts.filter((entry) => entry.visible);
  if ((stage === 'bar-transform'
      && (visibleReadouts.length < 2
        || visibleReadouts.some((entry) => !entry.notation || !entry.divider)
        || visibleReadouts.some((entry) => Math.abs(entry.divider.width - entry.notation.width) > 1)))
    || Math.abs(measurement.widerHostProbe.divider.width
      - measurement.widerHostProbe.notation.width) > 1
    || measurement.widerHostProbe.notation.width >= measurement.widerHostProbe.host.width
    || measurement.layout.horizontalOverflow) {
    throw new Error(`Typography geometry/wrap check failed: ${JSON.stringify(measurement)}`);
  }
  if (stage === 'linear-reflection'
    && (!measurement.question.visible
      || !measurement.question.ariaHiddenVisual
      || !measurement.question.legend.includes('over')
      || measurement.choices.length !== 3
      || measurement.choices.some((choice) => !choice.name?.includes('over')
        || !choice.notationHidden))) {
    throw new Error(`Structured question/button name check failed: ${JSON.stringify(measurement)}`);
  }
  if (stage === 'linear-reflection') {
    const groupCount = await page.getByRole('group', { name: measurement.question.legend, exact: true }).count();
    const choiceNames = measurement.choices.map((choice) => choice.name);
    const choiceCounts = await Promise.all(choiceNames.map((name) => (
      page.getByRole('button', { name, exact: true }).count()
    )));
    if (groupCount !== 1 || choiceCounts.some((count) => count !== 1)) {
      throw new Error(`Question/choice accessible names are not unique: ${JSON.stringify({ groupCount, choiceCounts, choiceNames })}`);
    }
  }
  const file = `${scenario}-${stage}-${viewport.id}.png`;
  await page.screenshot({ path: path.join(evidenceDir, file), fullPage: true, animations: 'disabled' });
  measurement.screenshot = file;
  captures.push(measurement);
}

try {
  for (const denominator of [12, 24]) {
    for (const viewport of viewports) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      await startTransform(page, { conditionId: 'phase2-bundle-1', denominator });
      await submitLeftConversion(page, denominator);
      await inspectAndCapture(page, {
        scenario: `persistent-${denominator}-reduced`,
        denominator,
        viewport,
        stage: 'bar-transform',
        ordinary: false,
      });
      await completeToReflection(page, denominator);
      await inspectAndCapture(page, {
        scenario: `persistent-${denominator}-reduced`,
        denominator,
        viewport,
        stage: 'linear-reflection',
        ordinary: false,
      });
      if (viewport.id === '360x740' && denominator === 12) {
        const keyboardChoice = page.locator('.app-linear-view .linear-matching-choice-btn').nth(1);
        await keyboardChoice.focus();
        await keyboardChoice.press('Enter');
        await page.locator('.app-linear-view .recovery-feedback').waitFor({ state: 'visible' });
        if (!await keyboardChoice.evaluate((button) => button.isConnected)) {
          throw new Error('Keyboard matching choice did not remain connected after response.');
        }
        await inspectAndCapture(page, {
          scenario: `persistent-${denominator}-reduced-keyboard`,
          denominator,
          viewport,
          stage: 'linear-keyboard-feedback',
          ordinary: false,
        });
      }
      await context.close();
    }
  }

  for (const viewport of [viewports[0], viewports[2]]) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      reducedMotion: 'no-preference',
    });
    const page = await context.newPage();
    await startTransform(page, { conditionId: 'phase2-bundle-2', denominator: 12 });
    await submitLeftConversion(page, 12);
    await inspectAndCapture(page, {
      scenario: 'ordinary-juxtaposed-12-standard',
      denominator: 12,
      viewport,
      stage: 'bar-transform',
      ordinary: true,
    });
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

const evidence = {
  purpose: 'Plan 31 rendered typography, intrinsic sizing, wrapping, accessible-name, reduced-motion, and keyboard evidence.',
  captureDate: new Date().toISOString().slice(0, 10),
  browser: { engine: 'Chromium via Playwright', channel: options.channel || 'bundled Chromium' },
  viewportMethod: 'CSS-pixel viewports at 360x740, 360x752, and 1366x768. The 180x370 viewport approximates the effective CSS viewport at 200% zoom over 360x740; browser zoom UI itself is not driven.',
  limitations: [
    'Keyboard evidence uses browser focus and Enter on a mounted native button; no assistive technology was tested.',
    'Reduced motion is selected in the browser context; physical Chromebook, native browser zoom UI, and physical touch hardware were not tested.',
  ],
  captures,
};
await fs.writeFile(path.join(evidenceDir, 'measurements.json'), `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({ evidenceDir, captures: captures.length, screenshots: captures.map((item) => item.screenshot) }, null, 2));
