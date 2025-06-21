FROM node:lts AS build
WORKDIR /app
COPY sourcecode/ .
RUN npm ci
RUN npm run build

FROM node:lts-slim
RUN apt-get update -y
RUN apt-get install -y curl
COPY --from=build /app/dist /app
CMD ["node", "/app/server.js"]