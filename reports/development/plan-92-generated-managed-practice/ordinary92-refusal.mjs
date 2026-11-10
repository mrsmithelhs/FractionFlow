import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from 'playwright';

const dir = 'reports/development/plan-92-generated-managed-practice';
const database = 'fractionflow-comparison-record-v1';
const outcome = { scope: 'one isolated ordinary-app browser attempt; no production hooks, injected entries, or direct storage writes', database, checks: {}, limitations: [], errors: [] };
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
let browser, context;
const panel = p => p.locator('.plan92-record-panel');
async function storage(p) {
  return p.evaluate(async name => {
    const db = await new Promise((resolve, reject) => { const r = indexedDB.open(name); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
    try { return await new Promise((resolve, reject) => { const tx = db.transaction('expanded', 'readonly'), s = tx.objectStore('expanded'), a = s.get('meta'), b = s.get('events'); tx.oncomplete = () => resolve({ meta: a.result ?? null, events: b.result ?? [] }); tx.onerror = () => reject(tx.error); }); }
    finally { db.close(); }
  }, database);
}
try {
  await server.listen();
  browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-proxy-server'] });
  context = await browser.newContext({ viewport: { width: 1093, height: 750 } });
  const port = server.httpServer.address()?.port;
  if (!port) throw new Error(`Vite did not expose a listening TCP port: ${JSON.stringify(server.httpServer.address())}`);
  const base = `http://127.0.0.1:${port}/`;
  const a = await context.newPage(); a.setDefaultTimeout(9000); a.setDefaultNavigationTimeout(30000); a.on('pageerror', e => outcome.errors.push(String(e)));
  await a.goto(base, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await a.locator('[data-session-entry="comparison"]').waitFor();
  await panel(a).getByRole('button', { name: 'Remember expanded practice on this browser' }).click();
  await panel(a).locator('[role="status"]').getByText('Expanded remembering is on for this browser.').waitFor();
  outcome.checks.expandedOptIn = 'passed';

  // Keep the actual entry controls and candidate pool. A real narrow viewport
  // challenges measured preflight; no page state or production hook is altered.
  await a.setViewportSize({ width: 240, height: 220 });
  const refusalNotice = a.locator('.app-session-entry-notice');
  const episode = a.locator('.app-episode');
  const beforeClick = { noticeVisible: await refusalNotice.isVisible(), noticeText: (await refusalNotice.innerText()).trim(), episodeVisible: await episode.isVisible() };
  outcome.beforeRefusalClick = beforeClick;
  assert.equal(beforeClick.noticeVisible, false, 'Fit refusal notice was already visible before the Start attempt');
  assert.equal(beforeClick.noticeText, '', 'Fit refusal notice already contained text before the Start attempt');
  await a.locator('[data-session-entry="comparison"]').click();
  await refusalNotice.getByText('No practice fits this screen right now. Try a larger window or smaller text, or choose another practice.').waitFor({ state: 'visible', timeout: 12000 });
  await a.waitForFunction(() => document.querySelector('.app-episode')?.hasAttribute('hidden') === true, null, { timeout: 5000 });
  const refusalText = (await refusalNotice.innerText()).trim();
  const refused = !await episode.isVisible() && /No practice fits this screen right now/.test(refusalText);
  outcome.checks.realNarrowViewportStartRefusal = refused ? { result: 'passed', viewport: { width: 240, height: 220 }, visibleMessage: refusalText, beforeClick } : { result: 'failed', viewport: { width: 240, height: 220 }, visibleMessage: refusalText, episodeVisible: await episode.isVisible(), beforeClick };
  const afterRefusal = await storage(a);
  outcome.afterRefusal = { writerState: afterRefusal.meta?.writerRegistration?.state ?? null, revision: afterRefusal.meta?.revision ?? null, eventCount: afterRefusal.events.length };
  assert.equal(afterRefusal.meta?.writerRegistration?.state, 'clean', 'Recorder was not cleanly released after refused Start');

  await a.setViewportSize({ width: 1093, height: 750 });
  const b = await context.newPage(); b.setDefaultTimeout(9000); b.setDefaultNavigationTimeout(30000); b.on('pageerror', e => outcome.errors.push(String(e)));
  await b.goto(base, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await b.locator('[data-session-entry="comparison"]').waitFor();
  const initial = await storage(b);
  await b.locator('[data-session-entry="comparison"]').click();
  await b.locator('.app-episode').waitFor({ state: 'visible', timeout: 12000 });
  const notice = await b.locator('.practice-record-episode-notice').innerText().catch(() => '');
  const afterStart = await storage(b);
  outcome.checks.secondTabRecorderAcquisition = afterStart.meta?.writerRegistration?.state === 'active' && !/Another tab may be remembering/.test(notice)
    ? { result: 'passed', writerState: afterStart.meta.writerRegistration.state, notice }
    : { result: 'failed', writerState: afterStart.meta?.writerRegistration?.state ?? null, notice };
  assert.equal(outcome.checks.secondTabRecorderAcquisition.result, 'passed', 'Second tab did not acquire the recorder after refused Start released it');
  outcome.secondTab = { mountedItem: await b.locator('.app-episode').getAttribute('data-current-item-id'), initialEventCount: initial.events.length, afterStartEventCount: afterStart.events.length };
  // Force the ordinary mounted observer to finalize its exposure by leaving a
  // started but unanswered episode, then inspect the durable event record.
  const back = b.locator('.app-return-button');
  await back.click();
  const leave = b.getByRole('dialog').getByRole('button', { name: 'Leave' });
  if (await leave.count()) await leave.click();
  await b.locator('[data-session-entry="comparison"]').waitFor();
  const persisted = await storage(b);
  outcome.checks.secondTabMountedObserverWrite = persisted.events.length > initial.events.length
    ? { result: 'passed', before: initial.events.length, after: persisted.events.length, latest: persisted.events.at(-1) }
    : { result: 'failed', before: initial.events.length, after: persisted.events.length };
  assert.ok(persisted.events.length > initial.events.length, 'Second tab did not persist a mounted observer event');
  if (!refused) outcome.limitations.push('The chosen narrow viewport did not produce the expected refusal; the genuine Start refusal leg remains unproven.');
  if (outcome.checks.secondTabRecorderAcquisition.result !== 'passed') outcome.limitations.push('Second-tab recorder acquisition after the refusal was not verified.');
  if (outcome.checks.secondTabMountedObserverWrite.result !== 'passed') outcome.limitations.push('A mounted observer event was not found in test-side IndexedDB readback after leaving the second-tab episode.');
} catch (error) {
  outcome.errors.push(String(error?.stack || error));
  outcome.limitations.push('The one bounded attempt stopped at the recorded error; later legs were not established.');
} finally {
  await writeFile(`${dir}/ordinary92-refusal.json`, JSON.stringify(outcome, null, 2) + '\n');
  await context?.close(); await browser?.close(); await server.close();
}
