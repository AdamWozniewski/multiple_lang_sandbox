import { ViteUserConfig } from 'vitest/config';

export const sharedConfig = {
  test: {
    globals: true,
    reporters: ["default", "blob"],
    outputFile: {
      blob: "coverage/blob/report.json",
    },
    setupFiles: './vitest.setup.ts',
    coverage: {
      provider: "istanbul" as const,
      enabled: true,
    },
  },
};
