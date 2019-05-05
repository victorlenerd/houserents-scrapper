require('dotenv').config();

const schedule = require("node-schedule");
const scrapper = require("./scrapper");
scrapper();
schedule.scheduleJob('00 23 30 * *', scrapper);