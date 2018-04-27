const areas = require('./areas');

let searchOptions = {
    shouldSort: true,
    threshold: 0.8,
    maxPatternLength: 32,
    minMatchCharLength: 1
};

const fuse = require('fuse.js')(areas, searchOptions);

let addressSet = new Set(areas);

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCp3UKASbZkqvCnW3l_RLgM5Ik15JBKpPc',
    Promise: Promise
});

function tokenize(address) {
    var splits = address.toLowerCase().split(/\W+|\d+/);
    return splits.filter(w => w.length > 1);
}

function patLatLng(part) {
    let { 0: firstMatch } = fuse.search(part).reverse();
}

module.exports = function (addresses) {
    let addressTokens = tokenize(address);
    let addessParts = addressTokens.slice(0, addressTokens.length - 1);
}
