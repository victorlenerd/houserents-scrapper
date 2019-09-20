const fetch = require('node-fetch');
const stringToDate = require("../utils/stringToDate");

const no_pages = process.env.NODE_ENV === 'development' ? 1 : 1485;
const url = 'https://www.propertypro.ng/property-for-rent/lagos/flat-apartment?page=';

function* LoadPageGen() {
    for (let i=0; i<no_pages; i++) {
        yield fetch(`${url}${i}`);
    }
}

function scrapper($) {
    const data = [];

    $('.property-bg').each(( i, e ) => {
        let date = $(e).find('p.prop-date').text().replace("Updated", "").replace("Added", "").split(",")[0];

        data.push({
            source: 'property_pro',
            url: $(e).find('.pro-main-cont > a').attr('href'),
            address: $(e).find('.pro-location').text().trim(),
            description: $(e).find('.pro-description').text().trim(),
            price: Number($(e).find('span[itemprop=price]').attr('content')),
            no_bed: Number($($(e).find('.prop-aminities > span')[0]).text().split(' ')[0]),
            no_bath: Number($($(e).find('.prop-aminities > span')[1]).text().split(' ')[0]),
            no_toilets: Number($($(e).find('.prop-aminities > span')[2]).text().split(' ')[0]),
            date_added: stringToDate(date)
        });
    });

    return data;
}

const loader = LoadPageGen();

module.exports = {
    scrapper,
    loader
}
