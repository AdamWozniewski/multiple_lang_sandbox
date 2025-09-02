import { config } from '@config';

const isBun = !!(process as any).versions?.bun;

if (isBun) {
  const Sentry = await import('@sentry/bun');

  Sentry.init({
    dsn: config.sentryDNS,
    sendDefaultPii: true,
    environment: config.env,
    tracesSampleRate: 1.0,
  });
} else {
  const Sentry = await import('@sentry/node');
  const { nodeProfilingIntegration } = await import('@sentry/profiling-node');

  Sentry.init({
    dsn: config.sentryDNS,
    sendDefaultPii: true,
    environment: config.env,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    integrations: [nodeProfilingIntegration()],
    registerEsmLoaderHooks: { onlyIncludeInstrumentedModules: true },
  });

  Sentry.profiler.startProfiler();
  Sentry.startSpan({ name: 'My First Transaction' }, () => {
    console.log('Profilowanie transakcji!');
  });
  Sentry.profiler.stopProfiler();
}
