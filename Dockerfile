FROM node:14-alpine AS BUILD_IMAGE

RUN apk update && apk add curl bash && rm -rf /var/cache/apk/*

RUN curl -sfL https://install.goreleaser.com/github.com/tj/node-prune.sh | bash -s -- -b /usr/local/bin

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production

RUN /usr/local/bin/node-prune

FROM node:14-alpine

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/build ./build
COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /usr/src/app/defaults ./defaults
COPY --from=BUILD_IMAGE /usr/src/app/server ./server
COPY --from=BUILD_IMAGE /usr/src/app/public ./public

EXPOSE 9078

CMD [ "node", "./server/server.js" ]