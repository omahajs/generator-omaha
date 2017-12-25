'use strict';

const _ = require('lodash');
const {
    file,
    fileContent,
    noFile,
    noFileContent
} = require('yeoman-assert');

const browserifyContent = [
    ['package.json', '"browser":'],
    ['package.json', '"browserify":'],
    ['package.json', '"aliasify":'],
    ['Gruntfile.js', 'browserify'],
    ['Gruntfile.js', 'uglify:']
];
const ariaContent = [
    ['Gruntfile.js', 'a11y: '],
    ['Gruntfile.js', 'accessibility: '],
    ['Gruntfile.js', 'aria-audit']
];

const verifyLessConfigured = _.partial(verifyPreprocessorConfigured, 'less');
const verifySassConfigured = _.partial(verifyPreprocessorConfigured, 'sass');

module.exports = {
    verifyAmdFiles,
    verifyCoreFiles,
    verifyNativeFiles,
    verifyBoilerplateFiles,
    verifyDefaultConfiguration,
    verifyNativeConfiguration,
    verifyDefaultTasksConfiguration,
    verifySassConfigured
};

function verifyAmdFiles() {
    [
        'app/config.js',
        'app/controllers/example.webworker.js'
    ].forEach(name => file(name));
    fileContent('config/.eslintrc.js', 'amd: true,');
    fileContent('config/.eslintrc.js', 'commonjs: false,');
}
function verifyCoreFiles() {
    const ALWAYS_INCLUDED = [
        'README.md',
        'Gruntfile.js',
        'config/default.json',
        'config/stylelint.config.js',
        'tasks/webapp.js'
    ];
    ALWAYS_INCLUDED.forEach(name => file(name));
}
function verifyNativeFiles(isWebapp) {
    const ALWAYS_INCLUDED = [
        'bin/preload.js',
        'index.js',
        isWebapp ? 'renderer/app/index.html' : 'renderer/index.html'
    ];
    ALWAYS_INCLUDED.forEach(name => file(name));
}
function verifyBoilerplateFiles(sourceDirectory) {
    [
        'app/index.html',
        'app/app.js',
        'app/main.js',
        'app/router.js',
        'assets/images/logo.png',
        'app/helpers/jquery.extensions.js',
        'app/plugins/radio.logging.js',
        'app/plugins/redux.state.js',
        'app/shims/mn.morphdom.renderer.shim.js'
    ]
        .map(fileName => sourceDirectory + fileName)
        .forEach(name => file(name));
}
function verifyDefaultConfiguration(sourceDirectory) {
    verifyCoreFiles();
    verifyLessConfigured(sourceDirectory);
    fileContent(ariaContent);
    fileContent('Gruntfile.js', 'imagemin: ');
    noFileContent(browserifyContent); // script bundler
    noFileContent('Gruntfile.js', 'jst'); // template technology
    fileContent('Gruntfile.js', 'handlebars');// template technology
}
function verifyNativeConfiguration(isWebapp) {
    const startScript = isWebapp ? '"grunt compile && electron index"' : '"electron index"';
    fileContent('package.json', `"start": ${startScript}`);
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
    fileContent(defaultTaskConfigs);
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
    fileContent('Gruntfile.js', 'postcss: ');
    noFile(`${customPath}assets/${type}/reset.${ext}`);
    file(`${customPath}assets/${type}/style.${ext}`);
    fileContent('Gruntfile.js', `${type}: `);
    noFile(`${customPath}assets/${notType}/style.${notExt}`);
    noFileContent('Gruntfile.js', `${notType}: `);
}
