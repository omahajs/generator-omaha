

const { set } = require('lodash');

const Generator = require('yeoman-generator');
const banner = require('../app/banner');
const footer = require('../app/doneMessage');
const {
    copy,
    copyTpl,
    json: { extend }
} = require('../app/utils');

const COMMAND_LINE_OPTIONS = {
    skipWebapp: {
        type: Boolean,
        desc: 'DO NOT compose with WebApp generator',
        defaults: false
    }
};

module.exports = class extends Generator {
    initializing() {
        const generator = this;
        generator.log(banner);
    }
    constructor(args, opts) {
        super(args, opts);
        const generator = this;
        const { config, options } = generator;
        Object.keys(COMMAND_LINE_OPTIONS).forEach(option => {
            generator.option(option, COMMAND_LINE_OPTIONS[option]);
        });
        config.set('userName', generator.user.git.name() ? generator.user.git.name() : 'A. Developer');
        config.defaults({
            isComposed: true,
            isWebapp: !options.skipWebapp,
            isNative: true,
            hideBanner: true
        });
        generator.composeWith(require.resolve('../project'), options);
        if (config.get('isWebapp')) {
            generator.composeWith(require.resolve('../webapp'), options);
        }
    }
    writing() {
        const generator = this;
        const { config } = generator;
        const { isWebapp, moduleFormat } = config.getAll();
        const rendererIndexPath = isWebapp ? 'app/index.html' : 'index.html';
        generator.moduleFormat = moduleFormat;
        copy('bin/preload.js', 'bin/preload.js', generator);
        copyTpl('_index.html', config.get('sourceDirectory') + rendererIndexPath, generator);
        copyTpl('_index.js', 'index.js', set(generator, 'rendererIndexPath', rendererIndexPath));
    }
    install() {
        const generator = this;
        //
        // Install dependencies
        //
        const dependencies = ['electron', 'electron-context-menu', 'electron-debug', 'electron-is-dev'];
        const devDependencies = ['spectron', 'electron-reloader'].concat();
        generator.npmInstall(dependencies, { save: true });
        generator.npmInstall(devDependencies, { saveDev: true });
        //
        // Configure package.json
        //
        extend(generator.destinationPath('package.json'), {
            main: './index.js',
            scripts: {
                start: 'electron index',
                'start:dev': 'npm start -- --enable-logging'
            }
        });
    }
    end() {
        const generator = this;
        generator.log(footer(generator));
    }
};