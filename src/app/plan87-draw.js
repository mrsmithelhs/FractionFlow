const UINT32_RANGE = 0x1_0000_0000;
const DEFAULT_LIMIT = 4;

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function identityParts(item) {
  if (!isRecord(item) || typeof item.setId !== 'string' || !item.setId.trim()
    || typeof item.revision !== 'string' || !item.revision.trim()
    || typeof item.itemId !== 'string' || !item.itemId.trim()) {
    throw new TypeError('Each item must have a non-empty setId, non-empty string revision, and non-empty itemId.');
  }
  return [item.setId, String(item.revision), item.itemId];
}

function identityKey(item) {
  return JSON.stringify(identityParts(item));
}

function compareCodePoints(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function compareIdentity(left, right) {
  const a = identityParts(left);
  const b = identityParts(right);
  for (let index = 0; index < a.length; index += 1) {
    const comparison = compareCodePoints(a[index], b[index]);
    if (comparison !== 0) return comparison;
  }
  return 0;
}

function makeRandom(seed) {
  let state = seed >>> 0;
  return {
    nextUint32() {
      // Full-period uint32 counter, followed by reversible xor/odd-multiply mixing.
      state = (state + 0x9e3779b9) >>> 0;
      let value = state ^ (state >>> 16);
      value = Math.imul(value, 0x21f0aaad);
      value ^= value >>> 15;
      value = Math.imul(value, 0x735a2d97);
      return (value ^ (value >>> 15)) >>> 0;
    },
    bounded(bound) {
      const cutoff = UINT32_RANGE - (UINT32_RANGE % bound);
      let value;
      do { value = this.nextUint32(); } while (value >= cutoff);
      return value % bound;
    },
  };
}

function validateItems(items) {
  if (!Array.isArray(items)) throw new TypeError('items must be an array.');
  const seen = new Set();
  for (const item of items) {
    const key = identityKey(item);
    if (seen.has(key)) throw new TypeError('items must not contain duplicate versioned identities.');
    seen.add(key);
  }
}

/** Deterministic version-1 canonical permutation and finite draw. */
export function drawPracticeItems({ items, seed, limit = DEFAULT_LIMIT } = {}) {
  validateItems(items);
  if (!Number.isInteger(seed) || seed < 0 || seed > 0xffff_ffff) throw new TypeError('seed must be an unsigned 32-bit integer.');
  if (!Number.isSafeInteger(limit) || limit < 0 || limit > DEFAULT_LIMIT) throw new TypeError('limit must be an integer between zero and four.');

  const permutation = items.slice().sort(compareIdentity);
  const random = makeRandom(seed);
  for (let index = permutation.length - 1; index > 0; index -= 1) {
    const other = random.bounded(index + 1);
    [permutation[index], permutation[other]] = [permutation[other], permutation[index]];
  }
  return {
    algorithmVersion: 1,
    seed,
    permutation,
    draw: permutation.slice(0, Math.min(limit, permutation.length)),
  };
}

/** Retain eligible planned identities in order, then fill from the original permutation. */
export function recheckUnstartedItems({ plan, started = [], eligibleItems } = {}) {
  if (!isRecord(plan) || !Array.isArray(plan.permutation) || !Array.isArray(plan.draw)) {
    throw new TypeError('plan must contain permutation and draw arrays.');
  }
  validateItems(plan.permutation);
  validateItems(plan.draw);
  if (!Array.isArray(started)) throw new TypeError('started must be an array.');
  if (eligibleItems === undefined) eligibleItems = [];
  validateItems(eligibleItems);

  const permutationKeys = new Set(plan.permutation.map(identityKey));
  if (plan.draw.some(item => !permutationKeys.has(identityKey(item)))) throw new TypeError('draw identities must come from the permutation.');
  const startedKeys = new Set(started.map(item => identityKey(item)));
  if (startedKeys.size !== started.length || [...startedKeys].some(key => !permutationKeys.has(key))) throw new TypeError('started identities must be distinct members of the original permutation.');
  const eligibleByKey = new Map(eligibleItems.map(item => [identityKey(item), item]));
  const kept = [];
  const selected = new Set(startedKeys);
  for (const item of plan.draw) {
    const key = identityKey(item);
    if (selected.has(key) || !eligibleByKey.has(key)) continue;
    kept.push(eligibleByKey.get(key));
    selected.add(key);
  }
  const targetLength = plan.draw.filter(item => !startedKeys.has(identityKey(item))).length;
  for (const item of plan.permutation) {
    if (kept.length >= targetLength) break;
    const key = identityKey(item);
    if (selected.has(key) || !eligibleByKey.has(key)) continue;
    kept.push(eligibleByKey.get(key));
    selected.add(key);
  }
  return kept;
}
