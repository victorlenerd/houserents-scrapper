const cheerio = require('cheerio');
const fetch = require('node-fetch');

let currentPage = 0;
const no_pages = 7480;

// 7480

function* LoadPageGen() {
    for (let i=0; i<no_pages; i += 20) {
        yield fetch(`https://www.nigeriapropertycentre.com/for-rent/flats-apartments/lagos/results?limitstart=${i}&q=lagos+for-rent+flats-apartments`);
    }
}

function scrapper($) {
    const data = [];

    $('.property').each(( i, e ) => {
        data.push({
            address: $(e).find('address > strong').text().trim(),
            price: Number($(e).find('span[itemprop=price]').attr('content')),
            no_bed: Number($($(e).find('.aux-info > li[itemprop=additionalProperty] > span[itemprop=value]')[0]).text().split(' ')[0]),
            no_bath: Number($($(e).find('.aux-info > li[itemprop=additionalProperty] > span[itemprop=value]')[1]).text().split(' ')[0]),
            no_toilets: Number($($(e).find('.aux-info > li[itemprop=additionalProperty] > span[itemprop=value]')[2]).text().split(' ')[0]),
        });
    });

    return data;
}

const loader = LoadPageGen();

module.exports = {
    scrapper,
    loader
}