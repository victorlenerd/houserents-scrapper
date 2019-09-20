require('dotenv').config();

const http = require('http');
const sinon = require('sinon');
const expect = require('chai').expect;
const scrapper = require('../src/scrapper');

describe("Scrapper", function () {

    this.timeout(15000);

    it('Sends http request when scrapping in done', (done) => {
        const httpRequest = sinon.stub(http, 'get');
        scrapper();
        setTimeout(() => {
            console.log(httpRequest);
            done();
            expect(httpRequest.calledOnce).to.equal(true);
        }, 10000);
    });

});
