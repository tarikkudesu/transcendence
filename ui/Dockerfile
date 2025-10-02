# FROM node:lts AS builder
# WORKDIR /app
# COPY app/package*.json ./
# RUN npm ci
# COPY app/ .
# EXPOSE 3000
# CMD ["npm", "run", "dev"]

FROM node:lts AS builder
WORKDIR /app
COPY app/package*.json ./
RUN npm ci
COPY app/ .
RUN npm run build


FROM node:lts
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]
