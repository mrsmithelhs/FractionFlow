import { describe, expect, it } from 'vitest';
import { createPlan92RecorderLease } from '../src/app/plan92-recorder-lease.js';

const epoch = 'a'.repeat(32);
const crypto = { getRandomValues(bytes) { bytes.fill(7); return bytes; } };

function makeLocks() {
  let occupied = false;
  const locks = {
    async request(_name, _options, callback) {
      if (occupied) return callback(null);
      occupied = true;
      try { return await callback({ name: _name }); }
      finally { occupied = false; }
    },
  };
  return locks;
}

function makeStorage() {
  const calls = [];
  let claimedEpoch = epoch;
  return {
    calls,
    async claimRecorder(token) { calls.push(['claim', token]); return { epoch: claimedEpoch, recovered: false }; },
    async releaseRecorder(token) { calls.push(['release', token]); return 'released'; },
    async faultRecorder(token) { calls.push(['fault', token]); return 'faulted'; },
    async readHistory(token) { calls.push(['history', token]); return { entries: [] }; },
    async readLagSnapshot(token) { calls.push(['snapshot', token]); return null; },
    async writeExposure(generation, _identity, _episode, token) { calls.push(['exposure', generation, token]); return 'inserted'; },
    async recordFirst(generation, _episode, _result, _assistance, token) { calls.push(['first', generation, token]); return 'updated'; },
    async recordAcceptance(generation, _episode, _assistance, token) { calls.push(['acceptance', generation, token]); return 'updated'; },
    async installRecordedChoice(_snapshot, install, _options, token) { calls.push(['install', token]); install(); return 'installed'; },
    async installHistoryChoice(generation, install, token) { calls.push(['install-counted', generation, token]); install(); return 'installed'; },
  };
}

describe('Plan 92 recorder lease', () => {
  it('keeps a second tab no-history while one recorder holds the exclusive lease', async () => {
    const locks = makeLocks(), storage = makeStorage();
    const firstHost = createPlan92RecorderLease({ storage, locks, crypto });
    const first = await firstHost.acquire();
    const second = await createPlan92RecorderLease({ storage, locks, crypto }).acquire();
    expect(first?.epoch).toBe(epoch);
    expect(second).toBeNull();
    expect(storage.calls.filter(([kind]) => kind === 'claim')).toHaveLength(1);
    expect(await first.release()).toBe('released');
    expect(storage.calls.filter(([kind]) => kind === 'release')).toHaveLength(1);
  });

  it('shares one pending acquire result and never returns an inactive recorder', async () => {
    const locks = makeLocks(), storage = makeStorage();
    let finishClaim;
    storage.claimRecorder = () => new Promise(resolve => { finishClaim = () => resolve({ epoch, recovered: false }); });
    const host = createPlan92RecorderLease({ storage, locks, crypto });
    const firstPending = host.acquire();
    while (!finishClaim) await Promise.resolve();
    const secondPending = host.acquire();
    let secondSettled = false;
    secondPending.then(() => { secondSettled = true; });
    await Promise.resolve();
    expect(secondSettled).toBe(false);
    finishClaim();
    const [first, second] = await Promise.all([firstPending, secondPending]);
    expect(second).toBe(first);
    expect(first.epoch).toBe(epoch);
    expect(first.active).toBe(true);
    await first.release();
    expect(first.active).toBe(false);
  });

  it('drains in-flight recorder calls before writing a clean release', async () => {
    const locks = makeLocks(), storage = makeStorage();
    let finishWrite;
    storage.writeExposure = () => new Promise(resolve => { finishWrite = () => resolve('inserted'); });
    const recorder = await createPlan92RecorderLease({ storage, locks, crypto }).acquire();
    const write = recorder.writeExposure({}, 'b'.repeat(32));
    await Promise.resolve();
    const release = recorder.release();
    await Promise.resolve();
    expect(storage.calls.some(([kind]) => kind === 'release')).toBe(false);
    finishWrite();
    expect(await write).toBe('inserted');
    expect(await release).toBe('released');
  });

  it('marks faults synchronously and never writes a clean registration afterward', async () => {
    const locks = makeLocks(), storage = makeStorage();
    const recorder = await createPlan92RecorderLease({ storage, locks, crypto }).acquire();
    const fault = recorder.fault();
    const release = recorder.release();
    await Promise.all([fault, release]);
    expect(storage.calls.some(([kind]) => kind === 'fault')).toBe(true);
    expect(storage.calls.some(([kind]) => kind === 'release')).toBe(false);
  });

  it('faults automatically on a missing observation result', async () => {
    const locks = makeLocks(), storage = makeStorage();
    storage.recordFirst = async () => 'missing';
    const recorder = await createPlan92RecorderLease({ storage, locks, crypto }).acquire();
    expect(await recorder.recordFirst('b'.repeat(32), 'accepted')).toBe('missing');
    await Promise.resolve();
    await recorder.release();
    expect(storage.calls.some(([kind]) => kind === 'fault')).toBe(true);
    expect(storage.calls.some(([kind]) => kind === 'release')).toBe(false);
  });

  it('keeps counted-history choice installation inside the registered writer capability', async () => {
    const locks = makeLocks(), storage = makeStorage();
    const recorder = await createPlan92RecorderLease({ storage, locks, crypto }).acquire();
    let installed = false;
    expect(await recorder.installHistoryChoice(epoch, () => { installed = true; })).toBe('installed');
    expect(installed).toBe(true);
    expect(storage.calls.find(([kind]) => kind === 'install-counted')?.[1]).toBe(epoch);
    await recorder.release();
  });
});
