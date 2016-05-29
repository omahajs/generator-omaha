'use strict';

var yeoman    = require('yeoman-generator');
var mkdirp    = require('mkdirp');

var indent = '  ';
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
var questions = [{
    type: 'checkbox',
    name: 'dependencies',
    message: 'Choose plugin dependencies:',
    choices: [
        {
            name: indent + 'jQuery',
            value: 'jquery',
            checked: false
        },
        {
            name: indent + 'Underscore.js',
            value: 'underscore',
            checked: false
        },
        {
            name: indent + 'Backbone.js',
            value: 'backbone',
            checked: false
        }
    ]
}];

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
            function isSelectedDependency(name) {return options[name];}
            this.dependencies = ['jquery', 'underscore', 'backbone'].filter(isSelectedDependency);
            this.depList = this.dependencies.map(function(dep) {return '\'' + dep + '\'';});
            this.dependencies.forEach(function(dep) {
                this.use[dep] = true;
                return dep;
            }, this);
            done();
        } else {
            this.prompt(questions, function (props) {
                this.depList = props.dependencies.map(function(dep) {return '\'' + dep + '\'';});
                this.dependencies = props.dependencies.map(function(dep) {
                    this.use[dep] = true;
                    return dep;
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
        this.dependencies = this.depList.map(function(dep) {return dep.replace(/'/g, '');});
        var appDir = this.config.get('appDir');
        var pathBase = appDir ? appDir + '/app/plugins/' : './';
        this.template('umd.template.js', pathBase + this.pluginName + '.js');
    }
});
