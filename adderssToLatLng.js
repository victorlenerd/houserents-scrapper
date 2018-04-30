const areas = require('./areas');
const subAreas = {};

let searchOptions = {
    shouldSort: true,
    threshold: 0.2,
    maxPatternLength: 32,
    minMatchCharLength: 1
};

function tokenize(address) {
    var splits = address.toLowerCase().split(/\W+|\d+/);
    return splits.filter(w => w.length > 1);
}

function addressLatLng(addess) {
    let addressTokens = tokenize(address);
    let addessParts = addressTokens.slice(0, addressTokens.length - 1);
    let mainArea = addessParts[addressTokens.length - 1];

    existingMatch = areas.filter((area) => (area.match(mainArea) !== null));

    if (existingMatch > 0 && addessParts > 2) {
        if (addessParts[addressTokens.length - 2] in subAreas[existingMatch[0]].subs) {
            return subAreas[existingMatch[0]].subs.latLng;
        } else {

        }
    }
}


module.exports = function (addresses) {
    for (let i=0; i<addresses.length: i++) {
        yield addressLatLng(addresses[i]);
    }
}
