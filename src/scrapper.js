require('dotenv').config();

const http = require('http');
const AWS = require('aws-sdk');

const propertypro = require('./sitescrappers/propertypro');
const scrapperLauncher = require('./scrapperLauncher');
const { Generator } = require('./addressConverter/addressToLatLng');

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const BUCKET_REGION = process.env.BUCKET_REGION;
const BUCKET_ID = process.env.BUCKET_ID;

const credentials = new AWS.Credentials(API_KEY, API_SECRET);

const S3 = new AWS.S3({
    region: BUCKET_REGION,
    credentials
});

const upload = (Key, Body) => new Promise((resolve, reject) => {
    S3.upload({
        Bucket: BUCKET_ID,
        Key,
        Body: Body,
        ACL: 'public-read',
        ContentType: "application/json",
    }, (err, data) => {
        if (err) return reject(err);
        return resolve(data);
    });
});

function save(data) {
    upload(`data-${Date.now()}.json`, JSON.stringify(data))
    .then(() => {
        console.log('Uploaded data');
        http.get(`${process.env.DATA_SERVER}/data/${Date.now()}`, (res) => {
            if (res.statusCode === 200) {
                console.log("Done! with status code : ", res.statusCode);
            } else {
                console.error("Failed! wit status code : ", res.statusCode);
            }
        });
    }).catch((err) => {
        throw err
    });
}

function start() {
    console.log('Scrapper: Started');

    Promise.all([
        scrapperLauncher(propertypro.loader, propertypro.scrapper),])
    .then(([ propertyproData]) => {

        const allproperties = propertyproData;

        let addresses = allproperties.map((d) => d.address);
        const latLngsGen = Generator(addresses);

        let currentAddress = 0;

        function latLngsAggregator() {
            const getLatLng = latLngsGen.next();

            if (getLatLng.done) {
                console.log('Scrapper: Done');
                return save(allproperties);
            }

            getLatLng.value.then((latLng) => {
                console.log(`LatLng For ${allproperties[currentAddress].address} is:`, latLng)
                allproperties[currentAddress].lat = latLng.lat;
                allproperties[currentAddress].lng = latLng.lng;
                currentAddress++;
                latLngsAggregator()
            })
            .catch((err) => {
                currentAddress++;
                latLngsAggregator();
            });
        }

        console.log('Scrapper: Converting Addresses');
        latLngsAggregator();
    });
}

module.exports = start;
