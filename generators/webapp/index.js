'use strict';

const {assign, partial, partialRight, pick} = require('lodash');
const {mkdirp, readFileSync, writeFileSync} = require('fs-extra');
const Generator = require('yeoman-generator');
const Gruntfile = require('gruntfile-editor');
const {webapp}  = require('../app/prompts');
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
const CSS_PREPROCESSOR_EXT_LOOKUP = {
    less: 'less',
    sass: 'scss',
    none: 'css'
};

function resolveCssPreprocessor(generator) {
    return generator.useLess ? 'less' : (generator.useSass ? 'sass' : 'none');
}

module.exports = Generator.extend({
    constructor: function() {
        Generator.apply(this, arguments);
        let generator = this;
        Object.keys(commandLineOptions).forEach(option => {
            generator.option(option, commandLineOptions[option]);
        });
    },
    prompting: function() {
        let generator = this;
        if (generator.options.defaults) {
            let done = this.async();
            generator.use = webapp.defaults;
            Object.keys(webapp.defaults).forEach(option => {
                generator[option] = webapp.defaults[option];
            });
            let bundler = generator.options.scriptBundler;
            let preprocessor = generator.options.cssPreprocessor;
            let templateTechnology = generator.options.templateTechnology;
            let options = {
                useBrowserify: (bundler === 'browserify') || webapp.defaults.useBrowserify,
                useLess:       (preprocessor === 'less'),
                useSass:       (preprocessor === 'sass'),
                useHandlebars: (templateTechnology === 'handlebars')
            };
            Object.keys(options).forEach(option => {
                generator[option] = options[option];
            });
            done();
        } else {
            function isUnAnswered(option) {
                return !!!generator.options[option.name] || (generator.options[option.name] === commandLineOptions[option.name].defaults);
            }
            let isWebapp = true;
            return generator.prompt(webapp.getQuestions(isWebapp).filter(isUnAnswered)).then(function(answers) {
                generator.use = answers;
                let bundler = (generator.options.scriptBundler || generator.use.scriptBundler).toLowerCase();
                let preprocessor;
                if (generator.options.cssPreprocessor === commandLineOptions.cssPreprocessor.defaults) {
                    preprocessor = generator.use.cssPreprocessor.toLowerCase();
                } else {
                    preprocessor = generator.options.cssPreprocessor;
                }
                let templateTechnology;
                if (generator.options.templateTechnology === commandLineOptions.templateTechnology.defaults) {
                    templateTechnology = generator.use.templateTechnology.toLowerCase();
                } else {
                    templateTechnology = generator.options.templateTechnology;
                }
                let options = {
                    useBrowserify: (bundler === 'browserify'),
                    useLess:       (preprocessor === 'less'),
                    useSass:       (preprocessor === 'sass'),
                    useHandlebars: (templateTechnology === 'handlebars')
                };
                Object.keys(options).forEach(option => {
                    generator[option] = options[option];
                });
            }.bind(generator));
        }
    },
    writing: {
        writeConfigFiles: function() {
            let generator = this;
            let {config, options, use, user} = generator;
            let _copyTpl = partialRight(copyTpl, generator);
            let attributes = {
                sourceDirectory: config.get('sourceDirectory'),
                isNative:        config.get('isNative'),
                projectName:     config.get('projectName'),
                userName:        config.get('userName') || user.git.name(),
                useAria:         use.aria && !options.skipAria,
                useImagemin:     use.imagemin && !options.skipImagemin
            };
            Object.keys(attributes).forEach(name => {
                generator[name] = attributes[name];
            });
            let {sourceDirectory, useAria, useImagemin} = attributes;
            config.set('useAria', useAria);
            config.set('useImagemin', useImagemin);
            config.set('pluginDirectory', sourceDirectory);
            _copyTpl('_README.md', 'README.md');
            _copyTpl('config/_csslintrc', 'config/.csslintrc');
            _copyTpl('tasks/webapp.js', 'tasks/webapp.js');
            _copyTpl('_config.js', `${sourceDirectory}app/config.js`);
        },
        writeAppFiles: function() {
            let {sourceDirectory, useHandlebars} = this;
            let _copyTpl = partialRight(copyTpl, this);
            if (useHandlebars) {
                _copyTpl('helpers/handlebars.helpers.js', sourceDirectory + 'app/helpers/handlebars.helpers.js');
            }
            _copyTpl('helpers/jquery.extensions.js', `${sourceDirectory}app/helpers/jquery.extensions.js`);
            _copyTpl('plugins/*.js', `${sourceDirectory}app/plugins`);
            _copyTpl('shims/*.js', `${sourceDirectory}app/shims`);
        },
        writeAssetsFiles: function() {
            let {sourceDirectory} = this;
            let _copy = partialRight(copy, this);
            ['fonts', 'images', 'templates', 'library'].forEach(path => mkdirp(`${sourceDirectory}assets/${path}`));
            _copy('library/require.min.js', `${sourceDirectory}assets/library/require.min.js`);
            _copy('omaha.png', `${sourceDirectory}assets/images/logo.png`);
        },
        writeBoilerplateFiles: function() {
            let {sourceDirectory} = this;
            let _copyTpl = partialRight(copyTpl, this);
            _copyTpl('_index.html', `${sourceDirectory}app/index.html`);
            _copyTpl('_app.js', `${sourceDirectory}app/app.js`);
            _copyTpl('_main.js', `${sourceDirectory}app/main.js`);
            _copyTpl('_router.js', `${sourceDirectory}app/router.js`);
            _copyTpl('example.model.js', `${sourceDirectory}app/models/example.js`);
            _copyTpl('example.view.js', `${sourceDirectory}app/views/example.js`);
            _copyTpl('example.controller.js', `${sourceDirectory}app/controllers/example.js`);
            _copyTpl('example.webworker.js', `${sourceDirectory}app/controllers/example.webworker.js`);
            _copyTpl('example.template.hbs', `${sourceDirectory}assets/templates/example.hbs`);
            let type = resolveCssPreprocessor(this);
            let ext = CSS_PREPROCESSOR_EXT_LOOKUP[type];
            if (type === 'none') {
                _copyTpl('_style.css', `${sourceDirectory}assets/css/style.css`);
            } else {
                _copyTpl('_reset.css', `${sourceDirectory}assets/${type}/reset.${ext}`);
                _copyTpl(`_style.${ext}`, `${sourceDirectory}assets/${type}/style.${ext}`);
            }
        }
    },
    install: {
        installDependencies: function() {
            let generator = this;
            let {useAria, useBrowserify, useHandlebars, useImagemin, useLess, useSass} = generator;
            let dependencies = [// always included
                'jquery',
                'lodash',
                'backbone',
                'backbone.marionette',
                'backbone.radio',
                'redux',
                'requirejs'
            ].concat(// conditional dependencies
                useHandlebars ? 'handlebars' : []
            );
            let htmlDevDependencies = [
                'grunt-contrib-htmlmin',
                'grunt-htmlhint-plus'
            ];
            let cssDevDependencies = [
                'grunt-contrib-csslint',
                'grunt-postcss',
                'autoprefixer',
                'cssnano',
                'postcss-safe-parser',
                'mdcss',
                'mdcss-theme-github'
            ];
            let requirejsDevDependencies = [
                'grunt-contrib-requirejs',
                'karma-requirejs'
            ];
            let browserifyDependencies = [
                'browserify',
                'browserify-shim',
                'aliasify',
                'babelify',
                'deamdify',
                'grunt-browserify',
                'grunt-replace'
            ];
            let gruntDependencies = [
                'grunt',
                'grunt-browser-sync',
                'grunt-cli',
                'grunt-contrib-clean',
                'grunt-contrib-copy',
                'grunt-contrib-uglify',
                'grunt-contrib-watch',
                'grunt-eslint',
                'grunt-express',
                'grunt-jsdoc',
                'grunt-jsonlint',
                'grunt-karma',
                'grunt-open',
                'grunt-parallel',
                'grunt-plato',
                'load-grunt-tasks',
                'time-grunt'
            ];
            let karmaDependencies = [
                'karma',
                'karma-chrome-launcher',
                'karma-coverage',
                'karma-phantomjs-launcher',
                'karma-firefox-launcher',
                'karma-mocha',
                'karma-requirejs',
                'karma-spec-reporter'
            ];
            let workflowDependencies = [
                'babel-cli',
                'babel-preset-env',
                'config',
                'eslint-plugin-backbone',
                'fs-promise',
                'globby',
                'json-server',
                'phantomjs-prebuilt'
            ]
            .concat(// conditional dependencies
                !useBrowserify ? 'babel-preset-babili' : []
            )
            .concat(
                gruntDependencies,
                karmaDependencies,
                requirejsDevDependencies,
                htmlDevDependencies,
                cssDevDependencies
            );
            let devDependencies = workflowDependencies.concat(
                maybeInclude(useBrowserify, browserifyDependencies),
                maybeInclude(useAria, ['grunt-a11y', 'grunt-accessibility']),
                maybeInclude(useImagemin, 'grunt-contrib-imagemin'),
                maybeInclude(useLess, 'grunt-contrib-less'),
                maybeInclude(useSass, 'grunt-contrib-sass'),
                maybeInclude(useHandlebars, 'grunt-contrib-handlebars', 'grunt-contrib-jst')
            );
            generator.npmInstall(dependencies, {save: true});
            generator.npmInstall(devDependencies, {saveDev: true});
        },
        configureDefaultJson: function() {
            let generator = this;
            let {sourceDirectory} = generator;
            let type = resolveCssPreprocessor(generator);
            let ext = CSS_PREPROCESSOR_EXT_LOOKUP[type];
            if (type !== 'none') {
                extend(generator.destinationPath('config/default.json'), {
                    grunt: {
                        files: {
                            styles: `${type}/**/*.${ext}`
                        }
                    }
                });
            }
            extend(generator.destinationPath('config/default.json'), {
                grunt: {
                    folders: {
                        app:    `${sourceDirectory}app`,
                        assets: `${sourceDirectory}assets`
                    }
                }
            });
        },
        configurePackageJson: function() {
            let generator = this;
            let {config, isNative, sourceDirectory, useBrowserify} = generator;
            let useCoveralls = config.get('useCoveralls');
            let useJsinspect = config.get('useJsinspect');
            let updatePackageJson = partial(extend, generator.destinationPath('package.json'));
            let main = `${sourceDirectory}app/main.js`;
            let scripts = {
                lint:         'grunt eslint:src',
                'lint:watch': 'grunt eslint:ing watch:eslint',
                'lnit:tests': 'grunt eslint:tests',
                test:         'grunt test',
                'test:watch': 'grunt karma:covering'
            };
            let plugins = [];// babel plugins
            let presets = [['env', {modules: false}]];// babel presets
            if (isNative) {
                main = './index.js';
                assign(scripts, {
                    start:          'grunt compile && electron index',
                    build:          'echo under construction',
                    'build:webapp': 'grunt build'
                });
            } else {
                assign(scripts, {
                    start:     'grunt serve',
                    build:     'grunt build',
                    predemo:   'npm run build',
                    demo:      'grunt browserSync:demo',
                    predeploy: 'npm run build'
                });
            }
            if (useCoveralls) {
                assign(scripts, {
                    'test:ci': 'npm test && grunt coveralls'
                });
            }
            if (useJsinspect) {
                assign(scripts, {
                    inspect: 'grunt jsinspect:app'
                });
            }
            if (useBrowserify) {
                updatePackageJson({
                    browser: {
                        underscore: './node_modules/lodash/lodash.min.js',
                        lodash:     './node_modules/lodash/lodash.min.js'
                    },
                    browserify: {
                        transform: ['deamdify', 'browserify-shim', 'aliasify', 'babelify']
                    },
                    'browserify-shim': {
                        underscore: '_'
                    },
                    aliasify: {
                        aliases: {
                            app:       `./${sourceDirectory}app/app`,
                            router:    `./${sourceDirectory}app/router`,
                            templates: `./${sourceDirectory}app/templates`
                        },
                        replacements: {
                            'models/(\\w+)':      `./${sourceDirectory}app/models/$1`,
                            'views/(\\w+)':       `./${sourceDirectory}app/views/$1`,
                            'controllers/(\\w+)': `./${sourceDirectory}app/controllers/$1`,
                            'plugins/(\\w+)':     `./${sourceDirectory}app/plugins/$1`
                        }
                    }
                });
            } else {
                // CAUTION: This is a static reference to dist/client directory
                let dist = './dist/client/';
                let temp = `${dist}temp.js`;
                assign(scripts, {
                    postbuild: `babel ${temp} -o ${dist}config.js && rm ${temp}`
                });
                presets = presets.concat('babili');
            }
            let babel = {plugins, presets};
            updatePackageJson({main, scripts, babel});
        },
        configureWorkflowTasks: function() {
            const placeholder = '/* -- load tasks placeholder -- */';
            const loadTasks = 'grunt.loadTasks(config.folders.tasks);';
            let generator = this;
            let {sourceDirectory, useAria} = this;
            let text = readFileSync(generator.destinationPath('Gruntfile.js'))
                .toString()
                .replace(placeholder, loadTasks);
            let gruntfile = new Gruntfile(text);
            //
            // Get grunt tasks based on user input
            //
            getTasks(generator).sort().forEach(name => gruntfile.insertConfig(name, tasks[name]));
            //
            // Register custom grunt tasks
            //
            gruntfile.insertConfig('postcss', tasks.postcss(sourceDirectory));
            useAria && gruntfile.registerTask('aria-audit', ['accessibility', 'a11y']);
            gruntfile.registerTask('default', ['serve']);
            //
            // Write to file and display footer
            //
            writeFileSync(generator.destinationPath('Gruntfile.js'), gruntfile.toString());
        },
        saveConfiguration: function() {
            let generator = this;
            let {config} = generator;
            let projectParameters = assign(config.get('projectParameters'), pick(generator, [
                'useAria',
                'useBrowserify',
                'useHandlebars',
                'useImagemin',
                'useLess',
                'useSass'
            ]));
            config.set({projectParameters});
        }
    }
});
function getTasks(generator) {
    let {config, useAria, useBrowserify, useHandlebars, useImagemin, useLess, useSass} = generator;
    let useBenchmark = config.get('useBenchmark');
    let useCoveralls = config.get('useCoveralls');
    let useJsinspect = config.get('useJsinspect');
    return [// Tasks enabled by default
        'browserSync',
        'clean',
        'copy',
        'csslint',
        'eslint',
        'htmlmin',
        'htmlhintplus',
        'jsdoc',
        'jsonlint',
        'karma',
        'open',
        'plato',
        'requirejs',
        'watch'
    ]
    .concat(// Project tasks enabled by user
        maybeInclude(useBenchmark, 'benchmark'),
        maybeInclude(useCoveralls, 'coveralls'),
        maybeInclude(useJsinspect, 'jsinspect')
    )
    .concat(// Webapp tasks enabled by user
        maybeInclude(useAria, ['a11y', 'accessibility']),
        maybeInclude(useBrowserify, ['browserify', 'replace', 'uglify']),
        maybeInclude(useHandlebars, 'handlebars', 'jst'),
        maybeInclude(useImagemin, ['imagemin', 'copy']),
        maybeInclude(useLess, 'less'),
        maybeInclude(useSass, 'sass')
    );
}
