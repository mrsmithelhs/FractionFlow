import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { applyObservation, emptyRoot, identityFromContext } from '../../../src/app/comparison-record.js';
import { resolvePlan49Context } from '../../../src/interaction/plan49-comparison-construction.js';

const dir = 'reports/development/plan-92-generated-managed-practice';
const dbName = 'fractionflow-comparison-record-v1';
const generation = '33333333333333333333333333333333';
const observation = {
  kind: 'first-accepted', token: '44444444444444444444444444444444',
  identity: identityFromContext(resolvePlan49Context('plan45-compare-02')),
  support: 'high', assistance: { model: 'no', help: 'no', construction: 'no' },
};
const syntheticLegacyRoot = applyObservation(emptyRoot(generation, true), generation, observation).root;
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
let browser, context;
const checks = {};
const step = (label, condition, detail) => { checks[label] = condition ? 'passed' : `failed: ${detail ?? ''}`; assert.ok(condition, `${label}: ${detail ?? ''}`); };
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function inspect(page) {
  return Promise.race([page.evaluate(name => new Promise((resolve, reject) => {
    const request = indexedDB.open(name);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const stores = [...db.objectStoreNames];
      const tx = db.transaction(stores, 'readonly');
      const state = { version: db.version, stores, legacy: null, meta: null, events: [], intent: null };
      let count = 0;
      const add = (field, store, key) => {
        count++;
        const get = tx.objectStore(store).get(key);
        get.onsuccess = () => { state[field] = get.result ?? (field === 'events' ? [] : null); if (--count === 0) resolve(state); };
        get.onerror = () => reject(get.error);
      };
      if (stores.includes('record')) add('legacy', 'record', 'root');
      if (stores.includes('expanded')) { add('meta', 'expanded', 'meta'); add('events', 'expanded', 'events'); add('intent', 'expanded', 'intent'); }
      if (!count) resolve(state);
      tx.oncomplete = () => db.close();
      tx.onabort = () => { db.close(); reject(tx.error || new Error('inspection transaction aborted')); };
    };
  }), dbName), delay(8000).then(() => { throw new Error('test-side IDB inspection timed out'); })]);
}
async function waitForExposure(page) {
  let state;
  for (let i = 0; i < 24; i++) {
    state = await inspect(page);
    if (state.events.length) return state;
    await delay(150);
  }
  return state;
}
async function start(page) {
  await page.locator('[data-session-entry="comparison"]').click();
  await page.locator('.app-episode').waitFor({ state: 'visible' });
  return waitForExposure(page);
}
async function openApp() {
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(30000);
  page.on('pageerror', error => browserErrors.push(error.message));
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-session-entry="comparison"]').waitFor();
  return page;
}
let base;
const browserErrors = [];
let output = { scope: 'Ordinary app / in fresh isolated Playwright context. One synthetic populated legacy v1 entry seeds the Clear case; Plan 92 exposures are created only by ordinary mounted Start. No owner fixture, existing profile or learner data.', database: dbName, checks };

