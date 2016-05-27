'use strict';

var path    = require('path');
var assert  = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var base    = require('yeoman-generator').generators.Base;
var sinon   = require('sinon');

var appDir = './';
var pluginPath;
var moduleDirectory = 'app/modules/';
var pluginName;
var pluginDescription;

function testModuleConfig(pluginType, pluginTypeAlias) {
    var stub;
    var dependencies = ['jquery', 'underscore', 'backbone'];
    var aliases = ['$', '_', 'Backbone'];
    describe(pluginType.toUpperCase() + ' plugin', function() {
        before(function(done) {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
            pluginName = 'plugin'
            pluginDescription = 'foo';
            pluginPath = moduleDirectory + pluginType + '.' + pluginName + '.js';
            helpers.run(path.join(__dirname, '../generators/plugin'))
                .withLocalConfig({appDir: appDir})
                .withArguments([pluginName])
                .withPrompts({
                    dependencies: [pluginType],
                    pluginDescription: pluginDescription
                })
                .on('end', done);
        });
        after(function() {
            stub.restore();
        });
        it('creates ' + pluginType +' JS plugin with appropriate name', function() {
            assert.fileContent(pluginPath, '* @file ' + pluginDescription);
            assert.fileContent(pluginPath, '* @exports ' + pluginName);
        });
        describe('when configuring the plugin for AMD, CommonJS and globals', function() {
            it('configures the plugin to work with AMD, CommonJS, and globals', function() {
                assert.fileContent(pluginPath, 'define([\'' + pluginType + '\'], function(' + pluginTypeAlias + ') {');
                assert.fileContent(pluginPath, 'module.exports = factory(root, ' + pluginTypeAlias + ');');
                if (pluginType === 'jquery') {
                    assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, jQuery);');
                } else  {
                    assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, ' + pluginType + ');');
                }
                assert.fileContent(pluginPath, '}(this, function(root, ' + pluginTypeAlias + ') {');
            });
            dependencies.splice(dependencies.indexOf(pluginType), 1);
            dependencies.forEach(function(dep) {
                it('Does NOT add ' + dep + ' dependency', function() {
                    assert.noFileContent(pluginPath, dep);
                });
            });
            aliases.splice(aliases.indexOf(pluginTypeAlias), 1);
            aliases.forEach(function(alias) {
                it('Does NOT add ' + alias + ' CommonJS support', function() {
                    assert.noFileContent(pluginPath, 'var ' + alias + ' = require(');
                })
            });
        });
    });
}

describe('Vanilla UMD plugin', function() {
    var dependencies = ['jquery', 'underscore', 'backbone'];
    var aliases = ['$', '_', 'Backbone'];
    before(function(done) {
        pluginName = 'vanilla'
        pluginDescription = 'bar';
        pluginPath = moduleDirectory + pluginName + '.js';
        helpers.run(path.join(__dirname, '../generators/plugin'))
            .withLocalConfig({appDir: appDir})
            .withArguments([pluginName])
            .withPrompts({
                dependencies: [],
                pluginDescription: pluginDescription
            })
            .on('end', done);
    });
    it('creates a vanilla JS plugin with an appropriate name', function() {
        assert.fileContent(pluginPath, '* @file ' + pluginDescription);
        assert.fileContent(pluginPath, '* @exports ' + pluginName);
    });
    describe('when configuring the plugin for AMD, CommonJS and globals', function() {
        it('configures the plugin to work with AMD, CommonJS, and globals', function() {
            assert.fileContent(pluginPath, 'define([], function() {');
            assert.fileContent(pluginPath, 'module.exports = factory(root);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root);')
            assert.fileContent(pluginPath, '}(this, function(root) {');
        });
        dependencies.forEach(function(dep) {
            it('Does NOT add ' + dep + ' dependency', function() {
                assert.noFileContent(pluginPath, dep);
            });
        });
        aliases.forEach(function(alias) {
            it('Does NOT add ' + alias + ' CommonJS support', function() {
                assert.noFileContent(pluginPath, 'var ' + alias + ' = require(\')');
            })
        });
    });
});
testModuleConfig('jquery', '$');
testModuleConfig('underscore', '_');
describe('BACKBONE plugin', function() {
    before(function(done) {
        pluginName = 'plugin'
        pluginDescription = 'foo';
        pluginPath = moduleDirectory + 'backbone.' + pluginName + '.js';
        helpers.run(path.join(__dirname, '../generators/plugin'))
            .withLocalConfig({appDir: appDir})
            .withArguments([pluginName])
            .withPrompts({
                dependencies: ['backbone'],
                pluginDescription: pluginDescription
            })
            .on('end', done);
    });
    it('creates a Backbone JS plugin with an appropriate name', function() {
        assert.fileContent(pluginPath, '* @file ' + pluginDescription);
        assert.fileContent(pluginPath, '* @exports ' + pluginName);
    });
    describe('when configuring the plugin for AMD, CommonJS and globals', function() {
        it('configures the plugin to work with AMD, CommonJS, and globals', function() {
            assert.fileContent(pluginPath, 'define([\'underscore\',\'backbone\'], function(_, Backbone) {');
            assert.fileContent(pluginPath, 'module.exports = factory(root, _, Backbone);');
            assert.fileContent(pluginPath, 'root.' + pluginName + ' = factory(root, underscore, Backbone);')
            assert.fileContent(pluginPath, '}(this, function(root, _, Backbone) {');
        });
        it('Does NOT add jquery dependency', function() {
            assert.noFileContent(pluginPath, 'jquery');
            assert.noFileContent(pluginPath, '$');
        })
    });
});
