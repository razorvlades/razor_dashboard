FROM node:14

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 9078

CMD [ "node", "./server/server.js" ]