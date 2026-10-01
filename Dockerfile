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
# Public URLs are baked into the client bundle at build time (passed by the CI/CD build-args)
ARG NEXT_PUBLIC_SITE_URL=https://regiofoods.in
ARG NEXT_PUBLIC_ADMIN_URL=https://admin.regiofoods.in
ARG SITE_URL=https://regiofoods.in
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_ADMIN_URL=$NEXT_PUBLIC_ADMIN_URL \
    SITE_URL=$SITE_URL
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
# Writable image-optimisation cache for the non-root user
RUN mkdir -p .next/cache && chown -R 1001:1001 .next/cache
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# The deploy pipeline runs `prisma migrate deploy` then `prisma db seed`
# (package.json "prisma.seed" -> scripts/seed.mjs) inside this container.
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/src/data/products.json ./scripts/data/products.json
COPY --from=deps /app/node_modules/bcryptjs ./node_modules/bcryptjs
RUN npm i -g prisma@6.19.3

USER 1001
EXPOSE 3000
CMD ["node", "server.js"]
