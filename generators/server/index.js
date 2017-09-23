'use strict';

const {assign, defaultTo, includes, partialRight, pick} = require('lodash');
const Generator = require('yeoman-generator');
const chalk     = require('chalk');
const yosay     = require('yosay');
const {
    copyTpl,
    json: {extend}
} = require('../app/utils');

const commandLineOptions = {
    defaults: {
        type: Boolean,
        desc: 'Scaffold server with defaults settings and no user interaction',
        defaults: false
    },
    http: {
        type: String,
        desc: 'HTTP server port'
    },
    https: {
        type: String,
        desc: 'HTTPS server port'
    },
    ws: {
        type: String,
        desc: 'WebSocket server port'
    }
};
const prompts = [
    {
        type: 'input',
        name: 'httpPort',
        message: 'HTTP server port?',
        default: '8111'
    },
    {
        type: 'input',
        name: 'httpsPort',
        message: 'HTTPS server port?',
        default: '8443'
    },
    {
        type: 'input',
        name: 'websocketPort',
        message: 'WebSocket server port?',
        default: '13337'
    },
    {
        type: 'confirm',
        name: 'markdownSupport',
        message: 'Add support for rendering Markdown files?',
        default: false
    }
];

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        let generator = this;
        Object.keys(commandLineOptions).forEach(function(option) {
            generator.option(option, commandLineOptions[option]);
        });
    }
    prompting() {
        let generator = this;
        let options = this.options;
        let customPortSelected = (options.http || options.https || options.ws);
        if (options.defaults || customPortSelected) {
            let done = this.async();
            let defaults = prompts.map(val => val.default);
            assign(generator, {
                httpPort: defaultTo(options.http, defaults[0]),
                httpsPort: defaultTo(options.https, defaults[1]),
                websocketPort: defaultTo(options.ws, defaults[2]),
                markdownSupport: defaults[3]
            });
            done();
        } else {
            return generator.prompt(prompts).then(function(answers) {
                assign(generator, pick(answers, [
                    'httpPort',
                    'httpsPort',
                    'websocketPort',
                    'markdownSupport'
                ]));
            }.bind(this));
        }
    }
    configuring() {
        let generator = this;
        let _copyTpl = partialRight(copyTpl, generator);
        if (generator.markdownSupport) {
            generator.log(yosay('Place Markdown files in ' + chalk.blue('./web/client/')));
        }
        _copyTpl('_package.json', 'package.json');
        _copyTpl('config/_gitignore', '.gitignore');
        _copyTpl('config/_env', '.env');
        _copyTpl('config/_default.js', 'config/default.js');
        _copyTpl('../../project/templates/config/_eslintrc.js', 'config/.eslintrc.js');
    }
    writing() {
        let generator = this;
        let _copyTpl = partialRight(copyTpl, generator);
        //
        // Write server files
        //
        _copyTpl('_index.js', 'index.js');
        _copyTpl('_socket.js', 'web/socket.js');// WebSocket server
        _copyTpl('_server.js', 'web/server.js');// HTTP server
        _copyTpl('favicon.ico', 'favicon.ico');// empty favicon
        generator.fs.copy(
            generator.templatePath('ssl/**/*.*'),
            generator.destinationPath('web/ssl')
        );
        //
        // Write boilerplate files
        //
        _copyTpl('_index.html', 'web/client/index.html');
        if (generator.markdownSupport) {
            _copyTpl('example.md', 'web/client/example.md');
        }
    }
    install() {
        this.npmInstall();
    }
    end() {
        if (includes(['linux', 'freebsd'], process.platform)) {
            this.npmInstall('stmux', {saveDev: true});
            extend('package.json', {
                scripts: {dev: 'stmux [ \"nodemon index.js\" .. \"npm run lint:watch\" ]'}
            });
        }
    }
};
