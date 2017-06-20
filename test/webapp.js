'use strict';

const path       = require('path');
const {copySync} = require('fs-extra');
const sinon      = require('sinon');
const helpers    = require('yeoman-test');
const Generator  = require('yeoman-generator');
const defaults   = require('../generators/app/prompts').webapp.defaults;

const {
    verifyBoilerplateFiles,
    verifyDefaultConfiguration
} = require('./lib/common');

describe('Webapp generator', function() {
    let stub;
    before(function() {
        stub = sinon.stub(Generator.prototype.user.git, 'name');
        stub.returns(null);
    });
    after(function() {
        stub.restore();
    });
    it('can create and configure files with default prompt choices', function() {
        let projectName = 'omaha-project';
        let sourceDirectory = './';
        function createDummyProject(dir) {
            var projectTemplatesDirectory = '../generators/project/templates/';
            ['_Gruntfile.js', '_package.json'].forEach(function(file) {
                copySync(
                    path.join(__dirname, `${projectTemplatesDirectory}${file}`),
                    path.join(dir, file.split('_')[1])
                );
            });
            copySync(
                path.join(__dirname, `${projectTemplatesDirectory}config/_default.json`),
                path.join(dir, 'config', 'default.json')
            );
            copySync(
                path.join(__dirname, `${projectTemplatesDirectory}config/_karma.conf.js`),
                path.join(dir, 'config', 'karma.conf.js')
            );
        }
        return helpers.run(path.join(__dirname, '../generators/webapp'))
            .inTmpDir(createDummyProject)
            .withOptions({skipInstall: true})
            .withPrompts(defaults)
            .withLocalConfig({projectName, sourceDirectory})
            .toPromise()
            .then(function() {
                verifyBoilerplateFiles(sourceDirectory);
                verifyDefaultConfiguration();
            });
    });
});
