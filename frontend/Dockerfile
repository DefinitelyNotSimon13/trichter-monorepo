FROM oven/bun:1 AS base
WORKDIR /app

FROM base AS deps
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
COPY .env .env

ARG VITE_BUILD_ID
ENV VITE_BUILD_ID=$VITE_BUILD_ID
ENV NODE_ENV=production

RUN bun run build

FROM oven/bun:1-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

USER bun

COPY --from=builder --chown=bun:bun /app/.output ./.output
COPY --from=builder --chown=bun:bun /app/package.json ./package.json

EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]

LABEL org.opencontainers.image.source=https://github.com/DefinitelyNotSimon13/trichter-monorepo
