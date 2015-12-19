'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

var dependencies = ['jquery', 'underscore', 'backbone'];
var aliases = ['$', '_', 'Backbone'];
var modulePath;
var moduleDirectory = 'app/modules/';
var moduleName;
var moduleDescription;

describe('vanilla module', function() {
    before(function(done) {
        moduleName = 'vanilla'
        moduleDescription = 'bar';
        modulePath = moduleDirectory + moduleName + '.js';
        helpers.run(path.join(__dirname, '../generators/module'))
            .withArguments([moduleName])
            .withPrompts({
                dependencies: [],
                moduleDescription: moduleDescription
            })
            .on('end', done);
    });
    it('creates a vanilla JS module with an appropriate name', function() {
        assert.file(moduleDirectory + moduleName + '.js');
        assert.fileContent(modulePath, '* @file ' + moduleDescription);
        assert.fileContent(modulePath, '* @module ' + moduleName);
    });
    describe('when configuring the module for AMD, CommonJS and globals', function() {
        it('configures the module to work with AMD, CommonJS, and globals', function() {
            assert.fileContent(modulePath, 'define([], function() {');
            assert.fileContent(modulePath, 'module.exports = factory(root);');
            assert.fileContent(modulePath, 'root.' + moduleName + ' = factory(root);')
            assert.fileContent(modulePath, '}(this, function(root) {');
        });
        dependencies.forEach(function(dep) {
            it('Does NOT add ' + dep + ' dependency', function() {
                assert.noFileContent(modulePath, dep);
            });
        });
        aliases.forEach(function(alias) {
            it('Does NOT add ' + alias + ' CommonJS support', function() {
                assert.noFileContent(modulePath, 'var ' + alias + ' = require(\')');
            })
        });
    });
});
describe('jQuery module', function() {
    before(function(done) {
        moduleName = 'vanilla'
        moduleDescription = 'bar';
        modulePath = moduleDirectory + moduleName + '.js';
        helpers.run(path.join(__dirname, '../generators/module'))
            .withArguments([moduleName])
            .withPrompts({
                dependencies: [],
                moduleDescription: moduleDescription
            })
            .on('end', done);
    });
    it('creates a vanilla JS module with an appropriate name', function() {
        assert.file(moduleDirectory + moduleName + '.js');
        assert.fileContent(modulePath, '* @file ' + moduleDescription);
        assert.fileContent(modulePath, '* @module ' + moduleName);
    });
    describe('when configuring the module for AMD, CommonJS and globals', function() {
        it('configures the module to work with AMD, CommonJS, and globals', function() {
            assert.fileContent(modulePath, 'define([], function() {');
            assert.fileContent(modulePath, 'module.exports = factory(root);');
            assert.fileContent(modulePath, 'root.' + moduleName + ' = factory(root);')
            assert.fileContent(modulePath, '}(this, function(root) {');
        });
        dependencies.forEach(function(dep) {
            it('Does NOT add ' + dep + ' dependency', function() {
                assert.noFileContent(modulePath, dep);
            });
        });
        aliases.forEach(function(alias) {
            it('Does NOT add ' + alias + ' CommonJS support', function() {
                assert.noFileContent(modulePath, 'var ' + alias + ' = require(\')');
            })
        });
    });
});
