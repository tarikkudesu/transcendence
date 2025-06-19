FROM node:lts
WORKDIR /app
COPY sourcecode/ /app
RUN npm install
RUN npm run build
CMD ["node", "index.js"]