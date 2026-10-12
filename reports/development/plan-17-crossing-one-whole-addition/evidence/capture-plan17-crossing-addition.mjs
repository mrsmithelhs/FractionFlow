import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PRACTICE_TYPES } from '../../../../src/app/practice-types.js';
import { REGISTERED_CONDITIONS } from '../../../../src/app/conditions.js';
import { resolveAuthoredContent } from '../../../../src/content/authored-content-catalog.js';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('../../../../scripts/dev/run-route-matrix.js');
const outputDir = path.dirname(fileURLToPath(import.meta.url));
const evidenceDir = path.join(outputDir, 'captures');
await fs.mkdir(evidenceDir, { recursive: true });

const practice = PRACTICE_TYPES.find((candidate) => candidate.id === 'sum-under-one');
const crossingItem = practice.items.at(-1);
const crossing = resolveAuthoredContent(crossingItem.fixtureId, crossingItem.authoringRevision);
const left = crossing.fixture.left;
const right = crossing.fixture.right;
const crossingTargets = ['12', '24'];
const routeBaseline = '2252458a767a322b23946b701085958eafc2fb0f9c416d4a8c3ee4c6bafa8cbd';

function numerators(target) {
  const d = BigInt(target);
  const l = BigInt(left.numerator) * d / BigInt(left.denominator);
  const r = BigInt(right.numerator) * d / BigInt(right.denominator);
  return { l: l.toString(), r: r.toString(), sum: (l + r).toString() };
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function localCaptureDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

async function clickVisible(locator) {
  await locator.waitFor({ state: 'visible' });
  await locator.click();
}

async function tabTo(page, locator, maxTabs = 60) {
  for (let presses = 1; presses <= maxTabs; presses += 1) {
    await page.keyboard.press('Tab');
    if (await locator.evaluate((element) => document.activeElement === element)) return presses;
  }
  throw new Error(`Sequential Tab navigation did not reach ${await locator.evaluate((element) => `${element.tagName}.${element.className}`)}`);
}

async function submitNumber(view, value) {
  const field = view.locator('.active-beat-controls input.control-numeric-input');
  await field.waitFor({ state: 'visible' });
  await field.fill(String(value));
  await field.press('Enter');
}

async function chooseDenominator(view, support, target) {
  if (support === 'high') {
    await clickVisible(view.locator('.active-beat-controls .control-choice-btn').filter({ hasText: new RegExp(`^${target}$`) }));
  } else {
    await submitNumber(view, target);
  }
}

async function chooseDenominatorByTab(page, view, support, target) {
  if (support === 'high') {
    const option = view.locator('.active-beat-controls .control-choice-btn').filter({ hasText: new RegExp(`^${target}$`) });
    await tabTo(page, option);
    await page.keyboard.press('Enter');
  } else {
    const input = view.locator('.active-beat-controls input.control-numeric-input');
    await tabTo(page, input);
    await page.keyboard.type(String(target));
    await page.keyboard.press('Enter');
  }
}

async function finishPriorItem(page, item, support, condition) {
  const content = resolveAuthoredContent(item.fixtureId, item.authoringRevision);
  const target = item.targetDenominators[0];
  const { l, r, sum } = (() => {
    const d = BigInt(target);
    const a = BigInt(content.fixture.left.numerator) * d / BigInt(content.fixture.left.denominator);
    const b = BigInt(content.fixture.right.numerator) * d / BigInt(content.fixture.right.denominator);
    return { l: a.toString(), r: b.toString(), sum: (a + b).toString() };
  })();
  const visual = page.locator('.app-visual-view');
  await clickVisible(visual.locator('.active-beat-controls .control-btn').first());
  await clickVisible(visual.locator('.active-beat-controls .control-choice-btn').filter({ hasText: /different sizes/i }));
  await chooseDenominator(visual, support, target);
  await submitNumber(visual, l);
  await submitNumber(visual, r);
  await submitNumber(visual, sum);
  await clickVisible(visual.locator('.active-beat-controls .control-btn').first());
  if (condition.activeCondition.connectionMaking === 'CM-01-P') {
    const answer = content.premiseChecks[target].expectedResponse;
    const label = answer === 'yes' ? 'Yes, it is the same amount' : 'No, the amount changed';
    await clickVisible(visual.locator(`.active-beat-controls .control-choice-btn[aria-label="${label}"]`));
  } else {
    const leftNumerator = BigInt(content.fixture.left.numerator) * BigInt(target) / BigInt(content.fixture.left.denominator);
    await clickVisible(visual.locator(`.active-beat-controls .matching-choice-btn[aria-label="Bar with ${leftNumerator} of ${target} equal parts shaded"]`));
  }
}

async function reachCrossingItem(page, support, condition) {
  await clickVisible(page.locator('.app-gear-button'));
  await clickVisible(page.locator(`[data-condition-id="${condition.id}"]`));
  await clickVisible(page.locator('.app-gear-button'));
  await clickVisible(page.locator(`[data-support-id="${support}-support"]`));
  await clickVisible(page.locator('.app-practice-button'));
  for (const item of practice.items.slice(0, -1)) {
    await finishPriorItem(page, item, support, condition);
    await clickVisible(page.locator('.app-next-button'));
  }
  const leftBar = page.locator('.app-visual-view .fraction-bar-container[data-side="left"]');
  const rightBar = page.locator('.app-visual-view .fraction-bar-container[data-side="right"]');
  await leftBar.waitFor({ state: 'visible' });
  const observedLeft = await leftBar.getAttribute('aria-label');
  const observedRight = await rightBar.getAttribute('aria-label');
  assert(observedLeft?.includes('2 of 3 equal parts shaded') && observedRight?.includes('3 of 4 equal parts shaded'),
    `Next route did not reach Plan 17 for ${support}/${condition.id}; observed ${observedLeft}; ${observedRight}`);
}

async function selectReflection(page, viewName, target) {
  const view = page.locator(`.app-${viewName}-view`);
  const premise = REGISTERED_CONDITIONS.find((entry) => entry.id === page.__plan17Condition)
    ?.activeCondition.connectionMaking === 'CM-01-P';
  if (premise) {
    const answer = crossing.premiseChecks[target].expectedResponse;
    const label = answer === 'yes' ? 'Yes, it is the same amount' : 'No, the amount changed';
    await clickVisible(view.locator(`.active-beat-controls .control-choice-btn[aria-label="${label}"]`));
    return;
  }
  const { l } = numerators(target);
  const label = viewName === 'linear'
    ? `Fraction ${l} over ${target} shows a shaded amount`
    : `Bar with ${l} of ${target} equal parts shaded`;
  const className = viewName === 'linear' ? '.linear-matching-choice-btn' : '.matching-choice-btn';
  await clickVisible(view.locator(`.active-beat-controls ${className}[aria-label="${label}"]`));
}

async function measure(page, meta, target) {
  await page.locator(`.app-${meta.view}-view .active-beat-prompt`).first().scrollIntoViewIfNeeded().catch(() => {});
  await page.locator(`.app-${meta.view}-view .active-beat-controls`).first().scrollIntoViewIfNeeded().catch(() => {});
  return page.evaluate(({ meta, target }) => {
    const rect = (element) => {
      if (!element) return null;
      const r = element.getBoundingClientRect();
      return Object.fromEntries(['left', 'top', 'right', 'bottom', 'width', 'height'].map((key) => [key, Math.round(r[key] * 100) / 100]));
    };
    const view = document.querySelector(`.app-${meta.view}-view`);
    const question = view.querySelector('.active-beat-prompt');
    const controls = view.querySelector('.active-beat-controls');
    const stack = view.querySelector('.fraction-bar-multi-whole-stack, .linear-result-stack');
    const rows = [...(stack?.querySelectorAll('.fraction-bar-multi-whole-row, .linear-result-stack-row') || [])];
    const tracks = [...(stack?.querySelectorAll('.fraction-bar-multi-whole-track, .linear-result-stack-row .fraction-bar-track') || [])];
    const segments = tracks.map((track) => [...track.children].map((segment) => ({
      width: rect(segment)?.width,
      shaded: segment.classList.contains('shaded'),
    })));
    const documentWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth);
    const documentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    return {
      ...meta,
      targetDenominator: target,
      viewport: { width: innerWidth, height: innerHeight },
      question: rect(question),
      controls: rect(controls),
      stack: rect(stack),
      rowBounds: rows.map(rect),
      trackBounds: tracks.map(rect),
      segments,
      horizontalOverflow: documentWidth > innerWidth,
      scrollHeight: documentHeight,
      scrollY,
      scrollMax: Math.max(0, documentHeight - innerHeight),
      activeElement: document.activeElement?.tagName || null,
      questionReachable: !!question && question.getBoundingClientRect().bottom > 0 && question.getBoundingClientRect().top < innerHeight,
      controlsReachable: !!controls && controls.getBoundingClientRect().bottom > 0 && controls.getBoundingClientRect().top < innerHeight,
    };
  }, { meta, target });
}

