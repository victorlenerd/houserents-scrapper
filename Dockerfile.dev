FROM node:11.9.0-alpine

# Create app directory
RUN mkdir -p /usr/src/scrapper
WORKDIR /usr/src/scrapper

# Install app dependencies
COPY package.json /usr/src/scrapper/
COPY src /usr/src/scrapper/src
RUN npm install

ARG PORT
ARG DATA_SERVER
ARG REDIS_HOST
ARG REDIS_PORT
ARG REDIS_PASSWORD

ENV NODE_ENV development

EXPOSE 8080

CMD [ "npm", "run", "start:server:cron"]
