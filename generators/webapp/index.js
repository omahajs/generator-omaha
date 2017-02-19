'use strict';

var _         = require('lodash');
var fs        = require('fs-extra');
var Generator = require('yeoman-generator');
var Gruntfile = require('gruntfile-editor');
var utils     = require('../app/utils');
var prompt    = require('../app/prompts').webapp;
var tasks     = require('../app/gruntTaskConfigs');
var footer    = require('./doneMessage');
var copy      = utils.copy;
var copyTpl   = utils.copyTpl;

var commandLineOptions = {
    defaults: {
        type: Boolean,
        desc: 'Scaffold app with no user input using default settings',
        defaults: false
    },
    scriptBundler: {
        type: String,
        desc: 'Choose script bundler',
        defaults: ''
    },
    cssPreprocessor: {
        type: String,
        desc: 'Choose CSS pre-processor',
        defaults: 'less'
    },
    templateTechnology: {
        type: String,
        desc: 'Choose technology to use when pre-compiling templates',
        defaults: 'handlebars'
    },
    skipImagemin: {
        type: Boolean,
        desc: 'DO NOT add image minification to project deploy pipeline',
        defaults: false
    },
    skipAria: {
        type: Boolean,
        desc: 'DO NOT add ARIA auditing tasks and dependencies to project',
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
    },
    prompting: function() {
        var generator = this;
        if (generator.options.defaults) {
            var done = this.async();
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
            var isComposed = true;
            return generator.prompt(prompt.getQuestions(isComposed).filter(isUnAnswered)).then(function(answers) {
                generator.use = answers;
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
            }.bind(generator));
        }
    },
    writing: {
        configFiles: function() {
            var generator = this;
            var _copyTpl = _.partial(copyTpl, _, _, generator);
            _.extend(generator, {
                projectName:     generator.config.get('projectName'),
                userName:        generator.config.get('userName') || generator.user.git.name(),
                sourceDirectory: generator.config.get('sourceDirectory'),
                useAria:         generator.use.aria && !generator.options.skipAria,
                useImagemin:     generator.use.imagemin && !generator.options.skipImagemin
            });
            generator.config.set('useAria', generator.useAria);
            generator.config.set('useImagemin', generator.useImagemin);
            generator.config.set('pluginDirectory', generator.sourceDirectory);
            _copyTpl('_README.md', 'README.md');
            _copyTpl('config/_csslintrc', 'config/.csslintrc');
            _copyTpl('tasks/webapp.js', 'tasks/webapp.js');
            _copyTpl('_config.js', generator.sourceDirectory + 'app/config.js');
        },
        appFiles: function() {
            var srcDir = this.sourceDirectory;
            var _copyTpl = _.partial(copyTpl, _, _, this);
            if (this.useHandlebars) {
                _copyTpl('helpers/handlebars.helpers.js', srcDir + 'app/helpers/handlebars.helpers.js');
            }
            _copyTpl('helpers/jquery.extensions.js', srcDir + 'app/helpers/jquery.extensions.js');
            _copyTpl('helpers/underscore.mixins.js', srcDir + 'app/helpers/underscore.mixins.js');
            _copyTpl('plugins/*.js', srcDir + 'app/plugins');
            _copyTpl('shims/*.js', srcDir + 'app/shims');
        },
        assets: function() {
            var srcDir = this.sourceDirectory;
            fs.mkdirp(srcDir + 'assets/fonts');
            fs.mkdirp(srcDir + 'assets/images');
            fs.mkdirp(srcDir + 'assets/templates');
            fs.mkdirp(srcDir + 'assets/library');
            copy('library/require.min.js', srcDir + 'assets/library/require.min.js', this);
            copy('omaha.png', srcDir + 'assets/images/logo.png', this);
        },
        boilerplate: function() {
            var srcDir = this.sourceDirectory;
            var _copyTpl = _.partial(copyTpl, _, _, this);
            _copyTpl('_index.html', srcDir + 'app/index.html');
            _copyTpl('_app.js', srcDir + 'app/app.js');
            _copyTpl('_main.js', srcDir + 'app/main.js');
            _copyTpl('_router.js', srcDir + 'app/router.js');
            _copyTpl('example.model.js', srcDir + 'app/models/example.js');
            _copyTpl('example.view.js', srcDir + 'app/views/example.js');
            _copyTpl('example.controller.js', srcDir + 'app/controllers/example.js');
            _copyTpl('example.webworker.js', srcDir + 'app/controllers/example.webworker.js');
            _copyTpl('example.template.hbs', srcDir + 'assets/templates/example.hbs');
            var type = this.useLess ? 'less' : (this.useSass ? 'sass' : 'none');
            var ext = {
                less: 'less',
                sass: 'scss',
                none: 'css'
            }[type];
            if (!(this.useLess || this.useSass)) {
                _copyTpl('_style.css', srcDir + 'assets/css/style.css');
            } else {
                _copyTpl('_reset.css', srcDir + `assets/${type}/reset.${ext}`);
                _copyTpl('_style.' + ext, srcDir + `assets/${type}/style.${ext}`);
            }
        }
    },
    install: function() {
        function maybeInclude(bool, val, defaultValue) {return (_.isBoolean(bool) && bool) ? val : (defaultValue || []);}
        var generator = this;
        var dependencies = [].concat(
            'jquery',
            'underscore',
            'backbone',
            'backbone.marionette',
            'backbone.radio',
            generator.useHandlebars ? 'handlebars' : []
        );
        var htmlDevDependencies = [
            'grunt-contrib-htmlmin',
            'grunt-htmlhint-plus'
        ];
        var cssDevDependencies = [
            'grunt-contrib-csslint',
            'grunt-postcss',
            'autoprefixer',
            'cssnano',
            'postcss-safe-parser',
            'mdcss',
            'mdcss-theme-github'
        ];
        var requirejsDevDependencies = [
            'grunt-contrib-requirejs',
            'karma-requirejs'
        ];
        var browserifyDependencies = [
            'browserify',
            'browserify-shim',
            'aliasify',
            'deamdify',
            'grunt-browserify',
            'grunt-replace'
        ];
        var devDependencies = [].concat(
            htmlDevDependencies,
            cssDevDependencies,
            requirejsDevDependencies,
            maybeInclude(generator.useBrowserify, browserifyDependencies),
            maybeInclude(generator.useAria, ['grunt-a11y', 'grunt-accessibility']),
            maybeInclude(generator.useImagemin, 'grunt-contrib-imagemin'),
            maybeInclude(generator.useLess, 'grunt-contrib-less'),
            maybeInclude(generator.useSass, 'grunt-contrib-sass'),
            maybeInclude(generator.useHandlebars, 'grunt-contrib-handlebars', 'grunt-contrib-jst')
        );
        generator.npmInstall(dependencies, {save: true});
        generator.npmInstall(devDependencies, {saveDev: true});
    },
    end: function() {
        var generator = this;
        var sourceDirectory = generator.sourceDirectory;
        var gruntfile = new Gruntfile(fs.readFileSync(generator.destinationPath('Gruntfile.js')).toString());
        utils.json.extend(generator.destinationPath('package.json'), {
            main: sourceDirectory + 'app/main.js',
            scripts: {
                build:     'grunt build',
                test:      'grunt test',
                predemo:   'npm run build',
                demo:      'grunt open:demo express:demo',
                start:     'grunt serve',
                predeploy: 'npm run build'
            }
        });
        if (/^linux/.test(process.platform)) {
            utils.json.extend(generator.destinationPath('package.json'), {
                scripts: {
                    presymlink: 'if [ -L `pwd`/app/assets ]; then rm `pwd`/app/assets ; fi',
                    symlink:    'ln -s `pwd`/assets `pwd`/app/assets',
                    prestart:   'nohup npm run rest-api &',
                    start:      'npm run symlink && grunt serve'
                }
            });
        }
        utils.json.extend(generator.destinationPath('config/default.json'), {
            grunt: {
                folders: {
                    app:    sourceDirectory + 'app',
                    assets: sourceDirectory + 'assets'
                }
            }
        });
        if (generator.useAria) {
            gruntfile.insertConfig('a11y', tasks.a11y);
            gruntfile.insertConfig('accessibility', tasks.accessibility);
            gruntfile.registerTask('aria-audit', ['accessibility', 'a11y']);
        }
        if (generator.useBrowserify) {
            gruntfile.insertConfig('browserify', tasks.browserify);
            gruntfile.insertConfig('replace', tasks.replace);
            gruntfile.insertConfig('uglify', tasks.uglify);
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
                        app:       './' + sourceDirectory + 'app/app',
                        router:    './' + sourceDirectory + 'app/router',
                        templates: './' + sourceDirectory + 'app/templates'
                    },
                    replacements: {
                        'models/(\\w+)':      './' + sourceDirectory + 'app/models/$1',
                        'views/(\\w+)':       './' + sourceDirectory + 'app/views/$1',
                        'controllers/(\\w+)': './' + sourceDirectory + 'app/controllers/$1',
                        'plugins/(\\w+)':     './' + sourceDirectory + 'app/plugins/$1'
                    }
                }
            });
        }
        if (generator.useHandlebars) {
            gruntfile.insertConfig('handlebars', tasks.handlebars);
        } else {
            gruntfile.insertConfig('jst', tasks.jst);
        }
        if (generator.useImagemin) {
            gruntfile.insertConfig('imagemin', tasks.imagemin);
            gruntfile.insertConfig('copy', tasks.copy);
        }
        if (generator.useLess) {
            gruntfile.insertConfig('less', tasks.less);
            utils.json.extend(generator.destinationPath('config/default.json'), {
                grunt: {
                    files: {
                        styles: 'less/**/*.less'
                    }
                }
            });
        }
        if (generator.useSass) {
            gruntfile.insertConfig('sass', tasks.sass);
            utils.json.extend(generator.destinationPath('config/default.json'), {
                grunt: {
                    files: {
                        styles: 'sass/**/*.scss'
                    }
                }
            });
        }
        gruntfile.insertConfig('htmlhintplus', tasks.htmlhintplus);
        gruntfile.insertConfig('htmlmin', tasks.htmlmin);
        gruntfile.insertConfig('postcss', tasks.postcss(sourceDirectory));
        fs.writeFileSync(generator.destinationPath('Gruntfile.js'), gruntfile.toString());
        generator.log(footer(generator));
    }
});
