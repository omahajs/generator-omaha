'use strict';

var path    = require('path');
var assert  = require('yeoman-assert');
var helpers = require('yeoman-test');

function verifyFiles() {
    var ALWAYS_INCLUDED = [
        'package.json',
        'app.json',
        'index.js',
        'config/default.js',
        'web/socket.js',
        'web/server.js',
        'web/client/index.html',
        'favicon.ico'
    ];
    ALWAYS_INCLUDED.forEach(file => assert.file(file));
}
function verifyPorts(http, https, ws) {
    assert.fileContent('config/default.js', 'port: process.env.PORT || ' + http);
    assert.fileContent('config/default.js', 'port: ' + https);
    assert.fileContent('config/default.js', 'port: ' + ws);
}
function verifyMarkdownSupport(exists) {
    (exists ? assert.file : assert.noFile)('web/markdown/example.md');
    (exists ? assert.fileContent : assert.noFileContent)('web/server.js', 'engine(\'md\', ');
}

describe('Server generator', function() {
    var HTTP_PORT  = 123;
    var HTTPS_PORT = 456;
    var WS_PORT    = 789;
    describe('can create and configure files', function() {
        it('with custom ports set via prompt choices', function() {
            return helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({skipInstall: true})
                .withPrompts({
                    httpPort:      HTTP_PORT,
                    httpsPort:     HTTPS_PORT,
                    websocketPort: WS_PORT,
                    markdownSupport: true
                })
                .toPromise()
                .then(function() {
                    verifyFiles();
                    verifyPorts(HTTP_PORT, HTTPS_PORT, WS_PORT);
                    verifyMarkdownSupport(true);
                });
        });
        it('with custom ports set via command line options', function() {
            return helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({
                    skipInstall: true,
                    http:  HTTP_PORT,
                    https: HTTPS_PORT,
                    ws:    WS_PORT
                })
                .toPromise()
                .then(function() {
                    verifyFiles();
                    verifyPorts(HTTP_PORT, HTTPS_PORT, WS_PORT);
                    verifyMarkdownSupport(false);
                });
        });
        it('with default command line options', function() {
            return helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({
                    skipInstall: true,
                    defaults: true
                })
                .toPromise()
                .then(function() {
                    verifyFiles();
                    verifyPorts(8111, 8443, 13337);
                    verifyMarkdownSupport(false);
                });
        });
        it('with Markdown support', function() {
            return helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({skipInstall: true})
                .withPrompts({markdownSupport: true})
                .toPromise()
                .then(function() {
                    verifyFiles();
                    verifyPorts(8111, 8443, 13337);
                    verifyMarkdownSupport(true);
                });
        });
        it('without Markdown support', function() {
            return helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({skipInstall: true})
                .toPromise()
                .then(function() {
                    verifyFiles();
                    verifyPorts(8111, 8443, 13337);
                    verifyMarkdownSupport(false);
                });
        });
    });
});
