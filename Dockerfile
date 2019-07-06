FROM node:11.9.0-alpine

# Create user
# RUN groupadd -r nodejs \
#     && useradd -m -r -g nodejs nodejs
# USER nodejs

# Create app directory
RUN mkdir -p /usr/src/scrapper
WORKDIR /usr/src/scrapper

# Install app dependencies
COPY package.json /usr/src/scrapper/
COPY src /usr/src/scrapper/src
RUN npm install

ENV NODE_ENV production

EXPOSE 8080

CMD [ "npm", "run", "start:server:cron"]