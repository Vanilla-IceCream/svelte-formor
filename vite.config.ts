import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, './src/index.ts'),
      formats: ['es'],
      fileName: '[name]',
    },
    rollupOptions: {
      external: ['valibot'],
      output: {
        preserveModules: true,
      },
    },
    minify: false,
  },
  plugins: [
    {
      apply: 'build',
      ...dts({ exclude: ['vite.config.ts', '**/__tests__/**'] }),
    },
    {
      apply: 'serve',
      ...svelte(),
    },
    {
      apply: 'serve',
      ...svelteTesting(),
    },
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
});
