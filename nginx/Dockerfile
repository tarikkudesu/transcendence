FROM debian:stable-slim AS builder

RUN apt update -y && apt install openssl -y && \
    mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/pong.key \
    -out /etc/nginx/ssl/pong.crt \
    -subj "/C=MO/ST=KH/O=42/OU=42/CN=$PONG_HOST"

FROM nginx:alpine

RUN mkdir -p /debug

COPY --from=builder /etc/nginx/ssl /etc/nginx/ssl

ENTRYPOINT [ "nginx", "-g", "daemon off;" ]
