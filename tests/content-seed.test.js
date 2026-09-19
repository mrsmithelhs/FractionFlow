import { execFileSync } from 'node:child_process';
import { describe, expect, it } from 'vitest';
import {
  canonicalSeedKey,
  createSeededRng,
  fnv1a64,
  generateProblem,
  GENERATOR_VERSION,
  SCHEMA_VERSION,
  SEED_ALGORITHM,
} from '../src/content/index.js';

const seedInput = {
  schemaVersion: SCHEMA_VERSION,
  generatorVersion: GENERATOR_VERSION,
  selector: 'like-denominator-addition',
  operation: 'add',
  profileId: 'phase1-dev-default',
  profileVersion: '1',
  seed: 'fixed-seed-001',
};

function jsonSnapshot(value) {
  return JSON.parse(JSON.stringify(value, (_key, child) => (
    typeof child === 'bigint' ? `${child}n` : child
  )));
}

describe('Plan 03 deterministic seed utility', () => {
  it('uses the documented dependency-free algorithm and fixed vectors', () => {
    const key = canonicalSeedKey(seedInput);
    expect(SEED_ALGORITHM).toEqual({
      hash: 'FNV-1a-64',
      rng: 'SplitMix64',
      boundedSelection: 'uint64-rejection-sampling',
    });
    expect(fnv1a64(key).toString(16)).toBe('d2ecedc70ede55dd');
    const rng = createSeededRng(key);
    expect([
      rng.nextUint64().toString(16),
      rng.nextUint64().toString(16),
      rng.nextUint64().toString(16),
    ]).toEqual([
      '31059bfd7acd41a8',
      'f90ec645da3e2f21',
      'fb3fce375ac4ec78',
    ]);
  });

  it('rejects control characters instead of normalizing the seed', () => {
    expect(() => canonicalSeedKey({ ...seedInput, seed: 'bad\nseed' })).toThrow(/control characters/);
  });

  it('reproduces a generated instance in a separate Node process', () => {
    const parent = generateProblem({ selector: 'like-denominator-addition', seed: 'fixed-seed-001' });
    const childScript = [
      "import { generateProblem } from './src/content/index.js';",
      "const value = generateProblem({ selector: 'like-denominator-addition', seed: 'fixed-seed-001' });",
      "console.log(JSON.stringify({ id: value.id, resultState: value.resultState, classification: value.classification, canonicalPath: value.canonicalPath, alternatePaths: value.alternatePaths, provenance: value.provenance }, (_key, child) => typeof child === 'bigint' ? child.toString() + 'n' : child));",
    ].join(' ');
    const child = JSON.parse(execFileSync(process.execPath, ['--input-type=module', '-e', childScript], {
      cwd: process.cwd(),
      encoding: 'utf8',
    }));
    expect(child).toEqual(jsonSnapshot({
      id: parent.id,
      resultState: parent.resultState,
      classification: parent.classification,
      canonicalPath: parent.canonicalPath,
      alternatePaths: parent.alternatePaths,
      provenance: parent.provenance,
    }));
    expect(child.id).toBe('like-denominator-addition__none__2__5__2__5');
    expect(child.resultState).toEqual({
      exactResult: { kind: 'fraction', numerator: '4', denominator: '5' },
      canonicalRawResultForm: { kind: 'fraction', numerator: '4', denominator: '5' },
      currentForm: { kind: 'fraction', numerator: '4', denominator: '5' },
      preferredFinalForm: { kind: 'fraction', numerator: '4', denominator: '5' },
    });
    expect(child.provenance).toMatchObject({
      kind: 'generated',
      seed: 'fixed-seed-001',
      selectedCandidateIndex: '64',
      selection: {
        strategy: 'uniform-eligible-index',
        eligibleOrdinal: '5',
      },
    });
  });
});
