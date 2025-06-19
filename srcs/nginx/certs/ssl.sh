#!/bin/bash

echo ${PWD}
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ${PWD}/srcs/nginx/certs/transcendance.key -out ${PWD}/srcs/nginx/certs/transcendance.crt \
  -subj "/C=US/ST=State/L=City/O=Organization/OU=Department/CN=transcendance" \
  -addext "subjectAltName = DNS:transcendance, DNS:transcendance"