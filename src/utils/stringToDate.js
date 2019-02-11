const dateFns = require('date-fns');

module.exports = function stringToDate(str) {
    let months = {
        'jan': 1,
        'feb': 2,
        'mar': 3,
        'apr': 4,
        'may': 5,
        'jun': 6,
        'jul': 7,
        'aug': 8,
        'sep': 9,
        'oct': 10,
        'nov': 11,
        'dec': 12
    };

    if (str === 'today') {
        return new Date();
    } else if (str === 'yesterday') {
        return dateFns.subDays(new Date(), 1);
    } else {
        let [ day, monthName, year ] = str.trim().split(" ");
        let month = months[monthName.toLowerCase()]
        return new Date(`${year}-${month}-${day}`);
    }
}