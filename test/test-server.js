'use strict';

var path    = require('path');
var assert  = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

function verifyFiles() {
    assert.file([
        'package.json',
        'app.json',
        'index.js',
        'config/default.js',
        'web/socket.js',
        'web/server.js',
        'web/client/index.html',
        'favicon.ico'
    ]);
}

function verifyPorts(http, https, ws) {
    assert.fileContent('config/default.js', 'port: process.env.PORT || ' + http);
    assert.fileContent('config/default.js', 'port: ' + https);
    assert.fileContent('config/default.js', 'port: ' + ws);
}

function verifyMarkdownSupport(exists) {
    var verify = exists ? assert.fileContent : assert.noFileContent;
    if (exists) {
        assert.file('web/markdown/example.md');
    } else {
        assert.noFile('web/markdown/example.md');
    }
    verify('web/server.js', 'engine(\'md\', ');
}

describe('Server generator', function() {
    var HTTP_PORT  = 123;
    var HTTPS_PORT = 456;
    var WS_PORT    = 789;
    describe('with custom ports set as options', function() {
        before(function(done) {
            helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({
                    skipInstall: true,
                    http: HTTP_PORT,
                    https: HTTPS_PORT,
                    ws: WS_PORT
                })
                .on('end', done);
        });
        it('can create and configure files', function() {
            verifyFiles();
            verifyPorts(HTTP_PORT, HTTPS_PORT, WS_PORT);
            verifyMarkdownSupport(false);
        });
    });
    describe('with custom ports set from prompt', function() {
        before(function(done) {
            helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({skipInstall: true})
                .withPrompts({
                    httpPort:      HTTP_PORT,
                    httpsPort:     HTTPS_PORT,
                    websocketPort: WS_PORT,
                    markdownSupport: true
                })
                .on('end', done);
        });
        it('can create and configure files', function() {
            verifyFiles();
            verifyPorts(HTTP_PORT, HTTPS_PORT, WS_PORT);
            verifyMarkdownSupport(true);
        });
    });
    describe('with default options', function() {
        before(function(done) {
            helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({
                    skipInstall: true,
                    defaults: true
                })
                .on('end', done);
        });
        it('can create and configure files', function() {
            verifyFiles();
            verifyPorts(8111, 8443, 13337);
            verifyMarkdownSupport(false);
        });
    });
    describe('with Markdown support', function() {
        before(function(done) {
            helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({skipInstall: true})
                .withPrompts({markdownSupport: true})
                .on('end', done);
        });
        it('can create and configure files', function() {
            verifyFiles();
            verifyPorts(8111, 8443, 13337);
            verifyMarkdownSupport(true);
        });
    });
    describe('without Markdown support', function() {
        before(function(done) {
            helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({skipInstall: true})
                .on('end', done);
        });
        it('can create and configure files', function() {
            verifyFiles();
            verifyPorts(8111, 8443, 13337);
            verifyMarkdownSupport(false);
        });
    });
});
