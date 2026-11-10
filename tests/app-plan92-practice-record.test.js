import { describe, expect, it } from 'vitest';
import { createPlan92PracticeRecord } from '../src/app/plan92-practice-record.js';
import { allGate92Descriptors } from '../src/app/plan92-catalog.js';
import { selectPlan92Sync } from '../src/app/plan92-managed-selector.js';

function cryptoMock() {
  let n = 0;
  return { getRandomValues(array) { array[0] = ++n; return array; } };
}

function mockLocks({ unavailable = false, events = [] } = {}) {
  return { request: async (_name, _options, callback) => {
    if (unavailable) return callback(null);
    let unlock;
    const held = new Promise(resolve => { unlock = resolve; });
    const task = Promise.resolve(callback({ name: 'held' }));
    events.push({ unlock, task });
    return task;
  } };
}

function mockBridge({ enabled = false, history, lag, events = [] } = {}) {
  let epoch = 'epoch-1';
  let expandedEnabled = enabled;
  return {
    events,
    async readExpandedMeta() { events.push('meta'); return { enabled: expandedEnabled, epoch }; },
    async claimRecorder() { events.push('claim'); return { epoch }; },
    async readHistory() { events.push('history'); return history ?? { meta: { enabled: true, epoch, revision: 1, coverage: 'unknown' }, entries: [] }; },
    async readLagSnapshot() { events.push('lag'); return lag ?? null; },
    async installHistoryChoice(_epoch, install) { events.push('install-history'); install(); return 'installed'; },
    async installRecordedChoice(_snapshot, install) { events.push('install-recorded'); install(); return 'installed'; },
    async releaseRecorder() { events.push('release'); for (const item of events) if (item && typeof item === 'object' && item.unlock) item.unlock(); return 'released'; },
    async faultRecorder() { events.push('fault'); return 'faulted'; },
    async stopExpanded() { events.push('stop'); expandedEnabled = false; },
    async clear() { events.push('clear'); epoch = 'epoch-2'; },
    async writeExposure() { events.push('exposure'); return 'inserted'; },
    async recordFirst() { events.push('first'); return 'updated'; },
    async recordAcceptance() { events.push('acceptance'); return 'updated'; },
  };
}

const tick = () => new Promise(resolve => setTimeout(resolve, 0));
function deferred() { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; }
function expectSeedSuffix(record) {
  const candidates = allGate92Descriptors().filter(d => d.role === 'C').map(d => d.identity);
  const input = record.hooks.selectionInput();
  const witness = selectPlan92Sync({ seed: input, candidates: allGate92Descriptors().map(d => ({ ...d, fit: true })), catalogRevision: 'ff92-catalog@1', policyRevision: 'ff92-policy@1', compatibilityRevision: 'ff92-compat@1', demandsRevision: 'ff92-demands@1' }).witness;
  const offset = witness.seedDraws.C % candidates.length;
  expect(record.hooks.orderNextCandidates({ role: 'C' }, candidates).map(x => x.itemId)).toEqual([...candidates.slice(offset), ...candidates.slice(0, offset)].map(x => x.itemId));
}

