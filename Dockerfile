# -----------------------------
# Base Image
# -----------------------------
FROM node:25-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV CI=1
# Install pnpm globally
RUN npm install -g pnpm

EXPOSE 3000


# -----------------------------
# Dependencies
# -----------------------------
FROM base AS deps
WORKDIR /app

# Copy lockfiles
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile


# -----------------------------
# Builder
# -----------------------------
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Build the application
RUN pnpm build


# -----------------------------
# Production Image (Standalone)
# -----------------------------
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nextjs -u 1001

# Copy only the standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

CMD ["node", "server.js"]


# -----------------------------
# Development Image
# -----------------------------
FROM base AS dev
WORKDIR /app

ENV NODE_ENV=development

# Install ALL dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

CMD ["pnpm", "dev"]
