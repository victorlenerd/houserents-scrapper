const googleMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyCp3UKASbZkqvCnW3l_RLgM5Ik15JBKpPc',
	Promise: Promise
});

module.exports = function (address) {
	googleMapsClient.geocode({
			address: address,
            region: '.ng'
		})
		.asPromise()
		.then((response) => {
			console.log(response.json.results);
            return response.json.results;
		})
		.catch((err) => {
			console.log(err);
            return err;
		});
}
