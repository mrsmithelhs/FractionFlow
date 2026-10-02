import { describe, expect, it } from 'vitest';
import {
  HIGH_SUPPORT_CONFIGURATION,
  MEDIUM_SUPPORT_CONFIGURATION,
  SUPPORT_DIMENSIONS,
  createSupportConfiguration,
} from '../src/interaction/support.js';
import {
  getDefaultSupportLevel,
  getRegisteredSupportLevel,
  REGISTERED_SUPPORT_LEVELS,
} from '../src/app/support-levels.js';

describe('Plan 13 support profiles', () => {
  it('uses only the two approved complete dimension maps', () => {
    expect(SUPPORT_DIMENSIONS).toEqual([
      'fractionBarModel',
      'commonDenominator',
      'equivalentNumerators',
      'prediction',
      'symbolicIntegration',
      'helpAndReplay',
    ]);
    expect(createSupportConfiguration(HIGH_SUPPORT_CONFIGURATION)).toEqual({
      label: 'high support',
      dimensions: Object.fromEntries(SUPPORT_DIMENSIONS.map((dimension) => [dimension, 'high support'])),
    });
    expect(createSupportConfiguration(MEDIUM_SUPPORT_CONFIGURATION)).toEqual({
      label: 'medium support',
      dimensions: {
        fractionBarModel: 'medium support',
        commonDenominator: 'medium support',
        equivalentNumerators: 'high support',
        prediction: 'high support',
        symbolicIntegration: 'high support',
        helpAndReplay: 'high support',
      },
    });
    expect(Object.isFrozen(HIGH_SUPPORT_CONFIGURATION.dimensions)).toBe(true);
    expect(Object.isFrozen(MEDIUM_SUPPORT_CONFIGURATION.dimensions)).toBe(true);
  });

  it('exposes exactly the approved reviewer choices and defaults to high support', () => {
    expect(REGISTERED_SUPPORT_LEVELS.map(({ id, configuration }) => [id, configuration.label]))
      .toEqual([
        ['high-support', 'high support'],
        ['medium-support', 'medium support'],
      ]);
    expect(getDefaultSupportLevel()).toBe(REGISTERED_SUPPORT_LEVELS[0]);
    expect(getRegisteredSupportLevel('medium-support')).toBe(REGISTERED_SUPPORT_LEVELS[1]);
    expect(() => getRegisteredSupportLevel('independent')).toThrow(RangeError);
  });
});
