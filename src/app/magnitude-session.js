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
const canonical = value => Array.isArray(value) ? value.map(canonical) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])])) : value;
const same = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
const fail = message => { throw new TypeError(`invalid magnitude session: ${message}`); };
const controllers = new WeakMap();

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
  if (!same(manifest, MAGNITUDE_SESSION_MANIFEST) && !same(manifest, COMPARISON_SESSION_MANIFEST)) fail('manifest identity, shape, order or revision');
  // Resolve and construct every entry at admission, including actual profile capability.
  const prepared = manifest.entries.map(entry => prepareMagnitudeEntry(entry, supportId));
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
    installed = transaction.candidate; episode = installed.state;
    snapshot = deepFreeze({ ...snapshot, index: transaction.index, generation: snapshot.generation + 1 });
    return true;
  };
  const exit = expected => {
    if (!snapshot.active || snapshot !== expected) return false;
    snapshot = deepFreeze({ ...snapshot, active: false, generation: snapshot.generation + 1 });
    episode = null; installed = null; return true;
  };
  const controller = Object.freeze({ current, updateEpisode, prepareTransition, commit, exit });
  controllers.set(controller, current);
  return controller;
}
