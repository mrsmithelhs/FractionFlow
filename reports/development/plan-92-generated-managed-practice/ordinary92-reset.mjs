import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const dir = 'reports/development/plan-92-generated-managed-practice';
const dbName = 'fractionflow-comparison-record-v1';
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
let browser, context;
const results = {};
const check = (label, condition, detail = undefined) => {
  results[label] = condition ? { status: 'passed' } : { status: 'failed', detail };
  assert.ok(condition, `${label}${detail ? `: ${detail}` : ''}`);
};
const waitFor = ms => new Promise(resolve => setTimeout(resolve, ms));
async function readDb(page) {
  return Promise.race([page.evaluate(name => new Promise((resolve, reject) => {
    const open = indexedDB.open(name);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const stores = ['record', 'expanded'].filter(store => db.objectStoreNames.contains(store));
      const tx = db.transaction(stores, 'readonly');
      const requests = [];
      if (stores.includes('record')) requests.push(['legacy', tx.objectStore('record').get('root')]);
      if (stores.includes('expanded')) requests.push(['meta', tx.objectStore('expanded').get('meta')], ['events', tx.objectStore('expanded').get('events')], ['intent', tx.objectStore('expanded').get('intent')]);
      let pending = requests.length;
      const values = {};
      const done = () => { if (--pending === 0) resolve({ version: db.version, stores, legacy: values.legacy, meta: values.meta, events: values.events ?? [], intent: values.intent ?? null }); };
      if (!pending) resolve({ version: db.version, stores, legacy: null, meta: null, events: [], intent: null });
      for (const [key, request] of requests) {
        request.onsuccess = () => { values[key] = request.result; done(); };
        request.onerror = () => reject(request.error);
      }
      tx.oncomplete = () => db.close();
      tx.onabort = () => { db.close(); reject(tx.error || new Error('database inspection aborted')); };
    };
  }), dbName), waitFor(10000).then(() => { throw new Error('test-side database read timed out'); })]);
}

