FROM node:20-alpine AS base
WORKDIR /app
RUN npm config set fetch-retry-maxtimeout 120000 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retries 5 && \
    (npm install -g pnpm@latest || npm install -g pnpm@latest --registry=https://registry.npmmirror.com)

# ---- Dependencies ----
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/
RUN pnpm install --frozen-lockfile --filter @weecommerce/api... || \
    (pnpm config set registry https://registry.npmmirror.com && pnpm install --frozen-lockfile --filter @weecommerce/api...)

# ---- Builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY . .
ENV NODE_ENV=production
RUN pnpm --filter @weecommerce/api build

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache wget
RUN addgroup -g 1001 -S nodejs && adduser -S hono -u 1001

COPY --from=builder /app/apps/api/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json ./
COPY --from=builder /app/apps/api/db ./db

USER hono

EXPOSE 4000
ENV PORT=4000

HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=20s \
  CMD wget --quiet --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["node", "dist/server.js"]
