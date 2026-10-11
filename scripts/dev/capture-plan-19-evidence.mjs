#!/usr/bin/env node

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PRACTICE_TYPES } from '../../src/app/practice-types.js';
import { resolveAuthoredContent, resolveCuratedFixture } from '../../src/content/authored-content-catalog.js';
import { buildCuratedProblem } from '../../src/content/generator.js';
import { convertToDenominator, addAtCommonDenominator, equalFractions, scaleFactorForDenominator } from '../../src/math/index.js';
import { fractionToWire, wireToForm } from '../../src/content/schema.js';
import { STRINGS } from '../../src/render/strings.js';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('./run-route-matrix.js');
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const outputDir = path.join(rootDir, 'reports/development/plan-19-shared-factor-addition/evidence');
const practiceType = PRACTICE_TYPES.find((entry) => entry.id === 'sum-under-one');
const oldItems = practiceType.items.slice(0, 9);
const newItem = practiceType.items[9];
let currentJourney = 'unknown-journey';
const plans = [
  { name: 'matching-12-high-visual-pointer-360x740', target: '12', condition: 'phase2-bundle-1', support: 'high', view: 'visual', action: 'pointer', motion: 'standard-motion', viewport: { width: 360, height: 740 } },
  { name: 'premise-12-medium-linear-keyboard-reduced-360x752', target: '12', condition: 'phase2-bundle-4', support: 'medium', view: 'linear', action: 'keyboard', motion: 'reduced-motion', viewport: { width: 360, height: 752 } },
  { name: 'matching-24-high-visual-touch-360x752', target: '24', condition: 'phase2-bundle-1', support: 'high', view: 'visual', action: 'touch', motion: 'standard-motion', viewport: { width: 360, height: 752 } },
  { name: 'premise-24-medium-linear-pointer-chromebook', target: '24', condition: 'phase2-bundle-4', support: 'medium', view: 'linear', action: 'pointer', motion: 'standard-motion', viewport: { width: 1366, height: 768 } },
];

const evidence = {
  captureDate: new Date().toISOString().slice(0, 10),
  browser: null,
  registeredSet: { id: practiceType.setId, revision: practiceType.setRevision, itemCount: practiceType.items.length },
  actualNextReach: [],
  finalItemVerification: [],
  keyboardFocusObservations: [],
  mountedScaleFactorSeeds: [],
  withholdingScans: [],
  withholdingNegativeControl: null,
  activeReplayObservations: [],
  reflectionInspectionObservations: [],
  journeys: [],
  screenshots: [],
  measurements: [],
  limitations: [
    'Touch evidence uses Playwright browser touch events in a touch-enabled context; no physical touch device or native on-screen keyboard was used.',
    'Keyboard evidence uses browser keyboard events; no assistive technology was tested.',
    'The 1366 by 768 CSS viewport is a Chromebook-size layout sample, not a physical Chromebook test.',
    'The known response input remount can move focus to BODY after a response; this capture records reachable recovery and does not establish continuous focus.',
  ],
};

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function instanceFor(item) {
  const fixture = resolveCuratedFixture(item.fixtureId, item.authoringRevision);
  ensure(fixture, `fixture not registered: ${item.fixtureId}@${item.authoringRevision}`);
  return buildCuratedProblem({
    fixture,
    selector: fixture.selector,
    overlays: fixture.overlays,
    profileId: fixture.profileId,
    candidate: { left: fixture.left, right: fixture.right, reviewedTransitions: fixture.reviewedTransitions ?? [] },
  });
}

async function focusSnapshot(page) {
  return page.evaluate(() => {
    const active = document.activeElement;
    return {
      tagName: active?.tagName ?? null,
      id: active?.id ?? '',
      className: typeof active?.className === 'string' ? active.className : '',
      role: active?.getAttribute?.('role') ?? null,
      isBody: active === document.body,
    };
  });
}

async function tabTo(page, locator, journey, targetName) {
  ensure(await locator.count() > 0 && await locator.isVisible(), `${journey}: keyboard target is missing or hidden: ${targetName}`);
  const start = await focusSnapshot(page);
  let tabs = 0;
  while (!(await locator.evaluate((element) => document.activeElement === element))) {
    ensure(tabs < 120, `${journey}: Tab navigation could not reach ${targetName} from ${JSON.stringify(start)}`);
    await page.keyboard.press('Tab');
    tabs += 1;
  }
  return { start, tabs, reached: await focusSnapshot(page), targetName };
}

function actionFor(page, mode, journey = currentJourney) {
  return async (locator) => {
    if (mode === 'keyboard') {
      await tabTo(page, locator, journey, 'activation target');
      await page.keyboard.press('Enter');
    } else if (mode === 'touch') {
      await locator.tap();
    } else {
      await locator.click();
    }
  };
}

async function typeNumber(page, input, value, mode, journey) {
  if (mode === 'keyboard') {
    const navigation = await tabTo(page, input, journey, 'numeric response');
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    await page.keyboard.type(String(value));
    return navigation;
  } else {
    await input.fill(String(value));
    return null;
  }
}

