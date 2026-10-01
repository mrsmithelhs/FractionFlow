import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { SUBTRACTION_FIXTURE_MODELS } from '../../prototypes/subtraction/model.js';

const require = createRequire(import.meta.url);
const {
  createStaticServer,
  resolveStartingSurface,
} = require('./run-route-matrix.js');

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const evidenceDirectory = path.join(
  repositoryRoot,
  'reports/development/plan-15-subtraction-representation-prototypes/evidence',
);
const startingSurfaceIds = {
  takeaway: 'subtraction-takeaway-prototype',
  comparison: 'subtraction-comparison-prototype',
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function openPrototype(browser, baseUrl, mode, fixtureIndex, viewportHeight, motion) {
  const context = await browser.newContext({
    viewport: { width: 360, height: viewportHeight },
    reducedMotion: motion === 'reduced-motion' ? 'reduce' : 'no-preference',
  });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const surface = resolveStartingSurface(startingSurfaceIds[mode]);
  const url = new URL(surface.path, baseUrl);
  url.searchParams.set('fixture', String(fixtureIndex));
  await page.goto(url.toString());
  await page.waitForSelector(surface.readySelector);
  return { context, page };
}

async function operateAndAnswer(page, mode, model, testRetry = true) {
  const operationButton = page.locator('#operation-button');
  if (mode === 'takeaway') {
    const partCount = Number(model.renamedRight.numerator);
    for (let index = 0; index < partCount; index += 1) {
      await operationButton.click();
    }
  } else {
    await operationButton.click();
  }

  const beforeAnswer = await page.locator('#subtraction-prototype').evaluate((root) => {
    const text = root.innerText;
    const labels = [...root.querySelectorAll('[aria-label]')]
      .map((element) => element.getAttribute('aria-label') || '')
      .join(' ');
    return text + ' ' + labels;
  });
  const answerText = model.exactDifference.numerator.toString()
    + '/'
    + model.exactDifference.denominator.toString();
  assert(
    !beforeAnswer.includes(answerText),
    mode + ' displayed or announced the numeric answer before learner entry: ' + answerText,
  );

  if (testRetry) {
    await page.locator('#answer-numerator').fill('0');
    await page.locator('#answer-denominator').fill('1');
    await page.locator('#answer-form button[type=submit]').click();
    assert(
      (await page.locator('#answer-feedback').textContent()).trim() === 'Try again.',
      mode + ' did not show the plain retry message.',
    );
    assert(
      (await operationButton.getAttribute('aria-disabled')) === 'true',
      mode + ' reset the completed operation after retry.',
    );
    assert(
      mode === 'takeaway'
        ? (await page.locator('.bar-segment.is-removed').count()) > 0
        : (await page.locator('.gap-marker').count()) === 1,
      mode + ' removed the operation mark after retry.',
    );
  }

  await page.locator('#answer-numerator').fill(model.exactDifference.numerator.toString());
  await page.locator('#answer-denominator').fill(model.exactDifference.denominator.toString());
  await page.locator('#answer-form button[type=submit]').click();
  assert(
    (await page.locator('#answer-feedback').textContent()).trim() === 'That’s right.',
    mode + ' did not acknowledge the exact-core answer.',
  );
}

async function measurePage(page, viewportHeight, motion, mode) {
  const measurement = await page.evaluate(({ height, motionMode, representationMode }) => {
    const rect = (selector) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const box = element.getBoundingClientRect();
      return {
        top: Math.round(box.top * 100) / 100,
        bottom: Math.round(box.bottom * 100) / 100,
        width: Math.round(box.width * 100) / 100,
        height: Math.round(box.height * 100) / 100,
        visible: box.width > 0 && box.height > 0,
        withinViewport: box.top >= 0 && box.bottom <= height,
      };
    };
    const controls = [...document.querySelectorAll('a,button,input,select')]
      .filter((element) => element.getClientRects().length > 0)
      .map((element) => {
        const box = element.getBoundingClientRect();
        return {
          name: element.getAttribute('aria-label') || element.textContent.trim() || element.id,
          width: Math.round(box.width * 100) / 100,
          height: Math.round(box.height * 100) / 100,
          withinViewport: box.top >= 0 && box.bottom <= height,
        };
      });
    const bars = [...document.querySelectorAll('.fraction-whole')].map((bar) => {
      const box = bar.getBoundingClientRect();
      const segment = bar.querySelector('.bar-segment');
      const segmentBox = segment ? segment.getBoundingClientRect() : null;
      return {
        width: Math.round(box.width * 100) / 100,
        partWidth: segmentBox ? Math.round(segmentBox.width * 100) / 100 : null,
        parts: bar.querySelectorAll('.bar-segment').length,
      };
    });
    const motionTarget = representationMode === 'takeaway'
      ? document.querySelector('.bar-segment.is-shaded')
      : document.querySelector('.gap-marker');
    return {
      viewport: { width: window.innerWidth, height },
      motionMode,
      representationMode,
      document: {
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight),
        clientWidth: document.documentElement.clientWidth,
        clientHeight: document.documentElement.clientHeight,
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        verticalOverflow: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) > height,
      },
      bounds: {
        fixturePicker: rect('.fixture-picker'),
        question: rect('.problem'),
        operation: rect('#operation-button'),
        answerForm: rect('#answer-form'),
        feedback: rect('#answer-feedback'),
      },
      bars,
      visibleControlsAtLeast24px: controls.every((control) => control.width >= 24 && control.height >= 24),
      allControlsWithinViewport: controls.every((control) => control.withinViewport),
      controls,
      questionVisible: rect('.problem')?.withinViewport === true,
      motionTransitionDuration: motionTarget
        ? getComputedStyle(motionTarget).transitionDuration
        : 'no moving target',
      operationStatus: document.querySelector('#operation-status').textContent,
      feedback: document.querySelector('#answer-feedback').textContent,
    };
  }, {
    height: viewportHeight,
    motionMode: motion,
    representationMode: mode,
  });

  assert(!measurement.document.horizontalOverflow, mode + ' has horizontal page overflow at 360px.');
  assert(measurement.visibleControlsAtLeast24px, mode + ' has a control below 24x24px.');
  assert(measurement.allControlsWithinViewport, mode + ' has a control outside the requested viewport.');
  assert(measurement.questionVisible, mode + ' question is outside the requested viewport.');
  assert(!measurement.document.verticalOverflow, mode + ' content exceeds the requested viewport.');
  assert(
    measurement.bars.every((bar) => Math.abs(bar.width - 328) < 0.5),
    mode + ' whole width differs from the approved 328px width at a 360px viewport.',
  );
  assert(
    motion === 'reduced-motion'
      ? measurement.motionTransitionDuration === '0s'
      : measurement.motionTransitionDuration !== '0s',
    mode + ' motion treatment does not match ' + motion + '.',
  );
  return measurement;
}

