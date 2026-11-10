import { allGate92Descriptors } from './plan92-catalog.js';

// Pure Plan 92 local-history ranking. This module consumes already validated
// catalog descriptors and storage events; it performs no I/O or math.
const stable = value => JSON.stringify(canonical(value));
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical(value[k])]));
  return value;
}
const identityKey = d => stable(d.identity);
const problemKey = d => stable(d.problemKey);
// Compare only the task's broad instructional demand, omitting operand values.
const skillKey = d => stable({ role: d.role, structure: d.decision?.structure,
  denominatorRelationship: d.decision?.denominatorRelationship, side: d.decision?.side,
  work: d.decision?.work, judgments: d.decision?.judgments });
const catalogDescriptor = identity => allGate92Descriptors().find(d => stable(d.identity) === stable(identity));

function evidence(event) {
  // Unknown remains unknown. A retry or assistance is tentative need; acceptance
  // without assistance is evidence of success, never a mastery conclusion.
  if (event.first === 'retry') return 3;
  if (event.first === 'accepted' && event.firstAssistance === 'assisted') return 2;
  if (event.accepted === 'yes' && event.acceptedAssistance === 'assisted') return 1;
  if (event.first === 'accepted' && event.accepted === 'yes' && event.firstAssistance === 'unassisted') return -1;
  return 0;
}
function parsedDemand(event) {
  try { return stable(JSON.parse(event.demand)); } catch { return null; }
}

/**
 * Rank fit candidates from least to most recently repeated / best-supported.
 * Input: {candidates, events?, recordedSnapshot?, reviewOpportunity?}. `events`
 * supplies retained validated observations across epochs. `recordedSnapshot`
 * is the optional same-epoch `{meta, entries, lagWindow}` ordering witness; it
 * alone supplies lag endpoints. `reviewOpportunity` comes from the independent
 * session-seed draw. Diagnostics include the endpoint tokens and ordinals.
 */
