
module.exports = {
    /**
     * Use Browserify to bundle scripts
     * @see {@link https://github.com/jmreidy/grunt-browserify}
    **/
    browserify: `{
        bundle: {
            files: {
                './dist/client/bundle.min.js': [
                    '<%= folders.app %>/main.js'
                ]
            }
        }
    }`,
    /**
     * Live-reload enabled sychronized server for development, tests, and demos
     * @see {@link https://www.browsersync.io/docs/grunt}
    **/
    browserSync: `{
        amd: {
            bsFiles: {
                src: [
                    '<%= folders.app %>/<%= files.index %>',
                    '<%= folders.app %>/style.css',
                    '<%= folders.app %>/templates.js'
                ]
            },
            options: {
                port: '<%= ports.server %>',
                watchTask: true,
                reloadDelay: 500,
                server: {
                    baseDir: ['<%= folders.app %>'],
                    routes: {
                        '/node_modules': './node_modules',
                        '/assets': '<%= folders.assets %>',
                    },
                    index: '<%= files.index %>'
                }
            }
        },
        cjs: {
            bsFiles: {
                src: [
                    './dist/client/bundle.min.js'
                ]
            },
            options: {
                port: '<%= ports.server %>',
                watchTask: true,
                reloadDelay: 500,
                server: ['dist', './dist/client']
            }
        },
        demo: {
            options: {
                port: '<%= ports.server %>',
                server: ['dist', './dist/client']
            }
        }
    }`,
    /**
     * Clear files and folders
     * @see {@link https://github.com/gruntjs/grunt-contrib-clean}
    **/
    clean: `{
        options: {
            force: true
        },
        docs:       ['./reports/docs/*', './styleguide'],
        coverage:   ['./reports/coverage/'],
        compile:    ['<%= folders.app %>/templates.js', '<%= folders.app %>/style.css', '<%= folders.app %>/style.css.map'],
        build:      ['dist/client', './dist/<%= deployed.assets %>']
    }`,
    /**
     * Copy files and folders (used here to copy font files to deployment directory)
     * @see {@link https://github.com/gruntjs/grunt-contrib-copy}
     * WITH IMAGEMIN
    **/
    copy: `{
        fonts: {
            files: [{
                expand: true,
                cwd: '<%= folders.assets %>/fonts',
                src: ['<%= files.fonts %>'],
                dest: './dist/<%= deployed.assets %>/fonts',
                filter: 'isFile'
            }]
        },
        library: {
            files: [{
                expand: true,
                flatten: true,
                src: [
                    '<%= folders.assets %>/library/*.js',
                    '!<%= folders.assets %>/library/almond.min.js',
                    '!<%= folders.assets %>/library/require.min.js'
                ],
                dest: './dist/<%= deployed.assets %>/library',
                filter: 'isFile'
            }]
        },
        images: {
            files: [{
                expand: true,
                cwd: '<%= folders.assets %>/images',
                src: ['<%= files.images %>'],
                dest: './dist/<%= deployed.assets %>/images',
                filter: 'isFile'
            }]
        },
        workers: {
            files: [{
                expand: true,
                cwd: '<%= folders.assets %>/workers',
                src: ['<%= files.scripts %>'],
                dest: './dist/<%= deployed.assets %>/workers',
                filter: 'isFile'
            }]
        },
        wasm: {
            files: [{
                expand: true,
                cwd: '<%= folders.assets %>/rust',
                src: ['**/*.wasm'],
                dest: './dist/<%= deployed.assets %>/rust',
                filter: 'isFile'
            }]
        }
    }`,
    /**
     * Pre-compile Handlebars templates
     * @see {@link https://github.com/gruntjs/grunt-contrib-handlebars}
    **/
    handlebars: `{
        main: {
            options: {
                amd: true,
                //Use processName to name the template keys within the compiled templates.js file
                //'assets/templates/example.hbs' --> 'example'
                processName: function(filePath) {
                    return filePath
                        .replace(config.folders.assets, '')
                        .replace(/[/]templates[/]/, '')
                        .replace(/[.]hbs/, '');
                }
            },
            files: {
                '<%= folders.app %>/templates.js': ['<%= folders.assets %>/<%= files.templates %>']
            }
        }
    }`,
    /**
     * Minimize index.html for deployment
     * @see {@link https://github.com/gruntjs/grunt-contrib-htmlmin}
    **/
    htmlmin: `{
        options: {
            removeComments: true,
            collapseWhitespace: true
        },
        build: {
            files: [
                {
                    src:  '<%= folders.app %>/<%= files.index %>',
                    dest: './dist/client/<%= files.index %>'
                }
            ]
        }
    }`,
    /**
     * Optimize image assets for deployment using imagemin
     * @see {@link https://github.com/gruntjs/grunt-contrib-imagemin}
    **/
    imagemin: `{
        build: {
            files: [{
                expand: true,
                flatten: false,
                cwd: './',
                src: ['<%= folders.assets %>/images/<%= files.images %>'],
                dest: './dist'
            }]
        }
    }`,
    /**
     * Pre-compile templates
     * @see {@link https://github.com/gruntjs/grunt-contrib-jst}
    **/
    jst: `{
        main: {
            options: {
                amd: true,
                //Use processName to name the template keys within the compiled templates.js file
                //'assets/templates/example.hbs' --> 'example'
                processName: function(filePath) {
                    return filePath
                        .replace(config.folders.assets, '')
                        .replace(/[/]templates[/]/, '')
                        .replace(/[.]hbs/, '');
                },
                templateSettings: {
                    variable: 'data',
                    interpolate : /\{\{(.+?)\}\}/g
                }
            },
            files: {
                '<%= folders.app %>/templates.js': ['<%= folders.assets %>/<%= files.templates %>']
            }
        }
    }`,
    /**
     * Run tests and generate code coverage with the Karma test runner
     * @see {@link https://github.com/karma-runner/grunt-karma}
    **/
    karma: `{
        options: {
            configFile: './config/karma.conf.js',
            port: '<%= ports.karma %>'
        },
        watch: {
            background: true,
            singleRun: false,
            coverageReporter: {
                dir: './reports/coverage/',
                includeAllSources: true
            }
        },
        coverage: {
            autoWatch: false,
            browsers: ['ChromeHeadless'],
            reporters: ['spec', 'coverage']
        },
        covering: {
            autoWatch: true,
            singleRun: false,
            browsers: ['Firefox'],
            reporters: ['progress', 'coverage']
        }
    }`,
    /**
     * Transpile LESS to CSS (with autoprefixed and minimized output)
     * @see {@link https://github.com/gruntjs/grunt-contrib-less}
    **/
    less: `{
        main: {
            options: {
                sourceMap: true,
                sourceMapFileInline: true,
                paths: ['<%= folders.assets %>/<%= files.styles %>']
            },
            files: {
                '<%= folders.app %>/style.css': '<%= folders.assets %>/less/style.less'
            }
        }
    }`,
    /**
     * Apply several post-processors to your CSS using PostCSS
     * @see {@link https://github.com/nDmitry/grunt-postcss}
    **/
    postcss: (sourceDirectory, useCssnext) => `{
        options: {
            parser: require('postcss-safe-parser'),
            processors: [
                require('stylelint')(),
                ${useCssnext ? `require('postcss-import')(),
                require('postcss-cssnext')({
                    browsers: 'last 2 versions',
                    warnForDuplicates: false
                }),` : 'require(\'autoprefixer\')({browsers: \'last 2 versions\'}),'}
                require('cssnano')(),
                require('postcss-reporter')({clearReportedMessages: true})
            ]
        },
        dev: {
            options: {
                map: {
                    inline: false,
                    annotation: '<%= folders.app %>'
                }
            },
            src: ['<%= folders.app %>/*.css', '<%= folders.assets %>/css/style.css'],
            dest: '<%= folders.app %>/style.css'
        },
        prod: {
            src:  '<%= folders.app %>/*.css',
            dest: './dist/client/style.css'
        },
        styleguide: {
            options: {
                processors: [require('mdcss')({
                    examples: {
                        css: [
                            '../${sourceDirectory}app/style.css',
                            '../${sourceDirectory}assets/css/style.css'
                        ],
                    }
                })],
            },
            src:  ['<%= folders.app %>/*.css', '<%= folders.assets %>/css/*.css']
        }
    }`,
    /**
     * Use Applause to replace link to bundled scripts if using browserify
     * @see {@link https://github.com/outaTiME/grunt-replace}
    **/
    replace: `{
        'almond-shim': {
            options: {
                patterns: [{
                    match: /<script.*<\\/script>/g,
                    replacement: '<script src="config.js"></script>'
                }]
            },
            files: [{
                src:  './dist/client/<%= files.index %>',
                dest: './dist/client/<%= files.index %>'
            }]
        },
        'bundle-url': {
            options: {
                patterns: [{
                    match: /<script.*<\\/script>/g,
                    replacement: '<script src="bundle.min.js"></script>'
                }]
            },
            files: [{
                src:  './dist/client/<%= files.index %>',
                dest: './dist/client/<%= files.index %>'
            }]
        }
    }`,
    /**
     * Optimize JS code into single file using r.js
     * @see {@link https://github.com/gruntjs/grunt-contrib-requirejs}
     * @see (@link https://github.com/jrburke/r.js/blob/master/build/example.build.js}
    **/
    requirejs: `{
        bundle: {
            options: {
                out: './dist/client/temp.js',
                mainConfigFile: '<%= folders.app %>/<%= files.configScript %>',
                baseUrl: '<%= folders.app %>',
                include: [join(__dirname, '/<%= folders.assets %>/library/almond.min.js'), '<%= files.configScript %>'],
                preserveLicenseComments: false,
                findNestedDependencies: true,
                optimize: 'none'
            }
        }
    }`,
    /**
     * Transpile SCSS to CSS
     * @see {@link https://github.com/gruntjs/grunt-contrib-sass}
    **/
    sass: `{
        main: {
            options: {
                style: 'expanded',
                sourcemap: 'inline'
            },
            files: {
                '<%= folders.app %>/style.css': '<%= folders.assets %>/sass/style.scss'
            }
        }
    }`,
    /**
     * Minify JavaScript files with UglifyJS
     * @see {@link https://github.com/gruntjs/grunt-contrib-uglify}
    **/
    uglify: `{
        bundle: {
            options: {
                banner: '/* <%= package.name %> - v<%= package.version %> - 2017-11-22 */',
                mangle: true,
                comments: false,
                compress: {
                    drop_console: true// discard calls to console.* functions
                }
            },
            files: {
                './dist/client/bundle.min.js': [
                    './dist/client/bundle.min.js'
                ]
            }
        }
    }`,
    /**
     * Run predefined tasks whenever watched file patterns are added, changed or deleted
     * @see {@link https://github.com/gruntjs/grunt-contrib-watch}
    **/
    watch: `{
        style: {
            files: ['<%= folders.assets %>/<%= files.styles %>'],
            tasks: ['process-styles'],
            options: {spawn: false}
        },
        eslint: {
            files: '<%= folders.app %>/<%= files.scripts %>',
            tasks: ['eslint:ing'],
            options: {spawn: false}
        },
        lint: {
            files: [
                '<%= folders.app %>/style.css',
                '<%= folders.app %>/<%= files.scripts %>'
            ],
            tasks: ['lint'],
            options: {spawn: false}
        },
        browser: {
            files: [
                '<%= folders.app %>/<%= files.index %>',
                '<%= folders.assets %>/css/*.css',
                '<%= folders.app %>/style.css',
                '<%= folders.app %>/<%= files.scripts %>',
                '<%= folders.assets %>/<%= files.templates %>'
            ],
            tasks: ['compile'],
            options: {
                spawn: false
            }
        }
    }`,
    /**
     * Integrate webpack into grunt build process
     * @see {@link https://github.com/webpack-contrib/grunt-webpack}
    **/
    webpack: `{
        bundle: require('./config/webpack.config.js')
    }`
};
