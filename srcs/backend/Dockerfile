FROM node:lts AS build
WORKDIR /app
COPY sourcecode/ .
RUN npm ci
RUN npm run build

FROM node:lts-slim
WORKDIR /app
COPY --from=build /app/dist .
COPY --from=build /app/package*.json .
RUN npm ci --omit=dev
CMD ["node", "/app/server.js"]