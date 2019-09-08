require('dotenv').config();

const express = require("express");
const path = require("path");
const morgan = require("morgan");

const app = express();
app.use(morgan('combined'));
app.use('/data', express.static(path.join(__dirname, 'data')));

app.listen(process.env.PORT);

console.log(`Running on ${process.env.PORT}`);
