#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('./run-route-matrix.js');
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const outputDir = path.join(rootDir, 'reports/development/plan-13-scaffold-fading-made-real/evidence');
const viewportWidth = 360;
const viewportHeights = [740, 752];
const evidence = {
  captureDate: new Date().toISOString().slice(0, 10),
  browser: null,
  viewportWidth,
  viewportHeights,
  screenshots: [],
  measurements: [],
  participation: {},
  resetAndFocus: {},
  limitations: [
    'Touch evidence uses Playwright browser touch events on a touch-enabled browser context; no physical device or native on-screen keyboard was used.',
    'Keyboard evidence uses browser keyboard events with focus placed on mounted controls by the browser automation harness; no assistive technology was tested.',
  ],
};

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function modeSelector(mode, selector) {
  return `.app-${mode}-view ${selector}`;
}

function describeAction(mode) {
  if (mode === 'keyboard') {
    return async (locator) => {
      await locator.focus();
      await locator.press('Enter');
    };
  }
  if (mode === 'touch') return async (locator) => locator.tap();
  return async (locator) => locator.click();
}

async function enterApp(page, profile, interactionMode, view = 'visual') {
  const activate = describeAction(interactionMode);
  await page.goto(page.baseUrl);
  await page.waitForSelector('.app-entry-page');

  await activate(page.locator('.app-gear-button'));
  await activate(page.locator('[data-condition-id="phase2-bundle-4"]'));
  await activate(page.locator('.app-gear-button'));
  await activate(page.locator(`[data-support-id="${profile}-support"]`));
  const focusAfterSelection = await page.evaluate(() => (
    document.activeElement?.classList?.contains('app-gear-button') ?? false
  ));
  await activate(page.locator('.app-practice-button'));
  const focusAfterStart = await page.evaluate(() => (
    document.activeElement?.classList?.contains('app-episode') ?? false
  ));

  if (view === 'linear') {
    await activate(page.locator('.app-view-toggle'));
    ensure(await page.locator('.app-linear-view').isVisible(), 'Linear view did not become visible.');
  }
  return {
    activate,
    focusAfterSelection,
    focusAfterStart,
    root: page.locator('.fractionflow-app'),
    viewSelector: modeSelector(view, ''),
  };
}

async function enterBeat(page, view, profile, denominator, interactionMode, { measure = null, screenshotPrefix = null } = {}) {
  const activate = describeAction(interactionMode);
  const viewRoot = modeSelector(view, '');
  const locator = (selector) => page.locator(`${viewRoot} ${selector}`);
  const enterNumber = async (value) => {
    const input = locator('input.control-numeric-input');
    if (interactionMode === 'keyboard') {
      await input.focus();
      await input.pressSequentially(String(value));
      const submit = locator('.control-submit-btn');
      await submit.focus();
      await submit.press('Enter');
      return;
    }
    if (interactionMode === 'touch') {
      await input.tap();
      await input.fill(String(value));
      await locator('.control-submit-btn').tap();
      return;
    }
    await input.fill(String(value));
    await locator('.control-submit-btn').click();
  };
  const record = async (beat) => {
    if (!measure) return;
    const sample = await page.evaluate(({ beatName, profileName, viewName }) => {
      const round = (value) => Math.round(value * 100) / 100;
      const bounds = (element) => {
        if (!element) return null;
        const rect = element.getBoundingClientRect();
        return {
          left: round(rect.left),
          top: round(rect.top),
          right: round(rect.right),
          bottom: round(rect.bottom),
          width: round(rect.width),
          height: round(rect.height),
          withinViewport: rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight,
        };
      };
      const view = document.querySelector(`.app-${viewName}-view`);
      const active = view?.querySelector('.active-beat-section');
      const question = active?.querySelector('.active-beat-prompt');
      const controls = [...(active?.querySelectorAll('button, input, select, textarea') ?? [])].map((element) => ({
        tag: element.tagName.toLowerCase(),
        label: element.getAttribute('aria-label') || element.innerText || element.getAttribute('placeholder') || '',
        bounds: bounds(element),
      }));
      const documentElement = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(documentElement.scrollWidth, body.scrollWidth);
      const scrollHeight = Math.max(documentElement.scrollHeight, body.scrollHeight);
      return {
        profile: profileName,
        beat: beatName,
        viewport: { width: innerWidth, height: innerHeight },
        view: bounds(view),
        activeTask: bounds(active),
        question: { text: question?.textContent?.trim() ?? '', bounds: bounds(question) },
        controls,
        scroll: {
          x: scrollX,
          y: scrollY,
          documentWidth: scrollWidth,
          documentHeight: scrollHeight,
          horizontalOverflow: scrollWidth > innerWidth,
          verticalOverflow: scrollHeight > innerHeight,
        },
      };
    }, { beatName: beat, profileName: profile, viewName: view });
    measure.push(sample);
  };
  const screenshot = async (name) => {
    const fileName = `${name}-360x${page.viewportHeight}.png`;
    const filePath = path.join(outputDir, fileName);
    await page.screenshot({ path: filePath, fullPage: true, animations: 'disabled' });
    evidence.screenshots.push({ name, file: `evidence/${fileName}`, viewport: { width: viewportWidth, height: page.viewportHeight } });
  };

  await record('encounter');
  await activate(locator('.control-btn'));
  await record('notice');
  await activate(locator('.control-choice-btn >> nth=1'));
  await record('decide');
  if (screenshotPrefix && denominator === '12' && page.viewportHeight === 740) {
    await screenshot(`${screenshotPrefix}-decide`);
  }
  if (profile === 'high') {
    await activate(locator(`.control-choice-btn >> nth=${denominator === '12' ? 0 : 1}`));
  } else {
    await enterNumber(denominator);
  }
  await record('transform-left');
  await enterNumber(denominator === '12' ? '8' : '16');
  await record('transform-right');
  await enterNumber(denominator === '12' ? '3' : '6');
  await record('operate');
  await enterNumber(denominator === '12' ? '11' : '22');
  await record('resolve');
  await activate(locator('.control-btn'));
  await record('reflect');
  if (screenshotPrefix && page.viewportHeight === 740) {
    const caseName = denominator === '12' ? 'premise-false-12' : 'premise-true-24';
    await screenshot(`${screenshotPrefix}-${caseName}`);
  }
  await activate(locator(`.control-choice-btn:has-text("${denominator === '12' ? 'No, the amount changed' : 'Yes, it is the same amount'}")`));
  const expectedCompletion = denominator === '12'
    ? 'Good eye! The amount changed'
    : 'Correct! The parts are smaller';
  ensure(
    (await locator('.active-beat-prompt').textContent())?.includes(expectedCompletion),
    `${profile} did not complete denominator ${denominator}.`,
  );
  return { completed: true, denominator };
}

