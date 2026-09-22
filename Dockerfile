# ---- build stage: builds the VuePress 1 static site (never shipped/scanned) ----
# Base images are pinned by digest so that building the same commit yields the
# same OS package set wherever it is built (the dev handover scan then covers
# the image OP builds; see winklink-cicd/security/image-ledger/README.md).
# Bump the digests with each release, never remove them:
#   docker buildx imagetools inspect <image:tag> | grep Digest
FROM node:24-alpine3.23@sha256:9ec4a2e289874ed0d722e1772ec2de45d2801541db8612f3638b26f128c69ac2 AS builder
WORKDIR /winklink-doc
COPY package.json package-lock.json ./
RUN npm ci
COPY docs ./docs
RUN npm run docs:build

# ---- runtime stage: serves the static site via express ----
FROM node:24-alpine3.23@sha256:9ec4a2e289874ed0d722e1772ec2de45d2801541db8612f3638b26f128c69ac2 AS runner
WORKDIR /winklink-doc
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /winklink-doc/docs/.vuepress/dist ./docs/.vuepress/dist
COPY index.js ./index.js
USER node
EXPOSE 8085
CMD ["node", "index.js"]
