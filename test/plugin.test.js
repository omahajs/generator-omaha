/* eslint-disable promise/always-return */
const {join}  = require('path');
const helpers = require('yeoman-test');
const {fileContent, noFileContent}  = require('yeoman-assert');

const createPlugin = options => {
    const testOptions = {};
    if (options.customDependency && options.alias) {
        testOptions.customDependency = options.customDependency;
        testOptions.alias = options.alias;
    } else {
        options.dependencies.forEach(dep => {
            testOptions[dep] = true;
        });
    }
    const {dependencies} = options;
    return helpers.run(join(__dirname, '../generators/plugin'))
        .withLocalConfig({pluginDirectory: './'})
        .withArguments([options.name])
        .withPrompts({dependencies})
        .withOptions(options.useCommandLineOptions ? testOptions : {})
        .toPromise();
};

describe('Plugin generator', () => {
    const name = 'pluginName';
    const pluginPath = `app/plugins/${name}.js`;
    it('can create a vanilla JavaScript plugin', () => {
        const dependencies = [];
        return createPlugin({name, dependencies}).then(() => {
            fileContent(pluginPath, `* @exports ${name}`);
            fileContent(pluginPath, 'define([], function() {');
            fileContent(pluginPath, 'module.exports = factory(root);');
            fileContent(pluginPath, `root.${name} = factory(root);`);
            fileContent(pluginPath, '}(this, function(root) {');
            ['jquery', 'underscore', 'backbone', 'marionette'].forEach(alias => {
                noFileContent(pluginPath, `var ${alias} = require('`);
            });
        });
    });
    it('can create a jQuery plugin', () => {
        const dependencies = ['jquery'];
        return createPlugin({name, dependencies}).then(() => {
            fileContent(pluginPath, `* @exports ${name}`);
            fileContent(pluginPath, 'define([\'jquery\'], function($) {');
            fileContent(pluginPath, 'var $ = require(\'jquery\');');
            fileContent(pluginPath, 'module.exports = factory(root, $);');
            fileContent(pluginPath, `root.${name} = factory(root, $);`);
            fileContent(pluginPath, '}(this, function(root, $) {');
        });
    });
    it('can create an Underscore.js plugin', () => {
        const dependencies = ['underscore'];
        return createPlugin({name, dependencies}).then(() => {
            fileContent(pluginPath, `* @exports ${name}`);
            fileContent(pluginPath, 'define([\'underscore\'], function(_) {');
            fileContent(pluginPath, 'var _ = require(\'underscore\');');
            fileContent(pluginPath, 'module.exports = factory(root, _);');
            fileContent(pluginPath, `root.${name} = factory(root, _);`);
            fileContent(pluginPath, '}(this, function(root, _) {');
        });
    });
    it('can create a Backbone.js plugin', () => {
        const dependencies = ['backbone'];
        return createPlugin({name, dependencies}).then(() => {
            fileContent(pluginPath, `* @exports ${name}`);
            fileContent(pluginPath, 'define([\'underscore\',\'backbone\'], function(_, Backbone) {');
            fileContent(pluginPath, 'module.exports = factory(root, _, Backbone);');
            fileContent(pluginPath, `root.${name} = factory(root, _, Backbone);`);
            fileContent(pluginPath, '}(this, function(root, _, Backbone) {');
        });
    });
    it('can create a MarionetteJS plugin', () => {
        const dependencies = ['marionette'];
        return createPlugin({name, dependencies}).then(() => {
            fileContent(pluginPath, `* @exports ${name}`);
            fileContent(pluginPath, 'define([\'underscore\',\'backbone\',\'marionette\'], function(_, Backbone, Marionette) {');
            fileContent(pluginPath, 'module.exports = factory(root, _, Backbone, Marionette);');
            fileContent(pluginPath, `root.${name} = factory(root, _, Backbone, Marionette);`);
            fileContent(pluginPath, '}(this, function(root, _, Backbone, Marionette) {');
        });
    });
    it('can create a MarionetteJS plugin using command line options', () => {
        const dependencies = ['marionette'];
        return createPlugin({name, dependencies, useCommandLineOptions: true}).then(() => {
            fileContent(pluginPath, `* @exports ${name}`);
            fileContent(pluginPath, 'define([\'underscore\',\'backbone\',\'marionette\'], function(_, Backbone, Marionette) {');
            fileContent(pluginPath, 'module.exports = factory(root, _, Backbone, Marionette);');
            fileContent(pluginPath, `root.${name} = factory(root, _, Backbone, Marionette);`);
            fileContent(pluginPath, '}(this, function(root, _, Backbone, Marionette) {');
        });
    });
    it('can create a plugin with a custom dependency', () => createPlugin({
        name,
        dependencies: [],
        customDependency: 'FooBar',
        alias: 'foo',
        useCommandLineOptions: true
    }).then(() => {
        fileContent(pluginPath, `* @exports ${name}`);
        fileContent(pluginPath, 'define([\'FooBar\'], function(foo) {');
        fileContent(pluginPath, 'var foo = require(\'FooBar\');');
        fileContent(pluginPath, 'module.exports = factory(root, foo);');
        fileContent(pluginPath, `root.${name} = factory(root, foo);`);
        fileContent(pluginPath, '}(this, function(root, foo) {');
    }));
});
