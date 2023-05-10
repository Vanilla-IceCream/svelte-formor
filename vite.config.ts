import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/svelte-formor.ts'),
      formats: ['es', 'cjs'],
    },
  },
  plugins: [dts()],
  test: {
    environment: 'happy-dom',
  },
});
