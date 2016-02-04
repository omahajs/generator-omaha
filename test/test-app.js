'use strict';

var path    = require('path');
var assert  = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var base    = require('yeoman-generator').generators.Base;
var sinon   = require('sinon');
var os      = require('os');
var _       = require('underscore');

var SKIP_INSTALL = {skipInstall: true};

var options = require('./options');
//Config files that are ALWAYS created
var configFiles = options.configFiles;
//Project files that are ALWAYS created
var projectFiles = options.projectFiles;
//Files that are ALWAYS created
var files = options.appFiles;
//Dependencies that are CONDITIONALLY installed YES/NO
var dependencies = options.booleanDeps;

var booleanAnswers = function(value) {
    value = value ? true : false;
    return {
        autoFix:        value,
        useJsinspect:   value,
        useBuddyjs:     value,
        useA11y:        value,
        compressImages: value,
        benchmarks:     value,
        useCoveralls:   value
    };
};

function scaffoldApp(appDir, scriptBundler, cssProcessor, answersAllTrue) {
    return helpers.run(path.join(__dirname, '../generators/app'))
        .withOptions(SKIP_INSTALL)
        .withPrompts(_.extend(_.clone(booleanAnswers(answersAllTrue)), {
            appDir: appDir,
            scriptBundler: scriptBundler,
            cssPreprocessor: cssProcessor
        }));
}

function verifyBrowserifySupport(exists, appDir) {
    appDir = appDir ? appDir: './';
    var verify;
    if (exists) {
        verify =  assert.fileContent;
        assert.noFileContent(appDir + '/tasks/build.js', 'requirejs:bundle');
    } else {
        verify = assert.noFileContent;
        assert.fileContent(appDir + '/tasks/build.js', 'requirejs:bundle');
    }
    verify('package.json', '"browserify": {');
    verify('package.json', 'grunt-browserify');
    verify('package.json', 'deamdify');
    verify('package.json', 'aliasify');
    verify('Gruntfile.js', 'browserify: {');
    verify(appDir + '/tasks/build.js', 'browserify:bundle');
    verify(appDir + '/tasks/build.js', 'uglify:bundle');
}

function verifyLessSupport(exists, appDir) {
    appDir = appDir ? appDir : '.';
    var verify;
    if (exists) {
        verify = assert.fileContent;
        assert.file(appDir + '/assets/less/reset.less');
        assert.file(appDir + '/assets/less/style.less');
        assert.noFile(appDir + '/assets/sass/reset.scss');
        assert.noFile(appDir + '/assets/sass/style.scss');
        assert.noFileContent('config/default.js', 'sass/**/*.scss');
        assert.noFileContent('package.json', 'grunt-contrib-sass');
    } else {
        verify = assert.noFileContent;
    }
    verify('config/default.js', 'less/**/*.less');
    verify('package.json', 'grunt-contrib-less');
}

function verifySassSupport(exists, appDir) {
    appDir = appDir ? appDir : '.';
    var verify;
    if (exists) {
        verify = assert.fileContent;
        assert.file(appDir + '/assets/sass/reset.scss');
        assert.file(appDir + '/assets/sass/style.scss');
        assert.noFile(appDir + '/assets/less/reset.less');
        assert.noFile(appDir + '/assets/less/style.less');
        assert.noFileContent('config/default.js', 'less/**/*.less');
        assert.noFileContent('package.json', 'grunt-contrib-less');
    } else {
        verify = assert.noFileContent;
    }
    verify('config/default.js', 'sass/**/*.scss');
    verify('package.json', 'grunt-contrib-sass');
}

