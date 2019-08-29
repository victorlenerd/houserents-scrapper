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

ENV NODE_ENV production

EXPOSE 8080

CMD [ "npm", "run", "start:server:cron"]