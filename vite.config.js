import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'MiniVue',
      formats: ['umd', 'es'],
      fileName: (format) => `my-mini-vue.${format}.js`,
    },
    rollupOptions: {
      output: {
        exports: 'named',
      },
    },
  },
  server: {
    open: '/',
  },
});