async function enterNumber(page, value, mode, view = 'visual', journey = currentJourney) {
  const region = page.locator(`.app-${view}-view:not([hidden]) .active-beat-controls`);
  const input = region.locator('input.control-numeric-input').first();
  const inputNavigation = await typeNumber(page, input, value, mode, journey);
  const submit = region.locator('.control-submit-btn').first();
  let submitNavigation = null;
  if (mode === 'keyboard') {
    submitNavigation = await tabTo(page, submit, journey, 'numeric response submit');
    await page.keyboard.press('Enter');
  } else if (mode === 'touch') await submit.tap();
  else await submit.click();
  return {
    inputNavigation,
    submitNavigation,
    focusAfterSubmit: mode === 'keyboard' ? await focusSnapshot(page) : null,
  };
}

async function chooseButton(page, name, mode, exact = true) {
  const button = page.getByRole('button', { name, exact }).filter({ visible: true }).first();
  await actionFor(page, mode)(button);
}

async function selectProfile(page, plan) {
  const act = actionFor(page, plan.action);
  await act(page.locator('.app-gear-button'));
  await act(page.locator(`[data-condition-id="${plan.condition}"]`));
  await act(page.locator('.app-gear-button'));
  await act(page.locator(`[data-support-id="${plan.support}-support"]`));
  await act(page.locator('.app-practice-button'));
  if (plan.view === 'linear') await act(page.locator('.app-view-toggle'));
  ensure(await page.locator(`.app-${plan.view}-view`).isVisible(), `${plan.name}: requested view did not mount`);
}

async function inspectLayout(page, plan, label) {
  const measurement = await page.evaluate(({ planName, stage }) => {
    const round = (value) => Math.round(value * 100) / 100;
    const rect = (element) => {
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return { x: round(box.x), y: round(box.y), width: round(box.width), height: round(box.height), right: round(box.right), bottom: round(box.bottom) };
    };
    const root = document.querySelector('.fractionflow-app');
    const view = document.querySelector('.app-visual-view:not([hidden]), .app-linear-view:not([hidden])');
    const active = view?.querySelector('.active-beat-section');
    const controls = [...(active?.querySelectorAll('button,input') ?? [])].map((node) => ({
      label: node.getAttribute('aria-label') || node.textContent?.trim() || node.labels?.[0]?.textContent?.trim() || '',
      rect: rect(node),
    }));
    const width = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    const height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    return {
      journey: planName,
      stage,
      viewport: { width: innerWidth, height: innerHeight },
      activeTask: rect(active),
      prompt: { text: active?.querySelector('.active-beat-prompt')?.textContent?.trim() ?? '', rect: rect(active?.querySelector('.active-beat-prompt')) },
      fractionTracks: [...(view?.querySelectorAll('.fraction-bar-track') ?? [])].map(rect),
      controls,
      scroll: { documentWidth: width, documentHeight: height, horizontalOverflow: width > innerWidth, verticalOverflow: height > innerHeight },
      viewToggle: rect(document.querySelector('.app-view-toggle')),
      documentRoot: rect(root),
    };
  }, { planName: plan.name, stage: label });
  evidence.measurements.push(measurement);
  return measurement;
}

async function saveScreenshot(page, plan, label) {
  const fileName = `${plan.name}-${label}-${plan.viewport.width}x${plan.viewport.height}.png`;
  const file = path.join(outputDir, fileName);
  await page.screenshot({ path: file, fullPage: true, animations: 'disabled' });
  evidence.screenshots.push({ journey: plan.name, stage: label, file: `evidence/${fileName}`, viewport: plan.viewport });
}

function recordKeyboardRecovery(plan, stage, wrongResponse, recoveredResponse) {
  const afterWrong = wrongResponse.focusAfterSubmit;
  const recoveryNavigation = recoveredResponse.inputNavigation;
  const usedTabFromBody = Boolean(afterWrong?.isBody && recoveryNavigation?.tabs > 0);
  if (afterWrong?.isBody) {
    ensure(usedTabFromBody, `${plan.name}/${stage}: BODY focus after response was not recovered by Tab`);
  }
  evidence.keyboardFocusObservations.push({
    journey: plan.name,
    stage,
    afterWrongResponse: afterWrong,
    recoveryNavigation,
    usedTabFromBody,
    recoveredResponseEntered: true,
  });
}

