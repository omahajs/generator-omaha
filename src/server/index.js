/* @flow */
const {assign, defaultTo, includes, partialRight, pick} = require('lodash');
const Generator = require('yeoman-generator');
const chalk     = require('chalk');
const yosay     = require('yosay');
const {
    copyTpl,
    json: {extend}
} = require('../app/utils');

const COMMAND_LINE_OPTIONS = {
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
    constructor(args: any, opts: any) {
        super(args, opts);
        const generator = this;
        Object.keys(COMMAND_LINE_OPTIONS).forEach(function(option) {
            generator.option(option, COMMAND_LINE_OPTIONS[option]);
        });
    }
    prompting() {
        const generator = this;
        const options = this.options;
        const {http, https, useJest, ws} = options;
        const customPortSelected = (http || https || ws);
        generator.useJest = useJest;
        if (options.defaults || customPortSelected) {
            const done = this.async();
            const defaults = prompts.map(val => val.default);
            assign(generator, {
                httpPort: defaultTo(http, defaults[0]),
                httpsPort: defaultTo(https, defaults[1]),
                websocketPort: defaultTo(ws, defaults[2]),
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
        const generator = this;
        const _copyTpl = partialRight(copyTpl, generator);
        if (generator.markdownSupport) {
            generator.log(yosay(`Place Markdown files in ${ chalk.blue('./web/client/')}`));
        }
        _copyTpl('_package.json', 'package.json');
        _copyTpl('config/_gitignore', '.gitignore');
        _copyTpl('config/_env', '.env');
        _copyTpl('config/_default.js', 'config/default.js');
        _copyTpl('../../project/templates/config/_eslintrc.js', 'config/.eslintrc.js');
    }
    writing() {
        const generator = this;
        const _copyTpl = partialRight(copyTpl, generator);
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
