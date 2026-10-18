import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fixtureRoot = path.join(rootDir, 'tests/fixtures');
const outputDir = path.join(os.tmpdir(), 'fractionflow-plan18-historical-entry');

await build({
  configFile: false,
  root: fixtureRoot,
  base: '/FractionFlow/__test__/plan18-historical/',
  build: {
    outDir: outputDir,
    emptyOutDir: true,
    rollupOptions: {
      input: path.join(fixtureRoot, 'plan18-historical-entry.html'),
    },
  },
});

console.log(JSON.stringify({ outputDir, entry: 'plan18-historical-entry.html', practiceSet: 'unlike-addition-vetted-set@6' }, null, 2));
