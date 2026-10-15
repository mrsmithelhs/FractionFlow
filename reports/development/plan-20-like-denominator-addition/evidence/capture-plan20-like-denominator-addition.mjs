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

const FORBIDDEN_PRE_RESPONSE_COPY = /5\/7|10\/14|5\/14|common denominator|renam(?:e|ing)/i;

async function assertNoPrematureContent(page, label) {
  const scanned = await page.locator('.fractionflow-app').evaluate((root) => {
    const elements = [...root.querySelectorAll('*')];
    const text = root.textContent || '';
    const accessible = elements.flatMap((element) => (
      ['aria-label', 'aria-description', 'aria-roledescription', 'aria-valuetext', 'aria-placeholder', 'title', 'alt', 'placeholder']
        .map((attribute) => element.getAttribute(attribute))
        .filter(Boolean)
    ));
    const values = [...root.querySelectorAll('input, textarea, select')]
      .map((element) => element.value)
      .filter(Boolean);
    return {
      combined: `${text} ${accessible.join(' ')} ${values.join(' ')}`,
      mountedTextElements: elements.filter((element) => [...element.childNodes]
        .some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim())).length,
      accessibleTextAttributes: accessible.length,
      nonemptyControlValues: values.length,
    };
  });
  const leakMatch = scanned.combined.match(FORBIDDEN_PRE_RESPONSE_COPY);
  if (leakMatch) {
    const leakIndex = leakMatch.index;
    throw new Error(`PRE_RESPONSE_ABSENCE_ASSERTION: ${label}: prohibited answer or skipped-task copy was present: ${scanned.combined.slice(Math.max(0, leakIndex - 120), leakIndex + 140)}`);
  }
  return {
    passed: true,
    mountedTextElements: scanned.mountedTextElements,
    accessibleTextAttributes: scanned.accessibleTextAttributes,
  };
}

async function verifyFailFirstAbsenceSeeds(page) {
  const seeds = [
    { kind: 'stale-conversion-content', text: 'Convert both fractions to a common denominator before adding.' },
    { kind: 'unlike-denominator-recovery-copy', text: 'The denominators are different, so rename both fractions before adding.' },
    { kind: 'accessible-label', text: 'Try 5/14 after converting the fractions.' },
  ];
  const rejected = [];
  for (const seed of seeds) {
    const id = `plan20-repair-seed-${seed.kind}`;
    await page.locator('.fractionflow-app').evaluate((root, value) => {
      const node = document.createElement(value.kind === 'accessible-label' ? 'button' : 'span');
      node.id = value.id;
      node.hidden = true;
      if (value.kind === 'accessible-label') node.setAttribute('aria-label', value.text);
      else node.textContent = value.text;
      root.appendChild(node);
    }, { ...seed, id });
    let caughtAtIntendedAssertion = false;
    try {
      await assertNoPrematureContent(page, `${seed.kind} seed`);
    } catch (error) {
      caughtAtIntendedAssertion = error.message.startsWith('PRE_RESPONSE_ABSENCE_ASSERTION:');
      if (!caughtAtIntendedAssertion) throw error;
    } finally {
      await page.locator(`#${id}`).evaluate((node) => node.remove());
    }
    if (!caughtAtIntendedAssertion) {
      throw new Error(`failing-first ${seed.kind} seed was not rejected at the absence assertion`);
    }
    rejected.push({ kind: seed.kind, rejectedAt: 'pre-response absence assertion' });
  }
  const restored = await assertNoPrematureContent(page, 'restored clean app');
  return { rejected, restoredCleanRun: restored.passed, ...restored };
}

async function measureOrdinaryScrollReachability(page) {
  const targets = [
    { name: 'question', selector: '.app-visual-view:not([hidden]) .active-beat-prompt, .app-linear-view:not([hidden]) .active-beat-prompt' },
    { name: 'task-controls', selector: '.app-visual-view:not([hidden]) .active-beat-controls, .app-linear-view:not([hidden]) .active-beat-controls' },
    { name: 'help-guidance', selector: '.app-visual-view:not([hidden]) .active-denominator-help-cue, .app-linear-view:not([hidden]) .active-denominator-help-cue' },
    { name: 'return-control', selector: '.app-episode .app-return-button' },
  ];
  const results = [];
  for (const target of targets) {
    const locator = page.locator(target.selector).first();
    if (await locator.count() === 0 || !await locator.isVisible()) continue;
    await page.evaluate(() => window.scrollTo(0, 0));
    const startY = await page.evaluate(() => window.scrollY);
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const box = await locator.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom, height: rect.height };
      });
      if (box.height > 0 && box.top >= 0 && box.bottom <= page.viewportSize().height) break;
      await page.mouse.move(Math.max(2, page.viewportSize().width - 12), Math.max(2, page.viewportSize().height - 12));
      await page.mouse.wheel(0, Math.max(120, box.bottom - page.viewportSize().height + 60));
      await page.waitForTimeout(30);
    }
    const result = await locator.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top,
        bottom: rect.bottom,
        height: rect.height,
        viewportHeight: window.innerHeight,
        scrollY: window.scrollY,
        scrollHeight: document.documentElement.scrollHeight,
      };
    });
    const reachable = result.height > 0 && result.top >= 0 && result.bottom <= result.viewportHeight;
    if (!reachable) throw new Error(`ordinary-scroll reachability failed for ${target.name}: ${JSON.stringify(result)}`);
    results.push({ name: target.name, startY, ...result, fullyVisibleAfterOrdinaryScroll: reachable, reachable });
  }
  return results;
}

