import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.BASE_PATH || '/FractionFlow/',
  server: {
    port: 5199,
    strictPort: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    include: ['tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    passWithNoTests: true,
  },
});
