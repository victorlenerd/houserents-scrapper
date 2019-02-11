const express = require("express");
const path = require("path");
const fs = require("fs")
const schedule = require("node-schedule");
const scrapper = require("./scrapper");

const app = express();

const PORT = 8080;
const HOST = '0.0.0.0';

scrapper();

schedule.scheduleJob('00 23 30 * *', scrapper);

app.get('/data', (req, res) => {
    fs.readFileSync(path.resolve(__dirname, "data.all.json"), (err, data) => {
        if (err) throw err;
        res.send(data);
    });
});

app.listen(PORT, HOST);

console.log(`Running on http://${HOST}:${PORT}`);