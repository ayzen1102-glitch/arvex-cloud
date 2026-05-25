FROM node:20-alpine

WORKDIR /app

# Install LXD and system dependencies
RUN apk add --no-cache \
    lxd \
    bash \
    curl \
    ca-certificates

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src ./src

# Build TypeScript
RUN npm run build

# Create non-root user
RUN addgroup -S arvex && adduser -S arvex -G arvex
USER arvex

# Expose port
EXPOSE 7777

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:7777/health || exit 1

# Start application
CMD ["npm", "start"]
