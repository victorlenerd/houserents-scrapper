const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');

const no_pages = 499;

const url = 'https://www.propertypro.ng/property-for-rent/lagos/flat-apartment?page=';

const data = [];

function* LoadPageGen() {
    for (let i=0; i<no_pages; i++) {
        yield fetch(`${url}${i}`);
    }
}

function fetchProperties($) {
    const props = [];

    $('.property-bg').each(( i, e ) => {

        props.push({
            area: $(e).find('.pro-location').text(),
            price: $(e).find('span[itemprop=price]').attr('content'),
            no_bed: $($(e).find('.prop-aminities > span')[0]).text().split(' ')[0],
            no_bath: $($(e).find('.prop-aminities > span')[1]).text().split(' ')[0],
            no_toilets: $($(e).find('.prop-aminities > span')[2]).text().split(' ')[0],
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