'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('techtonic:module', function() {
    var moduleName = 'foo'
    var moduleDescription = 'bar';
    before(function(done) {
        helpers.run(path.join(__dirname, '../generators/module'))
            .withArguments([moduleName])
            .withOptions({skipInstall: true})
            .withPrompts({
                dependencies: [],
                moduleDescription: moduleDescription
            })
            .on('end', done);
    });
    it('creates vanilla JS module with appropriate name', function() {
        assert.file('app/modules/' + moduleName + '.umd.js');
    });
    it('configures module', function() {
        assert.fileContent('app/modules/foo.umd.js', '* @file ' + moduleDescription);
    });
});
