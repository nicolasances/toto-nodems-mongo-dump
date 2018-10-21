FROM mongo:4

RUN apt-get update
RUN apt-get install -y nodejs
RUN apt-get install -y git

RUN mkdir /app

COPY . /app/

CMD node /app/index.js
