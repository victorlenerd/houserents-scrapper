const googleMapsClient = require('@google/maps').createClient({
	key: "AIzaSyD5nu1Pr0a26gdkbGmwPJr76fDMVe1EBdk",
	Promise: Promise
});

module.exports = function (address) {
	return googleMapsClient.geocode({
			address: address,
			region: 'ng'
		})
		.asPromise()
		.then((response) => {
			return response.json.results;
		})
		.catch((err) => {
			return err;
		});
};
