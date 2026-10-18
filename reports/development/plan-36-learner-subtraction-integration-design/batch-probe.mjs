import { createFraction, subtractAtCommonDenominator, simplifyFraction, validateOperationResult } from '../../../src/math/index.js';

// Only operands, stable IDs and coverage notes are authored. Expected forms are not stored here.
const authoredOperands = [
  { id: 'takeaway-8-5-minus-2', numerator: 5, removed: 2, denominator: 8, role: 'moderate positive remainder' },
  { id: 'takeaway-12-8-minus-3', numerator: 8, removed: 3, denominator: 12, role: 'positive irreducible raw difference' },
  { id: 'takeaway-10-7-minus-3', numerator: 7, removed: 3, denominator: 10, role: 'positive reducible raw difference' },
  { id: 'takeaway-11-9-minus-4', numerator: 9, removed: 4, denominator: 11, role: 'positive irreducible raw difference' },
  { id: 'takeaway-9-6-minus-1', numerator: 6, removed: 1, denominator: 9, role: 'large positive remainder' },
  { id: 'takeaway-9-6-minus-6', numerator: 6, removed: 6, denominator: 9, role: 'equal-operands zero boundary' },
  { id: 'takeaway-6-5-minus-4', numerator: 5, removed: 4, denominator: 6, role: 'one-part positive remainder' },
  { id: 'takeaway-8-7-minus-1', numerator: 7, removed: 1, denominator: 8, role: 'near-whole positive remainder' },
];
const wire = (fraction) => ({ numerator: fraction.numerator.toString(), denominator: fraction.denominator.toString() });
const cases = authoredOperands.map(({ id, numerator, removed, denominator, role }) => {
  const left = createFraction(numerator, denominator);
  const right = createFraction(removed, denominator);
  const raw = subtractAtCommonDenominator(left, right, denominator);
  const simplified = simplifyFraction(raw);
  const rawCheck = validateOperationResult(raw, left, right, 'subtract', denominator);
  const simplifiedCheck = validateOperationResult(simplified, left, right, 'subtract', denominator);
  return {
    id, role,
    operands: { left: wire(left), right: wire(right) },
    derived: { rawDifference: wire(raw), simplifiedDifference: wire(simplified) },
    checks: {
      rawClassification: rawCheck.classification,
      simplifiedClassification: simplifiedCheck.classification,
      bothExact: rawCheck.validity === 'valid' && simplifiedCheck.validity === 'valid',
    },
  };
});
if (cases.length !== authoredOperands.length || cases.some((entry) => !entry.checks.bothExact)) {
  throw new Error('exact subtraction batch derivation failed');
}
process.stdout.write(`${JSON.stringify({
  method: 'subtractAtCommonDenominator + simplifyFraction + validateOperationResult',
  authoredOperands,
  cases,
}, null, 2)}\n`);
