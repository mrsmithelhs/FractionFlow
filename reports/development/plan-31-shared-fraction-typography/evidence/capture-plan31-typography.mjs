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
const sequenceWitnesses = [];
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

async function readTrackForms(page) {
  return page.locator('.app-visual-view .fraction-bar-container').evaluateAll((containers) => (
    containers.map((container) => {
      const track = container.querySelector('.fraction-bar-track');
      return {
        side: container.getAttribute('data-side'),
        numerator: track?.getAttribute('data-numerator') || '',
        denominator: track?.getAttribute('data-denominator') || '',
      };
    })
  ));
}

async function reachSecondItemThroughNext(page, firstItemSourceForms) {
  const precedingForms = await readTrackForms(page);
  const expectedPreceding = [
    { side: 'left', numerator: '8', denominator: '12' },
    { side: 'right', numerator: '3', denominator: '12' },
  ];
  if (JSON.stringify(precedingForms) !== JSON.stringify(expectedPreceding)) {
    throw new Error(`Unexpected preceding item before Next: ${JSON.stringify(precedingForms)}`);
  }

  const nextSelector = '.app-next-button:not([hidden])';
  if (await page.locator(nextSelector).count() !== 0) {
    throw new Error('Next appeared before the first item reflection was completed.');
  }
  await page.locator('.app-linear-view .linear-matching-choice-btn').first().click();
  const next = page.locator(nextSelector);
  await next.waitFor({ state: 'visible' });
  await next.press('Enter');
  await page.waitForFunction(() => {
    const tracks = [...document.querySelectorAll('.app-visual-view .fraction-bar-container')];
    const forms = tracks.map((container) => {
      const track = container.querySelector('.fraction-bar-track');
      return [track?.getAttribute('data-numerator'), track?.getAttribute('data-denominator')];
    });
    return forms.length === 2
      && forms[0][0] === '1' && forms[0][1] === '2'
      && forms[1][0] === '1' && forms[1][1] === '3';
  });
  const sourceForms = await readTrackForms(page);
  const focusRestoredToEpisode = await page.evaluate(() => (
    document.activeElement?.matches('main.app-episode') === true
  ));
  if (!focusRestoredToEpisode) {
    throw new Error('Next did not restore focus to the new episode.');
  }
  return {
    sequencePosition: 2,
    reachedBy: 'mounted Next button activated with Enter after first reflection completion',
    firstItemSourceForms,
    precedingForms,
    nextAbsentBeforeReflectionCompletion: true,
    nextVisibleAfterReflectionCompletion: true,
    focusRestoredToEpisode,
    sourceForms,
  };
}

async function enterSecondItemPath(page, denominator) {
  await page.locator('.app-view-toggle').click();
  await page.locator('.app-visual-view .control-btn').waitFor({ state: 'visible' });
  await page.locator('.app-visual-view .control-btn').click();
  await page.locator('.app-visual-view .control-choice-btn').nth(1).click();
  await page.locator('.app-visual-view .control-choice-btn')
    .filter({ hasText: String(denominator) }).first().click();
  const forms = denominator === 6
    ? { left: '3', right: '2', result: '5' }
    : { left: '6', right: '4', result: '10' };
  for (const [side, value] of [['left', forms.left], ['right', forms.right]]) {
    await page.locator(`.app-visual-view #transform-num-input-${side}`).waitFor({ state: 'visible' });
    await page.locator(`.app-visual-view #transform-num-input-${side}`).fill(value);
    await page.locator('.app-visual-view .control-submit-btn').click();
  }
  await page.locator('.app-visual-view #operate-sum-input').waitFor({ state: 'visible' });
  return forms;
}

async function submitLeftConversion(page, denominator) {
  const value = denominator === 12 ? '8' : '16';
  await page.locator('.app-visual-view #transform-num-input-left').fill(value);
  await page.locator('.app-visual-view .control-submit-btn').click();
  await page.locator('.app-visual-view #transform-num-input-right').waitFor({ state: 'visible' });
}

