'use strict';

var path    = require('path');
var assert  = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var base    = require('yeoman-generator').generators.Base;
var sinon   = require('sinon');
var os      = require('os');
var _       = require('lodash');

var stub;
//Config files that are ALWAYS created
var configFiles = [
    'config/.csslintrc',
    'config/.jscsrc',
    'config/.jscsrc-jsdoc',
    'config/.jshintrc',
    'config/default.js',
    'config/karma.conf.js',
    '.gitignore'
];
//Project files that are ALWAYS created
var projectFiles = [
    'package.json',
    'Gruntfile.js',
    'README.md',
    'LICENSE'
];
//Files that are ALWAYS created
var files = [
    'tasks/main.js',
    'tasks/build.js',
    'tasks/test.js',
    'app/index.html',
    'app/app.js',
    'app/main.js',
    'app/config.js',
    'app/router.js',
    'assets/images/logo.png',
    'app/modules/umd.boilerplate.js',
    'app/modules/webworker.boilerplate.js'
];
//Dependencies that are CONDITIONALLY installed YES/NO
var dependencies = [
    '"jsinspect": ',
    'grunt-jsinspect',
    'grunt-buddyjs',
    'grunt-contrib-imagemin',
    'grunt-a11y',
    'grunt-accessibility',
    'grunt-karma-coveralls',
    'grunt-benchmark',
    'grunt-contrib-less'
];
//Dependencies that are CONDITIONALLY installed FROM CHOICES
var dependencyChoices = [

];
var SKIP_INSTALL = {skipInstall: true};
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
function promptAnswers(questions, value) {
    return _.zipObject(questions, _.fill(_.clone(questions), value));
}

describe('app', function() {
    describe('when all options are true (with less support)', function() {
        before(function(done) {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
            helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(_.extend(_.clone(booleanAnswers(true)), {
                    appDir: './',
                    scriptBundler: 'browserify',
                    cssPreprocessor: 'less'
                }))
                .on('end', done);
        });
        after(function() {
            stub.restore();
        });
        it('creates files', function() {
            assert.file(configFiles);
            assert.file(projectFiles);
            assert.file(files);
            assert.file('assets/less/reset.less');
            assert.file('assets/less/style.less');
            assert.noFile('assets/sass/reset.scss');
            assert.file('test/benchmarks/example.benchmark.js');
        });
        it('configures files', function() {
            assert.fileContent('.gitignore', 'app/templates.js');
            assert.fileContent('.gitignore', 'app/style.css');
        });
        it('ADDS Browserify support', function() {
            assert.fileContent('package.json', '"browserify": {');
            assert.fileContent('package.json', 'grunt-browserify');
            assert.fileContent('package.json', 'deamdify');
            assert.fileContent('package.json', 'aliasify');
            assert.fileContent('Gruntfile.js', 'browserify: {');
            assert.fileContent('tasks/build.js', 'browserify:bundle');
            assert.fileContent('tasks/build.js', 'uglify:bundle');
            assert.noFileContent('tasks/build.js', 'requirejs:bundle');
        });
        it('ADDS only less support', function() {
            assert.fileContent('config/default.js', 'less/**/*.less');
            assert.noFileContent('config/default.js', 'sass/**/*.scss');
            assert.noFileContent('package.json', 'grunt-contrib-sass');
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
            helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(_.extend(_.clone(booleanAnswers(false)), {
                    appDir: './',
                    scriptBundler: 'requirejs',
                    cssPreprocessor: 'none'
                }))
                .on('end', done);
        });

        it('creates files', function() {
            assert.file(configFiles);
            assert.file(projectFiles);
            assert.file(files);
            assert.noFile('assets/less/reset.less');
            assert.noFile('assets/sass/reset.scss');
            assert.file('assets/css/reset.css');
            assert.noFile('test/benchmarks/example.benchmark.js');
        });
        it('configures files', function() {
            assert.fileContent('.gitignore', 'app/templates.js');
            assert.fileContent('.gitignore', 'app/style.css');
        });
        it('DOES NOT add Browserify support', function() {
            assert.noFileContent('package.json', '"browserify": {');
            assert.noFileContent('package.json', 'grunt-browserify');
            assert.noFileContent('package.json', 'deamdify');
            assert.noFileContent('package.json', 'aliasify');
            assert.noFileContent('Gruntfile.js', 'browserify: {');
            assert.noFileContent('tasks/build.js', 'browserify:bundle');
            assert.noFileContent('tasks/build.js', 'uglify:bundle');
            assert.fileContent('tasks/build.js', 'requirejs:bundle');
        });
        it('DOES NOT add less or Sass support', function() {
            assert.noFileContent('config/default.js', 'less/**/*.less');
            assert.noFileContent('config/default.js', 'sass/**/*.scss');
            assert.noFileContent('package.json', 'grunt-contrib-sass');
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
        var appDirectory = 'webapp';
        before(function(done) {
            helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(_.extend(_.clone(booleanAnswers(false)), {
                    appDir: appDirectory,
                    scriptBundler: 'requirejs',
                    cssPreprocessor: 'sass'
                }))
                .on('end', done);
        });
        it('creates files', function() {
            assert.file(configFiles);
            assert.file(projectFiles);
            assert.file(files.map(function(file) {
                return appDirectory + '/' + file;
            }));
            assert.noFile(appDirectory + '/assets/less/reset.less');
            assert.file(appDirectory + '/assets/sass/reset.scss');
            assert.file(appDirectory + '/assets/sass/style.scss');
            assert.noFile('test/benchmarks/example.benchmark.js');
        });
        it('configures files', function() {
            assert.fileContent('.gitignore', appDirectory + '/app/templates.js');
            assert.fileContent('.gitignore', appDirectory + '/app/style.css');
        });
        it('DOES NOT add Browserify support', function() {
            assert.noFileContent('package.json', '"browserify": {');
            assert.noFileContent('package.json', 'grunt-browserify');
            assert.noFileContent('package.json', 'deamdify');
            assert.noFileContent('package.json', 'aliasify');
            assert.noFileContent('Gruntfile.js', 'browserify: {');
            assert.noFileContent(appDirectory + '/tasks/build.js', 'browserify:bundle');
            assert.noFileContent(appDirectory + '/tasks/build.js', 'uglify:bundle');
            assert.fileContent(appDirectory + '/tasks/build.js', 'requirejs:bundle');
        });
        it('ADDS only Sass support', function() {
            assert.noFileContent('config/default.js', 'less/**/*.less');
            assert.fileContent('config/default.js', 'sass/**/*.scss');
            assert.fileContent('package.json', 'grunt-contrib-sass');
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
