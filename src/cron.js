require('dotenv').config();

const schedule = require("node-schedule");
const scrapper = require("./scrapper");
scrapper();
schedule.scheduleJob('00 00 * * 0', scrapper);