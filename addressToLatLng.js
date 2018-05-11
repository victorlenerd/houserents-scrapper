const Fuse = require('fuse.js');
const geocoder = require('./geocode');

const areas = require('./areas');
const areaLocalities = {};
const unkownAreas = {};

let searchOptions = {
    shouldSort: true,
    threshold: 0.2,
    includeScore: true,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name']
};

function search(list, item) {
    let fuse = new Fuse(list, searchOptions);
    let results = fuse.search(item);
    let topResults = results.filter((r) => r.score < 0.2);

    if (topResults[0]) return topResults[0].item; 
    return null;
}

function tokenize(address) {
    var splits = address.toLowerCase().split(/\W+|\d+/);
    return splits.filter(w => w.length > 1);
}

function localitySearch(localities) {
    let mainLocality = search(localities, locality);
    if (mainLocality) {
        return mainLocality.latLng;
    }

    return null;
}

function addressLatLng(address) {
    let commonWordsInAddess = /block|along|street|beside|behind|cresent|close|road/;
    let cleanAddress = address.toLowerCase().replace(commonWordsInAddess, "");
    let addressTokens = tokenize(cleanAddress);
    let addessParts = addressTokens.slice(0, addressTokens.length - 1);
    let mainArea = addessParts[addessParts.length - 1];
    let existingArea = search(areas, mainArea);

    if (existingArea && addessParts.length >= 2) {
        let locality = addessParts[addessParts.length - 2];
        let extistingLocality = areaLocalities[existingArea.name];

        if (extistingLocality && extistingLocality.localities) {
            let localities = extistingLocality.localities
            let mainLocality = localitySearch(localities, locality);

            if (mainLocality) {
                return Promise.resolve(mainLocality.latLng);
            } else  {
                return geocoder(address).then((results) => {
                    return { }
                });
            }
        }

        return geocoder(address).then((results) => {
            return { }
        });
    } else if (existingArea && addessParts.length <= 1) {
        return Promise.resolve(existingArea.latLng);
    } else {
        let unknownArea = search(unkownAreas, mainArea);

        if (unknownArea && addessParts >= 2) {
            let locality = addessParts[addessParts.length - 2];
            let mainLocality = localitySearch(areaLocalities[unknownArea.name].localities, locality);
        } else {
            return geocoder(address).then((results) => {
                return {  }
            });
        }
    }
}

module.exports = function* (addresses) {
    for (let i=0; i<addresses.length; i++) {
        yield addressLatLng(addresses[i]);
    }
}
