FROM node:18-alpine as build-step

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
COPY ./src ./src
COPY ./public ./public
COPY craco.config.js ./

RUN yarn install
RUN yarn build

CMD ["npm", "start"]