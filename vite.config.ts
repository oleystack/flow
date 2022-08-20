/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import { resolve } from 'path'
import { peerDependencies, dependencies } from './package.json'
import react from '@vitejs/plugin-react'
import eslintPlugin from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic'
    }),
    eslintPlugin()
  ],
  test: {
    globals: true,
    environment: 'jsdom'
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src', 'index.ts'),
      formats: ['es', 'cjs'],
      fileName: (ext) => `index.${ext}.js`
      // for UMD name: 'GlobalName'
    },
    rollupOptions: {
      external: [...Object.keys(peerDependencies), ...Object.keys(dependencies)]
    },
    target: 'esnext',
    sourcemap: true
  }
})
