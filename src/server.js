require('dotenv').config();

const express = require("express");
const path = require("path");
const fs = require("fs")
const morgan = require("morgan");
const schedule = require("node-schedule");
const scrapper = require("./scrapper");

const app = express();
app.use(morgan());
app.use('/data', express.static(path.join(__dirname, 'data')))

scrapper();

schedule.scheduleJob('00 23 30 * *', scrapper);

app.listen(process.env.PORT);

console.log(`Running on ${process.env.PORT}`);