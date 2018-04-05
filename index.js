const cheerio = require('cheerio');
const rp = require('request-promise');
const fs = require('fs');

const no_pages = 10;

const url = 'https://www.tolet.com.ng/property-for-rent/lagos/?page=';

const allRequests = [];
const data = [];

for (let i=1; i<no_pages; i++) {
    allRequests.push(rp(`${url}${i}`));
}

function* LoadPageGen(pages) {
    for (let i=1; i<pages.length; i++) {
        yield pages[i];
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

const loadPage = LoadPageGen(allRequests);

function extractData() {
    let res = loadPage.next();
    if (res.done) {
        fs.writeFile('./data.json', JSON.stringify(data), () => {
            console.log('Data.json updataed')
        });
    };

    res.value.then((htmlString) => {
        const pageData = fetchProperties(cheerio.load(htmlString));
        console.log('pageData', pageData);
        data.push(pageData);
        extractData();
    })
    .catch((err) => {
        console.error(err);
        extractData();
    });
}

extractData();