'use strict';

const {merge}    = require('lodash');
const path       = require('path');
const sinon      = require('sinon');
const helpers    = require('yeoman-test');
const assert     = require('yeoman-assert');
const Generator  = require('yeoman-generator');
const {defaults} = require('../generators/app/prompts').project;
const {clone}    = require('../generators/app/utils').object;

describe('Project generator', function() {
    let stub;
    let SKIP_INSTALL = {skipInstall: true};
    describe('can create and configure files with prompt choices', function() {
        before(function() {
            stub = sinon.stub(Generator.prototype.user.git, 'name');
            stub.returns(null);
        });
        after(function() {
            stub.restore();
        });
        it('all prompts TRUE', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(defaults)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(true, true);
                });
        });
        it('all prompts FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge(clone(defaults), {
                    benchmark: false,
                    coveralls: false,
                    jsinspect: false
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(false, false);
                });
        });
        it('only benchmark FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge(clone(defaults), {
                    benchmark: false
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(false, true);
                });
        });
        it('only coveralls FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge(clone(defaults), {
                    coveralls: false
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(true, false);
                });
        });
        it('only jsinspect FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge(clone(defaults), {
                    jsinspect: false
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(true, true);
                });
        });
    });
    describe('can create and configure files with command line options', function() {
        before(function() {
            stub = sinon.stub(Generator.prototype.user.git, 'name');
            stub.returns(null);
        });
        after(function() {
            stub.restore();
        });
        it('--defaults', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(merge(clone(SKIP_INSTALL), {
                    defaults: true
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(true, true);
                });
        });
        it('--defaults --skip-benchmark', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(merge(clone(SKIP_INSTALL), {
                    defaults: true,
                    'skip-benchmark': true
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(false, true);
                });
        });
        it('--defaults --skip-coveralls', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(merge(clone(SKIP_INSTALL), {
                    defaults: true,
                    'skip-coveralls': true
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(true, false);
                });
        });
        it('--defaults --skip-jsinspect', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(merge(clone(SKIP_INSTALL), {
                    defaults: true,
                    'skip-jsinspect': true
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(true, true);
                });
        });
        it('--defaults --skip-benchmark --skip-coveralls --skip-jsinspect', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(merge(clone(SKIP_INSTALL), {
                    defaults: true,
                    'skip-benchmark': true,
                    'skip-coveralls': true,
                    'skip-jsinspect': true
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(false, false);
                });
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
