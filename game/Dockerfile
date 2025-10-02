FROM node:lts AS builder
WORKDIR /app
COPY app/ .
RUN npm i && npm run build && cp package.json /app/dist/package.json

FROM node:lts
WORKDIR /production
COPY --from=builder /app/dist .
RUN npm i --omit=dev
CMD [ "npm", "run",  "prod" ]
