import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const isDemo = process.env.VITE_DEMO === 'true';

export default defineConfig(isDemo
  ? {
      plugins: [react()],
      root: resolve(__dirname, 'demo'),
      resolve: { alias: { '../src': resolve(__dirname, 'src') } },
    }
  : {
      plugins: [
        react(),
        dts({ insertTypesEntry: true, include: ['src'] }),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'ReactFormBuilder',
          fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
          formats: ['es', 'cjs'],
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: {
            globals: { react: 'React', 'react-dom': 'ReactDOM' },
            assetFileNames: '[name][extname]',
          },
        },
        minify: false,
        sourcemap: true,
      },
    });
