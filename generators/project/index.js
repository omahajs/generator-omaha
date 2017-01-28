'use strict';

var fs        = require('fs-extra');
var Generator = require('yeoman-generator');
var Gruntfile = require('gruntfile-editor');
var utils     = require('../app/utils');
var banner    = require('../app/banner');
var prompt    = require('../app/prompts').project;
var tasks     = require('../app/gruntTaskConfigs');
var copyTpl   = utils.copyTpl;

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
            generator.projectName = generator.use.projectName;
            generator.config.set('projectName', generator.projectName);
            generator.sourceDirectory = (!/\/$/.test(generator.use.sourceDirectory)) ? generator.use.sourceDirectory + '/' : generator.use.sourceDirectory;
            generator.config.set('sourceDirectory', generator.sourceDirectory);
            done();
        } else {
            var isUnAnswered = function(option) {
                return !!!generator.options[option.name] || (generator.options[option.name] === commandLineOptions[option.name].defaults);
            };
            var isComposed = generator.config.get('isComposed');
            return generator.prompt(prompt.getQuestions(isComposed).filter(isUnAnswered)).then(function (answers) {
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
            generator.useBenchmark = generator.use.benchmark && !generator.options.skipBenchmark;
            generator.useCoveralls = generator.use.coveralls && !generator.options.skipCoveralls;
            generator.useJsinspect = generator.use.jsinspect && !generator.options.skipJsinspect;
            generator.config.set('projectName', generator.projectName);
            generator.config.set('useBenchmark', generator.useBenchmark);
            generator.config.set('useCoveralls', generator.useCoveralls);
            generator.config.set('useJsinspect', generator.useJsinspect);
            copyTpl('_LICENSE', 'LICENSE', generator);
            copyTpl('_package.json', 'package.json', generator);
            copyTpl('_Gruntfile.js', 'Gruntfile.js', generator);
            copyTpl('config/_gitignore', '.gitignore', generator);
            copyTpl('config/_default.json', 'config/default.json', generator);
            copyTpl('config/_eslintrc.js', 'config/.eslintrc.js', generator);
            copyTpl('config/_karma.conf.js', 'config/karma.conf.js', generator);
        },
        testFiles: function() {
            var generator = this;
            copyTpl('test/config.js', 'test/config.js', generator);
            generator.fs.copy(
                generator.templatePath('test/data/**/*.*'),
                generator.destinationPath('test/data')
            );
            generator.fs.copy(
                generator.templatePath('test/jasmine/**/*.*'),
                generator.destinationPath('test/jasmine')
            );
            if (generator.useBenchmark) {
                copyTpl('test/example.benchmark.js', 'test/benchmarks/example.benchmark.js', generator);
            }
        },
    },
    install: function() {
        var generator = this;
        var devDependencies = [].concat(
            generator.useBenchmark ? ['grunt-benchmark'] : [],
            generator.useCoveralls ? ['grunt-karma-coveralls'] : [],
            generator.useJsinspect ? ['jsinspect', 'grunt-jsinspect'] : []
        );
        generator.npmInstall();
        generator.npmInstall(devDependencies, {saveDev: true});
    },
    end: function() {
        var generator = this;
        var gruntfile = new Gruntfile(fs.readFileSync(generator.destinationPath('Gruntfile.js')).toString());
        if (generator.useBenchmark) {
            gruntfile.insertConfig('benchmark', tasks.benchmark);
        }
        if (generator.useCoveralls) {
            gruntfile.insertConfig('coveralls', tasks.coveralls);
            utils.json.extend(generator.destinationPath('package.json'), {
                scripts: {
                    'test:ci': 'npm test && grunt coveralls'
                }
            });
        }
        if (generator.useJsinspect) {
            gruntfile.insertConfig('jsinspect', tasks.jsinspect);
            utils.json.extend(generator.destinationPath('package.json'), {
                scripts: {
                    inspect: 'grunt jsinspect:app'
                }
            });
        }
        fs.writeFileSync(generator.destinationPath('Gruntfile.js'), gruntfile.toString());
    }
});