async function captureActiveConversionReplay(page, plan, draftValue) {
  const viewRoot = `.app-${plan.view}-view:not([hidden])`;
  const input = page.locator(`${viewRoot} .active-beat-controls input.control-numeric-input`).first();
  await typeNumber(page, input, draftValue, plan.action, plan.name);
  const before = await input.inputValue();
  await chooseButton(page, 'Replay the last change', plan.action);
  const replayButton = page.getByRole('button', { name: 'Replay the last change', exact: true }).first();
  ensure(await replayButton.getAttribute('aria-pressed') === 'true', `${plan.name}: active conversion Replay did not turn on`);
  const activeTask = page.locator(`${viewRoot} .active-beat-section`);
  const prompt = (await activeTask.locator('.active-beat-prompt').textContent()).trim();
  ensure(prompt.length > 0, `${plan.name}: active conversion Replay hid its question`);
  ensure(await activeTask.locator('input.control-numeric-input').count() === 1, `${plan.name}: active conversion Replay hid its response control`);
  ensure(await page.locator(`${viewRoot} .fraction-bar-track`).count() >= 2, `${plan.name}: active conversion Replay lost the fraction bars`);
  ensure(await page.locator(`${viewRoot} .fraction-bar-in-place-replay`).count() > 0, `${plan.name}: active conversion Replay card is absent`);
  ensure(await page.locator(`${viewRoot} .replay-inspection-card`).count() === 0, `${plan.name}: active conversion Replay was confused with reflection Inspection Mode`);
  const draft = await page.locator(`${viewRoot} .active-beat-controls input.control-numeric-input`).first().inputValue();
  ensure(draft === before && draft === String(draftValue), `${plan.name}: active conversion Replay did not retain its input draft`);
  const measurement = await inspectLayout(page, plan, 'active-replay-right-conversion');
  ensure(measurement.prompt.text === prompt && measurement.controls.length > 0 && measurement.fractionTracks.length >= 2,
    `${plan.name}: active Replay measurement omitted task controls or fraction bars`);
  await saveScreenshot(page, plan, 'active-replay-right-conversion');
  await chooseButton(page, 'Replay the last change', plan.action);
  ensure(await replayButton.getAttribute('aria-pressed') === 'false', `${plan.name}: active conversion Replay did not dismiss`);
  ensure(await page.locator(`${viewRoot} .active-beat-prompt`).textContent().then((value) => value.trim()) === prompt,
    `${plan.name}: conversion question did not return after Replay`);
  const draftAfter = await page.locator(`${viewRoot} .active-beat-controls input.control-numeric-input`).first().inputValue();
  ensure(draftAfter === draft, `${plan.name}: active conversion Replay dismissal discarded its draft`);
  evidence.activeReplayObservations.push({
    journey: plan.name,
    stage: 'right-conversion-response-before-submit',
    replayWasPressed: true,
    activeQuestion: prompt,
    responseControlVisible: true,
    fractionBarsVisible: true,
    activeInPlaceReplayVisible: true,
    reflectionInspectionModeVisible: false,
    draftBeforeReplay: before,
    draftDuringReplay: draft,
    draftAfterDismissal: draftAfter,
    questionRestoredAfterDismissal: true,
    measurementStage: measurement.stage,
    screenshotStage: 'active-replay-right-conversion',
  });
}

async function answerNotice(page, mode) {
  await chooseButton(page, 'No, different sizes', mode);
}

async function chooseDenominator(page, item, target, support, mode, view) {
  if (support === 'high') {
    await chooseButton(page, `Common denominator ${target}`, mode);
  } else {
    await enterNumber(page, target, mode, view);
  }
}

function exactSteps(instance, target) {
  const denominator = BigInt(target);
  const leftSource = wireToForm(instance.operands.left.initialForm);
  const rightSource = wireToForm(instance.operands.right.initialForm);
  return {
    leftSource,
    rightSource,
    left: convertToDenominator(leftSource, denominator),
    right: convertToDenominator(rightSource, denominator),
    result: addAtCommonDenominator(leftSource, rightSource, denominator),
  };
}

function formKey(form) {
  return `${form.numerator}/${form.denominator}`;
}

