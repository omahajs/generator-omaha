'use strict';

var yeoman             = require('yeoman-generator');
var mkdirp             = require('mkdirp');
var commandLineOptions = require('./commandLineOptions');

var globalNameLookup = {
    root: 'root',
    jquery: '$',
    underscore: '_',
    lodash: '_',
    ramda: '_',
    backbone: 'Backbone',
    marionette: 'Marionette'
};
var npmModuleNameLookup = {
    jquery: 'jquery',
    underscore: 'underscore',
    lodash: 'lodash',
    ramda: 'ramda',
    backbone: 'backbone',
    marionette: 'backbone.marionette'
};
var indent = '  ';
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
        },
        {
            name: indent + 'MarionetteJS',
            value: 'marionette',
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
        if (options.customDependency && options.alias) {
            commandLineOptions[options.customDependency] = true;
            options[options.customDependency] = true;
            globalNameLookup[options.customDependency] = options.alias;
        }
        var dependencySelected = Object.keys(commandLineOptions).map(function(key) {return options[key];}).indexOf(true) > -1;
        generator.pluginName = generator.name.substring(generator.name.charAt(0) === '/' ? 1 : 0).replace('.', '_');
        generator.userName = generator.user.git.name() ? generator.user.git.name() : 'John Doe';
        generator.use = {};
        if(dependencySelected) {
            function isSelectedDependency(name) {return options[name] === true;}
            generator.dependencies = Object.keys(commandLineOptions).filter(isSelectedDependency);
            generator.depList = generator.dependencies.map(function(dep) {return '\'' + dep + '\'';});
            generator.dependencies.forEach(function(dep) {
                generator.use[dep] = true;
                return dep;
            });
            done();
        } else {
            generator.prompt(questions, function (props) {
                generator.depList = props.dependencies.map(function(dep) {return '\'' + dep + '\'';});
                generator.dependencies = props.dependencies.map(function(dep) {
                    generator.use[dep] = true;
                    return dep;
                });
                done();
            }.bind(generator));
        }
    },
    writing: function() {
        var generator = this;
        var appDir = generator.config.get('appDir');
        var pathBase = appDir ? appDir + '/app/plugins/' : './';
        if (generator.use.marionette && !generator.use.backbone) {
            generator.depList.unshift('\'backbone\'');
            generator.use.backbone = true;
        }
        if (generator.use.backbone && !generator.use.underscore) {
            generator.depList.unshift('\'underscore\'');
            generator.use.underscore = true;
        }
        generator.dependencies = generator.depList.map(removeSingleQuotes);
        generator.defineArguments = generator.dependencies.map(aliasFor).join(', ');
        generator.iifeArguments = ['root'].concat(generator.dependencies).map(aliasFor).join(', ');
        generator.requireStatements = generator.dependencies.map(requireStatementFor).join('\n\t\t');
        generator.template('umd.template.js', pathBase + generator.pluginName + '.js');
        function aliasFor(dep) {return globalNameLookup[dep];}
        function requireStatementFor(dep) {return 'var ' + aliasFor(dep) + ' = require(\'' + npmModuleNameLookup[dep] + '\');';}
        function removeSingleQuotes(str) {return str.replace(/'/g, '');}
    }
});
