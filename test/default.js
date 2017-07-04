'use strict';

const {merge, mapValues, isBoolean} = require('lodash');
const path      = require('path');
const sinon     = require('sinon');
const helpers   = require('yeoman-test');
const assert    = require('yeoman-assert');
const Generator = require('yeoman-generator');
const prompts   = require('../generators/app/prompts');

const {
    verifyCoreFiles,
    verifyBoilerplateFiles,
    verifyDefaultConfiguration,
    verifyDefaultTasksConfiguration,
    verifySassConfigured
} = require('./lib/common');

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
    let stub;
    beforeEach(() => {
        stub = sinon.stub(Generator.prototype.user.git, 'name').returns(null);
    });
    afterEach(() => {
        stub.restore();
    });
    describe('can create and configure files with prompt choices', () => {
        let verify = () => {
            verifyCoreFiles();
            verifyBoilerplateFiles('./');
        };
        it('all prompts FALSE (default configuration)', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(ALL_FALSE)
                .toPromise()
                .then(() => {
                    verify();
                    assert.noFileContent(browserifyContent);
                    assert.noFileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                    assert.fileContent('config/.eslintrc.js', 'amd: true,');
                    assert.fileContent('config/.eslintrc.js', 'backbone/defaults-on-top');
                });
        });
        it('all prompts TRUE (default configuration)', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(() => {
                    verifyBoilerplateFiles('./');
                    verifyDefaultConfiguration();
                    verifyDefaultTasksConfiguration();
                    assert.fileContent('config/.eslintrc.js', 'es6: true,');
                    assert.fileContent('config/.eslintrc.js', 'backbone/defaults-on-top');
                });
        });
        it('all prompts TRUE (--script-bundler browserify)', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {scriptBundler: 'browserify'}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(() => {
                    verify();
                    assert.fileContent(browserifyContent);
                    assert.fileContent(ariaContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');

                });
        });
        it('all prompts TRUE (--css-preprocessor sass)', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {cssPreprocessor: 'sass'}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(verify);
        });
        it('all prompts TRUE (--template-technology lodash)', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {templateTechnology: 'lodash'}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(() => {
                    verify();
                    assert.fileContent('Gruntfile.js', 'jst');
                    assert.noFileContent('Gruntfile.js', 'handlebars');
                });
        });
        it('all prompts TRUE (--skip-aria)', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {'skip-aria': true}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(() => {
                    verify();
                    assert.noFileContent(ariaContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('all prompts TRUE (--skip-imagemin)', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {'skip-imagemin': true}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(() => {
                    verify();
                    assert.fileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('only aria prompt FALSE', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {aria: false}))
                .toPromise()
                .then(() => {
                    verify();
                    assert.noFileContent(ariaContent);
                });
        });
        it('only imagemin prompt FALSE', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {imagemin: false}))
                .toPromise()
                .then(() => {
                    verify();
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('select browserify via prompt', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {scriptBundler: 'browserify'}))
                .toPromise()
                .then(() => {
                    verify();
                    assert.fileContent(browserifyContent);
                    assert.fileContent(ariaContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');

                });
        });
        it('select sass via prompt', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {cssPreprocessor: 'sass'}))
                .toPromise()
                .then(verify);
        });
        it('select no CSS pre-processor via prompt', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {cssPreprocessor: 'none'}))
                .toPromise()
                .then(() => {
                    verify();
                    assert.noFile('assets/css/reset.css');
                    assert.noFile('assets/less/style.less');
                    assert.noFile('assets/sass/style.scss');
                    assert.noFileContent('Gruntfile.js', 'sass: ');
                    assert.noFileContent('Gruntfile.js', 'less: ');
                });
        });
    });
    describe('can create and configure files with with command line options', () => {
        let defaults = true;
        let verify = () => {
            verifyCoreFiles();
            verifyBoilerplateFiles('./');
        };
        it('--defaults', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {defaults}))
                .toPromise()
                .then(() => {
                    verifyBoilerplateFiles('./');
                    verifyDefaultConfiguration();
                });
        });
        it('--defaults --script-bundler browserify', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {defaults}, {scriptBundler: 'browserify'}))
                .toPromise()
                .then(() => {
                    verify();
                    assert.fileContent(browserifyContent);
                });
        });
        it('--defaults --css-preprocessor sass', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {defaults}, {cssPreprocessor: 'sass'}))
                .toPromise()
                .then(verify);
        });
        it('--defaults --css-preprocessor none', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {defaults}, {cssPreprocessor: 'none'}))
                .toPromise()
                .then(() => {
                    verify();
                    assert.noFile('assets/css/reset.css');
                    assert.noFile('assets/less/style.less');
                    assert.noFile('assets/sass/style.scss');
                    assert.noFileContent('Gruntfile.js', 'sass: ');
                    assert.noFileContent('Gruntfile.js', 'less: ');
                });
        });
        it('--defaults --template-technology lodash', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {defaults}, {templateTechnology: 'lodash'}))
                .toPromise()
                .then(() => {
                    verify();
                    assert.fileContent('Gruntfile.js', 'jst');
                    assert.noFileContent('Gruntfile.js', 'handlebars');
                });
        });
        it('--defaults --skip-aria --skip-imagemin', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {
                    defaults: true,
                    'skip-aria': true,
                    'skip-imagemin': true}))
                .toPromise()
                .then(() => {
                    verify();
                    assert.noFileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('--defaults --skip-aria --skip-imagemin --script-bundler browserify', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {
                    defaults: true,
                    'skip-aria': true,
                    'skip-imagemin': true,
                    scriptBundler: 'browserify'}))
                .toPromise()
                .then(() => {
                    verify();
                    assert.fileContent(browserifyContent);
                    assert.noFileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('--defaults --script-bundler browserify --css-preprocessor sass --template-technology lodash', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {
                    defaults: true,
                    scriptBundler: 'browserify',
                    cssPreprocessor: 'sass',
                    templateTechnology: 'lodash'}))
                .toPromise()
                .then(() => {
                    verify();
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
    let stub;
    let sourceDirectory = 'webapp/';
    let verify = () => {
        verifyCoreFiles();
        verifyBoilerplateFiles(sourceDirectory);
    };
    describe('can create and configure files with prompt choices', () => {
        before(() => {
            stub = sinon.stub(Generator.prototype.user.git, 'name').returns(null);
        });
        after(() => {
            stub.restore();
        });
        it('all prompts TRUE', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge(ALL_TRUE, {sourceDirectory}))
                .toPromise()
                .then(() => {
                    verifyBoilerplateFiles(sourceDirectory);
                    verifyDefaultConfiguration(sourceDirectory);
                });
        });
        it('all prompts FALSE', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge(ALL_FALSE, {sourceDirectory}))
                .toPromise()
                .then(() => {
                    verify();
                    assert.noFileContent(browserifyContent);
                    assert.noFileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('only aria prompt FALSE', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {sourceDirectory, aria: false}))
                .toPromise()
                .then(() => {
                    verify();
                    assert.noFileContent(browserifyContent);
                    assert.noFileContent(ariaContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('only imagemin prompt FALSE', () => {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {sourceDirectory, imagemin: false}))
                .toPromise()
                .then(() => {
                    verify();
                    assert.noFileContent(browserifyContent);
                    assert.fileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
    });
});
