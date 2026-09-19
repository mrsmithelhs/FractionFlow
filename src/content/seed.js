const MASK_64 = (1n << 64n) - 1n;
const UINT64_RANGE = 1n << 64n;
const FNV_OFFSET_BASIS = 0xcbf29ce484222325n;
const FNV_PRIME = 0x100000001b3n;
const SPLITMIX_INCREMENT = 0x9e3779b97f4a7c15n;

function asUint64(value) {
  return value & MASK_64;
}

function validateSeedLabel(seed) {
  if (typeof seed !== 'string' || seed.length === 0) {
    throw new TypeError('seed must be a non-empty string');
  }
  for (const character of seed) {
    if (character.charCodeAt(0) < 0x20 || character.charCodeAt(0) === 0x7f) {
      throw new RangeError('seed must not contain control characters');
    }
  }
  return seed;
}

export function canonicalSeedKey({
  schemaVersion,
  generatorVersion,
  selector,
  operation,
  profileId,
  profileVersion,
  seed,
  batchIndex = null,
}) {
  validateSeedLabel(seed);
  return JSON.stringify([
    schemaVersion,
    generatorVersion,
    selector,
    operation,
    profileId,
    profileVersion,
    seed,
    batchIndex,
  ]);
}

export function fnv1a64(text) {
  const bytes = new TextEncoder().encode(text);
  let hash = FNV_OFFSET_BASIS;
  for (const byte of bytes) {
    hash = asUint64((hash ^ BigInt(byte)) * FNV_PRIME);
  }
  return hash;
}

export class SplitMix64 {
  constructor(seed) {
    this.state = asUint64(seed);
  }

  nextUint64() {
    this.state = asUint64(this.state + SPLITMIX_INCREMENT);
    let value = this.state;
    value = asUint64((value ^ (value >> 30n)) * 0xbf58476d1ce4e5b9n);
    value = asUint64((value ^ (value >> 27n)) * 0x94d049bb133111ebn);
    return asUint64(value ^ (value >> 31n));
  }

  nextIndex(size) {
    const bound = typeof size === 'bigint' ? size : BigInt(size);
    if (bound <= 0n) {
      throw new RangeError('size must be positive');
    }

    const limit = UINT64_RANGE - (UINT64_RANGE % bound);
    let value;
    do {
      value = this.nextUint64();
    } while (value >= limit);

    const index = value % bound;
    if (index > BigInt(Number.MAX_SAFE_INTEGER)) {
      throw new RangeError('selected index exceeds JavaScript safe integer range');
    }
    return Number(index);
  }
}

export function createSeededRng(seedKey) {
  return new SplitMix64(fnv1a64(seedKey));
}

export function deriveBatchSeed(baseSeed, index) {
  validateSeedLabel(baseSeed);
  if (!Number.isSafeInteger(index) || index < 0) {
    throw new RangeError('batch index must be a nonnegative safe integer');
  }
  return `${baseSeed}#${index}`;
}

export const SEED_ALGORITHM = Object.freeze({
  hash: 'FNV-1a-64',
  rng: 'SplitMix64',
  boundedSelection: 'uint64-rejection-sampling',
});
