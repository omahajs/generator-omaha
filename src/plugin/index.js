/* @flow */
import type {PluginGenerator} from '../types';

const Generator            = require('yeoman-generator');
const COMMAND_LINE_OPTIONS = require('./commandLineOptions');
const {copyTpl}            = require('../app/utils');

const globalNameLookup = {
    root: 'root',
    jquery: '$',
    underscore: '_',
    lodash: '_',
    ramda: '_',
    backbone: 'Backbone',
    marionette: 'Marionette'
};
const npmModuleNameLookup = {
    jquery: 'jquery',
    underscore: 'underscore',
    lodash: 'lodash',
    ramda: 'ramda',
    backbone: 'backbone',
    marionette: 'backbone.marionette'
};
const indent = '  ';
const questions = [{
    type: 'checkbox',
    name: 'dependencies',
    message: 'Choose plugin dependencies:',
    choices: [
        {
            name: `${indent}jQuery`,
            value: 'jquery',
            checked: false
        },
        {
            name: `${indent}Underscore.js`,
            value: 'underscore',
            checked: false
        },
        {
            name: `${indent}Backbone.js`,
            value: 'backbone',
            checked: false
        },
        {
            name: `${indent}MarionetteJS`,
            value: 'marionette',
            checked: false
        }
    ]
}];

const aliasFor = dep => globalNameLookup[dep];
const requireStatementFor = dep => `var ${aliasFor(dep)} = require('${npmModuleNameLookup[dep]}');`;
const removeSingleQuotes = str => str.replace(/'/g, '');
const wrapSingleQuotes = str => `'${str}'`;

module.exports = class extends Generator {
    constructor(args: any, opts: any) {
        super(args, opts);
        const generator = this;
        generator.argument('name', {type: String, required: true});
        Object.keys(COMMAND_LINE_OPTIONS).forEach(option => {
            generator.option(option, COMMAND_LINE_OPTIONS[option]);
        });
    }
    prompting() {
        const generator: PluginGenerator = this;
        const {options, user} = generator;
        const {name} = options;
        const customDepName = options.customDependency;
        if (customDepName && options.alias) {
            COMMAND_LINE_OPTIONS[customDepName] = true;
            options[customDepName] = true;
            globalNameLookup[customDepName] = options.alias;
            npmModuleNameLookup[customDepName] = customDepName;
        }
        const dependencySelected = Object.keys(COMMAND_LINE_OPTIONS).map(key => options[key]).some(Boolean);
        generator.pluginName = name.substring(name.charAt(0) === '/' ? 1 : 0).replace('.', '_');
        generator.userName = user.git.name() ? user.git.name() : 'A.Developer';
        generator.use = {};
        if (dependencySelected) {
            const done = generator.async();
            generator.dependencies = Object.keys(COMMAND_LINE_OPTIONS).filter(name => options[name] === true);
            generator.depList = generator.dependencies.map(wrapSingleQuotes);
            generator.dependencies.forEach(dep => {
                generator.use[dep] = true;
            });
            done();
        } else {
            return generator.prompt(questions).then(answers => {
                const {dependencies} = answers;
                generator.depList = dependencies.map(wrapSingleQuotes);
                generator.dependencies = dependencies;
                dependencies.forEach(dep => {
                    generator.use[dep] = true;
                });
                return generator;
            });
        }
    }
    writing() {
        const generator: PluginGenerator = this;
        const {config, pluginName, use} = generator;
        const {
            pluginDirectory,
            sourceDirectory
        } = config.getAll();
        let pathBase = pluginDirectory ? `${pluginDirectory}/app/plugins/` : sourceDirectory;
        pathBase = pathBase ? pathBase : './';
        if (use.marionette && !use.backbone) {
            generator.depList.unshift('\'backbone\'');
            use.backbone = true;
        }
        if (use.backbone && !use.underscore) {
            generator.depList.unshift('\'underscore\'');
            use.underscore = true;
        }
        generator.dependencies = generator.depList.map(removeSingleQuotes);
        generator.defineArguments = generator.dependencies
            .map(aliasFor)
            .join(', ');
        generator.iifeArguments = ['root']
            .concat(generator.dependencies)
            .map(aliasFor)
            .join(', ');
        generator.requireStatements = generator.dependencies
            .map(requireStatementFor)
            .join('\n\t\t');
        copyTpl('umd.template.js', `${pathBase}${pluginName}.js`, generator);
    }
};
