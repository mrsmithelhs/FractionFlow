import { createServer } from 'vite';
import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const output = new URL('./evidence/', import.meta.url);
await mkdir(output, { recursive: true });
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0, strictPort: true } });
let browser;
const results = [];
try {
  await server.listen();
  const url = `http://127.0.0.1:${server.httpServer.address().port}/`;
  browser = await chromium.launch({ channel: 'msedge', headless: true });
  for (const width of [360, 1093]) for (const view of ['visual', 'linear']) {
    const page = await browser.newPage({ viewport: { width, height: width === 360 ? 740 : 614 }, reducedMotion: 'reduce' });
    const sample = async (selector, bg, text) => {
      const data = await selector.evaluate(el => ({ text: el.textContent, bg: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color, padding: getComputedStyle(el).padding, role: el.getAttribute('role'), focused: el === document.activeElement, outline: getComputedStyle(el).outlineStyle, overflow: document.documentElement.scrollWidth > innerWidth }));
      assert.equal(data.bg, bg); assert.match(data.text, text); assert.equal(data.overflow, false); return data;
    };
    await page.goto(url);
    await page.locator('[data-practice-type="fraction-distance"]').click();
    if (view === 'linear') await page.locator('.app-view-toggle').click();
    const host = page.locator(`.app-${view}-view`);
    await host.locator('.plan51-response button[type=submit]').click();
    const refusal = await sample(host.locator('.house-attention'), 'rgb(242, 246, 243)', /Choose a relation/);
    await host.locator('input[value=">"]').check();
    await host.locator('.plan51-response button[type=submit]').click();
    const retry = await sample(host.locator('.house-retry'), 'rgb(254, 242, 242)', /Not quite/);
    assert.ok(await host.locator('input[value=">"]').getAttribute('aria-describedby'));
    await host.locator('input[value="<"]').check();
    await host.locator('.plan51-response button[type=submit]').click();
    await host.locator('[data-plan51-focus=numerator]').fill('1');
    await host.locator('[data-plan51-focus=denominator]').fill('2');
    await host.locator('.plan51-response button[type=submit]').click();
    const success = await sample(host.locator('.plan51-success'), 'rgb(241, 250, 244)', /That's right/);
    assert.equal(await host.locator('.plan51-success').count(), 1);
    assert.equal(await page.evaluate(() => document.activeElement?.classList.contains('plan51-next')), true);
    assert.equal(await host.locator('.plan51-result .symbolic-numerator').textContent(), '1');
    await page.goto(url);
    await page.locator('[data-practice-type="number-line-collection"]').click();
    if (view === 'linear') await page.locator('.app-view-toggle').click();
    assert.equal(await host.locator('.plan50-feedback').textContent(), '');
    assert.equal(await host.locator('.plan50-feedback.house-attention').count(), 0);
    await host.getByRole('button', { name: 'Check', exact: true }).click();
    const incomplete = await sample(host.locator('.plan50-feedback'), 'rgb(242, 246, 243)', /unplaced/);
    assert.equal(incomplete.role, null); assert.equal(incomplete.focused, true);
    for (let i = 0; i < 3; i++) {
      await host.locator('.plan50-member').nth(i).click();
      await host.getByRole('button', { name: 'Move right', exact: true }).click();
    }
    await host.getByRole('button', { name: 'Check', exact: true }).click();
    const collectionRetry = await sample(host.locator('.plan50-feedback'), 'rgb(254, 242, 242)', /marked placements/);
    assert.equal(collectionRetry.role, null); assert.equal(collectionRetry.focused, true);
    assert.ok(await host.locator('.plan50-member').first().getAttribute('aria-describedby'));
    await page.goto(url);
    await page.locator('[data-practice-type="symbolic-fraction-comparison"]').click();
    if (view === 'linear') await page.locator('.app-view-toggle').click();
    await host.locator('input[value="<"]').check();
    await host.locator('.plan45-response-region button[type=submit]').click();
    const comparisonRetry = await sample(host.locator('.plan45-recovery'), 'rgb(254, 242, 242)', /./);
    assert.ok(await host.locator('.plan45-relation-group').getAttribute('aria-describedby'));
    await host.locator('input[value=">"]').check();
    await host.locator('.plan45-response-region button[type=submit]').click();
    const comparisonSuccess = await sample(host.locator('.plan45-verification-heading'), 'rgb(241, 250, 244)', /That's right/);
    assert.equal(await host.locator('.plan45-verification-heading').count(), 1);
    assert.equal(await host.locator('.plan45-progression-button').count(), 1);
    await page.screenshot({ path: new URL(`./comparison-${view}-${width}.png`, output).pathname.replace(/^\/(\w:)/, '$1'), fullPage: true });
    await page.goto(url);
    await page.locator('[data-practice-type="bar-to-line-same-amount"]').click();
    if (view === 'linear') await page.locator('.app-view-toggle').click();
    if (view === 'visual') await host.locator('.plan39-stepper-previous').click();
    else await host.locator('.plan39-candidate input').first().check();
    await host.locator('.plan39-check-position').click();
    const unaryRetry = await sample(host.locator('.plan39-feedback'), 'rgb(254, 242, 242)', /./);
    if (view === 'visual') { await host.locator('.plan39-stepper-previous').click(); await host.locator('.plan39-stepper-next').click(); }
    else await host.locator('.plan39-candidate input').nth(1).check();
    await host.locator('.plan39-check-position').click();
    const unarySuccess = await sample(host.locator('.plan39-accepted-header'), 'rgb(241, 250, 244)', /That.s right/);
    if (view === 'visual') assert.equal(await host.locator('.plan39-accepted-point').count(), 1);
    await page.goto(`${url}reports/development/plan-52-house-learner-feedback-style/legacy-witness.html`);
    await page.locator('.app-gear-button').click();
    await page.locator('[data-support-id="medium-support"]').click();
    await page.locator('[data-practice-type="sum-under-one"]').click();
    if (view === 'linear') await page.locator('.app-view-toggle').click();
    await host.locator('.control-btn').first().click();
    await host.locator('.control-choice-btn').nth(1).click();
    const denom = host.locator(view === 'visual' ? '#decide-common-denominator-input' : '#linear-decide-common-denominator-input');
    await denom.fill('10'); await host.locator('.control-submit-btn').click();
    const arithmeticRetry = await sample(host.locator('.recovery-feedback'), 'rgb(254, 242, 242)', /not a common denominator/);
    await denom.fill('36'); await host.locator('.control-submit-btn').click();
    const unavailable = await sample(host.locator('.recovery-feedback'), 'rgb(242, 246, 243)', /valid common denominator/);
    await denom.fill('12'); await host.locator('.control-submit-btn').click();
    for (const number of ['8', '3', '11']) {
      await host.locator('input.control-numeric-input').fill(number);
      await host.locator('.control-submit-btn').click();
    }
    const arithmeticSuccess = await sample(host.locator('.house-success'), 'rgb(241, 250, 244)', /11/);
    assert.ok(await host.locator('.control-action-btn').count());
    let enlarged = null;
    if (width === 360 && view === 'linear') {
      await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
      enlarged = await sample(host.locator('.house-success'), 'rgb(241, 250, 244)', /11/);
    }
    results.push({ width, view, refusal, retry, success, incomplete, collectionRetry, comparisonRetry, comparisonSuccess, unaryRetry, unarySuccess, arithmeticRetry, unavailable, arithmeticSuccess, enlarged });
    await page.close();
  }
  await writeFile(new URL('./browser-witness.json', output), JSON.stringify({ results }, null, 2));
} finally { await browser?.close(); await server.close(); }
