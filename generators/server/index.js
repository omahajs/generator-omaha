'use strict';

var _         = require('lodash');
var Generator = require('yeoman-generator');
var chalk     = require('chalk');
var yosay     = require('yosay');
var utils     = require('../app/utils');
var copyTpl   = utils.copyTpl;
var extend    = utils.json.extend;

var commandLineOptions = {
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
var prompts = [
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

module.exports = Generator.extend({
    constructor: function() {
        Generator.apply(this, arguments);
        var generator = this;
        Object.keys(commandLineOptions).forEach(function(option) {
            generator.option(option, commandLineOptions[option]);
        });
    },
    prompting: function() {
        var options = this.options;
        var customPortSelected = (options.http || options.https || options.ws);
        if (options.defaults || customPortSelected) {
            var done = this.async();
            this.httpPort = _.defaultTo(options.http, prompts[0].default);
            this.httpsPort = _.defaultTo(options.https, prompts[1].default);
            this.websocketPort = _.defaultTo(options.ws, prompts[2].default);
            this.markdownSupport = prompts[3].default;
            done();
        } else {
            return this.prompt(prompts).then(function(answers) {
                _.extend(this, _.pick(answers, [
                    'httpPort',
                    'httpsPort',
                    'websocketPort',
                    'markdownSupport'
                ]));
            }.bind(this));
        }
    },
    configuring: {
        projectfiles: function() {
            var generator = this;
            var _copyTpl = _.partial(copyTpl, _, _, generator);
            if (generator.markdownSupport) {
                generator.log(yosay('Place Markdown files in ' + chalk.blue('./web/client/')));
            }
            _copyTpl('_package.json', 'package.json');
            _copyTpl('config/_gitignore', '.gitignore');
            _copyTpl('config/_env', '.env');
            _copyTpl('config/_default.js', 'config/default.js');
            _copyTpl('../../project/templates/config/_eslintrc.js', 'config/.eslintrc.js');
        }
    },
    writing: {
        serverFiles: function() {
            var generator = this;
            var _copyTpl = _.partial(copyTpl, _, _, generator);
            _copyTpl('_index.js', 'index.js');
            _copyTpl('_socket.js', 'web/socket.js'); //WebSocket server
            _copyTpl('_server.js', 'web/server.js'); //HTTP server
            _copyTpl('favicon.ico', 'favicon.ico');  //empty favicon
            this.fs.copy(
                this.templatePath('ssl/**/*.*'),
                this.destinationPath('web/ssl')
            );
        },
        boilerplate: function() {
            copyTpl('_index.html', 'web/client/index.html', this);
            if (this.markdownSupport) {
                copyTpl('example.md', 'web/client/example.md', this);
            }
        }
    },
    install: function() {
        this.npmInstall();
    },
    end: function() {
        if (_(['linux', 'freebsd']).includes(process.platform)) {
            this.npmInstall('stmux', {saveDev: true});
            extend('package.json', {
                scripts: {dev: 'stmux [ \"nodemon index.js\" .. \"npm run lint:watch\" ]'}
            });
        }
    }
});
