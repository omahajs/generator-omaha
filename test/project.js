'use strict';

const {merge}         = require('lodash');
const path            = require('path');
const sinon           = require('sinon');
const helpers         = require('yeoman-test');
const assert          = require('yeoman-assert');
const Generator       = require('yeoman-generator');
const {clone}         = require('../generators/app/utils').object;
const projectDefaults = require('../generators/app/prompts').project.defaults;

const SKIP_INSTALL = {skipInstall: true};
const defaults = true;
const useBoth = [true, true];
const useNeither = [false, false];
const onlyBenchmark = [true, false];
const onlyCoveralls = [false, true];

describe('Project generator', () => {
    let stub;
    let verify = (...args) => {
        verifyCoreFiles();
        verifyProjectConfigs(...args);
    };
    beforeEach(() => {
        stub = sinon.stub(Generator.prototype.user.git, 'name').returns(null);
    });
    afterEach(() => {
        stub.restore();
    });
    describe('can create and configure files with prompt choices', () => {
        it('all prompts TRUE', () => {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(projectDefaults)
                .toPromise()
                .then(() => verify(...useBoth));
        });
        it('all prompts FALSE', () => {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge(clone(projectDefaults), {
                    benchmark: false,
                    coveralls: false,
                    jsinspect: false
                }))
                .toPromise()
                .then(() => verify(...useNeither));
        });
        it('only benchmark FALSE', () => {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge(clone(projectDefaults), {
                    benchmark: false
                }))
                .toPromise()
                .then(() => verify(...onlyCoveralls));
        });
        it('only coveralls FALSE', () => {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge(clone(projectDefaults), {
                    coveralls: false
                }))
                .toPromise()
                .then(() => verify(...onlyBenchmark));
        });
        it('only jsinspect FALSE', () => {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge(clone(projectDefaults), {
                    jsinspect: false
                }))
                .toPromise()
                .then(() => verify(...useBoth));
        });
    });
    describe('can create and configure files with command line options', () => {
        it('--defaults', () => {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(merge(clone(SKIP_INSTALL), {defaults}))
                .toPromise()
                .then(() => verify(...useBoth));
        });
        it('--defaults --skip-benchmark', () => {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(merge(clone(SKIP_INSTALL), {defaults}, {
                    'skip-benchmark': true
                }))
                .toPromise()
                .then(() => verify(...onlyCoveralls));
        });
        it('--defaults --skip-coveralls', () => {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(merge(clone(SKIP_INSTALL), {defaults}, {
                    'skip-coveralls': true
                }))
                .toPromise()
                .then(() => verify(...onlyBenchmark));
        });
        it('--defaults --skip-jsinspect', () => {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(merge(clone(SKIP_INSTALL), {defaults}, {
                    'skip-jsinspect': true
                }))
                .toPromise()
                .then(() => verify(...useBoth));
        });
        it('--defaults --skip-benchmark --skip-coveralls --skip-jsinspect', () => {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(merge(clone(SKIP_INSTALL), {defaults}, {
                    'skip-benchmark': true,
                    'skip-coveralls': true,
                    'skip-jsinspect': true
                }))
                .toPromise()
                .then(() => verify(...useNeither));
        });
    });
});
function verifyCoreFiles() {
    let ALWAYS_INCLUDED = [
        'LICENSE',
        'package.json',
        '.gitignore',
        'config/.eslintrc.js',
        'test/data/db.json',
        'test/mocha/specs/example.spec.js'
    ];
    assert.fileContent('package.json', '"name": "omaha-project"');
    assert.fileContent('package.json', '"author": "A. Developer"');
    assert.fileContent('config/.eslintrc.js', 'es6: true,');
    assert.noFileContent('config/.eslintrc.js', 'backbone');
    ALWAYS_INCLUDED.forEach(file => assert.file(file));
}
function verifyProjectConfigs(useBenchmark, useCoveralls) {
    let verify = (feature) => {return assert[feature ? 'fileContent' : 'noFileContent'];};
    (useBenchmark ? assert.file : assert.noFile)('Gruntfile.js');
    (useCoveralls ? assert.file : assert.noFile)('.travis.yml');
    verify(useBenchmark)('package.json', '"test:perf": "');
    verify(useCoveralls)('package.json', '"test:travis": "nyc report --reporter=text-lcov | coveralls"');
}
