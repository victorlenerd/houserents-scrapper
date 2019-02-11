const googleMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyCp3UKASbZkqvCnW3l_RLgM5Ik15JBKpPc',
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
