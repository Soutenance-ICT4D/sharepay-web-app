# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund


FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ARG MERCHANT_SERVICE_BASE_URL
ARG NEXT_PUBLIC_MERCHANT_SERVICE_BASE_URL
ARG NEXT_PUBLIC_APP_URL
ENV MERCHANT_SERVICE_BASE_URL=$MERCHANT_SERVICE_BASE_URL
ENV NEXT_PUBLIC_MERCHANT_SERVICE_BASE_URL=$NEXT_PUBLIC_MERCHANT_SERVICE_BASE_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN npm run build


FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Next.js standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
