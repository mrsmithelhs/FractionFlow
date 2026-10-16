import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fixtureRoot = path.join(rootDir, 'tests/fixtures');
const outputDir = path.join(os.tmpdir(), 'fractionflow-plan34-historical-entry');

await build({
  configFile: false,
  root: fixtureRoot,
  base: '/FractionFlow/__test__/plan34-historical/',
  build: {
    outDir: outputDir,
    emptyOutDir: true,
    rollupOptions: {
      input: path.join(fixtureRoot, 'plan34-historical-entry.html'),
    },
  },
});

console.log(JSON.stringify({ outputDir, entry: 'plan34-historical-entry.html', practiceSet: 'unlike-addition-vetted-set@4' }, null, 2));
