import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const prototypeRoot = fileURLToPath(new URL('./prototypes/subtraction/', import.meta.url));
const configuredBase = process.env.BASE_PATH || '/FractionFlow/';
const normalizedBase = configuredBase.endsWith('/') ? configuredBase : configuredBase + '/';

export default defineConfig({
  root: prototypeRoot,
  base: normalizedBase + 'prototypes/subtraction/',
  build: {
    outDir: resolve(prototypeRoot, '../../dist/prototypes/subtraction'),
    emptyOutDir: true,
  },
});
