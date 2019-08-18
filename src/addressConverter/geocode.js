const googleMapsClient = require('@google/maps').createClient({
	key: process.env.MAP_API_KEY,
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
}
