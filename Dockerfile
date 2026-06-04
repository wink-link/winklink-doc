# ---- build stage: builds the VuePress 1 static site (never shipped/scanned) ----
FROM node:24-alpine3.23 AS builder
WORKDIR /winklink-doc
COPY package.json package-lock.json ./
RUN npm ci
COPY docs ./docs
RUN npm run docs:build

# ---- runtime stage: serves the static site via express ----
FROM node:24-alpine3.23 AS runner
WORKDIR /winklink-doc
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /winklink-doc/docs/.vuepress/dist ./docs/.vuepress/dist
COPY index.js ./index.js
USER node
EXPOSE 8085
CMD ["node", "index.js"]
