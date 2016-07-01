'use strict';

var path    = require('path');
var _       = require('underscore');
var sinon   = require('sinon');
var helpers = require('yeoman-test');
var assert  = require('yeoman-assert');
var base    = require('yeoman-generator').generators.Base;

var prompts = require('../generators/app/prompts');

var SKIP_INSTALL = {skipInstall: true};
var browserifyContent = [
    ['package.json', '"browser":'],
    ['package.json', '"browserify":'],
    ['package.json', '"aliasify":'],
    ['Gruntfile.js', 'browserify'],
    ['Gruntfile.js', 'replace:'],
    ['Gruntfile.js', 'uglify:']
];
var a11yContent = [
    ['Gruntfile.js', 'a11y: '],
    ['Gruntfile.js', 'accessibility: '],
    ['Gruntfile.js', 'aria-audit']
];
function createProject() {
    return helpers.run(path.join(__dirname, '../generators/project'))
        .withOptions({skipInstall: true})
        .withPrompts(prompts.project.defaults)
        .toPromise();
}
function verifyCoreFiles() {
    var ALWAYS_INCLUDED = [
        'README.md',
        'config/.csslintrc',
        'tasks/build.js',
        'tasks/app.js'
    ];
    ALWAYS_INCLUDED.forEach(file => assert.file(file));
}
function verifyBoilerplateFiles(appDir) {
    var files = [
        'app/index.html',
        'app/app.js',
        'app/main.js',
        'app/config.js',
        'app/router.js',
        'assets/images/logo.png',
        'app/controllers/example.webworker.js'
    ];
    files
        .map(function(fileName) {return appDir + fileName;})
        .forEach(file => assert.file(file));
}
function verifyDefaultConfiguration() {
    // a11y
    assert.fileContent(a11yContent);
    // imagemin
    assert.fileContent('Gruntfile.js', 'imagemin: ');
    // script bundler
    assert.noFileContent(browserifyContent);
    // css pre-processor
    assert.fileContent('Gruntfile.js', 'less: ');
    assert.noFileContent('Gruntfile.js', 'sass: ');
    // template technology
    assert.noFileContent('Gruntfile.js', 'jst');
    assert.fileContent('Gruntfile.js', 'handlebars');
}

describe('Webapp generator', function() {
    this.timeout(800);
    var stub;
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
            .withLocalConfig({projectName: 'tech'})
            .toPromise()
            .then(function() {
                verifyCoreFiles();
                verifyBoilerplateFiles('./');
            });
    });
});
describe('Default generator', function() {
    this.timeout(800);
    var stub;
    var ALL_TRUE = _.extend({}, prompts.project.defaults, prompts.webapp.defaults);
    var ALL_FALSE = _.mapObject(ALL_TRUE, function(option) {return _.isBoolean(option) ? false : option;});
    describe('can create and configure files with prompt choices', function() {
        before(function() {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
        });
        after(function() {
            stub.restore();
        });
        it('all prompts FALSE (default configuration)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(ALL_FALSE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent(browserifyContent);
                    assert.noFileContent(a11yContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('all prompts TRUE (default configuration)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    verifyDefaultConfiguration();
                });
        });
        it('all prompts TRUE (--script-bundler browserify)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(_.extend({}, SKIP_INSTALL, {scriptBundler: 'browserify'}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent(browserifyContent);
                    assert.fileContent(a11yContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');

                });
        });
        it('all prompts TRUE (--css-preprocessor sass)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(_.extend({}, SKIP_INSTALL, {cssPreprocessor: 'sass'}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent('Gruntfile.js', 'sass: ');
                    assert.noFileContent('Gruntfile.js', 'less: ');
                });
        });
        it('all prompts TRUE (--template-technology underscore)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(_.extend({}, SKIP_INSTALL, {templateTechnology: 'underscore'}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent('Gruntfile.js', 'jst');
                    assert.noFileContent('Gruntfile.js', 'handlebars');
                });
        });
        it('only a11y option FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(_.extend({}, ALL_TRUE, {a11y: false}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent(a11yContent);
                });
        });
        it('only imagemin option FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(_.extend({}, ALL_TRUE, {imagemin: false}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('select browserify via prompt', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(_.extend({}, ALL_TRUE, {scriptBundler: 'browserify'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent(browserifyContent);
                    assert.fileContent(a11yContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');

                });
        });
    });
    describe('can create and configure files with with command line options', function() {
        before(function() {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
        });
        after(function() {
            stub.restore();
        });
        it('--defaults', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(_.extend({}, SKIP_INSTALL, {defaults: true}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    verifyDefaultConfiguration();
                });
        });
        it('--defaults --script-bundler browserify', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(_.extend({}, SKIP_INSTALL, {defaults: true, scriptBundler: 'browserify'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent(browserifyContent);
                });
        });
        it('--defaults --css-preprocessor sass', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(_.extend({}, SKIP_INSTALL, {defaults: true, cssPreprocessor: 'sass'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent('Gruntfile.js', 'sass: ');
                    assert.noFileContent('Gruntfile.js', 'less: ');
                });
        });
        it('--defaults --css-preprocessor none', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(_.extend({}, SKIP_INSTALL, {defaults: true, cssPreprocessor: 'none'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent('Gruntfile.js', 'sass: ');
                    assert.noFileContent('Gruntfile.js', 'less: ');
                });
        });
        it('--defaults --template-technology underscore', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(_.extend({}, SKIP_INSTALL, {defaults: true, templateTechnology: 'underscore'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent('Gruntfile.js', 'jst');
                    assert.noFileContent('Gruntfile.js', 'handlebars');
                });
        });
    });
});
describe('Default generator (with custom source directory)', function() {
    this.timeout(800);
    var stub;
    var ALL_TRUE = _.extend({}, prompts.project.defaults, prompts.webapp.defaults);
    var ALL_FALSE = _.mapObject(ALL_TRUE, function(option) {return _.isBoolean(option) ? false : option;});
    var sourceDirectory = 'webapp/';
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
                .withPrompts(_.extend(ALL_TRUE, {appDir: sourceDirectory}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles(sourceDirectory);
                    verifyDefaultConfiguration();
                });
        });
        it('all prompts FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(_.extend(ALL_FALSE, {appDir: sourceDirectory}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles(sourceDirectory);
                    assert.noFileContent(browserifyContent);
                    assert.noFileContent(a11yContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('only a11y option FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(_.extend({}, ALL_TRUE, {appDir: sourceDirectory, a11y: false}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles(sourceDirectory);
                    assert.noFileContent(browserifyContent);
                    assert.noFileContent(a11yContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('only imagemin option FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(_.extend({}, ALL_TRUE, {appDir: sourceDirectory, imagemin: false}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles(sourceDirectory);
                    assert.noFileContent(browserifyContent);
                    assert.fileContent(a11yContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
    });
});
