const fetch = require('node-fetch');
const stringToDate = require("../utils/stringToDate");

const no_pages = process.env.NODE_ENV === 'development' ? 80 : 18080;

function* LoadPageGen() {
    for (let i=0; i<no_pages; i += 20) {
        yield fetch(`https://www.nigeriapropertycentre.com/for-rent/flats-apartments/lagos/results?limitstart=${i}&q=lagos+for-rent+flats-apartments`);
    }
}

function scrapper($) {
    let data = [];

    $('.property').each(( i, e ) => {
        let price = Number($($(e).find('.price')[1]).attr('content'));
        let no_bed = Number($($(e).find('.aux-info > li')[0]).text().split(' ')[0]);
        let no_bath = Number($($(e).find('.aux-info > li')[1]).text().split(' ')[0]);
        let no_toilets = Number($($(e).find('.aux-info > li')[2]).text().split(' ')[0]);
        let address = $(e).find('address > strong').text().trim();
        let description = $(e).find('.description > p').text().trim();
        let url = $(e).find('a').attr('href');

        let date_added = stringToDate($($(e).find(".added-on")[1]).text().replace("Added ", "").replace("on ", "").toLowerCase());

        if ($(e).find(".ribbon").text() !== "Premium Plus Listing" && !!price && !!no_bed && !!no_toilets && !!no_bath) {
            data.push({
                source: 'nigerian_property_center',
                url,
                address,
                description,
                price,
                no_bed,
                no_bath,
                no_toilets,
                date_added
            });
        }
    });

    return data;
}

const loader = LoadPageGen();

module.exports = {
    scrapper,
    loader
};
