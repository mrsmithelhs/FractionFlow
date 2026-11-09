import { createServer } from 'vite';
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const dir = 'reports/development/plan-92-generated-managed-practice';
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
let browser, context, pages = [];
const assert = (condition, label, results) => { if (!condition) throw new Error(label); results[label] = 'passed'; };
try {
  await server.listen();
  browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--no-proxy-server'] });
  context = await browser.newContext();
  pages = [await context.newPage(), await context.newPage()];
  const url = `http://127.0.0.1:${server.httpServer.address().port}/${dir}/reset92-extra-fixture.html`;
  await Promise.all(pages.map(page => page.goto(url)));
  await Promise.all(pages.map(page => page.waitForFunction(() => window.extra92Ready)));
  await Promise.all(pages.map(page => page.evaluate(() => {
    const original = IDBDatabase.prototype.transaction;
    window.__extra92OriginalTransaction = original;
    window.extra92ReadwriteCount = 0;
    IDBDatabase.prototype.transaction = function (storeNames, mode, options) {
      if (mode === 'readwrite') window.extra92ReadwriteCount += 1;
      return original.call(this, storeNames, mode, options);
    };
  })));

  const name = `ff92-v1-ordering-disposable-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const [writer, controller] = pages;
  const results = {};
  const enabledRoot = await writer.evaluate(name => window.extra92.open(name), name);
  await controller.evaluate(name => window.extra92.connect(name), name);
  assert(enabledRoot.enabled === true, 'actual v1 adapter initialized enabled disposable root', results);

  async function holdWriteTransaction() {
    await controller.evaluate(name => {
      const req = indexedDB.open(name, 1);
      req.onerror = () => { throw req.error; };
      req.onsuccess = () => {
        const db = req.result;
        const tx = db.transaction('record', 'readwrite');
        const store = tx.objectStore('record');
        let released = false;
        window.releaseBlocker = () => { released = true; };
        function keepAlive() {
          const read = store.get('root');
          read.onsuccess = () => {
            if (!released) keepAlive();
            else window.blockerReleased = true;
          };
        }
        keepAlive();
        window.blockerReady = true;
        tx.oncomplete = () => { window.blockerDone = true; db.close(); };
        tx.onerror = () => {};
      };
    }, name);
    await controller.waitForFunction(() => window.blockerReady === true);
    return controller.evaluate(() => {
      window.blockerReady = false;
      window.blockerReleased = false;
      window.blockerDone = false;
      return true;
    });
  }

  // Write is queued before Clear behind a held transaction. The holder makes no
  // data change; it only keeps both adapter transactions pending until ordered.
  const firstBlocker = await holdWriteTransaction();
  assert(firstBlocker === true, 'first write-order blocker installed', results);
  const beforeClearObservation = await writer.evaluate(() => window.extra92.observation());
  const writerCountBefore = await writer.evaluate(() => window.extra92ReadwriteCount);
  const firstWrite = writer.evaluate(({ generation, observation }) => window.extra92.record(generation, observation), { generation: enabledRoot.generation, observation: beforeClearObservation });
  await writer.waitForFunction(count => window.extra92ReadwriteCount > count, writerCountBefore);
  const controllerCountBeforeClear = await controller.evaluate(() => window.extra92ReadwriteCount);
  const firstClear = controller.evaluate(() => window.extra92.clear());
  await controller.waitForFunction(count => window.extra92ReadwriteCount > count, controllerCountBeforeClear);
  await controller.evaluate(() => window.releaseBlocker());
  const [writeBeforeClear, clearedAfterWrite] = await Promise.all([firstWrite, firstClear]);
  await controller.waitForFunction(() => window.blockerDone === true);
  assert(writeBeforeClear === 'inserted', 'write-before-clear ordering accepts actual adapter write', results);
  assert(clearedAfterWrite.entries.length === 0 && clearedAfterWrite.enabled === true, 'clear-after-write erases it and preserves enabled state', results);

  // Queue Clear first, then a write carrying the now-stale generation.
  const currentRoot = await writer.evaluate(() => window.extra92.read());
  const staleObservation = await writer.evaluate(() => window.extra92.observation());
  const secondBlocker = await holdWriteTransaction();
  assert(secondBlocker === true, 'second write-order blocker installed', results);
  const controllerCountBeforeSecondClear = await controller.evaluate(() => window.extra92ReadwriteCount);
  const secondClear = controller.evaluate(() => window.extra92.clear());
  await controller.waitForFunction(count => window.extra92ReadwriteCount > count, controllerCountBeforeSecondClear);
  const writerCountBeforeStaleWrite = await writer.evaluate(() => window.extra92ReadwriteCount);
  const staleWrite = writer.evaluate(({ generation, observation }) => window.extra92.record(generation, observation), { generation: currentRoot.generation, observation: staleObservation });
  await writer.waitForFunction(count => window.extra92ReadwriteCount > count, writerCountBeforeStaleWrite);
  await controller.evaluate(() => window.releaseBlocker());
  const [clearedFirst, staleAfterClear] = await Promise.all([secondClear, staleWrite]);
  await controller.waitForFunction(() => window.blockerDone === true);
  assert(clearedFirst.entries.length === 0 && clearedFirst.enabled === true, 'clear-before-write establishes empty enabled root', results);
  assert(staleAfterClear === 'stale', 'write-after-clear with old generation is refused by actual adapter', results);
  assert((await writer.evaluate(() => window.extra92.read())).entries.length === 0, 'stale write leaves durable root empty', results);

  const stopped = await writer.evaluate(() => window.extra92.stop());
  assert(stopped.enabled === false, 'legacy stop disables recording', results);
  const offObservation = await writer.evaluate(() => window.extra92.observation());
  assert(await writer.evaluate(({ generation, observation }) => window.extra92.record(generation, observation), { generation: stopped.generation, observation: offObservation }) === 'stale', 'disabled legacy adapter refuses writes', results);
  assert((await writer.evaluate(() => window.extra92.read())).enabled === false, 'legacy adapter still reads its disabled record', results);

  await Promise.all(pages.map(page => page.evaluate(() => window.extra92.close())));
  const deleted = await writer.evaluate(name => new Promise((resolve, reject) => {
    const req = indexedDB.deleteDatabase(name);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('database deletion blocked'));
  }), name);
  assert(deleted, 'uniquely named disposable database deleted', results);
  const evidence = {
    browser: browser.version(),
    results,
    limitations: [
      'Actual version-1 single-store adapter ordering only; does not prove proposed version-2 two-store atomic reset.',
      'Does not exercise expanded consent state, history-aware scheduler reads, or choice installation protocol.',
      'Disabled legacy adapter writes are refused, but read() intentionally still reads the legacy record; expanded opt-in-off read refusal is untestable with this adapter.',
      'Synthetic valid comparison observation only; no learner data and no ordinary application database.',
    ],
  };
  await writeFile(`${dir}/reset92-extra-results.json`, JSON.stringify(evidence, null, 2) + '\n');
  process.stdout.write(JSON.stringify(evidence, null, 2) + '\n');
} finally {
  await context?.close();
  await browser?.close();
  await server.close();
}