describe('Plan 92 practice record coordinator', () => {
  it('keeps direct Start independent of expanded record reads and writes when disabled', async () => {
    const events = [], bridge = mockBridge({ events });
    const record = createPlan92PracticeRecord({ bridge, crypto: cryptoMock(), locks: mockLocks() });
    let starts = 0;
    await record.hooks.interceptStart(() => starts++);
    expect(starts).toBe(1);
    expect(events).toEqual(['meta']);
  });

  it('acquires registration and installs history choice when enabled', async () => {
    const events = [], bridge = mockBridge({ enabled: true, events });
    const locks = mockLocks({ events });
    const record = createPlan92PracticeRecord({ bridge, crypto: cryptoMock(), locks });
    let starts = 0;
    await record.hooks.interceptStart(() => starts++);
    expect(starts).toBe(1);
    expect(events).toContain('claim');
    expect(events).toContain('history');
    expect(events).toContain('install-history');
    record.destroy();
    await tick();
  });

  it('falls back to ordinary Start with a learner notice under recorder contention', async () => {
    const events = [], bridge = mockBridge({ enabled: true, events });
    const record = createPlan92PracticeRecord({ bridge, crypto: cryptoMock(), locks: mockLocks({ unavailable: true }) });
    let notice = '', starts = 0;
    record.setNotice(value => { notice = value; });
    await record.hooks.interceptStart(() => starts++);
    expect(starts).toBe(1);
    expect(notice).toMatch(/without the practice record/i);
    expect(events).not.toContain('history');
  });

  it('dispatches a double Start only once', async () => {
    const events = [], bridge = mockBridge({ events });
    const meta = deferred(); bridge.readExpandedMeta = () => { events.push('meta'); return meta.promise; };
    const record = createPlan92PracticeRecord({ bridge, crypto: cryptoMock(), locks: mockLocks({ events }) });
    let starts = 0;
    const first = record.hooks.interceptStart(() => starts++);
    const second = record.hooks.interceptStart(() => starts++);
    meta.resolve({ enabled: false });
    await Promise.all([first, second]);
    expect(starts).toBe(1);
    expect(events.filter(value => value === 'meta')).toHaveLength(1);
  });

  it('releases the recorder when the Start callback refuses the session', async () => {
    const events = [], bridge = mockBridge({ enabled: true, events });
    const record = createPlan92PracticeRecord({ bridge, crypto: cryptoMock(), locks: mockLocks({ events }) });
    let starts = 0;
    await record.hooks.interceptStart(() => { starts++; return false; });
    await tick();
    expect(starts).toBe(1);
    expect(events).toContain('release');
  });

  it('does not start or announce after destroy while acquisition is pending, and releases a late recorder', async () => {
    const events = [], bridge = mockBridge({ enabled: true, events });
    const claim = deferred(); bridge.claimRecorder = () => { events.push('claim'); return claim.promise; };
    const record = createPlan92PracticeRecord({ bridge, crypto: cryptoMock(), locks: mockLocks({ events }) });
    let starts = 0, notices = [];
    record.setNotice(value => notices.push(value));
    const starting = record.hooks.interceptStart(() => starts++);
    await tick();
    record.destroy();
    claim.resolve({ epoch: 'epoch-1' });
    await starting;
    await tick();
    expect(starts).toBe(0);
    expect(notices.filter(Boolean)).toHaveLength(0);
    expect(events).toContain('release');
  });

  it('does not reuse the old history choice after session leave', async () => {
    const events = [], bridge = mockBridge({ enabled: true, events });
    const record = createPlan92PracticeRecord({ bridge, crypto: cryptoMock(), locks: mockLocks({ events }) });
    await record.hooks.interceptStart(() => {});
    const installsBeforeStop = events.filter(value => value === 'install-history').length;
    record.hooks.onSessionLeave();
    let next = 0;
    await record.hooks.interceptTransition(() => next++);
    expect(next).toBe(1);
    expect(events.filter(value => value === 'install-history')).toHaveLength(installsBeforeStop);
  });

  it('invalidates a pending Next after session leave', async () => {
    const events = [], bridge = mockBridge({ enabled: true, events });
    const install = deferred();
    const ordinaryInstall = bridge.installHistoryChoice;
    let installCount = 0;
    bridge.installHistoryChoice = (...args) => {
      if (installCount++ === 0) return ordinaryInstall(...args);
      events.push('next-install-pending'); return install.promise;
    };
    const record = createPlan92PracticeRecord({ bridge, crypto: cryptoMock(), locks: mockLocks({ events }) });
    await record.hooks.interceptStart(() => {});
    let next = 0;
    const pending = record.hooks.interceptTransition(() => next++);
    await tick();
    record.hooks.onSessionLeave();
    install.resolve('installed');
    await pending;
    expect(next).toBe(0);
  });

  it('falls back to one seed-only core transition when Stop makes pending Next stale', async () => {
    const events = [], bridge = mockBridge({ enabled: true, events });
    const install = deferred();
    const ordinaryInstall = bridge.installHistoryChoice;
    let installCount = 0;
    bridge.installHistoryChoice = (...args) => {
      if (installCount++ === 0) return ordinaryInstall(...args);
      events.push('next-install-pending'); return install.promise;
    };
    const record = createPlan92PracticeRecord({ bridge, crypto: cryptoMock(), locks: mockLocks({ events }) });
    await record.hooks.interceptStart(() => {});
    let transitions = 0;
    const pending = record.hooks.interceptTransition(() => transitions++);
    await tick();
    await bridge.stopExpanded();
    install.resolve('stale');
    await pending;
    expect(events).toContain('stop');
    expect(events.filter(value => value === 'meta')).toHaveLength(2);
    expect(transitions).toBe(1);
    expect(record.hooks.candidatePriority({ identity: { itemId: 'anything' } })).toBe(0);
    expectSeedSuffix(record);
    expect(events).not.toContain('release');
  });

  it('re-registers and transitions under the new epoch when Clear makes pending Next stale', async () => {
    const events = [], bridge = mockBridge({ enabled: true, events });
    const install = deferred();
    const ordinaryInstall = bridge.installHistoryChoice;
    let installCount = 0;
    bridge.installHistoryChoice = (...args) => {
      if (installCount++ === 0) return ordinaryInstall(...args);
      if (installCount === 2) { events.push('next-install-pending'); return install.promise; }
      return ordinaryInstall(...args);
    };
    const record = createPlan92PracticeRecord({ bridge, crypto: cryptoMock(), locks: mockLocks({ events }) });
    await record.hooks.interceptStart(() => {});
    let transitions = 0;
    const pending = record.hooks.interceptTransition(() => transitions++);
    await tick();
    await bridge.clear();
    install.resolve('stale');
    await pending;
    expect(events).toContain('clear');
    expect(events.filter(value => value === 'claim')).toHaveLength(2);
    expect(events.filter(value => value === 'install-history')).toHaveLength(2);
    expect(transitions).toBe(1);
    expect(record.hooks.candidatePriority({ identity: { itemId: 'anything' } })).toBe(0);
    expectSeedSuffix(record);
    expect(events).not.toContain('release');
  });

  it('drains observer writes before clean release and blocks a new Start until release', async () => {
    const events = [], bridge = mockBridge({ enabled: true, events });
    let finishWrite;
    bridge.writeExposure = () => { events.push('exposure-start'); return new Promise(resolve => { finishWrite = () => { events.push('exposure-done'); resolve('inserted'); }; }); };
    const record = createPlan92PracticeRecord({ bridge, crypto: cryptoMock(), locks: mockLocks({ events }) });
    await record.hooks.interceptStart(() => {});
    const session = { index: 0 }, manifest = { id: 'plan92-prototype', entries: [{ itemId: 'x' }] };
    record.hooks.onEpisodeInstalled({ session, manifest });
    await tick();
    record.hooks.onSessionLeave();
    let startedAgain = false;
    const starting = record.hooks.interceptStart(() => { startedAgain = true; });
    await tick();
    expect(events).not.toContain('release');
    expect(startedAgain).toBe(false);
    finishWrite();
    await starting;
    expect(events.indexOf('exposure-done')).toBeLessThan(events.indexOf('release'));
    expect(startedAgain).toBe(true);
    record.destroy();
    await tick();
  });
});
