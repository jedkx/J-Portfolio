FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY index.html ./
COPY tsconfig.json tsconfig.node.json ./
COPY postcss.config.js tailwind.config.js vite.config.ts ./
COPY src ./src
COPY public ./public
COPY scripts ./scripts

# Keep source files read-only for non-root runtime user.
RUN chmod -R a-w /app/src /app/public /app/index.html /app/tsconfig.json /app/tsconfig.node.json /app/postcss.config.js /app/tailwind.config.js /app/vite.config.ts

# src/generated/ must be writable — fetch-cv.js writes cv-data.json there at runtime.
RUN chown -R node:node /app/src/generated && chmod u+w /app/src/generated /app/src/generated/cv-data.json

# Allow node user to write Vite's dependency cache
RUN mkdir -p /app/node_modules/.vite && chown node:node /app/node_modules/.vite

USER node

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host"]
