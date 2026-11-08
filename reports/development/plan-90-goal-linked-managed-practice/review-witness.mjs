import { writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const dir = 'reports/development/plan-90-goal-linked-managed-practice';
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
const runs = [], errors = []; let browser;
try {
  await server.listen(); browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-proxy-server'] });
  const base = `http://127.0.0.1:${server.httpServer.address().port}/${dir}/review-preview.html`;
  for (const [width, scale] of [[360,100],[360,200],[1093,100]]) for (const view of ['visual', 'linear']) {
    const page = await browser.newPage({ viewport: { width, height: 740 } });
    page.on('pageerror', e => errors.push(e.message));
    await page.goto(base); if (scale !== 100) await page.addStyleTag({content:`html { font-size: ${scale}% !important; }`});
    await page.locator('[data-session-entry="comparison"]').click();
    if (view === 'linear') await page.locator('.app-view-toggle').click();
    const host = page.locator(view === 'visual' ? '.app-visual-view' : '.app-linear-view');
    const ids = [], expected = [['plan45-compare-02','>'],['plan45-compare-09','>'],['plan45-compare-10','<']];
    for (const [id, relation] of expected) {
      ids.push((await page.evaluate(() => window.plan90Review.getState())).taskContext.itemId);
      assert.equal(ids.at(-1), id);
      await host.locator(`.plan45-relation-option input[value="${relation}"]`).check();
      await host.locator('.plan45-response-region').evaluate(el => el.requestSubmit());
      await host.locator('.plan45-progression-button').click();
    }
    ids.push((await page.evaluate(() => window.plan90Review.getState())).taskContext.itemId);
    assert.equal(ids.at(-1), 'distance-01');
    if (width === 360 && scale === 100 && view === 'visual') await page.screenshot({ path: `${dir}/review-distance.png`, fullPage: true });
    await host.locator('.plan51-response input[value="<"]').check();
    await host.locator('.plan51-response').evaluate(el => el.requestSubmit());
    await host.locator('[data-plan51-focus="numerator"]').fill('4');
    await host.locator('[data-plan51-focus="denominator"]').fill('8');
    await host.locator('.plan51-response').evaluate(el => el.requestSubmit());
    assert.equal((await page.evaluate(() => window.plan90Review.getState())).status, 'resolved');
    await host.locator('.plan51-next').click(); assert.equal(await page.locator('.app-entry-page').isVisible(), true);
    runs.push({ width, height: 740, view, textScale: `${scale}% CSS root`, ids, finished: true, eligibility: 'synthetic all eligible' }); await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 360, height: 740 } });
  await page.goto(`${base}?pool=empty`); await page.locator('[data-session-entry="comparison"]').click();
  assert.equal(await page.evaluate(() => window.plan90Review.getState()), null);
  assert.equal(await page.locator('.app-session-entry-notice').isVisible(), true);
  const notice = await page.locator('.app-session-entry-notice').textContent(); await page.close();
  const rollback = await browser.newPage({viewport:{width:360,height:740}});
  await rollback.goto(base); await rollback.locator('[data-session-entry="comparison"]').click();
  const host = rollback.locator('.app-visual-view');
  await host.locator('.plan45-help-summary').click();
  await host.getByRole('button',{name:'Use the same denominator'}).click();
  await host.locator('.plan49-helper-input').fill('8');
  await rollback.evaluate(() => window.plan90FailMount(true));
  await rollback.getByRole('button',{name:'Try this problem again'}).click();
  assert.equal((await rollback.evaluate(() => window.plan90Review.getState())).taskContext.itemId,'plan45-compare-02');
  assert.equal(await host.locator('.plan49-helper-input').inputValue(),'8');
  assert.equal(await rollback.evaluate(() => document.activeElement.classList.contains('app-navigation-notice')),true);
  await host.locator('.plan49-helper-input').fill('16');
  await rollback.evaluate(() => window.plan90FailMount(false));
  await rollback.getByRole('button',{name:'Try this problem again'}).click();
  assert.equal((await rollback.evaluate(() => window.plan90Review.getState())).taskContext.itemId,'plan45-compare-02');
  await host.locator('.plan45-relation-option input[value=">"]').check();
  await host.locator('.plan45-response-region').evaluate(el=>el.requestSubmit());
  await rollback.evaluate(() => window.plan90FailMount(true));
  await host.locator('.plan45-progression-button').click();
  assert.equal((await rollback.evaluate(() => window.plan90Review.getState())).taskContext.itemId,'plan45-compare-02');
  assert.equal(await rollback.evaluate(() => document.activeElement.classList.contains('app-navigation-notice')),true);
  await rollback.evaluate(() => window.plan90FailMount(false));
  await host.locator('.plan45-progression-button').click();
  assert.equal((await rollback.evaluate(() => window.plan90Review.getState())).taskContext.itemId,'plan45-compare-09');
  await rollback.close();
  await writeFile(`${dir}/review-witness-observations.json`, JSON.stringify({ browser: browser.version(), method: 'Review-only synthetic eligibility injected through the real Start control; not production fit.', runs, emptyNotice: notice, rollback: 'Forced post-mount Retry failure restored the same item, helper draft, focus to notice and editable input; a later Retry succeeded. Forced post-mount Next failure retained the completed item and focused the notice; a later Next succeeded.', errors }, null, 2) + '\n');
  if (errors.length) throw Error(errors.join('\n')); console.log(`Completed ${runs.length} managed review journeys and empty refusal.`);
} finally { await browser?.close(); await server.close(); }
