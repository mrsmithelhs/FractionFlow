import { resolvePlan49Context } from '../interaction/plan49-comparison-construction.js';

export const RECORD_LIMIT = 30;
export const CONTRACT_REVISION = 1;
const idKeys = ['practiceSetId','practiceSetRevision','itemId','authoringRevision','definitionId','definitionRevision','recipeId','recipeRevision','taskDataId','taskDataRevision','cueId'];
const entryKeys = ['token','sequence','identity','support','first','outcome','firstAssistance','acceptedAssistance'];
const exact = (v, keys) => v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).sort().join('|') === [...keys].sort().join('|');
const tokenOk = v => typeof v === 'string' && /^[0-9a-f]{32}$/.test(v);
const flags = ['model','help','construction'];
const assistanceOk = v => exact(v, flags) && flags.every(k => ['yes','no','unknown'].includes(v[k]));
const assistanceConsistent = (first, later, same) => flags.every(k => same ? first[k] === later[k] : first[k] === 'no' || (first[k] === 'yes' ? later[k] === 'yes' : later[k] !== 'no'));
const identityOk = identity => {
  if (!exact(identity, idKeys)) return false;
  try {
    const expected = resolvePlan49Context(identity.itemId);
    return idKeys.every(key => identity[key] === expected[key]);
  } catch { return false; }
};
export function identityFromContext(context) {
  const identity = Object.fromEntries(idKeys.map(key => [key, context?.[key]]));
  if (!identityOk(identity)) throw new TypeError('unrecognized comparison identity');
  return Object.freeze(identity);
}
export function validateEntry(entry) {
  if (!exact(entry, entryKeys) || !tokenOk(entry.token) || !Number.isSafeInteger(entry.sequence) || entry.sequence < 1
      || !identityOk(entry.identity) || !['high','medium'].includes(entry.support)
      || !['accepted','retry'].includes(entry.first) || !['accepted','unresolved'].includes(entry.outcome)
      || !assistanceOk(entry.firstAssistance) || (entry.outcome === 'accepted' ? !assistanceOk(entry.acceptedAssistance) : entry.acceptedAssistance !== null)
      || (entry.first === 'accepted' && entry.outcome !== 'accepted')
      || (entry.outcome === 'accepted' && !assistanceConsistent(entry.firstAssistance, entry.acceptedAssistance, entry.first === 'accepted'))) throw new TypeError('invalid record entry');
  return structuredClone(entry);
}
export function emptyRoot(generation, enabled = false) {
  if (!tokenOk(generation) || typeof enabled !== 'boolean') throw new TypeError('invalid root');
  return { schema: 1, contract: CONTRACT_REVISION, generation, enabled, nextSequence: 1, entries: [] };
}
export function validateRoot(root) {
  if (!exact(root, ['schema','contract','generation','enabled','nextSequence','entries']) || root.schema !== 1 || root.contract !== CONTRACT_REVISION
      || !tokenOk(root.generation) || typeof root.enabled !== 'boolean' || !Number.isSafeInteger(root.nextSequence) || root.nextSequence < 1
      || !Array.isArray(root.entries) || root.entries.length > RECORD_LIMIT) throw new TypeError('invalid record root');
  const entries = root.entries.map(validateEntry);
  if (entries.some((e,i) => e.sequence >= root.nextSequence || (i && e.sequence <= entries[i-1].sequence))
      || new Set(entries.map(e => e.token)).size !== entries.length) throw new TypeError('invalid record ordering');
  return { ...root, entries };
}
// The caller supplies an immutable admitted observation, never an episode or intent.
export function applyObservation(rootValue, generation, observation) {
  const root = validateRoot(rootValue);
  if (!root.enabled || root.generation !== generation) return { root, result: 'stale' };
  if (!exact(observation, ['kind','token','identity','support','assistance']) || !['first-accepted','first-retry','acceptance'].includes(observation.kind)
      || !tokenOk(observation.token) || !identityOk(observation.identity) || !['high','medium'].includes(observation.support) || !assistanceOk(observation.assistance)) throw new TypeError('invalid observation');
  const index = root.entries.findIndex(e => e.token === observation.token);
  if (observation.kind === 'acceptance') {
    if (index < 0) return { root, result: 'missing' }; // Evicted or never admitted: never resurrect.
    const old = root.entries[index];
    if (idKeys.some(key => old.identity[key] !== observation.identity[key]) || old.support !== observation.support) throw new TypeError('episode identity changed');
    if (old.outcome === 'accepted') return { root, result: 'duplicate' };
    root.entries[index] = validateEntry({ ...old, outcome: 'accepted', acceptedAssistance: observation.assistance });
    return { root, result: 'updated' };
  }
  if (index >= 0) return { root, result: 'duplicate' };
  if (root.nextSequence >= Number.MAX_SAFE_INTEGER) throw new TypeError('sequence exhausted');
  const accepted = observation.kind === 'first-accepted';
  const entry = validateEntry({ token: observation.token, sequence: root.nextSequence++, identity: observation.identity, support: observation.support,
    first: accepted ? 'accepted' : 'retry', outcome: accepted ? 'accepted' : 'unresolved', firstAssistance: observation.assistance,
    acceptedAssistance: accepted ? observation.assistance : null });
  root.entries.push(entry);
  if (root.entries.length > RECORD_LIMIT) root.entries.shift();
  return { root, result: 'inserted' };
}
export function projectRecord(rootValue) {
  const root = validateRoot(rootValue);
  const pairs = [['02','08'],['03','04'],['05','06'],['11','12']];
  const seen = new Set();
  return root.entries.map(e => {
    const suffix = e.identity.itemId.slice(-2);
    const pair = pairs.find(p => p.includes(suffix))?.[0] ?? suffix;
    const repeated = seen.has(pair); seen.add(pair);
    return { itemId: e.identity.itemId, sourceForms: structuredClone(resolvePlan49Context(e.identity.itemId).sourceForms), repeated, first: e.first, outcome: e.outcome,
      firstAssistance: e.firstAssistance, acceptedAssistance: e.acceptedAssistance };
  });
}


// One instance per installed episode. Already returned snapshots remain usable after
// retirement; retirement only prevents admitting new actions from old callbacks.
export function createRecordAdmission({ token, generation, identity, support }) {
  if (!tokenOk(token) || !tokenOk(generation) || !identityOk(identity) || !['high','medium'].includes(support)) throw new TypeError('invalid admission');
  const stableIdentity = Object.freeze({ ...identity });
  let retired = false, first = false, accepted = false;
  function capture(kind, assistance) {
    if (retired || accepted || !assistanceOk(assistance)) return null;
    if (kind === 'acceptance' ? !first : first) return null;
    if (!['first-retry','first-accepted','acceptance'].includes(kind)) return null;
    first = true;
    if (kind !== 'first-retry') accepted = true;
    const observation = Object.freeze({ kind, token, identity: stableIdentity, support, assistance: Object.freeze({ ...assistance }) });
    return Object.freeze({ generation, observation });
  }
  return Object.freeze({ capture, retire() { retired = true; } });
}
