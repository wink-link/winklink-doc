FROM node:17-alpine as builder
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /docker/build
COPY . .
RUN npm i \
 && npm install -g vuepress \
 && npm install -g vue@2.6.10 \
 && npm install -g vuepress@1.9.9 \
 && npm install -g pm2 \
 && npm run docs:build
RUN npm i --production
EXPOSE 8085
CMD node index.js
