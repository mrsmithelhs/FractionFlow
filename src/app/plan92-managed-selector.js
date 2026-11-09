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

// The versioned inputs are short ASCII strings (at most one SHA-256 block).
// A synchronous implementation keeps the existing Start transaction synchronous;
// SHA-256 here is deterministic selection, not a security primitive.
function drawSync(seed, domain) {
  const bytes = new TextEncoder().encode(`ff92/v1:${seed}:${domain}`);
  if (bytes.length > 55) fail('draw input length');
  const block = new Uint8Array(64); block.set(bytes); block[bytes.length] = 0x80;
  const view = new DataView(block.buffer); view.setUint32(60, bytes.length * 8, false);
  const k = [0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
  const rotr=(x,n)=>(x>>>n)|(x<<(32-n)), w=new Uint32Array(64);
  for(let i=0;i<16;i++)w[i]=view.getUint32(i*4,false);
  for(let i=16;i<64;i++){const x=w[i-15],y=w[i-2];w[i]=(w[i-16]+(rotr(x,7)^rotr(x,18)^(x>>>3))+w[i-7]+(rotr(y,17)^rotr(y,19)^(y>>>10)))>>>0;}
  let a=0x6a09e667,b=0xbb67ae85,c=0x3c6ef372,d=0xa54ff53a,e=0x510e527f,f=0x9b05688c,g=0x1f83d9ab,h=0x5be0cd19;
  for(let i=0;i<64;i++){const t1=(h+(rotr(e,6)^rotr(e,11)^rotr(e,25))+((e&f)^(~e&g))+k[i]+w[i])>>>0;const t2=((rotr(a,2)^rotr(a,13)^rotr(a,22))+((a&b)^(a&c)^(b&c)))>>>0;h=g;g=f;f=e;e=(d+t1)>>>0;d=c;c=b;b=a;a=(t1+t2)>>>0;}
  return (0x6a09e667+a)>>>0;
}

function validate(input) {
  if (!isRecord(input) || !Number.isInteger(input.seed) || input.seed < 0 || input.seed > 0xffff_ffff) fail('seed');
  if (input.policyRevision !== 'ff92-policy@1' || input.catalogRevision !== 'ff92-catalog@1'
    || input.compatibilityRevision !== 'ff92-compat@1' || input.demandsRevision !== 'ff92-demands@1') fail('versioned policy inputs');
  if (!Array.isArray(input.candidates)) fail('candidate list');
  if (input.candidates.length > MAX_CANDIDATES) fail('candidate list bound');
  const identities = new Set();
  for (const candidate of input.candidates) {
    if (!isRecord(candidate) || !ROLES.includes(candidate.role) || ![true, false, undefined].includes(candidate.fit) || (candidate.priority !== undefined && !Number.isSafeInteger(candidate.priority))
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
  const shapeDraw = await draw(input.seed, 'shape');
  const roleDraws = Object.fromEntries(await Promise.all(ROLES.map(async role => [role, await draw(input.seed, role)])));
  const reviewDraw = await draw(input.seed, 'review');

  return selectFromDraws(input, shapeDraw, roleDraws, reviewDraw);
}

export function selectPlan92Sync(rawInput) {
  const input=validate(snapshotInput(rawInput));
  const roleDraws=Object.fromEntries(ROLES.map(role=>[role,drawSync(input.seed,role)]));
  return selectFromDraws(input,drawSync(input.seed,'shape'),roleDraws,drawSync(input.seed,'review'));
}

function selectFromDraws(input, shapeDraw, roleDraws, reviewDraw) {
  const ordered = [...input.candidates];
  const outcomes = [];
  const shapeStart = shapeDraw % SHAPES.length;
  const shapeOrder = Array.from({ length: SHAPES.length }, (_, offset) => SHAPES[(shapeStart + offset) % SHAPES.length]);
  const ranked = role => {
    const pool = ordered.filter(candidate => candidate.role === role && candidate.fit === true);
    if (!pool.length) return [];
    const start = roleDraws[role] % pool.length;
    return [...pool.slice(start), ...pool.slice(0, start)].sort((a,b)=>(a.priority??0)-(b.priority??0));
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
