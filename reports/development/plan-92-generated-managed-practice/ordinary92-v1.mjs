import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { applyObservation, emptyRoot, identityFromContext } from '../../../src/app/comparison-record.js';
import { resolvePlan49Context } from '../../../src/interaction/plan49-comparison-construction.js';

const dir = 'reports/development/plan-92-generated-managed-practice';
const dbName = 'fractionflow-comparison-record-v1';
const generation = '11111111111111111111111111111111';
const token = '22222222222222222222222222222222';
const assistance = { model: 'no', help: 'no', construction: 'no' };
const observation = {
  kind: 'first-accepted', token,
  identity: identityFromContext(resolvePlan49Context('plan45-compare-02')),
  support: 'high', assistance,
};
const seededRoot = applyObservation(emptyRoot(generation, true), generation, observation).root;
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
let browser, context;
const result = { scope: 'Ordinary / app only. Synthetic v1 comparison record in a fresh disposable Playwright BrowserContext; no owner fixture and no existing browser profile/data.', database: dbName, stages: {}, trace: null, errors: [] };

try {
  await server.listen();
  browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-proxy-server'] });
  context = await browser.newContext({ viewport: { width: 1093, height: 750 } });
  const base = `http://127.0.0.1:${server.httpServer.address().port}/`;
  const seedPage = await context.newPage();
  seedPage.setDefaultTimeout(10000);
  seedPage.setDefaultNavigationTimeout(30000);
  await seedPage.goto(base, { waitUntil: 'domcontentloaded' });
  await seedPage.evaluate(({ name, root }) => new Promise((resolve, reject) => {
    const request = indexedDB.open(name, 1);
    request.onupgradeneeded = () => request.result.createObjectStore('record');
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('record', 'readwrite');
      tx.objectStore('record').put(root, 'root');
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onabort = () => reject(tx.error || new Error('synthetic v1 seed aborted'));
    };
  }), { name: dbName, root: seededRoot });
  await seedPage.close();

  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.setDefaultNavigationTimeout(30000);
  page.on('pageerror', error => result.errors.push(error.message));
  await page.addInitScript(name => {
    const trace = window.ordinaryV1Trace = { enabled: true, opens: [], gets: [] };
    const open = IDBFactory.prototype.open;
    IDBFactory.prototype.open = function (databaseName, version) {
      if (trace.enabled) trace.opens.push({ name: databaseName, version: version ?? null });
      return open.call(this, databaseName, version);
    };
    const get = IDBObjectStore.prototype.get;
    IDBObjectStore.prototype.get = function (key) {
      if (trace.enabled && this.transaction.db.name === name) trace.gets.push({ name: this.transaction.db.name, store: this.name, key });
      return get.call(this, key);
    };
  }, dbName);
  await page.goto(base, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-session-entry="comparison"]').waitFor();
  await page.waitForFunction(() => window.ordinaryV1Trace.opens.some(open => open.name === 'fractionflow-comparison-record-v1'));
  result.stages.pageLoad = await page.evaluate(() => structuredClone(window.ordinaryV1Trace));

  await page.locator('[data-session-entry="comparison"]').click();
  await page.locator('.app-episode').waitFor({ state: 'visible' });
  await page.waitForTimeout(500);
  result.stages.afterStart = await page.evaluate(() => structuredClone(window.ordinaryV1Trace));
  result.trace = result.stages.afterStart;

  const persisted = await page.evaluate(async name => {
    window.ordinaryV1Trace.enabled = false;
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(name);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const value = await new Promise((resolve, reject) => {
      const request = db.transaction('record').objectStore('record').get('root');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    const version = db.version;
    db.close();
    return { version, root: value };
  }, dbName);
  result.persisted = { version: persisted.version, schema: persisted.root?.schema, enabled: persisted.root?.enabled, entries: persisted.root?.entries?.length };
  result.checks = {
    'synthetic v1 legacy root persisted before ordinary app load': persisted.version === 1 && persisted.root?.schema === 1 && persisted.root?.entries?.length === 1,
    'ordinary load and Start only request v1 or versionless opens': result.trace.opens.filter(open => open.name === dbName).every(open => open.version === null || open.version === 1),
    'ordinary load and Start never read expanded events': !result.trace.gets.some(get => get.store === 'expanded' || get.key === 'events'),
    'legacy stored record remains unchanged through ordinary Start': persisted.root?.enabled === true && persisted.root?.entries?.length === 1,
    'no browser page errors': result.errors.length === 0,
  };
  for (const [label, passed] of Object.entries(result.checks)) assert.ok(passed, label);
  result.browser = browser.version();
  await writeFile(`${dir}/ordinary92-v1.json`, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ checks: result.checks, pageLoad: result.stages.pageLoad, afterStart: result.stages.afterStart }));
} catch (error) {
  result.failure = String(error);
  if (browser) result.browser = browser.version();
  await writeFile(`${dir}/ordinary92-v1.json`, JSON.stringify(result, null, 2) + '\n');
  throw error;
} finally {
  await context?.close();
  await browser?.close();
  await server.close();
}
