FROM node:lts-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm ci --production

CMD ["node", "src/index.js"]
