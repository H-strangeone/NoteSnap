# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Install build tools for esbuild native binaries
RUN apk add --no-cache python3 make g++

# Copy and install dependencies (dev deps included for build)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build frontend + backend
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Expose for local reference (Railway ignores)
EXPOSE 5000

# Start backend
CMD ["node", "dist/index.js"]
