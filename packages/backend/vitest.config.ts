import { defineConfig } from 'vitest/config'
import path from 'node:path';
console.log('++++++++++++++++++++++++++++++++++++++')
console.log(path.resolve(__dirname, 'src'))
console.log('++++++++++++++++++++++++++++++++++++++')
export default defineConfig({
  resolve: {
    alias: {
      '@mongo': path.resolve(__dirname, 'src/db/mongo/'),
    },
  },
  test: {
    globals: true,
    mockReset: true,
    dangerouslyIgnoreUnhandledErrors: true,
    include: ['./test/ut/*.spec.ts', './test/integration/*.spec.ts'],
    /**
     * not to ESM ported packages
     */
    exclude: [
      'dist', '.idea', '.git', '.cache',
      '**/node_modules/**',
      // 'packages/eslint-plugin-wdio/**/*'
    ],
    environment: 'node',
    env: {
      WDIO_SKIP_DRIVER_SETUP: '1'
    },
    coverage: {
      enabled: false,
      provider: 'v8',
      exclude: [
        '**/__mocks__/**',
        '**/build/**',
        '**/cjs/*.ts',
        '**/*.test.ts',
        'packages/webdriver/src/bidi/handler.ts'
      ],
      watermarks: {
        statements: [85, 90],
        functions: [83, 88],
        branches: [85, 90],
        lines: [85, 90]
      }
    },
    // setupFiles: [
    //   '__mocks__/fetch.ts'
    // ],
    setupFiles: ['./test/config/config.ts'],
  }
})