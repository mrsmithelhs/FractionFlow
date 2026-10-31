import { writeFile } from 'node:fs/promises';
import {
  compareFractions,
  compareToBenchmark,
  convertToDenominator,
  createFraction,
  leastCommonDenominator,
} from '../../../../src/math/index.js';

// Illustrative authored inputs only. Relations are derived by the exact core;
// this file intentionally contains no expected-answer table.
const items = [
  { id: 'larger-integers-trap', left: [2, 3], right: [3, 5] },
  { id: 'same-denominator-unit-count-swapped', left: [5, 8], right: [3, 8] },
  { id: 'unreduced-equality', left: [4, 6], right: [6, 9] },
  { id: 'unreduced-equality-swapped', left: [6, 9], right: [4, 6] },
  { id: 'equal-gap-unequal-amounts', left: [3, 4], right: [5, 6] },
  { id: 'equal-gap-unequal-amounts-swapped', left: [5, 6], right: [3, 4] },
  { id: 'smaller-gap-predicts-wrong-way', left: [2, 3], right: [7, 10] },
  { id: 'same-denominator-unit-count', left: [3, 8], right: [5, 8] },
  { id: 'same-positive-numerator-unit-size', left: [3, 5], right: [3, 7] },
  { id: 'separating-half-benchmark', left: [3, 8], right: [5, 9] },
  { id: 'equivalent-unreduced-and-reduced', left: [4, 8], right: [1, 2] },
  { id: 'equivalent-unreduced-and-reduced-swapped', left: [1, 2], right: [4, 8] },
];

const relationNames = new Map([[-1, 'less'], [0, 'equal'], [1, 'greater']]);
const rows = items.map(({ id, left: leftPair, right: rightPair }) => {
  const left = createFraction(...leftPair);
  const right = createFraction(...rightPair);
  const positiveProper = [left, right].every((fraction) => (
    fraction.numerator > 0n && fraction.numerator < fraction.denominator
  ));
  if (!positiveProper) throw new Error(`task eligibility failed for ${id}`);
  const relation = compareFractions(left, right);
  const commonDenominator = leastCommonDenominator(left.denominator, right.denominator);
  const leftConverted = convertToDenominator(left, commonDenominator);
  const rightConverted = convertToDenominator(right, commonDenominator);
  const convertedRelation = compareFractions(leftConverted, rightConverted);
  if (relation !== convertedRelation) {
    throw new Error(`common-unit conversion changed the exact relation for ${id}`);
  }

  const benchmarkEvidence = id === 'separating-half-benchmark'
    ? {
      benchmark: 'half',
      firstRelationToBenchmark: compareToBenchmark(left, 'half'),
      secondRelationToBenchmark: compareToBenchmark(right, 'half'),
    }
    : null;

  return {
    id,
    sourceForms: {
      first: { numerator: String(left.numerator), denominator: String(left.denominator) },
      second: { numerator: String(right.numerator), denominator: String(right.denominator) },
    },
    relation: relationNames.get(relation),
    relationCode: relation,
    positiveProper: true,
    benchmarkEvidence,
    numeratorGap: {
      first: String(left.denominator - left.numerator),
      second: String(right.denominator - right.numerator),
    },
    derivedCommonUnitCheck: {
      denominator: String(commonDenominator),
      first: { numerator: String(leftConverted.numerator), denominator: String(leftConverted.denominator) },
      second: { numerator: String(rightConverted.numerator), denominator: String(rightConverted.denominator) },
      relationPreserved: true,
    },
    maxSourceDenominator: String(left.denominator > right.denominator ? left.denominator : right.denominator),
  };
});

const counts = Object.fromEntries(['less', 'equal', 'greater'].map((name) => [
  name,
  rows.filter((row) => row.relation === name).length,
]));
if (rows.length < 6 || rows.length > 12) throw new Error('illustrative batch must contain 6–12 pairs');
if (Object.values(counts).some((count) => count !== 4)) {
  throw new Error('derived illustrative relations are not balanced 4/4/4');
}
if (rows.some((row) => BigInt(row.maxSourceDenominator) > 10n)) {
  throw new Error('illustrative pair exceeds the proposed denominator-10 first-slice bound');
}

const evidence = {
  evidenceType: 'read-only exact-example probe; not a product test or production content bank',
  mathModule: 'src/math/index.js',
  apis: ['createFraction', 'compareFractions', 'compareToBenchmark', 'leastCommonDenominator', 'convertToDenominator'],
  denominatorBoundChecked: 10,
  counts,
  rows,
};
const outputPath = new URL('./exact-examples.json', import.meta.url);
await writeFile(outputPath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
process.stdout.write(`${outputPath.pathname}\n`);
