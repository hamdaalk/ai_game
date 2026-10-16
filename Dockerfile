FROM node:20-alpine

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY server.js survey-says.html ./

ENV NODE_ENV=production
EXPOSE 10000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:${PORT:-10000}/health || exit 1

CMD ["node", "server.js"]
