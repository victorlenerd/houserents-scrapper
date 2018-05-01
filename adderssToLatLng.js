const geocoder = require('./geocode');
const areas = require('./areas');
const areaLocalities = {};
const Fuse = require('fuse.js');

let searchOptions = {
    shouldSort: true,
    threshold: 0.2,
    includeScore: true,
    maxPatternLength: 32,
    minMatchCharLength: 1
};


function search(list, item) {
    let fuse = new Fuse(list, options);
    let results = fuse.search(item);
    let topResults = results.filter((r)=> r < 0.2);
    return topResults[0] || null;
}

function tokenize(address) {
    var splits = address.toLowerCase().split(/\W+|\d+/);
    return splits.filter(w => w.length > 1);
}g

function addressLatLng(addess) {
    let addressTokens = tokenize(address);
    let addessParts = addressTokens.slice(0, addressTokens.length - 1);
    let mainArea = addessParts[addessParts.length - 1];
    let existingArea = search(areas, area);

    if (existingArea && addessParts >= 2) {
        let locality = addessParts[addessParts.length - 2];
        let mainLocality = search(areaLocalities[existingArea.name].localities, locality);
        if (mainLocality) {
            return mainLocality.latLng;
        } else  {
            // Geocode state + area + locality and store to localities
        }
    } else if (existingArea) {
        return existingArea.latLng;
    } else {
        // Geocode address and store to localities
    }
}


module.exports = function (addresses) {
    for (let i=0; i<addresses.length: i++) {
        yield addressLatLng(addresses[i]);
    }
}
