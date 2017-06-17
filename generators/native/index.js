'use strict';

var _         = require('lodash');
var Generator = require('yeoman-generator');
var banner    = require('../app/banner');
var utils     = require('../app/utils');
var copy      = utils.copy;
var copyTpl   = utils.copyTpl;
var extend    = utils.json.extend;

var commandLineOptions = {
    skipWebapp: {
        type: Boolean,
        desc: 'DO NOT compose with WebApp generator (used for bare-bones projects)',
        defaults: false
    }
};

module.exports = Generator.extend({
    initializing: function() {
        this.log(banner);
    },
    constructor: function() {
        Generator.apply(this, arguments);
        var generator = this;
        var options = generator.options;
        var config = generator.config;
        Object.keys(commandLineOptions).forEach((option) => {
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
        var generator = this;
        var config = generator.config;
        var rendererIndexPath = config.get('isWebapp') ? 'app/index.html' : 'index.html';
        config.set('sourceDirectory', 'renderer/');
        copy('bin/preload.js', 'bin/preload.js', generator);
        copyTpl('_index.html', config.get('sourceDirectory') + rendererIndexPath, generator);
        copyTpl('_index.js', 'index.js', _.set(generator, 'rendererIndexPath', rendererIndexPath));
    },
    install: function() {
        var generator = this;
        var dependencies = [
            'electron',
            'electron-debug',
            'electron-is-dev'
        ];
        var devDependencies = [
            'spectron'
        ].concat(// work in progress
          // 'devtron',// waiting on https://github.com/electron/devtron/issues/96
          // 'electron-builder',// https://github.com/electron-userland/electron-builder
          // 'electron-packager'// https://github.com/electron-userland/electron-packager
        );
        generator.npmInstall(dependencies, {save: true});
        generator.npmInstall(devDependencies, {saveDev: true});
    },
    end: function() {
        var generator = this;
        extend(generator.destinationPath('package.json'), {
            main: './index.js',
            scripts: {
                start: 'electron index'
            }
        });
    }
});
