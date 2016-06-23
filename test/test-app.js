'use strict';

var sinon   = require('sinon');
var assert  = require('yeoman-generator').assert;
var base    = require('yeoman-generator').generators.Base;
var _       = require('underscore');
var helpers = require('./helpers');

var scaffoldApplication    = helpers.scaffoldApp;
var verifyApplicationFiles = helpers.verifyFiles;
var verifyConfiguration    = helpers.verifyConfiguration;
var verifyCoverallsSupport = helpers.verifyCoveralls;

describe('Webapp generator', function() {
    this.timeout(0)
    var stub;
    var APPDIR;
    var CONFIGURED;
    var CSS_PROCESSOR;
    var SCRIPT_BUNDLER;
    var TEMPLATE_LANG;
    var promptOptions = function(allAnswersTrue) {
        return {
            appDirectory:       APPDIR,
            scriptBundler:      SCRIPT_BUNDLER,
            styleProcessor:     CSS_PROCESSOR,
            templateTechnology: TEMPLATE_LANG
        };
    };
    describe('when all prompts are true (with less support)', function() {
        before(function(done) {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
            CONFIGURED     = true;
            APPDIR         = './';
            SCRIPT_BUNDLER = 'browserify';
            CSS_PROCESSOR  = 'less';
            TEMPLATE_LANG  = 'handlebars';
            scaffoldApplication(
                promptOptions(true)
            ).on('end', done);
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
                styleProcessor:     CSS_PROCESSOR,
                templateTechnology: TEMPLATE_LANG
            });
            verifyCoverallsSupport(CONFIGURED);
        });
    });
    xdescribe('when all prompts are false', function() {
        before(function(done) {
                CONFIGURED     = false;
                APPDIR         = './';
                SCRIPT_BUNDLER = 'requirejs';
                CSS_PROCESSOR  = 'none';
                TEMPLATE_LANG  = 'handlebars';
                scaffoldApplication(
                    promptOptions(false)
                ).on('end', done);
        });
        it('can create and configure files', function() {
            verifyApplicationFiles(APPDIR);
            verifyConfiguration({
                appDirectory:       APPDIR,
                workflow:           CONFIGURED,
                scriptBundler:      SCRIPT_BUNDLER,
                styleProcessor:     CSS_PROCESSOR,
                templateTechnology: TEMPLATE_LANG
            });
            verifyCoverallsSupport(CONFIGURED);
        });
    });
    xdescribe('when the application directory is changed (with Sass support)', function() {
        before(function(done) {
                CONFIGURED     = false;
                APPDIR         = 'webapp/';
                SCRIPT_BUNDLER = 'requirejs';
                CSS_PROCESSOR  = 'sass';
                TEMPLATE_LANG  = 'underscore';
                scaffoldApplication(
                    promptOptions(false)
                ).on('end', done);
        });
        it('can create and configure files', function() {
            verifyApplicationFiles(APPDIR);
            verifyConfiguration({
                appDirectory:       APPDIR,
                workflow:           CONFIGURED,
                scriptBundler:      SCRIPT_BUNDLER,
                styleProcessor:     CSS_PROCESSOR,
                templateTechnology: TEMPLATE_LANG
            });
            verifyCoverallsSupport(CONFIGURED);
        });
    });
});
