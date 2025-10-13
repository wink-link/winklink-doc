#build stage
FROM node:17-alpine as builder
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /winklink-doc
COPY . .
RUN npm i \
 && npm install -g vuepress \
 && npm install -g vue@2.6.10 \
 && npm install -g vuepress@1.9.9 \
 && npm install -g pm2 \
 && npm run docs:build

RUN npm i --production

#runtime stage
FROM node:17-alpine as runner
WORKDIR /winklink-doc

# Copy only the build artifacts
COPY --from=builder /winklink-doc/docs/.vuepress/dist ./docs/.vuepress/dist
COPY --from=builder /winklink-doc/index.js ./index.js
COPY --from=builder /winklink-doc/node_modules ./node_modules

EXPOSE 8085

CMD node index.js
