'use strict';

const {join}  = require('path');
const helpers = require('yeoman-test');
const assert  = require('yeoman-assert');

const DEFAULT_HTTP_PORT = 8111;
const DEFAULT_HTTPS_PORT = 8443;
const DEFAULT_WS_PORT = 13337;

describe('Server generator', () => {
    const skipInstall = true;
    const defaults = true;
    const markdownSupport = true;
    const http = 123;
    const httpPort = http;
    const https = 456;
    const httpsPort = https;
    const ws = 789;
    const websocketPort = ws;
    describe('can create and configure files', () => {
        it('with custom ports set via prompt choices', () => helpers.run(join(__dirname, '../generators/server'))
            .withOptions({skipInstall})
            .withPrompts({httpPort, httpsPort, websocketPort, markdownSupport})
            .toPromise()
            .then(() => {
                verifyCoreFiles();
                verifyPorts(http, https, ws);
                verifyMarkdownSupport(true);
            }));
        it('with custom ports set via command line options', () => helpers.run(join(__dirname, '../generators/server'))
            .withOptions({skipInstall, http, https, ws})
            .toPromise()
            .then(() => {
                verifyCoreFiles();
                verifyPorts(http, https, ws);
                verifyMarkdownSupport(false);
            }));
        it('with default command line options', () => helpers.run(join(__dirname, '../generators/server'))
            .withOptions({skipInstall, defaults})
            .toPromise()
            .then(() => {
                verifyCoreFiles();
                verifyPorts(DEFAULT_HTTP_PORT, DEFAULT_HTTPS_PORT, DEFAULT_WS_PORT);
                verifyMarkdownSupport(false);
            }));
        it('with Markdown support', () => helpers.run(join(__dirname, '../generators/server'))
            .withOptions({skipInstall})
            .withPrompts({markdownSupport: true})
            .toPromise()
            .then(() => {
                verifyCoreFiles();
                verifyPorts(DEFAULT_HTTP_PORT, DEFAULT_HTTPS_PORT, DEFAULT_WS_PORT);
                verifyMarkdownSupport(true);
            }));
        it('without Markdown support', () => helpers.run(join(__dirname, '../generators/server'))
            .withOptions({skipInstall})
            .toPromise()
            .then(() => {
                verifyCoreFiles();
                verifyPorts(DEFAULT_HTTP_PORT, DEFAULT_HTTPS_PORT, DEFAULT_WS_PORT);
                verifyMarkdownSupport(false);
            }));
    });
});
function verifyCoreFiles() {
    const ALWAYS_INCLUDED = [
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
    assert.fileContent('config/default.js', `port: process.env.PORT || ${ http}`);
    assert.fileContent('config/default.js', `port: ${ https}`);
    assert.fileContent('config/default.js', `port: ${ ws}`);
}
function verifyMarkdownSupport(exists) {
    (exists ? assert.file : assert.noFile)('web/client/example.md');
    (exists ? assert.fileContent : assert.noFileContent)('web/server.js', 'engine(\'md\', ');
}
