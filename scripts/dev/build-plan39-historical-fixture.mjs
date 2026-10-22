import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fixtureRoot = path.join(rootDir, 'tests/fixtures');
const outputDir = path.join(os.tmpdir(), 'fractionflow-plan39-historical-v7-entry');

await build({
  configFile: false,
  root: fixtureRoot,
  base: '/FractionFlow/__test__/plan39-historical-v7/',
  build: {
    outDir: outputDir,
    emptyOutDir: true,
    rollupOptions: {
      input: path.join(fixtureRoot, 'plan39-historical-v7-entry.html'),
    },
  },
});

console.log(JSON.stringify({
  outputDir,
  entry: 'plan39-historical-v7-entry.html',
  practiceSet: 'bar-to-line-same-amount-vetted-set@1',
  definitionRevision: '1',
  replaySchema: 'fractionflow.episode-replay/v7',
}, null, 2));
