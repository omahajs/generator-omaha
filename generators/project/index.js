'use strict';

var fs           = require('fs-extra');
var _            = require('lodash');
var Generator    = require('yeoman-generator');
var Gruntfile    = require('gruntfile-editor');
var utils        = require('../app/utils');
var banner       = require('../app/banner');
var prompt       = require('../app/prompts').project;
var tasks        = require('../app/gruntTaskConfigs');
var copy         = utils.copy;
var copyTpl      = utils.copyTpl;
var maybeInclude = utils.maybeInclude;

var commandLineOptions = {
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
        var generator = this;
        Object.keys(commandLineOptions).forEach(function(option) {
            generator.option(option, commandLineOptions[option]);
        });
        generator.config.set('userName', generator.user.git.name() ? generator.user.git.name() : 'A. Developer');
    },
    prompting: function() {
        var generator = this;
        generator.userName = generator.config.get('userName');
        generator.use = prompt.defaults;
        !generator.config.get('hideBanner') && generator.log(banner);
        if (generator.options.defaults) {
            var done = this.async();
            var sourceDirectory = generator.use.sourceDirectory;
            generator.projectName = generator.use.projectName;
            generator.config.set('projectName', generator.projectName);
            generator.sourceDirectory = (!/\/$/.test(sourceDirectory)) ? sourceDirectory + '/' : sourceDirectory;
            generator.config.set('sourceDirectory', generator.sourceDirectory);
            done();
        } else {
            var isUnAnswered = function(option) {
                return !!!generator.options[option.name] || (generator.options[option.name] === commandLineOptions[option.name].defaults);
            };
            var isComposed = generator.config.get('isComposed');
            return generator.prompt(prompt.getQuestions(isComposed).filter(isUnAnswered)).then(function(answers) {
                generator.use = answers;
                generator.projectName = answers.projectName;
                generator.sourceDirectory = (!/\/$/.test(answers.sourceDirectory)) ? answers.sourceDirectory + '/' : answers.sourceDirectory;
                generator.config.set('sourceDirectory', generator.sourceDirectory);
            }.bind(generator));
        }
    },
    writing: {
        configFiles: function() {
            var generator = this;
            var options = generator.options;
            var use = generator.use;
            var _copyTpl = _.partial(copyTpl, _, _, generator);
            _.extend(generator, {
                isComposed: generator.config.get('isComposed'),
                useBenchmark: use.benchmark && !options.skipBenchmark,
                useCoveralls: use.coveralls && !options.skipCoveralls,
                useJsinspect: use.jsinspect && !options.skipJsinspect
            });
            generator.config.set('projectName', generator.projectName);
            generator.config.set('useBenchmark', generator.useBenchmark);
            generator.config.set('useCoveralls', generator.useCoveralls);
            generator.config.set('useJsinspect', generator.useJsinspect);
            _copyTpl('_LICENSE', 'LICENSE');
            _copyTpl('_package.json', 'package.json');
            _copyTpl('_Gruntfile.js', 'Gruntfile.js');
            _copyTpl('config/_gitignore', '.gitignore');
            _copyTpl('config/_default.json', 'config/default.json');
            _copyTpl('config/_eslintrc.js', 'config/.eslintrc.js');
            _copyTpl('config/_karma.conf.js', 'config/karma.conf.js');
            fs.mkdirp(generator.sourceDirectory);
        },
        testFiles: function() {
            var generator = this;
            copy('test/data/**/*.*', 'test/data', generator);
            copy('test/jasmine/**/*.*', 'test/jasmine', generator);
            copyTpl('test/config.js', 'test/config.js', generator);
            if (generator.useBenchmark) {
                copyTpl('test/example.benchmark.js', 'test/benchmarks/example.benchmark.js', generator);
            }
        }
    },
    install: function() {
        var generator = this;
        var devDependencies = [].concat(
            maybeInclude(generator.useBenchmark, 'grunt-benchmark'),
            maybeInclude(generator.useCoveralls, 'grunt-karma-coveralls'),
            maybeInclude(generator.useJsinspect, ['jsinspect', 'grunt-jsinspect'])
        );
        generator.npmInstall();
        generator.npmInstall(devDependencies, {saveDev: true});
    },
    end: function() {
        var generator = this;
        var gruntfile = new Gruntfile(fs.readFileSync(generator.destinationPath('Gruntfile.js')).toString());
        //
        // Configure package.json
        //
        if (generator.useCoveralls) {
            utils.json.extend(generator.destinationPath('package.json'), {
                scripts: {
                    'test:ci': 'npm test && grunt coveralls'
                }
            });
        }
        if (generator.useJsinspect) {
            utils.json.extend(generator.destinationPath('package.json'), {
                scripts: {
                    inspect: 'grunt jsinspect:app'
                }
            });
        }
        //
        //  Configure workflow tasks
        //
        [// Tasks enabled by default
            'clean',
            'eslint',
            'express',
            'jsdoc',
            'jsonlint',
            'karma',
            'open',
            'plato',
            'requirejs',
            'watch'
        ]
        .concat(// Tasks enabled by user
            maybeInclude(generator.useBenchmark, 'benchmark'),
            maybeInclude(generator.useCoveralls, 'coveralls'),
            maybeInclude(generator.useJsinspect, 'jsinspect')
        )
        .sort()
        .forEach(name => gruntfile.insertConfig(name, tasks[name]));
        gruntfile.registerTask('eslinting', ['eslint:ing', 'watch:eslint']);
        //
        // Write to file
        //
        fs.writeFileSync(generator.destinationPath('Gruntfile.js'), gruntfile.toString());
    }
});