try {
  await server.listen();
  browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-proxy-server'] });
  context = await browser.newContext({ viewport: { width: 1093, height: 750 } });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(30000);
  const pageErrors = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  const base = `http://127.0.0.1:${server.httpServer.address().port}/`;
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-session-entry="comparison"]').waitFor();
  console.log('ordinary app loaded');

  // Enable the separate legacy comparison record through its ordinary control.
  const comparisonPanel = page.locator('.comparison-record-panel');
  if (!(await comparisonPanel.locator('button[data-record-control="toggle"]').count())) {
    await comparisonPanel.locator('summary').click();
  }
  const legacyToggle = comparisonPanel.locator('button[data-record-control="toggle"]');
  if (!(await legacyToggle.isVisible())) await comparisonPanel.locator('summary').click();
  await comparisonPanel.getByRole('button', { name: 'Start remembering' }).click();
  await page.waitForFunction(() => document.querySelector('.comparison-record-panel')?.textContent.includes('Remembering comparison activity on this browser.'));
  console.log('legacy comparison consent enabled');
  let state = await readDb(page);
  check('legacy comparison remembering is persisted on before expanded opt-in', state.version === 1 && state.legacy?.enabled === true && !state.stores.includes('expanded'), JSON.stringify({ version: state.version, enabled: state.legacy?.enabled, stores: state.stores }));

  // Expanded consent is exercised through the ordinary main.js UI.
  const expandedPanel = page.locator('.plan92-record-panel');
  await expandedPanel.getByRole('button', { name: 'Remember expanded practice on this browser' }).click();
  await page.waitForFunction(() => document.querySelector('.plan92-record-panel')?.textContent.includes('Expanded remembering is on for this browser.'));
  console.log('expanded consent enabled');
  state = await readDb(page);
  check('expanded consent is persisted on after visible opt-in', state.version === 2 && state.meta?.enabled === true, JSON.stringify({ version: state.version, enabled: state.meta?.enabled }));
  check('expanded event store starts empty', state.events.length === 0, JSON.stringify(state.events));

  // Ordinary Start creates a real episode and recorder-written exposure.
  await page.locator('[data-session-entry="comparison"]').click();
  await page.locator('.app-episode').waitFor({ state: 'visible' });
  console.log('ordinary Start mounted');
  let mountedState = null;
  for (let attempt = 0; attempt < 20; attempt++) {
    mountedState = await readDb(page);
    if (mountedState.events.length > 0) break;
    await waitFor(150);
  }
  check('ordinary mounted Start records a genuine installed exposure', mountedState.events.length === 1, JSON.stringify(mountedState.events));
  check('exposure is stored with unknown response and acceptance until learner acts', mountedState.events[0]?.first === 'unknown' && mountedState.events[0]?.accepted === 'unknown', JSON.stringify(mountedState.events[0]));
  const retainedEvent = structuredClone(mountedState.events[0]);

  // Clean exit releases the recorder; the entry panel then exposes Stop.
  await page.locator('.app-return-button').click();
  const leave = page.getByRole('dialog').getByRole('button', { name: 'Leave' });
  if (await leave.count()) await leave.click();
  await page.locator('[data-session-entry="comparison"]').waitFor();
  await expandedPanel.getByRole('button', { name: 'Stop expanded remembering' }).click();
  await page.waitForFunction(() => [...document.querySelectorAll('.plan92-record-panel [role="status"]')].some(el => el.textContent.includes('Expanded remembering stopped.')));
  const afterStop = await readDb(page);
  check('Stop disables expanded consent in stored metadata', afterStop.meta?.enabled === false, JSON.stringify(afterStop.meta));
  check('Stop retains the mounted exposure row', afterStop.events.length === 1 && JSON.stringify(afterStop.events[0]) === JSON.stringify(retainedEvent), JSON.stringify(afterStop.events));
  check('Stop leaves independent legacy comparison consent enabled', afterStop.legacy?.enabled === true, JSON.stringify(afterStop.legacy));

  // The ordinary Clear control clears the v1 and v2 records but preserves both
  // consent choices, including the already-off expanded choice.
  let clearDialog = '';
  page.once('dialog', async dialog => { clearDialog = dialog.message(); await dialog.accept(); });
  await expandedPanel.getByRole('button', { name: 'Clear practice records on this browser' }).click();
  await page.waitForFunction(() => [...document.querySelectorAll('.plan92-record-panel [role="status"]')].some(el => el.textContent.includes('Practice records were cleared.')));
  const afterClear = await readDb(page);
  check('Clear prompt names the expanded and comparison records', /expanded history/i.test(clearDialog) && /comparison practice record/i.test(clearDialog), clearDialog);
  check('legacy comparison entries remain empty after Clear', afterClear.legacy?.entries?.length === 0, JSON.stringify(afterClear.legacy));
  check('Clear removes expanded exposure rows and intent marker', afterClear.events.length === 0 && afterClear.intent === null, JSON.stringify({ events: afterClear.events, intent: afterClear.intent }));
  check('Clear preserves expanded consent choice as off', afterClear.meta?.enabled === false, JSON.stringify(afterClear.meta));
  check('Clear preserves independent legacy comparison consent choice as on', afterClear.legacy?.enabled === true, JSON.stringify(afterClear.legacy));

  check('no browser page errors', pageErrors.length === 0, JSON.stringify(pageErrors));
  const output = {
    scope: 'Ordinary / app in an isolated disposable Playwright BrowserContext; both opt-ins, direct Start, recorder-written mounted exposure, clean Leave, Stop and Clear through visible UI. Synthetic browser evidence only; no fixture, existing profile or learner data.',
    browser: browser.version(),
    database: dbName,
    initial: { legacyEnabled: state.legacy?.enabled, expandedEnabled: state.meta?.enabled, expandedEvents: state.events.length },
    mountedExposure: retainedEvent,
    afterStop: { meta: afterStop.meta, events: afterStop.events, legacy: afterStop.legacy },
    afterClear: { meta: afterClear.meta, events: afterClear.events, intent: afterClear.intent, legacy: afterClear.legacy, confirmation: clearDialog },
    checks: results,
    missing: ['No first-response or acceptance event was created; the authentic mounted exposure remains unknown until learner action.', 'Legacy comparison entries were empty throughout, so removal of a previously populated legacy record by Clear was not verified.', 'Abrupt-close epoch recovery and forced-failed Start takeover were not exercised.', 'A full reopen after Clear was not exercised; the database was read back directly in the same isolated context.'],
    pageErrors,
  };
  await writeFile(`${dir}/ordinary92-reset.json`, JSON.stringify(output, null, 2) + '\n');
  console.log(JSON.stringify({ checks: results, event: retainedEvent }));
} catch (error) {
  const failure = String(error);
  await writeFile(`${dir}/ordinary92-reset.json`, JSON.stringify({
    scope: 'Ordinary / app in an isolated disposable Playwright BrowserContext; synthetic browser evidence only.',
    browser: browser?.version(), database: dbName, checks: results, failure,
  }, null, 2) + '\n');
  throw error;
} finally {
  await context?.close();
  await browser?.close();
  await server.close();
}
