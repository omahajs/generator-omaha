'use strict';

var sinon   = require('sinon');
var path    = require('path');
var base    = require('yeoman-generator').generators.Base;
var helpers = require('yeoman-test');
var assert  = require('yeoman-assert');

var createPlugin = require('./helpers').createPlugin;

var appDir = './';
var pluginName= 'pluginName';
var pluginDirectory = 'app/plugins/';
var pluginPath = pluginDirectory + pluginName + '.js';

describe('Plugin generator', function() {
    it('can create a vanilla JavaScript plugin', function(done) {
        createPlugin({
            name: pluginName,
            dependencies: []
        }).then(function() {
            assert.fileContent(pluginPath, '* @exports ' + pluginName);
            assert.fileContent(pluginPath, 'define([], function() {');
            assert.fileContent(pluginPath, 'module.exports = factory(root);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root);')
            assert.fileContent(pluginPath, '}(this, function(root) {');
            ['jquery', 'underscore', 'backbone', 'marionette'].forEach(function(alias) {
                assert.noFileContent(pluginPath, 'var ' + alias + ' = require(\')');
            });
            done();
        });
    });
    it('can create a jQuery plugin', function(done) {
        createPlugin({
            name: pluginName,
            dependencies: ['jquery']
        }).then(function() {
            assert.fileContent(pluginPath, '* @exports ' + pluginName);
            assert.fileContent(pluginPath, 'define([\'jquery\'], function($) {');
            assert.fileContent(pluginPath, 'module.exports = factory(root, $);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, $);')
            assert.fileContent(pluginPath, '}(this, function(root, $) {');
            done();
        });
    });
    it('can create an Underscore.js plugin', function(done) {
        createPlugin({
            name: pluginName,
            dependencies: ['underscore']
        }).then(function() {
            assert.fileContent(pluginPath, '* @exports ' + pluginName);
            assert.fileContent(pluginPath, 'define([\'underscore\'], function(_) {');
            assert.fileContent(pluginPath, 'module.exports = factory(root, _);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, _);')
            assert.fileContent(pluginPath, '}(this, function(root, _) {');
            done();
        });
    });
    it('can create a Backbone.js plugin', function(done) {
        createPlugin({
            name: pluginName,
            dependencies: ['backbone']
        }).then(function() {
            assert.fileContent(pluginPath, '* @exports ' + pluginName);
            assert.fileContent(pluginPath, 'define([\'underscore\',\'backbone\'], function(_, Backbone) {');
            assert.fileContent(pluginPath, 'module.exports = factory(root, _, Backbone);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, _, Backbone);')
            assert.fileContent(pluginPath, '}(this, function(root, _, Backbone) {');
            done();
        });
    });
    it('can create a MarionetteJS plugin', function() {
        createPlugin({
            name: pluginName,
            dependencies: ['marionette']
        }).then(function() {
            assert.fileContent(pluginPath, '* @exports ' + pluginName);
            assert.fileContent(pluginPath, 'define([\'underscore\',\'backbone\',\'marionette\'], function(_, Backbone, Marionette) {');
            assert.fileContent(pluginPath, 'module.exports = factory(root, _, Backbone, Marionette);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, _, Backbone, Marionette);')
            assert.fileContent(pluginPath, '}(this, function(root, _, Backbone, Marionette) {');
            done();
        });
    });
    it('can create a MarionetteJS plugin using command line options', function(done) {
        createPlugin({
            name: pluginName,
            dependencies: ['marionette'],
            useCommandLineOptions: true
        }).then(function() {
            assert.fileContent(pluginPath, '* @exports ' + pluginName);
            assert.fileContent(pluginPath, 'define([\'underscore\',\'backbone\',\'marionette\'], function(_, Backbone, Marionette) {');
            assert.fileContent(pluginPath, 'module.exports = factory(root, _, Backbone, Marionette);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, _, Backbone, Marionette);')
            assert.fileContent(pluginPath, '}(this, function(root, _, Backbone, Marionette) {');
            done();
        });
    });
    it('can create a plugin with a custom dependency', function(done) {
        createPlugin({
            name: pluginName,
            dependencies: [],
            customDependency: 'FooBar',
            alias: 'foo',
            useCommandLineOptions: true
        }).then(function() {
            assert.fileContent(pluginPath, '* @exports ' + pluginName);
            assert.fileContent(pluginPath, 'define([\'FooBar\'], function(foo) {');
            assert.fileContent(pluginPath, 'module.exports = factory(root, foo);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, foo);')
            assert.fileContent(pluginPath, '}(this, function(root, foo) {');
            done();
        });
    });
});
