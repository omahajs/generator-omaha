'use strict';

var sinon   = require('sinon');
var assert  = require('yeoman-generator').assert;
var base    = require('yeoman-generator').generators.Base;
var _       = require('underscore');
var helpers = require('./helpers');

var scaffoldApplicationWith = helpers.scaffoldAppWith;
var verifyApplicationFiles  = helpers.verifyFiles;
var verifyConfiguration     = helpers.verifyConfiguration;
var verifyCoverallsSupport  = helpers.verifyCoveralls;

xdescribe('Webapp generator (with command line options)', function() {
    this.timeout(0)
    var stub;
    var APPDIR;
    var CONFIGURED;
    var CSS_PREPROCESSOR;
    var SCRIPT_BUNDLER;
    var TEMPLATE_TECH;
    xdescribe('Defaults', function() {
        before(function(done) {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
            CONFIGURED       = true;
            APPDIR           = './';
            SCRIPT_BUNDLER   = 'requirejs';
            CSS_PREPROCESSOR = 'less';
            TEMPLATE_TECH    = 'handlebars';
            scaffoldApplicationWith({
                defaults: true
            }).on('end', done);
        });
        after(function() {
            stub.restore();
        });
        it('can create and configure files', function() {
            verifyApplicationFiles(APPDIR);
            verifyConfiguration({
                appDirectory:       APPDIR,
                workflow:           CONFIGURED,
                scriptBundler:      SCRIPT_BUNDLER,
                styleProcessor:     CSS_PREPROCESSOR,
                templateTechnology: TEMPLATE_TECH
            });
            verifyCoverallsSupport(!CONFIGURED);
        });
    });
    xdescribe('Defaults (css-preprocessor=sass)', function() {
        before(function(done) {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
            CONFIGURED       = true;
            APPDIR           = './';
            SCRIPT_BUNDLER   = 'requirejs';
            CSS_PREPROCESSOR = 'sass';
            TEMPLATE_TECH    = 'handlebars';
            scaffoldApplicationWith({
                defaults: true,
                cssPreprocessor: CSS_PREPROCESSOR
            }).on('end', done);
        });
        after(function() {
            stub.restore();
        });
        it('can create and configure files', function() {
            verifyApplicationFiles(APPDIR);
            verifyConfiguration({
                appDirectory:       APPDIR,
                workflow:           CONFIGURED,
                scriptBundler:      SCRIPT_BUNDLER,
                styleProcessor:     CSS_PREPROCESSOR,
                templateTechnology: TEMPLATE_TECH
            });
            verifyCoverallsSupport(!CONFIGURED);
        });
    });
    xdescribe('Defaults (template-technology=underscore)', function() {
        before(function(done) {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
            CONFIGURED       = true;
            APPDIR           = './';
            SCRIPT_BUNDLER   = 'requirejs';
            CSS_PREPROCESSOR = 'less';
            TEMPLATE_TECH    = 'underscore';
            scaffoldApplicationWith({
                defaults: true,
                templateTechnology: TEMPLATE_TECH
            }).on('end', done);
        });
        after(function() {
            stub.restore();
        });
        it('can create and configure files', function() {
            verifyApplicationFiles(APPDIR);
            verifyConfiguration({
                appDirectory:       APPDIR,
                workflow:           CONFIGURED,
                scriptBundler:      SCRIPT_BUNDLER,
                styleProcessor:     CSS_PREPROCESSOR,
                templateTechnology: TEMPLATE_TECH
            });
            verifyCoverallsSupport(!CONFIGURED);
        });
    });
    describe('Browserify, Sass, and underscore', function() {
        before(function(done) {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
            CONFIGURED       = true;
            APPDIR           = './';
            SCRIPT_BUNDLER   = 'browserify';
            CSS_PREPROCESSOR = 'sass';
            TEMPLATE_TECH    = 'underscore';
            scaffoldApplicationWith({
                scriptBundler: SCRIPT_BUNDLER,
                cssPreprocessor: CSS_PREPROCESSOR,
                templateTechnology: TEMPLATE_TECH
            }).on('end', done);
        });
        after(function() {
            stub.restore();
        });
        it('can create and configure files', function() {
            verifyApplicationFiles(APPDIR);
            verifyConfiguration({
                appDirectory:       APPDIR,
                workflow:           CONFIGURED,
                scriptBundler:      SCRIPT_BUNDLER,
                styleProcessor:     CSS_PREPROCESSOR,
                templateTechnology: TEMPLATE_TECH
            });
            verifyCoverallsSupport(!CONFIGURED);
        });
    });
    describe('Browserify, no pre-processing, and underscore', function() {
        before(function(done) {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
            CONFIGURED       = true;
            APPDIR           = './';
            SCRIPT_BUNDLER   = 'browserify';
            CSS_PREPROCESSOR = 'none';
            TEMPLATE_TECH    = 'underscore';
            scaffoldApplicationWith({
                scriptBundler: SCRIPT_BUNDLER,
                cssPreprocessor: CSS_PREPROCESSOR,
                templateTechnology: TEMPLATE_TECH
            }).on('end', done);
        });
        after(function() {
            stub.restore();
        });
        it('can create and configure files', function() {
            verifyApplicationFiles(APPDIR);
            verifyConfiguration({
                appDirectory:       APPDIR,
                workflow:           CONFIGURED,
                scriptBundler:      SCRIPT_BUNDLER,
                styleProcessor:     CSS_PREPROCESSOR,
                templateTechnology: TEMPLATE_TECH
            });
            verifyCoverallsSupport(!CONFIGURED);
        });
    });
});
