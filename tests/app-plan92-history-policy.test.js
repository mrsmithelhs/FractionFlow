import { describe, expect, it } from 'vitest';
import { allGate92Descriptors } from '../src/app/plan92-catalog.js';
import { rankPlan92HistoryCandidates } from '../src/app/plan92-history-policy.js';

const candidates = allGate92Descriptors().filter(d => d.role === 'C').slice(0, 8);
const event = (d, ordinal, first = 'accepted', firstAssistance = 'unassisted') => ({
  token: String(ordinal).padStart(32, '0'), ordinal, identity: d.identity, role: d.role,
  demand: JSON.stringify(d.decision), first, accepted: first === 'accepted' ? 'yes' : 'unknown',
  firstAssistance, acceptedAssistance: first === 'accepted' ? firstAssistance : 'unknown',
});

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
    const tail = [2,3,4,5,6,7,8].map(n => event(candidates[1], n));
    const normal = rankPlan92HistoryCandidates({ candidates: [a, b], events: [event(a, 1), ...tail], coverage: 'continuous' });
    expect(normal[0].candidate).toBe(b);
    const review = rankPlan92HistoryCandidates({ candidates: [a, b], events: [event(a, 1), ...tail], reviewOpportunity: true, coverage: 'continuous' });
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
    expect(forward.every(x => x.evidence.coverage === 'unknown' && !x.evidence.reviewOpportunity)).toBe(true);
    const gapped = rankPlan92HistoryCandidates({ candidates: [a, b], events: records, reviewOpportunity: true, coverage: 'continuous' });
    expect(gapped.every(x => !x.evidence.reviewOpportunity)).toBe(true);
  });

  it('uses explicit exposure counts under unknown coverage without inferring recency', () => {
    const [a, b] = candidates;
    const ranked = rankPlan92HistoryCandidates({ candidates: [a, b], events: [event(a, 1, 'unknown', 'unknown')], reviewOpportunity: true });
    expect(ranked[0].candidate).toBe(b);
    expect(ranked[0].priority).toBeLessThan(ranked[1].priority);
    expect(ranked[1].evidence.exactReuseCount).toBe(1);
    expect(ranked.every(x => !x.evidence.reviewOpportunity && x.evidence.reason === 'coverage-unknown-no-recency')).toBe(true);
  });

  it('uses continuous-coverage boundaries for recent and older review', () => {
    const a = candidates[0], tail = [4,5,6,7,8,9].map(n => event(candidates[1], n));
    const recent = rankPlan92HistoryCandidates({ candidates: [a], events: [event(a, 2), ...tail.slice(0, 3)], coverage: 'continuous' })[0];
    expect(recent.evidence.reason).toBe('recent-repetition');
    const older = rankPlan92HistoryCandidates({ candidates: [a], events: [event(a, 1), ...tail], reviewOpportunity: true, coverage: 'continuous' })[0];
    expect(older.evidence.reviewOpportunity).toBe(true);
    expect(older.evidence.reason).toBe('older-review-draw');
  });
});
