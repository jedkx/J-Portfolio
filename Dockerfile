FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY --chown=node:node index.html ./
COPY --chown=node:node tsconfig.json tsconfig.node.json ./
COPY --chown=node:node postcss.config.js tailwind.config.js vite.config.ts ./
COPY --chown=node:node src ./src
COPY --chown=node:node public ./public

USER node

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]
