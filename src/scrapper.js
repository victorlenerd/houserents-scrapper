const path = require('path');
const http = require('http');
const fs = require('fs');
const propertypro = require('./sitescrappers/propertypro');
const nigeriapropertycentre = require('./sitescrappers/nigeriapropertycenter');
const scrapperLauncher = require('./scrapperLauncher');
const { Generator } = require('./addressConverter/addressToLatLng');

function save(data) {
    fs.writeFile(path.join(__dirname,`/data/data.json`), JSON.stringify(data), (err) => {
        if (err) throw err;
        console.log('Sending request to', `${process.env.DATA_SERVER}/data`);
        http.get(`${process.env.DATA_SERVER}/data`, (res) => {
            if (res.statusCode === 200) {
                console.log("Done! with status code : ", res.statusCode);
            } else {
                console.error("Failed! wit status code : ", res.statusCode);
            }
        });
    });
}

function start() {
    console.log('Scrapper: Started');

    Promise.all([
        scrapperLauncher(propertypro.loader, propertypro.scrapper)
        // scrapperLauncher(nigeriapropertycentre.loader, nigeriapropertycentre.scrapper)
    ])
    .then(([ propertyproData, nigeriapropertycentreData = []]) => {

        const allproperties = nigeriapropertycentreData.concat(propertyproData);

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
