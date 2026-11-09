import { createFraction, simplifyFraction } from '../math/index.js';
import { deepFreeze } from '../content/schema.js';
import { getPracticeType } from './practice-types.js';
import { getRegisteredSupportLevel } from './support-levels.js';
import { resolvePlan49Context, validatePlan49Context } from '../interaction/plan49-comparison-construction.js';
import { resolvePlan51Context, validatePlan51Context } from '../content/plan51-distance-task.js';
import { PLAN51_CONDITION } from '../interaction/plan51-distance-episode.js';
import { PLAN45_STATIC_COMPARISON_ACTIVE_CONDITION, getEpisodeDefinition } from '../interaction/episode-definition.js';
import { createEpisode } from '../interaction/episode.js';
import { PLAN90_FAMILY_ENTRIES, prepareManagedFamilyEntry } from './managed-family-entry.js';
import { getDefaultCondition } from './conditions.js';
import { PLAN92_MANAGED_ID, isPlan92Manifest, allGate92Descriptors } from './plan92-catalog.js';
import { preparePlan92ScratchCandidate } from './plan92-scratch-candidates.js';

const comparison = itemId => ({ typeId: 'symbolic-fraction-comparison', setId: 'symbolic-fraction-comparison-vetted-set', setRevision: '1', itemId, itemRevision: 'plan45-record-v1', definitionId: 'phase-4-symbolic-fraction-comparison', definitionRevision: '2', underlyingDefinitionRevision: '1', recipeId: 'symbolic-fraction-comparison', recipeRevision: '1', taskDataId: 'plan45-symbolic-fraction-comparison-task-data', taskDataRevision: '1' });
export const MAGNITUDE_SESSION_MANIFEST = deepFreeze({ id: 'short-magnitude-practice', revision: '1', entries: [
  comparison('plan45-compare-02'), comparison('plan45-compare-08'), comparison('plan45-compare-11'),
  { typeId: 'fraction-distance', setId: 'fraction-distance', setRevision: '1', itemId: 'distance-01', itemRevision: '1', definitionId: 'phase-4-fraction-distance', definitionRevision: '1', recipeId: 'common-unit-distance', recipeRevision: '1' },
] });
export const COMPARISON_SESSION_MANIFEST = deepFreeze({ id: 'fixed-comparison-practice', revision: '1', entries: [
  comparison('plan45-compare-02'), comparison('plan45-compare-09'), comparison('plan45-compare-11'), comparison('plan45-compare-10'),
] });
const distance = itemId => ({ typeId: 'fraction-distance', setId: 'fraction-distance', setRevision: '1', itemId, itemRevision: '1', definitionId: 'phase-4-fraction-distance', definitionRevision: '1', recipeId: 'common-unit-distance', recipeRevision: '1' });
// Plan 90 comparison/distance batch. The later family patterns have separate gates.
export const PLAN90_M0_SLOTS = deepFreeze([
  [comparison('plan45-compare-02'), comparison('plan45-compare-08')],
  [comparison('plan45-compare-09')],
  [comparison('plan45-compare-10')],
  [distance('distance-01')],
]);
const PLAN90_CANDIDATES = deepFreeze([
  ...PLAN90_M0_SLOTS.flat(), distance('distance-04'),
]);
export const PLAN90_MANAGED_ID = 'goal-linked-comparison-distance';
export const PLAN90_FULL_ID = 'goal-linked-practice';
const family = id => PLAN90_FAMILY_ENTRIES[id];
export const PLAN90_CATALOG = deepFreeze({ id:'goal-linked-patterns', revision:'1', policy:'cyclic-pattern-search@1', patterns:[
  {id:'M0',slots:[{id:'M0-compare-units',candidates:PLAN90_M0_SLOTS[0]},{id:'M0-equal-numerators',candidates:PLAN90_M0_SLOTS[1]},{id:'M0-half',candidates:PLAN90_M0_SLOTS[2]},{id:'M0-distance',candidates:PLAN90_M0_SLOTS[3]}]},
  {id:'M1',slots:[{id:'M1-compare',candidates:[comparison('plan45-compare-08')]},{id:'M1-placement',required:true,candidates:[family('bridge-06-three-eighths-8'),family('bridge-02-fourth-4')]},{id:'M1-half',candidates:[comparison('plan45-compare-10')]},{id:'M1-distance',candidates:[distance('distance-04')]}]},
  {id:'U0',slots:[{id:'U0-identify',candidates:[family('plan35-identify-half-three-tenths-10')]},{id:'U0-inspect',candidates:[family('one-half-plus-one-third')]},{id:'U0-construct',required:true,candidates:[family('plan35-construct-half-fifth-10')]}]},
  {id:'U1',slots:[{id:'U1-identify',candidates:[family('plan40-identify-one-half-one-eighth-8')]},{id:'U1-inspect',candidates:[family('plan40-inspect-two-thirds-one-fourth-12')]},{id:'U1-construct',required:true,candidates:[family('plan40-construct-half-fifth-10')]}]},
]});
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

