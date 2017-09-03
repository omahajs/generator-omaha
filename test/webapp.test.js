'use strict';

const {join}     = require('path');
const {copySync} = require('fs-extra');
const sinon      = require('sinon');
const helpers    = require('yeoman-test');
const Generator  = require('yeoman-generator');
const {defaults} = require('../generators/app/prompts').webapp;
const {
    verifyBoilerplateFiles,
    verifyDefaultConfiguration
} = require('./lib/common');

describe('Webapp generator', () => {
    let stub;
    let projectName = 'omaha-project';
    let sourceDirectory = './';
    let verify = () => {
        verifyBoilerplateFiles(sourceDirectory);
        verifyDefaultConfiguration();
    };
    beforeAll(() => {
        stub = sinon.stub(Generator.prototype.user.git, 'name').returns(null);
    });
    afterAll(() => {
        stub.restore();
    });
    it('can create and configure files with default prompt choices', () => {
        return helpers.run(join(__dirname, '../generators/webapp'))
            .inTmpDir((dir) => {
                let projectTemplatesDirectory = '../generators/project/templates/';
                ['_README.md', '_Gruntfile.js', '_package.json'].forEach(function(file) {
                    copySync(
                        join(__dirname, `${projectTemplatesDirectory}${file}`),
                        join(dir, file.split('_')[1])
                    );
                });
                copySync(
                    join(__dirname, `${projectTemplatesDirectory}config/_default.json`),
                    join(dir, 'config', 'default.json')
                );
                copySync(
                    join(__dirname, `${projectTemplatesDirectory}config/_karma.conf.js`),
                    join(dir, 'config', 'karma.conf.js')
                );
            })
            .withOptions({skipInstall: true})
            .withPrompts(defaults)
            .withLocalConfig({projectName, sourceDirectory})
            .toPromise()
            .then(verify);
    });
});