async function capture(page, filename, label) {
  const reachability = await measureOrdinaryScrollReachability(page);
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
      scrollY: window.scrollY,
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
  return { label, screenshot: filename, reachability, ...data };
}

async function tabUntilFocused(page, locator, label, trace) {
  for (let index = 0; index < 40; index += 1) {
    await page.keyboard.press('Tab');
    const active = await locator.evaluate((element) => document.activeElement === element);
    const activeDescription = await page.evaluate(() => {
      const element = document.activeElement;
      return element ? `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}.${[...element.classList].join('.')}` : 'none';
    });
    trace.push(activeDescription);
    if (active) return;
  }
  throw new Error(`page keyboard navigation did not reach ${label}; focused sequence: ${trace.join(' -> ')}`);
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
    const failFirstAbsence = await verifyFailFirstAbsenceSeeds(page);
    evidence.push({
      label: 'pre-response absence checks',
      viewport: { width: run.width, height: run.height },
      activePath: run.linear ? 'linear' : 'visual',
      skippedControlsAbsent: true,
      answerAndUnlikeTaskTextAbsent: true,
      scanSurfaces: ['all mounted textContent including hidden descendants', 'aria-label', 'aria-description', 'aria-valuetext', 'title', 'alt', 'placeholder'],
      absenceScan: failFirstAbsence,
      reflectionControls: await page.locator('.app-reflection, .matching-choice-btn').count(),
    });
    for (const input of [numerator, denominator]) {
      if (await page.locator(input).count() !== 1) throw new Error(`${run.key}: expected one mounted field ${input}`);
    }
    const numericEntry = [];
    await page.locator(numerator).tap();
    numericEntry.push({ field: 'numerator', action: 'tap' });
    await page.locator(numerator).fill('5');
    await page.locator(denominator).tap();
    numericEntry.push({ field: 'denominator', action: 'tap' });
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
    const arithmeticCapture = await capture(page, `plan20-${run.key}-5-over-14-recovery.png`, '5/14 arithmetic recovery');
    arithmeticCapture.numericEntry = {
      fieldActions: numericEntry,
      textEntry: 'Playwright locator.fill after each field tap in touch context',
      physicalDeviceTyping: 'not tested',
    };
    evidence.push(arithmeticCapture);

    await activate(page.locator(`${surface} .active-beat-controls .app-secondary-button`));
    const helpCue = await page.locator(`${surface} .active-denominator-help-cue`).innerText();
    if (helpCue !== 'Add the top numbers. Keep the same bottom number.') {
      throw new Error(`${run.key}: expected visible task-local help, got ${helpCue}`);
    }
    evidence.push(await capture(page, `plan20-${run.key}-local-help.png`, 'visible local operation help'));
    await activate(page.locator(`${surface} .active-beat-controls .app-secondary-button`));

    let keyboardNavigation = null;
    if (run.linear) {
      await page.locator(numerator).tap();
      numericEntry.push({ field: 'numerator', action: 'tap', phase: 'before equivalent-response entry' });
      await page.locator(numerator).fill('10');
      await page.locator(denominator).tap();
      numericEntry.push({ field: 'denominator', action: 'tap', phase: 'before equivalent-response entry' });
      await page.locator(denominator).fill('14');
      await activate(page.locator(`${surface} .control-submit-btn`));
    } else {
      const keyboardTrace = [];
      const helpButton = page.locator(`${surface} .active-beat-controls .app-secondary-button`);
      const focusBeforeKeyboard = await page.evaluate(() => document.activeElement?.id || document.activeElement?.className || 'none');
      if (!await helpButton.evaluate((element) => element === document.activeElement)) {
        throw new Error(`${run.key}: help close did not leave focus on its control before keyboard correction (${focusBeforeKeyboard})`);
      }
      const numeratorField = page.locator(numerator);
      await tabUntilFocused(page, numeratorField, 'numerator input', keyboardTrace);
      await page.keyboard.press('Control+A');
      await page.keyboard.type('10');
      if (await numeratorField.inputValue() !== '10') throw new Error(`${run.key}: page keyboard did not correct the numerator`);
      const denominatorField = page.locator(denominator);
      await tabUntilFocused(page, denominatorField, 'denominator input', keyboardTrace);
      if (await denominatorField.inputValue() !== '14') throw new Error(`${run.key}: keyboard correction changed the preserved denominator`);
      const submitButton = page.locator(`${surface} .control-submit-btn`);
      await tabUntilFocused(page, submitButton, 'Check button', keyboardTrace);
      await page.keyboard.press('Enter');
      keyboardNavigation = {
        fromObservedFocus: focusBeforeKeyboard,
        tabSequence: keyboardTrace,
        correction: 'Control+A then page.keyboard.type("10")',
        submit: 'Tab to Check then page.keyboard.press("Enter")',
      };
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
    acceptedCapture.keyboardNavigation = keyboardNavigation;
    acceptedCapture.numericEntry = run.linear ? {
      fieldActions: numericEntry.slice(2),
      textEntry: 'Playwright locator.fill after each field tap in touch context',
      physicalDeviceTyping: 'not tested',
    } : null;
    evidence.push(acceptedCapture);
    const finishButton = page.getByRole('button', { name: 'Finish', exact: true });
    let finishKeyboardTrace = [];
    if (run.linear) {
      await activate(finishButton);
    } else {
      await tabUntilFocused(page, finishButton, 'Finish button', finishKeyboardTrace);
      await page.keyboard.press('Enter');
    }
    evidence.push(await capture(page, `plan20-${run.key}-finished.png`, 'finished single-item goal'));
    const retainedFocus = await page.locator('.app-episode').evaluate((element) => element === document.activeElement);
    if (!retainedFocus) throw new Error(`${run.key}: Finish did not retain focus on the episode landmark`);
    evidence.at(-1).finishFocus = {
      action: run.linear ? 'touch-context tap on Finish' : 'page keyboard Tab navigation then Enter',
      keyboardTabSequence: run.linear ? null : finishKeyboardTrace,
      focusedEpisodeLandmarkAfterAction: retainedFocus,
    };
    await context.close();
  }

  const fragmentContext = await browser.newContext({ viewport: { width: 360, height: 740 }, reducedMotion: 'reduce' });
  const fragmentPage = await fragmentContext.newPage();
  await fragmentPage.goto(`${baseUrl}#like-denominator-addition`);
  await fragmentPage.waitForSelector('.app-episode:not([hidden])');
  const fragmentPrompt = await fragmentPage.locator('.app-visual-view .active-beat-prompt').innerText();
  if (!fragmentPrompt.includes('Look at these two fractions.')) {
    throw new Error(`Plan 20 fragment launch did not start at encounter: ${fragmentPrompt}`);
  }
  const fragmentChecks = await fragmentPage.evaluate(() => ({
    activeFragment: decodeURIComponent(location.hash.slice(1)),
    visibleEntry: !document.querySelector('.app-entry-page').hasAttribute('hidden'),
    hiddenSkippedControls: document.querySelectorAll(
      '#decide-common-denominator-input, #transform-num-input-left, #transform-num-input-right, #operate-fraction-numerator-input, #linear-operate-fraction-numerator-input',
    ).length,
    reflectionControls: document.querySelectorAll('.app-reflection, .matching-choice-btn').length,
  }));
  const fragmentScreenshot = 'plan20-fragment-entry-360x740.png';
  await fragmentPage.screenshot({ path: path.join(evidenceDir, fragmentScreenshot), fullPage: true });
  const fragmentLaunch = {
    urlFragment: 'like-denominator-addition',
    screenshot: fragmentScreenshot,
    viewport: { width: 360, height: 740 },
    prompt: fragmentPrompt,
    ...fragmentChecks,
  };
  await fragmentContext.close();

  writeFileSync(
    path.join(evidenceDir, 'browser-measurements.json'),
    `${JSON.stringify({ plan: 'plan-20', browser: 'Chrome via Playwright', motion: 'prefers-reduced-motion', entryScreens, evidence, fragmentLaunch }, null, 2)}\n`,
    'utf8',
  );
  console.log(`Captured ${evidence.length} workflow states, both narrow entry layouts, and direct fragment launch evidence.`);
} finally {
  await browser.close();
  server.close();
}
