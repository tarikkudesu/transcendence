FROM node:22.15-slim
WORKDIR /app
COPY app/ .
RUN npm i
CMD [ "npm", "run",  "dev" ]
