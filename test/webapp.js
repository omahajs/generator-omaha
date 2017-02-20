'use strict';

var path      = require('path');
var fs        = require('fs-extra');
var sinon     = require('sinon');
var helpers   = require('yeoman-test');
var Generator = require('yeoman-generator');
var prompts   = require('../generators/app/prompts');
var common    = require('./lib/common');

var verifyBoilerplateFiles     = common.verifyBoilerplateFiles;
var verifyDefaultConfiguration = common.verifyDefaultConfiguration;

var SKIP_INSTALL = {skipInstall: true};

describe('Webapp generator', function() {
    var stub;
    before(function() {
        stub = sinon.stub(Generator.prototype.user.git, 'name');
        stub.returns(null);
    });
    after(function() {
        stub.restore();
    });
    it('can create and configure files with default prompt choices', function() {
        var sourceDirectory = './';
        function createDummyProject(dir) {
            var projectTemplatesDirectory = '../generators/project/templates/';
            ['_Gruntfile.js', '_package.json'].forEach(function(file) {
                fs.copySync(
                    path.join(__dirname, `${projectTemplatesDirectory}${file}`),
                    path.join(dir, file.split('_')[1])
                );
            });
            fs.copySync(
                path.join(__dirname, `${projectTemplatesDirectory}config/_default.json`),
                path.join(dir, 'config', 'default.json')
            );
        }
        return helpers.run(path.join(__dirname, '../generators/webapp'))
            .inTmpDir(createDummyProject)
            .withOptions(SKIP_INSTALL)
            .withPrompts(prompts.webapp.defaults)
            .withLocalConfig({projectName: 'omaha-project', sourceDirectory})
            .toPromise()
            .then(function() {
                verifyBoilerplateFiles(sourceDirectory);
                verifyDefaultConfiguration();
            });
    });
});
