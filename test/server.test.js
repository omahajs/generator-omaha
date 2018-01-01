
const {join}     = require('path');
const helpers    = require('yeoman-test');
const {
    file,
    noFile,
    fileContent,
    noFileContent
} = require('yeoman-assert');

const DEFAULT_HTTP_PORT = 8111;
const DEFAULT_HTTPS_PORT = 8443;
const DEFAULT_WS_PORT = 13337;
const DEFAULT_GRAPHQL_PORT = 4669;

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
    const graphql = 987;
    const graphqlPort = graphql;
    describe('can create and configure files', () => {
        it('with custom ports set via prompt choices', () => helpers.run(join(__dirname, '../generators/server'))
            .withOptions({skipInstall})
            .withPrompts({httpPort, httpsPort, websocketPort, graphqlPort, markdownSupport})
            .toPromise()
            .then(() => {
                verifyCoreFiles();
                verifyPorts(http, https, ws, graphql);
                verifyMarkdownSupport(true);
            }));
        it('with data sets selected via prompt choices', () => helpers.run(join(__dirname, '../generators/server'))
            .withOptions({skipInstall})
            .withPrompts({
                downloadData: [
                    'Federal agencies data',
                    '2013 Earthquake data'
                ]
            })
            .toPromise()
            .then(() => {
                verifyCoreFiles();
                verifyMarkdownSupport(false);
                fileContent('web/graphql.js', '// const data = require(\'web/data/federal_agencies.json\');');
                fileContent('web/graphql.js', '// const data = require(\'web/data/earthquakes_2013.json\');');
            }));
        it('with custom ports set via command line options', () => helpers.run(join(__dirname, '../generators/server'))
            .withOptions({skipInstall, http, https, ws, graphql})
            .toPromise()
            .then(() => {
                verifyCoreFiles();
                verifyPorts(http, https, ws, graphql);
                verifyMarkdownSupport(false);
            }));
        it('with default command line options', () => helpers.run(join(__dirname, '../generators/server'))
            .withOptions({skipInstall, defaults})
            .toPromise()
            .then(() => {
                verifyCoreFiles();
                verifyPorts(
                    DEFAULT_HTTP_PORT,
                    DEFAULT_HTTPS_PORT,
                    DEFAULT_WS_PORT,
                    DEFAULT_GRAPHQL_PORT
                );
                verifyMarkdownSupport(false);
            }));
        it('with Markdown support', () => helpers.run(join(__dirname, '../generators/server'))
            .withOptions({skipInstall})
            .withPrompts({markdownSupport: true})
            .toPromise()
            .then(() => {
                verifyCoreFiles();
                verifyPorts(
                    DEFAULT_HTTP_PORT,
                    DEFAULT_HTTPS_PORT,
                    DEFAULT_WS_PORT,
                    DEFAULT_GRAPHQL_PORT
                );
                verifyMarkdownSupport(true);
            }));
        it('without Markdown support', () => helpers.run(join(__dirname, '../generators/server'))
            .withOptions({skipInstall})
            .toPromise()
            .then(() => {
                verifyCoreFiles();
                verifyPorts(
                    DEFAULT_HTTP_PORT,
                    DEFAULT_HTTPS_PORT,
                    DEFAULT_WS_PORT,
                    DEFAULT_GRAPHQL_PORT
                );
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
        'web/graphql.js',
        'web/client/index.html',
        'favicon.ico'
    ];
    ALWAYS_INCLUDED.forEach(name => file(name));
}
function verifyPorts(http, https, ws, graphql) {
    [
        ['config/default.js', `port: process.env.PORT || ${ http}`],
        ['config/default.js', `port: ${ https}`],
        ['config/default.js', `port: ${ ws}`],
        ['config/default.js', `port: ${ graphql}`]
    ].forEach(data => fileContent(...data));
}
function verifyMarkdownSupport(exists) {
    (exists ? file : noFile)('web/client/example.md');
    (exists ? fileContent : noFileContent)('web/server.js', 'engine(\'md\', ');
}
