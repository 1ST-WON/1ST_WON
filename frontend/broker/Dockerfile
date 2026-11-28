
# Base stage
FROM node:26.13.1-bookworm-slim AS base

WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm install -g pnpm@12.21.0


# 1. Install dependencies
FROM base AS deps

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY frontend/issuer/package.json ./frontend/issuer/package.json
COPY frontend/broker/package.json ./frontend/broker/package.json
COPY frontend/mts/package.json ./frontend/mts/package.json
COPY contracts/package.json ./contracts/package.json

RUN pnpm --filter "./frontend/broker..." install --frozen-lockfile --ignore-scripts


# 2. Build application
FROM deps AS builder

COPY frontend/broker ./frontend/broker

WORKDIR /app/frontend/broker

RUN mkdir -p public
RUN pnpm run build


# 3. Production runtime
FROM node:26.13.1-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/frontend/broker/.next/standalone ./

COPY --from=builder --chown=node:node /app/frontend/broker/public ./frontend/broker/public

COPY --from=builder --chown=node:node /app/frontend/broker/.next/static ./frontend/broker/.next/static

COPY --from=builder --chown=node:node /app/frontend/broker/.next/server ./frontend/broker/.next/server

RUN mkdir -p frontend/broker/.next/cache && chown -R node:node frontend/broker/.next

USER node

EXPOSE 3000

CMD ["node", "frontend/broker/server.js"]
