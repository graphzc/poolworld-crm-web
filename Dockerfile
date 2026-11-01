# --- Stage 1: Builder ---
FROM node:24-alpine AS builder

# Enable Corepack and pin the PNPM version used locally
RUN corepack enable && corepack prepare pnpm@12.8.1 --activate

WORKDIR /app

# Copy package manifests (+ pnpm hooks/settings that affect resolution)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpmfile.cjs ./

# Pre-fetch deps for better caching
RUN pnpm fetch

# Copy all source
COPY . .

ENV CI=true

# Install deps offline + strict versions
RUN pnpm install --frozen-lockfile --offline

# Set production env for build optimization
ENV NODE_ENV=production

# Build app
RUN pnpm build

# --- Stage 2: Runtime ---
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output
COPY --from=builder /app/dist ./

# Copy entrypoint
COPY scripts/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ARG APP_VERSION=unknown
ENV APP_VERSION=$APP_VERSION

ENTRYPOINT ["/entrypoint.sh"]

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
