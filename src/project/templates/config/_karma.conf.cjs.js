'use strict';

const config = require('config').get('grunt');
const specs = config.folders.test + '/' + config.folders.specs + '/**/*.js';// test files
module.exports = function(karmaConfig) {
    karmaConfig.set({
        basePath: '../',
        frameworks: ['browserify', 'mocha', 'chai', 'sinon'],
        browserify: {
            debug: true,
            transform: [
                ['browserify-istanbul', {instrumenterConfig: {embedSource: true}}]
            ]
        },
        files: [specs],
        preprocessors: {
            [specs]: ['browserify']
        },
        reporters: ['progress', 'mocha', 'coverage'],
        coverageReporter: {
            dir: config.folders.reports + '/' + config.folders.coverage,
            includeAllSources: true,
            reporters: [
                {type: 'text-summary', subdir: '.', file: 'text-summary.txt'},
                {type: 'html', subdir: 'report-html'},
                {type: 'text-summary'},
                {type: 'lcov', subdir: 'report-lcov'},
                {type: 'cobertura', subdir: '.', file: 'report-cobertura.txt'}// Jenkins compatible
            ]
        },
        colors: true,
        logLevel: 'INFO',// DISABLE, ERROR, WARN, INFO, DEBUG
        captureTimeout: 60000,
        singleRun: true
    });
};