async function checkPreAnswerWithholding(page, target, scenarioId) {
  const view = page.locator('.app-visual-view');
  const sums = numerators(target);
  const rawAnswer = `${sums.sum}/${target}`;
  const whole = `${target}/${target}`;
  const remainder = `${BigInt(sums.sum) - BigInt(target)}/${target}`;
  const forbiddenForms = [rawAnswer, whole, remainder, `${sums.sum}/${target === '12' ? '24' : '12'}`];
  const forbidden = await page.evaluate((forms) => {
    const textContent = document.body.textContent || '';
    const visibleText = document.body.innerText || '';
    const attributeFindings = [];
    let structuralBoundaryExclusions = 0;
    for (const element of document.querySelectorAll('*')) {
      for (const attribute of [...element.attributes]) {
        const isHiddenGridBoundary = attribute.name === 'data-boundary-key'
          && element.classList.contains('fraction-bar-boundary')
          && element.getAttribute('aria-hidden') === 'true';
        if (isHiddenGridBoundary) {
          if (forms.includes(attribute.value)) structuralBoundaryExclusions += 1;
          continue;
        }
        if (forms.some((form) => attribute.value.includes(form))) {
          attributeFindings.push({ element: `${element.tagName.toLowerCase()}.${String(element.className || '').trim().replace(/\s+/g, '.')}`, name: attribute.name, value: attribute.value });
        }
      }
    }
    return {
      stackCount: document.querySelectorAll('.fraction-bar-multi-whole-stack, .linear-result-stack').length,
      forbiddenFormsInDomText: forms.filter((form) => textContent.includes(form)),
      forbiddenFormsInVisibleText: forms.filter((form) => visibleText.includes(form)),
      forbiddenFormAttributes: attributeFindings,
      structuralBoundaryExclusions,
      hiddenLabels: [...document.querySelectorAll('[aria-label],[aria-description],[title]')]
        .map((element) => [element.getAttribute('aria-label'), element.getAttribute('aria-description'), element.title].join(' '))
        .filter((label) => forms.some((form) => label.includes(form))),
      liveRegions: [...document.querySelectorAll('[aria-live],[role="alert"],[role="status"]')]
        .map((element) => element.textContent || '')
        .filter((text) => forms.some((form) => text.includes(form))),
      formValues: [...document.querySelectorAll('input,textarea,select')]
        .map((element) => element.value || element.getAttribute('value') || '')
        .filter((value) => forms.some((form) => value.includes(form))),
    };
  }, [...forbiddenForms, `${target} of ${target} equal parts`, `${BigInt(sums.sum) - BigInt(target)} of ${target} equal parts`]);
  assert(forbidden.stackCount === 0 && forbidden.forbiddenFormsInDomText.length === 0
    && forbidden.forbiddenFormsInVisibleText.length === 0 && forbidden.hiddenLabels.length === 0
    && forbidden.forbiddenFormAttributes.length === 0
    && forbidden.liveRegions.length === 0 && forbidden.formValues.length === 0,
    `${scenarioId}: result data leaked before a correct answer: ${JSON.stringify(forbidden)}`);
  return forbidden;
}

