
# Base stage
FROM node:26.13.1-bookworm-slim AS base

WORKDIR /app


# 1. Install dependencies
FROM base AS deps

COPY package.json package-lock.json ./

RUN npm ci


# 2. Build application
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN mkdir -p public
RUN npm run build


# 3. Production runtime
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/public ./public

COPY --from=builder --chown=node:node /app/.next/standalone ./

COPY --from=builder --chown=node:node /app/.next/static ./.next/static

COPY --from=builder --chown=node:node /app/.next/server ./.next/server

RUN mkdir -p .next/cache && chown -R node:node .next

USER node

EXPOSE 3000

CMD ["node", "server.js"]
