import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { selectPlan92Prototype } from '../src/app/plan92-managed-selector.js';

const revisions = { policyRevision: 'ff92-policy@1', catalogRevision: 'ff92-catalog@1',
  compatibilityRevision: 'ff92-compat@1', demandsRevision: 'ff92-demands@1' };
const roleIds = {
  C: ['c01','c02','c03','c04','c05','c06','c07','c08','c09','c10','c11','c12'],
  I: ['i01','i02','i03','i04','i05'], S: ['s01','s02','s03','s04','s05','s06'],
  T: ['t01','t02','t03','t04','t05','t06'],
};
function candidate(role, itemId, key = `${role}:${itemId}`, fit = true) {
  return { role, fit, identity: { typeId: role === 'C' ? 'symbolic-fraction-comparison' : 'unlike-denominator-subtraction',
    setId: role === 'C' ? 'symbolic-fraction-comparison-vetted-set' : 'unlike-subtraction-vetted-set',
    setRevision: role === 'C' ? '1' : '2', itemId, itemRevision: role === 'C' ? 'plan45-record-v1' : 'plan40-record-v1',
    definitionId: role === 'C' ? 'phase-4-symbolic-fraction-comparison' : 'phase-3-reusable-subtraction-recipes',
    definitionRevision: role === 'C' ? '2' : '1', recipeId: `recipe-${itemId}`, recipeRevision: '1' }, problemKey: { exact: key } };
}
const inventory = () => Object.entries(roleIds).flatMap(([role, ids]) => ids.map(id => candidate(role, id)));
const input = (seed, candidates = inventory()) => ({ ...revisions, seed, candidates });

// Independent reference implementation: no production imports, it uses Node's hash API and
// separately performs the domain encoding, cyclic shape search, role indexing, and modulo.
const referenceDraw = (seed, domain) => createHash('sha256').update(`ff92/v1:${seed}:${domain}`, 'utf8').digest().readUInt32BE(0);
function reference(seed, candidates) {
  const shapes = [['C','I','T'],['C','S','T'],['C','I','S','T']];
  const roleOrder = ['C','I','S','T'];
  const start = referenceDraw(seed, 'shape') % shapes.length;
  const orderedShapes = shapes.map((_, offset) => shapes[(start + offset) % shapes.length]);
  const chosenFor = (role, keys) => {
    const pool = candidates.filter(entry => entry.role === role && entry.fit === true && !keys.has(JSON.stringify(entry.problemKey)));
    if (!pool.length) return null;
    return pool[referenceDraw(seed, role) % pool.length];
  };
  for (const roles of orderedShapes) {
    const selected = [], keys = new Set();
    for (const role of roles) {
      const found = chosenFor(role, keys);
      if (!found) break;
      selected.push(found); keys.add(JSON.stringify(found.problemKey));
    }
    if (selected.length === roles.length) return { shapeId: roles.join('-'), selected };
  }
  for (const role of roleOrder) {
    const found = chosenFor(role, new Set());
    if (found) return { shapeId: 'single', selected: [found] };
  }
  return { shapeId: 'none', selected: [] };
}

