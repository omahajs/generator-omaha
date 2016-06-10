'use strict';

var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');
var utils  = require('../app/utils');
var banner = require('../app/banner');
var prompt = require('../app/prompts').webapp;
var footer = require('./doneMessage');

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
        generator.config.set('userName', generator.user.git.name() ? generator.user.git.name() : 'John Doe');
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
            var generator = this;
            generator.userName = generator.config.get('userName');
            generator.deployDirectory = generator.options.deployDirectory;
            generator.template('_package.json', 'package.json');
            generator.template('_README.md', 'README.md');
            generator.template('_Gruntfile.js', 'Gruntfile.js');
            generator.template('tasks/build.js', 'tasks/build.js');
            generator.template('tasks/app.js', 'tasks/app.js');
            generator.template('test/config.js', 'test/config.js');
            generator.fs.copy(
                generator.templatePath('test/data/**/*.*'),
                generator.destinationPath('test/data')
            );
            generator.fs.copy(
                generator.templatePath('test/jasmine/**/*.*'),
                generator.destinationPath('test/jasmine')
            );
            if (generator.use.benchmarks) {
                generator.template('test/example.benchmark.js', 'test/benchmarks/example.benchmark.js');
            }
        },
        appFiles: function() {
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
            var htmlDevDependencies = [
                'grunt-contrib-htmlmin',
                'grunt-htmlhint-plus'
            ];
            var cssDevDependencies = [
                'grunt-contrib-csslint',
                'grunt-postcss',
                'autoprefixer',
                'cssnano',
                'postcss-safe-parser'
            ];
            var requirejsDevDependencies = [
                'grunt-contrib-requirejs',
                'karma-requirejs'
            ];
            var dependencies = [
                'requirejs',
                'jquery',
                'underscore',
                'backbone',
                'backbone.marionette',
                'backbone.radio'
            ];
            var devDependencies = []
                .concat(htmlDevDependencies)
                .concat(cssDevDependencies)
                .concat(requirejsDevDependencies)
                .concat(generator.useBrowserify ? ['browserify', 'browserify-shim', 'aliasify', 'deamdify', 'grunt-browserify', 'grunt-replace'] : [])
                .concat(generator.use.benchmarks ? ['grunt-benchmark'] : [])
                .concat(generator.use.jsinspect ? ['jsinspect', 'grunt-jsinspect'] : [])
                .concat(generator.use.styleguide ? ['mdcss', 'mdcss-theme-github'] : [])
                .concat(generator.use.coveralls ? ['grunt-karma-coveralls'] : [])
                .concat(generator.use.a11y ? ['grunt-a11y', 'grunt-accessibility'] : [])
                .concat(generator.use.imagemin ? ['grunt-contrib-imagemin'] :[]);

            devDependencies = devDependencies
                .concat(generator.useLess ? ['grunt-contrib-less'] : [])
                .concat(generator.useSass ? ['grunt-contrib-sass'] : [])
                .concat(generator.useHandlebars ? ['grunt-contrib-handlebars'] : ['grunt-contrib-jst']);
            generator.useHandlebars && dependencies.push('handlebars');

            generator.npmInstall();
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
        var appDir = (generator.appDir !== './') ? generator.appDir : '';
        utils.json.extend(generator.destinationPath('package.json'), {
            scripts: {
                'test-ci': 'npm test' + (generator.use.coveralls ? ' && grunt coveralls' : '')
            }
        });
        if (generator.use.inspect) {
            utils.json.extend(generator.destinationPath('package.json'), {
                scripts: {
                    inspect: 'grunt jsinspect:app'
                }
            });
        }
        if (generator.useBrowserify) {
            utils.json.extend(generator.destinationPath('package.json'), {
                browser: {
                    underscore: './node_modules/underscore/underscore-min.js'
                },
                browserify: {
                    transform: ['deamdify', 'browserify-shim', 'aliasify']
                },
                'browserify-shim': {
                    underscore: '_'
                },
                aliasify: {
                    aliases: {
                        app:       './' + appDir + 'app/app',
                        router:    './' + appDir + 'app/router',
                        templates: './' + appDir + 'app/templates'
                    },
                    replacements: {
                        'models/(\\w+)':      './' + appDir + 'app/models/$1',
                        'views/(\\w+)':       './' + appDir + 'app/views/$1',
                        'controllers/(\\w+)': './' + appDir + 'app/controllers/$1',
                        'plugins/(\\w+)':     './' + appDir + 'app/plugins/$1'
                    }
                }
            });
        }
        if (generator.useLess) {
            utils.json.extend(generator.destinationPath('config/default.json'), {
                grunt: {
                    files: {
                        styles: 'less/**/*.less'
                    }
                }
            });
        }
        if (generator.useSass) {
            utils.json.extend(generator.destinationPath('config/default.json'), {
                grunt: {
                    files: {
                        styles: 'sass/**/*.scss'
                    }
                }
            });
        }
        generator.log(footer(generator));
    }
});
