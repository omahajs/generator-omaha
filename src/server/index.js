/* @flow */
import type {ServerGenerator} from '../types';

const {assign, keys}       = Object;
const {pick}               = require('lodash');
const {mkdirp}             = require('fs-extra');
const {blue, red}          = require('chalk');
const Generator            = require('yeoman-generator');
const yosay                = require('yosay');
const {download}           = require('../app/data-utils');
const {server}             = require('../app/prompts');
const COMMAND_LINE_OPTIONS = require('./commandLineOptions');
const PORTS                = require('./ports');
const {dir, lookup}        = require('./data');
const {
    copyTpl,
    json: {extend}
} = require('../app/utils');
const INCLUDE_MARKDOWN_SUPPORT_DEFAULT = false;

module.exports = class extends Generator {
    constructor(args: any, opts: any) {
        super(args, opts);
        const generator = this;
        keys(COMMAND_LINE_OPTIONS).forEach(option => {
            generator.option(option, COMMAND_LINE_OPTIONS[option]);
        });
    }
    prompting() {
        const generator: ServerGenerator = this;
        const {options} = generator;
        const {http, https, useJest, ws, graphql} = options;
        const useCustomPorts = () => [
            PORTS.http !== Number(http),
            PORTS.https !== Number(https),
            PORTS.ws !== Number(ws),
            PORTS.graphql !== Number(graphql)
        ].some(Boolean);
        generator.useJest = Boolean(useJest);
        if (options.defaults || useCustomPorts()) {
            const done = this.async();
            const datasources = {};
            const enableGraphiql = false;
            assign(generator, {datasources, enableGraphiql}, {
                httpPort:  http,
                httpsPort: https,
                websocketPort: ws,
                graphqlPort: graphql,
                markdownSupport: INCLUDE_MARKDOWN_SUPPORT_DEFAULT
            });
            done();
        } else {
            return generator.prompt(server.prompts).then((answers => {
                const {downloadData, enableGraphiql} = answers;
                const datasources = pick(lookup, downloadData);
                assign(generator, {datasources, enableGraphiql}, pick(answers, [
                    'httpPort',
                    'httpsPort',
                    'websocketPort',
                    'graphqlPort',
                    'downloadData',
                    'markdownSupport'
                ]));
            }).bind(this));
        }
    }
    writing() {
        const generator = this;
        const {fs, enableGraphiql, log, markdownSupport} = generator;
        markdownSupport && log(yosay(`Place Markdown files in ${blue('./web/client/')}`));/* eslint-disable no-console */
        enableGraphiql && console.log(`    ${red.bold('Warning')}: CSRF and CSP will be disabled\n`);/* eslint-enable no-console */
        [// Boilerplate files
            ['_package.json', 'package.json'],
            ['config/_gitignore', '.gitignore'],
            ['config/_env', '.env'],
            ['config/_default.js', 'config/default.js'],
            ['../../project/templates/config/_eslintrc.js', 'config/.eslintrc.js'],
            ['_index.js', 'index.js'],
            ['_socket.js', 'web/socket.js'], // WebSocket server
            ['_server.js', 'web/server.js'], // HTTP server
            ['_graphql.js', 'web/graphql.js'], // GraphQL server
            ['favicon.ico', 'favicon.ico'],
            ['_index.html', 'web/client/index.html']
        ].concat(// Optional files
            markdownSupport ? [['example.md', 'web/client/example.md']] : []
        ).forEach(data => copyTpl(...data, generator));
        fs.copy(
            generator.templatePath('ssl/**/*.*'),
            generator.destinationPath('web/ssl')
        );
    }
    install() {
        this.npmInstall();
    }
    end() {
        const generator = this;
        if (['linux', 'freebsd'].includes(process.platform)) {
            generator.npmInstall('stmux', {saveDev: true});
            extend('package.json', {
                scripts: {dev: 'stmux [ \"nodemon index.js\" .. \"npm run lint:watch\" ]'}
            });
        }
        //
        // Download selected data sets
        //
        const {downloadData} = generator;
        if (Array.isArray(downloadData) && downloadData.length > 0) {
            mkdirp(dir);
            downloadData.forEach(data => download(lookup[data]));
        }
    }
};
