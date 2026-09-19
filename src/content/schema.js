export const SCHEMA_VERSION = 'fractionflow.problem-instance/v1';
export const GENERATOR_VERSION = 'fractionflow.generator/v1';
export const BULK_REPORT_VERSION = 'fractionflow.content-bulk-report/v1';

export function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) {
    return value;
  }

  Object.freeze(value);
  for (const child of Object.values(value)) {
    deepFreeze(child);
  }
  return value;
}

export function fractionToWire(value) {
  return {
    kind: 'fraction',
    numerator: value.numerator.toString(),
    denominator: value.denominator.toString(),
  };
}

export function mixedNumberToWire(value) {
  return {
    kind: 'mixed-number',
    whole: value.whole.toString(),
    fraction: fractionToWire(value.fraction),
  };
}

export function formToWire(value) {
  if (value.kind === 'fraction') {
    return fractionToWire(value);
  }
  if (value.kind === 'mixed-number') {
    return mixedNumberToWire(value);
  }
  throw new TypeError(`unsupported mathematical form: ${String(value.kind)}`);
}

export function wireToFraction(value) {
  if (!value || value.kind !== 'fraction') {
    throw new TypeError('fraction wire value must have kind fraction');
  }
  return { numerator: BigInt(value.numerator), denominator: BigInt(value.denominator) };
}

export function wireToForm(value) {
  if (!value || typeof value !== 'object') {
    throw new TypeError('form wire value must be an object');
  }
  if (value.kind === 'fraction') {
    return {
      kind: 'fraction',
      ...wireToFraction(value),
    };
  }
  if (value.kind === 'mixed-number') {
    return {
      kind: 'mixed-number',
      whole: BigInt(value.whole),
      fraction: wireToFraction(value.fraction),
    };
  }
  throw new TypeError(`unsupported form wire kind: ${String(value.kind)}`);
}

export function isFractionWire(value) {
  return Boolean(
    value
      && value.kind === 'fraction'
      && typeof value.numerator === 'string'
      && typeof value.denominator === 'string',
  );
}

export function isFormWire(value) {
  return isFractionWire(value)
    || Boolean(
      value
        && value.kind === 'mixed-number'
        && typeof value.whole === 'string'
        && isFractionWire(value.fraction),
    );
}

export function canonicalSerialize(value) {
  return JSON.stringify(value);
}

export function formKey(value) {
  return canonicalSerialize(value);
}

export function quantityFromFraction(value, transitions = []) {
  const initialForm = fractionToWire(value);
  const preferredFinalForm = fractionToWire(value);
  return {
    exactValue: fractionToWire(value),
    initialForm,
    currentForm: initialForm,
    preferredFinalForm,
    acceptedFormTransitions: transitions,
  };
}

export function mathematicalInstanceKey(instance) {
  const left = instance.operands.left.initialForm;
  const right = instance.operands.right.initialForm;
  return canonicalSerialize({
    selector: instance.request.selector,
    overlays: instance.request.overlays,
    operation: instance.request.operation,
    left,
    right,
  });
}

export function instanceId({ selector, overlays, left, right }) {
  const overlayPart = overlays.length === 0 ? 'none' : overlays.join('+');
  return [
    selector,
    overlayPart,
    left.numerator.toString(),
    left.denominator.toString(),
    right.numerator.toString(),
    right.denominator.toString(),
  ].join('__');
}
