const cheerio = require('cheerio');
const fetch = require('node-fetch');

// 499

const no_pages = 499;
const url = 'https://www.propertypro.ng/property-for-rent/lagos/flat-apartment?page=';

function* LoadPageGen() {
    for (let i=0; i<no_pages; i++) {
        yield fetch(`${url}${i}`);
    }
}

function scrapper($) {
    const data = [];

    $('.property-bg').each(( i, e ) => {
        data.push({
            address: $(e).find('.pro-location').text()),
            price: Number($(e).find('span[itemprop=price]').attr('content')),
            no_bed: Number($($(e).find('.prop-aminities > span')[0]).text().split(' ')[0]),
            no_bath: Number($($(e).find('.prop-aminities > span')[1]).text().split(' ')[0]),
            no_toilets: Number($($(e).find('.prop-aminities > span')[2]).text().split(' ')[0]),
        });
    });

    return data;
}

const loader = LoadPageGen();

module.exports = {
    scrapper,
    loader
}