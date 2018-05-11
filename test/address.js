const AddressToLatLng = require('../addressToLatLng');
const expect = require('chai').expect;

describe("Address To LatLng", function () {
	let address;
	let addressToLatLngGenerator; 

	beforeEach(function () {
		address = [
			'Mushin, Lagos'
		];

		addressToLatLngGenerator = AddressToLatLng(address);
	});

	it('Return An Iterator', function () {
		const firstValue = addressToLatLngGenerator.next();
		expect(firstValue.done).to.be.equal(false);
	});

	it('Returns A Promise', function () {
		const firstValue = addressToLatLngGenerator.next();
		expect(firstValue.value).to.have.property('then');
	});
});
