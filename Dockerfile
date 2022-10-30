FROM node

WORKDIR /work
COPY . .

ENTRYPOINT npm install && node server.js