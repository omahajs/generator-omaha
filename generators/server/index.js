

const { assign, keys } = Object;

const { join } = require('path');
const { pick } = require('lodash');
const { mkdirp } = require('fs-extra');
const { blue } = require('chalk');
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const {
    download,
    formatCsvData,
    formatFederalAgencyData
} = require('./data-utils');
const {
    copyTpl,
    json: { extend }
} = require('../app/utils');

const DATA_DIR = './web/data';
const DATA_LOOKUP = {
    'Federal agencies data': {
        url: 'https://raw.githubusercontent.com/GSA/data.gov/master/roots-nextdatagov/assets/Json/fed_agency.json',
        path: join(DATA_DIR, 'federal_agencies.json'),
        formatter: formatFederalAgencyData
    },
    'Federal IT Standards Profile List': { // https://github.com/GSA/data
        url: 'https://raw.githubusercontent.com/GSA/data/master/enterprise-architecture/it-standards.csv',
        path: join(DATA_DIR, 'federal_it_standards.json'),
        formatter: formatCsvData
    },
    'Federal .gov domains': { // https://github.com/GSA/data
        url: 'https://raw.githubusercontent.com/GSA/data/master/dotgov-domains/current-federal.csv',
        path: join(DATA_DIR, 'federal_dotgov_domains.json'),
        formatter: formatCsvData
    },
    '2013 Earthquake data': { // https://github.com/GSA/data.gov
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
const PORTS = {
    http: 8111,
    https: 8443,
    ws: 13337,
    graphql: 4669
};
const INCLUDE_MARKDOWN_SUPPORT_DEFAULT = false;
const COMMAND_LINE_OPTIONS = {
    defaults: {
        type: Boolean,
        desc: 'Scaffold server with defaults settings and no user interaction',
        defaults: false
    },
    http: {
        type: String,
        desc: 'HTTP server port',
        defaults: PORTS.http
    },
    https: {
        type: String,
        desc: 'HTTPS server port',
        defaults: PORTS.https
    },
    ws: {
        type: String,
        desc: 'WebSocket server port',
        defaults: PORTS.ws
    },
    graphql: {
        type: String,
        desc: 'GraphQL server port',
        defaults: PORTS.graphql
    }
};
const PROMPTS = [{
    type: 'input',
    name: 'httpPort',
    message: 'HTTP server port?',
    default: PORTS.http
}, {
    type: 'input',
    name: 'httpsPort',
    message: 'HTTPS server port?',
    default: PORTS.https
}, {
    type: 'input',
    name: 'websocketPort',
    message: 'WebSocket server port?',
    default: PORTS.ws
}, {
    type: 'input',
    name: 'graphqlPort',
    message: 'GraphQL server port?',
    default: PORTS.graphql
}, {
    type: 'confirm',
    name: 'markdownSupport',
    message: 'Add support for rendering Markdown files?',
    default: false
}, {
    type: 'checkbox',
    name: 'downloadData',
    message: 'Download data sets to explore:',
    default: [],
    choices: keys(DATA_LOOKUP)
}];

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        const generator = this;
        keys(COMMAND_LINE_OPTIONS).forEach(option => {
            generator.option(option, COMMAND_LINE_OPTIONS[option]);
        });
    }
    prompting() {
        const generator = this;
        const { options } = generator;
        const { http, https, useJest, ws, graphql } = options;
        const useCustomPorts = () => [PORTS.http !== Number(http), PORTS.https !== Number(https), PORTS.ws !== Number(ws), PORTS.graphql !== Number(graphql)].some(Boolean);
        generator.useJest = Boolean(useJest);
        if (options.defaults || useCustomPorts()) {
            const done = this.async();
            const datasources = {};
            assign(generator, { datasources }, {
                httpPort: http,
                httpsPort: https,
                websocketPort: ws,
                graphqlPort: graphql,
                markdownSupport: INCLUDE_MARKDOWN_SUPPORT_DEFAULT
            });
            done();
        } else {
            return generator.prompt(PROMPTS).then((answers => {
                const { downloadData } = answers;
                const datasources = pick(DATA_LOOKUP, downloadData);
                assign(generator, { datasources }, pick(answers, ['httpPort', 'httpsPort', 'websocketPort', 'graphqlPort', 'downloadData', 'markdownSupport']));
            }).bind(this));
        }
    }
    writing() {
        const generator = this;
        const { fs, log, markdownSupport } = generator;
        markdownSupport && log(yosay(`Place Markdown files in ${blue('./web/client/')}`));
        [// Boilerplate files
        ['_package.json', 'package.json'], ['config/_gitignore', '.gitignore'], ['config/_env', '.env'], ['config/_default.js', 'config/default.js'], ['../../project/templates/config/_eslintrc.js', 'config/.eslintrc.js'], ['_index.js', 'index.js'], ['_socket.js', 'web/socket.js'], // WebSocket server
        ['_server.js', 'web/server.js'], // HTTP server
        ['_graphql.js', 'web/graphql.js'], // GraphQL server
        ['favicon.ico', 'favicon.ico'], ['_index.html', 'web/client/index.html']].concat( // Optional files
        markdownSupport ? [['example.md', 'web/client/example.md']] : []).forEach(data => copyTpl(...data, generator));
        fs.copy(generator.templatePath('ssl/**/*.*'), generator.destinationPath('web/ssl'));
    }
    install() {
        this.npmInstall();
    }
    end() {
        const generator = this;
        if (['linux', 'freebsd'].includes(process.platform)) {
            generator.npmInstall('stmux', { saveDev: true });
            extend('package.json', {
                scripts: { dev: 'stmux [ \"nodemon index.js\" .. \"npm run lint:watch\" ]' }
            });
        }
        //
        // Download selected data sets
        //
        const { downloadData } = generator;
        if (Array.isArray(downloadData) && downloadData.length > 0) {
            mkdirp(DATA_DIR);
            downloadData.forEach(data => download(DATA_LOOKUP[data]));
        }
    }
};