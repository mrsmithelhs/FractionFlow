import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { PRACTICE_TYPES } from '../../../../src/app/practice-types.js';
import { REGISTERED_CONDITIONS } from '../../../../src/app/conditions.js';
import { resolveAuthoredContent } from '../../../../src/content/authored-content-catalog.js';
import { addAtCommonDenominator, convertToDenominator, improperToMixed } from '../../../../src/math/index.js';
import { fractionToWire, formToWire, wireToForm } from '../../../../src/content/schema.js';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('../../../../scripts/dev/run-route-matrix.js');
const outputDir = path.dirname(fileURLToPath(import.meta.url));
const evidenceDir = path.join(outputDir, 'captures');
await fs.mkdir(evidenceDir, { recursive: true });

const practice = PRACTICE_TYPES.find((candidate) => candidate.id === 'sum-under-one');
const crossingItem = practice.items.at(-1);
const crossing = resolveAuthoredContent(crossingItem.fixtureId, crossingItem.authoringRevision);
const crossingTargets = ['12', '24'];
const routeBaselineCommit = '76039520d9bfc1c8b2c4b102ca39975fc7a87466';
const expectedBaselineFileSha256 = '2252458a767a322b23946b701085958eafc2fb0f9c416d4a8c3ee4c6bafa8cbd';
const expectedBaselinePrefixCanonicalSha256 = '861c315fa1cff3a3e3daa949c53c41a27d7bf27ba54a0981b02a5bd3f0e87650';
const baselineMatrixText = execFileSync('git', ['show', `${routeBaselineCommit}:tests/routes/route-matrix.json`], { encoding: 'utf8' });
const baselineMatrix = JSON.parse(baselineMatrixText);
const baselineFileSha256 = createHash('sha256').update(baselineMatrixText).digest('hex');
const baselinePrefixCanonicalSha256 = createHash('sha256').update(JSON.stringify(baselineMatrix.routes)).digest('hex');
assert(baselineFileSha256 === expectedBaselineFileSha256, 'pinned pre-implementation route file bytes do not match the approved hash');
assert(baselinePrefixCanonicalSha256 === expectedBaselinePrefixCanonicalSha256, 'pinned pre-implementation route objects do not match the approved canonical hash');
const currentMatrixText = fsSync.readFileSync(path.resolve(outputDir, '../../../../tests/routes/route-matrix.json'), 'utf8');
const currentMatrix = JSON.parse(currentMatrixText);
const currentPrefixCanonicalSha256 = createHash('sha256').update(JSON.stringify(currentMatrix.routes.slice(0, baselineMatrix.routes.length))).digest('hex');
assert(JSON.stringify(currentMatrix.routes.slice(0, baselineMatrix.routes.length)) === JSON.stringify(baselineMatrix.routes), 'a pre-Plan17 route object changed');
assert(currentPrefixCanonicalSha256 === expectedBaselinePrefixCanonicalSha256, 'current original-route prefix canonical hash changed');
const currentFileSha256 = createHash('sha256').update(currentMatrixText).digest('hex');

function pathFacts(fixture, target) {
  const denominator = BigInt(target);
  const left = wireToForm(fixture.left);
  const right = wireToForm(fixture.right);
  const leftAtPath = convertToDenominator(left, denominator);
  const rightAtPath = convertToDenominator(right, denominator);
  const result = convertToDenominator(addAtCommonDenominator(left, right, denominator), denominator);
  const resultWire = fractionToWire(result);
  return {
    left: fractionToWire(leftAtPath),
    right: fractionToWire(rightAtPath),
    result: resultWire,
    mixed: formToWire(improperToMixed(result)),
  };
}

