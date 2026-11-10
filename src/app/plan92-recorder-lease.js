import { randomRecordToken } from './comparison-record-storage.js';

// A review-only profile can pass this name to its bridge. Keep it distinct
// from the default comparison-record database.
export const PLAN92_REVIEW_DB_NAME = 'ff92-review-registered-v1';
const LEASE_LOCK = 'fractionflow-plan92-recorder-exclusive';

/**
 * Owns the single expanded-history writer slot for this origin. The lifetime
 * Web Lock is intentionally different from the store's short transaction
 * lock, so recorder methods never nest a request for the same lock.
 *
 * Call release only after external observer queues have settled. This object
 * drains its own calls, but cannot observe queues owned by its caller. There is
 * no unload handler: abrupt close leaves durable `active` registration so the
 * next owner rotates the epoch instead of trusting the old window.
 */
export function createPlan92RecorderLease({
  storage,
  locks = globalThis.navigator?.locks,
  crypto = globalThis.crypto,
} = {}) {
  if (!storage) throw new TypeError('recorder storage required');

  let current = null;

  async function acquire() {
    if (current && !current.released) return current.active ? current.api : current.acquiredPromise;
    if (typeof locks?.request !== 'function') return null;

    const registrationToken = randomRecordToken(crypto);
    let acquiredResolve;
    const acquired = new Promise(resolve => { acquiredResolve = resolve; });
    let releaseResolve;
    const releaseSignal = new Promise(resolve => { releaseResolve = resolve; });
    let settled = false;
    const resolveAcquire = value => {
      if (settled) return;
      settled = true;
      acquiredResolve(value);
    };

    let owner;
    const lockTask = Promise.resolve().then(() => locks.request(
      LEASE_LOCK,
      { mode: 'exclusive', ifAvailable: true },
      async lock => {
        if (!lock) { resolveAcquire(null); return; }
        try {
          const registration = await storage.claimRecorder(registrationToken);
          if (!registration || !registration.epoch) { resolveAcquire(null); return; }
          owner.epoch = registration.epoch;
          owner.active = true;
          resolveAcquire(owner.api);
          await releaseSignal;
        } catch {
          owner.faulted = true;
          try { await storage.faultRecorder(registrationToken); } catch { /* durable active registration remains orphaned */ }
          resolveAcquire(null);
        } finally {
          owner.active = false;
        }
      },
    ));
    lockTask.catch(() => resolveAcquire(null));

    owner = {
      epoch: null,
      active: false,
      closing: false,
      faulted: false,
      released: false,
      inFlight: new Set(),
      faultTask: null,
      registrationToken,
      resolveRelease: releaseResolve,
      acquiredPromise: acquired,
    };

    function fault() {
      // Mark synchronously so a concurrent release cannot write `clean`.
      owner.faulted = true;
      if (!owner.faultTask) {
        owner.faultTask = Promise.resolve().then(() => storage.faultRecorder(registrationToken)).catch(() => 'faulted');
      }
      return owner.faultTask;
    }

    function run(operation, expected) {
      if (!owner.active || owner.closing || owner.faulted) return Promise.resolve('stale');
      const task = Promise.resolve().then(operation);
      owner.inFlight.add(task);
      task.then(result => {
        if (expected && !expected.includes(result)) void fault();
      }, () => { void fault(); }).finally(() => owner.inFlight.delete(task));
      return task;
    }

    const api = Object.freeze({
      get epoch() { return owner.epoch; },
      get state() { return owner.released ? 'released' : owner.faulted ? 'faulted' : owner.closing ? 'closing' : owner.active ? 'active' : 'pending'; },
      get active() { return owner.active && !owner.closing && !owner.faulted && !owner.released; },
      get faulted() { return owner.faulted; },
      readHistory: () => run(() => storage.readHistory(registrationToken)),
      readLagSnapshot: () => run(() => storage.readLagSnapshot(registrationToken)),
      writeExposure: (identity, episodeToken) => run(
        () => storage.writeExposure(owner.epoch, identity, episodeToken, registrationToken),
        ['inserted', 'duplicate', 'stale'],
      ),
      recordFirst: (episodeToken, result, assistance = 'unknown') => run(
        () => storage.recordFirst(owner.epoch, episodeToken, result, assistance, registrationToken),
        ['updated', 'duplicate', 'stale'],
      ),
      recordAcceptance: (episodeToken, assistance = 'unknown') => run(
        () => storage.recordAcceptance(owner.epoch, episodeToken, assistance, registrationToken),
        ['updated', 'duplicate', 'stale'],
      ),
      installRecordedChoice: (snapshot, install, options = {}) => run(
        () => storage.installRecordedChoice(snapshot, install, options, registrationToken),
        ['installed', 'stale'],
      ),
      installHistoryChoice: (generation, install) => run(
        () => storage.installHistoryChoice(generation, install, registrationToken),
        ['installed', 'stale'],
      ),
      reregister: () => run(async () => {
        const registration = await storage.claimRecorder(registrationToken);
        if (!registration?.epoch) return null;
        owner.epoch = registration.epoch;
        return registration.epoch;
      }),
      fault,
      async release() {
        if (owner.released) return owner.faulted ? 'faulted' : 'released';
        owner.closing = true;
        while (owner.inFlight.size) await Promise.allSettled([...owner.inFlight]);
        if (owner.faultTask) await owner.faultTask;
        let result = 'faulted';
        if (!owner.faulted && owner.active) {
          try { result = await storage.releaseRecorder(registrationToken); }
          catch { result = 'faulted'; }
          if (result !== 'released') {
            owner.faulted = true;
            try { await storage.faultRecorder(registrationToken); } catch { /* active registration forces orphan recovery */ }
          }
        }
        owner.released = true;
        owner.resolveRelease();
        await lockTask.catch(() => {});
        return result;
      },
    });

    owner.api = api;
    current = owner;
    const result = await acquired;
    if (!result) {
      owner.released = true;
      owner.resolveRelease();
      await lockTask.catch(() => {});
      if (current === owner) current = null;
      return null;
    }
    return result;
  }

  return Object.freeze({ acquire });
}
