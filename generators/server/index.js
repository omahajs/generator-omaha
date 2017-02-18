'use strict';

var Generator = require('yeoman-generator');
var chalk     = require('chalk');
var yosay     = require('yosay');
var copyTpl   = require('../app/utils').copyTpl;

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
            var defaultHttpPort = prompts[0].default;
            var defaultHttpsPort = prompts[1].default;
            var defaultWebsocketPort = prompts[2].default;
            this.httpPort = options.http || defaultHttpPort;
            this.httpsPort = options.https || defaultHttpsPort;
            this.websocketPort = options.ws || defaultWebsocketPort;
            this.markdownSupport = prompts[3].default;
            done();
        } else {
            return this.prompt(prompts).then(function(answers) {
                this.httpPort = answers.httpPort;
                this.httpsPort = answers.httpsPort;
                this.websocketPort = answers.websocketPort;
                this.markdownSupport = answers.markdownSupport;
            }.bind(this));
        }
    },
    configuring: {
        projectfiles: function() {
            if (this.markdownSupport) {
                this.log(yosay('Place Markdown files in ' + chalk.blue('./web/client/')));
            }
            copyTpl('_package.json', 'package.json', this);
            copyTpl('config/_gitignore', '.gitignore', this);
            copyTpl('config/_env', '.env', this);
            copyTpl('config/_default.js', 'config/default.js', this);
        }
    },
    writing: {
        serverFiles: function() {
            copyTpl('_index.js', 'index.js', this);
            copyTpl('_socket.js', 'web/socket.js', this); //WebSocket server
            copyTpl('_server.js', 'web/server.js', this); //HTTP server
            copyTpl('favicon.ico', 'favicon.ico', this);  //empty favicon
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
    }
});