try {
  await server.listen();
  browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-proxy-server'] });
  context = await browser.newContext({ viewport: { width: 1093, height: 750 } });
  base = `http://127.0.0.1:${server.httpServer.address().port}/`;

  let page = await openApp();
  // Seed only the legacy v1 comparison record. This is test data for Clear,
  // not claimed as an ordinary learner exposure.
  await page.evaluate(({ name, root }) => new Promise((resolve, reject) => {
    const open = indexedDB.open(name, 1);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction('record', 'readwrite');
      tx.objectStore('record').put(root, 'root');
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onabort = () => reject(tx.error || new Error('legacy test seed aborted'));
    };
  }), { name: dbName, root: syntheticLegacyRoot });
  const beforeUpgrade = await inspect(page);
  step('synthetic populated v1 record is present before UI Clear', beforeUpgrade.version === 1 && beforeUpgrade.legacy?.entries?.length === 1 && beforeUpgrade.legacy.enabled === true, JSON.stringify(beforeUpgrade.legacy));

  const historyPanel = page.locator('.plan92-record-panel');
  await historyPanel.getByRole('button', { name: 'Remember expanded practice on this browser' }).click();
  await page.waitForFunction(() => document.querySelector('.plan92-record-panel')?.textContent.includes('Expanded remembering is on for this browser.'));
  const beforeClear = await inspect(page);
  step('ordinary opt-in upgrades while preserving populated legacy entry', beforeClear.version === 2 && beforeClear.legacy?.enabled === true && beforeClear.legacy.entries.length === 1 && beforeClear.meta?.enabled === true, JSON.stringify({ legacy: beforeClear.legacy, meta: beforeClear.meta }));

  let confirmation = '';
  page.once('dialog', async dialog => { confirmation = dialog.message(); await dialog.accept(); });
  await historyPanel.getByRole('button', { name: 'Clear practice records on this browser' }).click();
  await page.waitForFunction(() => [...document.querySelectorAll('.plan92-record-panel [role="status"]')].some(el => el.textContent.includes('Practice records were cleared.')));
  const afterClear = await inspect(page);
  step('Clear removes populated synthetic legacy entries', afterClear.legacy?.entries?.length === 0, JSON.stringify(afterClear.legacy));
  step('Clear preserves both enabled choices', afterClear.legacy?.enabled === true && afterClear.meta?.enabled === true, JSON.stringify({ legacyEnabled: afterClear.legacy?.enabled, expandedEnabled: afterClear.meta?.enabled }));
  step('Clear empties expanded rows and intent', afterClear.events.length === 0 && afterClear.intent === null, JSON.stringify({ events: afterClear.events, intent: afterClear.intent }));
  step('Clear confirmation described both records', /expanded history/i.test(confirmation) && /comparison practice record/i.test(confirmation), confirmation);

  await page.close();
  page = await openApp();
  const afterReopen = await inspect(page);
  step('new ordinary page sees cleared records and preserved choices', afterReopen.legacy?.entries?.length === 0 && afterReopen.events.length === 0 && afterReopen.legacy?.enabled === true && afterReopen.meta?.enabled === true, JSON.stringify({ legacy: afterReopen.legacy, events: afterReopen.events, meta: afterReopen.meta }));

  // Begin a fresh real exposure, then close the active writer page without
  // clicking Leave. Opening a new ordinary page and starting again must rotate
  // the orphaned epoch while retaining the earlier exposure.
  const firstVisit = await start(page);
  step('first ordinary Start creates mounted exposure before abrupt close', firstVisit.events.length === 1, JSON.stringify(firstVisit.events));
  const oldEpoch = firstVisit.meta.epoch;
  const oldEvent = structuredClone(firstVisit.events[0]);
  await page.close(); // abrupt tab close: deliberately skip app Leave/destroy path

  const recoveryPage = await openApp();
  const recovered = await start(recoveryPage);
  step('abrupt-close recovery retains prior exposure and records a new one', recovered.events.length === 2 && recovered.events.some(event => event.token === oldEvent.token), JSON.stringify(recovered.events));
  step('abrupt-close recovery rotates to a new active epoch', recovered.meta?.epoch !== oldEpoch && recovered.events.some(event => event.epoch === oldEpoch) && recovered.events.some(event => event.epoch === recovered.meta.epoch), JSON.stringify({ oldEpoch, meta: recovered.meta, eventEpochs: recovered.events.map(event => event.epoch) }));
  step('recovered writer registration is active in the new epoch', recovered.meta?.enabled === true && recovered.meta?.writerRegistration?.state === 'active' && recovered.meta.writerRegistration.epoch === recovered.meta.epoch, JSON.stringify(recovered.meta));
  step('ordinary pages had no JavaScript errors', browserErrors.length === 0, JSON.stringify(browserErrors));

  output = {
    ...output,
    browser: browser.version(),
    initialLegacySeed: { source: 'synthetic valid v1 comparison-record root; one seeded test entry, enabled true', record: beforeUpgrade.legacy },
    afterClear: { confirmation, legacy: afterClear.legacy, meta: afterClear.meta, events: afterClear.events, intent: afterClear.intent },
    afterReopen: { legacy: afterReopen.legacy, meta: afterReopen.meta, events: afterReopen.events },
    abruptClose: { oldEpoch, retainedOldEvent: oldEvent, recoveredMeta: recovered.meta, recoveredEvents: recovered.events },
    checks,
    missing: ['No first-response or acceptance outcome was created; exposure rows remain unknown until learner action.', 'Forced-failed Start and second-tab acquisition after a real refusal were not exercised; delegated to the separate refused-start run.'],
    errors: browserErrors,
  };
  await writeFile(`${dir}/ordinary92-recovery.json`, JSON.stringify(output, null, 2) + '\n');
  console.log(JSON.stringify(checks));
} catch (error) {
  output = { ...output, browser: browser?.version(), checks, failure: String(error), errors: browserErrors };
  await writeFile(`${dir}/ordinary92-recovery.json`, JSON.stringify(output, null, 2) + '\n');
  throw error;
} finally {
  await context?.close();
  await browser?.close();
  await server.close();
}
