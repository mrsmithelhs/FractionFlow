import { deepFreeze } from './schema.js';

export const STRUCTURAL_SELECTOR_IDS = Object.freeze([
  'like-denominator-addition',
  'like-denominator-subtraction',
  'nested-denominator-addition',
  'nested-denominator-subtraction',
  'shared-factor-addition',
  'shared-factor-subtraction',
  'relatively-prime-addition',
  'relatively-prime-subtraction',
]);

export const OVERLAY_IDS = Object.freeze([
  'reducible-result',
  'crosses-one-whole',
]);

const ADDITION_OVERLAY_SETS = [
  [],
  ['reducible-result'],
  ['crosses-one-whole'],
  ['reducible-result', 'crosses-one-whole'],
];

const SUBTRACTION_OVERLAY_SETS = [
  [],
  ['reducible-result'],
];

const STRUCTURAL = [
  {
    id: 'like-denominator-addition',
    operation: 'add',
    denominatorRelationship: 'same',
    requiredChecks: [
      { id: 'operation-is-add', predicate: 'operation', expected: 'add' },
      { id: 'proper-operands', predicate: 'proper-operands', expected: true },
      { id: 'same-denominators', predicate: 'denominator-relationship', expected: 'same' },
      { id: 'no-canonical-renaming', predicate: 'renaming-count', expected: 0 },
    ],
    allowedOverlaySets: ADDITION_OVERLAY_SETS,
  },
  {
    id: 'like-denominator-subtraction',
    operation: 'subtract',
    denominatorRelationship: 'same',
    requiredChecks: [
      { id: 'operation-is-subtract', predicate: 'operation', expected: 'subtract' },
      { id: 'proper-operands', predicate: 'proper-operands', expected: true },
      { id: 'same-denominators', predicate: 'denominator-relationship', expected: 'same' },
      { id: 'no-canonical-renaming', predicate: 'renaming-count', expected: 0 },
      { id: 'nonnegative-result', predicate: 'nonnegative-result', expected: true },
    ],
    allowedOverlaySets: SUBTRACTION_OVERLAY_SETS,
  },
  {
    id: 'nested-denominator-addition',
    operation: 'add',
    denominatorRelationship: 'nested',
    requiredChecks: [
      { id: 'operation-is-add', predicate: 'operation', expected: 'add' },
      { id: 'proper-operands', predicate: 'proper-operands', expected: true },
      { id: 'nested-denominators', predicate: 'denominator-relationship', expected: 'nested' },
      { id: 'one-canonical-renaming', predicate: 'renaming-count', expected: 1 },
    ],
    allowedOverlaySets: ADDITION_OVERLAY_SETS,
  },
  {
    id: 'nested-denominator-subtraction',
    operation: 'subtract',
    denominatorRelationship: 'nested',
    requiredChecks: [
      { id: 'operation-is-subtract', predicate: 'operation', expected: 'subtract' },
      { id: 'proper-operands', predicate: 'proper-operands', expected: true },
      { id: 'nested-denominators', predicate: 'denominator-relationship', expected: 'nested' },
      { id: 'one-canonical-renaming', predicate: 'renaming-count', expected: 1 },
      { id: 'nonnegative-result', predicate: 'nonnegative-result', expected: true },
    ],
    allowedOverlaySets: SUBTRACTION_OVERLAY_SETS,
  },
  {
    id: 'shared-factor-addition',
    operation: 'add',
    denominatorRelationship: 'shared-factor',
    requiredChecks: [
      { id: 'operation-is-add', predicate: 'operation', expected: 'add' },
      { id: 'proper-operands', predicate: 'proper-operands', expected: true },
      { id: 'shared-factor-denominators', predicate: 'denominator-relationship', expected: 'shared-factor' },
      { id: 'both-canonical-renamings', predicate: 'renaming-count', expected: 2 },
    ],
    allowedOverlaySets: ADDITION_OVERLAY_SETS,
  },
  {
    id: 'shared-factor-subtraction',
    operation: 'subtract',
    denominatorRelationship: 'shared-factor',
    requiredChecks: [
      { id: 'operation-is-subtract', predicate: 'operation', expected: 'subtract' },
      { id: 'proper-operands', predicate: 'proper-operands', expected: true },
      { id: 'shared-factor-denominators', predicate: 'denominator-relationship', expected: 'shared-factor' },
      { id: 'both-canonical-renamings', predicate: 'renaming-count', expected: 2 },
      { id: 'nonnegative-result', predicate: 'nonnegative-result', expected: true },
    ],
    allowedOverlaySets: SUBTRACTION_OVERLAY_SETS,
  },
  {
    id: 'relatively-prime-addition',
    operation: 'add',
    denominatorRelationship: 'relatively-prime',
    requiredChecks: [
      { id: 'operation-is-add', predicate: 'operation', expected: 'add' },
      { id: 'proper-operands', predicate: 'proper-operands', expected: true },
      { id: 'relatively-prime-denominators', predicate: 'denominator-relationship', expected: 'relatively-prime' },
      { id: 'both-canonical-renamings', predicate: 'renaming-count', expected: 2 },
      { id: 'lcd-is-product', predicate: 'lcd-is-product', expected: true },
    ],
    allowedOverlaySets: ADDITION_OVERLAY_SETS,
  },
  {
    id: 'relatively-prime-subtraction',
    operation: 'subtract',
    denominatorRelationship: 'relatively-prime',
    requiredChecks: [
      { id: 'operation-is-subtract', predicate: 'operation', expected: 'subtract' },
      { id: 'proper-operands', predicate: 'proper-operands', expected: true },
      { id: 'relatively-prime-denominators', predicate: 'denominator-relationship', expected: 'relatively-prime' },
      { id: 'both-canonical-renamings', predicate: 'renaming-count', expected: 2 },
      { id: 'lcd-is-product', predicate: 'lcd-is-product', expected: true },
      { id: 'nonnegative-result', predicate: 'nonnegative-result', expected: true },
    ],
    allowedOverlaySets: SUBTRACTION_OVERLAY_SETS,
  },
];