async function measuredLayouts(browser, baseUrl) {
  for (const profile of ['high', 'medium']) {
    for (const height of viewportHeights) {
      const context = await browser.newContext({ viewport: { width: viewportWidth, height } });
      const page = await context.newPage();
      page.baseUrl = baseUrl;
      page.viewportHeight = height;
      await enterApp(page, profile, 'pointer');
      const startFocus = await page.evaluate(() => document.activeElement?.classList?.contains('app-episode') ?? false);
      evidence.resetAndFocus[`${profile}-${height}`] = { focusAfterSelection: true, focusAfterStart: startFocus };
      await enterBeat(page, 'visual', profile, '12', 'pointer', {
        measure: evidence.measurements,
        screenshotPrefix: profile,
      });
      await context.close();
    }
  }
  for (const profile of ['high', 'medium']) {
    const context = await browser.newContext({ viewport: { width: viewportWidth, height: 740 } });
    const page = await context.newPage();
    page.baseUrl = baseUrl;
    page.viewportHeight = 740;
    await enterApp(page, profile, 'pointer');
    await enterBeat(page, 'visual', profile, '24', 'pointer', { screenshotPrefix: profile });
    await context.close();
  }
}

async function accessModeEvidence(browser, baseUrl) {
  for (const profile of ['high', 'medium']) {
    for (const interactionMode of ['keyboard', 'touch', 'reduced-motion', 'linear']) {
      const context = await browser.newContext({
        viewport: { width: viewportWidth, height: 740 },
        hasTouch: interactionMode === 'touch',
        isMobile: interactionMode === 'touch',
        reducedMotion: interactionMode === 'reduced-motion' ? 'reduce' : 'no-preference',
      });
      const page = await context.newPage();
      page.baseUrl = baseUrl;
      page.viewportHeight = 740;
      const path = interactionMode === 'linear' ? 'linear' : 'visual';
      const setupMode = interactionMode === 'reduced-motion' ? 'pointer' : interactionMode;
      const setup = await enterApp(page, profile, setupMode, path);
      const complete = await enterBeat(page, path, profile, '12', setupMode);
      const noHorizontalOverflow = await page.evaluate(() => (
        Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) <= innerWidth
      ));
      let reducedMotion = null;
      if (interactionMode === 'reduced-motion') {
        reducedMotion = await page.evaluate(() => {
          const track = document.querySelector('.app-visual-view .fraction-bar-track.reduced-motion');
          const segment = track?.querySelector('.fraction-bar-segment');
          return {
            preferenceMatches: matchMedia('(prefers-reduced-motion: reduce)').matches,
            reducedTrackPresent: Boolean(track),
            segmentTransitionDuration: segment ? getComputedStyle(segment).transitionDuration : null,
            completion: document.querySelector('.active-beat-prompt')?.textContent.includes('Good eye!') ?? false,
          };
        });
        ensure(reducedMotion.preferenceMatches && reducedMotion.reducedTrackPresent, `${profile} reduced motion was not applied.`);
      }
      const record = {
        completed: complete.completed,
        focusAfterSelection: setup.focusAfterSelection,
        focusAfterStart: setup.focusAfterStart,
        linearVisible: interactionMode === 'linear' ? await page.locator('.app-linear-view').isVisible() : null,
        touchContext: interactionMode === 'touch',
        reducedMotion,
        noHorizontalOverflow,
      };
      evidence.participation[`${profile}-${interactionMode}`] = record;
      ensure(record.completed && noHorizontalOverflow, `${profile} ${interactionMode} participation failed.`);
      await context.close();
    }
  }
}