async function mountedStackWitness(page, viewName, target) {
  const data = await page.evaluate(({ viewName, target, sum }) => {
    const view = document.querySelector(`.app-${viewName}-view`);
    if (viewName === 'linear') {
      const stack = view.querySelector('.linear-result-stack');
      return { kind: 'linear', label: stack?.getAttribute('aria-label') || '', rows: [...(stack?.querySelectorAll('.linear-result-stack-row') || [])].map((row) => row.textContent.trim()), raw: `${sum} over ${target}` };
    }
    const stack = view.querySelector('.fraction-bar-multi-whole-stack');
    const rows = [...(stack?.querySelectorAll('.fraction-bar-multi-whole-row') || [])];
    return {
      kind: 'visual',
      label: stack?.getAttribute('aria-label') || '',
      rows: rows.map((row) => {
        const track = row.querySelector('.fraction-bar-multi-whole-track');
        const rect = row.getBoundingClientRect();
        const segments = [...(track?.children || [])];
        return { width: rect.width, unitCount: segments.length, shaded: segments.filter((segment) => segment.classList.contains('shaded')).length };
      }),
      raw: `${sum} over ${target}`,
    };
  }, { viewName, target, sum: numerators(target).sum });
  assert(data.label.includes(data.raw), `${viewName}: raw improper result form is absent from its accessible/readable summary`);
  assert(data.rows.length === 2, `${viewName}: expected both whole rows, observed ${data.rows.length}`);
  if (viewName === 'visual') {
    const remainder = Number(BigInt(numerators(target).sum) - BigInt(target));
    assert(Math.abs(data.rows[0].width - data.rows[1].width) < 1, 'visual stack wholes have unequal widths');
    assert(data.rows.every((row) => row.unitCount === Number(target)), 'visual stack rows do not share the requested equal subdivisions');
    assert(data.rows[0].shaded === Number(target) && data.rows[1].shaded === remainder, 'visual stack shading does not show the exact whole and remainder');
  } else {
    const remainder = Number(BigInt(numerators(target).sum) - BigInt(target));
    assert(data.rows[0] === `${target} of ${target} equal parts` && data.rows[1] === `${remainder} of ${target} equal parts`, 'linear stack does not expose exact row quantities');
  }
  return data;
}

