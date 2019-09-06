const Fuse = require('fuse.js');
const geocoder = require('./geocode');
const redis = require('redis');

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_PORT = process.env.REDIS_PORT;

const redisClient = redis.createClient({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
});

const areas = require('./areas');
const areaLocalities = {};
const unknownAreas = {};

let searchOptions = {
    shouldSort: true,
    threshold: 0.2,
    includeScore: true,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ['name']
};

const getCache = (state = 'lagos', area, locality = "0") => new Promise((resolve, reject) => {
    redisClient.hgetall(`${state}:${area}:${locality}`, (err, data) => {
        if (err || !data) {
            console.log('not in cache', err, data);
            return reject(null);
        } else {
            console.log('cache::', data);
            resolve(data);
        }
    });
});

const setCache = (state = 'lagos', area, locality = "0", data) => redisClient.hmset(`${state}:${area}:${locality}`, data);

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

function localitySearch(localities, locality) {
    let mainLocality = search(localities, locality);
    if (mainLocality) {
        return mainLocality.latLng;
    }

    return null;
}

function addressLatLng(address) {
    let commonWordsInAddress = /block|along|street|beside|behind|cresent|close|road|estate/;
    let cleanAddress = address.toLowerCase().replace(commonWordsInAddress, "");
    let addressTokens = tokenize(cleanAddress);
    let addressParts = addressTokens.slice(0, addressTokens.length - 1);
    let mainArea = addressParts[addressParts.length - 1];
    let existingArea = search(areas, mainArea);

    if (existingArea && addressParts.length >= 2) {
        let locality = addressParts[addressParts.length - 2];
        let existingLocality = areaLocalities[existingArea.name];

        if (existingLocality && existingLocality.localities) {
            let localities = existingLocality.localities;
            let mainLocality = localitySearch(localities, locality);

            if (mainLocality) {
                return Promise.resolve(mainLocality);
            } else  {
                return getCache(undefined ,existingArea.name, locality)
                    .then((data) => data)
                    .catch(() => {
                        return geocoder(`${locality}, ${existingArea.name}, Lagos, Nigeria`)
                            .then(([ { address_components, geometry: {location: {lat, lng}} } ]) => {
                                areaLocalities[existingArea.name].localities.push({ name: locality, latLng: { lat, lng } })
                                setCache( undefined , existingArea.name, locality,{lat, lng });
                                return { lat, lng };
                            }).catch(function (err) {
                                throw err;
                            });
                    });
            }
        }

        return getCache(undefined ,existingArea.name, locality)
            .then((data) => data)
            .catch(() => {
                return geocoder(`${locality}, ${existingArea.name}, Lagos, Nigeria`)
                    .then(([ { address_components, geometry: { location: {lat, lng}} } ]) => {
                        areaLocalities[existingArea.name] = { latLng: {}, localities: [] };
                        areaLocalities[existingArea.name].latLng = { lat, lng };
                        areaLocalities[existingArea.name].localities.push({ name: locality, latLng: { lat, lng } });
                        setCache( undefined , existingArea.name, locality,{lat, lng });
                        return { lat, lng };
                    }).catch(function (err) {
                        throw err;
                    });
            });
    } else if (existingArea && addressParts.length <= 1) {
        return Promise.resolve(existingArea.latLng);
    } else {
        let unknownArea = search(unknownAreas, mainArea);

        if (unknownArea && addressParts >= 2) {
            let locality = addressParts[addressParts.length - 2];
            let existingLocality = areaLocalities[unknownArea.name];

            if (existingLocality && existingLocality.localities) {
                let mainLocality = localitySearch(existingLocality.localities, locality);

                if (mainLocality) {
                    return Promise.resolve(mainLocality.latLng);
                } else  {
                    return getCache(undefined , unknownArea.name, locality)
                        .then((data) => data)
                        .catch(() => {
                            return geocoder(`${locality}, ${unknownArea.name}, Lagos, Nigeria`)
                                .then(([ { address_components, geometry: {location: {lat, lng}} } ]) => {
                                    areaLocalities[unknownArea.name].localities.push({ name: locality, latLng: { lat, lng } })
                                    setCache( undefined , unknownArea.name, locality,{lat, lng });
                                    return { lat, lng };
                                }).catch(function (err) {
                                    throw err;
                                });
                        });

                }
            }

            return getCache(undefined , unknownArea.name, locality)
                    .then((data) => data)
                    .catch(() => {
                        return geocoder(`${locality}, ${unknownArea.name}, Lagos, Nigeria`)
                            .then(([ { address_components, geometry: {location: {lat, lng}} } ]) => {
                                areaLocalities[unknownArea.name] = { localities: [] };
                                areaLocalities[unknownArea.name].localities.push({ name: locality, latLng: { lat, lng } });
                                setCache( undefined , unknownArea.name, locality,{ lat, lng });
                                return { lat, lng };
                            }).catch(function (err) {
                                throw err;
                            });
                    });
        } else {
            return getCache(undefined , mainArea)
                .then((data) => data)
                .catch(() => {
                    return geocoder(`${mainArea}, Lagos, Nigeria`)
                        .then(([ { address_components, geometry: {location: {lat, lng}} } ]) => {
                            unknownAreas[mainArea] = {
                                name: mainArea,
                                latLng: {
                                    lat,
                                    lng
                                }
                            };

                            areaLocalities[mainArea] = {
                                name: mainArea,
                                localities: []
                            };

                            setCache( undefined , mainArea, undefined,{ lat, lng });
                            return { lat, lng, area: mainArea, locality: 0 };
                        }).catch(function (err) {
                            console.error(err);
                            throw err;
                        });
                });
        }
    }
}

module.exports = {
    areaLocalities,
    unknownAreas,
    Generator: function* (addresses) {
        for (let i=0; i<addresses.length; i++) {
            yield addressLatLng(addresses[i]);
        }
    }
};
