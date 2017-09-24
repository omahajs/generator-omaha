'use strict';

const {assign, flatten, includes, partial, partialRight, pick} = require('lodash');
const {mkdirp, readFileSync, writeFileSync} = require('fs-extra');
const Generator = require('yeoman-generator');
const Gruntfile = require('gruntfile-editor');
const banner    = require('../app/banner');
const footer    = require('../app/doneMessage');
const {project} = require('../app/prompts');
const tasks     = require('../app/gruntTaskConfigs');
const {
    copy,
    copyTpl,
    maybeInclude,
    json: {extend}
} = require('../app/utils');

const commandLineOptions = {
    defaults: {
        type: Boolean,
        desc: 'Scaffold app with no user input using default settings',
        defaults: false
    },
    skipBenchmark: {
        type: Boolean,
        desc: 'DO NOT add benchmark.js code and dependencies to project',
        defaults: false
    },
    skipCoveralls: {
        type: Boolean,
        desc: 'DO NOT add coveralls tasks and dependencies to project',
        defaults: false
    },
    skipJsinspect: {
        type: Boolean,
        desc: 'DO NOT add JSInspect tasks and dependencies to project',
        defaults: false
    }
};

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        let generator = this;
        let {config, user} = generator;
        Object.keys(commandLineOptions).forEach(function(option) {
            generator.option(option, commandLineOptions[option]);
        });
        config.set('userName', user.git.name() ? user.git.name() : 'A. Developer');
    }
    prompting() {
        let generator = this;
        let {config} = generator;
        generator.userName = config.get('userName');
        generator.use = project.defaults;
        !config.get('hideBanner') && generator.log(banner);
        if (generator.options.defaults) {
            let done = this.async();
            let sourceDirectory = generator.use.sourceDirectory;
            generator.projectName = generator.use.projectName;
            config.set('projectName', generator.projectName);
            generator.sourceDirectory = (!/\/$/.test(sourceDirectory)) ? sourceDirectory + '/' : sourceDirectory;
            config.set('sourceDirectory', generator.sourceDirectory);
            done();
        } else {
            let isUnAnswered = function(option) {
                return !!!generator.options[option.name] || (generator.options[option.name] === commandLineOptions[option.name].defaults);
            };
            let isWebapp = config.get('isWebapp');
            return generator.prompt(project.getQuestions(isWebapp).filter(isUnAnswered)).then(function(answers) {
                generator.use = answers;
                generator.projectName = answers.projectName;
                generator.sourceDirectory = (!/\/$/.test(answers.sourceDirectory)) ? answers.sourceDirectory + '/' : answers.sourceDirectory;
                config.set('sourceDirectory', generator.sourceDirectory);
            }.bind(generator));
        }
    }
    writing() {
        let generator = this;
        const {config, options, use} = generator;
        const iff = (condition, data, defaultValue = []) => (condition ? data : defaultValue);
        const _copy = partialRight(copy, generator);
        const _copyTpl = partialRight(copyTpl, generator);
        const isWebapp = config.get('isWebapp');
        assign(generator, {
            useBenchmark: use.benchmark && !options.skipBenchmark,
            useCoveralls: use.coveralls && !options.skipCoveralls,
            useJsinspect: use.jsinspect && !options.skipJsinspect
        });
        const {projectName, useBenchmark, useCoveralls, useJsinspect} = generator;
        config.set('projectName', projectName);
        config.set('useBenchmark', useBenchmark);
        config.set('useCoveralls', useCoveralls);
        config.set('useJsinspect', useJsinspect);
        mkdirp(generator.sourceDirectory);
        const defaultTemplateData = [
            ['_README.md', 'README.md'],
            ['_LICENSE', 'LICENSE'],
            ['_package.json', 'package.json'],
            ['config/_gitignore', '.gitignore'],
            ['config/_default.json', 'config/default.json']
        ];
        const webappTemplateData = [
            ['_Gruntfile.js', 'Gruntfile.js'],
            ['config/_karma.conf.js', 'config/karma.conf.js'],
            ['config/_eslintrc_webapp.js', 'config/.eslintrc.js'],
            ['test/config.js', 'test/config.js']
        ];
        defaultTemplateData.concat(
            iff(isWebapp, webappTemplateData, [['config/_eslintrc.js', 'config/.eslintrc.js']]),
            iff(useCoveralls, [['_travis.yml', '.travis.yml']]),
            iff(useBenchmark, [['test/example.benchmark.js', 'test/benchmarks/example.benchmark.js']]),
            iff(useBenchmark && !isWebapp, [['_Gruntfile.js', 'Gruntfile.js']])
        ).forEach(data => _copyTpl(...data));
        _copy('test/data/**/*.*', 'test/data');
        _copy('test/mocha.opts', 'test/mocha.opts');
        _copy(`test/mocha/specs/${isWebapp ? 'example' : 'simple'}.spec.js`, 'test/mocha/specs/example.spec.js');
    }
    install() {
        const generator = this;
        const {config, useBenchmark, useCoveralls, useJsinspect} = generator;
        const updatePackageJson = partial(extend, generator.destinationPath('package.json'));
        const isWebapp = config.get('isWebapp');
        const isNotWindows = includes(['linux', 'freebsd'], process.platform);
        let devDependencies = flatten(maybeInclude(useBenchmark, ['lodash', 'grunt-benchmark']));
        if (isWebapp) {
            devDependencies = devDependencies.concat(
                maybeInclude(useCoveralls, 'grunt-karma-coveralls'),
                maybeInclude(useJsinspect, ['jsinspect', 'grunt-jsinspect'])
            );
        } else {
            devDependencies = devDependencies.concat(
                ['nyc', 'coveralls', 'watch'],
                maybeInclude(useBenchmark, ['grunt', 'load-grunt-tasks', 'time-grunt', 'config']),
                maybeInclude(useCoveralls, 'coveralls'),
                maybeInclude(useJsinspect, 'jsinspect'),
                maybeInclude(isNotWindows, 'stmux')
            );
        }
        generator.npmInstall();
        generator.npmInstall(devDependencies, {saveDev: true});
        updatePackageJson(getScripts(generator));
        //
        // Configure workflow tasks
        //
        if (useBenchmark) {
            const placeholder = '/* -- load tasks placeholder -- */';
            let text = readFileSync(generator.destinationPath('Gruntfile.js'))
                .toString()
                .replace(placeholder, isWebapp ? placeholder : '');
            let gruntfile = new Gruntfile(text);
            gruntfile.insertConfig('benchmark', tasks.benchmark);
            writeFileSync(generator.destinationPath('Gruntfile.js'), gruntfile.toString());
        }
        //
        // Save configuration
        //
        const projectParameters = pick(this, [
            'projectName',
            'useBenchmark',
            'useCoveralls',
            'useJsinspect'
        ]);
        this.config.set({projectParameters});
    }
    end() {
        const {config, log} = this;
        config.get('isComposed') || log(footer(this));
    }
};
function getScripts(generator) {
    const {useBenchmark, useCoveralls} = generator;
    let scripts = {coverage: 'nyc report -r text'};
    if (useBenchmark) {
        assign(scripts, {
            'test:perf': 'grunt benchmark'
        });
    }
    if (useCoveralls) {
        assign(scripts, {
            'test:travis': 'nyc report --reporter=text-lcov | coveralls'
        });
    }
    /* istanbul ignore else */
    if (includes(['linux', 'freebsd'], process.platform)) {
        assign(scripts, {
            dev: 'stmux [ \"npm run test:watch\" .. \"npm run lint:watch\" ]'
        });
    }
    return {scripts};
}
