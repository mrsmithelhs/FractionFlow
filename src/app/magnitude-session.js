import { createFraction, simplifyFraction } from '../math/index.js';
import { deepFreeze } from '../content/schema.js';
import { getPracticeType } from './practice-types.js';
import { getRegisteredSupportLevel } from './support-levels.js';
import { resolvePlan49Context, validatePlan49Context } from '../interaction/plan49-comparison-construction.js';
import { resolvePlan51Context, validatePlan51Context } from '../content/plan51-distance-task.js';
import { PLAN51_CONDITION } from '../interaction/plan51-distance-episode.js';
import { PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION, getEpisodeDefinition } from '../interaction/episode-definition.js';
import { createEpisode } from '../interaction/episode.js';

const comparison = itemId => ({ typeId: 'symbolic-fraction-comparison', setId: 'symbolic-fraction-comparison-vetted-set', setRevision: '1', itemId, itemRevision: 'plan45-record-v1', definitionId: 'phase-4-symbolic-fraction-comparison', definitionRevision: '2', underlyingDefinitionRevision: '1', recipeId: 'symbolic-fraction-comparison', recipeRevision: '1', taskDataId: 'plan45-symbolic-fraction-comparison-task-data', taskDataRevision: '1' });
export const MAGNITUDE_SESSION_MANIFEST = deepFreeze({ id: 'short-magnitude-practice', revision: '1', entries: [
  comparison('plan45-compare-02'), comparison('plan45-compare-08'), comparison('plan45-compare-11'),
  { typeId: 'fraction-distance', setId: 'fraction-distance', setRevision: '1', itemId: 'distance-01', itemRevision: '1', definitionId: 'phase-4-fraction-distance', definitionRevision: '1', recipeId: 'common-unit-distance', recipeRevision: '1' },
] });
export const COMPARISON_SESSION_MANIFEST = deepFreeze({ id: 'fixed-comparison-practice', revision: '1', entries: [
  comparison('plan45-compare-02'), comparison('plan45-compare-09'), comparison('plan45-compare-11'), comparison('plan45-compare-10'),
] });
const distance = itemId => ({ typeId: 'fraction-distance', setId: 'fraction-distance', setRevision: '1', itemId, itemRevision: '1', definitionId: 'phase-4-fraction-distance', definitionRevision: '1', recipeId: 'common-unit-distance', recipeRevision: '1' });
// Plan 90 comparison/distance checkpoint only. This is not connected to the
// ordinary Start policy until the family and fit gate has been cleared.
export const PLAN90_M0_SLOTS = deepFreeze([
  [comparison('plan45-compare-02'), comparison('plan45-compare-08')],
  [comparison('plan45-compare-09')],
  [comparison('plan45-compare-10')],
  [distance('distance-01')],
]);
const PLAN90_REVIEW_CANDIDATES = deepFreeze([
  ...PLAN90_M0_SLOTS.flat(), distance('distance-04'),
]);
const PLAN90_REVIEW_ID = 'plan90-comparison-distance-review';
const SCHEDULED_SLOTS = deepFreeze([
  [comparison('plan45-compare-02'), comparison('plan45-compare-09')],
  [comparison('plan45-compare-10')],
  [distance('distance-01'), distance('distance-04')],
]);
export function selectPracticeSession(input) {
  if (!Number.isSafeInteger(input) || input < 0) fail('selection input');
  return deepFreeze({ id: 'scheduled-magnitude-practice', revision: '1', entries: [
    SCHEDULED_SLOTS[0][input % 2], SCHEDULED_SLOTS[1][0], SCHEDULED_SLOTS[2][Math.floor(input / 2) % 2],
  ].map(entry => structuredClone(entry)) });
}
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const same = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
const fail = message => { throw new TypeError(`invalid magnitude session: ${message}`); };
const controllers = new WeakMap();

/** Isolated first-batch selector. Eligibility is supplied by the caller; it is
 * not a measured production fit class and cannot activate the learner route. */
export function selectPlan90ComparisonDistanceReview(eligible, supportId = 'high-support') {
  if (typeof eligible !== 'function') fail('review eligibility');
  const tryEntry = entry => {
    try {
      if (eligible(structuredClone(entry)) !== true) return null;
      prepareMagnitudeEntry(entry, supportId);
      return structuredClone(entry);
    } catch { return null; }
  };
  const slots = PLAN90_M0_SLOTS.map(slot => slot.map(tryEntry).find(Boolean) ?? null);
  const entries = slots[0] && slots[3] ? slots.filter(Boolean) : [];
  if (!entries.length) {
    const single = PLAN90_REVIEW_CANDIDATES.map(tryEntry).find(Boolean);
    if (single) entries.push(single);
  }
  return entries.length ? deepFreeze({ id: PLAN90_REVIEW_ID, revision: '1', entries }) : null;
}