function numerators(target) {
  const facts = pathFacts(crossing.fixture, target);
  return { l: facts.left.numerator, r: facts.right.numerator, sum: facts.result.numerator, facts };
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

async function activateLearnerControl(page, locator, interaction, keyboardActions = []) {
  await locator.waitFor({ state: 'visible' });
  const label = await locator.getAttribute('aria-label') || await locator.textContent();
  if (interaction === 'keyboard') {
    const tabCount = await tabTo(page, locator);
    await page.keyboard.press('Enter');
    keyboardActions.push({ action: 'activate', tabCount, target: label });
  } else if (interaction === 'touch') {
    await locator.tap();
    keyboardActions.push({ action: 'touch-activate', target: label });
  } else {
    await locator.click();
  }
}

async function enterLearnerNumber(page, view, value, interaction, keyboardActions = []) {
  const field = view.locator('.active-beat-controls input.control-numeric-input').first();
  await field.waitFor({ state: 'visible' });
  if (interaction === 'keyboard') {
    const tabCount = await tabTo(page, field);
    await page.keyboard.type(String(value));
    await page.keyboard.press('Enter');
    keyboardActions.push({ action: 'submit-number', tabCount, value: String(value) });
  } else if (interaction === 'touch') {
    await field.tap();
    // Playwright supplies the numeric text; the captured touch evidence covers
    // tapping the mounted field/control, not native on-screen keyboard typing.
    await field.fill(String(value));
    await field.press('Enter');
    keyboardActions.push({ action: 'touch-input-tooling', value: String(value) });
  } else {
    await field.fill(String(value));
    await field.press('Enter');
  }
  return field;
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
  const facts = pathFacts(content.fixture, target);
  const { numerator: l } = facts.left;
  const { numerator: r } = facts.right;
  const { numerator: sum } = facts.result;
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
    await clickVisible(visual.locator(`.active-beat-controls .matching-choice-btn[aria-label="Bar with ${facts.left.numerator} of ${target} equal parts shaded"]`));
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

async function selectReflection(page, viewName, target, interaction = 'pointer', keyboardActions = []) {
  const view = page.locator(`.app-${viewName}-view`);
  const premise = REGISTERED_CONDITIONS.find((entry) => entry.id === page.__plan17Condition)
    ?.activeCondition.connectionMaking === 'CM-01-P';
  if (premise) {
    const answer = crossing.premiseChecks[target].expectedResponse;
    const label = answer === 'yes' ? 'Yes, it is the same amount' : 'No, the amount changed';
    await activateLearnerControl(page, view.locator(`.active-beat-controls .control-choice-btn[aria-label="${label}"]`), interaction, keyboardActions);
    return;
  }
  const { l } = numerators(target);
  const label = viewName === 'linear'
    ? `Fraction ${l} over ${target} shows a shaded amount`
    : `Bar with ${l} of ${target} equal parts shaded`;
  const className = viewName === 'linear' ? '.linear-matching-choice-btn' : '.matching-choice-btn';
  await activateLearnerControl(page, view.locator(`.active-beat-controls ${className}[aria-label="${label}"]`), interaction, keyboardActions);
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

async function measureTrackScale(page, stage, target) {
  return page.evaluate(({ stage, target }) => {
    const view = document.querySelector('.app-visual-view');
    const candidates = [
      ...view.querySelectorAll('.fraction-bar-container:not(.fraction-bar-container-persistent) .fraction-bar-track'),
      ...view.querySelectorAll('.fraction-bar-container-persistent .fraction-bar-track-persistent'),
      ...view.querySelectorAll('.fraction-bar-multi-whole-track'),
    ];
    const tracks = candidates.filter((track) => track.getBoundingClientRect().width > 0);
    const rect = (element) => {
      const bounds = element.getBoundingClientRect();
      return { width: Math.round(bounds.width * 100) / 100, height: Math.round(bounds.height * 100) / 100 };
    };
    return {
      stage,
      target,
      tracks: tracks.map((track) => ({
        ...rect(track),
        segmentWidths: [...track.querySelectorAll('.fraction-bar-segment')]
          .map((segment) => Math.round(segment.getBoundingClientRect().width * 100) / 100),
      })),
      runningAnimations: document.getAnimations({ subtree: true }).filter((animation) => animation.playState === 'running').length,
      scrollHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
      scrollY,
      horizontalOverflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) > innerWidth,
    };
  }, { stage, target });
}

async function waitForAnimationsToSettle(page) {
  await page.waitForFunction(
    () => document.getAnimations({ subtree: true }).every((animation) => animation.playState !== 'running'),
    null,
    { timeout: 6000 },
  );
}

function assertScaleConservation(lastConversion, operate, result, scenarioId) {
  const references = [lastConversion, operate, result];
  assert(references.every((entry) => entry.tracks.length === 2), `${scenarioId}: scale evidence did not contain both operand/result tracks`);
  const referenceWidths = references.flatMap((entry) => entry.tracks.map((track) => track.width));
  assert(Math.max(...referenceWidths) - Math.min(...referenceWidths) < 1,
    `${scenarioId}: whole scale changed across settled conversion, operate, or accepted result (${referenceWidths.join(', ')})`);
  const segmentWidths = references.flatMap((entry) => entry.tracks.flatMap((track) => track.segmentWidths));
  assert(Math.max(...segmentWidths) - Math.min(...segmentWidths) <= 1.1,
    `${scenarioId}: unit segment scale changed across settled conversion, operate, or accepted result`);
}

async function checkPreAnswerWithholding(page, target, scenarioId) {
  const view = page.locator('.app-visual-view');
  const { facts } = numerators(target);
  const { numerator: resultNumerator, denominator: resultDenominator } = facts.result;
  const { whole: mixedWhole, fraction } = facts.mixed;
  const rawAnswer = `${resultNumerator}/${resultDenominator}`;
  const wholeUnit = `${target}/${target}`;
  const remainder = `${fraction.numerator}/${fraction.denominator}`;
  const mixedFraction = `${mixedWhole} ${remainder}`;
  const mixedAnd = `${mixedWhole} and ${remainder}`;
  const cardinal = { '1': 'one', '2': 'two', '5': 'five', '10': 'ten' };
  const denominatorWord = { '12': 'twelfths', '24': 'twenty-fourths' }[fraction.denominator];
  const spokenForms = [
    `${resultNumerator} over ${resultDenominator}`,
    `${fraction.numerator} over ${fraction.denominator}`,
    `${mixedWhole} and ${fraction.numerator} over ${fraction.denominator}`,
    `${cardinal[mixedWhole]} and ${cardinal[fraction.numerator]} ${denominatorWord}`,
  ];
  const forbiddenForms = [rawAnswer, wholeUnit, remainder, mixedFraction, mixedAnd, ...spokenForms];
  const structuredForms = [rawAnswer, remainder, wholeUnit];
  const forbidden = await page.evaluate(({ forms, structured }) => {
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
    const structuredFractionFindings = [...document.querySelectorAll('.symbolic-fraction')]
      .map((element) => ({
        numerator: element.querySelector('.symbolic-numerator')?.textContent?.trim() || '',
        denominator: element.querySelector('.symbolic-denominator')?.textContent?.trim() || '',
        ariaLabel: element.getAttribute('aria-label') || '',
      }))
      .filter(({ numerator, denominator, ariaLabel }) => (
        structured.includes(`${numerator}/${denominator}`)
        || forms.some((form) => ariaLabel.includes(form))
      ));
    return {
      stackCount: document.querySelectorAll('.fraction-bar-multi-whole-stack, .linear-result-stack').length,
      forbiddenFormsInDomText: forms.filter((form) => textContent.includes(form)),
      forbiddenFormsInVisibleText: forms.filter((form) => visibleText.includes(form)),
      forbiddenFormAttributes: attributeFindings,
      structuredFractionFindings,
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
  }, {
    forms: [...forbiddenForms, `${target} of ${target} equal parts`, `${fraction.numerator} of ${target} equal parts`],
    structured: structuredForms,
  });
  assert(forbidden.stackCount === 0 && forbidden.forbiddenFormsInDomText.length === 0
    && forbidden.forbiddenFormsInVisibleText.length === 0 && forbidden.hiddenLabels.length === 0
    && forbidden.structuredFractionFindings.length === 0
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
    const remainder = Number(numerators(target).facts.mixed.fraction.numerator);
    assert(Math.abs(data.rows[0].width - data.rows[1].width) < 1, 'visual stack wholes have unequal widths');
    assert(data.rows.every((row) => row.unitCount === Number(target)), 'visual stack rows do not share the requested equal subdivisions');
    assert(data.rows[0].shaded === Number(target) && data.rows[1].shaded === remainder, 'visual stack shading does not show the exact whole and remainder');
  } else {
    const remainder = BigInt(numerators(target).facts.mixed.fraction.numerator);
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

async function runIndependentLeakSeeds(page, target, scenarioId) {
  const facts = numerators(target).facts;
  const result = {};
  const seeds = [
    {
      name: 'hidden-structured-fraction',
      markup: ({ n, d }) => `<span class="symbolic-fraction" aria-hidden="true"><span class="symbolic-numerator">${n}</span><span class="symbolic-bar"></span><span class="symbolic-denominator">${d}</span></span>`,
      form: facts.result,
    },
    {
      name: 'spoken-aria-form',
      markup: ({ n, d }) => `<span aria-label="${n} over ${d}"></span>`,
      form: facts.result,
    },
    {
      name: 'arbitrary-attribute-mixed-equivalent',
      markup: ({ whole, n, d }) => `<span data-answer="${whole} and ${n}/${d}"></span>`,
      form: facts.mixed,
    },
  ];
  for (const seed of seeds) {
    const id = `plan17-leak-seed-${seed.name}`;
    const seedMarkup = seed.markup({
      n: seed.form.kind === 'fraction' ? seed.form.numerator : seed.form.fraction.numerator,
      d: seed.form.kind === 'fraction' ? seed.form.denominator : seed.form.fraction.denominator,
      whole: seed.form.whole,
    });
    const seedId = await page.evaluate(({ id, markup }) => {
      const host = document.querySelector('.app-linear-view');
      const seedRoot = document.createElement('div');
      seedRoot.id = id;
      seedRoot.hidden = true;
      seedRoot.innerHTML = markup;
      host.appendChild(seedRoot);
      return id;
    }, { id, markup: seedMarkup });
    let diagnostic = '';
    let rejected = false;
    try { await checkPreAnswerWithholding(page, target, `${scenarioId} ${seed.name}`); }
    catch (error) { rejected = true; diagnostic = error.message; }
    finally { await page.evaluate((seedIdToRemove) => document.getElementById(seedIdToRemove)?.remove(), seedId); }
    assert(rejected, `${scenarioId}: pre-answer guard accepted independent ${seed.name} leakage`);
    await checkPreAnswerWithholding(page, target, `${scenarioId} restored ${seed.name}`);
    result[seed.name] = { rejected, diagnostic };
  }
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
  const keyboardActions = [];
  if (scenario.view === 'linear') await activateLearnerControl(page, page.locator('.app-view-toggle'), scenario.interaction, keyboardActions);
  const denominator = scenario.target;
  const { l, r, sum } = numerators(denominator);
  let rest = null;
  if (scenario.detailed) {
    rest = await measureTrackScale(page, 'rest-before-encounter-response', denominator);
    rest.layout = await measure(page, { ...scenario, stage: 'rest-before-encounter-response' }, denominator);
    await fs.writeFile(path.join(evidenceDir, `${scenario.id}-rest.png`), await page.screenshot());
  }
  const help = view.locator('.active-beat-controls .app-secondary-button');
  let helpCopy = null;
  await activateLearnerControl(page, view.locator('.active-beat-controls .control-btn').first(), scenario.interaction, keyboardActions);
  await activateLearnerControl(page, view.locator('.active-beat-controls .control-choice-btn').filter({ hasText: /different sizes/i }), scenario.interaction, keyboardActions);

  if (await help.count()) {
    await activateLearnerControl(page, help, scenario.interaction, keyboardActions);
    helpCopy = (await page.locator('.active-denominator-help-cue').textContent())?.trim() || '';
    assert(Boolean(helpCopy), `${scenario.id}: denominator help content is missing`);
    await activateLearnerControl(page, page.locator('.app-secondary-button').filter({ hasText: /close help/i }), scenario.interaction, keyboardActions);
  }

  if (scenario.support === 'high') {
    const option = view.locator('.active-beat-controls .control-choice-btn').filter({ hasText: new RegExp(`^${denominator}$`) });
    await activateLearnerControl(page, option, scenario.interaction, keyboardActions);
  } else {
    await enterLearnerNumber(page, view, denominator, scenario.interaction, keyboardActions);
  }

  await enterLearnerNumber(page, view, l, scenario.interaction, keyboardActions);
  let activeConversionReplay = null;
  let dismissedConversionReplay = null;
  if (scenario.detailed) {
    const draftField = view.locator('.active-beat-controls input.control-numeric-input').first();
    if (scenario.interaction === 'keyboard') {
      const tabCount = await tabTo(page, draftField);
      await page.keyboard.type(String(r));
      keyboardActions.push({ action: 'draft-right-conversion', tabCount, value: String(r) });
    } else if (scenario.interaction === 'touch') {
      await draftField.tap();
      await draftField.fill(String(r));
    } else {
      await draftField.fill(String(r));
    }
    const conversionReplay = page.locator('.app-support-controls .app-secondary-button').filter({ hasText: /replay/i });
    await activateLearnerControl(page, conversionReplay, scenario.interaction, keyboardActions);
    const replayReveal = view.locator('.fraction-bar-in-place-replay .fraction-bar-toggle-btn');
    await replayReveal.waitFor({ state: 'visible' });
    activeConversionReplay = await measureTrackScale(page, 'active-conversion-replay', denominator);
    activeConversionReplay.replayControlVisible = await replayReveal.isVisible();
    activeConversionReplay.draftValue = await view.locator('.active-beat-controls input.control-numeric-input').first().inputValue();
    assert(activeConversionReplay.draftValue === String(r), `${scenario.id}: active conversion Replay lost the draft before dismissal`);
    activeConversionReplay.layout = await measure(page, { ...scenario, stage: 'active-conversion-replay' }, denominator);
    await fs.writeFile(path.join(evidenceDir, `${scenario.id}-conversion-replay.png`), await page.screenshot());
    await activateLearnerControl(page, replayReveal, scenario.interaction, keyboardActions);
    const restoredDraftValue = await view.locator('.active-beat-controls input.control-numeric-input').first().inputValue();
    assert(restoredDraftValue === String(r), `${scenario.id}: Show new parts did not retain the right-conversion draft`);
    dismissedConversionReplay = await measureTrackScale(page, 'active-conversion-replay-dismissed', denominator);
    dismissedConversionReplay.showNewPartsActivated = true;
    dismissedConversionReplay.draftValue = restoredDraftValue;
    dismissedConversionReplay.layout = await measure(page, { ...scenario, stage: 'active-conversion-replay-dismissed' }, denominator);
    await fs.writeFile(path.join(evidenceDir, `${scenario.id}-conversion-replay-dismissed.png`), await page.screenshot());
  }
  await enterLearnerNumber(page, view, r, scenario.interaction, keyboardActions);

  let lastConversionImmediate = null;
  let lastConversionSettled = null;
  let operateBeforeAnswer = null;
  if (scenario.detailed) {
    lastConversionImmediate = await measureTrackScale(page, 'last-conversion-immediate', denominator);
    lastConversionImmediate.layout = await measure(page, { ...scenario, stage: 'last-conversion-immediate' }, denominator);
    await fs.writeFile(path.join(evidenceDir, `${scenario.id}-last-conversion-immediate.png`), await page.screenshot());
    await waitForAnimationsToSettle(page);
    lastConversionSettled = await measureTrackScale(page, 'last-conversion-settled-addends', denominator);
    lastConversionSettled.layout = await measure(page, { ...scenario, stage: 'last-conversion-settled-addends' }, denominator);
    await fs.writeFile(path.join(evidenceDir, `${scenario.id}-last-conversion-settled.png`), await page.screenshot());
    operateBeforeAnswer = await measureTrackScale(page, 'operate-before-answer', denominator);
    operateBeforeAnswer.layout = await measure(page, { ...scenario, stage: 'operate-before-answer' }, denominator);
    await fs.writeFile(path.join(evidenceDir, `${scenario.id}-operate-before-answer.png`), await page.screenshot());
  }
  const withhold = await checkPreAnswerWithholding(page, denominator, scenario.id);
  const wrong = String(BigInt(sum) + 1n);
  await enterLearnerNumber(page, view, wrong, scenario.interaction, keyboardActions);
  const recovery = (await view.locator('.recovery-feedback').textContent())?.trim() || '';
  assert(recovery.length > 0, `${scenario.id}: incorrect learner answer did not produce recovery`);
  await checkPreAnswerWithholding(page, denominator, `${scenario.id} after wrong answer`);
  let operateAfterWrongAnswer = null;
  if (scenario.detailed) {
    operateAfterWrongAnswer = await measureTrackScale(page, 'operate-after-wrong-answer', denominator);
    operateAfterWrongAnswer.layout = await measure(page, { ...scenario, stage: 'operate-after-wrong-answer' }, denominator);
    await fs.writeFile(path.join(evidenceDir, `${scenario.id}-operate-after-wrong-answer.png`), await page.screenshot());
  }
  const leakSeeds = await runIndependentLeakSeeds(page, denominator, scenario.id);
  const recoveryInput = view.locator('.active-beat-controls input.control-numeric-input').first();
  const recoveryFocusBeforeCorrection = await page.evaluate(() => document.activeElement?.outerHTML?.slice(0, 120) || null);
  if (scenario.interaction === 'keyboard') {
    const hasFocus = await recoveryInput.evaluate((element) => document.activeElement === element);
    const recoveryTabCount = hasFocus ? 0 : await tabTo(page, recoveryInput);
    await page.keyboard.type(String(sum));
    keyboardActions.push({ action: 'correct-recovery-response', recoveryTabCount, value: String(sum), focusBeforeCorrection: recoveryFocusBeforeCorrection });
    await page.keyboard.press('Enter');
  } else if (scenario.interaction === 'touch') {
    await recoveryInput.tap();
    await recoveryInput.fill(String(sum));
    await recoveryInput.press('Enter');
  } else {
    await recoveryInput.fill(String(sum));
    await recoveryInput.press('Enter');
  }
  const acceptedStack = view.locator('.fraction-bar-multi-whole-stack, .linear-result-stack').first();
  await acceptedStack.waitFor({ state: 'visible' });
  const accepted = await measure(page, { ...scenario, stage: 'accepted-total' }, denominator);
  accepted.operateRecoveryFocus = recoveryFocusBeforeCorrection;
  accepted.keyboardActions = keyboardActions;
  assert(accepted.rowBounds.length === 2, `${scenario.id}: accepted result did not show both whole rows`);
  const acceptedScale = scenario.detailed ? await measureTrackScale(page, 'accepted-result-stack', denominator) : null;
  if (scenario.detailed) {
    acceptedScale.layout = accepted;
    assertScaleConservation(lastConversionSettled, operateBeforeAnswer, acceptedScale, scenario.id);
    accepted.scaleConservation = { rest, activeConversionReplay, dismissedConversionReplay, lastConversionImmediate, lastConversionSettled, operateBeforeAnswer, operateAfterWrongAnswer, accepted: acceptedScale };
  }
  const stackFact = await mountedStackWitness(page, scenario.view, denominator);
  const falsification = await runMountedFalsifications(page, scenario, denominator);
  await fs.writeFile(path.join(evidenceDir, `${scenario.id}-accepted.png`), await page.screenshot());

  await activateLearnerControl(page, view.locator('.active-beat-controls .control-btn').first(), scenario.interaction, keyboardActions);
  await view.locator('.active-beat-prompt').waitFor({ state: 'visible' });
  const reflection = await measure(page, { ...scenario, stage: 'reflection' }, denominator);
  await fs.writeFile(path.join(evidenceDir, `${scenario.id}-reflection.png`), await page.screenshot());
  const replay = page.locator('.app-support-controls .app-secondary-button').filter({ hasText: /replay/i });
  if (await replay.count()) {
    await activateLearnerControl(page, replay, scenario.interaction, keyboardActions);
    await view.locator('.app-done-looking-button').waitFor({ state: 'visible' });
    const replayState = await measure(page, { ...scenario, stage: 'replay' }, denominator);
    await fs.writeFile(path.join(evidenceDir, `${scenario.id}-replay.png`), await page.screenshot());
    await activateLearnerControl(page, view.locator('.app-done-looking-button'), scenario.interaction, keyboardActions);
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
    await selectReflection(page, scenario.view, denominator, scenario.interaction, keyboardActions);
    const resetButton = page.locator('.app-restart-button');
    await activateLearnerControl(page, resetButton, scenario.interaction, keyboardActions);
    const resetWithholding = await checkPreAnswerWithholding(page, denominator, `${scenario.id} reset`);
    return { scenario, withhold, helpCopy, recovery, leakSeeds, accepted, stackFact, falsification, reflection, replay: replayState, resetWithholding };
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
  routeBaseline: {
    immutableCommit: routeBaselineCommit,
    originalFileByteSha256: baselineFileSha256,
    currentFileByteSha256: currentFileSha256,
    wholeFileBytesEqual: currentFileSha256 === baselineFileSha256,
    originalRouteCount: baselineMatrix.routes.length,
    canonicalPrefixSha256: currentPrefixCanonicalSha256,
    canonicalOriginalObjectsEqual: true,
  },
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
  const selectedScenarios = [];
  const enqueue = (target, condition, support, view, height, reciprocal = false) => {
    serial += 1;
    selectedScenarios.push({
      id: `plan17-${target}-${condition.id}-${support}-${view}-${height}${reciprocal ? '-reciprocal' : ''}`,
      target,
      condition: condition.id,
      support,
      view,
      height,
      interaction: serial === 1 ? 'touch' : serial === 2 ? 'keyboard' : 'pointer',
      reducedMotion: !reciprocal && serial % 3 === 0,
      detailed: !reciprocal && condition.id === 'phase2-bundle-1' && support === 'high' && view === 'visual',
    });
  };
  for (const target of crossingTargets) {
    for (const condition of REGISTERED_CONDITIONS) {
      const height = serial % 2 === 0 ? 740 : 752;
      enqueue(target, condition, 'high', 'visual', height);
      enqueue(target, condition, 'medium', 'linear', height === 740 ? 752 : 740);
      enqueue(target, condition, 'high', 'linear', height, true);
      enqueue(target, condition, 'medium', 'visual', height === 740 ? 752 : 740, true);
    }
  }
  for (const [index, scenario] of selectedScenarios.entries()) {
    if (index < scenarioOffset) continue;
    measurements.scenarios.push(await runScenario(browser, serverUrl, scenario));
    await fs.writeFile(path.join(evidenceDir, 'measurements.json'), `${JSON.stringify(measurements, null, 2)}\n`);
    if (measurements.scenarios.length >= scenarioLimit) break;
  }
  await fs.writeFile(path.join(evidenceDir, 'measurements.json'), `${JSON.stringify(measurements, null, 2)}\n`);
} finally {
  await browser.close();
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
