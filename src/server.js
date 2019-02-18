require('dotenv').config();

const express = require("express");
const path = require("path");
const fs = require("fs")
const schedule = require("node-schedule");
const scrapper = require("./scrapper");

const app = express();
scrapper();

schedule.scheduleJob('00 23 30 * *', scrapper);

app.get('/data/:date', (req, res) => {
    const dataFilePath = path.resolve(__dirname, 'data', `data.${req.params.date}.json`);
    
    res.setHeader('Content-Type', 'application/json');

    if(fs.readFileSync(dataFilePath)) {
        res.status(200).sendFile(dataFilePath);
    };
});

app.listen(process.env.PORT);

console.log(`Running on ${process.env.PORT}`);