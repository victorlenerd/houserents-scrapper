FROM node:11.9.0-alpine

# Create app directory
RUN mkdir -p /usr/src/scrapper
WORKDIR /usr/src/scrapper

# Install app dependencies
COPY package.json /usr/src/scrapper/
COPY src /usr/src/scrapper/src
COPY test /usr/src/scrapper/test

RUN npm install

ARG PORT
ARG DATA_SERVER
ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_PASSWORD
ARG API_KEY
ARG API_SECRET

ENV NODE_ENV development

RUN npm run test

ENV NODE_ENV production

EXPOSE 8080

CMD [ "npm", "run", "start:server:cron"]
