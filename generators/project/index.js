'use strict';

var fs        = require('fs');
var mkdirp    = require('mkdirp');
var yeoman    = require('yeoman-generator');
var Gruntfile = require('gruntfile-editor');
var utils     = require('../app/utils');
var banner    = require('../app/banner');
var prompt    = require('../app/prompts').project;
var tasks     = require('../app/gruntTaskConfigs');

var commandLineOptions = {
    defaults: {
        type: 'Boolean',
        desc: 'Scaffold app with no user input using default settings',
        defaults: false
    },
    skipBenchmark: {
        type: 'Boolean',
        desc: 'DO NOT add benchmark.js code and dependencies to project',
        defaults: false
    },
    skipCoveralls: {
        type: 'Boolean',
        desc: 'DO NOT add coveralls tasks and dependencies to project',
        defaults: false
    },
    skipJsinspect: {
        type: 'Boolean',
        desc: 'DO NOT add JSInspect tasks and dependencies to project',
        defaults: false
    }
};

module.exports = yeoman.generators.Base.extend({
    constructor: function() {
        var generator = this;
        yeoman.generators.Base.apply(generator, arguments);
        Object.keys(commandLineOptions).forEach(function(option) {
            generator.option(option, commandLineOptions[option]);
        });
        generator.config.set('userName', generator.user.git.name() ? generator.user.git.name() : 'A. Developer');
    },
    prompting: function() {
        var done = this.async();
        var generator = this;
        generator.userName = generator.config.get('userName');
        generator.use = prompt.defaults;
        !generator.config.get('hideBanner') && generator.log(banner);
        if (generator.options.defaults) {
            generator.projectName = generator.use.projectName;
            generator.config.set('projectName', generator.projectName);
            generator.sourceDirectory = (!/\/$/.test(generator.use.sourceDirectory)) ? generator.use.sourceDirectory + '/' : generator.use.sourceDirectory;
            generator.config.set('sourceDirectory', generator.sourceDirectory);
            done();
        } else {
            function isUnAnswered(option) {
                return !!!generator.options[option.name] || (generator.options[option.name] === commandLineOptions[option.name].defaults);
            }
            generator.prompt(prompt.questions.filter(isUnAnswered), function (props) {
                generator.use = props;
                generator.projectName = props.projectName;
                generator.sourceDirectory = (!/\/$/.test(props.sourceDirectory)) ? props.sourceDirectory + '/' : props.sourceDirectory;
                generator.config.set('sourceDirectory', generator.sourceDirectory);
                done();
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
            generator.template('_LICENSE', 'LICENSE');
            generator.template('_package.json', 'package.json');
            generator.template('_Gruntfile.js', 'Gruntfile.js');
            generator.template('config/_gitignore', '.gitignore');
            generator.template('config/_default.json', 'config/default.json');
            generator.template('config/_eslintrc.js', 'config/.eslintrc.js');
            generator.template('config/_karma.conf.js', 'config/karma.conf.js');
            mkdirp('tasks');
        },
        testFiles: function() {
            var generator = this;
            generator.template('test/config.js', 'test/config.js');
            generator.fs.copy(
                generator.templatePath('test/data/**/*.*'),
                generator.destinationPath('test/data')
            );
            generator.fs.copy(
                generator.templatePath('test/jasmine/**/*.*'),
                generator.destinationPath('test/jasmine')
            );
            if (generator.useBenchmark) {
                generator.template('test/example.benchmark.js', 'test/benchmarks/example.benchmark.js');
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
