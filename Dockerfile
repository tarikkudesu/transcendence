FROM node:22-alpine
WORKDIR /app
COPY app/ .
RUN npm i
CMD [ "npm", "run",  "dev" ]
