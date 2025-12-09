# -----------------------------
# Base Image
# -----------------------------
FROM node:25-alpine AS base
RUN apk add --no-cache g++ make py3-pip libc6-compat
WORKDIR /app

# Copy lockfiles first for caching
COPY package*.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

EXPOSE 3000


# -----------------------------
# Builder
# -----------------------------
FROM base AS builder
WORKDIR /app

COPY . .

# Install dependencies (including devDependencies)
RUN pnpm install

# Build the application
RUN pnpm build


# -----------------------------
# Production Image
# -----------------------------
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
RUN pnpm install --prod

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nextjs -u 1001
USER nextjs

# Copy built assets
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

CMD ["pnpm", "start"]


# -----------------------------
# Development Image
# -----------------------------
FROM base AS dev
WORKDIR /app

ENV NODE_ENV=development

# Install ALL dependencies
RUN pnpm install

COPY . .

CMD ["pnpm", "dev"]
