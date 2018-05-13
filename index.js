const path = require('path');

const propertypro = require('./propertypro');
const nigeriapropertycentre = require('./nigeriapropertycenter');
const scrapperLauncher = require('./scrapperLauncher');
const { Generator } = require('./addressToLatLng');

Promise.all([
    scrapperLauncher(propertypro.loader, propertypro.scrapper),
    scrapperLauncher(nigeriapropertycentre.loader, nigeriapropertycentre.scrapper)
])
.then(([ propertyproData, nigeriapropertycentreData ]) =>{
    const allproperties = propertyproData.concat(nigeriapropertycentreData);
    const address = allproperties.map(() => releaseEvents.address);
    const latLngsGen = Generator(address);

    let currentAddress = 0;

    function latLngsAggregator() {
        const getLatLng = latLngsGen.next();
        if (getLatLng.done) return save(address);

        getLatLng.value.then((latLng) => {
            address[currentAddress].latLng = latLng;
            currentAddress++;
            latLngsAggregator()
        })
        .catch(() => {
            currentAddress++;
            latLngsAggregator();
        });
    }
});

function save(data) {
    fs.writeFile('./data.all.json', JSON.stringify(data), (err) => {
        if (err) console.error(err);
        console.log('Done!');
    });
}
