# Stage 1: Development
FROM node:22 AS development

WORKDIR /app

# Install ffmpeg binary for Debian/Ubuntu base
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./

RUN ls -la

RUN yarn install --frozen-lockfile

COPY . .

EXPOSE 8080

CMD ["yarn", "start:dev"]

# Stage 2: Build
FROM development AS build

RUN yarn build

# Stage 3: Production
FROM node:22-alpine AS production

WORKDIR /app

# Install ffmpeg binary for Debian/Ubuntu base
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

# Generate Prisma Client for the production environment
RUN yarn prisma generate

CMD ["node", "dist/main"]
