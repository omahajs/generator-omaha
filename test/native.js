'use strict';

const {merge, mapValues, isBoolean} = require('lodash');
const {join}    = require('path');
const sinon     = require('sinon');
const helpers   = require('yeoman-test');
const Generator = require('yeoman-generator');
const prompts   = require('../generators/app/prompts');
const {
    verifyNativeFiles,
    verifyBoilerplateFiles,
    verifyDefaultConfiguration,
    verifyNativeConfiguration
} = require('./lib/common');

const ENOUGH_TIME_FOR_SETUP = 5000;
const SKIP_INSTALL = {skipInstall: true};
const ALL_TRUE = merge({}, prompts.project.defaults, prompts.webapp.defaults);
const ALL_FALSE = mapValues(ALL_TRUE, (option) => {return isBoolean(option) ? false : option;});

describe('Native generator', function() {
    this.timeout(ENOUGH_TIME_FOR_SETUP);
    let sourceDirectory = './renderer/';
    let isWebapp = true;
    let verify = (isWebapp) => {
        verifyNativeFiles(isWebapp);
        verifyNativeConfiguration(isWebapp);
    };
    it('all prompts FALSE (default configuration)', () => {
        return helpers.run(join(__dirname, '../generators/native'))
            .withOptions(SKIP_INSTALL)
            .withPrompts(ALL_FALSE)
            .toPromise()
            .then(() => {
                verify(isWebapp);
                verifyBoilerplateFiles(sourceDirectory);
            });
    });
    it('all prompts FALSE (default configuration - no user)', () => {
        let stub = sinon.stub(Generator.prototype.user.git, 'name').returns(null);
        return helpers.run(join(__dirname, '../generators/native'))
            .withOptions(SKIP_INSTALL)
            .withPrompts(ALL_FALSE)
            .toPromise()
            .then(() => {
                verify(isWebapp);
                verifyBoilerplateFiles(sourceDirectory);
                stub.restore();
            });
    });
    it('all prompts TRUE', () => {
        return helpers.run(join(__dirname, '../generators/native'))
            .withOptions(SKIP_INSTALL)
            .withPrompts(ALL_TRUE)
            .toPromise()
            .then(() => {
                verify(isWebapp);
                verifyBoilerplateFiles(sourceDirectory);
                verifyDefaultConfiguration(sourceDirectory);
            });
    });

    it('--defaults --skip-webapp', () => {
        return helpers.run(join(__dirname, '../generators/native'))
            .withOptions(merge({}, SKIP_INSTALL, {defaults: true, skipWebapp: true}))
            .toPromise()
            .then(() => verify());
    });
});