async function inspectAndCapture(page, { scenario, denominator, viewport, stage, ordinary, item, interaction }) {
  const measurement = await page.evaluate(({ scenarioId, targetDenominator, viewportId, stageName, ordinaryPath, zoom }) => {
    const rect = (element) => {
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return Object.fromEntries(['x', 'y', 'width', 'height', 'left', 'right', 'top', 'bottom']
        .map((key) => [key, Math.round(box[key] * 100) / 100]));
    };
    const readouts = [...document.querySelectorAll('.fraction-bar-readout')];
    const trackForms = [...document.querySelectorAll('.app-visual-view .fraction-bar-container')]
      .map((container) => {
        const track = container.querySelector('.fraction-bar-track');
        return {
          side: container.getAttribute('data-side'),
          numerator: track?.getAttribute('data-numerator') || '',
          denominator: track?.getAttribute('data-denominator') || '',
        };
      });
    const fractions = readouts.map((readout, index) => {
      const notation = readout.querySelector('.symbolic-fraction-compact');
      const numerator = notation?.querySelector('.symbolic-numerator');
      const denominator = notation?.querySelector('.symbolic-denominator');
      const divider = notation?.querySelector('.symbolic-bar');
      return {
        index,
        side: readout.closest('.fraction-bar-container')?.getAttribute('data-side') || '',
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
      trackForms,
      readouts: fractions,
      widerHostProbe: wideMeasurement,
      question: {
        visible: !!prompt && !!prompt.getClientRects().length,
        ariaHiddenVisual: prompt?.getAttribute('aria-hidden') === 'true',
        textSerialization: prompt?.textContent || '',
        notation: rect(prompt?.querySelector('.symbolic-fraction-compact')),
        form: prompt?.querySelector('.symbolic-fraction-compact') ? {
          numerator: prompt.querySelector('.symbolic-numerator')?.textContent || '',
          denominator: prompt.querySelector('.symbolic-denominator')?.textContent || '',
        } : null,
        legend: fieldset?.querySelector('.control-legend')?.textContent || '',
      },
      choices: choices.map((button) => ({
        name: button.getAttribute('aria-label'),
        box: rect(button),
        notation: rect(button.querySelector('.symbolic-fraction-compact')),
        form: button.querySelector('.symbolic-fraction-compact') ? {
          numerator: button.querySelector('.symbolic-numerator')?.textContent || '',
          denominator: button.querySelector('.symbolic-denominator')?.textContent || '',
        } : null,
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
  if (item) measurement.item = item;
  if (interaction) measurement.interaction = interaction;

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
  if (item && stage === 'bar-transform') {
    const displayedReadouts = visibleReadouts.map(({ side, numerator, denominator }) => ({
      side,
      numerator,
      denominator,
    }));
    if (JSON.stringify(measurement.trackForms) !== JSON.stringify(item.expectedEquivalentForms)
      || JSON.stringify(displayedReadouts) !== JSON.stringify(item.expectedEquivalentForms)) {
      throw new Error(`Second-item displayed/tracked forms differ from the accepted path: ${JSON.stringify(measurement)}`);
    }
  }
  if (item && stage === 'linear-reflection') {
    const source = item.sourceForms[0];
    const expectedLegend = `Choose the fraction that shows the same amount as ${source.numerator} over ${source.denominator}.`;
    const choiceNamesAgreeWithForms = measurement.choices.every((choice) => {
      const match = /^Fraction (\d+) over (\d+) shows a shaded amount$/.exec(choice.name || '');
      return match
        && match[1] === choice.form?.numerator
        && match[2] === choice.form?.denominator;
    });
    if (measurement.question.form?.numerator !== source.numerator
      || measurement.question.form?.denominator !== source.denominator
      || measurement.question.legend !== expectedLegend
      || measurement.choices.some((choice) => choice.form?.denominator !== String(denominator))
      || !choiceNamesAgreeWithForms) {
      throw new Error(`Second-item matching forms/names do not match the source/path: ${JSON.stringify(measurement)}`);
    }
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

  for (const denominator of [6, 12]) {
    for (const viewport of [viewports[0], viewports[2]]) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 1,
        reducedMotion: 'reduce',
      });
      const page = await context.newPage();
      await startTransform(page, { conditionId: 'phase2-bundle-1', denominator: 12 });
      const firstItemSourceForms = await readTrackForms(page);
      const expectedFirstItemSourceForms = [
        { side: 'left', numerator: '2', denominator: '3' },
        { side: 'right', numerator: '1', denominator: '4' },
      ];
      if (JSON.stringify(firstItemSourceForms) !== JSON.stringify(expectedFirstItemSourceForms)) {
        throw new Error(`Unexpected first item source forms: ${JSON.stringify(firstItemSourceForms)}`);
      }
      await submitLeftConversion(page, 12);
      await completeToReflection(page, 12);
      const transition = await reachSecondItemThroughNext(page, firstItemSourceForms);
      sequenceWitnesses.push({ viewport: viewport.id, ...transition });

      const forms = await enterSecondItemPath(page, denominator);
      const item = {
        identity: 'Plan 26 accepted second item reached through completion-gated Next',
        sequencePosition: transition.sequencePosition,
        reachedBy: transition.reachedBy,
        sourceForms: transition.sourceForms,
        selectedCommonDenominator: String(denominator),
        expectedEquivalentForms: [
          { side: 'left', numerator: forms.left, denominator: String(denominator) },
          { side: 'right', numerator: forms.right, denominator: String(denominator) },
        ],
      };
      const scenario = `second-item-unit-${denominator}`;
      await inspectAndCapture(page, {
        scenario,
        denominator,
        viewport,
        stage: 'bar-transform',
        ordinary: false,
        item,
      });

      await page.locator('.app-visual-view #operate-sum-input').fill(forms.result);
      await page.locator('.app-visual-view .control-submit-btn').click();
      await page.locator('.app-visual-view .control-btn').click();
      await page.locator('.app-view-toggle').click();
      await page.locator('.app-linear-view .linear-matching-choice-btn')
        .first().waitFor({ state: 'visible' });
      await inspectAndCapture(page, {
        scenario,
        denominator,
        viewport,
        stage: 'linear-reflection',
        ordinary: false,
        item,
      });

      if (denominator === 12 && viewport.id === '360x740') {
        const keyboardChoice = page.locator('.app-linear-view .linear-matching-choice-btn').last();
        const keyboardName = await keyboardChoice.getAttribute('aria-label');
        const originalKeyboardButton = await keyboardChoice.elementHandle();
        await originalKeyboardButton.focus();
        await originalKeyboardButton.press('Enter');
        await page.locator('.app-linear-view .recovery-feedback').waitFor({ state: 'visible' });
        const originalNodeConnected = await originalKeyboardButton.evaluate((button) => button.isConnected);
        const focusAfterResponse = await page.evaluate(() => {
          const active = document.activeElement;
          return {
            tagName: active?.tagName || null,
            className: typeof active?.className === 'string' ? active.className : '',
            ariaLabel: active?.getAttribute?.('aria-label') || null,
          };
        });
        const recoveryVisible = await page.locator('.app-linear-view .recovery-feedback').isVisible();
        if (!recoveryVisible) {
          throw new Error('Second-item keyboard choice did not show recovery feedback after Enter.');
        }
        await inspectAndCapture(page, {
          scenario,
          denominator,
          viewport,
          stage: 'linear-keyboard-feedback',
          ordinary: false,
          item,
          interaction: {
            method: 'Enter',
            choiceName: keyboardName,
            originalNodeConnected,
            focusAfterResponse,
            recoveryVisible,
          },
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
  sequenceWitnesses,
};
await fs.writeFile(path.join(evidenceDir, 'measurements.json'), `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({ evidenceDir, captures: captures.length, screenshots: captures.map((item) => item.screenshot) }, null, 2));
