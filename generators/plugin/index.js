'use strict';

var yeoman    = require('yeoman-generator');
var mkdirp    = require('mkdirp');
var questions = require('./prompts');

var commandLineOptions = {
    jquery: {
        type: 'Boolean',
        desc: 'Add jQuery dependency',
        defaults: false
    },
    underscore: {
        type: 'Boolean',
        desc: 'Add Underscore dependency',
        defaults: false
    },
    backbone: {
        type: 'Boolean',
        desc: 'Add Backbone dependency (automatically adds Underscore dependency)',
        defaults: false
    }
};

module.exports = yeoman.generators.NamedBase.extend({
    constructor: function() {
        var generator = this;
        yeoman.generators.NamedBase.apply(generator, arguments);
        Object.keys(commandLineOptions).forEach(function(option) {
            generator.option(option, commandLineOptions[option]);
        });
    },
    prompting: function() {
        var generator = this;
        var options = generator.options;
        var done = generator.async();
        var dependencySelected = options.jquery || options.underscore || options.backbone;
        this.pluginName = this.name.substring(this.name.charAt(0) === '/' ? 1 : 0);
        this.userName = this.user.git.name() ? this.user.git.name() : 'John Doe';
        this.use = {};
        if(dependencySelected) {
            function isSelectedOption(name) {return options[name];}
            var dependencies = ['jquery', 'underscore', 'backbone'].filter(isSelectedOption);
            this.depList = dependencies.map(function(dep) {return '\'' + dep + '\'';});
            dependencies.forEach(function(dep) {
                this.use[dep] = true;
            }, this);
            done();
        } else {
            this.prompt(questions, function (props) {
                this.depList = props.dependencies.map(function(dep) {return '\'' + dep + '\'';});
                props.dependencies.forEach(function(dep) {
                    this.use[dep] = true;
                }, this);
                done();
            }.bind(this));
        }
    },
    writing: function() {
        if (this.use.backbone && !this.use.underscore) {
            this.depList.unshift('\'underscore\'');
            this.use.underscore = true;
        }
        this.template('umd.template.js', this.config.get('appDir') + 'app/plugins/' + this.pluginName + '.js');
    }
});
