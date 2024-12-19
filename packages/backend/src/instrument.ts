import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import { config } from "./config.js";

Sentry.init({
  dsn: config.sentryApiKey,
  integrations: [nodeProfilingIntegration()],
  registerEsmLoaderHooks: {
    onlyIncludeInstrumentedModules: true,
  },
  // Tracing
  environment: config.env,
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});
// Manually call startProfiler and stopProfiler
// to profile the code in between
Sentry.profiler.startProfiler();

// Starts a transaction that will also be profiled
Sentry.startSpan(
  {
    name: "My First Transaction",
  },
  () => {
    console.log("Profilowanie transakcji!");
  },
);

// Calls to stopProfiling are optional - if you don't stop the profiler, it will keep profiling
// your application until the process exits or stopProfiling is called.
Sentry.profiler.stopProfiler();
