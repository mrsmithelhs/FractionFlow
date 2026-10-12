import { afterEach, describe, expect, it } from 'vitest';
import { createMultiWholeStack } from '../src/render/fraction-bar.js';
import { setupMockDOM, teardownMockDOM } from './fixtures/mock-dom.js';

describe('Plan 17 multi-whole renderer', () => {
  let document;

  afterEach(() => teardownMockDOM());

  it.each([
    ['12', '17', '5'],
    ['24', '34', '10'],
  ])('paints supplied %s-unit row quantities without deriving them', (denominator, result, remainder) => {
    document = setupMockDOM();
    const stack = {
      kind: 'discrete-multi-whole',
      displayForm: { kind: 'fraction', numerator: result, denominator },
      wholeSpan: { lowerWhole: '1', upperWhole: '2' },
      wholeCount: '2',
      unitDenominator: denominator,
      rows: [
        { id: 'whole-1', shadedUnits: denominator, unitCount: denominator },
        { id: 'whole-2', shadedUnits: remainder, unitCount: denominator },
      ],
    };
    const root = createMultiWholeStack(stack, { mode: 'instant-test' });
    document.body.appendChild(root);

    const rows = Array.from(root.querySelectorAll('[data-whole-row]'));
    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.querySelectorAll('.fraction-bar-segment').length))
      .toEqual([Number(denominator), Number(denominator)]);
    expect(rows.map((row) => row.querySelectorAll('.fraction-bar-segment.shaded').length))
      .toEqual([Number(denominator), Number(remainder)]);
    expect(root.getAttribute('aria-label')).toContain(`${result} over ${denominator}`);
    expect(root.querySelectorAll('button, input, [tabindex="0"]')).toHaveLength(0);
  });

  it('fails closed on a missing or wrong-shape stack rather than constructing arithmetic', () => {
    document = setupMockDOM();
    expect(() => createMultiWholeStack(null)).toThrow(/validated multi-whole stack is required/);
    expect(() => createMultiWholeStack({ kind: 'one-whole', rows: [] }))
      .toThrow(/validated multi-whole stack is required/);
  });
});
