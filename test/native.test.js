'use strict';

const {merge, mapValues, isBoolean} = require('lodash');
const {join}    = require('path');
const helpers   = require('yeoman-test');
const Generator = require('yeoman-generator');
const prompts   = require('../generators/app/prompts');
const {
    verifyNativeFiles,
    verifyBoilerplateFiles,
    verifyDefaultConfiguration,
    verifyNativeConfiguration
} = require('./lib/common');

const SKIP_INSTALL = {skipInstall: true};
const ALL_TRUE = merge({}, prompts.project.defaults, prompts.webapp.defaults);
const ALL_FALSE = mapValues(ALL_TRUE, option => isBoolean(option) ? false : option);

describe('Native generator', function() {
    const sourceDirectory = './renderer/';
    const isWebapp = true;
    const verify = isWebapp => {
        verifyNativeFiles(isWebapp);
        verifyNativeConfiguration(isWebapp);
    };
    it('all prompts FALSE (default configuration)', () => helpers.run(join(__dirname, '../generators/native'))
        .withOptions(SKIP_INSTALL)
        .withPrompts(ALL_FALSE)
        .toPromise()
        .then(() => {
            verify(isWebapp);
            verifyBoilerplateFiles(sourceDirectory);
        }));
    it('all prompts FALSE (default configuration - no user)', () => {
        const stub = jest.spyOn(Generator.prototype.user.git, 'name').mockReturnValue(null);
        return helpers.run(join(__dirname, '../generators/native'))
            .withOptions(SKIP_INSTALL)
            .withPrompts(ALL_FALSE)
            .toPromise()
            .then(() => {
                verify(isWebapp);
                verifyBoilerplateFiles(sourceDirectory);
                stub.mockRestore();
            });
    });
    it('all prompts TRUE', () => helpers.run(join(__dirname, '../generators/native'))
        .withOptions(SKIP_INSTALL)
        .withPrompts(ALL_TRUE)
        .toPromise()
        .then(() => {
            verify(isWebapp);
            verifyBoilerplateFiles(sourceDirectory);
            verifyDefaultConfiguration(sourceDirectory);
        }));

    it('--defaults --skip-webapp', () => helpers.run(join(__dirname, '../generators/native'))
        .withOptions(merge({}, SKIP_INSTALL, {defaults: true, skipWebapp: true}))
        .toPromise()
        .then(() => verify()));
});