describe('app', function() {
    var stub;
    var APPDIR;
    var SCRIPT_BUNDLER;
    var CSS_PROCESSOR;
    var PROMPT_ANSWERS;
    describe('when all options are true (with less support)', function() {
        before(function(done) {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
            APPDIR = './';
            SCRIPT_BUNDLER = 'browserify';
            CSS_PROCESSOR = 'less';
            PROMPT_ANSWERS = true;
            scaffoldApp(APPDIR, SCRIPT_BUNDLER, CSS_PROCESSOR, PROMPT_ANSWERS).on('end', done);
        });
        after(function() {
            stub.restore();
        });
        it('creates and configures files', function() {
            assert.file(configFiles);
            assert.file(projectFiles);
            assert.file(files);
            assert.file('test/benchmarks/example.benchmark.js');
            assert.fileContent('.gitignore', 'app/templates.js');
            assert.fileContent('.gitignore', 'app/style.css');
        });
        it('ADDS Browserify support', function() {
            verifyBrowserifySupport(true);
        });
        it('ADDS only less support', function() {
            verifyLessSupport(true);
        });
        dependencies.forEach(function(dep) {
            it('adds ' + dep + ' to package.json', function() {
                assert.fileContent('package.json', dep);
            });
        });
        it('customizes work-flow tasks', function() {
            assert.fileContent('Gruntfile.js', 'fix: true');
            assert.fileContent('Gruntfile.js', 'less: {');
            assert.noFileContent('Gruntfile.js', 'sass: {');
            assert.fileContent('Gruntfile.js', 'jsinspect: {');
            assert.fileContent('Gruntfile.js', 'buddyjs: {');
            assert.fileContent('Gruntfile.js', 'imagemin: {');
            assert.fileContent('Gruntfile.js', 'a11y: {');
            assert.fileContent('Gruntfile.js', 'accessibility: {');
            assert.fileContent('Gruntfile.js', 'benchmark: {');
            assert.fileContent('Gruntfile.js', 'coveralls: {');
        });
    });
    describe('when all options are false', function() {
        before(function(done) {
                APPDIR = './';
                SCRIPT_BUNDLER = 'requirejs';
                CSS_PROCESSOR = 'none';
                PROMPT_ANSWERS = false;
                scaffoldApp(APPDIR, SCRIPT_BUNDLER, CSS_PROCESSOR, PROMPT_ANSWERS).on('end', done);
        });
        it('creates and configures files', function() {
            assert.file(configFiles);
            assert.file(projectFiles);
            assert.file(files);
            assert.noFile('test/benchmarks/example.benchmark.js');
            assert.fileContent('.gitignore', 'app/templates.js');
            assert.fileContent('.gitignore', 'app/style.css');
        });
        it('DOES NOT add Browserify support', function() {
            verifyBrowserifySupport(false);
        });
        it('DOES NOT add less or Sass support', function() {
            verifyLessSupport(false);
            verifySassSupport(false);
        });
        dependencies.forEach(function(dep) {
            it('DOES NOT add ' + dep + ' to package.json', function() {
                assert.noFileContent('package.json', dep);
            });
        });
        it('customizes work-flow tasks', function() {
            assert.fileContent('Gruntfile.js', 'fix: false');
            assert.noFileContent('Gruntfile.js', 'less: {');
            assert.noFileContent('Gruntfile.js', 'sass: {');
            assert.noFileContent('Gruntfile.js', 'jsinspect: {');
            assert.noFileContent('Gruntfile.js', 'buddyjs: {');
            assert.noFileContent('Gruntfile.js', 'imagemin: {');
            assert.noFileContent('Gruntfile.js', 'a11y: {');
            assert.noFileContent('Gruntfile.js', 'accessibility: {');
            assert.noFileContent('Gruntfile.js', 'benchmark: {');
            assert.noFileContent('Gruntfile.js', 'coveralls: {');
        });
    });
    describe('when the application directory is changed (with Sass support)', function() {
        before(function(done) {
                APPDIR = 'webapp';
                SCRIPT_BUNDLER = 'requirejs';
                CSS_PROCESSOR = 'sass';
                PROMPT_ANSWERS = false;
                scaffoldApp(APPDIR, SCRIPT_BUNDLER, CSS_PROCESSOR, PROMPT_ANSWERS).on('end', done);
        });
        it('creates and configures files', function() {
            assert.file(configFiles);
            assert.file(projectFiles);
            assert.file(files.map(function(file) {return APPDIR + '/' + file;}));
            assert.noFile('test/benchmarks/example.benchmark.js');
            assert.fileContent('.gitignore', APPDIR + '/app/templates.js');
            assert.fileContent('.gitignore', APPDIR + '/app/style.css');
        });
        it('DOES NOT add Browserify support', function() {
            verifyBrowserifySupport(false, APPDIR);
        });
        it('ADDS only Sass support', function() {
            verifySassSupport(true, APPDIR);
        });
        dependencies.forEach(function(dep) {
            it('DOES NOT add ' + dep + ' to package.json', function() {
                assert.noFileContent('package.json', dep);
            });
        });
        it('customizes work-flow tasks', function() {
            assert.fileContent('Gruntfile.js', 'fix: false');
            assert.noFileContent('Gruntfile.js', 'less: {');
            assert.fileContent('Gruntfile.js', 'sass: {');
            assert.noFileContent('Gruntfile.js', 'jsinspect: {');
            assert.noFileContent('Gruntfile.js', 'buddyjs: {');
            assert.noFileContent('Gruntfile.js', 'imagemin: {');
            assert.noFileContent('Gruntfile.js', 'a11y: {');
            assert.noFileContent('Gruntfile.js', 'accessibility: {');
            assert.noFileContent('Gruntfile.js', 'benchmark: {');
            assert.noFileContent('Gruntfile.js', 'coveralls: {');
        });
    });
});