/** Pure cyclic search. The witness is ephemeral and contains no learner history. */
export function selectManagedPractice(seed, eligible, supportId = 'high-support', activeCondition = getDefaultCondition().activeCondition) {
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffff_ffff || typeof eligible !== 'function') fail('seed or eligibility');
  const outcomes = [];
  const attempt = (entry, pattern, slot) => {
    let reason = 'eligible';
    try {
      if (eligible(structuredClone(entry)) !== true) reason = 'ineligible';
      else prepareMagnitudeEntry(entry, supportId, activeCondition);
    } catch { reason = 'preflight-failed'; }
    outcomes.push({pattern,slot,identity:structuredClone(entry),reason});
    return reason === 'eligible' ? structuredClone(entry) : null;
  };
  const start = seed % PLAN90_CATALOG.patterns.length;
  const ordered = Array.from({length:PLAN90_CATALOG.patterns.length}, (_, offset) => PLAN90_CATALOG.patterns[(start + offset) % PLAN90_CATALOG.patterns.length]);
  for (const pattern of ordered) {
    const selected = pattern.slots.map(slot => {
      for (const entry of slot.candidates) { const result = attempt(entry,pattern.id,slot.id); if (result) return result; }
      return null;
    });
    if (!selected[0] || !selected.at(-1) || pattern.slots.some((slot,index) => slot.required && !selected[index])) continue;
    const kept = pattern.slots.map((slot,index) => ({slot:slot.id,entry:selected[index]})).filter(x => x.entry);
    const manifest = {id:PLAN90_FULL_ID,revision:'1',catalogRevision:PLAN90_CATALOG.revision,policyRevision:'1',patternId:pattern.id,slots:kept.map(x=>x.slot),entries:kept.map(x=>x.entry)};
    return deepFreeze({manifest,witness:{seed,catalogRevision:'1',policyRevision:'1',outcomes,identities:manifest.entries.map(entry=>structuredClone(entry))}});
  }
  const seen = new Set();
  for (const pattern of ordered) for (const slot of pattern.slots) for (const entry of slot.candidates) {
    const key = JSON.stringify(canonical(entry)); if (seen.has(key)) continue; seen.add(key);
    const selected = attempt(entry,pattern.id,slot.id); if (!selected) continue;
    const manifest = {id:PLAN90_FULL_ID,revision:'1',catalogRevision:'1',policyRevision:'1',patternId:'single',slots:['single'],entries:[selected]};
    return deepFreeze({manifest,witness:{seed,catalogRevision:'1',policyRevision:'1',outcomes,identities:[structuredClone(selected)]}});
  }
  return deepFreeze({manifest:null,witness:{seed,catalogRevision:'1',policyRevision:'1',outcomes,identities:[]}});
}

