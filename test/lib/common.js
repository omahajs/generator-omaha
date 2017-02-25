'use strict';

var _      = require('lodash');
var assert = require('yeoman-assert');

var browserifyContent = [
    ['package.json', '"browser":'],
    ['package.json', '"browserify":'],
    ['package.json', '"aliasify":'],
    ['Gruntfile.js', 'browserify'],
    ['Gruntfile.js', 'replace:'],
    ['Gruntfile.js', 'uglify:']
];
var ariaContent = [
    ['Gruntfile.js', 'a11y: '],
    ['Gruntfile.js', 'accessibility: '],
    ['Gruntfile.js', 'aria-audit']
];
var verifyLessConfigured = _.partial(verifyPreprocessorConfigured, 'less');
var verifySassConfigured = _.partial(verifyPreprocessorConfigured, 'sass');

module.exports = {
    verifyCoreFiles,
    verifyBoilerplateFiles,
    verifyDefaultConfiguration,
    verifyDefaultTasksConfiguration,
    verifySassConfigured
};

function verifyCoreFiles() {
    var ALWAYS_INCLUDED = [
        'README.md',
        'config/.csslintrc',
        'tasks/webapp.js'
    ];
    ALWAYS_INCLUDED.forEach(file => assert.file(file));
}
function verifyBoilerplateFiles(sourceDirectory) {
    [
        'app/index.html',
        'app/app.js',
        'app/main.js',
        'app/config.js',
        'app/router.js',
        'assets/images/logo.png',
        'app/controllers/example.webworker.js',
        'app/helpers/jquery.extensions.js',
        'app/helpers/underscore.mixins.js',
        'app/plugins/radio.logging.js',
        'app/shims/marionette.handlebars.shim.js'
    ]
    .map(fileName => sourceDirectory + fileName)
    .forEach(file => assert.file(file));
}
function verifyDefaultConfiguration(sourceDirectory) {
    verifyCoreFiles();
    verifyLessConfigured(sourceDirectory);
    assert.fileContent('Gruntfile.js', 'csslint: ');
    assert.fileContent(ariaContent);
    assert.fileContent('Gruntfile.js', 'imagemin: ');
    assert.noFileContent(browserifyContent);         // script bundler
    assert.noFileContent('Gruntfile.js', 'jst');     // template technology
    assert.fileContent('Gruntfile.js', 'handlebars');// template technology
}
function verifyDefaultTasksConfiguration() {
    var defaultTaskConfigs = [
        ['Gruntfile.js', 'browserSync: {'],
        ['Gruntfile.js', 'clean: {'],
        ['Gruntfile.js', 'jsdoc: {'],
        ['Gruntfile.js', 'jsonlint: {'],
        ['Gruntfile.js', 'karma: {'],
        ['Gruntfile.js', 'open: {'],
        ['Gruntfile.js', 'requirejs: {'],
        ['Gruntfile.js', 'options: { spawn: false }'], // watch task
        ['Gruntfile.js', 'configFile: \'<%= files.config.eslint %>\''], // eslint task
        ['Gruntfile.js', 'eslint: require(config.files.config.eslint)']// plato task
    ];
    assert.fileContent(defaultTaskConfigs);
}
function verifyPreprocessorConfigured(type, sourceDirectory) {
    var EXT_LOOKUP = {
        less: 'less',
        sass: 'scss'
    };
    var ext = EXT_LOOKUP[type];
    var notType = _(EXT_LOOKUP)
        .omit(type)
        .keys()
        .head();
    var notExt = EXT_LOOKUP[notType];
    var customPath = sourceDirectory || '';
    assert.fileContent('Gruntfile.js', 'postcss: ');
    assert.file(`${customPath}assets/${type}/reset.${ext}`);
    assert.file(`${customPath}assets/${type}/style.${ext}`);
    assert.fileContent('Gruntfile.js', `${type}: `);
    assert.noFile(`${customPath}assets/${notType}/style.${notExt}`);
    assert.noFileContent('Gruntfile.js', `${notType}: `);
}
