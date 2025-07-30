# FROM node:lts AS build
# WORKDIR /app
# COPY sourcecode/ .
# RUN npm install
# RUN npm run build

FROM nginx:stable
RUN mkdir -p /debug
COPY conf/nginx.conf /etc/nginx/nginx.conf
# COPY --from=build /app/dist /app
CMD ["nginx", "-g", "daemon off;"]