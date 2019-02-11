FROM node:11.9.0-alpine

WORKDIR /usr/rentalscrapper

COPY package.json .
RUN npm install --quiet

COPY . .
EXPOSE 8080
CMD [ "npm", "start" ]