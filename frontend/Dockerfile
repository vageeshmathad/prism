# ─────────────────────────────────────────────────────────────────
# PRISM Frontend – Multi-stage Dockerfile
# Next.js 14 with standalone output
# ─────────────────────────────────────────────────────────────────

# ── Stage 1: deps ────────────────────────────────────────────────
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# ── Stage 2: builder ─────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy deps from previous stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source
COPY . .

# Disable Next.js telemetry during build
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js app (outputs standalone + static files)
RUN npm run build

# ── Stage 3: runner ──────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache wget \
    && addgroup --system --gid 1001 nodejs \
    && adduser  --system --uid 1001 --ingroup nodejs nextjs

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy standalone server and static assets produced by the builder
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public           ./public

USER nextjs

EXPOSE 3000

# next.config.js must have output: 'standalone' for this to work
CMD ["node", "server.js"]