async function scanUnearnedAnswers(page, plan, stage, forbiddenForms, allowedForms = []) {
  const result = await page.evaluate(({ forbiddenForms: forbidden, allowedForms: allowed }) => {
    const root = document.querySelector('.fractionflow-app');
    if (!root) return { missingRoot: true, scannedElements: 0, leakedMetadata: [], leakedForms: [] };
    const metadataPattern = /one-sixth-plus-one-fourth|correctPosition|expectedResponse|isEquivalent|R-CORRECT|R-KEEP-NUMERATOR|R-ADJACENT-UNIT/;
    const allElements = [root, ...root.querySelectorAll('*')];
    const leakedMetadata = [];
    for (const element of allElements) {
      const values = [element.textContent || '', ...[...element.attributes].map((attribute) => attribute.value)];
      if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) values.push(element.value);
      for (const value of values) {
        const match = value.match(metadataPattern);
        if (match) leakedMetadata.push({ token: match[0], tagName: element.tagName, id: element.id || '' });
      }
    }
    const allowedSet = new Set(allowed);
    const structuralAttributeNames = new Set(['data-boundary-key']);
    const symbolicForms = [...root.querySelectorAll('.symbolic-fraction')].map((element) => {
      const numerator = element.querySelector('.symbolic-numerator')?.textContent?.trim() ?? '';
      const denominator = element.querySelector('.symbolic-denominator')?.textContent?.trim() ?? '';
      return `${numerator}/${denominator}`;
    });
    const leakedForms = [];
    const leakedFormLocations = [];
    for (const candidate of forbidden) {
      if (allowedSet.has(candidate)) continue;
      const [numerator, denominator] = candidate.split('/');
      const slashPattern = new RegExp(`(^|[^0-9])${numerator}\\s*[/⁄]\\s*${denominator}([^0-9]|$)`);
      const wordsPattern = new RegExp(`(^|[^0-9])${numerator}\\s+of\\s+${denominator}([^0-9]|$)`, 'i');
      const rawValues = allElements.flatMap((element) => [
        element.textContent || '',
        ...[...element.attributes].filter((attribute) => !structuralAttributeNames.has(attribute.name)).map((attribute) => attribute.value),
        ...(element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? [element.value] : []),
      ]);
      const exactSymbolicLeak = symbolicForms.includes(candidate);
      const exactRawLeak = rawValues.some((value) => slashPattern.test(value) || wordsPattern.test(value));
      if (exactRawLeak) {
        const details = [];
        for (const element of allElements) {
          const texts = [element.textContent || '', ...[...element.attributes].filter((attribute) => !structuralAttributeNames.has(attribute.name)).map((attribute) => attribute.value)];
          if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) texts.push(element.value);
          if (texts.some((value) => slashPattern.test(value) || wordsPattern.test(value))) {
            details.push({ tagName: element.tagName, id: element.id || '', className: typeof element.className === 'string' ? element.className : '', hidden: Boolean(element.closest('[hidden], [inert], [aria-hidden="true"]')), text: (element.textContent || '').trim().slice(0, 180), attributes: [...element.attributes].map((attribute) => [attribute.name, attribute.value]).filter(([, value]) => slashPattern.test(value) || wordsPattern.test(value)) });
          }
        }
        leakedFormLocations.push({ candidate, details: details.slice(-8) });
      }
      if (exactSymbolicLeak || exactRawLeak) leakedForms.push(candidate);
    }
    const leakedFormElements = [...root.querySelectorAll('.symbolic-fraction')]
      .filter((element) => forbidden.includes(`${element.querySelector('.symbolic-numerator')?.textContent?.trim() ?? ''}/${element.querySelector('.symbolic-denominator')?.textContent?.trim() ?? ''}`))
      .map((element) => ({
        className: element.className,
        text: element.textContent?.trim(),
        activeTask: Boolean(element.closest('.active-beat-section')),
        hidden: Boolean(element.closest('[hidden], [inert], [aria-hidden="true"]')),
        outerHTML: element.outerHTML,
      }));
    return {
      missingRoot: false,
      scannedElements: allElements.length,
      hiddenOrInactiveElements: allElements.filter((element) => element.closest('[hidden], [inert], [aria-hidden="true"]')).length,
      structuralBoundaryAttributes: allElements.reduce((count, element) => count + [...element.attributes].filter((attribute) => structuralAttributeNames.has(attribute.name)).length, 0),
      symbolicFractionCount: symbolicForms.length,
      symbolicForms,
      leakedFormElements,
      leakedMetadata,
      leakedForms: [...new Set(leakedForms)],
      leakedFormLocations,
    };
  }, { forbiddenForms, allowedForms });
  ensure(!result.missingRoot, `${plan.name}/${stage}: mounted component root missing`);
  const scan = {
    journey: plan.name,
    stage,
    forbiddenForms,
    allowedForms,
    scannedElements: result.scannedElements,
    hiddenOrInactiveElements: result.hiddenOrInactiveElements,
    structuralBoundaryAttributes: result.structuralBoundaryAttributes,
    symbolicFractionCount: result.symbolicFractionCount,
    symbolicForms: result.symbolicForms,
    leakedFormElements: result.leakedFormElements,
    leakedMetadata: result.leakedMetadata,
    leakedForms: result.leakedForms,
    leakedFormLocations: result.leakedFormLocations,
    passed: result.leakedMetadata.length === 0 && result.leakedForms.length === 0,
  };
  evidence.withholdingScans.push(scan);
  return scan;
}

async function proveWithholdingGuardNonVacuous(page, plan, candidateForm) {
  const seedId = 'plan19-temporary-answer-leak-seed';
  await page.evaluate(({ seedId: id, candidate }) => {
    const root = document.querySelector('.fractionflow-app');
    const seed = document.createElement('span');
    seed.id = id;
    seed.hidden = true;
    seed.setAttribute('aria-label', `temporary answer leak ${candidate}`);
    root.appendChild(seed);
  }, { seedId, candidate: candidateForm });
  let detected = false;
  try {
    const scan = await scanUnearnedAnswers(page, plan, 'negative-control-hidden-sibling-attribute', [candidateForm]);
    detected = !scan.passed && scan.leakedForms.includes(candidateForm);
  } finally {
    await page.evaluate((id) => document.getElementById(id)?.remove(), seedId);
  }
  ensure(detected, `${plan.name}: withholding scan did not detect temporary hidden sibling answer seed ${candidateForm}`);
  evidence.withholdingNegativeControl = {
    journey: plan.name,
    seed: 'temporary hidden sibling aria-label answer form',
    candidateForm,
    detected: true,
    restored: await page.locator(`#${seedId}`).count() === 0,
  };
  ensure(evidence.withholdingNegativeControl.restored, `${plan.name}: temporary answer seed was not restored`);
}

async function answerReflection(page, item, target, plan, wrongFirst = false) {
  const authored = resolveAuthoredContent(item.fixtureId, item.authoringRevision);
  const instance = instanceFor(item);
  const expected = authored.premiseChecks[target].expectedResponse;
  if (plan.condition === 'phase2-bundle-4') {
    if (wrongFirst) {
      const wrong = expected === 'yes' ? 'No, the amount changed' : 'Yes, it is the same amount';
      await chooseButton(page, wrong, plan.action);
      await page.locator(`.app-${plan.view}-view:not([hidden]) .active-beat-feedback[role="alert"]`).waitFor();
      ensure(await page.locator('.app-next-button:not([hidden])').count() === 0, `${plan.name}: wrong premise response advanced`);
    }
    const label = expected === 'yes' ? 'Yes, it is the same amount' : 'No, the amount changed';
    await chooseButton(page, label, plan.action);
  } else {
    const choices = authored.reflectionChoices[target];
    const source = wireToForm(instance.operands.left.initialForm);
    const correct = choices.find((choice) => equalFractions(wireToForm(choice.form), source));
    ensure(correct, `${plan.name}: no exact reflection choice`);
    const label = `Bar with ${correct.form.numerator} of ${correct.form.denominator} equal parts shaded`;
    await chooseButton(page, label, plan.action);
  }
}

