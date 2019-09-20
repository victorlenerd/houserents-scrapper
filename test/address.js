const { Generator, areaLocalities, unkownAreas } = require('../src/addressConverter/addressToLatLng');
const expect = require('chai').expect;

describe("Address To LatLng", function () {
	let address;
	let addressToLatLngGenerator;
	let unknowAddressToLatLngGenerator;

	beforeEach(function () {
		address = [
			'26, Bada, Mushin, Lagos'
		];

		unknowAddress = [
			'Badamosi Lagos'
		];

		addressToLatLngGenerator = Generator(address);
		unknownAddressToLatLngGenerator = Generator(unknowAddress);
	});

	it('Return An Iterator', function () {
		const firstValue = addressToLatLngGenerator.next();
		expect(firstValue.done).to.be.equal(false);
	});

	it('Returns A Promise', function () {
		const firstValue = addressToLatLngGenerator.next();
		expect(firstValue.value).to.have.property('then');
	});

	it.skip('Updates Areas Localities', function (done) {
		addressToLatLngGenerator.next().value.then(() => {
			done();
			expect(areaLocalities['Mushin'].localities[0].name).to.equal('bada');
		}).catch(function (err) {
			console.log(err);
		});
	});

	it.skip('Updates Unknow Areas', function (done) {
		unknownAddressToLatLngGenerator.next().value.then(() => {
			done();
			expect(unkownAreas['badamosi']).to.have.property('latLng');
		}).catch(function (err) {
			console.log(err);
		});
	});
});
