import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runRouteMatrix } from '../../scripts/dev/run-route-matrix.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '../..');
const evidenceDir = path.resolve(repoRoot, 'reports/development/plan-43-shared-episode-completion-and-progression/evidence');

async function main() {
  const summary = await runRouteMatrix({ filter: 'ROUTE-PLAN43' });
  const receipt = {
    capturedAt: new Date().toISOString(),
    browserChannel: summary.browserChannel,
    filter: 'ROUTE-PLAN43',
    routeRows: summary.routeRows,
    browserExecutions: summary.browserExecutions,
    passed: summary.passed,
    failed: summary.failed,
    seedDetected: summary.seedDetected,
    results: summary.results,
  };
  fs.writeFileSync(path.join(evidenceDir, 'route-matrix-plan43-receipt.json'), JSON.stringify(receipt, null, 2), 'utf8');
  console.log('Saved Plan 43 route matrix receipt.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
