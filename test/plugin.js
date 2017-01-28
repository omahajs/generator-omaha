'use strict';

var sinon   = require('sinon');
var path    = require('path');
var helpers = require('yeoman-test');
var assert  = require('yeoman-assert');

function createPlugin(options) {
    var testOptions = {};
    if (options.customDependency && options.alias) {
        testOptions.customDependency = options.customDependency;
        testOptions.alias = options.alias;
    } else {
        options.dependencies.forEach(function(dep) {
            testOptions[dep] = true;
        });
    }
    return helpers.run(path.join(__dirname, '../generators/plugin'))
        .withLocalConfig({pluginDirectory: './'})
        .withArguments([options.name])
        .withPrompts({dependencies: options.dependencies})
        .withOptions(options.useCommandLineOptions ? testOptions : {})
        .toPromise();
}

describe('Plugin generator', function() {
    var pluginName = 'pluginName';
    var pluginPath = 'app/plugins/' + pluginName + '.js';
    it('can create a vanilla JavaScript plugin', function() {
        return createPlugin({
            name: pluginName,
            dependencies: []
        }).then(function() {
            assert.fileContent(pluginPath, '* @exports ' + pluginName);
            assert.fileContent(pluginPath, 'define([], function() {');
            assert.fileContent(pluginPath, 'module.exports = factory(root);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root);')
            assert.fileContent(pluginPath, '}(this, function(root) {');
            ['jquery', 'underscore', 'backbone', 'marionette'].forEach(function(alias) {
                assert.noFileContent(pluginPath, 'var ' + alias + ' = require(\'');
            });
        });
    });
    it('can create a jQuery plugin', function() {
        return createPlugin({
            name: pluginName,
            dependencies: ['jquery']
        }).then(function() {
            assert.fileContent(pluginPath, '* @exports ' + pluginName);
            assert.fileContent(pluginPath, 'define([\'jquery\'], function($) {');
            assert.fileContent(pluginPath, 'var $ = require(\'jquery\');');
            assert.fileContent(pluginPath, 'module.exports = factory(root, $);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, $);')
            assert.fileContent(pluginPath, '}(this, function(root, $) {');
        });
    });
    it('can create an Underscore.js plugin', function() {
        return createPlugin({
            name: pluginName,
            dependencies: ['underscore']
        }).then(function() {
            assert.fileContent(pluginPath, '* @exports ' + pluginName);
            assert.fileContent(pluginPath, 'define([\'underscore\'], function(_) {');
            assert.fileContent(pluginPath, 'var _ = require(\'underscore\');');
            assert.fileContent(pluginPath, 'module.exports = factory(root, _);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, _);')
            assert.fileContent(pluginPath, '}(this, function(root, _) {');
        });
    });
    it('can create a Backbone.js plugin', function() {
        return createPlugin({
            name: pluginName,
            dependencies: ['backbone']
        }).then(function() {
            assert.fileContent(pluginPath, '* @exports ' + pluginName);
            assert.fileContent(pluginPath, 'define([\'underscore\',\'backbone\'], function(_, Backbone) {');
            assert.fileContent(pluginPath, 'module.exports = factory(root, _, Backbone);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, _, Backbone);')
            assert.fileContent(pluginPath, '}(this, function(root, _, Backbone) {');
        });
    });
    it('can create a MarionetteJS plugin', function() {
        return createPlugin({
            name: pluginName,
            dependencies: ['marionette']
        }).then(function() {
            assert.fileContent(pluginPath, '* @exports ' + pluginName);
            assert.fileContent(pluginPath, 'define([\'underscore\',\'backbone\',\'marionette\'], function(_, Backbone, Marionette) {');
            assert.fileContent(pluginPath, 'module.exports = factory(root, _, Backbone, Marionette);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, _, Backbone, Marionette);')
            assert.fileContent(pluginPath, '}(this, function(root, _, Backbone, Marionette) {');
        });
    });
    it('can create a MarionetteJS plugin using command line options', function() {
        return createPlugin({
            name: pluginName,
            dependencies: ['marionette'],
            useCommandLineOptions: true
        }).then(function() {
            assert.fileContent(pluginPath, '* @exports ' + pluginName);
            assert.fileContent(pluginPath, 'define([\'underscore\',\'backbone\',\'marionette\'], function(_, Backbone, Marionette) {');
            assert.fileContent(pluginPath, 'module.exports = factory(root, _, Backbone, Marionette);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, _, Backbone, Marionette);')
            assert.fileContent(pluginPath, '}(this, function(root, _, Backbone, Marionette) {');
        });
    });
    it('can create a plugin with a custom dependency', function() {
        return createPlugin({
            name: pluginName,
            dependencies: [],
            customDependency: 'FooBar',
            alias: 'foo',
            useCommandLineOptions: true
        }).then(function() {
            assert.fileContent(pluginPath, '* @exports ' + pluginName);
            assert.fileContent(pluginPath, 'define([\'FooBar\'], function(foo) {');
            assert.fileContent(pluginPath, 'var foo = require(\'FooBar\');');
            assert.fileContent(pluginPath, 'module.exports = factory(root, foo);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, foo);')
            assert.fileContent(pluginPath, '}(this, function(root, foo) {');
        });
    });
});
