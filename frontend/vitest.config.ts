import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    isolate: true,
    pool: 'forks',
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 5000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})