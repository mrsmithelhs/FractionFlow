import { createPlan92RecordBridge } from './plan92-record-bridge.js';
import { createPlan92RecorderLease } from './plan92-recorder-lease.js';
import { createPlan92Observer } from './plan92-observer.js';
import { allGate92Descriptors } from './plan92-catalog.js';
import { selectPlan92Sync } from './plan92-managed-selector.js';
import { rankPlan92HistoryCandidates } from './plan92-history-policy.js';

// Coordinates the optional record with managed Start and Next. Record details
// stay inside this closure; the app receives only a learner-facing notice.
export function createPlan92PracticeRecord({ bridge = createPlan92RecordBridge(), crypto = globalThis.crypto, locks = globalThis.navigator?.locks } = {}) {
  const lease = createPlan92RecorderLease({ storage: bridge, crypto, locks });
  let recorder = null, seed = 0, ranks = new Map(), choiceEpoch = null, choiceSnapshot = null;
  let freshSuffix = false, busy = false, destroyed = false, lifecycle = 0, releaseTask = Promise.resolve(), announce = () => {};
  const descriptors = allGate92Descriptors();
  const versions = { catalogRevision: 'ff92-catalog@1', policyRevision: 'ff92-policy@1', compatibilityRevision: 'ff92-compat@1', demandsRevision: 'ff92-demands@1' };
  const recorderBridge = {
    writeExposure: (epoch, identity, token) => recorder?.epoch === epoch ? recorder.writeExposure(identity, token) : Promise.resolve('stale'),
    recordFirst: (epoch, token, result, assistance) => recorder?.epoch === epoch ? recorder.recordFirst(token, result, assistance) : Promise.resolve('stale'),
    recordAcceptance: (epoch, token, assistance) => recorder?.epoch === epoch ? recorder.recordAcceptance(token, assistance) : Promise.resolve('stale'),
  };
  const observer = createPlan92Observer({ bridge: recorderBridge, crypto, onError: () => {
    void recorder?.fault(); announce('Practice can continue, but remembering could not be confirmed.');
  } });
  const resetChoice = () => { ranks = new Map(); choiceEpoch = null; choiceSnapshot = null; observer.beginVisit(null); };
  const selection = () => selectPlan92Sync({ ...versions, seed, candidates: descriptors.map(d => ({ ...d, fit: true })) });

  async function start(core) {
    if (busy || destroyed) return;
    busy = true; announce(''); let entered = false; const run = lifecycle;
    const enter = () => { entered = true; if (core() === false) leave(); };
    const cancelled = () => { if (run === lifecycle) return false; leave(); return true; };
    try {
      await releaseTask; await observer.settled();
      if (cancelled()) return;
      seed = crypto.getRandomValues(new Uint32Array(1))[0];
      for (let attempt = 0; attempt < 2; attempt++) {
        const meta = await bridge.readExpandedMeta();
        if (cancelled()) return;
        if (!meta?.enabled) { resetChoice(); enter(); return; }
        recorder = await lease.acquire();
        if (cancelled()) return;
        if (!recorder) { resetChoice(); enter(); announce('Practice started without the practice record. Another tab may be remembering.'); return; }
        if (recorder.epoch !== meta.epoch && !await recorder.reregister()) continue;
        if (cancelled()) return;
        const history = await recorder.readHistory();
        if (cancelled()) return;
        if (!history?.meta?.enabled) continue;
        const possible = await recorder.readLagSnapshot();
        if (cancelled()) return;
        const recorded = possible?.lagWindow?.retainedCount >= 2 ? possible : null;
        if (recorded && (recorded.meta.epoch !== history.meta.epoch || recorded.meta.revision !== history.meta.revision)) continue;
        const snapshot = recorded ?? history, reviewOpportunity = selection().witness.reviewOpportunity;
        ranks = new Map();
        for (const role of ['C', 'I', 'S', 'T']) {
          for (const row of rankPlan92HistoryCandidates({ candidates: descriptors.filter(d => d.role === role), events: history.entries, coverage: history.meta.coverage, recordedSnapshot: recorded, reviewOpportunity })) ranks.set(row.candidate.identity.itemId, row.priority ?? row.rank);
        }
        const install = () => { if (cancelled()) return; choiceEpoch = snapshot.meta.epoch; choiceSnapshot = recorded; observer.beginVisit(choiceEpoch); enter(); };
        const outcome = recorded ? await recorder.installRecordedChoice(recorded, install) : await recorder.installHistoryChoice(snapshot.meta.epoch, install);
        if (outcome === 'installed') return;
      }
      resetChoice(); enter(); announce('Practice started without using the practice record.');
    } catch {
      if (!cancelled()) { resetChoice(); if (!entered) enter(); announce('Practice could not use the practice record.'); }
    } finally { busy = false; }
  }

  async function next(core) {
    if (busy || destroyed) return;
    busy = true; let entered = false; const run = lifecycle;
    const cancelled = () => run !== lifecycle;
    const enter = () => { if (cancelled()) return; entered = true; core(); };
    try {
      if (!choiceEpoch) { enter(); return; }
      const installed = choiceSnapshot ? await recorder?.installRecordedChoice(choiceSnapshot, enter, { allowNewer: true }) : await recorder?.installHistoryChoice(choiceEpoch, enter);
      if (cancelled()) return;
      if (installed === 'installed') return;
      ranks = new Map(); choiceSnapshot = null;
      const meta = await bridge.readExpandedMeta();
      if (cancelled()) return;
      if (meta?.enabled && await recorder?.reregister() && !cancelled() && await recorder.installHistoryChoice(recorder.epoch, () => { if (cancelled()) return; choiceEpoch = recorder.epoch; observer.beginVisit(choiceEpoch); freshSuffix = true; enter(); }) === 'installed') return;
      if (cancelled()) return;
      resetChoice(); freshSuffix = true; enter();
    } catch { if (!cancelled()) { resetChoice(); freshSuffix = true; if (!entered) enter(); } }
    finally { busy = false; }
  }
  function orderNext(current, candidates) {
    if (!freshSuffix) return candidates;
    const pool = descriptors.filter(d => d.role === current.role).map(d => d.identity);
    const offset = selection().witness.seedDraws[current.role] % pool.length;
    return [...pool.slice(offset), ...pool.slice(0, offset)].map(identity => candidates.find(candidate => candidate.itemId === identity.itemId));
  }
  function leave() {
    lifecycle++;
    observer.retire(); choiceEpoch = null; choiceSnapshot = null; ranks = new Map();
    releaseTask = releaseTask.then(async () => { await observer.settled(); if (recorder) { await recorder.release(); recorder = null; } }).catch(() => { recorder = null; });
  }
  return Object.freeze({
    bridge,
    setNotice(handler) { if (!destroyed) announce = handler; },
    hooks: Object.freeze({ recordStorage: bridge, comparisonClearIncludesExpanded: true, interceptStart: start, selectionInput: () => seed,
      candidatePriority: d => ranks.get(d.identity.itemId) ?? 0, interceptTransition: next, orderNextCandidates: orderNext,
      onEpisodeInstalled: current => { observer.install(current); freshSuffix = false; }, onEpisodeIntent: event => observer.observe(event), onHelpOpened: () => observer.helpOpened(), onSessionLeave: leave }),
    destroy() { destroyed = true; announce = () => {}; leave(); },
  });
}
