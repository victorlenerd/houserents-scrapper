const areas = require('./areas');

const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCp3UKASbZkqvCnW3l_RLgM5Ik15JBKpPc',
    Promise: Promise
});

function tokenize(address) {
    var splits = address.toLowerCase().split(/\W+|\d+/);
    return splits.filter(w => w.length > 1);
}

module.exports = function (addresses) {
    let addressTokens = tokenize(address);
    let addessParts = addressTokens.slice(0, addressTokens.length - 1);
}