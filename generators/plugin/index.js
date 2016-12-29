'use strict';

var _                  = require('lodash');
var Generator          = require('yeoman-generator');
var commandLineOptions = require('./commandLineOptions');
var copyTpl            = require('../app/utils').copyTpl;

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

module.exports = Generator.extend({
    constructor: function() {
        Generator.apply(this, arguments);
        var generator = this;
        generator.argument('name', {type: String, required: true});
        Object.keys(commandLineOptions).forEach(function(option) {
            generator.option(option, commandLineOptions[option]);
        });
    },
    prompting: function() {
        var generator = this;
        var options = generator.options;
        if (options.customDependency && options.alias) {
            commandLineOptions[options.customDependency] = true;
            options[options.customDependency] = true;
            globalNameLookup[options.customDependency] = options.alias;
        }
        var dependencySelected = Object.keys(commandLineOptions).map(function(key) {return options[key];}).indexOf(true) > -1;
        generator.pluginName = generator.options.name.substring(generator.options.name.charAt(0) === '/' ? 1 : 0).replace('.', '_');
        generator.userName = generator.user.git.name() ? generator.user.git.name() : 'A.Developer';
        generator.use = {};
        if(dependencySelected) {
            function isSelectedDependency(name) {return options[name] === true;}
            var done = generator.async();
            generator.dependencies = Object.keys(commandLineOptions).filter(isSelectedDependency);
            generator.depList = generator.dependencies.map(function(dep) {return `'${dep}'`;});
            generator.dependencies.forEach(function(dep) {
                generator.use[dep] = true;
                return dep;
            });
            done();
        } else {
            return generator.prompt(questions).then(function (answers) {
                generator.depList = answers.dependencies.map(function(dep) {return `'${dep}'`;});
                generator.dependencies = answers.dependencies.map(function(dep) {
                    generator.use[dep] = true;
                    return dep;
                });
            }.bind(generator));
        }
    },
    writing: function() {
        var generator = this;
        var pluginDirectory = generator.config.get('pluginDirectory');
        var pathBase = pluginDirectory ? pluginDirectory + '/app/plugins/' : generator.config.get('sourceDirectory');
        pathBase = pathBase ? pathBase : './';
        if (generator.use.marionette && !generator.use.backbone) {
            generator.depList.unshift(`'backbone'`);
            generator.use.backbone = true;
        }
        if (generator.use.backbone && !generator.use.underscore) {
            generator.depList.unshift(`'underscore'`);
            generator.use.underscore = true;
        }
        generator.dependencies = generator.depList.map(removeSingleQuotes);
        generator.defineArguments = generator.dependencies.map(aliasFor).join(', ');
        generator.iifeArguments = ['root'].concat(generator.dependencies).map(aliasFor).join(', ');
        generator.requireStatements = generator.dependencies.map(requireStatementFor).join('\n\t\t');
        copyTpl('umd.template.js', pathBase + generator.pluginName + '.js', generator);
        function aliasFor(dep) {return globalNameLookup[dep];}
        function requireStatementFor(dep) {return 'var ' + aliasFor(dep) + ' = require(\'' + npmModuleNameLookup[dep] + '\');';}
        function removeSingleQuotes(str) {return str.replace(/'/g, '');}
    }
});
