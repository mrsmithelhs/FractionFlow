import { describe, expect, it } from 'vitest';
import {
  describeFraction,
  isCorrectAnswer,
  SUBTRACTION_FIXTURE_MODELS,
} from '../prototypes/subtraction/model.js';

describe('subtraction prototype math model', () => {
  it('uses the exact core for all four synthetic fixtures and their display units', () => {
    expect(SUBTRACTION_FIXTURE_MODELS.map((model) => ({
      id: model.id,
      left: describeFraction(model.left),
      right: describeFraction(model.right),
      renamedLeft: describeFraction(model.renamedLeft),
      renamedRight: describeFraction(model.renamedRight),
      difference: describeFraction(model.exactDifference),
      displayedDifference: describeFraction(model.displayedDifference),
    }))).toEqual([
      {
        id: 'like-denominators',
        left: '4/7',
        right: '1/7',
        renamedLeft: '4/7',
        renamedRight: '1/7',
        difference: '3/7',
        displayedDifference: '3/7',
      },
      {
        id: 'nested-denominators',
        left: '5/6',
        right: '1/3',
        renamedLeft: '5/6',
        renamedRight: '2/6',
        difference: '3/6',
        displayedDifference: '3/6',
      },
      {
        id: 'unlike-denominators',
        left: '3/4',
        right: '1/3',
        renamedLeft: '9/12',
        renamedRight: '4/12',
        difference: '5/12',
        displayedDifference: '5/12',
      },
      {
        id: 'small-difference',
        left: '5/8',
        right: '1/2',
        renamedLeft: '5/8',
        renamedRight: '4/8',
        difference: '1/8',
        displayedDifference: '1/8',
      },
    ]);
  });

  it('accepts exact equivalent answers and safely retries invalid or incorrect input', () => {
    const nested = SUBTRACTION_FIXTURE_MODELS[1];
    expect(isCorrectAnswer('3', '6', nested.exactDifference)).toBe(true);
    expect(isCorrectAnswer('1', '2', nested.exactDifference)).toBe(true);
    expect(isCorrectAnswer('2', '6', nested.exactDifference)).toBe(false);
    expect(isCorrectAnswer('', '6', nested.exactDifference)).toBe(false);
    expect(isCorrectAnswer('3', '0', nested.exactDifference)).toBe(false);
    expect(isCorrectAnswer('-1', '2', nested.exactDifference)).toBe(false);
    expect(isCorrectAnswer('1.5', '3', nested.exactDifference)).toBe(false);
  });
});
