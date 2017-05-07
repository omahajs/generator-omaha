'use strict';

var path    = require('path');
var sinon   = require('sinon');
var helpers = require('yeoman-test');
var assert  = require('yeoman-assert');
var Yeoman  = require('yeoman-generator');
var prompts = require('../generators/app/prompts');
var utils   = require('../generators/app/utils');
var extend  = utils.object.extend;
var clone   = utils.object.clone;

describe('Project generator', function() {
    var stub;
    var SKIP_INSTALL = {skipInstall: true};
    describe('can create and configure files with prompt choices', function() {
        before(function() {
            stub = sinon.stub(Yeoman.prototype.user.git, 'name');
            stub.returns(null);
        });
        after(function() {
            stub.restore();
        });
        it('all prompts TRUE', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(prompts.project.defaults)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(true, true, true);
                });
        });
        it('all prompts FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(extend(clone(prompts.project.defaults), {
                    benchmark: false,
                    coveralls: false,
                    jsinspect: false
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(false, false, false);
                });
        });
        it('only benchmark FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(extend(clone(prompts.project.defaults), {
                    benchmark: false
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(false, true, true);
                });
        });
        it('only coveralls FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(extend(clone(prompts.project.defaults), {
                    coveralls: false
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(true, false, true);
                });
        });
        it('only jsinspect FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(extend(clone(prompts.project.defaults), {
                    jsinspect: false
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(true, true, false);
                });
        });
    });
    describe('can create and configure files with command line options', function() {
        before(function() {
            stub = sinon.stub(Yeoman.prototype.user.git, 'name');
            stub.returns(null);
        });
        after(function() {
            stub.restore();
        });
        it('--defaults', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(extend(clone(SKIP_INSTALL), {
                    defaults: true
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(true, true, true);
                });
        });
        it('--defaults --skip-benchmark', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(extend(clone(SKIP_INSTALL), {
                    defaults: true,
                    'skip-benchmark': true
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(false, true, true);
                });
        });
        it('--defaults --skip-coveralls', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(extend(clone(SKIP_INSTALL), {
                    defaults: true,
                    'skip-coveralls': true
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(true, false, true);
                });
        });
        it('--defaults --skip-jsinspect', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(extend(clone(SKIP_INSTALL), {
                    defaults: true,
                    'skip-jsinspect': true
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(true, true, false);
                });
        });
        it('--defaults --skip-benchmark --skip-coveralls --skip-jsinspect', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(extend(clone(SKIP_INSTALL), {
                    defaults: true,
                    'skip-benchmark': true,
                    'skip-coveralls': true,
                    'skip-jsinspect': true
                }))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyProjectConfigs(false, false, false);
                });
        });
    });
});

function verifyCoreFiles() {
    var ALWAYS_INCLUDED = [
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
function verifyProjectConfigs(useBenchmark, useCoveralls, useJsinspect) {
    var verify = (feature) => {return assert[feature ? 'fileContent' : 'noFileContent']};
    (useBenchmark ? assert.file : assert.noFile)('Gruntfile.js');
    (useCoveralls ? assert.file : assert.noFile)('.travis.yml');
    verify(useBenchmark)('package.json', '"test:perf": "');
    verify(useCoveralls)('package.json', '"test:travis": "nyc report --reporter=text-lcov | coveralls"');
}
