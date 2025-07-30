FROM node:lts
COPY setup.sh .
RUN apt-get update -y
RUN apt-get install -y curl
WORKDIR /app
CMD ["/setup.sh"]