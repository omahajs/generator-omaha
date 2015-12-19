'use strict';
var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
    prompting: function() {
        var done = this.async();
        var prompts = [/*
            {
                type: 'confirm',
                name: 'someOption',
                message: 'Would you like to enable this option?',
                default: true
            }
        */];
        this.prompt(prompts, function (props) {
            this.props = props;
            done();
        }.bind(this));
    },
    configuring: {
        projectfiles: function() {}
    },
    writing: {
        envStructure: function() {}
    },
    install: function () {}
});
