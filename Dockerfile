FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

FROM base AS development

RUN npm ci

COPY --chown=node:node . .

USER node

EXPOSE 3000

CMD ["npm", "run", "dev"]

FROM base AS production

ENV NODE_ENV=production

RUN npm ci --omit=dev && npm cache clean --force

COPY --chown=node:node . .

USER node

EXPOSE 3000

CMD ["npm", "start"]
