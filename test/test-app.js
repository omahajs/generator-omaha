'use strict';

var base    = require('yeoman-generator').generators.Base;
var sinon   = require('sinon');
var helpers = require('./helpers');

var scaffoldApplication    = helpers.scaffoldApp;
var verifyApplicationFiles = helpers.verifyFiles;
var verifyConfiguration    = helpers.verifyConfiguration;

describe('app', function() {
    this.timeout(0)
    var stub;
    var APPDIR;
    var CONFIGURED;
    var CSS_PROCESSOR;
    var SCRIPT_BUNDLER;
    describe('when all options are true (with less support)', function() {
        before(function(done) {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
            CONFIGURED     = true;
            APPDIR         = './';
            SCRIPT_BUNDLER = 'browserify';
            CSS_PROCESSOR  = 'less';
            scaffoldApplication({
                appDirectory:   APPDIR,
                scriptBundler:  SCRIPT_BUNDLER,
                styleProcessor: CSS_PROCESSOR,
                allAnswersTrue: true
            }).on('end', done);
        });
        after(function() {
            stub.restore();
        });
        it('creates and configures files', function() {
            verifyApplicationFiles(APPDIR);
        });
        it('configures workflow and tool-chain', function() {
            verifyConfiguration({
                appDirectory:   APPDIR,
                workflow:       CONFIGURED,
                scriptBundler:  SCRIPT_BUNDLER,
                styleProcessor: CSS_PROCESSOR
            });
        });
    });
    describe('when all options are false', function() {
        before(function(done) {
                CONFIGURED     = false;
                APPDIR         = './';
                SCRIPT_BUNDLER = 'requirejs';
                CSS_PROCESSOR  = 'none';
                scaffoldApplication({
                    appDirectory:   APPDIR,
                    scriptBundler:  SCRIPT_BUNDLER,
                    styleProcessor: CSS_PROCESSOR,
                    allAnswersTrue: false
                }).on('end', done);
        });
        it('creates and configures files', function() {
            verifyApplicationFiles(APPDIR);
        });
        it('configures workflow and tool-chain', function() {
            verifyConfiguration({
                appDirectory:   APPDIR,
                workflow:       CONFIGURED,
                scriptBundler:  SCRIPT_BUNDLER,
                styleProcessor: CSS_PROCESSOR
            });
        });
    });
    describe('when the application directory is changed (with Sass support)', function() {
        before(function(done) {
                CONFIGURED     = false;
                APPDIR         = 'webapp';
                SCRIPT_BUNDLER = 'requirejs';
                CSS_PROCESSOR  = 'sass';
                scaffoldApplication({
                    appDirectory:   APPDIR,
                    scriptBundler:  SCRIPT_BUNDLER,
                    styleProcessor: CSS_PROCESSOR,
                    allAnswersTrue: false
                }).on('end', done);
        });
        it('creates and configures files', function() {
            verifyApplicationFiles(APPDIR);
        });
        it('configures workflow and tool-chain', function() {
            verifyConfiguration({
                appDirectory:   APPDIR,
                workflow:       CONFIGURED,
                scriptBundler:  SCRIPT_BUNDLER,
                styleProcessor: CSS_PROCESSOR
            });
        });
    });
});
