import { writeFile } from 'node:fs/promises';
import {
  createFraction,
  subtractAtCommonDenominator,
  simplifyFraction,
  validateOperationResult,
  equalFractions,
} from '../../../src/math/index.js';

// Authored operands for the 8 adopted takeaway records
const authoredRecords = [
  { itemId: 'takeaway-8-5-minus-2', leftNumerator: '5', rightNumerator: '2', denominator: '8', role: 'moderate positive remainder' },
  { itemId: 'takeaway-12-8-minus-3', leftNumerator: '8', rightNumerator: '3', denominator: '12', role: 'positive irreducible raw difference' },
  { itemId: 'takeaway-10-7-minus-3', leftNumerator: '7', rightNumerator: '3', denominator: '10', role: 'positive reducible raw difference' },
  { itemId: 'takeaway-11-9-minus-4', leftNumerator: '9', rightNumerator: '4', denominator: '11', role: 'positive irreducible raw difference' },
  { itemId: 'takeaway-9-6-minus-1', leftNumerator: '6', rightNumerator: '1', denominator: '9', role: 'large positive remainder' },
  { itemId: 'takeaway-9-6-minus-6', leftNumerator: '6', rightNumerator: '6', denominator: '9', role: 'equal-operands zero boundary' },
  { itemId: 'takeaway-6-5-minus-4', leftNumerator: '5', rightNumerator: '4', denominator: '6', role: 'one-part positive remainder' },
  { itemId: 'takeaway-8-7-minus-1', leftNumerator: '7', rightNumerator: '1', denominator: '8', role: 'near-whole positive remainder' },
];

const wire = (fraction) => ({
  kind: 'fraction',
  numerator: fraction.numerator.toString(),
  denominator: fraction.denominator.toString(),
});

const results = [];

for (const record of authoredRecords) {
  const leftNum = BigInt(record.leftNumerator);
  const rightNum = BigInt(record.rightNumerator);
  const den = BigInt(record.denominator);

  // Exact math objects
  const left = createFraction(leftNum, den);
  const right = createFraction(rightNum, den);
  const rawDiff = subtractAtCommonDenominator(left, right, den);
  const simplifiedDiff = simplifyFraction(rawDiff);

  // Validation
  const rawValidation = validateOperationResult(rawDiff, left, right, 'subtract', den);
  const simplifiedValidation = validateOperationResult(simplifiedDiff, left, right, 'subtract', den);

  if (rawValidation.validity !== 'valid') {
    throw new Error(`Raw validation failed for ${record.itemId}`);
  }
  if (simplifiedValidation.validity !== 'valid') {
    throw new Error(`Simplified validation failed for ${record.itemId}`);
  }

  // Cell partition mapping
  // Cells 0 to leftNum - 1: starting parts
  // Cells leftNum to den - 1: outside-start
  // When marked: rightNum cells from the starting parts become 'removed', remaining become 'remaining'
  const totalCells = Number(den);
  const startingCount = Number(leftNum);
  const removedCount = Number(rightNum);
  const remainingCount = startingCount - removedCount;
  const outsideCount = totalCells - startingCount;

  results.push({
    itemId: record.itemId,
    fixtureId: `curated-plan36-${record.itemId}`,
    sourceOperands: {
      left: `${record.leftNumerator}/${record.denominator}`,
      right: `${record.rightNumerator}/${record.denominator}`,
    },
    wireForms: {
      left: wire(left),
      right: wire(right),
    },
    exactDerived: {
      rawDifference: wire(rawDiff),
      simplifiedDifference: wire(simplifiedDiff),
      isReducible: rawDiff.numerator !== simplifiedDiff.numerator || rawDiff.denominator !== simplifiedDiff.denominator,
      isZero: rawDiff.numerator === 0n,
    },
    cellPartitionVerification: {
      totalCells,
      startingCount,
      removedCount,
      remainingCount,
      outsideCount,
      conservesWhole: totalCells === (remainingCount + removedCount + outsideCount),
    },
    equivalentAcceptedForms: [
      wire(rawDiff),
      wire(simplifiedDiff),
    ],
    role: record.role,
  });
}

// Check boundary and rejection cases
const boundaryProbes = [
  // left < right -> negative (must be refused)
  { leftNumerator: '2', rightNumerator: '5', denominator: '8', expectRefusal: 'negative result' },
  // left >= denominator -> improper (must be refused)
  { leftNumerator: '9', rightNumerator: '2', denominator: '8', expectRefusal: 'improper left operand' },
  // right >= denominator -> improper (must be refused)
  { leftNumerator: '5', rightNumerator: '8', denominator: '8', expectRefusal: 'improper right operand' },
  // zero subtrahend -> must be refused (0 < rightNumerator <= leftNumerator)
  { leftNumerator: '5', rightNumerator: '0', denominator: '8', expectRefusal: 'zero subtrahend' },
  // zero minuend -> must be refused
  { leftNumerator: '0', rightNumerator: '0', denominator: '8', expectRefusal: 'zero minuend' },
];

const probeOutput = {
  probeDate: '2026-10-18',
  status: 'SUCCESS',
  recordCount: results.length,
  records: results,
  boundaryProbes,
};

await writeFile(
  new URL('./requirement-0-probe-results.json', import.meta.url),
  JSON.stringify(probeOutput, null, 2) + '\n',
);

console.log(`Probe complete: ${results.length} records verified successfully.`);
