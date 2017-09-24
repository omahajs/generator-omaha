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

module.exports = class extends Generator {
    configuring() {
        if (this.config.get('isWebapp')) {
            const isLinux = includes(['linux', 'freebsd'], process.platform);
            const chromedriver = isLinux ? 'chromedriver' : 'chromedriver.exe';
            copySync(join(__dirname, `/bin/${chromedriver}`), `bin/${chromedriver}`);// v2.30
            copySync(join(__dirname, '/bin/selenium-server-standalone-3.4.0.jar'), 'bin/selenium-server-standalone.jar');
        } else {
            this.log(yosay(`${red('Not so fast!') }\nUse ${ white.bgBlack(' yo omaha ') } first!`));
            (process.env.mode !== 'TESTING') && process.exit(1);
        }
    }
    writing() {
        const testDirectory = 'test/nightwatch';
        const _copyTpl = partialRight(copyTpl, this);
        _copyTpl('nightwatch.conf.js', 'config/nightwatch.conf.js');
        _copyTpl('globals.js', `${testDirectory}/globals.js`);
        _copyTpl('commands/log.js', `${testDirectory}/commands/log.js`);
        _copyTpl('tests/main.js', `${testDirectory}/tests/main.js`);
        _copyTpl('pages/*', `${testDirectory}/pages`);
        [// placeholder directories
            'assertions',
            'screenshots'
        ].forEach(dir => {
            _copyTpl(`${dir}/.gitkeep`, `${testDirectory}/${dir}/.gitkeep`);
        });
    }
    install() {
        //
        // Install dependencies
        //
        const dependencies = [
            'chalk',
            'http-server',
            'nightwatch'
        ];
        this.npmInstall(dependencies, {saveDev: true});
        //
        // Configure package.json
        //
        const scripts = {
            'pretest:e2e':  'nohup http-server -p 1337 &',
            'test:e2e':     'nightwatch --config ./config/nightwatch.conf.js --env default',
            'posttest:e2e': 'kill $(echo `ps -ef | grep -m 1 http-server` | awk -F \" \" \'{print $2}\')'
        };
        extend(this.destinationPath('package.json'), {scripts});
    }
    end() {
        const checkmark = bold(green('✔ '));
        const doneMessage = () => {
            const msg = [].concat(
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
};
