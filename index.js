const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');

const no_pages = 400;

const url = 'https://www.tolet.com.ng/property-for-rent/lagos/?page=';

const data = [];

function* LoadPageGen() {
    for (let i=0; i<no_pages; i++) {
        yield fetch(`${url}${i}`);
    }
}

function fetchProperties($) {
    const props = [];

    $('.property:not(.featuredProperty)').each(( i, e ) => {
        props.push({
            area: $(e).find('.property-area').text(),
            price: Number($(e).find('span[itemprop=price]').attr('content')),
            no_bed: Number($($(e).find('.property-aminities-list > div > span')[0]).text().split(' ')[0]),
            no_bath: Number($($(e).find('.property-aminities-list > div > span')[1]).text().split(' ')[0]),
            no_toilets: Number($($(e).find('.property-aminities-list > div > span')[2]).text().split(' ')[0]),
        });
    });

    return props;
}

const loadPage = LoadPageGen();

function extractData() {
    let res = loadPage.next();

    if (res.done === true) {
        const flattedData = [].concat.apply([], data)
        fs.writeFile('./data.json', JSON.stringify(flattedData), (err) => {
            if (err) console.error(err);
            console.log('Data.json updataed')
        });
        return;
    };

    res.value.then(r => r.text()).then((htmlString) => {
        const pageData = fetchProperties(cheerio.load(htmlString));
        data.push(pageData);
        extractData();
    })
    .catch((err) => {
        extractData();
    });
}

extractData();