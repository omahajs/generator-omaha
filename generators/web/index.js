'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
    initializing: {
        getInfo: function() {
            this.log(this.destinationRoot());
        }
    },
    configuring: {
        projectfiles: function() {
            this.template('_package.json', 'package.json');
            this.template('_app.json', 'app.json');
            this.template('config/default.js', 'config/default.js');
        }
    },
    writing: {
        serverFiles: function() {
            mkdirp('web');
            this.template('_index.js', 'index.js');
            this.template('_socket.js', 'web/socket.js');//WebSocket server
            this.template('_server.js', 'web/server.js');//HTTP server
        }
    },
    install: function () {
        this.installDependencies({npm: true, bower: false});
    }
});
