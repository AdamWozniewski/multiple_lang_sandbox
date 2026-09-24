import swc from "unplugin-swc";

export const sharedConfig = {
  test: {
    globals: true,
    reporters: ["default", "blob"],
    outputFile: {
      blob: "coverage/blob/report.json",
    },
    setupFiles: './vitest.setup.ts',
    plugins: [swc.vite()],
    coverage: {
      provider: "istanbul" as const,
      enabled: true,
    },
  },
};
