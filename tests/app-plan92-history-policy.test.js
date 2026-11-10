import { describe, expect, it } from 'vitest';
import { allGate92Descriptors } from '../src/app/plan92-catalog.js';
import { rankPlan92HistoryCandidates } from '../src/app/plan92-history-policy.js';

const candidates = allGate92Descriptors().filter(d => d.role === 'C').slice(0, 8);
const unrelated = allGate92Descriptors().find(d => d.role !== candidates[0]?.role
  || d.decision.structure !== candidates[0]?.decision.structure);
const event = (d, ordinal, first = 'accepted', firstAssistance = 'unassisted') => ({
  token: String(ordinal).padStart(32, '0'), ordinal, identity: d.identity, role: d.role,
  demand: JSON.stringify(d.decision), first, accepted: first === 'accepted' ? 'yes' : 'unknown',
  firstAssistance, acceptedAssistance: first === 'accepted' ? firstAssistance : 'unknown',
});
const snapshot = (entries, overrides = {}) => {
  const epoch = overrides.epoch ?? 'a'.repeat(32);
  const rows = entries.map(e => ({ ...e, epoch: e.epoch ?? epoch }));
  return {
    meta: { epoch, enabled: true, ordering: 'continuous', revision: 0, nextOrdinal: (rows.at(-1)?.ordinal ?? 0) + 1 }, entries: rows,
    lagWindow: { epoch, earliestOrdinal: rows[0]?.ordinal ?? 1,
      latestOrdinal: rows.at(-1)?.ordinal ?? 0, retainedCount: rows.length, ordering: 'continuous', reliable: true,
      revision: 0, earliestToken: rows[0]?.token ?? null, latestToken: rows.at(-1)?.token ?? null,
      ...overrides.window },
    ...overrides.snapshot,
  };
};