export const OVERLAY_DEFINITIONS = deepFreeze({
  'reducible-result': {
    id: 'reducible-result',
    requiredChecks: [
      { id: 'raw-result-is-reducible', predicate: 'result-simplification', expected: 'reducible' },
    ],
  },
  'crosses-one-whole': {
    id: 'crosses-one-whole',
    requiredChecks: [
      { id: 'result-crosses-one-whole', predicate: 'result-crosses-whole', expected: true },
    ],
  },
});

export const FAMILY_DEFINITIONS = deepFreeze(Object.fromEntries(
  STRUCTURAL.map((definition) => [definition.id, definition]),
));

export function getFamilyDefinition(selector) {
  return FAMILY_DEFINITIONS[selector] ?? null;
}

export function normalizeOverlays(overlays = []) {
  if (!Array.isArray(overlays)) {
    throw new TypeError('overlays must be an array');
  }
  const normalized = [...new Set(overlays)].sort((left, right) => (
    OVERLAY_IDS.indexOf(left) - OVERLAY_IDS.indexOf(right)
  ));
  if (normalized.some((overlay) => !OVERLAY_IDS.includes(overlay))) {
    throw new RangeError(`unknown overlay: ${normalized.find((overlay) => !OVERLAY_IDS.includes(overlay))}`);
  }
  if (normalized.length !== overlays.length) {
    throw new RangeError('overlays must not contain duplicates');
  }
  return normalized;
}

export function validateOverlayCompatibility(selector, overlays) {
  const definition = getFamilyDefinition(selector);
  if (!definition) {
    return {
      valid: false,
      code: 'UNKNOWN_SELECTOR',
      message: `unknown structural selector: ${selector}`,
    };
  }

  const normalized = normalizeOverlays(overlays);
  const allowed = definition.allowedOverlaySets.some((set) => (
    set.length === normalized.length && set.every((overlay, index) => overlay === normalized[index])
  ));
  if (!allowed) {
    return {
      valid: false,
      code: 'INCOMPATIBLE_OVERLAY',
      message: `${selector} does not allow overlays: ${normalized.join(', ') || 'none'}`,
    };
  }

  return { valid: true, selector, overlays: normalized };
}
