import { sentryEsbuildPlugin } from "@sentry/esbuild-plugin";
import { build } from "esbuild";

build({
  entryPoints: ["src/index.ts"], // Główny plik wejściowy
  bundle: true, // Połączenie plików
  platform: "node", // Środowisko Node.js
  format: "esm", // Generowanie ESM
  outdir: "./dist", // Katalog wyjściowy
  target: "esnext", // Generowanie nowoczesnego kodu
  external: ["mock-aws-s3", "aws-sdk", "nock"], // Pomijane pakiety
  loader: { ".html": "text" }, // Obsługa plików HTML
  logLevel: "info", // Informacje o logach
  sourcemap: true,
  plugins: [
    sentryEsbuildPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORGANIZATION,
      project: process.env.SENTRY_PROJECT,
    }),
  ],
}).catch(() => process.exit(1));
