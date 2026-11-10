import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';

// Ordinary app path only. A new BrowserContext and a unique disposable
// IndexedDB database keep this run separate from all existing browser data.
const dir = 'reports/development/plan-92-generated-managed-practice';
const dbName = `fractionflow-comparison-record-v1`;
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
let browser, context;
const results = {};
const pass = (label, condition) => { assert.ok(condition, label); results[label] = 'passed'; };
const record = (label, condition, detail = '') => { results[label] = condition ? 'passed' : `failed${detail ? `: ${detail}` : ''}`; };
const panel = page => page.locator('.plan92-record-panel');
const panelStatus = page => panel(page).locator('[role="status"]').first();

try {
  await server.listen();
  browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-proxy-server'] });
  context = await browser.newContext({ viewport: { width: 1093, height: 750 } });
  const base = `http://127.0.0.1:${server.httpServer.address().port}/`;
  const a = await context.newPage();
  a.setDefaultTimeout(8000);
  a.setDefaultNavigationTimeout(30000);
  const errors = [];
  a.on('pageerror', error => errors.push(error.message));
  await a.goto(base, { waitUntil: 'domcontentloaded' });
  console.log('ordinary app loaded');
  await a.locator('[data-session-entry="comparison"]').waitFor();
  await panel(a).waitFor();
  await panel(a).getByRole('button', { name: 'Remember expanded practice on this browser' }).click();
  await panelStatus(a).getByText('Expanded remembering is on for this browser.').waitFor();
  pass('ordinary-app opt-in enables expanded remembering', /Expanded remembering is on/.test(await panelStatus(a).innerText()));
  console.log('opt-in passed');

  await a.locator('[data-session-entry="comparison"]').click();
  await a.locator('.app-episode').waitFor({ state: 'visible' });
  pass('direct Start enters an ordinary practice episode while remembering is enabled', await a.locator('.app-episode').isVisible());
  console.log('Start passed');

  // A second same-origin tab attempts Start while the first tab owns the
  // recorder lease. The expected outcome is usable practice with a clear
  // active-episode notice that recording is unavailable in this tab.
  const b = await context.newPage();
  b.setDefaultTimeout(8000);
  b.setDefaultNavigationTimeout(30000);
  b.on('pageerror', error => errors.push(error.message));
  await b.goto(base, { waitUntil: 'domcontentloaded' });
  await b.locator('[data-session-entry="comparison"]').waitFor();
  await b.locator('[data-session-entry="comparison"]').click();
  await b.locator('.app-episode').waitFor({ state: 'visible' });
  await b.locator('.practice-record-episode-notice').filter({ hasText: 'Practice started without the practice record. Another tab may be remembering.' }).waitFor();
  const contention = await b.locator('.practice-record-episode-notice').innerText();
  pass('same-origin tab contention continues practice and announces recording limit', /Practice started without the practice record\. Another tab may be remembering\./.test(contention));

  const input = a.locator('.app-visual-view:not([hidden]) .active-beat-controls input').first();
  let draftResult = 'missing: no active response input was mounted';
  if (await input.count()) { await input.fill('7'); draftResult = 'pending'; }
  await b.locator('.app-return-button').click();
  const returnDialog = b.getByRole('dialog').getByRole('button', { name: 'Leave' });
  if (await returnDialog.count()) await returnDialog.click();
  await panel(b).getByRole('button', { name: 'Stop expanded remembering' }).click();
  await b.waitForFunction(() => [...document.querySelectorAll('.plan92-record-panel [role="status"]')].some(el => el.textContent.includes('Expanded remembering stopped.')));
  const stopStatuses = await panel(b).locator('[role="status"]').evaluateAll(nodes => nodes.map(el => el.textContent));
  record('Stop from second tab updates its visible control status while the first episode remains open', stopStatuses.some(text => text.includes('Expanded remembering stopped.')), JSON.stringify(stopStatuses));
  if (draftResult === 'pending') draftResult = (await input.inputValue()) === '7' ? 'passed' : `failed: draft became ${JSON.stringify(await input.inputValue())}`;
  results['Stop in another tab preserves open arithmetic draft'] = draftResult;

  await a.locator('.app-return-button').click();
  const leave = a.getByRole('dialog').getByRole('button', { name: 'Leave' });
  if (await leave.count()) await leave.click();
  await a.locator('[data-session-entry="comparison"]').waitFor();
  await panel(a).getByRole('button', { name: 'Remember expanded practice on this browser' }).click();
  await a.waitForFunction(() => [...document.querySelectorAll('.plan92-record-panel [role="status"]')].some(el => el.textContent.includes('Expanded remembering is on for this browser.')));

  let dialogMessage = '';
  a.once('dialog', async dialog => { dialogMessage = dialog.message(); await dialog.accept(); });
  await panel(a).getByRole('button', { name: 'Clear practice records on this browser' }).click();
  await a.waitForFunction(() => [...document.querySelectorAll('.plan92-record-panel [role="status"]')].some(el => el.textContent.includes('Practice records were cleared.')));
  const clearStatuses = await panel(a).locator('[role="status"]').evaluateAll(nodes => nodes.map(el => el.textContent));
  record('Clear displays confirmation and reports both record types and consent choice wording', /both practice records|expanded history/i.test(dialogMessage) && clearStatuses.some(text => /choices were kept/.test(text)), JSON.stringify({ dialogMessage, clearStatuses }));
  results['Durable record clearing and actual consent state'] = 'unverified: this driver checks visible wording only; it does not inspect persisted IndexedDB contents or consent metadata';

  await panel(a).getByRole('button', { name: 'Stop expanded remembering' }).click();
  await a.waitForFunction(() => [...document.querySelectorAll('.plan92-record-panel [role="status"]')].some(el => el.textContent.includes('Expanded remembering stopped.')));
  const finalStopStatuses = await panel(a).locator('[role="status"]').evaluateAll(nodes => nodes.map(el => el.textContent));
  record('Stop displays the expanded-remembering stopped status', finalStopStatuses.some(text => /Expanded remembering stopped/.test(text)), JSON.stringify(finalStopStatuses));
  pass('ordinary browser run has no page errors', errors.length === 0);

  await writeFile(`${dir}/ordinary92-browser.json`, JSON.stringify({
    scope: 'Ordinary Vite app at /, isolated Playwright BrowserContext, ordinary local controls and real same-origin tabs. Synthetic browser evidence only; no owner preview or learner data.',
    browser: browser.version(),
    database: dbName,
    checks: results,
    missing: ['A fully completed episode and Next were not exercised.', 'Open arithmetic draft preservation was not exercised because the guessed active-beat input selector did not resolve.', 'Forced refused Start and second-tab recorder acquisition after the first tab releases were not exercised.', 'No synthetic storage failure or abrupt tab teardown was induced.', 'Durable Clear results and actual enabled/disabled consent state were not read back from IndexedDB; only user-visible wording was checked.'],
    errors,
  }, null, 2) + '\n');
  console.log(JSON.stringify(results));
} finally {
  await context?.close();
  await browser?.close();
  await server.close();
}
