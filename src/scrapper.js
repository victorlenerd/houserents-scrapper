const path = require('path');
const fs = require('fs');
const propertypro = require('./sitescrappers/propertypro');
const nigeriapropertycentre = require('./sitescrappers/nigeriapropertycenter');
const scrapperLauncher = require('./scrapperLauncher');
const { Generator } = require('./addressConverter/addressToLatLng');

function save(data) {
    fs.writeFile(path.resolve(__dirname,`data.${new Date().toLocaleDateString().replace('/', '_')}.json`), JSON.stringify(data), (err) => {
        if (err) console.error(err);
        console.log('Done!');
    });
}

function start() {
    console.log('Scrapper: Started');

    Promise.all([
        scrapperLauncher(propertypro.loader, propertypro.scrapper),
        scrapperLauncher(nigeriapropertycentre.loader, nigeriapropertycentre.scrapper)
    ])
    .then(([ propertyproData, nigeriapropertycentreData ]) => {

        const allproperties = nigeriapropertycentreData.concat(propertyproData);

        let addresses = allproperties.map((d) => d.address);
        const latLngsGen = Generator(addresses);

        let currentAddress = 0;

        function latLngsAggregator() {
            const getLatLng = latLngsGen.next();

            if (getLatLng.done) {
                console.log('Scrapper: Converting Addresses');
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
                console.error('err', err);
                currentAddress++;
                latLngsAggregator();
            });
        }

        console.log('Scrapper: Converting Addresses');
        latLngsAggregator();
    });   
}

module.exports = start;