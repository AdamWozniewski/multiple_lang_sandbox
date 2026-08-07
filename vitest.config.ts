import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: "node",
    exclude: ["**/node_modules/**", "**/dist/**", "**/test/e2e/**"],
    coverage: {
      reporter: ["text", "html"],
      include: ["packages/**/*/src/**/*.ts"],
    },
  },
  projects: [
    {
      name: "backend",
      root: "apps/backend",
      testMatch: ["test/ut/**/*.spec.ts", "test/integration/**/*.spec.ts"],
    },
    // {
    //   name: 'web',
    //   root: 'packages/web',
    //   testMatch: ['test/**/*.spec.ts'],
    // }
  ],
});
