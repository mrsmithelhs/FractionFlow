const ROLES = Object.freeze(['C', 'I', 'S', 'T']);
const MAX_CANDIDATES = 512;
const MAX_ATTEMPTS_PER_SHAPE = 4096;
const SHAPES = Object.freeze([
  Object.freeze({ id: 'C-I-T', roles: Object.freeze(['C', 'I', 'T']) }),
  Object.freeze({ id: 'C-S-T', roles: Object.freeze(['C', 'S', 'T']) }),
  Object.freeze({ id: 'C-I-S-T', roles: Object.freeze(['C', 'I', 'S', 'T']) }),
]);
const fail = message => { throw new TypeError(`invalid Plan 92 selector input: ${message}`); };
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function snapshotInput(input) {
  try {
    const json = JSON.stringify(input);
    if (typeof json !== 'string') fail('input is not plain serializable data');
    return JSON.parse(json);
  } catch {
    fail('input is not plain serializable data');
  }
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (isRecord(value)) return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  if (typeof value === 'number' && !Number.isFinite(value)) fail('non-finite key');
  if (value === undefined || typeof value === 'function' || typeof value === 'symbol' || typeof value === 'bigint') fail('unsupported key value');
  return value;
}
const stable = value => JSON.stringify(canonical(value));
const clone = value => JSON.parse(JSON.stringify(value));

async function draw(seed, domain) {
  const bytes = new TextEncoder().encode(`ff92/v1:${seed}:${domain}`);
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  const view = new DataView(digest);
  return view.getUint32(0, false);
}

function validate(input) {
  if (!isRecord(input) || !Number.isInteger(input.seed) || input.seed < 0 || input.seed > 0xffff_ffff) fail('seed');
  if (input.policyRevision !== 'ff92-policy@1' || input.catalogRevision !== 'ff92-catalog@1'
    || input.compatibilityRevision !== 'ff92-compat@1' || input.demandsRevision !== 'ff92-demands@1') fail('versioned policy inputs');
  if (!Array.isArray(input.candidates)) fail('candidate list');
  if (input.candidates.length > MAX_CANDIDATES) fail('candidate list bound');
  const identities = new Set();
  for (const candidate of input.candidates) {
    if (!isRecord(candidate) || !ROLES.includes(candidate.role) || ![true, false, undefined].includes(candidate.fit)
      || !isRecord(candidate.identity) || !isRecord(candidate.problemKey)) fail('candidate descriptor or fit');
    if (typeof candidate.identity.typeId !== 'string' || typeof candidate.identity.setId !== 'string'
      || typeof candidate.identity.setRevision !== 'string' || typeof candidate.identity.itemId !== 'string'
      || typeof candidate.identity.itemRevision !== 'string' || typeof candidate.identity.definitionId !== 'string'
      || typeof candidate.identity.definitionRevision !== 'string') fail('versioned candidate identity');
    const key = stable(candidate.identity);
    if (identities.has(key)) fail('duplicate candidate identity');
    identities.add(key);
    stable(candidate.problemKey);
  }
  return input;
}

/**
 * Isolated Plan 92 selector prototype. `fit` and `problemKey` are untrusted caller inputs
 * used only to exercise bounded selection; neither is production admission evidence.
 * This function has no storage, math validation, admission, or Start integration.
 */
export async function selectPlan92Prototype(rawInput) {
  // Snapshot synchronously before the first await: output freezing and asynchronous hashing
  // must never expose or freeze caller-owned data, nor permit mid-selection input changes.
  const input = validate(snapshotInput(rawInput));
  const ordered = [...input.candidates];
  const outcomes = [];
  const shapeDraw = await draw(input.seed, 'shape');
  const shapeStart = shapeDraw % SHAPES.length;
  const shapeOrder = Array.from({ length: SHAPES.length }, (_, offset) => SHAPES[(shapeStart + offset) % SHAPES.length]);
  const roleDraws = Object.fromEntries(await Promise.all(ROLES.map(async role => [role, await draw(input.seed, role)])));
  const reviewDraw = await draw(input.seed, 'review');

  const ranked = role => {
    const pool = ordered.filter(candidate => candidate.role === role && candidate.fit === true);
    if (!pool.length) return [];
    const start = roleDraws[role] % pool.length;
    return [...pool.slice(start), ...pool.slice(0, start)];
  };
  for (const shape of shapeOrder) {
    let attempts = 0;
    const search = (index, selected, usedKeys) => {
      if (index === shape.roles.length) return selected;
      const role = shape.roles[index];
      for (const candidate of ranked(role)) {
        if (attempts >= MAX_ATTEMPTS_PER_SHAPE) break;
        attempts += 1;
        const key = stable(candidate.problemKey);
        outcomes.push({ shape: shape.id, role, candidate: candidate.identity.itemId,
          reason: usedKeys.has(key) ? 'duplicate-problem-key' : 'candidate-tried' });
        if (usedKeys.has(key)) continue;
        const result = search(index + 1, [...selected, candidate], new Set([...usedKeys, key]));
        if (result) return result;
      }
      return null;
    };
    const selected = search(0, [], new Set());
    if (selected) return result(shape.id, selected, outcomes, shapeDraw, roleDraws, reviewDraw);
    outcomes.push({ shape: shape.id, reason: attempts >= MAX_ATTEMPTS_PER_SHAPE ? 'attempt-bound' : 'no-complete-path' });
  }

  // Safe fallback is one independently fit candidate. Stable order and role draw remain deterministic.
  for (const role of ROLES) {
    const candidate = ranked(role)[0];
    outcomes.push({ shape: 'single', role, selected: candidate?.identity.itemId ?? null });
    if (candidate) return result('single', [candidate], outcomes, shapeDraw, roleDraws, reviewDraw);
  }
  return deepFreeze({ manifest: null, witness: witness('none', [], outcomes, shapeDraw, roleDraws, reviewDraw) });
}

function result(shapeId, selected, outcomes, shapeDraw, roleDraws, reviewDraw) {
  const manifest = { id: 'plan92-prototype', revision: '1', catalogRevision: 'ff92-catalog@1',
    policyRevision: 'ff92-policy@1', compatibilityRevision: 'ff92-compat@1', demandsRevision: 'ff92-demands@1',
    shapeId, entries: selected.map(candidate => candidate.identity) };
  return deepFreeze({ manifest, witness: witness(shapeId, selected, outcomes, shapeDraw, roleDraws, reviewDraw) });
}
function witness(shapeId, selected, outcomes, shapeDraw, roleDraws, reviewDraw) {
  return { seedDraws: { shape: shapeDraw, ...roleDraws, review: reviewDraw }, shapeId,
    reviewOpportunity: reviewDraw % 4 === 0, outcomes, selected: selected.map(candidate => ({ role: candidate.role,
      identity: clone(candidate.identity), problemKey: clone(candidate.problemKey) })) };
}
function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}
