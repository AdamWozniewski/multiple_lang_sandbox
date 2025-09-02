import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "test/**/*.test.ts"],
    reporters: "default",
    coverage: { reporter: ["text", "html"], reportsDirectory: "coverage" }
  },
  resolve: { conditions: ["node"] }
});