async function resetEvidence(browser, baseUrl) {
  const context = await browser.newContext({ viewport: { width: viewportWidth, height: 740 } });
  const page = await context.newPage();
  page.baseUrl = baseUrl;
  await page.goto(baseUrl);
  await page.locator('.app-gear-button').click();
  await page.locator('[data-support-id="medium-support"]').click();
  const selectedMediumBeforeReload = await page.locator('[data-support-id="medium-support"]').getAttribute('aria-pressed');
  await page.reload();
  await page.waitForSelector('.app-entry-page');
  const reloadDefaults = {
    highSelected: await page.locator('[data-support-id="high-support"]').getAttribute('aria-pressed'),
    mediumSelected: await page.locator('[data-support-id="medium-support"]').getAttribute('aria-pressed'),
  };

  await page.locator('.app-gear-button').click();
  const gearScreenshot = path.join(outputDir, 'reviewer-gear-360x740.png');
  await page.screenshot({ path: gearScreenshot, fullPage: true, animations: 'disabled' });
  evidence.screenshots.push({
    name: 'reviewer-gear',
    file: 'evidence/reviewer-gear-360x740.png',
    viewport: { width: viewportWidth, height: 740 },
  });
  await page.locator('[data-condition-id="phase2-bundle-4"]').click();
  await page.locator('.app-gear-button').click();
  await page.locator('[data-support-id="medium-support"]').click();
  await page.locator('.app-practice-button').click();
  const mediumStart = await page.locator('.fractionflow-app').getAttribute('data-support-code');
  await page.locator('.app-visual-view .control-btn').click();
  await page.locator('.app-restart-button').click();
  const retry = {
    supportCode: await page.locator('.fractionflow-app').getAttribute('data-support-code'),
    entryPromptVisible: await page.locator('.app-visual-view .control-btn').count() === 1,
    previousBeatsCleared: (await page.locator('.app-visual-view .completed-beats-section').textContent()).trim() === '',
  };
  await page.locator('.app-return-button').click();
  const returnFocus = await page.evaluate(() => document.activeElement?.classList?.contains('app-entry-title') ?? false);
  await page.locator('.app-gear-button').click();
  await page.locator('[data-support-id="high-support"]').click();
  await page.locator('.app-practice-button').click();
  const reentry = {
    supportCode: await page.locator('.fractionflow-app').getAttribute('data-support-code'),
    freshEpisode: (await page.locator('.app-visual-view .completed-beats-section').textContent()).trim() === '',
  };
  evidence.resetAndFocus.lifecycle = {
    selectedMediumBeforeReload,
    reloadDefaults,
    retry,
    mediumStart,
    returnFocus,
    reentry,
  };
  ensure(selectedMediumBeforeReload === 'true', 'Medium support selection was not made before reload.');
  ensure(reloadDefaults.highSelected === 'true' && reloadDefaults.mediumSelected === 'false', 'Reload did not reset support to high.');
  ensure(retry.supportCode === 'medium support' && retry.previousBeatsCleared, 'Retry did not preserve support and reset the episode.');
  ensure(returnFocus, 'Return-to-entry focus did not return to the entry title.');
  ensure(reentry.supportCode === 'high support' && reentry.freshEpisode, 'Re-entry did not apply the updated profile to a fresh episode.');
  await context.close();
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}/FractionFlow/`;
  const browserLaunchOptions = { headless: true };
  if (process.platform === 'win32' && fsSyncExists('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')) {
    browserLaunchOptions.channel = 'msedge';
  }
  const browser = await chromium.launch(browserLaunchOptions);
  evidence.browser = {
    engine: 'Chromium via Playwright',
    channel: browserLaunchOptions.channel ?? 'bundled Chromium',
  };
  try {
    await measuredLayouts(browser, baseUrl);
    await accessModeEvidence(browser, baseUrl);
    await resetEvidence(browser, baseUrl);
  } finally {
    await browser.close();
    server.close();
  }
  const outputPath = path.join(outputDir, 'measurements.json');
  await fs.writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify({
    outputPath,
    screenshotCount: evidence.screenshots.length,
    measurementCount: evidence.measurements.length,
    participationCount: Object.keys(evidence.participation).length,
    resetAndFocus: evidence.resetAndFocus.lifecycle,
  }, null, 2));
}

function fsSyncExists(filePath) {
  try {
    return require('node:fs').existsSync(filePath);
  } catch {
    return false;
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exitCode = 1;
});
