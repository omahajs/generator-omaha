'use strict';

var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');
var banner = require('../app/banner');
var footer = require('./doneMessage');
var prompt = require('./prompts').webapp;

var commandLineOptions = {
    defaults: {
        type: 'Boolean',
        desc: 'Scaffold app with no user input using default settings',
        defaults: false
    },
    scriptBundler: {desc: 'Choose script bundler'},
    cssPreprocessor: {
        desc: 'Choose CSS pre-processor',
        defaults: 'less'
    },
    templateTechnology: {
        desc: 'Choose technology to use when pre-compiling templates',
        defaults: 'handlebars'
    },
    deployDirectory: {
        type: 'String',
        desc: 'Designate path of directory for production app files.',
        defaults: 'dist/.'
    }
};

module.exports = yeoman.generators.Base.extend({
    constructor: function() {
        var generator = this;
        yeoman.generators.Base.apply(generator, arguments);
        Object.keys(commandLineOptions).forEach(function(option) {
            generator.option(option, commandLineOptions[option]);
        });
    },
    prompting: function() {
        var done = this.async();
        var generator = this;
        !generator.config.get('hideBanner') && generator.log(banner);
        if (generator.options.defaults) {
            generator.use = prompt.defaults;
            Object.keys(prompt.defaults).forEach(function(option) {
                generator[option] = prompt.defaults[option];
            });
            var bundler = generator.options.scriptBundler;
            var preprocessor = generator.options.cssPreprocessor;
            var templateTechnology = generator.options.templateTechnology;
            var options = {
                useBrowserify: (bundler === 'browserify') || prompt.defaults.useBrowserify,
                useLess:       (preprocessor === 'less'),
                useSass:       (preprocessor === 'sass'),
                useHandlebars: (templateTechnology === 'handlebars')
            };
            Object.keys(options).forEach(function(option) {
                generator[option] = options[option];
            });
            done();
        } else {
            function isUnAnswered(option) {
                return !!!generator.options[option.name] || (generator.options[option.name] === commandLineOptions[option.name].defaults);
            }
            generator.prompt(prompt.questions.filter(isUnAnswered), function (props) {
                generator.use = props;
                var bundler = (generator.options.scriptBundler || generator.use.scriptBundler).toLowerCase();
                var preprocessor;
                if (generator.options.cssPreprocessor === commandLineOptions.cssPreprocessor.defaults) {
                    preprocessor = generator.use.cssPreprocessor.toLowerCase();
                } else {
                    preprocessor = generator.options.cssPreprocessor;
                }
                var templateTechnology;
                if (generator.options.templateTechnology === commandLineOptions.templateTechnology.defaults) {
                    templateTechnology = generator.use.templateTechnology.toLowerCase();
                } else {
                    templateTechnology = generator.options.templateTechnology;
                }
                var options = {
                    useBrowserify: (bundler === 'browserify'),
                    useLess:       (preprocessor === 'less'),
                    useSass:       (preprocessor === 'sass'),
                    useHandlebars: (templateTechnology === 'handlebars')
                };
                Object.keys(options).forEach(function(option) {
                    generator[option] = options[option];
                });
                generator.projectName = props.projectName;
                generator.autoFix = props.autoFix;
                generator.styleguide = props.styleguide;
                generator.appDir = (!/\/$/.test(props.appDir)) ? props.appDir + '/' : props.appDir;
                done();
            }.bind(generator));
        }
        generator.config.set('appDir', generator.appDir);
    },
    writing: {
        project: function() {
            this.userName = this.config.get('userName');
            this.deployDirectory = this.options.deployDirectory;
            this.template('config/_default.json', 'config/default.json');
            this.template('_README.md', 'README.md');
            this.template('_package.json', 'package.json');
            this.template('_Gruntfile.js', 'Gruntfile.js');
            this.template('tasks/main.js', this.appDir + 'tasks/main.js');
            this.template('tasks/build.js', this.appDir + 'tasks/build.js');
            this.template('tasks/test.js', this.appDir + 'tasks/test.js');
        },
        appStructure: function() {
            this.fs.copy(
                this.templatePath('test/data/**/*.*'),
                this.destinationPath(this.appDir + 'test/data')
            );
            this.fs.copy(
                this.templatePath('test/jasmine/**/*.*'),
                this.destinationPath(this.appDir + 'test/jasmine')
            );
            this.template('test/config.js', this.appDir + 'test/config.js');
            if (this.use.benchmarks) {
                this.template('test/example.benchmark.js', this.appDir + 'test/benchmarks/example.benchmark.js');
            }
            mkdirp(this.appDir + 'assets/fonts');
            mkdirp(this.appDir + 'assets/images');
            if (this.useLess) {
                mkdirp(this.appDir + 'assets/less');
            }
            if (this.useSass) {
                mkdirp(this.appDir + 'assets/sass');
            }
            mkdirp(this.appDir + 'assets/library');
            this.fs.copy(
                this.templatePath('library/require.min.js'),
                this.destinationPath(this.appDir + 'assets/library/require.min.js')
            );
            mkdirp(this.appDir + 'assets/templates');
        },
        appFiles: function() {
            this.fs.copy(
                this.templatePath('shims/*.js'),
                this.destinationPath(this.appDir + 'app/shims')
            );
            if (this.useHandlebars) {
                this.template('helpers/handlebars.helpers.js', this.appDir + 'app/helpers/handlebars.helpers.js');
            }
            this.template('helpers/jquery.extensions.js', this.appDir + 'app/helpers/jquery.extensions.js');
            this.template('helpers/underscore.mixins.js', this.appDir + 'app/helpers/underscore.mixins.js');
            this.fs.copy(
                this.templatePath('plugins/*.js'),
                this.destinationPath(this.appDir + 'app/plugins')
            );
            this.template('_index.html', this.appDir + 'app/index.html');
            this.template('_app.js', this.appDir + 'app/app.js');
            this.template('_main.js', this.appDir + 'app/main.js');
            this.template('_config.js', this.appDir + 'app/config.js');
            this.template('_router.js', this.appDir + 'app/router.js');
            this.template('example.model.js', this.appDir + 'app/models/example.js');
            this.template('example.view.js', this.appDir + 'app/views/example.js');
            this.template('example.controller.js', this.appDir + 'app/controllers/example.js');
            this.template('example.webworker.js', this.appDir + 'app/controllers/example.webworker.js');
        },
        assetFiles: function() {
            this.template('example.template.hbs', this.appDir + 'assets/templates/example.hbs');
            if (this.useLess) {
                this.template('_reset.css', this.appDir + 'assets/less/reset.less');
                this.template('_style.less', this.appDir + 'assets/less/style.less');
            }
            if (this.useSass) {
                this.template('_reset.css', this.appDir + 'assets/sass/reset.scss');
                this.template('_style.scss', this.appDir + 'assets/sass/style.scss');
            }
            if (!(this.useLess || this.useSass)) {
                this.template('_style.css', this.appDir + 'assets/css/style.css');
            }
            this.fs.copy(
                this.templatePath('techtonic.png'),
                this.destinationPath(this.appDir + 'assets/images/logo.png')
            );
        }
    },
    install: {
        projectDependencies: function() {
            var generator = this;
            var dependencies = [];
            var devDependencies = [];
            generator.npmInstall();
            if (generator.useBrowserify) {
                devDependencies.push('browserify', 'browserify-shim', 'aliasify', 'deamdify', 'grunt-browserify', 'grunt-replace');
            }
            if (generator.use.benchmarks) {
                devDependencies.push('grunt-benchmark');
            }
            if (generator.use.jsinspect) {
                devDependencies.push('jsinspect', 'grunt-jsinspect');
            }
            if (generator.use.styleguide) {
                devDependencies.push('mdcss', 'mdcss-theme-github');
            }
            if (generator.use.coveralls) {
                devDependencies.push('grunt-karma-coveralls');
            }
            if (generator.use.a11y) {
                devDependencies.push('grunt-a11y', 'grunt-accessibility');
            }
            if (generator.use.imagemin) {
                devDependencies.push('grunt-contrib-imagemin');
            }

            if (generator.useHandlebars) {
                dependencies.push('handlebars');
                devDependencies.push('grunt-contrib-handlebars');
            } else {
                devDependencies.push('grunt-contrib-jst');
            }
            if (generator.useLess) {
                devDependencies.push('grunt-contrib-less');
            }
            if (generator.useSass) {
                devDependencies.push('grunt-contrib-sass');
            }
            generator.npmInstall(dependencies, {save: true});
            generator.npmInstall(devDependencies, {saveDev: true});
        },
        workflowDependencies: function() {

        },
        appDependencies: function() {
            var generator = this;
            var dependencies = ['requirejs', 'jquery', 'underscore', 'backbone', 'backbone.marionette', 'backbone.radio'];
            generator.npmInstall(dependencies, {save: true});
        }
    },
    end: function() {
        var generator = this;
        generator.log(footer(generator));
    }
});