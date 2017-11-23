'use strict';

const {assign, flatten, partial, pick} = require('lodash');
const {mkdirp, readFileSync, writeFileSync} = require('fs-extra');
const Generator = require('yeoman-generator');
const Gruntfile = require('gruntfile-editor');
const banner    = require('../app/banner');
const footer    = require('../app/doneMessage');
const {project} = require('../app/prompts');
const tasks     = require('../app/gruntTaskConfigs');
const {
    copyTpl,
    maybeInclude,
    json: {extend}
} = require('../app/utils');

const COMMAND_LINE_OPTIONS = {
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
        const generator = this;
        const {config, user} = generator;
        Object.keys(COMMAND_LINE_OPTIONS).forEach(function(option) {
            generator.option(option, COMMAND_LINE_OPTIONS[option]);
        });
        config.set('userName', user.git.name() ? user.git.name() : 'A. Developer');
    }
    prompting() {
        const generator = this;
        const {config, options} = generator;
        const {browserify, useJest, webpack} = options;
        const useAmd = !(browserify || webpack);
        const isWebapp = config.get('isWebapp');
        const isUnAnswered = option => (!!!options[option.name] || (options[option.name] === COMMAND_LINE_OPTIONS[option.name].defaults));
        const moduleFormat = (useJest || !useAmd) ? 'commonjs' : 'amd';
        assign(generator, {
            moduleFormat,
            useAmd,
            useJest,
            use: project.defaults,
            userName: config.get('userName')
        });
        !config.get('hideBanner') && generator.log(banner);
        if (options.defaults) {
            const done = this.async();
            const sourceDirectory = generator.use.sourceDirectory;
            generator.projectName = generator.use.projectName;
            generator.sourceDirectory = (!/\/$/.test(sourceDirectory)) ? `${sourceDirectory }/` : sourceDirectory;
            config.set('projectName', generator.projectName);
            config.set('sourceDirectory', generator.sourceDirectory);
            done();
        } else {
            return generator.prompt(project.getQuestions(isWebapp).filter(isUnAnswered)).then(function(answers) {
                generator.use = answers;
                generator.projectName = answers.projectName;
                generator.sourceDirectory = (!/\/$/.test(answers.sourceDirectory)) ? `${answers.sourceDirectory }/` : answers.sourceDirectory;
                config.set('sourceDirectory', generator.sourceDirectory);
            }.bind(generator));
        }
    }
    writing() {
        const iff = (condition, data, defaultValue = []) => (condition ? data : defaultValue);
        const generator = this;
        const {config, options, sourceDirectory, use} = generator;
        const {skipBenchmark, skipCoveralls, skipJsinspect, useJest} = options;
        const isNative = config.get('isNative');
        const isWebapp = config.get('isWebapp');
        const hasRenderer = isNative && isWebapp;
        assign(generator, {
            sourceDirectory: hasRenderer ? 'renderer/' : sourceDirectory,
            useBenchmark:    use.benchmark && !skipBenchmark,
            useCoveralls:    use.coveralls && !skipCoveralls,
            useJsinspect:    use.jsinspect && !skipJsinspect
        });
        const {projectName, useAmd, useBenchmark, useCoveralls, useJsinspect} = generator;
        config.set('sourceDirectory', generator.sourceDirectory);
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
            ['config/_eslintrc_webapp.js', 'config/.eslintrc.js']
        ].concat(// conditional dependencies
            maybeInclude(useAmd,
                [// --> AMD module format
                    ['test/config.js', 'test/config.js'],
                    ['config/_karma.conf.amd.js', 'config/karma.conf.js']
                ],
                [// --> CommonJS module format
                    ['config/_karma.conf.cjs.js', 'config/karma.conf.js']
                ]
            )
        );
        const mochaTemplateData = [
            ['test/mocha.opts', 'test/mocha.opts'],
            [`test/mocha/specs/${isWebapp ? 'example' : 'simple'}.spec.js`, 'test/mocha/specs/example.spec.js']
        ];
        const jestTemplateData = [
            ['test/jest/example.test.js', 'test/example.test.js']
        ];
        defaultTemplateData.concat(
            iff(isWebapp, webappTemplateData, [['config/_eslintrc.js', 'config/.eslintrc.js']]),
            iff(useCoveralls, [['_travis.yml', '.travis.yml']]),
            iff(useBenchmark, [['test/example.benchmark.js', 'test/benchmarks/example.benchmark.js']]),
            iff(useBenchmark && !isWebapp, [['_Gruntfile.js', 'Gruntfile.js']]),
            iff(useJest, jestTemplateData, mochaTemplateData)
        ).forEach(data => copyTpl(...data, generator));
        copyTpl('test/data/**/*.*', 'test/data', generator);
    }
    install() {
        const generator = this;
        const {config, useBenchmark, useCoveralls, useJest, useJsinspect} = generator;
        const updatePackageJson = partial(extend, generator.destinationPath('package.json'));
        const isWebapp = config.get('isWebapp');
        const isNotWindows = ['linux', 'freebsd'].includes(process.platform);
        const karmaDependencies = [
            'karma',
            'karma-chrome-launcher',
            'karma-coverage',
            'karma-firefox-launcher',
            'karma-mocha',
            'karma-chai',
            'karma-sinon',
            'karma-spec-reporter'
        ];
        let devDependencies = [].concat(
            maybeInclude(isNotWindows, 'stmux'),
            maybeInclude(useJest, ['coveralls', 'watch', 'jest'], ['mocha', 'chai', 'sinon', 'nyc', ...karmaDependencies]),
            maybeInclude(useBenchmark, ['lodash', 'grunt', 'load-grunt-tasks', 'time-grunt', 'config', 'grunt-benchmark']),
            maybeInclude(isWebapp && useCoveralls, 'grunt-karma-coveralls', 'coveralls'),
            maybeInclude(isWebapp && useJsinspect, ['jsinspect', 'grunt-jsinspect'], 'jsinspect')
        );
        generator.npmInstall();
        generator.npmInstall(devDependencies, {saveDev: true});
        updatePackageJson(getJestConfig(generator));
        updatePackageJson(getScripts(generator));
        //
        // Configure workflow tasks
        //
        if (useBenchmark) {
            const placeholder = '/* -- load tasks placeholder -- */';
            const text = readFileSync(generator.destinationPath('Gruntfile.js'))
                .toString()
                .replace(placeholder, isWebapp ? placeholder : '');
            const gruntfile = new Gruntfile(text);
            gruntfile.insertConfig('benchmark', tasks.benchmark);
            writeFileSync(generator.destinationPath('Gruntfile.js'), gruntfile.toString());
        }
        //
        // Save configuration
        //
        const projectParameters = pick(generator, [
            'projectName',
            'useAmd',
            'useBenchmark',
            'useCoveralls',
            'useJest',
            'useJsinspect'
        ]);
        config.set({projectParameters});
    }
    end() {
        const {config, log} = this;
        config.get('isComposed') || log(footer(this));
    }
};
function getJestConfig(generator) {
    const {useJest} = generator;
    return !useJest ? {} : {
        jest: {
            testMatch: ['**/test/**/*.js']
        }
    };
}
function getScripts(generator) {
    const {useBenchmark, useCoveralls, useJest} = generator;
    const scripts = {coverage: 'nyc report -r text'};
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
    if (useJest) {
        assign(scripts, {
            test: 'jest .*.test.js',
            coverage: 'npm test -- --coverage',
            'test:watch': 'npm test -- --watch',
            'test:travis': 'npm run coverage && cat ./coverage/lcov.info | coveralls',
            'lint:tests': 'eslint -c ./config/.eslintrc.js ./test/*.js'
        });
    }
    /* istanbul ignore else */
    if (['linux', 'freebsd'].includes(process.platform)) {
        assign(scripts, {
            dev: 'stmux [ \"npm run test:watch\" .. \"npm run lint:watch\" ]'
        });
    }
    return {scripts};
}
