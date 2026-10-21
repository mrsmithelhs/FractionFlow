#!/usr/bin/env node
// Run the unchanged production route matrix and preserve its historical outputs.
// Record a full matrix result and restore historical route artifacts byte-for-byte.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const reportDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(process.argv[2] || path.join(reportDir, '../../../..'));
const label = process.argv[3];
const seedName = process.argv[4] || null;
if (!['baseline-a', 'production-b'].includes(label) || (seedName && label !== 'production-b')) throw new Error('Usage: node capture-parity-matrix.mjs <repo-root> <baseline-a|production-b> [production-b seed-name]');
const matrixFile = path.join(repoRoot, 'tests/routes/route-matrix.json');
const matrix = JSON.parse(fs.readFileSync(matrixFile, 'utf8'));
const generated = new Set(matrix.routes.flatMap((r) => (r.actions || []).filter((a) => a.method === 'screenshot').map((a) => a.file)));
const trackedOutputList = spawnSync('git', ['-C', repoRoot, 'ls-files', '-z', '--',
  'reports/development/plan-34-reusable-full-addition-task-patterns/evidence/*.png',
  'reports/development/plan-38-like-denominator-subtraction-batch/evidence/*.png',
  'reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/*.png',
  'reports/development/plan-18-nested-denominator-addition/evidence/*.png',
  'reports/development/plan-34-reusable-full-addition-task-patterns/evidence/*.json',
  'reports/development/plan-38-like-denominator-subtraction-batch/evidence/*.json',
  'reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/*.json',
  'reports/development/plan-18-nested-denominator-addition/evidence/*.json'], { encoding: 'utf8' }).stdout;
for (const rel of trackedOutputList.split('\0').filter(Boolean)) generated.add(rel);
for (const file of [
  'reports/development/plan-34-reusable-full-addition-task-patterns/evidence/plan34-viewport-measurements.json',
  'reports/development/plan-35-reusable-task-recipes-and-authored-batch/plan35-route-matrix-summary.json',
  'reports/development/plan-38-like-denominator-subtraction-batch/evidence/plan38-viewport-measurements.json',
  'reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/plan40-viewport-measurements.json',
  'reports/development/plan-18-nested-denominator-addition/evidence/route-matrix-results.json',
]) generated.add(file);
const hash = (data) => crypto.createHash('sha256').update(data).digest('hex');
const snapshots = new Map();
for (const rel of generated) {
  const target = path.join(repoRoot, rel);
  snapshots.set(rel, fs.existsSync(target) ? fs.readFileSync(target) : null);
}
const mainHash = spawnSync('git', ['-C', repoRoot, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).stdout.trim();
const seedPrefix = seedName?.startsWith('plan38:') ? '--plan38-witness-seed'
  : seedName?.startsWith('plan40:') ? '--plan40-witness-seed'
    : seedName?.startsWith('motion:') ? '--motion-witness-seed' : null;
if (seedName && !seedPrefix) throw new Error('Seed must start with plan38:, plan40:, or motion:.');
const seedValue = seedName?.slice(seedName.indexOf(':') + 1);
const args = [path.join(repoRoot, 'scripts/dev/run-route-matrix.js'), '--browser-channel', 'chrome', '--quiet', ...(seedName ? [seedPrefix, seedValue] : [])];
let run;
try {
  run = spawnSync(process.execPath, args, {
    cwd: repoRoot, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
  });
} finally {
  const screenshots = [];
  const summaryRel = seedName?.startsWith('plan38:')
    ? 'reports/development/plan-38-like-denominator-subtraction-batch/evidence/plan38-route-matrix-summary.json'
    : seedName?.startsWith('plan40:')
      ? 'reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/plan40-route-matrix-summary.json'
      : seedName?.startsWith('motion:')
        ? 'reports/development/plan-35-reusable-task-recipes-and-authored-batch/plan35-route-matrix-summary.json'
        : 'reports/development/plan-40-unlike-denominator-subtraction-batch/evidence/plan40-route-matrix-summary.json';
  const summaryPath = path.join(repoRoot, summaryRel);
  const matrixResult = fs.existsSync(summaryPath) ? JSON.parse(fs.readFileSync(summaryPath, 'utf8')) : null;
  const completion = (run?.stdout || '').match(/Route Matrix Run Complete: (.+?) \((\d+) route rows; (\d+) browser executions\)\./);
  const completionText = completion?.[1] || '';
  const detected = Number(completionText.match(/(\d+) intended seed failure detected/)?.[1] || 0);
  const compactResult = completion ? {
    routeRows: Number(completion[2]), browserExecutions: Number(completion[3]),
    passSummary: completionText, intendedSeedFailuresDetected: detected,
    failureRouteLines: (run.stdout || '').split(/\r?\n/).filter((line) => line.includes('seed detected at intended assertion') || line.includes('intended assertion detected seed:')),
    exitCode: run.status,
  } : matrixResult && {
    routeRows: matrixResult.routeRows, browserExecutions: matrixResult.browserExecutions,
    passed: matrixResult.passed, knownDefects: matrixResult.knownDefects, failed: matrixResult.failed,
    seedDetected: matrixResult.seedDetected, contexts: matrixResult.contexts,
    failures: matrixResult.results.filter((result) => result.status !== 'pass'),
  };
  const restored = [];
  for (const [rel, prior] of snapshots) {
    const target = path.join(repoRoot, rel);
    if (prior === null) {
      if (fs.existsSync(target)) fs.rmSync(target, { force: true });
      restored.push({ path: rel, wasAbsent: true, restoredAbsent: !fs.existsSync(target) });
    } else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, prior);
      const actual = fs.readFileSync(target);
      restored.push({ path: rel, sha256Before: hash(prior), sha256After: hash(actual), byteExact: prior.equals(actual) });
    }
  }
  const receipt = {
    label, seed: seedName, commit: mainHash, browserChannel: 'chrome', command: `node scripts/dev/run-route-matrix.js --browser-channel chrome --quiet${seedName ? ` ${seedPrefix} ${seedValue}` : ''}`,
    routeRows: matrix.routes.length, expectedBrowserExecutions: 83,
    exitCode: run?.status ?? null, signal: run?.signal ?? null,
    stdoutTail: (run?.stdout || '').slice(-1600), stderr: run?.stderr || '', matrixResult: compactResult,
    screenshots, historicalOutputRestoration: restored,
  };
  fs.writeFileSync(path.join(reportDir, 'evidence', `${label}${seedName ? `-${seedName.replace(':', '-')}` : ''}-route-matrix.json`), `${JSON.stringify(receipt, null, 2)}\n`);
}
if (!run || run.status !== 0) process.exit(run?.status || 1);
