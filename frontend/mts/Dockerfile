
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

RUN pnpm --filter "./frontend/mts..." install --frozen-lockfile --ignore-scripts


# 2. Build application
FROM deps AS builder

COPY frontend/mts ./frontend/mts

WORKDIR /app/frontend/mts

RUN mkdir -p public
RUN pnpm run build


# 3. Production runtime
FROM node:26.13.1-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/frontend/mts/.next/standalone ./

COPY --from=builder --chown=node:node /app/frontend/mts/public ./frontend/mts/public

COPY --from=builder --chown=node:node /app/frontend/mts/.next/static ./frontend/mts/.next/static

COPY --from=builder --chown=node:node /app/frontend/mts/.next/server ./frontend/mts/.next/server

RUN mkdir -p frontend/mts/.next/cache && chown -R node:node frontend/mts/.next

USER node

EXPOSE 3000

CMD ["node", "frontend/mts/server.js"]
