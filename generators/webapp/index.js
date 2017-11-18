'use strict';

const {assign, flow, partial, pick} = require('lodash');
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

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        const generator = this;
        Object.keys(commandLineOptions).forEach(option => {
            generator.option(option, commandLineOptions[option]);
        });
    }
    prompting() {
        const generator = this;
        if (generator.options.defaults) {
            const done = this.async();
            generator.use = webapp.defaults;
            Object.keys(webapp.defaults).forEach(option => {
                generator[option] = webapp.defaults[option];
            });
            const bundler = generator.options.scriptBundler;
            const preprocessor = generator.options.cssPreprocessor;
            const templateTechnology = generator.options.templateTechnology;
            const options = {
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
            const isWebapp = true;
            return generator.prompt(webapp.getQuestions(isWebapp).filter(isUnAnswered)).then(function(answers) {
                generator.use = answers;
                const bundler = (generator.options.scriptBundler || generator.use.scriptBundler).toLowerCase();
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
                const options = {
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
    }
    writing() {
        //
        // Write configuration files
        //
        const generator = this;
        const {config, options, use, user, useHandlebars} = generator;
        const attributes = {
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
        const {sourceDirectory, useAria, useImagemin} = attributes;
        const appDirectory = `${sourceDirectory}app/`;
        const assetsDirectory = `${sourceDirectory}assets/`;
        const type = resolveCssPreprocessor(this);
        const ext = CSS_PREPROCESSOR_EXT_LOOKUP[type];
        config.set('useAria', useAria);
        config.set('useImagemin', useImagemin);
        config.set('pluginDirectory', sourceDirectory);
        [].concat(
            [['config/stylelint.config.js', 'config/stylelint.config.js']],
            [['tasks/webapp.js', 'tasks/webapp.js']],
            [['_config.js', `${appDirectory}config.js`]]
        ).forEach(data => copyTpl(...data, generator));
        //
        // Write boilerplate files
        //
        [].concat(
            maybeInclude(useHandlebars, [['helpers/handlebars.helpers.js', 'helpers/handlebars.helpers.js']]),
            [[
                'helpers/jquery.extensions.js',
                'helpers/jquery.extensions.js'
            ]],
            [[
                'plugins/*.js',
                'plugins'
            ]],
            [[
                'shims/*.js',
                'shims'
            ]],
            [[
                '_index.html',
                'index.html'
            ]],
            [[
                '_app.js',
                'app.js'
            ]],
            [[
                '_main.js',
                'main.js'
            ]],
            [[
                '_router.js',
                'router.js'
            ]],
            [[
                'example.model.js',
                'models/example.js'
            ]],
            [[
                'example.view.js',
                'views/example.js'
            ]],
            [[
                'example.controller.js',
                'controllers/example.js'
            ]],
            [[
                'example.webworker.js',
                'controllers/example.webworker.js'
            ]]
        )
            .map(data => [data[0], `${appDirectory}${data[1]}`])
            .forEach(data => copyTpl(...data, generator));
        //
        // Write assets files
        //
        ['fonts', 'images', 'templates', 'library'].forEach(path => mkdirp(`${assetsDirectory}${path}`));
        copy('library/*', `${assetsDirectory}library`, generator);
        copy('omaha.png', `${assetsDirectory}images/logo.png`, generator);
        [].concat(
            maybeInclude((type === 'none'),
                [[// No CSS pre-processor
                    '_style.css',
                    'css/style.css'
                ]],
                [
                    [// Separate reset file (combined by pre-processor)
                        '_reset.css',
                        `${type}/reset.${ext}`
                    ],
                    [// Main style sheet
                        `_style.${ext}`,
                        `${type}/style.${ext}`
                    ]
                ]
            ),
            [[
                'example.template.hbs',
                'templates/example.hbs'
            ]]
        )
            .map(data => [data[0], `${assetsDirectory}${data[1]}`])
            .forEach(data => copyTpl(...data, generator));
    }
    install() {
        const generator = this;
        const {config, sourceDirectory} = generator;
        const {useAria, useBrowserify, useHandlebars, useImagemin, useLess, useSass} = generator;
        const type = resolveCssPreprocessor(generator);
        const ext = CSS_PREPROCESSOR_EXT_LOOKUP[type];
        const updatePackageJson = partial(extend, generator.destinationPath('package.json'));
        const configurePackageJson = flow(getPackageJsonAttributes, updatePackageJson).bind(generator);
        const placeholder = '/* -- load tasks placeholder -- */';
        const loadTasks = 'grunt.loadTasks(config.folders.tasks);';
        const htmlDevDependencies = [
            'grunt-contrib-htmlmin',
            'grunt-htmlhint-plus'
        ];
        const cssDevDependencies = [
            'grunt-postcss',
            'autoprefixer',
            'stylelint',
            'cssnano',
            'postcss-reporter',
            'postcss-safe-parser',
            'mdcss',
            'mdcss-theme-github'
        ];
        const requirejsDevDependencies = [
            'grunt-contrib-requirejs',
            'karma-requirejs'
        ];
        const browserifyDependencies = [
            'browserify',
            'browserify-shim',
            'aliasify',
            'babelify',
            'deamdify',
            'grunt-browserify'
        ];
        const gruntDependencies = [
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
            'grunt-replace',
            'load-grunt-tasks',
            'time-grunt'
        ];
        const karmaDependencies = [
            'karma',
            'karma-chrome-launcher',
            'karma-coverage',
            'karma-firefox-launcher',
            'karma-mocha',
            'karma-requirejs',
            'karma-spec-reporter'
        ];
        const dependencies = [// always included
            'backbone',
            'backbone.marionette',
            'backbone.radio',
            'jquery',
            'lodash',
            'morphdom',
            'redux',
            'requirejs'
        ].concat(// conditional dependencies
            useHandlebars ? 'handlebars' : []
        );
        const workflowDependencies = [
            'babel-cli',
            'babel-preset-env',
            'config',
            'eslint-plugin-backbone',
            'fs-promise',
            'globby',
            'json-server'
        ].concat(// conditional dependencies
            maybeInclude(!useBrowserify, 'babel-preset-minify')
        ).concat(
            gruntDependencies,
            karmaDependencies,
            requirejsDevDependencies,
            htmlDevDependencies,
            cssDevDependencies
        );
        const devDependencies = workflowDependencies.concat(
            maybeInclude(useBrowserify, browserifyDependencies),
            maybeInclude(useAria, ['grunt-a11y', 'grunt-accessibility']),
            maybeInclude(useImagemin, 'grunt-contrib-imagemin'),
            maybeInclude(useLess, 'grunt-contrib-less'),
            maybeInclude(useSass, 'grunt-contrib-sass'),
            maybeInclude(useHandlebars, 'grunt-contrib-handlebars', 'grunt-contrib-jst')
        );
        generator.npmInstall(dependencies, {save: true});
        generator.npmInstall(devDependencies, {saveDev: true});
        //
        // Configure default.json
        //
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
        //
        // Configure package.json
        //
        configurePackageJson();
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
                        'plugins/(\\w+)':     `./${sourceDirectory}app/plugins/$1`,
                        'shims/(\\w+)':       `./${sourceDirectory}app/shims/$1`
                    }
                }
            });
        }
        //
        // Configure workflow tasks
        //
        const text = readFileSync(generator.destinationPath('Gruntfile.js'))
            .toString()
            .replace(placeholder, loadTasks);
        const gruntfile = new Gruntfile(text);
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
        //
        // Save configuration
        //
        const projectParameters = assign(config.get('projectParameters'), pick(generator, [
            'useAria',
            'useBrowserify',
            'useHandlebars',
            'useImagemin',
            'useLess',
            'useSass'
        ]));
        config.set({projectParameters});
    }
};
function getPackageJsonAttributes() {
    const generator = this;
    const {isNative, sourceDirectory} = generator;
    const main = isNative ? './index.js' : `${sourceDirectory}app/main.js`;
    const scripts = getScripts(generator);
    const babel = {
        plugins: [],
        presets: getBabelPresets(generator)
    };
    const stylelint = {extends: './config/stylelint.config.js'};
    return {main, scripts, babel, stylelint};
}
function getBabelPresets(generator) {
    const {useBrowserify} = generator;
    return [
        ['env', {modules: false}]
    ].concat(
        maybeInclude(!useBrowserify, 'minify')
    );

}
function getScripts(generator) {
    const {isNative, config, useBrowserify} = generator;
    const useCoveralls = config.get('useCoveralls');
    const useJsinspect = config.get('useJsinspect');
    const scripts = {
        lint:         'grunt eslint:src',
        'lint:watch': 'grunt eslint:ing watch:eslint',
        'lint:tests': 'grunt eslint:tests',
        test:         'grunt test',
        'test:watch': 'grunt karma:covering'
    };
    if (isNative) {
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
    if (!useBrowserify) {
        // CAUTION: This is a static reference to dist/client directory
        const dist = './dist/client/';
        const temp = `${dist}temp.js`;
        assign(scripts, {
            postbuild: `babel ${temp} -o ${dist}config.js && rm ${temp}`
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
    return scripts;
}
function getTasks(generator) {
    const {config, useAria, useBrowserify, useHandlebars, useImagemin, useLess, useSass} = generator;
    const useBenchmark = config.get('useBenchmark');
    const useCoveralls = config.get('useCoveralls');
    const useJsinspect = config.get('useJsinspect');
    return [// Tasks enabled by default
        'browserSync',
        'clean',
        'copy',
        'eslint',
        'htmlmin',
        'htmlhintplus',
        'jsdoc',
        'jsonlint',
        'karma',
        'open',
        'plato',
        'replace',
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
            maybeInclude(useBrowserify, ['browserify', 'uglify']),
            maybeInclude(useHandlebars, 'handlebars', 'jst'),
            maybeInclude(useImagemin, ['imagemin', 'copy']),
            maybeInclude(useLess, 'less'),
            maybeInclude(useSass, 'sass')
        );
}
