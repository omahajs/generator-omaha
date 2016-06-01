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
    describe('with Markdown support', function() {
        before(function(done) {
            helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({skipInstall: true})
                .on('end', done);
        });
        it('creates files', function() {
            verifyFiles();
        });
        it('configures files', function() {
            verifyPorts(8111, 8443, 13337);
            verifyMarkdownSupport(true);
        });
    });
    describe('without Markdown support', function() {
        before(function(done) {
            helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({skipInstall: true})
                .withPrompts({markdownSupport: false})
                .on('end', done);
        });
        it('creates files', function() {
            verifyFiles();
        });
        it('configures files', function() {
            verifyPorts(8111, 8443, 13337);
            verifyMarkdownSupport(false);
        });
    });
    describe('without custom ports', function() {
        var HTTP_PORT  = 123;
        var HTTPS_PORT = 456;
        var WS_PORT    = 789;
        before(function(done) {
            helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({skipInstall: true})
                .withPrompts({
                    httpPort:      HTTP_PORT,
                    httpsPort:     HTTPS_PORT,
                    websocketPort: WS_PORT
                })
                .on('end', done);
        });
        it('creates files', function() {
            verifyFiles();
        });
        it('configures files', function() {
            verifyPorts(HTTP_PORT, HTTPS_PORT, WS_PORT);
            verifyMarkdownSupport(true);
        });
    });
});
