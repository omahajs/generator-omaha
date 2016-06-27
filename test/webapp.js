'use strict';

var path    = require('path');
var _       = require('underscore');
var sinon   = require('sinon');
var helpers = require('yeoman-test');
var assert  = require('yeoman-assert');
var base    = require('yeoman-generator').generators.Base;

var prompts = require('../generators/app/prompts');

function createProject() {
    return helpers.run(path.join(__dirname, '../generators/project'))
        .withOptions({skipInstall: true})
        .withPrompts(prompts.project.defaults)
        .toPromise();
}
function verifyWebappDetails() {
    var ALWAYS_INCLUDED = [
        'README.md',
        'config/.csslintrc',
        'tasks/build.js',
        'tasks/app.js'
    ];
    ALWAYS_INCLUDED.forEach(file => assert.file(file));
}
function verifyWebappConfigs() {
    //a11y
    assert.fileContent('Gruntfile.js', 'a11y: ');
    assert.fileContent('Gruntfile.js', 'accessibility: ');
    assert.fileContent('Gruntfile.js', 'aria-audit');
    //browserify

    //handlebars
    assert.fileContent('Gruntfile.js', 'handlebars: ');

}

describe('Webapp generator', function() {
    this.timeout(800);
    var stub;
    var SKIP_INSTALL = {skipInstall: true};
    before(function() {
        stub = sinon.stub(base.prototype.user.git, 'name');
        stub.returns(null);
    });
    after(function() {
        stub.restore();
    });
    it('can create and configure files with default prompt choices', function() {
        return helpers.run(path.join(__dirname, '../generators/webapp'))
            .inTmpDir(createProject)
            .withOptions(SKIP_INSTALL)
            .withPrompts(prompts.webapp.defaults)
            .toPromise()
            .then(function() {
                verifyWebappDetails();
                verifyWebappConfigs();
            });
    });
});
describe('Default generator', function() {
    this.timeout(800);
    var stub;
    var SKIP_INSTALL = {skipInstall: true};
    describe('can create and configure files with prompt choices', function() {
        before(function() {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
        });
        after(function() {
            stub.restore();
        });
        it('all prompts TRUE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(_.extend({}, prompts.project.defaults, prompts.webapp.defaults))
                .toPromise()
                .then(function() {
                    verifyWebappDetails();
                    verifyWebappConfigs();
                });
        });
        it('all prompts FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(_.extend({}, prompts.project.defaults, prompts.webapp.defaults))
                .toPromise()
                .then(function() {
                    verifyWebappDetails();
                    verifyWebappConfigs();
                });
        });
    });
});
