import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    exclude: ['**/node_modules/**', '**/dist/**', '**/test/e2e/**'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['packages/**/*/src/**/*.ts'],
    },
  },
  projects: [
    {
      name: 'backend',
      root: 'packages/backend',
      testMatch: ['test/ut/**/*.spec.ts', 'test/integration/**/*.spec.ts'],
    },
    // {
    //   name: 'web',
    //   root: 'packages/web',
    //   testMatch: ['test/**/*.spec.ts'],
    // }
  ],
});