describe('Plan 92 isolated selector prototype', () => {
  it('matches independent SHA-256 reference vectors and documented full-pool indices', async () => {
    const expectedDraws = [
      [2197871165,4201984440,70367929,449786134,2707570586,794434498],
      [1348635745,3012143916,3818165686,640224497,452881926,632753830],
      [3992940403,1583615962,3115944223,1330994046,1412167098,3865998408],
      [3832397906,3044600079,3619285306,1937871476,4012008730,130604420],
      [1951464708,3961463277,154122431,1949374089,3103222803,2151163442],
    ];
    for (let seed = 0; seed < expectedDraws.length; seed += 1) {
      const candidates = inventory();
      const result = await selectPlan92Prototype(input(seed, candidates));
      const referenceResult = reference(seed, candidates);
      expect(result.manifest.shapeId).toBe(referenceResult.shapeId);
      expect(result.manifest.entries.map(entry => entry.itemId)).toEqual(referenceResult.selected.map(entry => entry.identity.itemId));
      const values = result.witness.seedDraws;
      expect([values.shape,values.C,values.I,values.S,values.T,values.review]).toEqual(expectedDraws[seed]);
      expect(result.witness.reviewOpportunity).toBe(values.review % 4 === 0);
      expect(await selectPlan92Prototype(input(seed, candidates))).toEqual(result);
      expect(Object.isFrozen(result.manifest.entries[0])).toBe(true);
    }
    // These are draw-index diagnostics under the hypothetical complete pools, not fit claims.
    expect([expectedDraws[0][1] % 12,expectedDraws[0][2] % 5,expectedDraws[0][3] % 6,expectedDraws[0][4] % 6]).toEqual([0,4,4,2]);
    expect([expectedDraws[1][1] % 12,expectedDraws[1][2] % 5,expectedDraws[1][3] % 6,expectedDraws[1][4] % 6]).toEqual([0,1,5,0]);
  });

  it('searches all full shapes before choosing one fit candidate or returning empty', async () => {
    const onlyI = [candidate('I','i03')];
    expect((await selectPlan92Prototype(input(0, onlyI))).manifest.shapeId).toBe('single');
    expect((await selectPlan92Prototype(input(0, []))).manifest).toBeNull();
    const noT = inventory().filter(entry => entry.role !== 'T');
    expect((await selectPlan92Prototype(input(2, noT))).manifest.shapeId).toBe('single');
  });

  it('tries bounded role alternatives when the initial combination collides on a canonical key', async () => {
    const candidates = [candidate('C','c01','shared'),candidate('C','c02','comparison'),
      candidate('I','i01','shared'),candidate('S','s01','inspect'),candidate('T','t01','construct')];
    const result = await selectPlan92Prototype(input(0,candidates));
    expect(result.manifest.shapeId).toBe('C-I-S-T');
    expect(result.manifest.entries.map(entry => entry.itemId)).toEqual(['c02','i01','s01','t01']);
    expect(result.witness.outcomes.some(attempt => attempt.reason === 'duplicate-problem-key')).toBe(true);
  });

  it('snapshots before hashing and never freezes caller-owned descriptors', async () => {
    const value = input(0,[candidate('C','c01'),candidate('I','i01'),candidate('T','t01')]);
    const originalIdentity = structuredClone(value.candidates[0].identity);
    const pending = selectPlan92Prototype(value);
    value.candidates[0].identity.itemId = 'changed-during-hash';
    value.candidates.push(candidate('S','s01'));
    const result = await pending;
    expect(result.manifest.entries.some(entry => entry.itemId === originalIdentity.itemId)).toBe(true);
    expect(result.manifest.entries.some(entry => entry.itemId === 'changed-during-hash')).toBe(false);
    expect(Object.isFrozen(value.candidates[0])).toBe(false);
    expect(Object.isFrozen(value.candidates[0].identity)).toBe(false);
    value.candidates[0].identity.itemId = 'still-mutable';
    expect(value.candidates[0].identity.itemId).toBe('still-mutable');
  });

  it('excludes false and unknown fit, and refuses duplicate exact identities and duplicate problem keys in a visit', async () => {
    const candidates = [candidate('C','c01','same',true),candidate('C','c02','same',true),
      candidate('I','i01','i',true),candidate('T','t01','t',true),candidate('C','c03','unknown',undefined),candidate('C','c04','false',false)];
    for (let seed = 0; seed < 3; seed += 1) {
      const result = await selectPlan92Prototype(input(seed,candidates));
      const keys = result.witness.selected.map(entry => JSON.stringify(entry.problemKey));
      expect(new Set(keys).size).toBe(keys.length);
      expect(result.witness.selected.every(entry => !['c03','c04'].includes(entry.identity.itemId))).toBe(true);
    }
    await expect(selectPlan92Prototype(input(0,[candidate('C','c01'),candidate('C','c01')]))).rejects.toThrow('duplicate candidate identity');
  });

  it.each([
    { seed: -1 }, { seed: 0x1_0000_0000 }, { policyRevision: 'ff92-policy@2' },
  ])('rejects invalid selector inputs %#', async mutation => {
    const value = { ...input(0), ...mutation };
    await expect(selectPlan92Prototype(value)).rejects.toThrow(TypeError);
  });
});
