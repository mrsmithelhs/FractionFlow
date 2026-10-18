import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const baselineCommit = '201235e';
const originalText = execFileSync('git', ['show', `${baselineCommit}:tests/routes/route-matrix.json`], { encoding: 'utf8' });
const currentText = await readFile('tests/routes/route-matrix.json', 'utf8');
const original = JSON.parse(originalText);
const current = JSON.parse(currentText);
assert.deepEqual(current.routes.slice(0, original.routes.length), original.routes);
assert.equal(current.routes.length, original.routes.length + 2);
assert.ok(current.routes.slice(original.routes.length).every((row) => row.id.startsWith('ROUTE-PLAN35-')));
const helper = await readFile('scripts/dev/plan18-route-prefix.mjs', 'utf8');
assert.match(helper, /import \{ PLAN18_PRACTICE_TYPES_V6 \}/);
assert.doesNotMatch(helper, /import \{ PRACTICE_TYPES \}/);
const liveHelper = await readFile('scripts/dev/plan35-route-live-set.mjs', 'utf8');
assert.match(liveHelper, /import \{ PLAN35_PRACTICE_TYPES_V7 \}/);
const hash = (text) => createHash('sha256').update(text).digest('hex');
const receipt = {
  baselineCommit,
  retainedRouteRows: original.routes.length,
  currentRouteRows: current.routes.length,
  retainedRowsDeepEqualIncludingActionsAndExpectations: true,
  oldMatrixSha256: hash(originalText),
  currentMatrixSha256: hash(currentText),
  historicalHelperPins: 'PLAN18_PRACTICE_TYPES_V6',
  currentHelperPins: 'PLAN35_PRACTICE_TYPES_V7',
  addedRoutes: current.routes.slice(original.routes.length).map(({ id }) => id),
  limits: 'Structural preservation check; browser execution and current-vs-historical context correctness need separate evidence.',
};
await writeFile(new URL('./parent-route-preservation.json', import.meta.url), JSON.stringify(receipt, null, 2) + '\n');
console.log(JSON.stringify(receipt));
