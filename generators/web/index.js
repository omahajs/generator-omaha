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
            this.fs.copy(
                this.templatePath('config/{.*,*.*}'),
                this.destinationPath('config')
            );
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json')
            );
            this.fs.copyTpl(
                this.templatePath('_app.json'),
                this.destinationPath('app.json')
            );
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
