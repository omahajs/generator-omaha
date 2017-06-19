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

module.exports = Generator.extend({
    constructor: function() {
        Generator.apply(this, arguments);
        let generator = this;
        let {config, user} = generator;
        Object.keys(commandLineOptions).forEach(function(option) {
            generator.option(option, commandLineOptions[option]);
        });
        config.set('userName', user.git.name() ? user.git.name() : 'A. Developer');
    },
    prompting: function() {
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
    },
    writing: {
        writeConfigFiles: function() {
            let generator = this;
            let {config, options, use} = generator;
            let _copyTpl = partialRight(copyTpl, generator);
            let isWebapp = config.get('isWebapp');
            assign(generator, {
                useBenchmark: use.benchmark && !options.skipBenchmark,
                useCoveralls: use.coveralls && !options.skipCoveralls,
                useJsinspect: use.jsinspect && !options.skipJsinspect
            });
            config.set('projectName', generator.projectName);
            config.set('useBenchmark', generator.useBenchmark);
            config.set('useCoveralls', generator.useCoveralls);
            config.set('useJsinspect', generator.useJsinspect);
            _copyTpl('_LICENSE', 'LICENSE');
            _copyTpl('_package.json', 'package.json');
            _copyTpl('config/_gitignore', '.gitignore');
            _copyTpl('config/_default.json', 'config/default.json');
            if (isWebapp) {
                _copyTpl('_Gruntfile.js', 'Gruntfile.js');
                _copyTpl('config/_karma.conf.js', 'config/karma.conf.js');
                _copyTpl('config/_eslintrc_webapp.js', 'config/.eslintrc.js');
            } else {
                _copyTpl('config/_eslintrc.js', 'config/.eslintrc.js');
            }
            if (generator.useCoveralls) {
                _copyTpl('_travis.yml', '.travis.yml');
            }
            mkdirp(generator.sourceDirectory);
        },
        writeTestFiles: function() {
            let generator = this;
            let {config, useBenchmark} = generator;
            let _copy = partialRight(copy, generator);
            let _copyTpl = partialRight(copyTpl, generator);
            let isWebapp = config.get('isWebapp');
            isWebapp && _copyTpl('test/config.js', 'test/config.js');
            _copy('test/data/**/*.*', 'test/data');
            _copy('test/mocha.opts', 'test/mocha.opts');
            _copy('test/mocha/specs/' + (isWebapp ? 'example' : 'simple') + '.spec.js', 'test/mocha/specs/example.spec.js');
            if (useBenchmark) {
                _copyTpl('test/example.benchmark.js', 'test/benchmarks/example.benchmark.js');
                isWebapp || _copyTpl('_Gruntfile.js', 'Gruntfile.js');
            }
        }
    },
    install: {
        installDependencies: function() {
            let generator = this;
            let {config, useBenchmark, useCoveralls, useJsinspect} = generator;
            let isWebapp = config.get('isWebapp');
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
                    maybeInclude(useJsinspect, 'jsinspect')
                );
            }
            generator.npmInstall();
            generator.npmInstall(devDependencies, {saveDev: true});
        },
        configurePackageJson: function() {
            let generator = this;
            let {useBenchmark, useCoveralls} = generator;
            let updatePackageJson = partial(extend, generator.destinationPath('package.json'));
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
                generator.npmInstall('stmux', {saveDev: true});
                assign(scripts, {
                    dev: 'stmux [ \"npm run test:watch\" .. \"npm run lint:watch\" ]'
                });
            }
            updatePackageJson({scripts});
        },
        configureWorkflowTasks: function() {
            const placeholder = '/* -- load tasks placeholder -- */';
            let generator = this;
            let {config, useBenchmark} = generator;
            if (useBenchmark) {
                let text = readFileSync(generator.destinationPath('Gruntfile.js'))
                    .toString()
                    .replace(placeholder, config.get('isWebapp') ? placeholder : '');
                let gruntfile = new Gruntfile(text);
                gruntfile.insertConfig('benchmark', tasks.benchmark);
                writeFileSync(generator.destinationPath('Gruntfile.js'), gruntfile.toString());
            }
        },
        saveConfiguration: function() {
            let projectParameters = pick(this, [
                'projectName',
                'useBenchmark',
                'useCoveralls',
                'useJsinspect'
            ]);
            this.config.set({projectParameters});
        }
    },
    end: function() {
        let {config, log} = this;
        config.get('isComposed') || log(footer(this));
    }
});
