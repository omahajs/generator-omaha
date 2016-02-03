'use strict';

var path    = require('path');
var assert  = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var base    = require('yeoman-generator').generators.Base;
var sinon   = require('sinon');
var os      = require('os');

var stub;
var configFiles = [
    'config/.csslintrc',
    'config/.jscsrc',
    'config/.jscsrc-jsdoc',
    'config/.jshintrc',
    'config/default.js',
    'config/karma.conf.js',
    '.gitignore'
];
var projectFiles = [
    'package.json',
    'Gruntfile.js',
    'README.md',
    'LICENSE'
];
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

describe('app', function() {
    describe('when all options are true (with less support)', function() {
        before(function(done) {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
            helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions({skipInstall: true})
                .withPrompts({
                    appDir: './',
                    cssPreprocessor: 'less',
                    autoFix: true,
                    useJsinspect: true,
                    useBuddyjs: true,
                    useA11y: true,
                    compressImages: true,
                    benchmarks: true,
                    useCoveralls: true
                })
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
                .withOptions({skipInstall: true})
                .withPrompts({
                    appDir: './',
                    cssPreprocessor: 'none',
                    autoFix: false,
                    useJsinspect: false,
                    useBuddyjs: false,
                    useA11y: false,
                    compressImages: false,
                    benchmarks: false,
                    useCoveralls: false
                })
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
        var appDirectory;
        before(function(done) {
            appDirectory = 'webapp';
            helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions({skipInstall: true})
                .withPrompts({
                    appDir: appDirectory,
                    cssPreprocessor: 'Sass',
                    autoFix: false,
                    useJsinspect: false,
                    useBuddyjs: false,
                    useA11y: false,
                    compressImages: false,
                    benchmarks: false,
                    useCoveralls: false
                })
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
