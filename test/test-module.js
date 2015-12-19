'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

var modulePath;
var moduleDirectory = 'app/modules/';
var moduleName;
var moduleDescription;

function testModuleConfig(moduleType, moduleTypeAlias) {
    var dependencies = ['jquery', 'underscore', 'backbone'];
    var aliases = ['$', '_', 'Backbone'];
    describe(moduleType.toUpperCase() + ' module', function() {
        before(function(done) {
            moduleName = 'plugin'
            moduleDescription = 'foo';
            modulePath = moduleDirectory + moduleType + '.' + moduleName + '.js';
            helpers.run(path.join(__dirname, '../generators/module'))
                .withArguments([moduleName])
                .withPrompts({
                    dependencies: [moduleType],
                    moduleDescription: moduleDescription
                })
                .on('end', done);
        });
        it('creates ' + moduleType +' JS module with appropriate name', function() {
            assert.fileContent(modulePath, '* @file ' + moduleDescription);
            assert.fileContent(modulePath, '* @module ' + moduleName);
        });
        describe('when configuring the module for AMD, CommonJS and globals', function() {
            it('configures the module to work with AMD, CommonJS, and globals', function() {
                assert.fileContent(modulePath, 'define([\'' + moduleType + '\'], function(' + moduleTypeAlias + ') {');
                assert.fileContent(modulePath, 'module.exports = factory(root, ' + moduleTypeAlias + ');');
                if (moduleType === 'jquery') {
                    assert.fileContent(modulePath, 'root.' + moduleName + ' = factory(root, jQuery);');
                } else {
                    assert.fileContent(modulePath, 'root.' + moduleName + ' = factory(root, ' + moduleTypeAlias + ');');
                }
                assert.fileContent(modulePath, '}(this, function(root, ' + moduleTypeAlias + ') {');
            });
            dependencies.splice(dependencies.indexOf(moduleType), 1);
            dependencies.forEach(function(dep) {
                it('Does NOT add ' + dep + ' dependency', function() {
                    assert.noFileContent(modulePath, dep);
                });
            });
            aliases.splice(aliases.indexOf(moduleTypeAlias), 1);
            aliases.forEach(function(alias) {
                it('Does NOT add ' + alias + ' CommonJS support', function() {
                    assert.noFileContent(modulePath, 'var ' + alias + ' = require(');
                })
            });
        });
    });
}

describe('Vanilla UMD module', function() {
    var dependencies = ['jquery', 'underscore', 'backbone'];
    var aliases = ['$', '_', 'Backbone'];
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
testModuleConfig('jquery', '$');
testModuleConfig('underscore', '_');
describe('BACKBONE module', function() {
    before(function(done) {
        moduleName = 'plugin'
        moduleDescription = 'foo';
        modulePath = moduleDirectory + 'backbone.' + moduleName + '.js';
        helpers.run(path.join(__dirname, '../generators/module'))
            .withArguments([moduleName])
            .withPrompts({
                dependencies: ['underscore', 'backbone'],
                moduleDescription: moduleDescription
            })
            .on('end', done);
    });
    it('creates a Backbone JS module with an appropriate name', function() {
        assert.fileContent(modulePath, '* @file ' + moduleDescription);
        assert.fileContent(modulePath, '* @module ' + moduleName);
    });
    describe('when configuring the module for AMD, CommonJS and globals', function() {
        it('configures the module to work with AMD, CommonJS, and globals', function() {
            assert.fileContent(modulePath, 'define([\'underscore\',\'backbone\'], function(_, Backbone) {');
            assert.fileContent(modulePath, 'module.exports = factory(root, _, Backbone);');
            assert.fileContent(modulePath, 'root.' + moduleName + ' = factory(root, _, Backbone);')
            assert.fileContent(modulePath, '}(this, function(root, _, Backbone) {');
        });
        it('Does NOT add jquery dependency', function() {
            assert.noFileContent(modulePath, 'jquery');
            assert.noFileContent(modulePath, '$');
        })
    });
});