async function runKeyboardParticipation(browser, baseUrl, mode, model) {
  const context = await browser.newContext({ viewport: { width: 360, height: 740 } });
  const page = await context.newPage();
  await page.goto(new URL(resolveStartingSurface(startingSurfaceIds[mode]).path, baseUrl).toString());
  await page.waitForSelector(resolveStartingSurface(startingSurfaceIds[mode]).readySelector);

  const expectedTabStops = [
    'takeaway-link',
    'comparison-link',
    'fixture-select',
    'operation-button',
  ];
  const reached = [];
  for (const id of expectedTabStops) {
    await page.keyboard.press('Tab');
    reached.push(await page.evaluate(() => document.activeElement.id));
    assert(reached[reached.length - 1] === id, mode + ' keyboard order missed ' + id + '.');
  }

  if (mode === 'takeaway') {
    const count = Number(model.renamedRight.numerator);
    for (let index = 0; index < count; index += 1) {
      await page.keyboard.press('Space');
    }
  } else {
    await page.keyboard.press('Space');
  }
  await page.keyboard.press('Tab');
  assert(
    (await page.evaluate(() => document.activeElement.id)) === 'answer-numerator',
    mode + ' keyboard focus did not reach the numerator field.',
  );
  await page.keyboard.type(model.exactDifference.numerator.toString());
  await page.keyboard.press('Tab');
  assert(
    (await page.evaluate(() => document.activeElement.id)) === 'answer-denominator',
    mode + ' keyboard focus did not reach the denominator field.',
  );
  await page.keyboard.type(model.exactDifference.denominator.toString());
  await page.keyboard.press('Tab');
  assert(
    (await page.evaluate(() => document.activeElement.textContent.trim())) === 'Check answer',
    mode + ' keyboard focus did not reach answer submission.',
  );
  await page.keyboard.press('Enter');
  assert(
    (await page.locator('#answer-feedback').textContent()).trim() === 'That’s right.',
    mode + ' keyboard completion did not reach the correct response.',
  );
  await context.close();
  return { passed: true, tabStops: reached, resultEnteredWithKeyboard: true };
}