async function completeItem(page, item, target, plan, { collect = false, recovery = false, help = false, replay = false, wrongPremise = false } = {}) {
  const mode = plan.action;
  const act = actionFor(page, mode);
  const viewRoot = `.app-${plan.view}-view:not([hidden])`;
  const instance = instanceFor(item);
  const authored = resolveAuthoredContent(item.fixtureId, item.authoringRevision);
  const step = exactSteps(instance, target);

  if (collect) {
    await inspectLayout(page, plan, 'encounter');
    await saveScreenshot(page, plan, 'next-reached-item');
  }
  await act(page.locator('.app-visual-view:not([hidden]) .active-beat-controls .control-btn, .app-linear-view:not([hidden]) .active-beat-controls .control-btn').first());
  await answerNotice(page, mode);
  if (collect) {
    await inspectLayout(page, plan, 'decide');
    await saveScreenshot(page, plan, 'decide');
  }

  if (recovery) {
    await enterNumber(page, '18', mode, plan.view);
    const invalidText = (await page.locator(`${viewRoot} .active-beat-feedback`).textContent()) || '';
    ensure(invalidText.includes('not a common denominator') || invalidText.includes('is a multiple of'), `${plan.name}: invalid denominator was not rejected`);
    ensure(await page.locator(`${viewRoot} .active-beat-controls input.control-numeric-input`).count() === 1, `${plan.name}: invalid denominator advanced`);
    await enterNumber(page, '36', mode, plan.view);
    ensure((await page.locator(`${viewRoot} .active-beat-feedback`).textContent())?.includes('valid common denominator'), `${plan.name}: valid but unsupported denominator was not distinguished`);
    ensure(await page.locator(`${viewRoot} .active-beat-controls input.control-numeric-input`).count() === 1, `${plan.name}: unsupported denominator advanced`);
  }
  if (help) {
    await chooseButton(page, 'Need help?', mode);
    const cue = page.locator('.active-denominator-help-cue');
    await cue.waitFor();
    ensure((await cue.textContent()).trim().length > 0, `${plan.name}: task-local denominator help missing`);
    await chooseButton(page, 'Close help', mode);
  }
  await chooseDenominator(page, item, target, plan.support, mode, plan.view);
  if (collect) {
    await inspectLayout(page, plan, 'transform-left');
    await saveScreenshot(page, plan, 'transform-left');
  }

  const leftNumerator = step.left.numerator.toString();
  const candidates = [step.left, step.right, step.result].map(formKey);
  if (item === newItem) {
    if (!evidence.withholdingNegativeControl) await proveWithholdingGuardNonVacuous(page, plan, formKey(step.result));
    const beforeLeft = await scanUnearnedAnswers(page, plan, 'before-left-conversion-response', candidates);
    ensure(beforeLeft.passed, `${plan.name}: unearned conversion or operation answer was mounted before left response`);
  }
  if (help) {
    await chooseButton(page, 'Need help?', mode);
    const multiplier = scaleFactorForDenominator(step.leftSource, BigInt(target)).toString();
    const helpTask = page.locator(`${viewRoot} .active-beat-controls [id$="-transform-task-help"]:visible`).first();
    await helpTask.waitFor({ state: 'visible' });
    const helpPrompt = (await helpTask.textContent()).trim();
    ensure(helpPrompt.length > 0, `${plan.name}: conversion help task has no instructional content`);
    ensure(await page.locator(`${viewRoot} .active-beat-controls input.control-numeric-input`).count() === 1, `${plan.name}: conversion help task has no response input`);
    const helpResponse = await enterNumber(page, multiplier, mode, plan.view);
    const acceptedHelp = page.locator(`${viewRoot} .active-beat-controls .active-beat-help:visible`).first();
    await acceptedHelp.waitFor({ state: 'visible' });
    const acceptedHelpText = (await acceptedHelp.textContent()).trim();
    ensure(acceptedHelpText.length > 0, `${plan.name}: accepted conversion help cue is empty`);
    ensure((await page.locator(`${viewRoot} .active-beat-controls input.control-numeric-input`).count()) === 1, `${plan.name}: conversion task did not return after help`);
    const expectedConversionPrompt = STRINGS.transform.equivalentNumeratorPrompt(step.leftSource, target);
    const returnedPrompt = (await page.locator(`${viewRoot} .active-beat-prompt`).textContent()).trim();
    ensure(await helpTask.locator('input').count() === 0, `${plan.name}: multiplier response remained active after acceptance`);
    ensure(returnedPrompt === expectedConversionPrompt, `${plan.name}: help acceptance did not return to the exact left conversion task`);
    evidence.withholdingScans.push({ journey: plan.name, stage: 'conversion-help-task', passed: true, helpPrompt, acceptedCue: acceptedHelpText, responseValue: multiplier, computedMultiplier: multiplier, returnedTaskPrompt: returnedPrompt });
    if (mode === 'keyboard') ensure(helpResponse.focusAfterSubmit?.isBody || helpResponse.focusAfterSubmit?.tagName === 'INPUT', `${plan.name}: unexpected focus state after help response`);
  }
  if (recovery) {
    const leftSource = step.leftSource;
    const leftScale = scaleFactorForDenominator(leftSource, BigInt(target));
    const wrongLeft = (leftSource.numerator * (leftScale + 1n)).toString();
    const wrongLeftResult = await enterNumber(page, wrongLeft, mode, plan.view);
    await page.locator(`${viewRoot} .active-beat-feedback[role="alert"]`).waitFor();
    ensure(await page.locator(`${viewRoot} .active-beat-controls input.control-numeric-input`).count() === 1, `${plan.name}: wrong left scale factor advanced`);
    ensure(!equalFractions(wireToForm({ kind: 'fraction', numerator: wrongLeft, denominator: target }), leftSource), `${plan.name}: wrong left scale-factor seed unexpectedly matches exact source`);
    const leftRecovery = await enterNumber(page, leftNumerator, mode, plan.view);
    evidence.mountedScaleFactorSeeds.push({
      journey: plan.name,
      side: 'left',
      exactScaleFactor: leftScale.toString(),
      rejectedNumerator: wrongLeft,
      rejected: true,
      recoveredWithExactMathOracle: true,
    });
    if (mode === 'keyboard') recordKeyboardRecovery(plan, 'left-conversion', wrongLeftResult, leftRecovery);
  }
  if (!recovery) await enterNumber(page, leftNumerator, mode, plan.view);
  if (collect) {
    await inspectLayout(page, plan, 'transform-right');
    await saveScreenshot(page, plan, 'transform-right');
  }
  if (item === newItem) {
    const beforeRight = await scanUnearnedAnswers(
      page,
      plan,
      'before-right-conversion-response',
      [formKey(step.right), formKey(step.result)],
      [formKey(step.left)],
    );
    ensure(beforeRight.passed, `${plan.name}: unearned right conversion or operation answer was mounted before right response`);
  }
  if (replay) await captureActiveConversionReplay(page, plan, '2');
  if (recovery) {
    const rightScale = scaleFactorForDenominator(step.rightSource, BigInt(target));
    const wrongRight = (step.rightSource.numerator * (rightScale + 1n)).toString();
    const wrongRightResult = await enterNumber(page, wrongRight, mode, plan.view);
    await page.locator(`${viewRoot} .active-beat-feedback[role="alert"]`).waitFor();
    ensure(await page.locator(`${viewRoot} .active-beat-controls input.control-numeric-input`).count() === 1, `${plan.name}: wrong right scale factor advanced`);
    ensure(!equalFractions(wireToForm({ kind: 'fraction', numerator: wrongRight, denominator: target }), step.rightSource), `${plan.name}: wrong right scale-factor seed unexpectedly matches exact source`);
    const rightRecovery = await enterNumber(page, step.right.numerator.toString(), mode, plan.view);
    evidence.mountedScaleFactorSeeds.push({
      journey: plan.name,
      side: 'right',
      exactScaleFactor: rightScale.toString(),
      rejectedNumerator: wrongRight,
      rejected: true,
      recoveredWithExactMathOracle: true,
    });
    if (mode === 'keyboard') recordKeyboardRecovery(plan, 'right-conversion', wrongRightResult, rightRecovery);
  } else {
    await enterNumber(page, step.right.numerator.toString(), mode, plan.view);
  }
  if (collect) await inspectLayout(page, plan, 'operate');
  if (item === newItem) {
    const operationWithholding = await scanUnearnedAnswers(page, plan, 'before-operation-response', [formKey(step.result)], [formKey(step.left), formKey(step.right)]);
    ensure(operationWithholding.passed, `${plan.name}: unearned operation result was mounted before response: ${JSON.stringify(operationWithholding)}`);
  }
  if (recovery) {
    const wrong = (step.result.numerator + 1n).toString();
    await enterNumber(page, wrong, mode, plan.view);
    await page.locator(`${viewRoot} .active-beat-feedback[role="alert"]`).waitFor();
    ensure(await page.locator(`${viewRoot} .active-beat-controls input.control-numeric-input`).count() === 1, `${plan.name}: wrong arithmetic advanced`);
  }
  await enterNumber(page, step.result.numerator.toString(), mode, plan.view);
  if (collect) await inspectLayout(page, plan, 'resolve');
  const resolveButton = page.locator(`.app-${plan.view}-view:not([hidden]) .active-beat-controls .control-btn`).first();
  await resolveButton.waitFor({ timeout: 5000 }).catch(async () => {
    const prompt = await page.locator('.active-beat-prompt').textContent().catch(() => 'missing prompt');
    const body = await page.locator('.active-beat-section').innerText().catch(() => 'missing active beat');
    throw new Error(`${plan.name}/${item.id}: no resolve button after exact result; prompt=${prompt}; active=${body}`);
  });
  await act(resolveButton);
  if (replay) {
    await chooseButton(page, 'Replay the last change', mode);
    await page.locator(`${viewRoot} .app-done-looking-button`).waitFor();
    if (collect) {
      const inspection = await inspectLayout(page, plan, 'reflection-inspection-mode');
      await saveScreenshot(page, plan, 'reflection-inspection-mode');
      evidence.reflectionInspectionObservations.push({ journey: plan.name, stage: 'resolved-reflection-inspection-mode', inspectionCardVisible: true, measurementStage: inspection.stage });
    }
    await chooseButton(page, 'Done looking', mode);
  }
  if (collect) {
    await inspectLayout(page, plan, 'reflect');
    await saveScreenshot(page, plan, 'reflect');
  }
  await answerReflection(page, item, target, plan, wrongPremise);
  ensure(await page.locator('.app-next-button:not([hidden])').count() === 1 || item === newItem, `${plan.name}: completed existing item has no mounted Next`);
}

