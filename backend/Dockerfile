# ─────────────────────────────────────────────────────────────────
# PRISM Backend – Multi-stage Dockerfile
# Node.js 20 Alpine
# ─────────────────────────────────────────────────────────────────

# ── Stage 1: builder ─────────────────────────────────────────────
FROM node:20-alpine AS builder

# Install build tools needed for native modules
RUN apk add --no-cache python3 make g++ libc6-compat

WORKDIR /app

# Copy dependency manifests first (layer-cache optimisation)
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDeps needed for tsc)
RUN npm ci --ignore-scripts

# Copy source
COPY tsconfig*.json ./
COPY src ./src/

# Generate Prisma client
RUN npx prisma generate

# Compile TypeScript → dist/
RUN npm run build

# Prune dev dependencies to produce a clean node_modules for production
RUN npm ci --omit=dev --ignore-scripts

# ── Stage 2: production ──────────────────────────────────────────
FROM node:20-alpine AS production

# Security hardening
RUN apk add --no-cache dumb-init wget \
    && addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 --ingroup nodejs appuser

WORKDIR /app

# Copy built artefacts from builder
COPY --from=builder --chown=appuser:nodejs /app/dist          ./dist
COPY --from=builder --chown=appuser:nodejs /app/node_modules  ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/prisma        ./prisma
COPY --from=builder --chown=appuser:nodejs /app/package.json  ./package.json

# Create logs directory
RUN mkdir -p /app/logs && chown appuser:nodejs /app/logs

USER appuser

EXPOSE 4000

# dumb-init handles PID 1 signal forwarding correctly
# Run Prisma migrations then start the server
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
