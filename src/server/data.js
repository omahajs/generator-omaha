const {join} = require('path');
const {
    formatCsvData,
    formatFederalAgencyData
} = require('../app/data-utils');
const DATA_DIR = './web/data';

exports.dir = DATA_DIR;
exports.lookup = {
    'Federal agencies data': {
        url: 'https://raw.githubusercontent.com/GSA/data.gov/master/roots-nextdatagov/assets/Json/fed_agency.json',
        path: join(DATA_DIR, 'federal_agencies.json'),
        formatter: formatFederalAgencyData
    },
    'Federal IT Standards Profile List': {// https://github.com/GSA/data
        url: 'https://raw.githubusercontent.com/GSA/data/master/enterprise-architecture/it-standards.csv',
        path: join(DATA_DIR, 'federal_it_standards.json'),
        formatter: formatCsvData
    },
    'Federal .gov domains': {// https://github.com/GSA/data
        url: 'https://raw.githubusercontent.com/GSA/data/master/dotgov-domains/current-federal.csv',
        path: join(DATA_DIR, 'federal_dotgov_domains.json'),
        formatter: formatCsvData
    },
    '2013 Earthquake data': {// https://github.com/GSA/data.gov
        url: 'https://raw.githubusercontent.com/GSA/data.gov/gh-pages/wordpress/assets/earthquakes.csv',
        path: join(DATA_DIR, 'earthquakes_2013.json'),
        formatter: formatCsvData
    },
    '2012 Revenue data': {
        url: 'https://raw.githubusercontent.com/curran/data/gh-pages/wikibon/revenueBigData2012.csv',
        path: join(DATA_DIR, 'revenue_2012.json'),
        formatter: formatCsvData
    },
    '2015 Startup analytics data': {
        url: 'https://raw.githubusercontent.com/curran/data/gh-pages/mattermark/2015-top-100-analytics-startups.csv',
        path: join(DATA_DIR, 'startups_2015.json'),
        formatter: formatCsvData
    }
};
