'use strict';

const path    = require('path');
const assert  = require('yeoman-assert');
const helpers = require('yeoman-test');

const DEFAULT_HTTP_PORT = 8111;
const DEFAULT_HTTPS_PORT = 8443;
const DEFAULT_WS_PORT = 13337;

describe('Server generator', function() {
    let skipInstall = true;
    let defaults = true;
    let markdownSupport = true;
    let http = 123;
    let httpPort = http;
    let https = 456;
    let httpsPort = https;
    let ws    = 789;
    let websocketPort = ws;
    describe('can create and configure files', function() {
        it('with custom ports set via prompt choices', function() {
            return helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({skipInstall})
                .withPrompts({httpPort, httpsPort, websocketPort, markdownSupport})
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyPorts(http, https, ws);
                    verifyMarkdownSupport(true);
                });
        });
        it('with custom ports set via command line options', function() {
            return helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({skipInstall, http, https, ws})
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyPorts(http, https, ws);
                    verifyMarkdownSupport(false);
                });
        });
        it('with default command line options', function() {
            return helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({skipInstall, defaults})
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyPorts(DEFAULT_HTTP_PORT, DEFAULT_HTTPS_PORT, DEFAULT_WS_PORT);
                    verifyMarkdownSupport(false);
                });
        });
        it('with Markdown support', function() {
            return helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({skipInstall})
                .withPrompts({markdownSupport: true})
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyPorts(DEFAULT_HTTP_PORT, DEFAULT_HTTPS_PORT, DEFAULT_WS_PORT);
                    verifyMarkdownSupport(true);
                });
        });
        it('without Markdown support', function() {
            return helpers.run(path.join(__dirname, '../generators/server'))
                .withOptions({skipInstall})
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyPorts(DEFAULT_HTTP_PORT, DEFAULT_HTTPS_PORT, DEFAULT_WS_PORT);
                    verifyMarkdownSupport(false);
                });
        });
    });
});
function verifyCoreFiles() {
    let ALWAYS_INCLUDED = [
        'package.json',
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
    (exists ? assert.file : assert.noFile)('web/client/example.md');
    (exists ? assert.fileContent : assert.noFileContent)('web/server.js', 'engine(\'md\', ');
}
