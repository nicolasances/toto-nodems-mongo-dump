FROM node:8.9.4-alpine

RUN apk update
RUN apk upgrade --update
RUN apk add mongodb-tools

RUN mkdir /app

COPY . /app/

CMD node /app/index.js
