# ─────────────────────────────────────────────────────────────────
# PRISM Worker – Multi-stage Dockerfile
# Node.js 20 Alpine  (BullMQ job processor)
# ─────────────────────────────────────────────────────────────────

# ── Stage 1: builder ─────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache python3 make g++ libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/

RUN npm ci --ignore-scripts

COPY tsconfig*.json ./
COPY src ./src/

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript
RUN npm run build

# Prune to prod-only deps
RUN npm ci --omit=dev --ignore-scripts

# ── Stage 2: production ──────────────────────────────────────────
FROM node:20-alpine AS production

RUN apk add --no-cache dumb-init \
    && addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 --ingroup nodejs workeruser

WORKDIR /app

COPY --from=builder --chown=workeruser:nodejs /app/dist          ./dist
COPY --from=builder --chown=workeruser:nodejs /app/node_modules  ./node_modules
COPY --from=builder --chown=workeruser:nodejs /app/prisma        ./prisma
COPY --from=builder --chown=workeruser:nodejs /app/package.json  ./package.json

RUN mkdir -p /app/logs && chown workeruser:nodejs /app/logs

USER workeruser

# Workers don't expose a public port, but keeping one makes health-checks easier
EXPOSE 4001

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/worker.js"]
