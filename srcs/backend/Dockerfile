FROM node:lts AS build
WORKDIR /app
COPY sourcecode/ .
RUN npm ci
RUN npm run build

FROM node:lts-slim
RUN apt-get update -y
RUN apt-get install -y curl
WORKDIR /app
COPY --from=build /app/dist .
COPY --from=build /app/package*.json .
RUN npm ci --omit=dev
CMD ["node", "/app/server.js"]