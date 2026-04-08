# 1) deps
FROM oven/bun:1.1.24-alpine AS deps
WORKDIR /app
RUN --mount=type=cache,target=/root/.bun bun --version

# 1 manifest wystarczy
COPY package.json ./

# doinstaluj jq
RUN apk add --no-cache jq

# wytnij problematyczne paczki
RUN jq 'del(.dependencies.newrelic, .dependencies["@newrelic/native-metrics"], .optionalDependencies.newrelic, .optionalDependencies["@newrelic/native-metrics"])' package.json > pkg.json \
 && mv pkg.json package.json

# instalacja (bez postinstalli i optional – dodatkowe zabezpieczenie)
ENV npm_config_ignore_scripts=true
ENV npm_config_optional=false
RUN --mount=type=cache,target=/root/.bun bun install

# 2) build
# 2) build
FROM oven/bun:1.1.24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 👇 to jest wymagane w ETAPIE BUILD
RUN apk add --no-cache libstdc++

# (opcjonalnie) wyłącz watcher po stronie Tailwinda
ENV TAILWIND_DISABLE_WATCHER=1

RUN bun run build

# 3) runtime
FROM oven/bun:1.1.24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN apk add --no-cache libstdc++
USER bun

COPY --from=build /app/dist/index.js ./dist/index.js
COPY --from=build /app/dist/public ./dist/public

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=2s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT:-3000}/health || exit 1

CMD ["bun","--env-file=.env.production","src/index.ts"]