function isPlan90FullManifest(manifest) {
  if (!manifest || !same(Object.keys(manifest).sort(), ['catalogRevision','entries','id','patternId','policyRevision','revision','slots'])
    || manifest.id !== PLAN90_FULL_ID || manifest.revision !== '1' || manifest.catalogRevision !== '1' || manifest.policyRevision !== '1'
    || !Array.isArray(manifest.entries) || !Array.isArray(manifest.slots) || !manifest.entries.length || manifest.entries.length !== manifest.slots.length
    || Array.from({length:manifest.entries.length},(_,i)=>Object.hasOwn(manifest.entries,i)&&Object.hasOwn(manifest.slots,i)).some(x=>!x)) return false;
  if (manifest.patternId === 'single') return manifest.entries.length === 1 && manifest.slots[0] === 'single'
    && PLAN90_CATALOG.patterns.some(pattern => pattern.slots.some(slot => slot.candidates.some(entry => same(entry,manifest.entries[0]))));
  const pattern = PLAN90_CATALOG.patterns.find(item=>item.id===manifest.patternId);
  if (!pattern || manifest.entries.length > pattern.slots.length) return false;
  const indices = manifest.slots.map(id=>pattern.slots.findIndex(slot=>slot.id===id));
  if (indices[0] !== 0 || indices.at(-1) !== pattern.slots.length-1 || indices.some((index,i)=>index<0 || (i>0 && index<=indices[i-1]))) return false;
  if (pattern.slots.some((slot,index)=>slot.required && !indices.includes(index))) return false;
  if (new Set(manifest.entries.map(entry=>JSON.stringify(canonical(entry)))).size !== manifest.entries.length) return false;
  return indices.every((index,i)=>pattern.slots[index].candidates.some(entry=>same(entry,manifest.entries[i])));
}

/** First-batch selector; the caller supplies the measured fit decision. */
export function selectManagedComparisonDistance(eligible, supportId = 'high-support') {
  if (typeof eligible !== 'function') fail('managed eligibility');
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
    const single = PLAN90_CANDIDATES.map(tryEntry).find(Boolean);
    if (single) entries.push(single);
  }
  return entries.length ? deepFreeze({ id: PLAN90_MANAGED_ID, revision: '1', entries }) : null;
}