function isPlan90ReviewManifest(manifest) {
  if (!manifest || !same(Object.keys(manifest).sort(), ['entries', 'id', 'revision'])
    || manifest.id !== PLAN90_REVIEW_ID || manifest.revision !== '1' || !Array.isArray(manifest.entries)
    || manifest.entries.length === 0 || manifest.entries.length > 4) return false;
  if (Array.from({ length: manifest.entries.length }, (_, index) => Object.hasOwn(manifest.entries, index)).some(present => !present)) return false;
  if (manifest.entries.length === 1) return PLAN90_REVIEW_CANDIDATES.some(entry => same(entry, manifest.entries[0]));
  if (!PLAN90_M0_SLOTS[0].some(entry => same(entry, manifest.entries[0]))
    || !same(PLAN90_M0_SLOTS[3][0], manifest.entries.at(-1))) return false;
  const middle = manifest.entries.slice(1, -1);
  return middle.length <= 2 && middle.every((entry, i) => {
    const slot = PLAN90_M0_SLOTS.findIndex(candidates => candidates.some(candidate => same(entry, candidate)));
    const previous = i === 0 ? 0 : PLAN90_M0_SLOTS.findIndex(candidates => candidates.some(candidate => same(middle[i - 1], candidate)));
    return slot > previous && slot < 3;
  });
}

// Only live controllers created here can supply a session record context.
export function sessionRecordContext(controller, state) {
  const current = controllers.get(controller)?.();
  if (!current?.session.active || current.episode !== state) return null;
  return current;
}

export function prepareMagnitudeEntry(entry, supportId) {
  const type = getPracticeType(entry.typeId);
  const item = type?.items.find(candidate => candidate.id === entry.itemId);
  if (!type || type.setId !== entry.setId || type.setRevision !== entry.setRevision || !item
    || item.episodeDefinitionId !== entry.definitionId || item.episodeDefinitionRevision !== entry.definitionRevision) fail('practice association');
  const definition = getEpisodeDefinition(entry.definitionId, entry.definitionRevision);
  if (!definition || !same(definition, type.episodeDefinition)) fail('definition');
  const comparisonTask = entry.typeId === 'symbolic-fraction-comparison';
  const context = comparisonTask ? validatePlan49Context(resolvePlan49Context(entry.itemId)) : validatePlan51Context(resolvePlan51Context(entry.itemId));
  if (comparisonTask) {
    if (context.practiceSetId !== entry.setId || context.practiceSetRevision !== entry.setRevision || context.authoringRevision !== entry.itemRevision
      || context.taskDataId !== entry.taskDataId || context.taskDataRevision !== entry.taskDataRevision || entry.underlyingDefinitionRevision !== '1') fail('comparison identity');
  } else if (context.setId !== entry.setId || context.setRevision !== entry.setRevision || context.itemRevision !== entry.itemRevision) fail('distance identity');
  if (context.itemId !== entry.itemId || context.definitionId !== entry.definitionId || context.definitionRevision !== entry.definitionRevision
    || context.recipeId !== entry.recipeId || context.recipeRevision !== entry.recipeRevision) fail('context identity');
  const support = getRegisteredSupportLevel(supportId).configuration;
  const state = createEpisode({ episodeDefinition: definition, taskContext: context, support,
    activeCondition: comparisonTask ? PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION : PLAN51_CONDITION });
  return deepFreeze({ type, itemIndex: type.items.indexOf(item), state });
}

export function admitMagnitudeManifest(manifest = MAGNITUDE_SESSION_MANIFEST, supportId = 'high-support') {
  const scheduled = manifest && same(Object.keys(manifest).sort(), ['entries', 'id', 'revision']) && manifest.id === 'scheduled-magnitude-practice' && manifest.revision === '1' && Array.isArray(manifest.entries) && manifest.entries.length === SCHEDULED_SLOTS.length && SCHEDULED_SLOTS.every((slot, index) => Object.hasOwn(manifest.entries, index) && slot.some(candidate => same(manifest.entries[index], candidate)));
  if (!same(manifest, MAGNITUDE_SESSION_MANIFEST) && !same(manifest, COMPARISON_SESSION_MANIFEST) && !scheduled && !isPlan90ReviewManifest(manifest)) fail('manifest identity, shape, order or revision');
  // Resolve and construct every entry at admission, including actual profile capability.
  const prepared = manifest.entries.map(entry => prepareMagnitudeEntry(entry, supportId));
  if (scheduled) {
    const pairs = prepared.map(({ state }) => {
      const forms = state.taskContext.sourceForms;
      return [forms.first, forms.second].map(form => {
        const value = simplifyFraction(createFraction(BigInt(form.numerator), BigInt(form.denominator)));
        return `${value.numerator}/${value.denominator}`;
      }).sort().join('|');
    });
    if (new Set(manifest.entries.map(entry => `${entry.typeId}:${entry.itemId}`)).size !== manifest.entries.length || new Set(pairs).size !== pairs.length) fail('repeated item or pair');
  }
  return deepFreeze({ manifest: structuredClone(manifest), supportId, prepared });
}

