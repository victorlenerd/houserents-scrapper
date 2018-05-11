const { Generator, areaLocalities, unkownAreas } = require('../addressToLatLng');
const expect = require('chai').expect;

describe("Address To LatLng", function () {
	let address;
	let addressToLatLngGenerator; 

	beforeEach(function () {
		address = [
			'26, Bada, Mushin, Lagos'
		];

		addressToLatLngGenerator = Generator(address);
	});

	it('Return An Iterator', function () {
		const firstValue = addressToLatLngGenerator.next();
		expect(firstValue.done).to.be.equal(false);
	});

	it('Returns A Promise', function () {
		const firstValue = addressToLatLngGenerator.next();
		expect(firstValue.value).to.have.property('then');
	});

	it('Updates Areas Localities', function (done) {
		addressToLatLngGenerator.next().value.then(() => {
			done();
			expect(areaLocalities['Mushin'].localities[0].name).to.equal('bada');
		}).catch(function (err) {
			console.log(err);
		});
	});

	it('Updates Unknow Areas', function (done) {
	});
});
