FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY index.html ./
COPY tsconfig.json tsconfig.node.json ./
COPY postcss.config.js tailwind.config.js vite.config.ts ./
COPY src ./src
COPY public ./public

# Keep copied source files read-only for non-root runtime user.
RUN chmod -R a-w /app/src /app/public /app/index.html /app/tsconfig.json /app/tsconfig.node.json /app/postcss.config.js /app/tailwind.config.js /app/vite.config.ts

USER node

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]
