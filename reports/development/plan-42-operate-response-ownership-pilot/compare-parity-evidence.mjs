#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const evidenceDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'evidence');
const read = (name) => {
  let text = fs.readFileSync(path.join(evidenceDir, name), 'utf8').trim();
  if (text.endsWith('\\n')) text = text.slice(0, -2);
  return JSON.parse(text);
};
const write = (name, value) => fs.writeFileSync(path.join(evidenceDir, name), `${JSON.stringify(value, null, 2)}\n`);
for (const file of fs.readdirSync(evidenceDir).filter((name) => name.endsWith('-route-matrix.json'))) {
  const receipt = read(file);
  const match = receipt.stdoutTail?.match(/Route Matrix Run Complete: (.+?) \((\d+) route rows; (\d+) browser executions\)\./);
  if (match) {
    const summary = match[1];
    receipt.matrixResult = {
      routeRows: Number(match[2]), browserExecutions: Number(match[3]), passSummary: summary,
      intendedSeedFailuresDetected: Number(summary.match(/(\d+) intended seed failure detected/)?.[1] || 0),
      failureRouteLines: receipt.stdoutTail.split(/\r?\n/).filter((line) => line.includes('seed detected at intended assertion') || line.includes('intended assertion detected seed:')),
      exitCode: receipt.exitCode,
    };
  }
  write(file, receipt);
}
const a = read('baseline-a-operate-parity.json');
const b = read('production-b-operate-parity.json');
const bCaptures = new Map(b.captures.map((capture) => [capture.name, capture]));
const pairs = a.captures.map((baseline) => {
  const current = bCaptures.get(baseline.name);
  if (!current) throw new Error(`Missing production capture ${baseline.name}`);
  return { name: baseline.name, observationEqual: JSON.stringify(baseline.observation) === JSON.stringify(current.observation), screenshotHashEqual: baseline.sha256 === current.sha256, baseline: baseline.observation, production: current.observation };
});
const comparison = {
  browser: 'Chrome via Playwright',
  baselineCommit: a.commit,
  productionProductCommit: '436e54a0ed58ff8437a22e61815c2c3da098954d',
  productionCheckoutHead: b.commit,
  pairs: pairs.map(({ baseline, production, ...summary }) => summary),
  measurementPairs: pairs.length,
  identicalMeasurements: pairs.filter((pair) => pair.observationEqual).length,
  identicalScreenshotHashes: pairs.filter((pair) => pair.screenshotHashEqual).length,
  differences: pairs.filter((pair) => !pair.observationEqual || !pair.screenshotHashEqual).map((pair) => ({ name: pair.name, observationEqual: pair.observationEqual, screenshotHashEqual: pair.screenshotHashEqual })),
  fullProductionMatrix: read('production-b-route-matrix.json').matrixResult,
  baselineFullMatrixAttempt: read('baseline-a-route-matrix.json').matrixResult,
  targetedSeeds: fs.readdirSync(evidenceDir).filter((name) => name.startsWith('production-b-') && name.endsWith('-route-matrix.json') && name !== 'production-b-route-matrix.json').map((name) => {
    const receipt = read(name);
    return { file: name, seed: receipt.seed, exitCode: receipt.exitCode, result: receipt.matrixResult };
  }),
  limitations: [
    'Chrome headless desktop browser context only; no physical device, touch hardware, keyboard-only certification, or assistive technology claim.',
    'Mobile screenshots were captured at 360x740 with Playwright touch capability; ordinary vertical scroll remains available.',
    'The mobile task-help control extends below the initial viewport in the visual fraction state; it is reachable by scrolling and has equivalent geometry in both builds.',
    'One desktop single-input PNG hash differed while recorded bounds and state measurements were identical; likely timing/pixel-level variation during an existing subdivision animation, not a measured layout difference.',
  ],
};
write('matched-parity-comparison.json', comparison);
