'use strict';

var path    = require('path');
var assert  = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var base    = require('yeoman-generator').generators.Base;
var sinon   = require('sinon');
var os      = require('os');

var data        = require('./data');
var testHelpers = require('./helpers');

var configFiles = data.configFiles;
var projectFiles = data.projectFiles;
var files = data.appFiles;
var dependencies = data.booleanDeps;
var scaffoldApp = testHelpers.scaffoldApp;
var verifyFiles = testHelpers.verifyFiles;
var verifyConfiguration = testHelpers.verifyConfiguration;
var verifyGruntfilePlugins = testHelpers.verifyGruntfilePlugins;
var verifyWorkflowDependencies = testHelpers.verifyWorkflowDependencies;
var verifyJscsAutofix = testHelpers.verifyJscsAutofix;
var verifyBenchmarkJs = testHelpers.verifyBenchmarkJs;
var booleanAnswers = testHelpers.booleanAnswers;
var verifyBrowserifySupport = testHelpers.verifyBrowserifySupport;
var verifyLessSupport = testHelpers.verifyLessSupport;
var verifySassSupport = testHelpers.verifySassSupport;

describe('app', function() {
    var stub;
    var APPDIR;
    var CONFIGURED;
    var PROMPT_ANSWERS;
    var SCRIPT_BUNDLER;
    var CSS_PROCESSOR;
    describe('when all options are true (with less support)', function() {
        before(function(done) {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
            APPDIR = './';
            CONFIGURED = true;
            SCRIPT_BUNDLER = 'browserify';
            CSS_PROCESSOR = 'less';
            PROMPT_ANSWERS = true;
            scaffoldApp(APPDIR, SCRIPT_BUNDLER, CSS_PROCESSOR, PROMPT_ANSWERS).on('end', done);
        });
        after(function() {
            stub.restore();
        });
        it('creates and configures files', function() {
            verifyFiles(APPDIR);
        });
        it('configures workflow and tool-chain', function() {
            verifyConfiguration(CONFIGURED, SCRIPT_BUNDLER, CSS_PROCESSOR, APPDIR);
        });
    });
    describe('when all options are false', function() {
        before(function(done) {
                APPDIR = './';
                CONFIGURED = false;
                SCRIPT_BUNDLER = 'requirejs';
                CSS_PROCESSOR = 'none';
                PROMPT_ANSWERS = false;
                scaffoldApp(APPDIR, SCRIPT_BUNDLER, CSS_PROCESSOR, PROMPT_ANSWERS).on('end', done);
        });
        it('creates and configures files', function() {
            verifyFiles(APPDIR);
        });
        it('configures workflow and tool-chain', function() {
            verifyConfiguration(CONFIGURED, SCRIPT_BUNDLER, CSS_PROCESSOR, APPDIR);
        });
    });
    describe('when the application directory is changed (with Sass support)', function() {
        before(function(done) {
                APPDIR = 'webapp';
                CONFIGURED = false;
                SCRIPT_BUNDLER = 'requirejs';
                CSS_PROCESSOR = 'sass';
                PROMPT_ANSWERS = false;
                scaffoldApp(APPDIR, SCRIPT_BUNDLER, CSS_PROCESSOR, PROMPT_ANSWERS).on('end', done);
        });
        it('creates and configures files', function() {
            verifyFiles(APPDIR);
        });
        it('configures workflow and tool-chain', function() {
            verifyConfiguration(CONFIGURED, SCRIPT_BUNDLER, CSS_PROCESSOR, APPDIR);
        });
    });
});
