/* eslint-disable promise/always-return */
const {merge}    = require('lodash');
const {join}     = require('path');
const helpers    = require('yeoman-test');
const assert     = require('yeoman-assert');
const Generator  = require('yeoman-generator');
const {clone}    = require('../generators/app/utils').object;
const {defaults} = require('../generators/app/prompts').project;

const SKIP_INSTALL = {skipInstall: true};
const useBoth = [true, true];
const useNeither = [false, false];

describe('Project generator', () => {
    let stub;
    const verify = (...args) => {
        verifyCoreFiles();
    };
    beforeEach(() => {
        stub = jest.spyOn(Generator.prototype.user.git, 'name').mockReturnValue(null);
    });
    afterEach(() => {
        stub.mockRestore();
    });
    describe('can create and configure files with prompt choices', () => {
        it('all prompts TRUE', () => helpers.run(join(__dirname, '../generators/project'))
            .withOptions(SKIP_INSTALL)
            .withPrompts(defaults)
            .toPromise()
            .then(() => verify(...useBoth)));
        it('all prompts FALSE', () => helpers.run(join(__dirname, '../generators/project'))
            .withOptions(SKIP_INSTALL)
            .withPrompts(merge(clone(defaults), {
                jsinspect: false
            }))
            .toPromise()
            .then(() => verify(...useNeither)));
    });
    describe('can create and configure files with command line options', () => {
        const name = 'my-super-cool-project';
        it('--defaults', () => helpers.run(join(__dirname, '../generators/project'))
            .withOptions(merge(clone(SKIP_INSTALL), {defaults: true}))
            .toPromise()
            .then(() => verify(...useBoth)));
        it('--defaults --name my-super-cool-project', () => helpers.run(join(__dirname, '../generators/project'))
            .withOptions(merge(clone(SKIP_INSTALL), {defaults: true, name}))
            .toPromise()
            .then(() => {
                verifyCoreFiles(name);
            }));
        it('--defaults --skip-jsinspect', () => helpers.run(join(__dirname, '../generators/project'))
            .withOptions(merge(clone(SKIP_INSTALL), {defaults: true}, {
                'skip-jsinspect': true
            }))
            .toPromise()
            .then(() => verify(...useBoth)));
        it('--defaults --use-jest', () => helpers.run(join(__dirname, '../generators/project'))
            .withOptions(merge(clone(SKIP_INSTALL), {defaults: true}, {
                'use-jest': true
            }))
            .toPromise()
            .then(() => {
                assert.fileContent('package.json', '"testMatch":');
                assert.file('test/example.test.js');
                assert.noFile('test/mocha.opts');
                assert.noFileContent('package.json', 'nyc');
                assert.noFileContent('package.json', 'mocha');
            }));
        it('--defaults --slim', () => helpers.run(join(__dirname, '../generators/project'))
            .withOptions(merge(clone(SKIP_INSTALL), {defaults: true, slim: true}))
            .toPromise()
            .then(() => verify(...useNeither)));
        it('--defaults --slim --name my-super-cool-project', () => helpers.run(join(__dirname, '../generators/project'))
            .withOptions(merge(clone(SKIP_INSTALL), {defaults: true, slim: true, name}))
            .toPromise()
            .then(() => {
                verifyCoreFiles(name);
            }));
    });
});
function verifyCoreFiles(projectName = 'omaha-project') {
    const ALWAYS_INCLUDED = [
        'README.md',
        'LICENSE',
        'package.json',
        '.gitignore',
        'config/.eslintrc.js',
        'test/data/db.json',
        'test/mocha/specs/example.spec.js'
    ];
    assert.noFile('test/example.test.js');
    assert.noFileContent('package.json', '"testMatch":');
    assert.fileContent('package.json', `"name": "${projectName}"`);
    assert.fileContent('package.json', '"author": "A. Developer"');
    assert.fileContent('config/.eslintrc.js', 'es6: true,');
    assert.noFileContent('config/.eslintrc.js', 'backbone');
    ALWAYS_INCLUDED.forEach(file => assert.file(file));
}
