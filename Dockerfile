# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install build tools for esbuild native binaries
RUN apk add --no-cache python3 make g++

# Copy and install dependencies (include dev deps for build)
COPY package*.json ./
RUN npm install

# Install cross-env globally (so it works in all scripts)
RUN npm install -g cross-env

# Copy source code
COPY . .

# Build frontend + backend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production && npm install -g cross-env

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Expose (just for local reference — Railway ignores this)
EXPOSE 5000

# Start backend using cross-env for portability
CMD ["cross-env", "NODE_ENV=production", "node", "dist/index.js"]
