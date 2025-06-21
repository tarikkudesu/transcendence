FROM node:lts AS build
WORKDIR /app
COPY sourcecode/ .
RUN npm ci
RUN npm run build

FROM node:lts-slim
COPY --from=build /app/dist /app
CMD ["node", "/app/server.js"]