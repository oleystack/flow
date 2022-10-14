/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import { resolve } from 'path'

import eslintPlugin from 'vite-plugin-eslint'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [eslintPlugin(), dts()],
  test: {
    globals: true,
    include: ['__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}']
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src', 'index.ts'),
      formats: ['es', 'cjs'],
      fileName: (ext) => `index.${ext}.js`
      // for UMD name: 'GlobalName'
    },
    rollupOptions: {},
    target: 'esnext',
    sourcemap: true
  }
})
