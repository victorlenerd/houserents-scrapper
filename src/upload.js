require('dotenv').config();
const https = require('https');
const http = require('http');

if (process.env.NODE_ENV !== 'development') {
    https.get(`${process.env.DATA_SERVER}/data`, () => {
        console.log('Done!');
    });
} else {
    http.get(`${process.env.DATA_SERVER}/data`, () => {
        console.log('Done!');
    });
}