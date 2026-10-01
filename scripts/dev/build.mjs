import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

try {
  process.chdir(repositoryRoot);
  await build({ configFile: resolve(repositoryRoot, 'vite.config.js') });
  await build({ configFile: resolve(repositoryRoot, 'vite.subtraction.config.js') });
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
