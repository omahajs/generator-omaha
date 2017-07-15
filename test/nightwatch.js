'use strict';

process.env.mode = 'TESTING';

const {join}     = require('path');
const {copySync} = require('fs-extra');
const helpers    = require('yeoman-test');
const assert     = require('yeoman-assert');

const SKIP_INSTALL = {skipInstall: true};

describe('Nightwatch Generator', function() {
    it('can scaffold files needed to use nightwatch for E2E testing', function() {
        return helpers.run(join(__dirname, '../generators/nightwatch'))
            .inTmpDir((dir) => {
                copySync(
                    join(__dirname, '../generators/project/templates/_package.json'),
                    join(dir, 'package.json')
                );
            })
            .withLocalConfig({isWebapp: true})
            .withOptions(SKIP_INSTALL)
            .toPromise()
            .then(verifyCoreFiles);
    });
    it('can exit when run in empty directory', function() {
        return helpers.run(join(__dirname, '../generators/nightwatch'))
            .inTmpDir((dir) => {
                copySync(
                    join(__dirname, '../generators/project/templates/_package.json'),
                    join(dir, 'package.json')
                );
            })
            .toPromise();
    });
});
function verifyCoreFiles() {
    let ALWAYS_INCLUDED = [
        'config/nightwatch.conf.js',
        'test/nightwatch/globals.js',
        'test/nightwatch/commands/log.js',
        'test/nightwatch/tests/main.js'
    ];
    assert.fileContent('package.json', '"test:e2e": "nightwatch ');
    ALWAYS_INCLUDED.forEach(file => assert.file(file));
}
