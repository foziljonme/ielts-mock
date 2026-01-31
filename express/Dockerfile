# Stage 1: Base image for development and production
FROM node:22-alpine AS base

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Stage 2: Development image
FROM base AS dev

# Set development-specific commands or environment
CMD ["yarn", "dev"]

# Stage 3: Production builder
FROM base AS builder

# Build the application
RUN yarn build

# Stage 4: Production image
FROM node:22-alpine AS production

WORKDIR /app

# Copy production dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./

# Expose the application port
EXPOSE 3001

# Run the application
CMD ["node", "dist/app.js"]
