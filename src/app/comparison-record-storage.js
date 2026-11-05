import { emptyRoot, validateRoot, applyObservation } from './comparison-record.js';

const STORE = 'record';
const KEY = 'root';
export function randomRecordToken(cryptoApi = globalThis.crypto) {
  if (!cryptoApi?.getRandomValues) throw new Error('secure randomness unavailable');
  const bytes = new Uint8Array(16); cryptoApi.getRandomValues(bytes);
  return Array.from(bytes, n => n.toString(16).padStart(2, '0')).join('');
}
export function createComparisonRecordStorage({ indexedDB = globalThis.indexedDB, crypto = globalThis.crypto, name = 'fractionflow-comparison-record-v1' } = {}) {
  let dbPromise;
  function open() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!indexedDB?.open) return reject(new Error('storage unavailable'));
      let request;
      try { request = indexedDB.open(name, 1); } catch (e) { reject(e); return; }
      request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE); };
      request.onerror = () => reject(request.error || new Error('open failed'));
      request.onblocked = () => reject(new Error('open blocked'));
      request.onsuccess = () => { const db = request.result; db.onversionchange = () => { db.close(); dbPromise = null; }; resolve(db); };
    }).catch(e => { dbPromise = null; throw e; });
    return dbPromise;
  }
  async function transact(fn, { create = false } = {}) {
    const db = await open();
    return new Promise((resolve, reject) => {
      let tx, result, failure;
      try { tx = db.transaction(STORE, 'readwrite'); } catch (e) { reject(e); return; }
      tx.oncomplete = () => resolve(result);
      tx.onabort = () => reject(failure || tx.error || new Error('transaction aborted'));
      tx.onerror = () => {}; // onabort is authoritative; no success until oncomplete.
      const store = tx.objectStore(STORE);
      const req = store.get(KEY);
      req.onerror = () => { failure = req.error || new Error('read failed'); };
      req.onsuccess = () => {
        try {
          const root = req.result === undefined ? (create ? emptyRoot(randomRecordToken(crypto)) : null) : validateRoot(req.result);
          const change = fn(root);
          result = change.result;
          if (change.write !== undefined) store.put(validateRoot(change.write), KEY);
        } catch (e) { failure = e; tx.abort(); }
      };
    });
  }
  return Object.freeze({
    async read() { return transact(root => ({ result: root }), { create: false }); },
    async enable() { return transact(root => { const next = root || emptyRoot(randomRecordToken(crypto)); next.enabled = true; next.generation = randomRecordToken(crypto); return { write: next, result: structuredClone(next) }; }, { create: true }); },
    async stop() { return transact(root => { if (!root) return { result: null }; root.enabled = false; root.generation = randomRecordToken(crypto); return { write: root, result: structuredClone(root) }; }); },
    async clear() { return transact(root => { if (!root) return { result: null }; const next = emptyRoot(randomRecordToken(crypto), root.enabled); return { write: next, result: structuredClone(next) }; }); },
    async record(generation, observation) { const snapshot = structuredClone(observation); return transact(root => { if (!root) return { result: 'stale' }; const applied = applyObservation(root, generation, snapshot); return { write: applied.result === 'inserted' || applied.result === 'updated' ? applied.root : undefined, result: applied.result }; }); },
    close() { if (dbPromise) dbPromise.then(db => db.close()).catch(() => {}); dbPromise = null; },
    // Explicit destructive recovery, serialized with every writer. Corrupt data is
    // never displayed and the new disabled generation invalidates old snapshots.
    async reset() {
      const db = await open();
      const replacement = emptyRoot(randomRecordToken(crypto), false);
      return new Promise((resolve, reject) => {
        let tx;
        try { tx = db.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(replacement, KEY); }
        catch (e) { reject(e); return; }
        tx.oncomplete = () => resolve(structuredClone(replacement));
        tx.onabort = () => reject(tx.error || new Error('reset aborted'));
        tx.onerror = () => {};
      });
    },
  });
}
