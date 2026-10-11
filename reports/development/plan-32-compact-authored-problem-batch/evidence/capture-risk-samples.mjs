import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';
import { chromium } from 'playwright';
import { PRACTICE_TYPES } from '../../../../src/app/practice-types.js';
import { resolveAuthoredContent, resolveCuratedFixture } from '../../../../src/content/authored-content-catalog.js';
import { buildCuratedProblem } from '../../../../src/content/generator.js';
import { addFractions, convertToDenominator, equalFractions, scaleFactorForDenominator } from '../../../../src/math/index.js';
import { wireToForm } from '../../../../src/content/schema.js';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('../../../../scripts/dev/run-route-matrix.js');
const evidenceDir = path.dirname(fileURLToPath(import.meta.url));
const practiceType = PRACTICE_TYPES.find((entry) => entry.id === 'sum-under-one');
const samples = [
  {
    id: 'high-visual-10-false-premise', itemId: 'one-half-plus-one-fifth', target: '10',
    support: 'high-support', view: 'visual', motion: 'no-preference', modality: 'pointer',
    denominatorHelp: true, transformHelp: true, wrongTransformRecovery: true, replay: true,
  },
  {
    id: 'medium-linear-20-true-premise', itemId: 'one-half-plus-one-fifth', target: '20',
    support: 'medium-support', view: 'linear', motion: 'reduce', modality: 'keyboard',
    selectedUnitHelp: true, dirtyRetry: true, wrongTransformRecovery: true,
  },
  {
    id: 'touch-visual-30-operand-order-scale-10', itemId: 'three-fifths-plus-one-third', target: '30',
    support: 'high-support', view: 'visual', motion: 'no-preference', modality: 'touch',
  },
  {
    id: 'high-visual-15-operand-order', itemId: 'three-fifths-plus-one-third', target: '15',
    support: 'high-support', view: 'visual', motion: 'no-preference', modality: 'pointer',
  },
];

function mathFor(item) {
  const fixture = resolveCuratedFixture(item.fixtureId, item.authoringRevision);
  const instance = buildCuratedProblem({
    fixture,
    selector: fixture.selector,
    overlays: fixture.overlays,
    profileId: fixture.profileId,
    candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: fixture.reviewedTransitions ?? [] },
  });
  const left = wireToForm(instance.operands.left.initialForm);
  const right = wireToForm(instance.operands.right.initialForm);
  return { fixture, instance, left, right };
}

function viewSelector(view) {
  return view === 'linear' ? '.app-linear-view' : '.app-visual-view';
}

async function activate(page, locator, modality = 'pointer') {
  await locator.waitFor({ state: 'visible' });
  if (modality === 'keyboard') {
    await tabTo(page, locator);
    await page.keyboard.press('Enter');
    return;
  }
  if (modality === 'touch') {
    const box = await locator.boundingBox();
    if (!box) throw new Error('Cannot tap a control without visible geometry');
    await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
    return;
  }
  await locator.click();
}

async function tabTo(page, locator) {
  for (let count = 0; count <= 60; count += 1) {
    if (await locator.evaluate((node) => node === document.activeElement)) return count;
    if (count === 60) break;
    await page.keyboard.press('Tab');
  }
  throw new Error(`Keyboard Tab could not reach ${await locator.evaluate((node) => node.outerHTML)}`);
}

async function enter(page, locator, value, modality = 'pointer') {
  await locator.waitFor({ state: 'visible' });
  if (modality === 'keyboard') {
    await tabTo(page, locator);
    await page.keyboard.press('Control+A');
    await page.keyboard.type(String(value));
  } else {
    await locator.fill(String(value));
  }
}

async function submitResponse(page, sample, view) {
  if (sample.modality === 'keyboard') {
    await page.keyboard.press('Enter');
  } else {
    await activate(page, page.locator(`${viewSelector(view)} .control-submit-btn`), sample.modality);
  }
}

function renderedFractionSelector(view, beat, side) {
  const prefix = view === 'linear' ? 'linear-' : '';
  return `${viewSelector(view)} #${prefix}${beat}-num-input-${side}`;
}

