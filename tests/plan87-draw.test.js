import { describe, expect, it } from 'vitest';
import { drawPracticeItems, recheckUnstartedItems } from '../src/app/plan87-draw.js';

const bank = ['a', 'b', 'c', 'd', 'e', 'f'].map(itemId => ({ setId: 'bank', revision: '2', itemId }));
const ids = items => items.map(item => item.itemId);

describe('Plan 87 deterministic finite draw', () => {
  it('uses the version-1 counter-mixer/Fisher-Yates known-answer sequence', () => {
    const result = drawPracticeItems({ items: bank, seed: 1 });
    expect(ids(result.permutation)).toEqual(['d', 'c', 'e', 'b', 'f', 'a']);
    expect(ids(result.draw)).toEqual(['d', 'c', 'e', 'b']);
    expect(result.algorithmVersion).toBe(1);
    expect(ids(drawPracticeItems({ items: bank, seed: 0 }).permutation)).toEqual(['c', 'f', 'd', 'a', 'b', 'e']);
  });

  it('is independent of registration order and has no repeats', () => {
    const first = drawPracticeItems({ items: bank, seed: 0xdeadbeef });
    const second = drawPracticeItems({ items: bank.slice().reverse(), seed: 0xdeadbeef });
    expect(ids(first.draw)).toEqual(ids(second.draw));
    expect(new Set(first.draw.map(item => `${item.setId}:${item.revision}:${item.itemId}`)).size).toBe(first.draw.length);
  });

  it('draws all one-to-three items once and returns an empty draw for an empty pool', () => {
    for (let length = 0; length <= 3; length += 1) {
      const result = drawPracticeItems({ items: bank.slice(0, length), seed: 0 });
      expect(result.draw).toHaveLength(length);
      expect(result.permutation).toHaveLength(length);
    }
  });

  it('retains eligible planned items in order and replaces unavailable future items from the original permutation', () => {
    const plan = drawPracticeItems({ items: bank, seed: 1 });
    const eligible = bank.filter(item => !['d', 'c'].includes(item.itemId));
    const remaining = recheckUnstartedItems({ plan, started: [plan.draw[0]], eligibleItems: eligible });
    expect(ids(remaining)).toEqual(['e', 'b', 'f']);
    expect(new Set(remaining.map(item => item.itemId)).size).toBe(remaining.length);
  });

  it('fails closed on malformed seeds, duplicate identities, and invalid plans', () => {
    expect(() => drawPracticeItems({ items: bank, seed: -1 })).toThrow(TypeError);
    expect(() => drawPracticeItems({ items: [bank[0], { ...bank[0] }], seed: 1 })).toThrow(TypeError);
    expect(() => recheckUnstartedItems({ plan: {}, eligibleItems: [] })).toThrow(TypeError);
    expect(() => drawPracticeItems({items: bank, seed: 1, limit: 5})).toThrow(TypeError);
    expect(() => recheckUnstartedItems({plan: drawPracticeItems({items: bank, seed: 1}), started: [{setId:'other', revision:'1', itemId:'x'}], eligibleItems: bank})).toThrow(TypeError);
  });
});
