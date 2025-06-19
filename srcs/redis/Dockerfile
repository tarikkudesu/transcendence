FROM debian:stable-slim
RUN apt-get update -y && apt-get install -y redis-server
COPY setup.sh /
RUN chmod +x /setup.sh
RUN /setup.sh
CMD [ "redis-server", "--protected-mode", "no" ]