async function runMountedFalsifications(page, scenario, target) {
  if (scenario.view !== 'visual') return {};
  const result = {};
  const stack = page.locator('.app-visual-view .fraction-bar-multi-whole-stack').first();
  const rows = stack.locator('.fraction-bar-multi-whole-row');
  const remainder = rows.nth(1);
  const fullStack = await stack.evaluate((element) => element.outerHTML);
  await remainder.evaluate((element) => element.remove());
  try { await mountedStackWitness(page, 'visual', target); }
  catch { result.rejectsTruncatedRemainder = true; }
  finally { await stack.evaluate((element, html) => { element.outerHTML = html; }, fullStack); }
  assert(result.rejectsTruncatedRemainder, `${scenario.id}: mounted witness accepted one-whole truncation`);
  const restoredRows = page.locator('.app-visual-view .fraction-bar-multi-whole-row');
  const secondWhole = restoredRows.nth(1);
  const oldWidth = await secondWhole.evaluate((element) => element.style.width);
  await secondWhole.evaluate((element) => { element.style.width = '60%'; });
  try { await mountedStackWitness(page, 'visual', target); }
  catch { result.rejectsResizedSecondWhole = true; }
  finally { await secondWhole.evaluate((element, width) => { element.style.width = width; }, oldWidth); }
  assert(result.rejectsResizedSecondWhole, `${scenario.id}: mounted witness accepted a resized second whole`);
  const secondTrack = restoredRows.nth(0).locator('.fraction-bar-multi-whole-track');
  const firstSegment = secondTrack.locator(':scope > *').first();
  await firstSegment.evaluate((element) => element.classList.remove('shaded'));
  try { await mountedStackWitness(page, 'visual', target); }
  catch { result.rejectsCorruptRenderedFact = true; }
  finally { await firstSegment.evaluate((element) => element.classList.add('shaded')); }
  assert(result.rejectsCorruptRenderedFact, `${scenario.id}: mounted witness accepted a corrupted rendered fact`);
  await mountedStackWitness(page, 'visual', target);
  result.restoredWitnessPasses = true;
  return result;
}