async function chooseTarget(page, sample, view, target) {
  const surface = viewSelector(view);
  if (sample.support === 'high-support') {
    await activate(page, page.getByRole('button', { name: `Common denominator ${target}` }), sample.modality);
    return;
  }
  const prefix = view === 'linear' ? 'linear-' : '';
  const denominatorInput = page.locator(`${surface} #${prefix}decide-common-denominator-input`);
  await enter(page, denominatorInput, target, sample.modality);
  await submitResponse(page, sample, view);
}

async function openLocalHelp(page, view, expectedSelector) {
  const surface = viewSelector(view);
  const control = page.locator(`${surface} .active-beat-controls .app-secondary-button`);
  await activate(page, control);
  await page.locator(expectedSelector).waitFor({ state: 'visible' });
  const text = await page.locator(expectedSelector).innerText();
  await activate(page, control);
  return text;
}

async function submitConversion(page, sample, view, side, form, { wrongOnce = false, recordFocus = false } = {}) {
  const surface = viewSelector(view);
  const input = page.locator(renderedFractionSelector(view, 'transform', side));
  const oldInput = wrongOnce ? await input.elementHandle() : null;
  if (wrongOnce) {
    const correctText = `${form.numerator}/${form.denominator}`;
    const preResponseText = await page.locator(surface).innerText();
    if (preResponseText.includes(correctText)) {
      throw new Error(`Correct converted form ${correctText} was exposed before response at ${sample.id}`);
    }
    const wrong = form.numerator + 1n;
    await enter(page, input, wrong, sample.modality);
    await submitResponse(page, sample, view);
    const feedback = page.locator(`${surface} .recovery-feedback`);
    await feedback.waitFor({ state: 'visible' });
    if (!(await feedback.innerText()).trim()) throw new Error(`Missing recovery copy at ${sample.id}`);
    sample.recoveryFeedback = await feedback.innerText();
    sample.inputNodeReplaced = !(await oldInput.evaluate((node) => node.isConnected));
    sample.recoveryFocus = await page.evaluate(() => ({
      tagName: document.activeElement?.tagName ?? null,
      className: document.activeElement?.className ?? null,
      id: document.activeElement?.id ?? null,
    }));
    if (sample.modality === 'keyboard') {
      const focusPath = [];
      let tabCount = 0;
      while (!(await input.evaluate((node) => node === document.activeElement)) && tabCount < 60) {
        await page.keyboard.press('Tab');
        tabCount += 1;
        focusPath.push(await page.evaluate(() => {
          const node = document.activeElement;
          return {
            tagName: node?.tagName ?? null,
            className: typeof node?.className === 'string' ? node.className : '',
            id: node?.id ?? '',
            label: node?.getAttribute?.('aria-label') ?? node?.textContent?.trim?.().slice(0, 70) ?? '',
          };
        }));
      }
      if (tabCount === 60) throw new Error(`Keyboard recovery could not reach the edited input on ${sample.id}`);
      sample.recoveryTabCount = tabCount;
      sample.recoveryFocusPath = focusPath;
      sample.recoveryInputReached = await input.evaluate((node) => node === document.activeElement);
      sample.recoveryFeedbackStillAvailable = await feedback.isVisible();
      if (!sample.recoveryFeedbackStillAvailable) throw new Error(`Recovery feedback disappeared before correction on ${sample.id}`);
      await page.keyboard.press('Control+A');
      await page.keyboard.type(String(form.numerator));
      await page.keyboard.press('Enter');
      if (recordFocus) {
        sample.responseFocus = await page.evaluate(() => ({
          tagName: document.activeElement?.tagName ?? null,
          className: document.activeElement?.className ?? null,
          id: document.activeElement?.id ?? null,
        }));
      }
      return;
    }
  }
  await enter(page, input, form.numerator, sample.modality);
  await submitResponse(page, sample, view);
  if (recordFocus) {
    sample.responseFocus = await page.evaluate(() => ({
      tagName: document.activeElement?.tagName ?? null,
      className: document.activeElement?.className ?? null,
      id: document.activeElement?.id ?? null,
    }));
  }
}

async function selectCorrectPremise(page, item, target, view, modality) {
  const authored = resolveAuthoredContent(item.fixtureId, item.authoringRevision);
  const expectedResponse = authored.premiseChecks[target].expectedResponse;
  const buttons = page.locator(`${viewSelector(view)} .control-choice-btn`);
  const labels = await buttons.allInnerTexts();
  const correctIndex = labels.findIndex((label) => label.trim().toLowerCase().startsWith(expectedResponse));
  if (correctIndex < 0) throw new Error(`Expected authored premise response ${expectedResponse}; saw ${JSON.stringify(labels)}`);
  await activate(page, buttons.nth(correctIndex), modality);
  return expectedResponse;
}

