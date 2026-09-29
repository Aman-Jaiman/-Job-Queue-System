FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/

FROM base AS development

RUN npm ci

COPY --chown=node:node . .

USER node

EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM base AS build

RUN npm ci

COPY --chown=node:node client ./client
COPY --chown=node:node server ./server

RUN npm run build

FROM base AS production

ENV NODE_ENV=production

RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node server ./server
COPY --from=build --chown=node:node /app/client/dist ./client/dist

USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["npm", "start"]
