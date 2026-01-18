# ===============================
# Base
# ===============================
FROM node:20-alpine AS base

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src

# ===============================
# Development
# ===============================
FROM base AS development

RUN npm install -D ts-node-dev

EXPOSE 4001

CMD ["npm", "run", "dev"]

# ===============================
# Build (Production)
# ===============================
FROM base AS build

RUN npm run build

# ===============================
# Production
# ===============================
FROM node:20-alpine AS production

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --production

COPY --from=build /app/dist ./dist
COPY .env .env

EXPOSE 4001

CMD ["node", "dist/server.js"]
