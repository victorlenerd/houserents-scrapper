require('dotenv').config();
const http = require('http');

http.get(`${process.env.DATA_SERVER}/data`, () => {
    console.log('Done!');
});