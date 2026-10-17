import { addAtCommonDenominator, convertToDenominator, createFraction, equalFractions, leastCommonDenominator, simplifyFraction, validateCommonDenominator, validateOperationResult } from '../../../src/math/index.js';

const rows = [
  { recipe: 'construct', target: '12', left: ['2', '3'], right: ['1', '4'] },
  { recipe: 'construct', target: '10', left: ['1', '2'], right: ['1', '5'] },
  { recipe: 'construct', target: '30', left: ['3', '5'], right: ['1', '3'] },
  { recipe: 'inspect prefix', target: '12', left: ['1', '2'], right: ['1', '3'], candidates: { left: ['5', '12'], right: ['4', '12'] } },
  { recipe: 'inspect prefix', target: '12', left: ['1', '3'], right: ['1', '4'], candidates: { left: ['4', '12'], right: ['7', '12'] } },
  { recipe: 'inspect', target: '24', left: ['1', '3'], right: ['1', '8'], candidates: { left: ['5', '24'], right: ['3', '24'] } },
  { recipe: 'inspect', target: '30', left: ['1', '5'], right: ['1', '3'], candidates: { left: ['6', '30'], right: ['11', '30'] } },
  { recipe: 'identify-side prefix', target: '8', left: ['1', '2'], right: ['3', '8'] },
  { recipe: 'identify-side prefix', target: '8', left: ['3', '8'], right: ['1', '2'] },
  { recipe: 'identify-side', target: '10', left: ['1', '2'], right: ['3', '10'] },
  { recipe: 'identify-side', target: '10', left: ['3', '10'], right: ['1', '2'] },
  { recipe: 'identify-side', target: '12', left: ['1', '3'], right: ['5', '12'] },
  { recipe: 'identify-side', target: '12', left: ['5', '12'], right: ['1', '3'] },
  { recipe: 'construct data-only holdout', target: '30', left: ['1', '5'], right: ['1', '6'] },
  { recipe: 'inspect data-only holdout', target: '20', left: ['1', '2'], right: ['1', '5'], candidates: { left: ['9', '20'], right: ['4', '20'] } },
];

const fraction = ([n, d]) => createFraction(BigInt(n), BigInt(d));
const result = rows.map((row) => {
  const left = fraction(row.left);
  const right = fraction(row.right);
  const target = BigInt(row.target);
  const path = validateCommonDenominator(target, left, right);
  const converted = { left: convertToDenominator(left, target), right: convertToDenominator(right, target) };
  const raw = addAtCommonDenominator(left, right, target);
  const operation = validateOperationResult(raw, converted.left, converted.right, 'add', target);
  return {
    recipe: row.recipe,
    target: row.target,
    source: { left: row.left.join('/'), right: row.right.join('/') },
    scales: { left: (target / left.denominator).toString(), right: (target / right.denominator).toString() },
    requiredSides: ['left', 'right'].filter((side) => converted[side].denominator.toString() !== (side === 'left' ? left : right).denominator.toString()),
    targetForms: { left: `${converted.left.numerator}/${converted.left.denominator}`, right: `${converted.right.numerator}/${converted.right.denominator}` },
    rawResult: `${raw.numerator}/${raw.denominator}`,
    simplifiedResult: `${simplifyFraction(raw).numerator}/${simplifyFraction(raw).denominator}`,
    lcd: leastCommonDenominator(left.denominator, right.denominator).toString(),
    mathValidity: path.validity,
    operationValidity: operation.validity,
    denominatorWithinCurrentBarLimit: target <= 30n,
    scaleFactorsWithinCurrentBarLimit: target / left.denominator <= 12n && target / right.denominator <= 12n,
    candidates: row.candidates ? Object.fromEntries(Object.entries(row.candidates).map(([side, pair]) => [
      side,
      {
        form: `${pair[0]}/${pair[1]}`,
        exactEquivalent: equalFractions(fraction(pair), converted[side]),
        correction: converted[side].numerator.toString(),
      },
    ])) : null,
  };
});

console.log(JSON.stringify({ source: 'src/math exact APIs', rows: result }, null, 2));