describe('Plan 92 history policy', () => {
  it('returns stable catalog order without history and does not invent evidence', () => {
    const ranked = rankPlan92HistoryCandidates({ candidates });
    expect(ranked.map(x => x.candidate)).toEqual(candidates);
    expect(ranked.every(x => x.evidence.comparableCount === 0 && x.evidence.tentativeNeed === 0)).toBe(true);
  });

  it('prioritizes recent mixed need across distinct comparable problems over older successful review', () => {
    const older = candidates[0], recent = candidates.find(d => d.decision.structure === older.decision.structure && d.problemKey !== older.problemKey);
    if (!recent) return;
    const ranked = rankPlan92HistoryCandidates({ candidates: [older, recent], events: [event(older, 1), event(recent, 2, 'retry')] });
    expect(ranked[0].candidate).toBe(recent);
    expect(ranked[0].evidence.tentativeNeed).toBe(3);
  });

  it('separates exact-item reuse from skill return and admits an independent older-review draw', () => {
    const a = candidates[0], b = candidates.find(d => d !== a && d.decision.structure === a.decision.structure);
    if (!b) return;
    const tail = [2,3,4,5,6,7,8].map(n => event(unrelated, n));
    const records = [event(a, 1), ...tail];
    const normal = rankPlan92HistoryCandidates({ candidates: [a, b], recordedSnapshot: snapshot(records), events: records });
    expect(normal[0].candidate).toBe(b);
    const review = rankPlan92HistoryCandidates({ candidates: [a, b], events: records, recordedSnapshot: snapshot(records), reviewOpportunity: true });
    expect(review[0].candidate).toBe(a);
    expect(review[0].evidence.reviewOpportunity).toBe(true);
  });

  it('keeps unknown responses neutral and preserves assistance as tentative evidence', () => {
    const a = candidates[0], b = candidates[1];
    const ranked = rankPlan92HistoryCandidates({ candidates: [a, b], events: [event(a, 1, 'unknown', 'unknown'), event(b, 2, 'accepted', 'assisted')] });
    expect(ranked[0].candidate).toBe(b);
    expect(ranked[0].evidence.tentativeNeed).toBe(2);
  });

  it('counts repeated episodes of one mathematical problem once and uses its latest observation', () => {
    const a = candidates[0], b = candidates[1];
    const ranked = rankPlan92HistoryCandidates({ candidates: [a, b], events: [event(a, 1, 'retry'), event(a, 3), event(b, 2)] });
    const rowA = ranked.find(x => x.candidate === a);
    expect(rowA.evidence.problemExposureCount).toBe(1);
    expect(rowA.evidence.comparableCount).toBe(1);
    expect(rowA.evidence.tentativeNeed).toBe(3);
    expect(ranked[0].candidate).toBe(a);
  });

  it('canonicalizes serialized demand keys and lets current need outrank older review', () => {
    const a = candidates[0], b = candidates.find(d => d !== a && d.decision.structure === a.decision.structure);
    if (!b) return;
    const reordered = Object.fromEntries(Object.entries(a.decision).reverse());
    const old = { ...event(a, 1), demand: JSON.stringify(reordered) };
    const ranked = rankPlan92HistoryCandidates({ candidates: [a, b], events: [old, event(b, 2, 'retry')], reviewOpportunity: true });
    expect(ranked[0].candidate).toBe(b);
    expect(ranked[0].evidence.tentativeNeed).toBe(3);
  });

  it('gives candidates equal priority when history is empty or their evidence is identical', () => {
    const empty = rankPlan92HistoryCandidates({ candidates, events: [] });
    expect(new Set(empty.map(x => x.priority)).size).toBe(1);
    const same = rankPlan92HistoryCandidates({ candidates: [candidates[0], candidates[0]],
      events: [event(candidates[0], 1, 'retry')] });
    expect(same[0].priority).toBe(same[1].priority);
  });

  it('assigns a better priority to stronger distinct evidence', () => {
    const [a, b] = candidates;
    const ranked = rankPlan92HistoryCandidates({ candidates: [a, b], events: [event(a, 1), event(b, 2, 'retry')] });
    expect(ranked[0].candidate).toBe(b);
    expect(ranked[0].priority).toBeLessThan(ranked[1].priority);
  });

  it('does not treat an unassisted first accepted response as success before eventual acceptance', () => {
    const a = candidates[0];
    const unfinished = { ...event(a, 1), accepted: 'unknown', acceptedAssistance: 'unknown' };
    const ranked = rankPlan92HistoryCandidates({ candidates: [a], events: [unfinished], reviewOpportunity: true });
    expect(ranked[0].evidence.tentativeNeed).toBe(0);
    expect(ranked[0].evidence.reviewOpportunity).toBe(false);
  });

  it('suppresses ordinal recency and older review under unknown or gapped coverage', () => {
    const a = candidates[0], b = candidates[1], records = [event(a, 1, 'retry'), event(b, 20)];
    const forward = rankPlan92HistoryCandidates({ candidates: [a, b], events: records, reviewOpportunity: true });
    const reversed = rankPlan92HistoryCandidates({ candidates: [a, b], events: [...records].reverse(), reviewOpportunity: true });
    expect(forward.map(x => [x.priority, x.evidence.reason])).toEqual(reversed.map(x => [x.priority, x.evidence.reason]));
    expect(forward.every(x => !x.evidence.recordedOrderValid && !x.evidence.reviewOpportunity)).toBe(true);
    const gapped = rankPlan92HistoryCandidates({ candidates: [a, b], events: records, recordedSnapshot: snapshot(records, { window: { reliable: false } }), reviewOpportunity: true, coverage: 'continuous' });
    expect(gapped.every(x => !x.evidence.reviewOpportunity)).toBe(true);
  });

  it('uses explicit exposure counts under unknown coverage without inferring recency', () => {
    const [a, b] = candidates;
    const ranked = rankPlan92HistoryCandidates({ candidates: [a, b], events: [event(a, 1, 'unknown', 'unknown')], reviewOpportunity: true });
    expect(ranked[0].candidate).toBe(b);
    expect(ranked[0].priority).toBeLessThan(ranked[1].priority);
    expect(ranked[1].evidence.exactReuseCount).toBe(1);
    expect(ranked.every(x => !x.evidence.reviewOpportunity && x.evidence.reason === 'recorded-order-unverified')).toBe(true);
  });

  it('counts only 2-6 intervening retained recorded episodes as recent return', () => {
    const a = candidates[0];
    for (let lag = 2; lag <= 6; lag += 1) {
      const records = [event(a, 1, 'retry'), ...Array.from({ length: lag + 1 }, (_, i) => event(unrelated, i + 2))];
      const row = rankPlan92HistoryCandidates({ candidates: [a], recordedSnapshot: snapshot(records) })[0];
      expect(row.evidence.recordedLag).toBe(lag);
      expect(row.evidence.reason).toBe('recent-skill-return');
    }
  });

  it('permits independent seeded older review at 7 or more recorded episodes', () => {
    const a = candidates[0];
    for (const lag of [7, 9]) {
      const records = [event(a, 1), ...Array.from({ length: lag + 1 }, (_, i) => event(unrelated, i + 2))];
      const row = rankPlan92HistoryCandidates({ candidates: [a], events: records,
        recordedSnapshot: snapshot(records), reviewOpportunity: true })[0];
      expect(row.evidence.recordedLag).toBe(lag);
      expect(row.evidence.reviewOpportunity).toBe(true);
      expect(row.evidence.reason).toBe('older-review-draw');
    }
  });

  it('fails closed for missing or evicted endpoints, epoch mismatch, failed writes, reset, and malformed ordering', () => {
    const a = candidates[0], records = [event(a, 1), event(candidates[1], 2), event(candidates[1], 3), event(candidates[1], 4)];
    const valid = snapshot(records);
    const variants = [
      null,
      snapshot(records, { window: { earliestOrdinal: 2 } }),
      snapshot(records, { window: { epoch: 'b'.repeat(32) } }),
      snapshot(records, { window: { reliable: false } }),
      snapshot([records[0], records[2], records[3]]),
      snapshot(records.map(e => ({ ...e, epoch: 'b'.repeat(32) }))),
    ];
    for (const recordedSnapshot of variants) {
      const row = rankPlan92HistoryCandidates({ candidates: [a], events: records,
        recordedSnapshot, reviewOpportunity: true, coverage: 'continuous' })[0];
      expect(row.evidence.recordedOrderValid).toBe(false);
      expect(row.evidence.recordedLag).toBeNull();
      expect(row.evidence.reason).toBe('recorded-order-unverified');
      expect(row.evidence.reviewOpportunity).toBe(false);
    }
    expect(valid.lagWindow.retainedCount).toBe(4);

    const retainedAfterEviction = [event(candidates[1], 20), event(candidates[1], 21)];
    const missingOlderEndpoint = rankPlan92HistoryCandidates({ candidates: [a],
      recordedSnapshot: snapshot(retainedAfterEviction), reviewOpportunity: true })[0];
    expect(missingOlderEndpoint.evidence.recordedOrderValid).toBe(true);
    expect(missingOlderEndpoint.evidence.recordedLag).toBeNull();
    expect(missingOlderEndpoint.evidence.recordedOlderEndpointToken).toBeNull();
    expect(missingOlderEndpoint.evidence.reviewOpportunity).toBe(false);
  });

  it('keeps prior-epoch observations for counts but excludes them from lag endpoints', () => {
    const a = candidates[0], currentRows = [event(unrelated, 2), event(unrelated, 3)];
    const recordedSnapshot = snapshot(currentRows);
    const row = rankPlan92HistoryCandidates({ candidates: [a],
      events: [event(a, 1, 'retry'), ...recordedSnapshot.entries], recordedSnapshot, reviewOpportunity: true })[0];
    expect(row.evidence.exactReuseCount).toBe(1);
    expect(row.evidence.recordedOrderValid).toBe(true);
    expect(row.evidence.recordedLag).toBeNull();
    expect(row.evidence.recordedOlderEndpointToken).toBeNull();
    expect(row.evidence.reviewOpportunity).toBe(false);
  });

  it('orders per-problem evidence only within the witnessed epoch, independent of input order', () => {
    const a = candidates[0], oldEpoch = event(a, 99, 'retry'), currentSuccess = event(a, 2);
    const currentOtherSkill = event(unrelated, 3);
    const recordedSnapshot = snapshot([currentSuccess, currentOtherSkill]);
    const forward = rankPlan92HistoryCandidates({ candidates: [a],
      events: [oldEpoch, ...recordedSnapshot.entries], recordedSnapshot })[0];
    const reversed = rankPlan92HistoryCandidates({ candidates: [a],
      events: [...recordedSnapshot.entries, oldEpoch], recordedSnapshot })[0];
    expect(forward.evidence.tentativeNeed).toBe(-1);
    expect(reversed.evidence.tentativeNeed).toBe(-1);
    expect(forward.evidence).toEqual(reversed.evidence);
    expect(forward.evidence.exactReuseCount).toBe(2);
  });

  it('preserves recent mixed evidence priority over an older seeded review draw', () => {
    const older = candidates[0], recent = candidates.find(d => d.decision.structure !== older.decision.structure);
    if (!recent) return;
    const otherSkill = allGate92Descriptors().find(d => d.role !== older.role
      || (d.decision.structure !== older.decision.structure && d.decision.structure !== recent.decision.structure));
    const records = [event(older, 1), event(otherSkill, 2), event(otherSkill, 3), event(recent, 4, 'retry'),
      ...[5,6,7,8,9].map(n => event(otherSkill, n))];
    const ranked = rankPlan92HistoryCandidates({ candidates: [older, recent], events: records,
      recordedSnapshot: snapshot(records), reviewOpportunity: true });
    expect(ranked[0].candidate).toBe(recent);
    expect(ranked[0].evidence.tentativeNeed).toBe(3);
    expect(ranked[0].evidence.recordedLag).toBe(4);
    expect(ranked[0].evidence.recentSkillReturn).toBe(true);
    expect(ranked[0].evidence.recordedOlderEndpointToken).toBe(records[3].token);
    expect(ranked[0].evidence.recordedNewerEndpointToken).toBe(records.at(-1).token);
    expect(ranked.find(row => row.candidate === older).evidence.reviewOpportunity).toBe(true);
  });

  it('uses verified recent skill return to rank equal need without reusing the exact problem', () => {
    const constructions = allGate92Descriptors().filter(d => d.role === 'T');
    const older = constructions.find(d => d.decision.denominatorRelationship === 'coprime');
    const [recent, observedSameSkill] = constructions.filter(d => d.decision.denominatorRelationship === 'shared-factor');
    expect(older && recent && observedSameSkill).toBeTruthy();
    const otherSkill = candidates[1];
    const records = [event(older, 1, 'retry'), event(otherSkill, 2), event(otherSkill, 3),
      event(observedSameSkill, 4, 'retry'), ...[5,6,7,8,9].map(n => event(otherSkill, n))];
    const ranked = rankPlan92HistoryCandidates({ candidates: [older, recent], recordedSnapshot: snapshot(records) });
    expect(ranked[0].candidate).toBe(recent);
    expect(ranked[0].evidence.tentativeNeed).toBe(3);
    expect(ranked[1].evidence.tentativeNeed).toBe(3);
    expect(ranked[0].evidence.recordedLag).toBe(4);
    expect(ranked[1].evidence.recordedLag).toBe(7);
    expect(ranked[0].evidence.exactReuseCount).toBe(0);
  });

  it('does not call an old retry recent when the recent endpoint itself has unknown evidence', () => {
    const [a, sameSkill] = allGate92Descriptors().filter(d => d.role === 'I' && d.decision.side === 'left');
    expect(a && sameSkill).toBeTruthy();
    const current = [event(sameSkill, 1, 'unknown', 'unknown'),
      event(unrelated, 2), event(unrelated, 3), event(unrelated, 4)];
    const old = { ...event(a, 50, 'retry'), epoch: 'b'.repeat(32) };
    const row = rankPlan92HistoryCandidates({ candidates: [a], events: [old, ...current], recordedSnapshot: snapshot(current) })[0];
    expect(row.evidence.tentativeNeed).toBe(3);
    expect(row.evidence.recordedLag).toBe(2);
    expect(row.evidence.recentSkillReturn).toBe(false);
    expect(row.evidence.reason).not.toBe('recent-skill-return');
  });
});
