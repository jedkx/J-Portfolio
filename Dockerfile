FROM node:22-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY index.html ./
COPY tsconfig.json tsconfig.node.json ./
COPY postcss.config.js tailwind.config.js vite.config.ts ./
COPY src ./src
COPY public ./public
COPY scripts ./scripts
COPY tests ./tests

# Keep source files read-only for non-root runtime user.
RUN chmod -R a-w /app/src /app/public /app/index.html /app/tsconfig.json /app/tsconfig.node.json /app/postcss.config.js /app/tailwind.config.js /app/vite.config.ts

# Allow node user to write Vite's dependency cache
RUN mkdir -p /app/node_modules/.vite && chown node:node /app/node_modules/.vite

USER node

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]
