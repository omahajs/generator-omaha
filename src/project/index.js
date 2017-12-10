/* @flow */
const {assign, partial, pick} = require('lodash');
const {mkdirp, readFileSync, writeFileSync} = require('fs-extra');
const Generator = require('yeoman-generator');
const Gruntfile = require('gruntfile-editor');
const banner    = require('../app/banner');
const footer    = require('../app/doneMessage');
const {project} = require('../app/prompts');
const tasks     = require('../app/gruntTaskConfigs');
const {
    copyTpl,
    json: {extend}
} = require('../app/utils');

const iff = (condition, data, defaultValue = []) => (condition ? data : defaultValue);

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
    constructor(args: any, opts: any) {
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
        const {defaults, skipBenchmark, skipCoveralls, skipJsinspect, useBrowserify, useJest, useWebpack} = options;
        const isWebapp = config.get('isWebapp');
        const isUnAnswered = option => (!!!options[option.name] || (options[option.name] === COMMAND_LINE_OPTIONS[option.name].defaults));
        const moduleFormat = (useJest || useBrowserify || useWebpack) ? 'commonjs' : 'amd';
        const useAmd = (moduleFormat === 'amd');
        assign(generator, {
            moduleFormat,
            useAmd,
            useBrowserify,
            useWebpack,
            useJest: (useJest || useWebpack),
            use: project.defaults,
            userName: config.get('userName')
        });
        !config.get('hideBanner') && generator.log(banner);
        if (defaults) {
            const done = this.async();
            const {projectName, sourceDirectory} = generator.use;
            generator.projectName = projectName;
            generator.sourceDirectory = (!/\/$/.test(sourceDirectory)) ? `${sourceDirectory }/` : sourceDirectory;
            assign(generator, {
                useBenchmark: generator.use.benchmark && !skipBenchmark,
                useCoveralls: generator.use.coveralls && !skipCoveralls,
                useJsinspect: generator.use.jsinspect && !skipJsinspect
            });
            done();
        } else {
            return generator.prompt(project.getQuestions(isWebapp).filter(isUnAnswered)).then(function(answers) {
                generator.use = answers;
                generator.projectName = answers.projectName;
                generator.sourceDirectory = (!/\/$/.test(answers.sourceDirectory)) ? `${answers.sourceDirectory }/` : answers.sourceDirectory;
                assign(generator, {
                    useBenchmark: generator.use.benchmark && !skipBenchmark,
                    useCoveralls: generator.use.coveralls && !skipCoveralls,
                    useJsinspect: generator.use.jsinspect && !skipJsinspect
                });
            }.bind(generator));
        }
    }
    writing() {
        const generator = this;
        const {config, sourceDirectory, useJest} = generator;
        const isNative = config.get('isNative');
        const isWebapp = config.get('isWebapp');
        const hasRenderer = isNative && isWebapp;
        assign(generator, {
            sourceDirectory: hasRenderer ? 'renderer/' : sourceDirectory
        });
        const {projectName, useAmd, useBenchmark, useCoveralls, useJsinspect, useWebpack} = generator;
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
            iff(useAmd,
                [
                    ['test/config.js', 'test/config.js'],
                    ['config/_karma.conf.amd.js', 'config/karma.conf.js']
                ]
            )
        ).concat(
            iff(!(useAmd || useJest || useWebpack),
                [
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
        const webpackTemplateData = [
            ['config/_webpack.config.js', 'config/webpack.config.js']
        ];
        defaultTemplateData.concat(
            iff(isWebapp, webappTemplateData, [['config/_eslintrc.js', 'config/.eslintrc.js']]),
            iff(useCoveralls, [['_travis.yml', '.travis.yml']]),
            iff(useBenchmark, [['test/example.benchmark.js', 'test/benchmarks/example.benchmark.js']]),
            iff(useBenchmark && !isWebapp, [['_Gruntfile.js', 'Gruntfile.js']]),
            iff(useJest, jestTemplateData, mochaTemplateData),
            iff(useWebpack, webpackTemplateData)
        ).forEach(data => copyTpl(...data, generator));
        copyTpl('test/data/**/*.*', 'test/data', generator);
    }
    install() {
        const generator = this;
        const {config, useBenchmark, useCoveralls, useJest, useJsinspect, useWebpack} = generator;
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
        const devDependencies = [].concat(
            iff(isNotWindows, 'stmux'),
            iff(isWebapp && useCoveralls, 'grunt-karma-coveralls', 'coveralls'),
            iff(isWebapp && useJsinspect, ['jsinspect', 'grunt-jsinspect'], 'jsinspect'),
            iff(isWebapp && useWebpack, 'grunt-webpack'),
            iff(useBenchmark, ['lodash', 'grunt', 'load-grunt-tasks', 'time-grunt', 'config', 'grunt-benchmark']),
            iff(useJest, ['coveralls', 'watch', 'jest'], ['mocha', 'chai', 'sinon', 'nyc', ...karmaDependencies]),
            iff(useWebpack, ['webpack', 'webpack-dev-server', 'webpack-dashboard', 'babel-loader'])
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
            'moduleFormat',
            'projectName',
            'sourceDirectory',
            'useAmd',
            'useAria',
            'useBenchmark',
            'useBrowserify',
            'useCoveralls',
            'useHandlebars',
            'useImagemin',
            'useJest',
            'useJsinspect',
            'useLess',
            'useSass',
            'useWebpack'
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
    const {useBenchmark, useCoveralls, useJest, useWebpack} = generator;
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
    if (useWebpack) {
        assign(scripts, {
            'build:watch': 'webpack-dashboard -- webpack-dev-server --config ./config/webpack.config.js'
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
