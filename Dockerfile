# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application (frontend + backend)
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Copy built artifacts from builder stage BEFORE installing deps
# This ensures we have exactly what was built
COPY --from=builder /app/dist ./dist

# Copy database migrations (needed for runtime migration execution)
COPY --from=builder /app/migrations ./migrations

# Install only production dependencies
# This comes after copying build artifacts to ensure deps match the build
RUN npm ci --omit=dev && \
    npm cache clean --force

# Copy runtime assets
COPY --from=builder /app/attached_assets ./attached_assets
COPY --from=builder /app/fallback-photos.json ./fallback-photos.json

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expose application port
EXPOSE 5000

# Health check using the /api/health endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the production server
CMD ["npm", "start"]
