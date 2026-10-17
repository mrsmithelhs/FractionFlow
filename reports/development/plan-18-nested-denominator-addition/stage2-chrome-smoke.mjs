import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const folder = path.dirname(fileURLToPath(import.meta.url));
const baseUrl = 'http://127.0.0.1:5178/FractionFlow/reports/development/plan-18-nested-denominator-addition/stage2-browser-smoke.html';
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const results = [];
try {
  for (const item of [
    { id: 'nested-one-half-plus-three-eighths', side: 'left' },
    { id: 'nested-three-eighths-plus-one-half', side: 'right' },
  ]) for (const view of ['visual', 'linear']) for (const height of [740, 752]) {
    const page = await browser.newPage({ viewport: { width: 360, height } });
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${baseUrl}?item=${item.id}`, { waitUntil: 'networkidle' });
    await page.locator('.app-practice-button').click();
    await page.locator('.app-visual-view .active-beat-controls button').first().click();
    if (view === 'linear') await page.locator('.app-view-toggle').click();
    const host = view === 'visual' ? '.app-visual-view' : '.app-linear-view';
    const fieldset = page.locator(`${host} fieldset`);
    if (await fieldset.locator('legend').innerText() !== 'Which fraction needs new parts to use eighths?') throw new Error(`${item.id}/${view}/${height}: side-choice prompt mismatch`);
    const helpButton = page.locator(`${host} .active-beat-controls .app-secondary-button`).first();
    await helpButton.click();
    const choiceBoxes = await page.locator(`${host} .nested-side-choice`).evaluateAll((buttons) => buttons.map((button) => {
      const box = button.getBoundingClientRect();
      return { width: box.width, height: box.height, left: box.left, right: box.right };
    }));
    if (choiceBoxes.length !== 2 || choiceBoxes.some((box) => box.height < 44 || box.left < 0 || box.right > 360)) throw new Error(`${item.id}/${view}/${height}: side choice geometry invalid ${JSON.stringify(choiceBoxes)}`);
    await page.screenshot({ path: path.join(folder, `stage2-${item.id}-${view}-choice-360x${height}.png`), fullPage: true });
    if (!(await page.getByText('Compare each bottom number with 8.', { exact: false }).isVisible())) throw new Error('side comparison help did not open');
    await helpButton.click();
    const wrongChoice = page.locator(`${host} .nested-side-choice`).nth(item.side === 'left' ? 1 : 0);
    await wrongChoice.focus();
    await page.keyboard.press('Enter');
    const retryFocus = await page.evaluate(() => ({ tag: document.activeElement.tagName, classes: document.activeElement.className }));
    if (!String(retryFocus.classes).includes('nested-side-choice')) throw new Error(`${item.id}/${view}/${height}: wrong-answer focus was lost: ${JSON.stringify(retryFocus)}`);
    const correctChoice = page.locator(`${host} .nested-side-choice`).nth(item.side === 'left' ? 0 : 1);
    await correctChoice.focus();
    await page.keyboard.press('Enter');
    const inputId = view === 'visual' ? `transform-num-input-${item.side}` : `linear-transform-num-input-${item.side}`;
    const conversionFocus = await page.evaluate(() => ({ tag: document.activeElement.tagName, id: document.activeElement.id }));
    if (conversionFocus.id !== inputId) throw new Error(`${item.id}/${view}/${height}: conversion-input focus was lost: ${JSON.stringify(conversionFocus)}`);
    await page.locator(`${host} .app-secondary-button`).click();
    const multiplierId = view === 'visual' ? `transform-help-multiplier-${item.side}` : `linear-transform-help-multiplier-${item.side}`;
    await page.locator(`#${multiplierId}`).fill('4');
    await page.locator(`#${multiplierId}`).locator('xpath=../..').locator('.control-submit-btn').click();
    if (await page.evaluate(() => window.plan18SmokeApp.getState().supportHistory.at(-1).classification) !== 'accepted') throw new Error(`${item.id}/${view}/${height}: multiplier help was not accepted`);
    await page.locator(`#${inputId}`).fill('4');
    await page.locator(`${host} .control-submit-btn`).click();
    const replay = page.locator('.app-replay-button');
    if (!(await replay.isVisible()) || await replay.isDisabled()) throw new Error(`${item.id}/${view}/${height}: Replay unavailable after conversion`);
    const beforeReplay = await page.evaluate(() => ({ viewportWidth: innerWidth, documentWidth: document.documentElement.scrollWidth, documentHeight: document.documentElement.scrollHeight }));
    await page.screenshot({ path: path.join(folder, `stage2-${item.id}-${view}-360x${height}.png`), fullPage: true });
    await replay.click();
    if (await replay.getAttribute('aria-pressed') !== 'true') throw new Error(`${item.id}/${view}/${height}: Replay did not activate`);
    await page.screenshot({ path: path.join(folder, `stage2-${item.id}-${view}-converted-360x${height}.png`), fullPage: true });
    const operationInputId = view === 'visual' ? 'operate-sum-input' : 'linear-operate-sum-input';
    await page.locator(`#${operationInputId}`).fill('7');
    await page.locator(`${host} .control-submit-btn`).click();
    const beforeFinishSummary = await page.locator(`${host} .completed-beats-section`).evaluate((el) => el.textContent);
    if (!beforeFinishSummary.includes('1/2 = 4/8') && !beforeFinishSummary.includes('4/8 = 1/2')) throw new Error(`${item.id}/${view}/${height}: actual conversion summary missing`);
    if (/same size parts|common denominator/i.test(beforeFinishSummary)) throw new Error(`${item.id}/${view}/${height}: legacy Notice/denominator summary leaked`);
    await page.locator(`${host} .active-beat-controls button`).click();
    if (await page.evaluate(() => window.plan18SmokeApp.getState().status) !== 'resolved') throw new Error(`${item.id}/${view}/${height}: Finish did not resolve the episode`);
    const afterFinishSummary = await page.locator(`${host} .completed-beats-section`).evaluate((el) => el.textContent);
    if (/same size parts|common denominator/i.test(afterFinishSummary)) throw new Error(`${item.id}/${view}/${height}: legacy summary appeared after Finish`);
    await page.screenshot({ path: path.join(folder, `stage2-${item.id}-${view}-finished-360x${height}.png`), fullPage: true });
    if (beforeReplay.documentWidth > beforeReplay.viewportWidth) throw new Error(`${item.id}/${view}/${height}: horizontal page overflow ${JSON.stringify(beforeReplay)}`);
    results.push({ itemId: item.id, view, viewport: { width: 360, height }, sideChoiceButtonBoxes: choiceBoxes, document: beforeReplay, wrongChoiceFocus: retryFocus, correctChoiceFocus: conversionFocus, replayActivated: true, finishedSummary: afterFinishSummary, pageErrors: errors });
    await page.close();
  }
} finally {
  await browser.close();
}
await writeFile(path.join(folder, 'stage2-chrome-smoke-results.json'), `${JSON.stringify({ fixture: 'unshipped one-item subset of the exact registered set@6 item, navigated through visible app controls', channel: 'chrome', cases: results }, null, 2)}\n`);
console.log(JSON.stringify(results, null, 2));
