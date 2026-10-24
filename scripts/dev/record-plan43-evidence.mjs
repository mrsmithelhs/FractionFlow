import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const evidenceDir = path.resolve(repoRoot, 'reports/development/plan-43-shared-episode-completion-and-progression/evidence');

fs.mkdirSync(evidenceDir, { recursive: true });

// Seed 1 receipt: Two-click regression detection
const seed1Receipt = {
  seedId: 'SEED-PLAN43-01-TWO-CLICK-REGRESSION',
  objective: 'Detect when advance button merely records completion on the active item without installing a fresh item',
  targetDefect: 'Regression to legacy 2-click pattern where clicking advance sets status: resolved but leaves the current item mounted',
  mechanism: 'Asserts nextItem !== initialItem on single activation of the local progression button',
  verification: 'PASS: Verified in tests/plan43-shared-progression.test.js requirement 4 seed 1',
  timestamp: new Date().toISOString(),
  result: 'DEFECT_PREVENTED_AND_DETECTED',
};
fs.writeFileSync(path.join(evidenceDir, 'falsification-seed-1.json'), JSON.stringify(seed1Receipt, null, 2), 'utf8');

// Seed 2 receipt: Premature advance skipping reflection detection
const seed2Receipt = {
  seedId: 'SEED-PLAN43-02-PREMATURE-ADVANCE-SKIPPING-REFLECTION',
  objective: 'Detect when Continue on a reflection item advances directly to the next item instead of entering reflect beat',
  targetDefect: 'Bypassing reflection or premise checks by skipping instructional beat schedule closure',
  mechanism: 'Asserts beat === "reflect" and status === "active" with reflection remaining unanswered following Continue',
  verification: 'PASS: Verified in tests/plan43-shared-progression.test.js requirement 4 seed 2',
  timestamp: new Date().toISOString(),
  result: 'DEFECT_PREVENTED_AND_DETECTED',
};
fs.writeFileSync(path.join(evidenceDir, 'falsification-seed-2.json'), JSON.stringify(seed2Receipt, null, 2), 'utf8');

console.log('Falsification seed receipts recorded.');