async function reachNewItem(page, plan) {
  const act = actionFor(page, plan.action);
  for (const prior of oldItems) {
    const target = prior.targetDenominators[0];
    await completeItem(page, prior, target, plan);
    const next = page.locator('.app-next-button:not([hidden])');
    await next.waitFor();
    await act(next);
    const current = practiceType.items[oldItems.indexOf(prior) + 1];
    const expected = current ? instanceFor(current) : instanceFor(newItem);
    const left = expected.operands.left.initialForm;
    const right = expected.operands.right.initialForm;
    const view = page.locator(`.app-${plan.view}-view`);
    const visibleBars = await view.locator('.fraction-bar-container').count();
    if (plan.view === 'visual') {
      ensure(visibleBars >= 2, `${plan.name}: Next did not mount the next item's bars`);
    } else {
      const linearText = (await view.innerText()).replace(/\s+/g, ' ');
      ensure(linearText.includes(`${left.numerator} ${left.denominator}`)
        && linearText.includes(`${right.numerator} ${right.denominator}`),
      `${plan.name}: Next did not mount the next item's linear fractions: ${linearText.slice(0, 220)}`);
    }
    evidence.actualNextReach.push({
      journey: plan.name,
      completed: prior.id,
      reached: current?.id ?? newItem.id,
      expectedLeft: `${left.numerator}/${left.denominator}`,
      expectedRight: `${right.numerator}/${right.denominator}`,
      activeElement: await page.evaluate(() => document.activeElement?.tagName === 'MAIN' ? document.activeElement.className : document.activeElement?.className),
    });
  }
  const instance = instanceFor(newItem);
  if (plan.view === 'visual') {
    const leftTrack = page.locator(`.app-${plan.view}-view .fraction-bar-container[data-side="left"] .fraction-bar-track`);
    const rightTrack = page.locator(`.app-${plan.view}-view .fraction-bar-container[data-side="right"] .fraction-bar-track`);
    await leftTrack.waitFor();
    ensure(await leftTrack.getAttribute('data-numerator') === instance.operands.left.initialForm.numerator, `${plan.name}: new left fixture not reached through Next`);
    ensure(await leftTrack.getAttribute('data-denominator') === instance.operands.left.initialForm.denominator, `${plan.name}: new left denominator mismatch`);
    ensure(await rightTrack.getAttribute('data-numerator') === instance.operands.right.initialForm.numerator, `${plan.name}: new right fixture not reached through Next`);
    ensure(await rightTrack.getAttribute('data-denominator') === instance.operands.right.initialForm.denominator, `${plan.name}: new right denominator mismatch`);
  } else {
    const text = (await page.locator(`.app-${plan.view}-view`).innerText()).replace(/\s+/g, ' ');
    const { numerator: leftNumerator, denominator: leftDenominator } = instance.operands.left.initialForm;
    const { numerator: rightNumerator, denominator: rightDenominator } = instance.operands.right.initialForm;
    ensure(text.includes(`${leftNumerator} ${leftDenominator}`)
      && text.includes(`${rightNumerator} ${rightDenominator}`),
    `${plan.name}: final Next did not mount the shared-factor linear fractions: ${text.slice(0, 220)}`);
  }
  evidence.finalItemVerification.push({ journey: plan.name, reached: newItem.id, verified: true, activeItemCount: 10 });
}

