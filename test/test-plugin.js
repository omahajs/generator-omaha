'use strict';

var sinon   = require('sinon');
var path    = require('path');
var assert  = require('yeoman-generator').assert;
var base    = require('yeoman-generator').generators.Base;
var helpers = require('./helpers');

var createPlugin = helpers.createPlugin;

var appDir = './';
var pluginName= 'pluginName';
var pluginDirectory = 'app/plugins/';
var pluginPath = pluginDirectory + pluginName + '.js';

describe('plugin generator', function() {
    before(function(done) {
        createPlugin({
            name: pluginName,
            dependencies: []
        }).on('end', done);
    });
    it('can create a vanilla JavaScript plugin', function() {
        assert.fileContent(pluginPath, '* @exports ' + pluginName);
        assert.fileContent(pluginPath, 'define([], function() {');
        assert.fileContent(pluginPath, 'module.exports = factory(root);');
        assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root);')
        assert.fileContent(pluginPath, '}(this, function(root) {');
        ['jquery', 'underscore', 'backbone', 'marionette'].forEach(function(alias) {
            assert.noFileContent(pluginPath, 'var ' + alias + ' = require(\')');
        });
    });
});
describe('plugin generator', function() {
    before(function(done) {
        createPlugin({
            name: pluginName,
            dependencies: ['jquery']
        }).on('end', done);
    });
    it('can create a jQuery plugin', function() {
        assert.fileContent(pluginPath, '* @exports ' + pluginName);
        assert.fileContent(pluginPath, 'define([\'jquery\'], function($) {');
        assert.fileContent(pluginPath, 'module.exports = factory(root, $);');
        assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, $);')
        assert.fileContent(pluginPath, '}(this, function(root, $) {');
    });
});
describe('plugin generator', function() {
    before(function(done) {
        createPlugin({
            name: pluginName,
            dependencies: ['underscore']
        }).on('end', done);
    });
    it('can create an Underscore.js plugin', function() {
        assert.fileContent(pluginPath, '* @exports ' + pluginName);
        assert.fileContent(pluginPath, 'define([\'underscore\'], function(_) {');
        assert.fileContent(pluginPath, 'module.exports = factory(root, _);');
        assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, _);')
        assert.fileContent(pluginPath, '}(this, function(root, _) {');
    });
});
describe('plugin generator', function() {
    before(function(done) {
        createPlugin({
            name: pluginName,
            dependencies: ['backbone']
        }).on('end', done);
    });
    it('can create a Backbone.js plugin', function() {
        assert.fileContent(pluginPath, '* @exports ' + pluginName);
        assert.fileContent(pluginPath, 'define([\'underscore\',\'backbone\'], function(_, Backbone) {');
        assert.fileContent(pluginPath, 'module.exports = factory(root, _, Backbone);');
        assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, _, Backbone);')
        assert.fileContent(pluginPath, '}(this, function(root, _, Backbone) {');
    });
});
describe('plugin generator', function() {
    before(function(done) {
        createPlugin({
            name: pluginName,
            dependencies: ['marionette']
        }).on('end', done);
    });
    it('can create a MarionetteJS plugin', function() {
        assert.fileContent(pluginPath, '* @exports ' + pluginName);
        assert.fileContent(pluginPath, 'define([\'underscore\',\'backbone\',\'marionette\'], function(_, Backbone, Marionette) {');
        assert.fileContent(pluginPath, 'module.exports = factory(root, _, Backbone, Marionette);');
        assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, _, Backbone, Marionette);')
        assert.fileContent(pluginPath, '}(this, function(root, _, Backbone, Marionette) {');
    });
});
describe('plugin generator', function() {
    before(function(done) {
        createPlugin({
            name: pluginName,
            dependencies: ['marionette'],
            useCommandLineOptions: true
        }).on('end', done);
    });
    it('can create a MarionetteJS plugin using command line options', function() {
        assert.fileContent(pluginPath, '* @exports ' + pluginName);
        assert.fileContent(pluginPath, 'define([\'underscore\',\'backbone\',\'marionette\'], function(_, Backbone, Marionette) {');
        assert.fileContent(pluginPath, 'module.exports = factory(root, _, Backbone, Marionette);');
        assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, _, Backbone, Marionette);')
        assert.fileContent(pluginPath, '}(this, function(root, _, Backbone, Marionette) {');
    });
});
describe('plugin generator', function() {
    before(function(done) {
        createPlugin({
            name: pluginName,
            dependencies: [],
            customDependency: 'FooBar',
            alias: 'foo',
            useCommandLineOptions: true
        }).on('end', done);
    });
    it('can create a plugin with a custom dependency', function() {
        assert.fileContent(pluginPath, '* @exports ' + pluginName);
        assert.fileContent(pluginPath, 'define([\'FooBar\'], function(foo) {');
        assert.fileContent(pluginPath, 'module.exports = factory(root, foo);');
        assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, foo);')
        assert.fileContent(pluginPath, '}(this, function(root, foo) {');
    });
});
