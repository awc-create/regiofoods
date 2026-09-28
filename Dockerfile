# Regio Foods — Next.js standalone + Prisma (same layout as the Essentia image)

# ---- deps: install with devDependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable && apk add --no-cache libc6-compat
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production=false --ignore-scripts

# ---- builder: prisma generate + next build ----
FROM node:22-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat openssl
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# ---- runner ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache libc6-compat openssl \
 && addgroup -g 1001 -S nodejs \
 && adduser -S nextjs -u 1001

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Migrations + seed scripts run inside this container after deploy:
#   npx prisma migrate deploy && node scripts/seed-catalogue.mjs
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/src/data/products.json ./scripts/data/products.json
COPY --from=deps /app/node_modules/bcryptjs ./node_modules/bcryptjs
RUN npm i -g prisma@6.19.3

USER 1001
EXPOSE 3000
CMD ["node", "server.js"]
