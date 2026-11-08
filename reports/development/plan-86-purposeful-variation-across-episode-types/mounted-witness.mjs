import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const out = path.dirname(fileURLToPath(import.meta.url));
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
const cases = [
  { id: 'add-baseline', practice: 'sum-under-one', converts: ['8', '3'], denominator: '12', result: '11' },
  { id: 'add-variant', practice: 'sum-under-one', converts: ['8', '3'], denominator: '12', result: '11', inspect: true, wrongSide: 'left' },
  { id: 'subtract-baseline', practice: 'unlike-denominator-subtraction', converts: ['5', '2'], denominator: '10', result: '3' },
  { id: 'subtract-variant', practice: 'unlike-denominator-subtraction', converts: ['5', '2'], denominator: '10', result: '3', inspect: true, wrongSide: 'right' },
];
let browser;
const results = [], errors = [];
try {
  await server.listen();
  const root = `http://127.0.0.1:${server.httpServer.address().port}/reports/development/plan-86-purposeful-variation-across-episode-types/review-harness.html`;
  browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-proxy-server'] });
  for (const c of cases) for (const { linear, enlarged } of [
    { linear: false, enlarged: false }, { linear: true, enlarged: false },
    { linear: false, enlarged: true }, { linear: true, enlarged: true },
  ]) {
    const context = await browser.newContext({ viewport: { width: 360, height: 740 }, hasTouch: true });
    const page = await context.newPage();
    const name = `${c.id}-${linear ? 'linear' : 'visual'}${enlarged ? '-enlarged' : ''}`;
    page.on('pageerror', e => errors.push(`${name}: ${e.message}`));
    await page.goto(`${root}?case=${c.id}`);
    if (enlarged) await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    const choice = page.locator(`[data-practice-type="${c.practice}"]:visible`).first();
    if (!(await choice.isVisible())) await page.getByRole('button', { name: 'Choose what to practice' }).click();
    await choice.click();
    if (linear) await page.locator('.app-view-toggle').click();
    const host = page.locator(linear ? '.app-linear-view' : '.app-visual-view');
    const input = id => host.locator(`#${linear ? 'linear-' : ''}${id}`);
    const control = host.locator('.active-beat-controls');
    const state = () => page.evaluate(() => window.plan86ReviewApp.getState());
    assert.equal((await state()).beat, 'encounter');
    await control.locator('button').first().click();
    let submissions = 0, edits = 0;
    for (const [index, side] of ['left', 'right'].entries()) {
      assert.equal((await state()).beat, 'transform');
      const field = input(`transform-num-input-${side}`);
      if (c.inspect) {
        assert.equal(await field.isVisible(), true);
        assert.equal(await field.inputValue(), side === c.wrongSide ? (side === 'left' ? '7' : '3') : (side === 'left' ? '5' : '3'));
        assert.equal(await host.locator('.plan86-repair-fraction span').innerText(), `/ ${c.denominator}`);
        assert.match(await host.locator('.plan86-repair label').innerText(), new RegExp(`over ${c.denominator}`));
        assert.equal(await control.locator('.inspect-change-button').count(), 0);
        if (side === c.wrongSide) {
          await page.screenshot({ path: path.join(out, `${name}-active.png`), fullPage: true });
          const before = await state();
          await control.getByRole('button', { name: /^Keep new fraction/ }).click();
          const wrong = await state();
          assert.equal(wrong.schedulePosition, before.schedulePosition);
          assert.ok(wrong.lastRecovery);
          assert.equal(await host.locator('.recovery-feedback').isVisible(), true);
          await page.screenshot({ path: path.join(out, `${name}-wrong.png`), fullPage: true });
          await field.fill('6');
          await host.locator('.control-submit-btn').click();
          assert.equal((await state()).schedulePosition, before.schedulePosition);
          assert.equal(await field.inputValue(), '6');
          assert.ok((await state()).lastRecovery);
          await page.locator('.app-view-toggle').click();
          const otherHost = page.locator(linear ? '.app-visual-view' : '.app-linear-view');
          const otherField = otherHost.locator(`#${linear ? '' : 'linear-'}transform-num-input-${side}`);
          assert.equal(await otherField.inputValue(), '6');
          assert.equal(await otherHost.locator('.recovery-feedback').isVisible(), true);
          await page.locator('.app-view-toggle').click();
          assert.equal(await field.inputValue(), '6');
          await control.getByRole('button', { name: 'Need help?' }).click();
          assert.equal(await host.locator(linear ? '#linear-transform-task-help' : '#visual-transform-task-help').isVisible(), true);
          assert.equal((await state()).schedulePosition, before.schedulePosition);
          await field.fill(c.converts[index]); edits++;
          await field.press('Enter'); submissions++;
        } else {
          await control.getByRole('button', { name: /^Keep new fraction/ }).click(); submissions++;
        }
      } else {
        await field.fill(c.converts[index]); edits++;
        await host.locator('.control-submit-btn').click(); submissions++;
      }
    }
    assert.equal((await state()).beat, 'operate');
    if (c.id.startsWith('add-')) {
      await input('operate-sum-input').fill(c.result);
    } else {
      await input('operate-fraction-numerator-input').fill(c.result);
      await input('operate-fraction-denominator-input').fill(c.denominator);
    }
    await host.locator('.control-submit-btn').click(); submissions++;
    assert.equal((await state()).beat, 'resolve');
    await page.screenshot({ path: path.join(out, `${name}-accepted.png`), fullPage: true });
    const dimensions = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
    assert.equal(dimensions.scrollWidth, dimensions.width, `${name}: horizontal page overflow`);
    const expressionFits = await host.locator('.symbolic-expression').evaluateAll(nodes => nodes.every(node => [...node.children].every(child => {
      const box = child.getBoundingClientRect();
      return box.left >= 0 && box.right <= document.documentElement.clientWidth;
    })));
    assert.equal(expressionFits, true, `${name}: expression extends beyond the viewport`);
    results.push({ case: c.id, view: linear ? 'linear' : 'visual', rootTextScale: enlarged ? '200%' : '100%', successfulSubmissions: submissions, transformEdits: edits, wrongKeepRecovered: Boolean(c.inspect), ...dimensions, horizontalOverflow: dimensions.scrollWidth > dimensions.width });
    await context.close();
  }
  assert.deepEqual(errors, []);
  await writeFile(path.join(out, 'mounted-observations.json'), JSON.stringify({ method: 'Report-local Vite harness, real app and registered associations, Chrome headless; 360x740 emulated touch', browser: browser.version(), results, pageErrors: errors }, null, 2) + '\n');
  console.log(JSON.stringify(results));
} finally {
  await browser?.close();
  await server.close();
}
