# syntax=docker/dockerfile:1

FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts

COPY . .

RUN bunx nuxt prepare && \
    bunx prisma generate && \
    NODE_OPTIONS="--max-old-space-size=4096" bun run build

FROM oven/bun:1-alpine AS runner

WORKDIR /app

RUN apk add --no-cache docker-cli wget

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

COPY --from=builder /app/.output ./.output

RUN mkdir -p /tmp/scribetex-jobs

EXPOSE 3000

CMD ["bun", "run", ".output/server/index.mjs"]
