'use strict';

const {set}     = require('lodash');
const Generator = require('yeoman-generator');
const banner    = require('../app/banner');
const {
    copy,
    copyTpl,
    json: {extend}
} = require('../app/utils');

const commandLineOptions = {
    skipWebapp: {
        type: Boolean,
        desc: 'DO NOT compose with WebApp generator',
        defaults: false
    }
};

module.exports = Generator.extend({
    initializing: function() {
        this.log(banner);
    },
    constructor: function() {
        Generator.apply(this, arguments);
        let generator = this;
        let {config, options} = generator;
        Object.keys(commandLineOptions).forEach(option => {
            generator.option(option, commandLineOptions[option]);
        });
        config.set('userName', generator.user.git.name() ? generator.user.git.name() : 'A. Developer');
        config.defaults({
            isWebapp: !options.skipWebapp,
            isNative: true,
            hideBanner: true
        });
        generator.composeWith(require.resolve('../project'), options);
        if (config.get('isWebapp')) {
            generator.composeWith(require.resolve('../webapp'), options);
        }
    },
    writing: function() {
        let generator = this;
        let {config} = generator;
        let rendererIndexPath = config.get('isWebapp') ? 'app/index.html' : 'index.html';
        config.set('sourceDirectory', 'renderer/');
        copy('bin/preload.js', 'bin/preload.js', generator);
        copyTpl('_index.html', config.get('sourceDirectory') + rendererIndexPath, generator);
        copyTpl('_index.js', 'index.js', set(generator, 'rendererIndexPath', rendererIndexPath));
    },
    install: function() {
        let dependencies = [
            'electron',
            'electron-debug',
            'electron-is-dev'
        ];
        let devDependencies = [
            'spectron'
        ].concat(// work in progress
          // 'devtron',// waiting on https://github.com/electron/devtron/issues/96
          // 'electron-builder',// https://github.com/electron-userland/electron-builder
          // 'electron-packager'// https://github.com/electron-userland/electron-packager
        );
        this.npmInstall(dependencies, {save: true});
        this.npmInstall(devDependencies, {saveDev: true});
    },
    end: function() {
        extend(this.destinationPath('package.json'), {
            main: './index.js',
            scripts: {
                start: 'electron index'
            }
        });
    }
});
