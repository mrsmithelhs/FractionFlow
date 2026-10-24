import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const fixtureRoot = path.join(rootDir, 'tests/fixtures');
const outputDir = path.join(os.tmpdir(), 'fractionflow-legacy-navigation-entry');

await build({
  configFile: false,
  root: fixtureRoot,
  base: '/FractionFlow/__test__/legacy-navigation/',
  build: {
    outDir: outputDir,
    emptyOutDir: true,
    rollupOptions: {
      input: path.join(fixtureRoot, 'legacy-navigation-entry.html'),
    },
  },
});

console.log(JSON.stringify({
  outputDir,
  entry: 'legacy-navigation-entry.html',
  navigationMode: 'legacy-acknowledged',
}, null, 2));
