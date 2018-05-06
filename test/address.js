const AddressToLatLng = require('../addressToLatLng');

describe("Address To LatLng", function () {
	let address;

	beforeEach(function () {
		address = [
			'26, Bada, Street, Mushin, Lagos',
			'Ikoyi, Lagos'
		]
	});

	it('Return An Iterator', function () {
		const addressToLatLng = AddressToLatLng(address);
		const firstValue = addressToLatLng.next();
		expect(firstValue.done).to.be(false);
	});

});
