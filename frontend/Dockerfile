FROM node:22-bookworm-slim

WORKDIR /app

ARG REPO_URL
ARG VCS_REF
ARG BUILD_DATE

ENV NODE_ENV=production
ENV PORT=3000

LABEL org.opencontainers.image.source=$REPO_URL
LABEL org.opencontainers.image.revision=$VCS_REF
LABEL org.opencontainers.image.created=$BUILD_DATE

COPY frontend/.output ./.output
COPY frontend/package.json ./package.json

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
