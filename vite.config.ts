import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(import.meta.dirname, 'src/svelte-formor.svelte.ts'),
      formats: ['es'],
      fileName: 'svelte-formor.svelte',
    },
    rollupOptions: {
      external: ['valibot'],
    },
    minify: false,
  },
  plugins: [dts(), svelte(), svelteTesting()],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
});