export function rankPlan92HistoryCandidates({ candidates, events = null, reviewOpportunity = false, coverage = 'unknown', recordedSnapshot = null }) {
  const snapshotEvents = recordedSnapshot?.entries;
  const historyEvents = events ?? (Array.isArray(snapshotEvents) ? snapshotEvents : []);
  const orderingEvents = Array.isArray(snapshotEvents) ? snapshotEvents : [];
  if (!Array.isArray(candidates) || !Array.isArray(historyEvents) || typeof reviewOpportunity !== 'boolean'
    || !['unknown', 'continuous'].includes(coverage)) throw new TypeError('invalid Plan 92 history policy input');
  // Recency is based only on retained recorded episodes. The caller must attest
  // that the bounded snapshot belongs to the active epoch and that writes and
  // ordering are reliable; this module then checks the visible ordinal run.
  const window = recordedSnapshot?.lagWindow;
  const snapshotEpoch = recordedSnapshot?.meta?.epoch;
  const snapshotValid = typeof snapshotEpoch === 'string' && snapshotEpoch.length > 0
    && recordedSnapshot.meta.enabled === true && recordedSnapshot.meta.ordering === 'continuous'
    && window?.reliable === true && window.ordering === 'continuous' && window.epoch === snapshotEpoch
    && Number.isSafeInteger(window.earliestOrdinal) && window.earliestOrdinal > 0
    && Number.isSafeInteger(window.latestOrdinal) && window.latestOrdinal >= window.earliestOrdinal
    && Number.isSafeInteger(window.retainedCount) && window.retainedCount > 0 && window.retainedCount <= 100
    && recordedSnapshot.meta.nextOrdinal === window.latestOrdinal + 1
    && recordedSnapshot.meta.revision === window.revision
    && orderingEvents.length === window.retainedCount
    && orderingEvents.every((e, i, list) => Number.isSafeInteger(e?.ordinal)
      && e.ordinal === window.earliestOrdinal + i && e.ordinal <= window.latestOrdinal
      && e.epoch === snapshotEpoch && typeof e.token === 'string' && /^[0-9a-f]{32}$/.test(e.token)
      && list.findIndex(other => other?.token === e.token) === i)
    && orderingEvents[orderingEvents.length - 1]?.ordinal === window.latestOrdinal
    && orderingEvents[0]?.token === window.earliestToken
    && orderingEvents.at(-1)?.token === window.latestToken
    && window.latestOrdinal - window.earliestOrdinal + 1 === window.retainedCount;
  const reliableRecordedOrder = snapshotValid;
  const usable = historyEvents.filter(e => Number.isSafeInteger(e.ordinal) && e.ordinal > 0
    && e.identity && ['unknown', 'accepted', 'retry'].includes(e.first));
  const orderingUsable = reliableRecordedOrder ? orderingEvents.filter(e => Number.isSafeInteger(e.ordinal) && e.ordinal > 0
    && e.identity && ['unknown', 'accepted', 'retry'].includes(e.first)) : [];
  const orderingTokens = new Set(orderingUsable.map(e => e.token));
  const maxOrdinal = orderingUsable.reduce((n, e) => Math.max(n, e.ordinal), 0);
  const summaries = candidates.map((candidate, index) => {
    const sameProblem = usable.filter(e => {
      const descriptor = catalogDescriptor(e.identity);
      return descriptor && problemKey(descriptor) === problemKey(candidate);
    });
    // Persisted demand is a stable JSON serialization of the decision; reconstruct
    // this when present, while role remains the validated comparable boundary.
    const comparable = usable.filter(e => e.role === candidate.role && broadEventSkill(e) === skillKey(candidate));
    const exact = usable.filter(e => stable(e.identity) === identityKey(candidate));
    const latest = list => reliableRecordedOrder ? list.reduce((n, e) => Math.max(n, e.ordinal), 0) : 0;
    // Retries and repeated episodes for one mathematical problem provide one
    // current signal: only its latest observed event contributes to need.
    const latestByProblem = new Map();
    for (const e of comparable) {
      const descriptor = catalogDescriptor(e.identity);
      if (!descriptor) continue;
      const key = problemKey(descriptor), bucket = latestByProblem.get(key) ?? { current: null, historical: null };
      if (reliableRecordedOrder && orderingTokens.has(e.token)) {
        if (!bucket.current || e.ordinal > bucket.current.ordinal) bucket.current = e;
      } else if (!bucket.historical || evidence(e) > evidence(bucket.historical)
        || (evidence(e) === evidence(bucket.historical) && stable(e) < stable(bucket.historical))) {
        // Ordinals have meaning only within the witnessed generation. For older
        // retained rows use their strongest observation and a stable tie-break.
        bucket.historical = e;
      }
      latestByProblem.set(key, bucket);
    }
    const currentEvidence = [...latestByProblem.values()].map(bucket => bucket.current ?? bucket.historical);
    const need = currentEvidence.reduce((n, e) => n + evidence(e), 0);
    // Both lag endpoints must be retained recorded episodes: the candidate's
    // latest comparable exposure and the snapshot's latest recorded exposure.
    const comparableInWindow = orderingUsable.filter(e => e.role === candidate.role && broadEventSkill(e) === skillKey(candidate));
    const sameProblemInWindow = orderingUsable.filter(e => {
      const descriptor = catalogDescriptor(e.identity);
      return descriptor && problemKey(descriptor) === problemKey(candidate);
    });
    const decisionRepeatedInWindow = orderingUsable.some(e => e.role === candidate.role && parsedDemand(e) === stable(candidate.decision));
    const latestExposure = latest(comparableInWindow), gap = latestExposure && maxOrdinal > latestExposure
      ? maxOrdinal - latestExposure - 1 : null;
    const latestExact = latest(orderingUsable.filter(e => stable(e.identity) === identityKey(candidate)));
    const latestProblem = latest(orderingUsable.filter(e => { const d = catalogDescriptor(e.identity); return d && problemKey(d) === problemKey(candidate); }));
    const recent = reliableRecordedOrder && gap >= 2 && gap <= 6;
    const latestComparableEvent = comparableInWindow.find(e => e.ordinal === latestExposure);
    const recentNeed = recent && Boolean(latestComparableEvent) && evidence(latestComparableEvent) > 0;
    const reviewEligible = reliableRecordedOrder && reviewOpportunity && gap >= 7 &&
      (sameProblemInWindow.some(e => evidence(e) < 0) || decisionRepeatedInWindow) && need <= 0;
    return { candidate, index, exactCount: exact.length, problemCount: new Set(sameProblem.map(e => {
      const d = catalogDescriptor(e.identity); return d ? problemKey(d) : stable(e.identity);
    })).size,
      comparableCount: currentEvidence.length, need, latestExact, latestProblem,
      latestComparable: latestExposure, recent, recentNeed, gap, reviewEligible, coverage };
  });
  const reviewWinners = new Set();
  if (reviewOpportunity && reliableRecordedOrder) {
    for (const role of new Set(summaries.map(s => s.candidate.role))) {
      const eligible = summaries.filter(s => s.candidate.role === role && s.reviewEligible)
        .sort((a, b) => a.latestProblem - b.latestProblem || a.index - b.index);
      if (eligible[0]) reviewWinners.add(eligible[0]);
    }
  }
  const ranked = [...summaries].sort((a, b) => {
    // Recent tentative need outranks older review. Need is scoped to comparable
    // distinct problems; exact repetition is a separate, softer penalty.
    const countOrder = !reliableRecordedOrder
      ? a.exactCount - b.exactCount || a.problemCount - b.problemCount
      : a.exactCount - b.exactCount || a.latestExact - b.latestExact || a.latestProblem - b.latestProblem || a.latestComparable - b.latestComparable;
    return Number(b.recentNeed) - Number(a.recentNeed) || b.need - a.need
      || Number(reviewWinners.has(b)) - Number(reviewWinners.has(a)) || countOrder || a.index - b.index;
  });
  const evidenceKey = s => stable([s.recentNeed, s.need, reviewWinners.has(s),
    reliableRecordedOrder ? [s.latestExact, s.latestProblem, s.latestComparable] : [s.exactCount, s.problemCount]]);
  const priorities = new Map(); let priority = -1, previous = null;
  for (const s of ranked) {
    const key = evidenceKey(s);
    if (key !== previous) { priority += 1; previous = key; }
    priorities.set(s, priority);
  }
  return ranked.map((s, rank) => ({ candidate: s.candidate, rank, priority: priorities.get(s),
    evidence: { comparableCount: s.comparableCount, tentativeNeed: s.need,
      exactReuseCount: s.exactCount, problemExposureCount: s.problemCount,
      reviewOpportunity: reviewWinners.has(s), coverage: s.coverage,
      recentSkillReturn: s.recentNeed, olderReviewEligible: s.reviewEligible,
      recordedLag: s.gap, recordedOlderEndpointOrdinal: s.latestComparable || null,
      recordedOlderEndpointToken: s.latestComparable ? orderingUsable.filter(e => e.role === s.candidate.role && broadEventSkill(e) === skillKey(s.candidate)).reduce((latestEvent, e) => !latestEvent || e.ordinal > latestEvent.ordinal ? e : latestEvent, null)?.token ?? null : null,
      recordedNewerEndpointOrdinal: reliableRecordedOrder ? maxOrdinal || null : null,
      recordedNewerEndpointToken: reliableRecordedOrder ? orderingUsable.reduce((latestEvent, e) => !latestEvent || e.ordinal > latestEvent.ordinal ? e : latestEvent, null)?.token ?? null : null,
      recordedOrderValid: reliableRecordedOrder,
      reason: !reliableRecordedOrder ? 'recorded-order-unverified' : s.recentNeed ? 'recent-skill-return'
        : reviewWinners.has(s) ? 'older-review-draw' : 'observed-evidence' } }));
}

function broadEventSkill(event) {
  try {
    const d = JSON.parse(event.demand);
    return skillKey({ role: event.role, decision: d });
  } catch { return null; }
}