async function completeItem(page, item, target, sample, { targetItem = false } = {}) {
  const { instance, left, right } = mathFor(item);
  const targetBig = BigInt(target);
  const convertedLeft = convertToDenominator(left, targetBig);
  const convertedRight = convertToDenominator(right, targetBig);
  const sum = addFractions(convertedLeft, convertedRight);
  const view = sample.view;
  const surface = viewSelector(view);

  await activate(page, page.locator(`${surface} .control-btn`), sample.modality);
  await activate(page, page.locator(`${surface} .control-choice-btn`).nth(1), sample.modality);

  if (targetItem && sample.denominatorHelp) {
    const cue = await openLocalHelp(page, view, `${surface} .active-denominator-help-cue`);
    sample.capturedDenominatorHelp = cue;
  }
  await chooseTarget(page, sample, view, target);

  const selectedHelp = page.locator(`${surface} .selected-unit-help`);
  if (await selectedHelp.count()) {
    await selectedHelp.first().waitFor({ state: 'visible' });
    if (targetItem) sample.capturedSelectedUnitHelp = await selectedHelp.first().innerText();
  }

  const helpButton = page.locator(`${surface} .active-beat-controls .app-secondary-button`);
  if (targetItem && sample.transformHelp) {
    await activate(page, helpButton, sample.modality);
    const prefix = view === 'linear' ? 'linear-' : '';
    const helper = page.locator(`${surface} #${prefix}transform-help-multiplier-left`);
    await helper.waitFor({ state: 'visible' });
    const multiplier = scaleFactorForDenominator(left, targetBig);
    await enter(page, helper, multiplier, sample.modality);
    await activate(page, page.locator(`${surface} .control-submit-btn`), sample.modality);
    await page.locator(`${surface} .active-beat-help`).waitFor({ state: 'visible' });
    sample.capturedTransformHelp = await page.locator(`${surface} .active-beat-help`).innerText();
    await activate(page, helpButton, sample.modality);
  }

  await submitConversion(page, sample, view, 'left', convertedLeft, {
    wrongOnce: Boolean(targetItem && sample.wrongTransformRecovery),
    recordFocus: Boolean(targetItem && sample.modality === 'keyboard'),
  });
  if (targetItem && sample.replay) {
    const rightInput = page.locator(renderedFractionSelector(view, 'transform', 'right'));
    await enter(page, rightInput, convertedRight.numerator, sample.modality);
    const replay = page.getByRole('button', { name: 'Replay the last change' });
    await activate(page, replay, sample.modality);
    const replayBar = page.locator(`${surface} .fraction-bar-in-place-replay`).first();
    await replayBar.waitFor({ state: 'visible' });
    const replayText = await replayBar.innerText();
    if (!replayText.includes(`Starting parts: ${left.numerator}/${left.denominator}`)) {
      throw new Error(`Replay did not show the source fraction at ${sample.id}: ${replayText}`);
    }
    if ((await replay.getAttribute('aria-pressed')) !== 'true') throw new Error('Replay did not activate');
    const reveal = page.locator(`${surface} .fraction-bar-toggle-btn`).first();
    await reveal.scrollIntoViewIfNeeded();
    await activate(page, reveal, sample.modality);
    if (await replayBar.isVisible()) throw new Error(`Show new parts did not dismiss replay at ${sample.id}`);
    if ((await replay.getAttribute('aria-pressed')) !== 'false') throw new Error(`Replay did not return to its ordinary state at ${sample.id}`);
    const actualValue = await rightInput.inputValue();
    if (actualValue !== convertedRight.numerator.toString()) throw new Error(`Replay discarded the response draft at ${sample.id}`);
    sample.replayNotice = replayText;
  }
  await submitConversion(page, sample, view, 'right', convertedRight);
  const prefix = view === 'linear' ? 'linear-' : '';
  const operationInput = page.locator(`${surface} #${prefix}operate-sum-input`);
  await enter(page, operationInput, sum.numerator, sample.modality);
  await activate(page, page.locator(`${surface} .control-submit-btn`), sample.modality);
  await activate(page, page.getByRole('button', { name: 'Continue' }), sample.modality);

  if (targetItem) {
    sample.interactionBounds = await page.evaluate((selector) => {
      const question = document.querySelector(`${selector} .active-beat-prompt`);
      const controls = document.querySelector(`${selector} .active-beat-controls`);
      const rect = (node) => {
        if (!node) return null;
        const box = node.getBoundingClientRect();
        return { x: box.x, y: box.y, width: box.width, height: box.height, visible: box.width > 0 && box.height > 0 };
      };
      return {
        viewport: { width: innerWidth, height: innerHeight },
        document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
        question: rect(question),
        controls: rect(controls),
        scrollY,
      };
    }, surface);
    sample.capture = `${sample.id}-360x740.png`;
    await page.screenshot({ path: path.join(evidenceDir, sample.capture), fullPage: true });
  }

  if (item.targetDenominators && resolveAuthoredContent(item.fixtureId, item.authoringRevision).premiseChecks?.[target]) {
    sample.observedPremiseResponse = await selectCorrectPremise(page, item, target, sample.view, sample.modality);
  } else {
    const authored = resolveAuthoredContent(item.fixtureId, item.authoringRevision);
    const correctIndex = authored.reflectionChoices[target].findIndex((choice) => equalFractions(
      wireToForm(choice.form), left,
    ));
    if (correctIndex < 0) throw new Error(`No exact reflection answer for ${item.id}@${target}`);
    await activate(page, page.locator(`${surface} .matching-choice-btn`).nth(correctIndex), sample.modality);
  }
  return { instance, left, right, convertedLeft, convertedRight, sum };
}

