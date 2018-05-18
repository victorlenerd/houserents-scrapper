const path = require('path');
const fs = require('fs');
const propertypro = require('./propertypro');
const nigeriapropertycentre = require('./nigeriapropertycenter');
const scrapperLauncher = require('./scrapperLauncher');
const { Generator } = require('./addressToLatLng');

Promise.all([
    scrapperLauncher(propertypro.loader, propertypro.scrapper),
    scrapperLauncher(nigeriapropertycentre.loader, nigeriapropertycentre.scrapper)
])
.then(([ propertyproData, nigeriapropertycentreData ]) => {
    const allproperties = propertyproData.concat(nigeriapropertycentreData);
    let addresses = allproperties.map((d) => d.address);
    const latLngsGen = Generator(addresses);

    let currentAddress = 0;

    function latLngsAggregator() {
        const getLatLng = latLngsGen.next();
        if (getLatLng.done) {
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

    latLngsAggregator();
});

function save(data) {
    fs.writeFile('./data.all.json', JSON.stringify(data), (err) => {
        if (err) console.error(err);
        console.log('Done!');
    });
}