async function runJourney(browser, baseUrl, plan) {
  currentJourney = plan.name;
  const context = await browser.newContext({
    viewport: plan.viewport,
    hasTouch: plan.action === 'touch',
    isMobile: plan.action === 'touch',
    reducedMotion: plan.motion === 'reduced-motion' ? 'reduce' : 'no-preference',
  });
  const page = await context.newPage();
  await page.goto(baseUrl);
  await page.waitForSelector('.app-practice-button');
  await selectProfile(page, plan);
  await reachNewItem(page, plan);
  const startFocus = await page.evaluate(() => document.activeElement?.classList?.contains('app-episode') ?? false);
  const target = plan.target;

  if (plan.support === 'medium') {
    await actionFor(page, plan.action)(page.locator(`.app-${plan.view}-view:not([hidden]) .active-beat-controls .control-btn`).first());
    await answerNotice(page, plan.action);
    const draft = page.locator('.app-visual-view:not([hidden]) input.control-numeric-input, .app-linear-view:not([hidden]) input.control-numeric-input').first();
    await typeNumber(page, draft, target, plan.action, plan.name);
    await chooseButton(page, 'Try this problem again', plan.action);
    ensure(await page.locator(`.app-${plan.view}-view:not([hidden]) .active-beat-controls .control-btn`).count() === 1, `${plan.name}: Retry did not reset the active item`);
    ensure(await page.locator('.app-visual-view:not([hidden]) input.control-numeric-input, .app-linear-view:not([hidden]) input.control-numeric-input').count() === 0, `${plan.name}: Retry retained a dirty response draft`);
  }

  const reducedMotionEvidence = await page.evaluate(() => ({
    preference: matchMedia('(prefers-reduced-motion: reduce)').matches,
    reducedTracks: document.querySelectorAll('.fraction-bar-track.reduced-motion').length,
  }));
  evidence.journeys.push({ name: plan.name, target, condition: plan.condition, support: plan.support, view: plan.view, action: plan.action, motion: plan.motion, viewport: plan.viewport, reachedViaNext: true, focusAfterNext: startFocus, reducedMotionEvidence });

  const exerciseOptions = {
    collect: true,
    recovery: plan.name.startsWith('premise-'),
    help: plan.name.startsWith('premise-24'),
    replay: plan.name.startsWith('matching-24'),
    wrongPremise: plan.condition === 'phase2-bundle-4',
  };
  await completeItem(page, newItem, target, plan, exerciseOptions);
  const exhaustButtonCount = await page.locator('.app-next-button:not([hidden])').count();
  const exhaustionText = await page.locator('.app-navigation-notice').textContent();
  ensure(exhaustButtonCount === 0, `${plan.name}: final item still exposes Next`);
  if (exhaustionText?.includes('every problem')) evidence.exhaustionObserved = true;
  await saveScreenshot(page, plan, 'exhaustion');
  const leakedAnswer = await page.evaluate(() => {
    const root = document.querySelector('.fractionflow-app');
    const forbidden = /one-sixth-plus-one-fourth|correctPosition|expectedResponse|isEquivalent|R-CORRECT|R-KEEP-NUMERATOR|R-ADJACENT-UNIT/;
    return [...root.querySelectorAll('*')].some((element) => {
      const text = element.textContent || '';
      const attrs = [...element.attributes].map((attribute) => attribute.value).join(' ');
      return forbidden.test(text) || forbidden.test(attrs);
    });
  });
  ensure(!leakedAnswer, `${plan.name}: authored correctness metadata leaked into mounted learner DOM`);
  evidence.journeys.at(-1).answerLeakScanPassed = true;
  evidence.journeys.at(-1).horizontalOverflow = evidence.measurements
    .filter((measurement) => measurement.journey === plan.name)
    .some((measurement) => measurement.scroll.horizontalOverflow);
  evidence.journeys.at(-1).verticalScrollObserved = evidence.measurements
    .filter((measurement) => measurement.journey === plan.name)
    .some((measurement) => measurement.scroll.verticalOverflow);

  await chooseButton(page, 'Back to start', plan.action);
  ensure(await page.locator('.app-entry-title').isVisible(), `${plan.name}: return did not reach entry`);
  await actionFor(page, plan.action)(page.locator('.app-practice-button'));
  const first = instanceFor(oldItems[0]);
  if (plan.view === 'visual') {
    const reentryLeft = page.locator(`.app-${plan.view}-view .fraction-bar-container[data-side="left"] .fraction-bar-track`);
    ensure(await reentryLeft.getAttribute('data-numerator') === first.operands.left.initialForm.numerator, `${plan.name}: re-entry did not restore first item`);
  } else {
    const text = (await page.locator(`.app-${plan.view}-view`).innerText()).replace(/\s+/g, ' ');
    const { numerator, denominator } = first.operands.left.initialForm;
    ensure(text.includes(`${numerator} ${denominator}`), `${plan.name}: linear re-entry did not restore the first item`);
  }
  evidence.journeys.at(-1).returnAndReentryPassed = true;
  await context.close();
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  await fs.rm(path.join(outputDir, 'matching-24-high-visual-touch-360x752-replay-24-left-conversion-360x752.png'), { force: true });
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}/FractionFlow/`;
  const launch = { headless: true };
  if (process.platform === 'win32' && fsSync.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')) {
    launch.channel = 'msedge';
  }
  let browser = null;
  try {
    browser = await chromium.launch(launch);
    evidence.browser = { engine: 'Chromium via Playwright', channel: launch.channel ?? 'bundled Chromium' };
    for (const plan of plans) await runJourney(browser, baseUrl, plan);
  } finally {
    if (browser) await browser.close();
    server.close();
  }
  evidence.aggregateGeometry = {
    horizontalOverflowCount: evidence.measurements.filter((entry) => entry.scroll.horizontalOverflow).length,
    verticalOverflowCount: evidence.measurements.filter((entry) => entry.scroll.verticalOverflow).length,
    screenshotCount: evidence.screenshots.length,
  };
  const outputPath = path.join(outputDir, 'measurements.json');
  await fs.writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify({ outputPath, routeCount: evidence.journeys.length, nextWitnesses: evidence.actualNextReach.length, screenshotCount: evidence.screenshots.length, measurementCount: evidence.measurements.length, aggregateGeometry: evidence.aggregateGeometry }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