async function reachTarget(page, sample) {
  const itemIndex = practiceType.items.findIndex((item) => item.id === sample.itemId);
  if (itemIndex < 2) throw new Error(`Risk sample must enter through actual Next: ${sample.itemId}`);
  for (let index = 0; index <= itemIndex; index += 1) {
    const item = practiceType.items[index];
    const target = index === itemIndex ? sample.target : item.targetDenominators[0];
    if (index > 0) await activate(page, page.getByRole('button', { name: 'Next problem' }), sample.modality);
    if (index === itemIndex) {
      if (sample.dirtyRetry) {
        const view = sample.view;
        await activate(page, page.locator(`${viewSelector(view)} .control-btn`), sample.modality);
        await activate(page, page.locator(`${viewSelector(view)} .control-choice-btn`).nth(1), sample.modality);
        const prefix = view === 'linear' ? 'linear-' : '';
        await enter(page, page.locator(`${viewSelector(view)} #${prefix}decide-common-denominator-input`), target, sample.modality);
        await activate(page, page.locator('.app-restart-button'), sample.modality);
        const firstBeat = page.locator(`${viewSelector(view)} .active-beat-prompt`);
        await firstBeat.waitFor({ state: 'visible' });
        const prompt = await firstBeat.innerText();
        const labels = await page.locator(`${viewSelector(view)} [aria-label]`).evaluateAll((nodes) => nodes.map((node) => node.getAttribute('aria-label')));
        const { left, right } = mathFor(item);
        const expectedExpression = `${left.numerator} over ${left.denominator} plus ${right.numerator} over ${right.denominator}`;
        const hasDraft = await page.locator(`${viewSelector(view)} input.control-numeric-input`).count();
        const hasCompletedBeat = await page.locator(`${viewSelector(view)} .completed-beat-summary`).count();
        const hasRecovery = await page.locator(`${viewSelector(view)} .recovery-feedback`).count();
        if (!prompt || !labels.some((label) => label?.includes(expectedExpression)) || hasDraft || hasCompletedBeat || hasRecovery) {
          throw new Error(`Dirty Retry did not restore the same compact item baseline: ${JSON.stringify({ prompt, labels, hasDraft, hasCompletedBeat, hasRecovery })}`);
        }
        sample.retryBaseline = { prompt, labels, hasDraft, hasCompletedBeat, hasRecovery };
      }
      await completeItem(page, item, target, sample, { targetItem: true });
      return item;
    }
    await completeItem(page, item, target, { ...sample, denominatorHelp: false, transformHelp: false, wrongTransformRecovery: false, replay: false });
  }
  throw new Error(`Could not reach compact item ${sample.itemId}`);
}

