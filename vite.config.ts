import { resolve } from 'node:path';
import { defineConfig } from 'vite';

import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/svelte-formor.svelte.ts'),
      formats: ['es'],
      fileName: 'svelte-formor.svelte',
    },
    rollupOptions: {
      external: ['valibot'],
    },
    minify: false,
  },
  plugins: [dts()],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
});
