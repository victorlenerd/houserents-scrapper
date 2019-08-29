const cheerio = require('cheerio');

module.exports  = function scrapperLauncher(loader, scrapper) {
    return new Promise((resolve, reject) => {
        const data = [];

        function scrape() {
            let res = loader.next();

            if (res.done === true) {
                const flattedData = [].concat.apply([], data);
                return resolve(flattedData);
            };
        
            res.value.then(r => r.text()).then((htmlString) => {
                const pageData = scrapper(cheerio.load(htmlString));
                data.push(pageData);
                scrape();
            })
            .catch((err) => {
                scrape();
            });
        }

        scrape();
    });
}