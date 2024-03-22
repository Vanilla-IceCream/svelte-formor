import { resolve } from 'path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import dts from 'vite-plugin-dts';

// import pkg from './package.json';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/svelte-formor.svelte.ts'),
      formats: ['es', 'cjs'],
    },
    // rollupOptions: {
    //   external: [...Object.keys(pkg.dependencies)],
    // },
  },
  plugins: [
    svelte({
      compilerOptions: {
        runes: true,
      },
    }),
    dts(),
  ],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
});
