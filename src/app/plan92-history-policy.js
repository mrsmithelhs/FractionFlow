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
 * Input: {candidates, events?, reviewOpportunity?}; event shape is the validated
 * Plan 92 stored-event shape. `reviewOpportunity` must come from the selector's
 * independent session-seed review draw (about 1/4); no visit counter is used.
 * Result includes ranked candidates plus transparent per-candidate evidence.
 */
export function rankPlan92HistoryCandidates({ candidates, events = [], reviewOpportunity = false, coverage = 'unknown' }) {
  if (!Array.isArray(candidates) || !Array.isArray(events) || typeof reviewOpportunity !== 'boolean'
    || !['unknown', 'continuous'].includes(coverage)) throw new TypeError('invalid Plan 92 history policy input');
  const usable = events.filter(e => Number.isSafeInteger(e.ordinal) && e.ordinal > 0
    && e.identity && ['unknown', 'accepted', 'retry'].includes(e.first));
  const maxOrdinal = usable.reduce((n, e) => Math.max(n, e.ordinal), 0);
  const summaries = candidates.map((candidate, index) => {
    const sameProblem = usable.filter(e => {
      const descriptor = catalogDescriptor(e.identity);
      return descriptor && problemKey(descriptor) === problemKey(candidate);
    });
    // Persisted demand is a stable JSON serialization of the decision; reconstruct
    // this when present, while role remains the validated comparable boundary.
    const comparable = usable.filter(e => e.role === candidate.role && broadEventSkill(e) === skillKey(candidate));
    const exact = usable.filter(e => stable(e.identity) === identityKey(candidate));
    const latest = list => coverage === 'continuous' ? list.reduce((n, e) => Math.max(n, e.ordinal), 0) : 0;
    // Retries and repeated episodes for one mathematical problem provide one
    // current signal: only its latest observed event contributes to need.
    const latestByProblem = new Map();
    for (const e of comparable) {
      const descriptor = catalogDescriptor(e.identity);
      if (!descriptor) continue;
      const key = problemKey(descriptor), prior = latestByProblem.get(key);
      if (!prior || (coverage === 'continuous' ? e.ordinal > prior.ordinal : evidence(e) > evidence(prior))) latestByProblem.set(key, e);
    }
    const currentEvidence = [...latestByProblem.values()];
    const need = currentEvidence.reduce((n, e) => n + evidence(e), 0);
    const decisionRepeated = usable.some(e => e.role === candidate.role && parsedDemand(e) === stable(candidate.decision));
    const latestExposure = latest(comparable), gap = latestExposure ? maxOrdinal - latestExposure - 1 : null;
    const recent = coverage === 'continuous' && gap >= 2 && gap <= 6;
    const reviewEligible = coverage === 'continuous' && reviewOpportunity && gap >= 7 &&
      (sameProblem.some(e => evidence(e) < 0) || decisionRepeated) && need <= 0;
    return { candidate, index, exactCount: exact.length, problemCount: new Set(sameProblem.map(e => {
      const d = catalogDescriptor(e.identity); return d ? problemKey(d) : stable(e.identity);
    })).size,
      comparableCount: currentEvidence.length, need, latestExact: latest(exact), latestProblem: latest(sameProblem),
      latestComparable: latestExposure, recent, gap, reviewEligible, coverage };
  });
  const reviewWinners = new Set();
  if (reviewOpportunity && coverage === 'continuous') {
    for (const role of new Set(summaries.map(s => s.candidate.role))) {
      const eligible = summaries.filter(s => s.candidate.role === role && s.reviewEligible)
        .sort((a, b) => a.latestProblem - b.latestProblem || a.index - b.index);
      if (eligible[0]) reviewWinners.add(eligible[0]);
    }
  }
  const ranked = [...summaries].sort((a, b) => {
    // Recent tentative need outranks older review. Need is scoped to comparable
    // distinct problems; exact repetition is a separate, softer penalty.
    const countOrder = coverage === 'unknown'
      ? a.exactCount - b.exactCount || a.problemCount - b.problemCount
      : a.latestExact - b.latestExact || a.latestProblem - b.latestProblem || a.latestComparable - b.latestComparable;
    return b.need - a.need || Number(reviewWinners.has(b)) - Number(reviewWinners.has(a)) || countOrder || a.index - b.index;
  });
  const evidenceKey = s => stable([s.need, reviewWinners.has(s), s.recent,
    coverage === 'continuous' ? [s.latestExact, s.latestProblem, s.latestComparable] : [s.exactCount, s.problemCount]]);
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
      reason: coverage === 'unknown' ? 'coverage-unknown-no-recency' : s.recent ? 'recent-repetition' : reviewWinners.has(s) ? 'older-review-draw' : 'observed-evidence' } }));
}

function broadEventSkill(event) {
  try {
    const d = JSON.parse(event.demand);
    return skillKey({ role: event.role, decision: d });
  } catch { return null; }
}
