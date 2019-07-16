require('dotenv').config();
const https = require('https');

https.get(`${process.env.DATA_SERVER}/data`, () => {
    console.log('Done!');
});