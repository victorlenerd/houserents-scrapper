const cheerio = require('cheerio');
const fetch = require('node-fetch');
const fs = require('fs');

let currentPage = 0;

const no_pages = 7480;
const data = [];

function* LoadPageGen() {
    for (let i=0; i<no_pages; i += 20) {
        yield fetch(`https://www.nigeriapropertycentre.com/for-rent/flats-apartments/lagos/results?limitstart=${i}&q=lagos+for-rent+flats-apartments`);
    }
}

function fetchProperties($) {
    $('.property').each(( i, e ) => {
        data.push({
            area: $(e).find('address > strong').text(),
            price: $(e).find('span[itemprop=price]').attr('content'),
            no_bed: $($(e).find('.aux-info > li[itemprop=additionalProperty] > span[itemprop=value]')[0]).text().split(' ')[0],
            no_bath: $($(e).find('.aux-info > li[itemprop=additionalProperty] > span[itemprop=value]')[1]).text().split(' ')[0],
            no_toilets: $($(e).find('.aux-info > li[itemprop=additionalProperty] > span[itemprop=value]')[2]).text().split(' ')[0],
            no_parking_spaces: $($(e).find('.aux-info > li[itemprop=additionalProperty] > span[itemprop=value]')[3]).text().split(' ')[0],
        });
    });
}

const loadPage = LoadPageGen();

function extractData() {
    let res = loadPage.next();

    if (res.done === true) {
        const flattedData = [].concat.apply([], data)
        fs.writeFile('./data.npc.json', JSON.stringify(flattedData), (err) => {
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