const server = createStaticServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}/FractionFlow/`;
const browser = await chromium.launch({ channel: 'chrome', headless: true });

try {
  const results = [];
  for (const sample of samples) {
    const context = await browser.newContext({
      viewport: { width: 360, height: 740 },
      reducedMotion: sample.motion,
      hasTouch: sample.modality === 'touch',
      isMobile: sample.modality === 'touch',
    });
    const page = await context.newPage();
    page.setDefaultTimeout(5000);
    await page.goto(baseUrl);
    await page.waitForSelector('.fractionflow-app');
    sample.reducedMotionMatched = await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (sample.reducedMotionMatched !== (sample.motion === 'reduce')) {
      throw new Error(`Browser motion preference did not match ${sample.motion} for ${sample.id}`);
    }
    await activate(page, page.locator('.app-gear-button'), sample.modality);
    await activate(page, page.locator('[data-condition-id="phase2-bundle-4"]'), sample.modality);
    await activate(page, page.locator('.app-gear-button'), sample.modality);
    await activate(page, page.locator(`[data-support-id="${sample.support}"]`), sample.modality);
    await activate(page, page.locator('.app-practice-button'), sample.modality);
    if (sample.view === 'linear') await activate(page, page.locator('.app-view-toggle'), sample.modality);
    await reachTarget(page, sample);
    const item = practiceType.items.find((entry) => entry.id === sample.itemId);
    const expectedPremise = resolveAuthoredContent(item.fixtureId, item.authoringRevision).premiseChecks[sample.target].expectedResponse;
    if (sample.observedPremiseResponse !== expectedPremise) {
      throw new Error(`Observed premise ${sample.observedPremiseResponse} does not match authored ${expectedPremise} for ${sample.id}`);
    }
    if (sample.interactionBounds.document.width !== 360
      || !sample.interactionBounds.question?.visible
      || !sample.interactionBounds.controls?.visible) {
      throw new Error(`Compact sample layout assertion failed for ${sample.id}: ${JSON.stringify(sample.interactionBounds)}`);
    }
    results.push({
      id: sample.id,
      itemId: sample.itemId,
      fixtureId: item.fixtureId,
      authoringRevision: item.authoringRevision,
      pathTarget: sample.target,
      operandForms: mathFor(item).instance.operands,
      exactPremiseOutcome: expectedPremise,
      observedPremiseResponse: sample.observedPremiseResponse,
      support: sample.support,
      view: sample.view,
      motion: sample.motion,
      reducedMotionMatched: sample.reducedMotionMatched,
      modality: sample.modality,
      capture: sample.capture,
      bounds: sample.interactionBounds,
      verticalScrollRange: Math.max(0, sample.interactionBounds.document.height - sample.interactionBounds.viewport.height),
      denominatorHelp: sample.capturedDenominatorHelp,
      selectedUnitHelp: sample.capturedSelectedUnitHelp,
      transformHelp: sample.capturedTransformHelp,
      recoveryFeedback: sample.recoveryFeedback,
      recoveryFocus: sample.recoveryFocus,
      inputNodeReplaced: sample.inputNodeReplaced,
      recoveryTabCount: sample.recoveryTabCount,
      recoveryFocusPath: sample.recoveryFocusPath,
      recoveryInputReached: sample.recoveryInputReached,
      recoveryFeedbackStillAvailable: sample.recoveryFeedbackStillAvailable,
      keyboardResponseFocus: sample.responseFocus,
      replayNotice: sample.replayNotice,
      dirtyRetryBaseline: sample.retryBaseline,
      scaleFactors: {
        left: scaleFactorForDenominator(mathFor(item).left, BigInt(sample.target)).toString(),
        right: scaleFactorForDenominator(mathFor(item).right, BigInt(sample.target)).toString(),
      },
      outcome: 'completed through mounted app controls after actual Next from preserved items',
    });
    await context.close();
  }
  writeFileSync(path.join(evidenceDir, 'risk-samples.json'), `${JSON.stringify({ samples: results }, null, 2)}\n`, 'utf8');
  console.log(`Captured ${results.length} risk-selected compact-item browser journeys.`);
} finally {
  await browser.close();
  server.close();
}
