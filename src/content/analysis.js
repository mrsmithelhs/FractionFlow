import {
  addAtCommonDenominator,
  addFractions,
  areEquivalent,
  classifyFractionResult,
  classifyMagnitude,
  compareFractions,
  convertToDenominator,
  createFraction,
  denominatorRelationship,
  leastCommonDenominator,
  operandsRequiringRenaming,
  scaleFactorForDenominator,
  simplifyFraction,
  subtractAtCommonDenominator,
  subtractFractions,
  validateCommonDenominator,
  validateEquivalentFraction,
  validateOperationResult,
} from '../math/index.js';
import { fractionToWire } from './schema.js';

function bigintString(value) {
  return value.toString();
}

function asFraction(candidate, side) {
  const value = candidate[side];
  if (!value || value.kind !== 'fraction') {
    throw new TypeError(`${side} candidate must be a fraction wire value`);
  }
  return createFraction(BigInt(value.numerator), BigInt(value.denominator));
}

function isSimplest(value) {
  const simplified = simplifyFraction(value);
  return simplified.numerator === value.numerator
    && simplified.denominator === value.denominator;
}

function operationAtCommonDenominator(left, right, operation, denominator) {
  return operation === 'add'
    ? addAtCommonDenominator(left, right, denominator)
    : subtractAtCommonDenominator(left, right, denominator);
}

function operationAtLeastCommonDenominator(left, right, operation) {
  return operation === 'add'
    ? addFractions(left, right)
    : subtractFractions(left, right);
}

function makeTransformation(target, from, to, scaleFactor) {
  const validation = validateEquivalentFraction(to, from, to.denominator);
  if (validation.validity !== 'valid') {
    throw new Error(`invalid content transformation for ${target}`);
  }
  return {
    type: 'equivalent-renaming',
    target,
    fromForm: fractionToWire(from),
    toForm: fractionToWire(to),
    scaleFactor: bigintString(scaleFactor),
    preservesExactValue: true,
    validation: 'valid',
  };
}

function makeOperationStep(operation, left, right, rawResult) {
  return {
    type: 'operation',
    operation,
    left: fractionToWire(left),
    right: fractionToWire(right),
    rawResult: fractionToWire(rawResult),
  };
}

function makePath({
  id,
  kind,
  status,
  targetDenominator,
  left,
  right,
  operation,
  rawResult,
  simplifiedResult,
}) {
  const leftAtTarget = convertToDenominator(left, targetDenominator);
  const rightAtTarget = convertToDenominator(right, targetDenominator);
  const leftFactor = scaleFactorForDenominator(left, targetDenominator);
  const rightFactor = scaleFactorForDenominator(right, targetDenominator);
  const transformations = [];
  if (left.denominator !== targetDenominator) {
    transformations.push(makeTransformation('left', left, leftAtTarget, leftFactor));
  }
  if (right.denominator !== targetDenominator) {
    transformations.push(makeTransformation('right', right, rightAtTarget, rightFactor));
  }

  return {
    id,
    kind,
    status,
    startingState: 'initial',
    targetDenominator: bigintString(targetDenominator),
    scaleFactors: {
      left: bigintString(leftFactor),
      right: bigintString(rightFactor),
    },
    transformations,
    operation: makeOperationStep(operation, leftAtTarget, rightAtTarget, rawResult),
    finalResult: {
      rawForm: fractionToWire(rawResult),
      preferredFinalForm: fractionToWire(simplifiedResult),
    },
  };
}

function makeAlternateDenominator(lcd, left, right, maxScaleFactor) {
  const candidate = lcd * 2n;
  const validation = validateCommonDenominator(candidate, left, right);
  if (validation.validity !== 'valid' || validation.efficiency !== 'non-least') {
    return null;
  }
  if (validation.scaleFactors.left > maxScaleFactor || validation.scaleFactors.right > maxScaleFactor) {
    return null;
  }
  return candidate;
}

export function deriveFacts(candidate, operation, profile) {
  const left = asFraction(candidate, 'left');
  const right = asFraction(candidate, 'right');
  const leftClassification = classifyFractionResult(left);
  const rightClassification = classifyFractionResult(right);
  const relationship = denominatorRelationship(left, right);
  const lcd = leastCommonDenominator(left.denominator, right.denominator);
  const commonDenominatorValidation = validateCommonDenominator(lcd, left, right);
  const renaming = operandsRequiringRenaming(left, right, lcd);
  const nonnegativeResult = operation === 'add' || compareFractions(left, right) >= 0;

  if (!nonnegativeResult) {
    return {
      accepted: false,
      reasons: ['negative-result'],
      left,
      right,
      operation,
      denominatorRelationship: relationship,
      lcd,
      leftClassification,
      rightClassification,
      renaming,
      nonnegativeResult,
    };
  }

  const rawResult = operationAtLeastCommonDenominator(left, right, operation);
  const simplifiedResult = simplifyFraction(rawResult);
  const resultClassification = classifyFractionResult(rawResult);
  const magnitude = classifyMagnitude(rawResult);
  const exactValidation = validateOperationResult(rawResult, left, right, operation, lcd);
  const alternateDenominator = makeAlternateDenominator(
    lcd,
    left,
    right,
    profile.maxAlternateScaleFactor,
  );
  const alternateRawResult = alternateDenominator === null
    ? null
    : operationAtCommonDenominator(left, right, operation, alternateDenominator);

  return {
    accepted: true,
    candidate,
    left,
    right,
    operation,
    denominatorRelationship: relationship,
    lcd,
    leftClassification,
    rightClassification,
    renaming,
    nonnegativeResult,
    rawResult,
    simplifiedResult,
    resultClassification,
    magnitude,
    exactValidation,
    commonDenominatorValidation,
    alternateDenominator,
    alternateRawResult,
    alternateValidation: alternateDenominator === null
      ? null
      : validateOperationResult(
        alternateRawResult,
        left,
        right,
        operation,
        alternateDenominator,
      ),
    alternateCommonDenominatorValidation: alternateDenominator === null
      ? null
      : validateCommonDenominator(alternateDenominator, left, right),
    simplestOperands: {
      left: isSimplest(left),
      right: isSimplest(right),
    },
  };
}

export function buildPathFacts(facts) {
  const canonicalPath = makePath({
    id: 'canonical-lcd',
    kind: 'lcd',
    status: 'canonical',
    targetDenominator: facts.lcd,
    left: facts.left,
    right: facts.right,
    operation: facts.operation,
    rawResult: facts.rawResult,
    simplifiedResult: facts.simplifiedResult,
  });

  const alternatePaths = [];
  if (facts.alternateDenominator !== null) {
    alternatePaths.push(makePath({
      id: 'alternate-non-least-common-denominator',
      kind: 'non-least-common-denominator',
      status: 'alternate-valid',
      targetDenominator: facts.alternateDenominator,
      left: facts.left,
      right: facts.right,
      operation: facts.operation,
      rawResult: facts.alternateRawResult,
      simplifiedResult: facts.simplifiedResult,
    }));
  }
  return { canonicalPath, alternatePaths };
}

export function exactValueMatches(left, right) {
  return areEquivalent(left, right);
}
