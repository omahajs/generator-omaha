'use strict';

const {merge, mapValues, isBoolean} = require('lodash');
const path      = require('path');
const sinon     = require('sinon');
const helpers   = require('yeoman-test');
const assert    = require('yeoman-assert');
const Generator = require('yeoman-generator');
const utils     = require('../generators/app/utils');
const prompts   = require('../generators/app/prompts');
const common    = require('./lib/common');

const {
    verifyCoreFiles,
    verifyBoilerplateFiles,
    verifyDefaultConfiguration,
    verifyDefaultTasksConfiguration,
    verifySassConfigured
} = require('./lib/common')

const ENOUGH_TIME_FOR_SETUP = 5000;
const ALL_TRUE = merge({}, prompts.project.defaults, prompts.webapp.defaults);
const ALL_FALSE = mapValues(ALL_TRUE, (option) => {return isBoolean(option) ? false : option;});
const SKIP_INSTALL = {skipInstall: true};
const browserifyContent = [
    ['package.json', '"browser":'],
    ['package.json', '"browserify":'],
    ['package.json', '"aliasify":'],
    ['Gruntfile.js', 'browserify'],
    ['Gruntfile.js', 'replace:'],
    ['Gruntfile.js', 'uglify:']
];
const ariaContent = [
    ['Gruntfile.js', 'a11y: '],
    ['Gruntfile.js', 'accessibility: '],
    ['Gruntfile.js', 'aria-audit']
];

describe('Default generator', function() {
    this.timeout(ENOUGH_TIME_FOR_SETUP);
    var stub;
    describe('can create and configure files with prompt choices', function() {
        before(function() {
            stub = sinon.stub(Generator.prototype.user.git, 'name');
            stub.returns(null);
        });
        after(function() {
            stub.restore();
        });
        it('all prompts FALSE (default configuration)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(ALL_FALSE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent(browserifyContent);
                    assert.noFileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                    assert.fileContent('config/.eslintrc.js', 'amd: true,');
                    assert.fileContent('config/.eslintrc.js', 'backbone/defaults-on-top');
                });
        });
        it('all prompts TRUE (default configuration)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyBoilerplateFiles('./');
                    verifyDefaultConfiguration();
                    verifyDefaultTasksConfiguration();
                    assert.fileContent('config/.eslintrc.js', 'es6: true,');
                    assert.fileContent('config/.eslintrc.js', 'backbone/defaults-on-top');
                });
        });
        it('all prompts TRUE (--script-bundler browserify)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {scriptBundler: 'browserify'}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent(browserifyContent);
                    assert.fileContent(ariaContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');

                });
        });
        it('all prompts TRUE (--css-preprocessor sass)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {cssPreprocessor: 'sass'}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    verifySassConfigured();
                });
        });
        it('all prompts TRUE (--template-technology lodash)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {templateTechnology: 'lodash'}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent('Gruntfile.js', 'jst');
                    assert.noFileContent('Gruntfile.js', 'handlebars');
                });
        });
        it('all prompts TRUE (--skip-aria)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {'skip-aria': true}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent(ariaContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('all prompts TRUE (--skip-imagemin)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {'skip-imagemin': true}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('only aria prompt FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {aria: false}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent(ariaContent);
                });
        });
        it('only imagemin prompt FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {imagemin: false}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('select browserify via prompt', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {scriptBundler: 'browserify'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent(browserifyContent);
                    assert.fileContent(ariaContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');

                });
        });
        it('select sass via prompt', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {cssPreprocessor: 'sass'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    verifySassConfigured();
                });
        });
        it('select no CSS pre-processor via prompt', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {cssPreprocessor: 'none'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFile('assets/css/reset.css');
                    assert.noFile('assets/less/style.less');
                    assert.noFile('assets/sass/style.scss');
                    assert.noFileContent('Gruntfile.js', 'sass: ');
                    assert.noFileContent('Gruntfile.js', 'less: ');
                });
        });
    });
    describe('can create and configure files with with command line options', function() {
        before(function() {
            stub = sinon.stub(Generator.prototype.user.git, 'name');
            stub.returns(null);
        });
        after(function() {
            stub.restore();
        });
        it('--defaults', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {defaults: true}))
                .toPromise()
                .then(function() {
                    verifyBoilerplateFiles('./');
                    verifyDefaultConfiguration();
                });
        });
        it('--defaults --script-bundler browserify', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {defaults: true, scriptBundler: 'browserify'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent(browserifyContent);
                });
        });
        it('--defaults --css-preprocessor sass', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {defaults: true, cssPreprocessor: 'sass'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    verifySassConfigured();
                });
        });
        it('--defaults --css-preprocessor none', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {defaults: true, cssPreprocessor: 'none'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFile('assets/css/reset.css');
                    assert.noFile('assets/less/style.less');
                    assert.noFile('assets/sass/style.scss');
                    assert.noFileContent('Gruntfile.js', 'sass: ');
                    assert.noFileContent('Gruntfile.js', 'less: ');
                });
        });
        it('--defaults --template-technology lodash', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {defaults: true, templateTechnology: 'lodash'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent('Gruntfile.js', 'jst');
                    assert.noFileContent('Gruntfile.js', 'handlebars');
                });
        });
        it('--defaults --skip-aria --skip-imagemin', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {
                    defaults: true,
                    'skip-aria': true,
                    'skip-imagemin': true}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('--defaults --skip-aria --skip-imagemin --script-bundler browserify', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {
                    defaults: true,
                    'skip-aria': true,
                    'skip-imagemin': true,
                    scriptBundler: 'browserify'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent(browserifyContent);
                    assert.noFileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('--defaults --script-bundler browserify --css-preprocessor sass --template-technology lodash', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {
                    defaults: true,
                    scriptBundler: 'browserify',
                    cssPreprocessor: 'sass',
                    templateTechnology: 'lodash'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    verifySassConfigured();
                    assert.fileContent(browserifyContent);
                    assert.fileContent('Gruntfile.js', 'jst');
                    assert.noFileContent('Gruntfile.js', 'handlebars');
                    assert.fileContent(ariaContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');
                });
        });
    });
});
describe('Default generator (with custom source directory)', function() {
    this.timeout(ENOUGH_TIME_FOR_SETUP);
    var stub;
    var sourceDirectory = 'webapp/';
    function createWebappProject() {
        return helpers.run(path.join(__dirname, '../generators/app'))
            .withOptions(SKIP_INSTALL)
            .withPrompts(merge(ALL_TRUE, {sourceDirectory}))
            .toPromise();
    }
    describe('can create and configure files with prompt choices', function() {
        before(function() {
            stub = sinon.stub(Generator.prototype.user.git, 'name');
            stub.returns(null);
        });
        after(function() {
            stub.restore();
        });
        it('all prompts TRUE', function() {
            return createWebappProject().then(function() {
                verifyBoilerplateFiles(sourceDirectory);
                verifyDefaultConfiguration(sourceDirectory);
            });
        });
        it('all prompts FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge(ALL_FALSE, {sourceDirectory}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles(sourceDirectory);
                    assert.noFileContent(browserifyContent);
                    assert.noFileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('only aria prompt FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {sourceDirectory, aria: false}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles(sourceDirectory);
                    assert.noFileContent(browserifyContent);
                    assert.noFileContent(ariaContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('only imagemin prompt FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {sourceDirectory, imagemin: false}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles(sourceDirectory);
                    assert.noFileContent(browserifyContent);
                    assert.fileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
    });
});