function isPlan90ManagedManifest(manifest) {
  if (!manifest || !same(Object.keys(manifest).sort(), ['entries', 'id', 'revision'])
    || manifest.id !== PLAN90_MANAGED_ID || manifest.revision !== '1' || !Array.isArray(manifest.entries)
    || manifest.entries.length === 0 || manifest.entries.length > 4) return false;
  if (Array.from({ length: manifest.entries.length }, (_, index) => Object.hasOwn(manifest.entries, index)).some(present => !present)) return false;
  if (manifest.entries.length === 1) return PLAN90_CANDIDATES.some(entry => same(entry, manifest.entries[0]));
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

export function prepareMagnitudeEntry(entry, supportId, activeCondition = getDefaultCondition().activeCondition) {
  if (entry?.role) return preparePlan92ScratchCandidate(entry, supportId, entry.role === 'C' ? 'phase2-bundle-1' : activeCondition.id);
  if (['bar-to-line-same-amount','sum-under-one','unlike-denominator-subtraction'].includes(entry?.typeId)) return prepareManagedFamilyEntry(entry,supportId,activeCondition);
  if (!['symbolic-fraction-comparison','fraction-distance'].includes(entry?.typeId)) fail('unsupported family');
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

export function admitMagnitudeManifest(manifest = MAGNITUDE_SESSION_MANIFEST, supportId = 'high-support', activeCondition = getDefaultCondition().activeCondition) {
  const scheduled = manifest && same(Object.keys(manifest).sort(), ['entries', 'id', 'revision']) && manifest.id === 'scheduled-magnitude-practice' && manifest.revision === '1' && Array.isArray(manifest.entries) && manifest.entries.length === SCHEDULED_SLOTS.length && SCHEDULED_SLOTS.every((slot, index) => Object.hasOwn(manifest.entries, index) && slot.some(candidate => same(manifest.entries[index], candidate)));
  if (!same(manifest, MAGNITUDE_SESSION_MANIFEST) && !same(manifest, COMPARISON_SESSION_MANIFEST) && !scheduled && !isPlan90ManagedManifest(manifest) && !isPlan90FullManifest(manifest) && !isPlan92Manifest(manifest)) fail('manifest identity, shape, order or revision');
  // Resolve and construct every entry at admission, including actual profile capability.
  const prepared = manifest.entries.map(entry => prepareMagnitudeEntry(entry, supportId, activeCondition));
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
  if (!state || !entry || state.taskContext?.itemId !== entry.itemId
    || state.episodeDefinition?.id !== entry.definitionId || state.episodeDefinition?.revision !== entry.definitionRevision) return false;
  if (['bar-to-line-same-amount','sum-under-one','unlike-denominator-subtraction'].includes(entry.typeId)) {
    if (state.status !== 'active' || state.beat !== 'resolve' || state.schedulePosition !== state.beatSchedule?.length - 1) return false;
    if (entry.typeId === 'bar-to-line-same-amount') return Boolean(state.established?.numberLineLocation);
    const operation = entry.typeId === 'sum-under-one' ? 'add' : 'subtract';
    return state.content?.request?.operation === operation && Boolean(state.established?.operation);
  }
  if (state.status !== 'resolved') return false;
  return entry.typeId === 'fraction-distance' ? Boolean(state.established?.comparison && state.established?.distance) : Boolean(state.established?.comparison);
}

// The controller owns only ephemeral navigation. Episode state is supplied by its owner.
// A prepared transaction is an unforgeable, single-use capability bound to the exact
// controller snapshot and old episode object. Preparation never mutates either.
export function createMagnitudeSessionController(manifest = MAGNITUDE_SESSION_MANIFEST, supportId = 'high-support', { prepare = prepareMagnitudeEntry, eligibleForNext = null, fitRevision = null, activeCondition = getDefaultCondition().activeCondition, getNextCondition = null, orderNextCandidates = null } = {}) {
  const admission = admitMagnitudeManifest(manifest, supportId, activeCondition);
  let liveManifest = admission.manifest;
  let snapshot = deepFreeze({ id: admission.manifest.id, revision: admission.manifest.revision, index: 0, generation: 0, active: true, supportId });
  let episode = admission.prepared[0].state;
  let installed = admission.prepared[0];
  const tickets = new WeakMap();
  const rollbackTickets = new WeakMap();
  const current = () => ({ session: snapshot, episode, installed, manifest: liveManifest, admittedManifest: admission.manifest });
  const updateEpisode = (expected, next) => {
    if (!snapshot.active || episode !== expected || !next || next.taskContext?.itemId !== liveManifest.entries[snapshot.index].itemId
      || next.episodeDefinition?.id !== liveManifest.entries[snapshot.index].definitionId || next.episodeDefinition?.revision !== liveManifest.entries[snapshot.index].definitionRevision) return false;
    episode = next; return true;
  };
  const prepareTransition = (kind, expectedSession, expectedEpisode) => {
    if (!snapshot.active || snapshot !== expectedSession || episode !== expectedEpisode || !['next', 'restart'].includes(kind)) return { ok: false, reason: 'stale-or-invalid' };
    if (kind === 'next' && !isMagnitudeEpisodeComplete(episode, liveManifest.entries[snapshot.index])) return { ok: false, reason: 'unfinished' };
    const index = kind === 'next' ? snapshot.index + 1 : snapshot.index;
    let nextManifest = liveManifest;
    let fitToken;
    if (kind === 'next' && [PLAN90_MANAGED_ID,PLAN90_FULL_ID,PLAN92_MANAGED_ID].includes(liveManifest.id) && eligibleForNext !== null) {
      if (typeof eligibleForNext !== 'function') return { ok: false, reason: 'invalid-eligibility' };
      try {
        if (fitRevision !== null) {
          if (typeof fitRevision !== 'function') return { ok: false, reason: 'invalid-eligibility' };
          fitToken = fitRevision();
          if (typeof fitToken !== 'string' && !Number.isSafeInteger(fitToken)) return { ok: false, reason: 'invalid-eligibility' };
        }
      } catch { return { ok: false, reason: 'invalid-eligibility' }; }
      const prefix = liveManifest.entries.slice(0, index);
      if (liveManifest.id === PLAN92_MANAGED_ID) {
        const eligible = entry => { try { return eligibleForNext(structuredClone(entry)) === true; } catch { return false; } };
        const remaining=liveManifest.entries.slice(index), suffix=[];
        for(const current of remaining){
          let candidates=[current,...allGate92Descriptors().filter(d=>d.role===current.role).map(d=>d.identity).filter(e=>!same(e,current))];
          if(orderNextCandidates){
            let ordered;try{ordered=orderNextCandidates(structuredClone(current),structuredClone(candidates));}catch{return {ok:false,reason:'fit-exhausted'};}
            if(!Array.isArray(ordered)||ordered.length!==candidates.length||ordered.some(e=>!candidates.some(c=>same(c,e)))||ordered.some((e,i)=>ordered.slice(0,i).some(p=>same(p,e))))return {ok:false,reason:'fit-exhausted'};
            candidates=ordered;
          }
          const chosen=candidates.find(entry=>![...prefix,...suffix].some(previous=>same(previous,entry))&&eligible(entry));
          if(!chosen && !['I','S'].includes(current.role))return {ok:false,reason:'fit-exhausted'};
          if(chosen)suffix.push(chosen);
        }
        if(!suffix.length)return {ok:false,reason:'fit-exhausted'};
        const entries=[...prefix,...suffix], shapeId=entries.map(entry=>entry.role).join('-');
        if(!['C-I-S-T','C-I-T','C-S-T'].includes(shapeId))return {ok:false,reason:'fit-exhausted'};
        nextManifest=deepFreeze({...liveManifest,shapeId,entries});
      } else {
      const suffix = [], suffixSlots = [];
      const pattern = liveManifest.id === PLAN90_FULL_ID ? PLAN90_CATALOG.patterns.find(item => item.id === liveManifest.patternId) : null;
      const eligible = entry => { try { return eligibleForNext(structuredClone(entry)) === true; } catch { return false; } };
      for (let position = index; position < liveManifest.entries.length; position += 1) {
        const current = liveManifest.entries[position];
        const slot = pattern?.slots.find(item => item.id === liveManifest.slots[position]);
        const options = slot ? [current, ...slot.candidates.filter(candidate => !same(candidate,current))] : [current];
        const chosen = options.find(entry => ![...prefix,...suffix].some(previous => same(previous,entry)) && eligible(entry));
        if (!chosen && slot?.required) return { ok:false, reason:'fit-exhausted' };
        if (chosen) { suffix.push(chosen); if (slot) suffixSlots.push(slot.id); }
      }
      if (!suffix.length) return { ok: false, reason: 'fit-exhausted' };
      nextManifest = deepFreeze({ ...liveManifest, entries: [...prefix, ...suffix],
        ...(pattern ? {slots:[...liveManifest.slots.slice(0,index),...suffixSlots]} : {}) });
      }
    }
    if (index >= nextManifest.entries.length) return { ok: false, reason: 'exhausted' };
    try {
      const transitionCondition = kind === 'restart' ? episode.activeCondition
        : getNextCondition ? getNextCondition() : activeCondition;
      const candidate = prepare(nextManifest.entries[index], supportId, transitionCondition);
      // Independently reconstruct and compare: injection cannot bypass authoritative admission.
      const expected = prepareMagnitudeEntry(nextManifest.entries[index], supportId, transitionCondition);
      if (!candidate || !same(candidate, expected)) return { ok: false, reason: 'invalid-candidate' };
      const ticket = Object.freeze({});
      tickets.set(ticket, { snapshot, episode, manifest: liveManifest, nextManifest, fitToken, candidate: expected, index });
      return { ok: true, ticket };
    } catch { return { ok: false, reason: 'preparation-failed' }; }
  };
  const commit = ticket => {
    const transaction = ticket && tickets.get(ticket);
    if (!transaction) return false;
    tickets.delete(ticket);
    if (!snapshot.active || transaction.snapshot !== snapshot || transaction.episode !== episode || transaction.manifest !== liveManifest) return false;
    if (transaction.fitToken !== undefined) {
      try { if (fitRevision() !== transaction.fitToken) return false; } catch { return false; }
    }
    const previous = { snapshot, episode, installed, manifest: liveManifest };
    liveManifest = transaction.nextManifest;
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
    liveManifest = transaction.previous.manifest;
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

// Historical isolated policy seam: callers supply a verified allow-list of item IDs.
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
