'use strict';

var yeoman = require('yeoman-generator');
var chalk  = require('chalk');
var yosay  = require('yosay');

var commandLineOptions = {
    defaults: {
        type: Boolean,
        desc: 'Scaffold server with defaults settings and no user interaction',
        defaults: false
    },
    http: {
        type: String,
        desc: 'HTTP server port',
        defaults: false
    },
    https: {
        type: String,
        desc: 'HTTPS server port',
        defaults: false
    },
    ws: {
        type: String,
        desc: 'WebSocket server port',
        defaults: false
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

module.exports = yeoman.Base.extend({
    constructor: function() {
        var generator = this;
        yeoman.Base.apply(generator, arguments);
        Object.keys(commandLineOptions).forEach(function(option) {
            generator.option(option, commandLineOptions[option]);
        });
    },
    prompting: function() {
        var options = this.options;
        var customPortSelected = (options.http || options.https || options.ws);
        if (options.defaults || customPortSelected) {
            var done = this.async();
            this.httpPort        = options.http  || prompts[0].default;
            this.httpsPort       = options.https || prompts[1].default;
            this.websocketPort   = options.ws    || prompts[2].default;
            this.markdownSupport = prompts[3].default;
            done();
        } else {
            return this.prompt(prompts).then(function (answers) {
                this.httpPort        = answers.httpPort;
                this.httpsPort       = answers.httpsPort;
                this.websocketPort   = answers.websocketPort;
                this.markdownSupport = answers.markdownSupport;
            }.bind(this));
        }
    },
    configuring: {
        projectfiles: function() {
            if (this.markdownSupport) {
                this.log(yosay('Place Markdown files in ' + chalk.blue('./web/client/')));
            }
            this.template('_package.json', 'package.json');
            this.template('config/_gitignore', '.gitignore');
            this.template('config/_env', '.env');
            this.template('config/_default.js', 'config/default.js');
        }
    },
    writing: {
        serverFiles: function() {
            this.template('_index.js', 'index.js');
            this.template('_socket.js', 'web/socket.js'); //WebSocket server
            this.template('_server.js', 'web/server.js'); //HTTP server
            this.template('favicon.ico', 'favicon.ico');  //empty favicon
            this.fs.copy(
                this.templatePath('ssl/**/*.*'),
                this.destinationPath('web/ssl')
            );
        },
        boilerplate: function() {
            this.template('_index.html', 'web/client/index.html');
            if (this.markdownSupport) {
                this.template('example.md', 'web/client/example.md');
            }
        }
    },
    install: function () {
        this.npmInstall();
    }
});
