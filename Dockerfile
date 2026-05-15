# Stage 1: Build Application
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Stage 2: Production Execution Image
FROM node:22-alpine AS production

WORKDIR /app

# Set Node environment to production
ENV NODE_ENV=production

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copy build files from builder stage
COPY --from=builder /app/dist ./dist

# Create standard user for security
USER node

EXPOSE 4300

CMD ["node", "dist/main"]