async function runTouchParticipation(browser, baseUrl, mode, model) {
  const context = await browser.newContext({
    viewport: { width: 360, height: 740 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(new URL(resolveStartingSurface(startingSurfaceIds[mode]).path, baseUrl).toString());
  await page.waitForSelector(resolveStartingSurface(startingSurfaceIds[mode]).readySelector);

  const operationButton = page.locator('#operation-button');
  const count = mode === 'takeaway' ? Number(model.renamedRight.numerator) : 1;
  for (let index = 0; index < count; index += 1) {
    await operationButton.tap();
  }
  await page.locator('#answer-numerator').tap();
  await page.locator('#answer-numerator').fill(model.exactDifference.numerator.toString());
  await page.locator('#answer-denominator').tap();
  await page.locator('#answer-denominator').fill(model.exactDifference.denominator.toString());
  await page.locator('#answer-form button[type=submit]').tap();
  assert(
    (await page.locator('#answer-feedback').textContent()).trim() === 'That’s right.',
    mode + ' touch completion did not reach the correct response.',
  );
  const targets = await page.locator('#operation-button, #answer-numerator, #answer-denominator, #answer-form button[type=submit]')
    .evaluateAll((elements) => elements.map((element) => {
      const box = element.getBoundingClientRect();
      return { width: box.width, height: box.height };
    }));
  assert(
    targets.every((target) => target.width >= 24 && target.height >= 24),
    mode + ' touch path includes a target below 24x24px.',
  );
  await context.close();
  return {
    passed: true,
    realTouchEvents: true,
    targetSizes: targets,
    answerTextEntry: 'Fields were tapped and focused; text was supplied by the browser driver because the headless context has no mobile operating-system keyboard.',
  };
}

async function main() {
  await fs.mkdir(evidenceDirectory, { recursive: true });
  const server = createStaticServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const baseUrl = 'http://127.0.0.1:' + server.address().port + '/FractionFlow/';
  const browser = await chromium.launch({ headless: true });
  const measurements = [];
  const participation = { keyboard: {}, touch: {} };

  try {
    for (const mode of ['takeaway', 'comparison']) {
      for (let fixtureIndex = 0; fixtureIndex < SUBTRACTION_FIXTURE_MODELS.length; fixtureIndex += 1) {
        const model = SUBTRACTION_FIXTURE_MODELS[fixtureIndex];
        for (const viewportHeight of [740, 752]) {
          for (const motion of ['standard-motion', 'reduced-motion']) {
            const { context, page } = await openPrototype(
              browser,
              baseUrl,
              mode,
              fixtureIndex,
              viewportHeight,
              motion,
            );
            await operateAndAnswer(page, mode, model);
            const measurement = await measurePage(page, viewportHeight, motion, mode);
            measurements.push({
              fixture: model.id,
              equation: String(model.left.numerator) + '/' + String(model.left.denominator)
                + ' − '
                + String(model.right.numerator) + '/' + String(model.right.denominator),
              ...measurement,
            });
            if (motion === 'standard-motion') {
              const filename = mode + '-' + model.id + '-360x' + viewportHeight + '.png';
              await page.screenshot({
                path: path.join(evidenceDirectory, filename),
                fullPage: false,
                animations: 'disabled',
              });
            }
            await context.close();
          }
        }
      }

      participation.keyboard[mode] = await runKeyboardParticipation(
        browser,
        baseUrl,
        mode,
        SUBTRACTION_FIXTURE_MODELS[0],
      );
      participation.touch[mode] = await runTouchParticipation(
        browser,
        baseUrl,
        mode,
        SUBTRACTION_FIXTURE_MODELS[0],
      );
    }
  } finally {
    await browser.close();
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }

  const results = {
    purpose: 'Synthetic browser layout and participation evidence for Plan 15; no learner observations were conducted.',
    screenshotCount: 16,
    measurements,
    participation,
  };
  await fs.writeFile(
    path.join(evidenceDirectory, 'measurements.json'),
    JSON.stringify(results, null, 2) + '\n',
    'utf8',
  );
  console.log('Captured 16 rendered screens and ' + measurements.length + ' layout/motion measurements.');
  console.log('Keyboard and touch paths completed both prototypes for the like-denominator fixture.');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
