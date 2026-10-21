import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const { createStaticServer } = require('../../../../../../scripts/dev/run-route-matrix.js');
const server = createStaticServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage({ viewport: { width: 360, height: 740 }, deviceScaleFactor: 1 });
const errors = [];
let currentStep = 'startup';
page.on('pageerror', (error) => errors.push(error.message));
try {
  currentStep = 'open learner and enter visual locate';
  await page.goto(`http://127.0.0.1:${port}/FractionFlow/`, { waitUntil: 'domcontentloaded' });
  await page.locator('.app-gear-button').click();
  await page.locator('[data-support-id="medium-support"]').click();
  await page.locator('[data-practice-type="bar-to-line-same-amount"]').click();
  await page.locator('.app-visual-view .plan39-continue').click();
  assert.equal(await page.evaluate(() => document.activeElement.classList.contains('plan39-stepper-next')), true, 'Continue must focus a current locate control');
  const next = page.locator('.app-visual-view .plan39-stepper-next');
const previous = page.locator('.app-visual-view .plan39-stepper-previous');
  const check = page.locator('.app-visual-view .plan39-check-position');
  const assertPendingPreview = async (view, candidateId, focusSelector) => {
    assert.equal(await page.locator('.plan39-feedback').count(), 0, `${view}: preview must not grade before Check`);
    assert.equal(await page.locator('.plan39-accepted-point').count(), 0, `${view}: preview must not show an accepted point before Check`);
    assert.equal(await page.locator(`.app-${view}-view .plan39-check-position`).isDisabled(), false, `${view}: restored/selected preview must enable Check`);
    if (view === 'visual') {
      assert.equal(await page.locator('.app-visual-view .plan39-stepper-status').getAttribute('data-candidate-id'), candidateId, 'visual remount must restore the exact pending candidate');
    } else {
      assert.equal(await page.locator(`.app-linear-view input[data-candidate-id="${candidateId}"]`).isChecked(), true, 'linear remount must restore the exact pending candidate');
    }
    if (focusSelector) {
      assert.equal(await page.evaluate((selector) => {
        const active = document.activeElement;
        return Boolean(active?.isConnected && active.matches(selector));
      }, focusSelector), true, `${view}: focus must remain on a connected, meaningful control after remount`);
    }
  };

  // Mounted agency journey: choose A, then B, remount through linear and visual,
  // choose distinct C, and submit only through the real Check control.
  currentStep = 'preview A in visual mode';
  await next.click();
  const candidateA = await page.locator('.app-visual-view .plan39-stepper-status').getAttribute('data-candidate-id');
  await assertPendingPreview('visual', candidateA, '.plan39-stepper-next');
  currentStep = 'preview B in visual mode';
  await next.click();
  const candidateB = await page.locator('.app-visual-view .plan39-stepper-status').getAttribute('data-candidate-id');
  assert.notEqual(candidateB, candidateA, 'B must be distinct from A');
  await assertPendingPreview('visual', candidateB, '.plan39-stepper-next');
  currentStep = 'switch to linear with B pending';
  const viewToggle = page.locator('.app-view-toggle');
  await viewToggle.click();
  await assertPendingPreview('linear', candidateB, '.app-view-toggle');
  currentStep = 'switch back to visual with B pending';
  await viewToggle.click();
  await assertPendingPreview('visual', candidateB, '.app-view-toggle');
  currentStep = 'preview distinct C in visual mode';
  await next.click();
  const candidateC = await page.locator('.app-visual-view .plan39-stepper-status').getAttribute('data-candidate-id');
  assert.notEqual(candidateC, candidateB, 'C must be distinct from B');
  assert.notEqual(candidateC, candidateA, 'C must be distinct from A');
  await assertPendingPreview('visual', candidateC, '.plan39-stepper-next');
  currentStep = 'submit C with real Check';
  await check.click();
  assert.equal(await page.locator('.app-visual-view .plan39-accepted-point').count(), 1, 'the third sparse candidate must be accepted by real Check');
  assert.equal(await page.locator('.plan39-feedback').count(), 0, 'accepted Check must resolve without recovery');
  assert.equal(await page.evaluate(() => document.activeElement.classList.contains('plan39-finish')), true, 'resolved Check must focus the current Finish action');
  assert.equal(errors.length, 0, `browser page errors: ${errors.join('; ')}`);

  // Continue to the second record, then exercise recovery/help/reset/return/next
  // from a real wrong offered endpoint. The A/B/C agency journey above remains
  // a completed, separately asserted first-record path.
  currentStep = 'advance from accepted C to the next record';
  await page.locator('.app-visual-view .plan39-finish').click();
  await page.locator('.app-next-button').click();
  await page.locator('.app-visual-view .plan39-continue').click();
  await next.click();
  assert.equal(await page.locator('.app-visual-view .plan39-stepper-status').getAttribute('data-candidate-id'), 'candidate-a');
  currentStep = 'submit wrong endpoint and exercise recovery/help';
  await check.click();
  assert.equal(await page.locator('.app-visual-view .plan39-feedback[role="alert"]').count(), 1, 'wrong offered endpoint must show visible recovery');
  assert.equal(await page.evaluate(() => document.activeElement.classList.contains('plan39-stepper-next')), true, 'wrong answer must return focus to current candidate control');
  const helpButton = page.locator('.app-support-controls button').first();
  await helpButton.click();
  assert.equal(await helpButton.getAttribute('aria-expanded'), 'true');
  assert.equal(await helpButton.getAttribute('aria-controls'), 'visual-plan39-help');
  assert.equal(await page.locator('#visual-plan39-help').isVisible(), true);
  await page.locator('.app-view-toggle').click();
  assert.equal(await page.locator('.app-linear-view .plan39-feedback[role="alert"]').count(), 1, 'recovery must survive visual-to-linear change');
  assert.equal(await helpButton.getAttribute('aria-controls'), 'linear-plan39-help');
  assert.equal(await page.locator('#linear-plan39-help').isVisible(), true, 'controls must point at the mounted help paragraph');
  await page.locator('.app-view-toggle').click();
  assert.equal(await page.locator('.app-visual-view .plan39-feedback[role="alert"]').count(), 1, 'recovery must survive linear-to-visual change');
  await helpButton.click();
  assert.equal(await page.locator('#visual-plan39-help').count(), 0, 'help close must remove its target');
  await helpButton.click();
  assert.equal(await page.locator('#visual-plan39-help').isVisible(), true, 'help can reopen without altering recovery');
  assert.equal(await page.locator('.app-visual-view .plan39-feedback[role="alert"]').count(), 1);
  await previous.click();
  await previous.click();
  assert.equal(await page.locator('.app-visual-view .plan39-feedback[role="alert"]').count(), 1, 'moving back to a second offered wrong point must preserve existing recovery without adding another');
  assert.equal(await page.locator('.app-visual-view .plan39-accepted-point').count(), 0);
  assert.equal(await check.isDisabled(), false);
  await check.click();
  assert.equal(await page.locator('.app-visual-view .plan39-feedback[role="alert"]').count(), 1, 'repeat wrong offered point must show recovery again');
  assert.equal(await page.locator('#visual-plan39-help').isVisible(), true, 'repeated recovery should keep open help');
  currentStep = 'retry clears recovery, help, and preview';
  await page.locator('.app-restart-button').click();
  assert.equal(await page.locator('.app-visual-view .plan39-continue').count(), 1, 'retry must reset the bridge to encounter');
  await page.locator('.app-visual-view .plan39-continue').click();
  assert.equal(await page.locator('.app-visual-view .plan39-stepper-status').getAttribute('data-candidate-id'), null, 'retry must discard the pending preview');
  assert.equal(await page.locator('.app-visual-view .plan39-check-position').isDisabled(), true);
  assert.equal(await page.locator('#visual-plan39-help').count(), 0, 'retry must clear transient help');
  currentStep = 'return and re-enter clears transient state';
  await page.locator('.app-return-button').click();
  assert.equal(await page.locator('.app-episode').isVisible(), false, 'Return must leave the active episode');
  await page.locator('[data-practice-type="bar-to-line-same-amount"]').click();
  await page.locator('.app-visual-view .plan39-continue').click();
  assert.equal(await page.locator('.app-visual-view .plan39-check-position').isDisabled(), true);
  assert.equal(await page.locator('#visual-plan39-help').count(), 0);
  // Re-entry begins at the first medium-support record; candidate C is its exact half.
  currentStep = 'resolve first record after return and re-entry';
  await page.locator('.app-visual-view .plan39-stepper-next').click();
  await page.locator('.app-visual-view .plan39-stepper-next').click();
  await page.locator('.app-visual-view .plan39-stepper-next').click();
  await page.locator('.app-visual-view .plan39-check-position').click();
  assert.equal(await page.locator('.app-visual-view .plan39-accepted-point').count(), 1);
  await page.locator('.app-visual-view .plan39-finish').click();
  await page.locator('.app-next-button').click();
  assert.equal(await page.locator('.app-visual-view .plan39-continue').count(), 1, 'Next must install the following record at encounter');
  await page.locator('.app-visual-view .plan39-continue').click();
  assert.equal(await page.locator('.app-visual-view .plan39-stepper-status').getAttribute('data-candidate-id'), null, 'Next must not carry a previous preview');
  assert.equal(await page.locator('.app-visual-view .plan39-check-position').isDisabled(), true);
  assert.equal(errors.length, 0, `browser page errors: ${errors.join('; ')}`);
  const result = { status: 'passed', viewport: page.viewportSize(), initialFocus: true, candidateJourney: { a: candidateA, b: candidateB, c: candidateC, remounts: ['visual-to-linear', 'linear-to-visual'], submittedViaRealCheck: true, noGradeBeforeCheck: true, meaningfulFocusAfterRemount: true }, wrongRecoveryRepeat: true, helpIds: ['visual-plan39-help', 'linear-plan39-help'], resetReturnNext: true, errors };
  await writeFile('reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/checkpoint-2/repair-01/agency-journey-results.json', `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  let diagnostics = null;
  try {
    diagnostics = await page.evaluate(() => ({
      url: location.href,
      viewport: { innerWidth, innerHeight, devicePixelRatio },
      visibleView: document.querySelector('.app-linear-view:not([hidden])') ? 'linear' : 'visual',
      prompt: document.querySelector('.app-visual-view .active-beat-prompt, .app-linear-view .active-beat-prompt')?.textContent ?? null,
      visualCandidateId: document.querySelector('.app-visual-view .plan39-stepper-status')?.getAttribute('data-candidate-id') ?? null,
      linearCheckedCandidateId: document.querySelector('.app-linear-view input[data-candidate-id]:checked')?.getAttribute('data-candidate-id') ?? null,
      feedback: [...document.querySelectorAll('.plan39-feedback')].map((node) => node.textContent),
      acceptedPointCount: document.querySelectorAll('.plan39-accepted-point').length,
      activeElement: document.activeElement?.outerHTML?.slice(0, 500) ?? null,
      scrollY,
    }));
  } catch (diagnosticError) { diagnostics = { diagnosticError: diagnosticError.message }; }
  await writeFile('reports/development/plan-39-number-line-locate-and-bar-bridge-batch/evidence/checkpoint-2/repair-01/agency-journey-failure.json', `${JSON.stringify({ status: 'failed', currentStep, error: error.stack ?? error.message, diagnostics, browserErrors: errors }, null, 2)}\n`);
  throw error;
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
