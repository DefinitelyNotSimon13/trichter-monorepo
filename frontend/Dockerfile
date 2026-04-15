FROM oven/bun:1-slim

WORKDIR /app

ARG REPO_URL
ARG VCS_REF
ARG BUILD_DATE

ENV NODE_ENV=production
ENV PORT=3000

LABEL org.opencontainers.image.source=$REPO_URL
LABEL org.opencontainers.image.revision=$VCS_REF
LABEL org.opencontainers.image.created=$BUILD_DATE

COPY --chown=bun:bun frontend/.output ./.output
COPY --chown=bun:bun frontend/package.json ./package.json

USER bun

EXPOSE 3000

CMD ["bun", ".output/server/index.mjs"]