async function runScenario(browser, serverUrl, scenario) {
  const context = await browser.newContext({
    viewport: { width: 360, height: scenario.height },
    hasTouch: scenario.interaction === 'touch',
    reducedMotion: scenario.reducedMotion ? 'reduce' : 'no-preference',
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  page.__plan17Condition = scenario.condition;
  await page.goto(serverUrl);
  await reachCrossingItem(page, scenario.support, REGISTERED_CONDITIONS.find((entry) => entry.id === scenario.condition));
  const view = page.locator(`.app-${scenario.view}-view`);
  if (scenario.view === 'linear') await clickVisible(page.locator('.app-view-toggle'));
  const denominator = scenario.target;
  const { l, r, sum } = numerators(denominator);
  const help = view.locator('.active-beat-controls .app-secondary-button');
  let helpCopy = null;
  await clickVisible(view.locator('.active-beat-controls .control-btn').first());
  await clickVisible(view.locator('.active-beat-controls .control-choice-btn').filter({ hasText: /different sizes/i }));

  if (await help.count()) {
    await clickVisible(help);
    helpCopy = (await page.locator('.active-denominator-help-cue').textContent())?.trim() || '';
    assert(Boolean(helpCopy), `${scenario.id}: denominator help content is missing`);
    await clickVisible(page.locator('.app-secondary-button').filter({ hasText: /close help/i }));
  }

  if (scenario.interaction === 'keyboard') await chooseDenominatorByTab(page, view, scenario.support, denominator);
  else if (scenario.interaction === 'touch') await view.locator('.active-beat-controls .control-choice-btn').filter({ hasText: new RegExp(`^${denominator}$`) }).tap();
  else await chooseDenominator(view, scenario.support, denominator);

  await submitNumber(view, l);
  await submitNumber(view, r);
  const withhold = await checkPreAnswerWithholding(page, denominator, scenario.id);
  const wrong = String(BigInt(sum) + 1n);
  await submitNumber(view, wrong);
  const recovery = (await view.locator('.recovery-feedback').textContent())?.trim() || '';
  assert(recovery.length > 0, `${scenario.id}: incorrect learner answer did not produce recovery`);
  await checkPreAnswerWithholding(page, denominator, `${scenario.id} after wrong answer`);
  const hiddenSiblingSeed = await page.evaluate((answer) => {
    const host = document.querySelector('.app-linear-view');
    const seed = document.createElement('div');
    seed.className = 'linear-result-stack';
    seed.id = 'plan17-hidden-result-seed';
    seed.setAttribute('aria-label', `seeded result ${answer}`);
    seed.setAttribute('data-answer', answer);
    seed.textContent = `seeded result ${answer}`;
    host.appendChild(seed);
    return seed.id;
  }, `${sum}/${denominator}`);
  let hiddenLeakRejected = false;
  let hiddenLeakDiagnostic = '';
  try { await checkPreAnswerWithholding(page, denominator, `${scenario.id} hidden sibling seed`); }
  catch (error) { hiddenLeakRejected = true; hiddenLeakDiagnostic = error.message; }
  finally { await page.evaluate((seedId) => document.getElementById(seedId)?.remove(), hiddenSiblingSeed); }
  assert(hiddenLeakRejected, `${scenario.id}: mounted withholding witness accepted result data in a hidden sibling`);
  await checkPreAnswerWithholding(page, denominator, `${scenario.id} restored hidden sibling`);
  const tabRecovery = [];
  if (scenario.interaction === 'keyboard') {
    const recoveryTarget = page.locator('.app-return-button');
    for (let index = 0; index < 60; index += 1) {
      await page.keyboard.press('Tab');
      tabRecovery.push(await page.evaluate(() => {
        const active = document.activeElement;
        return active ? `${active.tagName.toLowerCase()}${active.id ? `#${active.id}` : ''}.${String(active.className || '').trim().replace(/\s+/g, '.')}` : null;
      }));
      if (await recoveryTarget.evaluate((element) => document.activeElement === element)) break;
    }
    assert(await recoveryTarget.evaluate((element) => document.activeElement === element), `${scenario.id}: sequential Tab navigation did not reach Return after recovery`);
  }

  await submitNumber(view, sum);
  await view.locator('.fraction-bar-multi-whole-stack, .linear-result-stack').first().waitFor({ state: 'visible' });
  const accepted = await measure(page, { ...scenario, stage: 'accepted-total' }, denominator);
  assert(accepted.rowBounds.length === 2, `${scenario.id}: accepted result did not show both whole rows`);
  const stackFact = await mountedStackWitness(page, scenario.view, denominator);
  const falsification = await runMountedFalsifications(page, scenario, denominator);
  await fs.writeFile(path.join(evidenceDir, `${scenario.id}-accepted.png`), await page.screenshot());

  await clickVisible(view.locator('.active-beat-controls .control-btn').first());
  await view.locator('.active-beat-prompt').waitFor({ state: 'visible' });
  const reflection = await measure(page, { ...scenario, stage: 'reflection' }, denominator);
  await fs.writeFile(path.join(evidenceDir, `${scenario.id}-reflection.png`), await page.screenshot());
  const replay = page.locator('.app-support-controls .app-secondary-button').filter({ hasText: /replay/i });
  if (await replay.count()) {
    await clickVisible(replay);
    await view.locator('.app-done-looking-button').waitFor({ state: 'visible' });
    const replayState = await measure(page, { ...scenario, stage: 'replay' }, denominator);
    await fs.writeFile(path.join(evidenceDir, `${scenario.id}-replay.png`), await page.screenshot());
    await clickVisible(view.locator('.app-done-looking-button'));
    assert(await view.locator('.active-beat-prompt').isVisible(), `${scenario.id}: Replay did not return to reflection`);
    const premiseReflection = REGISTERED_CONDITIONS.find((entry) => entry.id === scenario.condition)
      ?.activeCondition.connectionMaking === 'CM-01-P';
    if (premiseReflection) {
      const comparison = scenario.view === 'visual' ? '.premise-comparison' : '.linear-premise-comparison';
      assert(await view.locator(comparison).count() > 0, `${scenario.id}: Replay dismissal did not restore the premise comparison`);
      assert(await view.locator('.fraction-bar-multi-whole-stack, .linear-result-stack').count() === 0,
        `${scenario.id}: premise reflection accumulated the result stack with its comparison`);
    } else {
      assert(await view.locator('.fraction-bar-multi-whole-stack, .linear-result-stack').count() === 1,
        `${scenario.id}: Replay dismissal did not restore the matching result stack`);
    }
    await selectReflection(page, scenario.view, denominator);
    const resetButton = page.locator('.app-restart-button');
    await clickVisible(resetButton);
    const resetWithholding = await checkPreAnswerWithholding(page, denominator, `${scenario.id} reset`);
    return { scenario, withhold, helpCopy, recovery, hiddenLeakRejected, hiddenLeakDiagnostic, tabRecovery, accepted, stackFact, falsification, reflection, replay: replayState, resetWithholding };
  }
  throw new Error(`${scenario.id}: Replay control is missing`);
}

const server = createStaticServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const serverUrl = `http://127.0.0.1:${server.address().port}/FractionFlow/`;
const options = { headless: true };
if (process.platform === 'win32' && fsSync.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')) options.channel = 'msedge';
const browser = await chromium.launch(options);
const measurements = {
  captureDate: localCaptureDate(),
  setRevision: practice.setRevision,
  baselineRouteMatrixSha256: routeBaseline,
  route: 'learner practice goal -> completion-gated Next through ten existing items -> Plan 17 item 11',
  scenarios: [],
  falsification: {},
};
const scenarioLimit = process.env.PLAN17_SCENARIO_LIMIT
  ? Number.parseInt(process.env.PLAN17_SCENARIO_LIMIT, 10)
  : Number.POSITIVE_INFINITY;
const scenarioOffset = process.env.PLAN17_SCENARIO_OFFSET
  ? Number.parseInt(process.env.PLAN17_SCENARIO_OFFSET, 10)
  : 0;

try {
  let serial = 0;
  for (const target of crossingTargets) {
    for (const condition of REGISTERED_CONDITIONS) {
      for (const support of ['high', 'medium']) {
        serial += 1;
        const view = serial % 2 ? 'visual' : 'linear';
        const height = serial % 2 ? 740 : 752;
        const scenario = {
          id: `plan17-${target}-${condition.id}-${support}-${view}-${height}`,
          target,
          condition: condition.id,
          support,
          view,
          height,
          interaction: serial === 1 ? 'touch' : serial === 2 ? 'keyboard' : 'pointer',
          reducedMotion: serial % 3 === 0,
        };
        if (serial <= scenarioOffset) continue;
        measurements.scenarios.push(await runScenario(browser, serverUrl, scenario));
        await fs.writeFile(path.join(evidenceDir, 'measurements.json'), `${JSON.stringify(measurements, null, 2)}\n`);
        if (measurements.scenarios.length >= scenarioLimit) break;
      }
      if (measurements.scenarios.length >= scenarioLimit) break;
    }
    if (measurements.scenarios.length >= scenarioLimit) break;
  }
  await fs.writeFile(path.join(evidenceDir, 'measurements.json'), `${JSON.stringify(measurements, null, 2)}\n`);
} finally {
  await browser.close();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
