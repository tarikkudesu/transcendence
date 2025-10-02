FROM node

WORKDIR /app

COPY app/ .

RUN npm i --omit=dev

CMD [ "npm", "start" ]
