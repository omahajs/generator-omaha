'use strict';

const {includes, partialRight} = require('lodash');
const {bold, green, magenta, red, white} = require('chalk');
const {copySync} = require('fs-extra');
const {join}     = require('path');
const Generator  = require('yeoman-generator');
const yosay      = require('yosay');
const {
    copyTpl,
    json: {extend}
} = require('../app/utils');

module.exports = Generator.extend({
    configuring: function() {
        if (this.config.get('isWebapp')) {
            let isLinux = includes(['linux', 'freebsd'], process.platform);
            let chromedriver = isLinux ? 'chromedriver' : 'chromedriver.exe';
            copySync(join(__dirname, `/bin/${chromedriver}`), `bin/${chromedriver}`);// v2.30
            copySync(join(__dirname, '/bin/selenium-server-standalone-3.4.0.jar'), 'bin/selenium-server-standalone.jar');
        } else {
            this.log(yosay(red('Not so fast!') + '\nUse ' + white.bgBlack(' yo omaha ') + ' first!'));
            (process.env.mode !== 'TESTING') && process.exit(1);
        }
    },
    writing: {
        nightwatchFiles: function() {
            let testDirectory = 'test/nightwatch';
            let _copyTpl = partialRight(copyTpl, this);
            _copyTpl('nightwatch.conf.js', 'config/nightwatch.conf.js');
            _copyTpl('globals.js', `${testDirectory}/globals.js`);
            _copyTpl('commands/log.js', `${testDirectory}/commands/log.js`);
            _copyTpl('tests/main.js', `${testDirectory}/tests/main.js`);
            _copyTpl('pages/*', `${testDirectory}/pages`);
            [// placeholder directories
                'assertions',
                'screenshots'
            ].forEach((dir) => {
                _copyTpl(`${dir}/.gitkeep`, `${testDirectory}/${dir}/.gitkeep`);
            });
        }
    },
    install: {
        installDependencies: function() {
            let dependencies = [
                'chalk',
                'http-server',
                'nightwatch'
            ];
            this.npmInstall(dependencies, {saveDev: true});
        },
        configurePackageJson: function() {
            let scripts = {
                'pretest:e2e':  'nohup http-server -p 1337 &',
                'test:e2e':     'nightwatch --config ./config/nightwatch.conf.js --env default',
                'posttest:e2e': 'kill $(echo `ps -ef | grep -m 1 http-server` | awk -F \" \" \'{print $2}\')'
            };
            extend(this.destinationPath('package.json'), {scripts});
        }
    },
    end: function() {
        let checkmark = bold(green('✔ '));
        let doneMessage = () => {
            let msg = [].concat(
                '',
                `${checkmark}End-to-end browser testing support added!`,
                '',
                `  ${magenta('Thank you')} ${white.bgBlack(' Nightwatch.js ')}`,
                ''
            ).join('\n');
            return msg;
        };
        this.log(doneMessage());
    }
});
