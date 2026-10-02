import { deepFreeze } from '../content/schema.js';

export const SUPPORT_LABELS = Object.freeze([
  'high support',
  'medium support',
  'low support',
  'independent',
]);

export const SUPPORT_DIMENSIONS = Object.freeze([
  'fractionBarModel',
  'commonDenominator',
  'equivalentNumerators',
  'prediction',
  'symbolicIntegration',
  'helpAndReplay',
]);

export const HIGH_SUPPORT_CONFIGURATION = Object.freeze({
  label: 'high support',
  dimensions: Object.freeze({
    fractionBarModel: 'high support',
    commonDenominator: 'high support',
    equivalentNumerators: 'high support',
    prediction: 'high support',
    symbolicIntegration: 'high support',
    helpAndReplay: 'high support',
  }),
});

export const MEDIUM_SUPPORT_CONFIGURATION = Object.freeze({
  label: 'medium support',
  dimensions: Object.freeze({
    fractionBarModel: 'medium support',
    commonDenominator: 'medium support',
    equivalentNumerators: 'high support',
    prediction: 'high support',
    symbolicIntegration: 'high support',
    helpAndReplay: 'high support',
  }),
});

function validateSupportLevel(value, name) {
  if (!SUPPORT_LABELS.includes(value)) {
    throw new RangeError(`${name} must use a canonical support label`);
  }
  return value;
}

export function createSupportConfiguration({
  label = 'high support',
  dimensions = null,
} = {}) {
  validateSupportLevel(label, 'support label');
  const source = dimensions ?? Object.fromEntries(
    SUPPORT_DIMENSIONS.map((dimension) => [dimension, label]),
  );
  const actualKeys = Object.keys(source).sort();
  const expectedKeys = [...SUPPORT_DIMENSIONS].sort();
  if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) {
    throw new TypeError('support dimensions must contain exactly the approved dimensions');
  }
  const normalizedDimensions = Object.fromEntries(
    SUPPORT_DIMENSIONS.map((dimension) => [
      dimension,
      validateSupportLevel(source[dimension], `support dimension ${dimension}`),
    ]),
  );
  return deepFreeze({
    label,
    dimensions: normalizedDimensions,
  });
}

export function validateSupportConfiguration(support) {
  return createSupportConfiguration(support);
}

export const DEFAULT_SUPPORT_CONFIGURATION = createSupportConfiguration(HIGH_SUPPORT_CONFIGURATION);

export const HELP_LEVELS = Object.freeze([
  'orient',
  'represent',
  'constrain',
  'demonstrate',
]);
