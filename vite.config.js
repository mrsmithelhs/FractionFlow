import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.BASE_PATH || '/FractionFlow/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  test: {
    include: ['tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    passWithNoTests: true,
  },
});
