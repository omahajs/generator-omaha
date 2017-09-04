'use strict';

const {merge, mapValues, isBoolean} = require('lodash');
const {join}    = require('path');
const helpers   = require('yeoman-test');
const {noFile, fileContent, noFileContent} = require('yeoman-assert');
const Generator = require('yeoman-generator');
const prompts   = require('../generators/app/prompts');
const {
    verifyCoreFiles,
    verifyBoilerplateFiles,
    verifyDefaultConfiguration,
    verifyDefaultTasksConfiguration,
    verifySassConfigured
} = require('./lib/common');

const ALL_TRUE = merge({}, prompts.project.defaults, prompts.webapp.defaults);
const ALL_FALSE = mapValues(ALL_TRUE, (option) => {return isBoolean(option) ? false : option;});
const SKIP_INSTALL = {skipInstall: true};
const browserifyContent = [
    ['package.json', '"browser":'],
    ['package.json', '"browserify":'],
    ['package.json', '"aliasify":'],
    ['Gruntfile.js', 'browserify'],
    ['Gruntfile.js', 'uglify:']
];
const ariaContent = [
    ['Gruntfile.js', 'a11y: '],
    ['Gruntfile.js', 'accessibility: '],
    ['Gruntfile.js', 'aria-audit']
];

describe('Default generator', function() {
    let stub;
    beforeEach(() => {
        stub = jest.spyOn(Generator.prototype.user.git, 'name').mockReturnValue(null);
    });
    afterEach(() => {
        stub.mockRestore();
    });
    describe('can create and configure files with prompt choices', () => {
        let verify = () => {
            verifyCoreFiles();
            verifyBoilerplateFiles('./');
        };
        it('all prompts FALSE (default configuration)', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(ALL_FALSE)
                .toPromise()
                .then(() => {
                    verify();
                    noFileContent(browserifyContent);
                    noFileContent(ariaContent);
                    noFileContent('Gruntfile.js', 'imagemin: ');
                    fileContent('config/.eslintrc.js', 'amd: true,');
                    fileContent('config/.eslintrc.js', 'backbone/defaults-on-top');
                });
        });
        it('all prompts TRUE (default configuration)', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(() => {
                    verifyBoilerplateFiles('./');
                    verifyDefaultConfiguration();
                    verifyDefaultTasksConfiguration();
                    fileContent('config/.eslintrc.js', 'es6: true,');
                    fileContent('config/.eslintrc.js', 'backbone/defaults-on-top');
                });
        });
        it('all prompts TRUE (--script-bundler browserify)', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {scriptBundler: 'browserify'}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(() => {
                    verify();
                    fileContent(browserifyContent);
                    fileContent(ariaContent);
                    fileContent('Gruntfile.js', 'imagemin: ');

                });
        });
        it('all prompts TRUE (--css-preprocessor sass)', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {cssPreprocessor: 'sass'}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(verify);
        });
        it('all prompts TRUE (--template-technology lodash)', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {templateTechnology: 'lodash'}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(() => {
                    verify();
                    fileContent('Gruntfile.js', 'jst');
                    noFileContent('Gruntfile.js', 'handlebars');
                });
        });
        it('all prompts TRUE (--skip-aria)', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {'skip-aria': true}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(() => {
                    verify();
                    noFileContent(ariaContent);
                    fileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('all prompts TRUE (--skip-imagemin)', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {'skip-imagemin': true}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(() => {
                    verify();
                    fileContent(ariaContent);
                    noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('only aria prompt FALSE', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {aria: false}))
                .toPromise()
                .then(() => {
                    verify();
                    noFileContent(ariaContent);
                });
        });
        it('only imagemin prompt FALSE', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {imagemin: false}))
                .toPromise()
                .then(() => {
                    verify();
                    noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('select browserify via prompt', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {scriptBundler: 'browserify'}))
                .toPromise()
                .then(() => {
                    verify();
                    fileContent(browserifyContent);
                    fileContent(ariaContent);
                    fileContent('Gruntfile.js', 'imagemin: ');

                });
        });
        it('select sass via prompt', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {cssPreprocessor: 'sass'}))
                .toPromise()
                .then(verify);
        });
        it('select no CSS pre-processor via prompt', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {cssPreprocessor: 'none'}))
                .toPromise()
                .then(() => {
                    verify();
                    noFile('assets/css/reset.css');
                    noFile('assets/less/style.less');
                    noFile('assets/sass/style.scss');
                    noFileContent('Gruntfile.js', 'sass: ');
                    noFileContent('Gruntfile.js', 'less: ');
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
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {defaults}))
                .toPromise()
                .then(() => {
                    verifyBoilerplateFiles('./');
                    verifyDefaultConfiguration();
                });
        });
        it('--defaults --script-bundler browserify', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {defaults}, {scriptBundler: 'browserify'}))
                .toPromise()
                .then(() => {
                    verify();
                    fileContent(browserifyContent);
                });
        });
        it('--defaults --css-preprocessor sass', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {defaults}, {cssPreprocessor: 'sass'}))
                .toPromise()
                .then(verify);
        });
        it('--defaults --css-preprocessor none', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {defaults}, {cssPreprocessor: 'none'}))
                .toPromise()
                .then(() => {
                    verify();
                    noFile('assets/css/reset.css');
                    noFile('assets/less/style.less');
                    noFile('assets/sass/style.scss');
                    noFileContent('Gruntfile.js', 'sass: ');
                    noFileContent('Gruntfile.js', 'less: ');
                });
        });
        it('--defaults --template-technology lodash', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {defaults}, {templateTechnology: 'lodash'}))
                .toPromise()
                .then(() => {
                    verify();
                    fileContent('Gruntfile.js', 'jst');
                    noFileContent('Gruntfile.js', 'handlebars');
                });
        });
        it('--defaults --skip-aria --skip-imagemin', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {
                    defaults: true,
                    'skip-aria': true,
                    'skip-imagemin': true}))
                .toPromise()
                .then(() => {
                    verify();
                    noFileContent(ariaContent);
                    noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('--defaults --skip-aria --skip-imagemin --script-bundler browserify', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {
                    defaults: true,
                    'skip-aria': true,
                    'skip-imagemin': true,
                    scriptBundler: 'browserify'}))
                .toPromise()
                .then(() => {
                    verify();
                    fileContent(browserifyContent);
                    noFileContent(ariaContent);
                    noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('--defaults --script-bundler browserify --css-preprocessor sass --template-technology lodash', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(merge({}, SKIP_INSTALL, {
                    defaults: true,
                    scriptBundler: 'browserify',
                    cssPreprocessor: 'sass',
                    templateTechnology: 'lodash'}))
                .toPromise()
                .then(() => {
                    verify();
                    verifySassConfigured();
                    fileContent(browserifyContent);
                    fileContent('Gruntfile.js', 'jst');
                    noFileContent('Gruntfile.js', 'handlebars');
                    fileContent(ariaContent);
                    fileContent('Gruntfile.js', 'imagemin: ');
                });
        });
    });
});
describe('Default generator (with custom source directory)', function() {
    let stub;
    let sourceDirectory = 'webapp/';
    let verify = () => {
        verifyCoreFiles();
        verifyBoilerplateFiles(sourceDirectory);
    };
    describe('can create and configure files with prompt choices', () => {
        beforeAll(() => {
            stub = jest.spyOn(Generator.prototype.user.git, 'name').mockReturnValue(null);
        });
        afterAll(() => {
            stub.mockRestore();
        });
        it('all prompts TRUE', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge(ALL_TRUE, {sourceDirectory}))
                .toPromise()
                .then(() => {
                    verifyBoilerplateFiles(sourceDirectory);
                    verifyDefaultConfiguration(sourceDirectory);
                });
        });
        it('all prompts FALSE', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge(ALL_FALSE, {sourceDirectory}))
                .toPromise()
                .then(() => {
                    verify();
                    noFileContent(browserifyContent);
                    noFileContent(ariaContent);
                    noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('only aria prompt FALSE', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {sourceDirectory, aria: false}))
                .toPromise()
                .then(() => {
                    verify();
                    noFileContent(browserifyContent);
                    noFileContent(ariaContent);
                    fileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('only imagemin prompt FALSE', () => {
            return helpers.run(join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(merge({}, ALL_TRUE, {sourceDirectory, imagemin: false}))
                .toPromise()
                .then(() => {
                    verify();
                    noFileContent(browserifyContent);
                    fileContent(ariaContent);
                    noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
    });
});
