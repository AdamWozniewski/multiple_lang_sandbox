import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    include: [
      'test/ut/**/*.spec.ts',
      'test/integration/**/*.spec.ts'
    ],
    exclude: [
      'test/e2e/**',
      'node_modules'
    ],
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/**/*.ts']
    }
  },
});