export function isMagnitudeEpisodeComplete(state, entry) {
  if (!state || !entry || state.status !== 'resolved' || state.taskContext?.itemId !== entry.itemId
    || state.episodeDefinition?.id !== entry.definitionId || state.episodeDefinition?.revision !== entry.definitionRevision) return false;
  return entry.typeId === 'fraction-distance' ? Boolean(state.established?.comparison && state.established?.distance) : Boolean(state.established?.comparison);
}

// The controller owns only ephemeral navigation. Episode state is supplied by its owner.
// A prepared transaction is an unforgeable, single-use capability bound to the exact
// controller snapshot and old episode object. Preparation never mutates either.
export function createMagnitudeSessionController(manifest = MAGNITUDE_SESSION_MANIFEST, supportId = 'high-support', { prepare = prepareMagnitudeEntry } = {}) {
  const admission = admitMagnitudeManifest(manifest, supportId);
  let snapshot = deepFreeze({ id: admission.manifest.id, revision: admission.manifest.revision, index: 0, generation: 0, active: true, supportId });
  let episode = admission.prepared[0].state;
  let installed = admission.prepared[0];
  const tickets = new WeakMap();
  const rollbackTickets = new WeakMap();
  const current = () => ({ session: snapshot, episode, installed, manifest: admission.manifest });
  const updateEpisode = (expected, next) => {
    if (!snapshot.active || episode !== expected || !next || next.taskContext?.itemId !== admission.manifest.entries[snapshot.index].itemId
      || next.episodeDefinition?.id !== admission.manifest.entries[snapshot.index].definitionId || next.episodeDefinition?.revision !== admission.manifest.entries[snapshot.index].definitionRevision) return false;
    episode = next; return true;
  };
  const prepareTransition = (kind, expectedSession, expectedEpisode) => {
    if (!snapshot.active || snapshot !== expectedSession || episode !== expectedEpisode || !['next', 'restart'].includes(kind)) return { ok: false, reason: 'stale-or-invalid' };
    if (kind === 'next' && !isMagnitudeEpisodeComplete(episode, admission.manifest.entries[snapshot.index])) return { ok: false, reason: 'unfinished' };
    const index = kind === 'next' ? snapshot.index + 1 : snapshot.index;
    if (index >= admission.manifest.entries.length) return { ok: false, reason: 'exhausted' };
    try {
      const candidate = prepare(admission.manifest.entries[index], supportId);
      // Independently reconstruct and compare: injection cannot bypass authoritative admission.
      const expected = prepareMagnitudeEntry(admission.manifest.entries[index], supportId);
      if (!candidate || !same(candidate, expected)) return { ok: false, reason: 'invalid-candidate' };
      const ticket = Object.freeze({});
      tickets.set(ticket, { snapshot, episode, candidate: expected, index });
      return { ok: true, ticket };
    } catch { return { ok: false, reason: 'preparation-failed' }; }
  };
  const commit = ticket => {
    const transaction = ticket && tickets.get(ticket);
    if (!transaction) return false;
    tickets.delete(ticket);
    if (!snapshot.active || transaction.snapshot !== snapshot || transaction.episode !== episode) return false;
    const previous = { snapshot, episode, installed };
    installed = transaction.candidate; episode = installed.state;
    snapshot = deepFreeze({ ...snapshot, index: transaction.index, generation: snapshot.generation + 1 });
    rollbackTickets.set(ticket, { previous, committed: snapshot, episode });
    return true;
  };
  const rollback = ticket => {
    const transaction = ticket && rollbackTickets.get(ticket);
    if (!transaction) return false;
    rollbackTickets.delete(ticket);
    if (snapshot !== transaction.committed || episode !== transaction.episode) return false;
    episode = transaction.previous.episode;
    installed = transaction.previous.installed;
    snapshot = deepFreeze({ ...transaction.previous.snapshot, generation: snapshot.generation + 1 });
    return true;
  };
  const exit = expected => {
    if (!snapshot.active || snapshot !== expected) return false;
    snapshot = deepFreeze({ ...snapshot, active: false, generation: snapshot.generation + 1 });
    episode = null; installed = null; return true;
  };
  const controller = Object.freeze({ current, updateEpisode, prepareTransition, commit, rollback, exit });
  controllers.set(controller, current);
  return controller;
}

// Isolated policy seam: callers must supply a verified allow-list of item IDs.
// The normal learner entry continues to call selectPracticeSession unchanged.
export function selectFittingPracticeSession(input, eligibleItemIds, supportId = 'high-support') {
  if (!Number.isSafeInteger(input) || input < 0) fail('selection input');
  if (!Array.isArray(eligibleItemIds) || eligibleItemIds.some(id => typeof id !== 'string' || !id) || new Set(eligibleItemIds).size !== eligibleItemIds.length) fail('eligibility');
  const eligible = new Set(eligibleItemIds);
  for (let offset = 0; offset < 4; offset += 1) {
    const candidate = selectPracticeSession((input % 4 + offset) % 4);
    if (!candidate.entries.every(entry => eligible.has(entry.itemId))) continue;
    try { admitMagnitudeManifest(candidate, supportId); return candidate; } catch { /* Try another fully admitted combination. */ }
  }
  return null;
}
