'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

var files = [
    'package.json',
    'Gruntfile.js',
    'README.md',
    'LICENSE',
    'tasks/main.js',
    'tasks/build.js',
    'tasks/test.js',
    'app/index.html',
    'app/app.js',
    'app/main.js',
    'app/config.js',
    'app/router.js'
];

var deps = [
    'jsinspect',
    'grunt-jsinspect',
    'grunt-buddyjs',
    'grunt-contrib-imagemin',
    'grunt-a11y',
    'grunt-accessibility',
    'grunt-karma-coveralls'
];

describe('techtonic:app', function() {
    describe('when all options true', function() {
        before(function(done) {
            helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions({skipInstall: true})
                .withPrompts({
                    autoFix: true,
                    useJsinspect: true,
                    useBuddyjs: true,
                    useA11y: true,
                    compressImages: true,
                    useCoveralls: true
                })
                .on('end', done);
        });

        it('creates files', function() {
            assert.file(files);
        });
        deps.forEach(function(dep) {
            it('adds ' + dep + ' to package.json', function() {
                assert.fileContent('package.json', dep);
            });
        });
        it('customizes work-flow tasks', function() {
            assert.fileContent('Gruntfile.js', 'fix: true');
            assert.fileContent('Gruntfile.js', 'jsinspect: {');
            assert.fileContent('Gruntfile.js', 'buddyjs: {');
            assert.fileContent('Gruntfile.js', 'imagemin: {');
            assert.fileContent('Gruntfile.js', 'a11y: {');
            assert.fileContent('Gruntfile.js', 'accessibility: {');
            assert.fileContent('Gruntfile.js', 'coveralls: {');
        });
    });
    describe('when all options false', function() {
        before(function(done) {
            helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions({skipInstall: true})
                .withPrompts({
                    autoFix: false,
                    useJsinspect: false,
                    useBuddyjs: false,
                    useA11y: false,
                    compressImages: false,
                    useCoveralls: false
                })
                .on('end', done);
        });

        it('creates files', function() {
            assert.file(files);
        });
        deps.forEach(function(dep) {
            it('DOES NOT add ' + dep + ' to package.json', function() {
                assert.noFileContent('package.json', dep);
            });
        });
        it('customizes work-flow tasks', function() {
            assert.fileContent('Gruntfile.js', 'fix: false');
            assert.noFileContent('Gruntfile.js', 'jsinspect: {');
            assert.noFileContent('Gruntfile.js', 'buddyjs: {');
            assert.noFileContent('Gruntfile.js', 'imagemin: {');
            assert.noFileContent('Gruntfile.js', 'a11y: {');
            assert.noFileContent('Gruntfile.js', 'accessibility: {');
            assert.noFileContent('Gruntfile.js', 'coveralls: {');
        });
    });
});
