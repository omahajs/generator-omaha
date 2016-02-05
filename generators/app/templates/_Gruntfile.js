var config = require('config').grunt;//Load external parameters using config node module
module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        package: grunt.file.readJSON('package.json'),
        ports:   config.ports,
        folders: config.folders,
        files:   config.files,
        deployed: {
            assets: config.folders.assets.split('/')[1],
            images: config.files.images.split('/')[0],
            fonts:  config.files.fonts.split('/')[0]
        },
<% if (props.useA11y) { %>
        /**
         * Accessibility audit with a11y
         * @see {@link https://github.com/lucalanca/grunt-a11y}
        **/
        a11y: {
            index: {
                options: {urls: ['<%%= folders.app %>/<%%= files.index %>']}
            }
        },

        /**
         * Accessibility audit with AccessSniff and HTML Codesniffer
         * @see {@link https://github.com/yargalot/grunt-accessibility}
        **/
        accessibility: {
            index: {
                options: {
                    reportLevels: {
                        notice: false,
                        warning: true,
                        error: true
                    },
                    accessibilityLevel: 'WCAG2AAA',
                    ignore : [
                        'WCAG2A.Principle2.Guideline2_4.2_4_2.H25.2'
                    ]
                },
                src: ['<%%= folders.app %>/<%%= files.index %>']
            },
            templates: {
                options: {
                    accessibilityLevel: 'WCAG2AAA',
                    ignore : [
                        //Templates will tend to always violate these rules and need not be reported
                        'WCAG2A.Principle2.Guideline2_4.2_4_2.H25.2',
                        'WCAG2A.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl',
                        'WCAG2A.Principle3.Guideline3_1.3_1_1.H57.2'
                    ]
                },
                src: ['<%%= folders.assets %>/<%%= files.templates %>']
            }
        },
<% } %><% if (props.benchmarks) { %>
        /**
         * Run benchmarks
         * @see {@link https://github.com/shama/grunt-benchmark}
        **/
        benchmark: {
            options: {
                displayResults: true
            },
            all: {
                src: ['<%%= folders.test %>/benchmarks/*.js'],
                dest: '<%%= folders.reports %>/benchmarks/results.csv'
            }
        },
<% } %><% if (useBrowserify) { %>
        /**
         * Use Browserify to bundle scripts
         * @see {@link https://github.com/jmreidy/grunt-browserify}
        **/
        browserify: {
            bundle: {
                files: {
                    '<%%= folders.dist %>/<%%= folders.client %>/bundle.js': ['<%%= folders.app %>/main.js']
                }
            }
        },
<% } %><% if (props.useBuddyjs) { %>
        /**
         * Find "magic numbers" (unnamed numerical constants) in code
         * @see {@link https://github.com/eugene-bulkin/grunt-buddyjs}
        **/
        buddyjs: {
            src: ['<%%= folders.app %>/<%%= files.scripts %>', '!<%%= folders.app %>/templates.js'],
            options: {
                ignore: [0, 1, 10, 100]
            }
        },
<% } %>
        /**
         * Clear files and folders
         * @see {@link https://github.com/gruntjs/grunt-contrib-clean}
        **/
        clean: {
            docs:     ['<%%= folders.reports %>/<%%= folders.docs %>/*'],
            coverage: ['<%%= folders.reports %>/<%%= folders.coverage %>/'],
            compile:  ['<%%= folders.app %>/templates.js', '<%%= folders.app %>/style.css'],
            build:    ['<%%= folders.dist %>/<%%= folders.client %>', '<%%= folders.dist %>/<%%= deployed.assets %>']
        },
<% if (props.useCoveralls) { %>
        /**
         * Send coverage report to Coveralls.io
         * @see {@link https://github.com/mattjmorrison/grunt-karma-coveralls}
        **/
        coveralls: {
            options: {
                // LCOV coverage file relevant to every target
                coverageDir: '<%%= folders.reports %>/<%%= folders.coverage %>/',
                recursive: true,
                force: true
            }
        },
<% } %>
        /**
         * Copy files and folders (used here to copy font files to deployment directory)
         * @see {@link https://github.com/gruntjs/grunt-contrib-copy}
        **/
        copy: {
            fonts: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['<%%= folders.assets %>/<%%= files.fonts %>'],
                    dest: '<%%= folders.dist %>/<%%= deployed.assets %>/<%%= deployed.fonts %>',
                    filter: 'isFile'
                }]
            }<% if(!props.compressImages) { %>,
            images: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['<%%= folders.assets %>/<%%= files.images %>'],
                    dest: '<%%= folders.dist %>/<%%= deployed.assets %>/<%%= deployed.images %>',
                    filter: 'isFile'
                }]
            }<% } %>
        },

        /**
         * Lint compiled CSS output file
         * @see {@link https://github.com/gruntjs/grunt-contrib-csslint}
        **/
        csslint: {
            options: {csslintrc: '<%%= files.config.csslint %>'},
            src: ['<%%= folders.app %>/style.css']
        },

        /**
         * Start an Express.js web server
         * @see {@link https://github.com/blai/grunt-express}
        **/
        express: {
            main: {
                options: {
                    bases: [__dirname],
                    port: '<%%= ports.default %>',
                    hostname: '0.0.0.0',
                    livereload: '<%%= ports.livereload %>'
                }
            },
            demo: {
                options: {
                    bases: [__dirname],
                    port: '<%%= ports.default %>',
                    hostname: '0.0.0.0',
                    serverreload: true
                }
            }
        },

        /**
         * Pre-compile Handlebars templates
         * @see {@link https://github.com/gruntjs/grunt-contrib-handlebars}
        **/
        handlebars: {
            main: {
                options: {
                    amd: true,
                    //Use processName to name the template keys within the compiled templates.js file
                    //"assets/templates/example.hbs" --> "example"
                    processName: function(filePath) {
                        return filePath
                            .replace(config.folders.assets, '')
                            .replace(/[/]templates[/]/, '')
                            .replace(/[.]hbs/, '');
                    }
                },
                files: {
                    '<%%= folders.app %>/templates.js': ['<%%= folders.assets %>/<%%= files.templates %>']
                }
            }
        },

        /**
         * Lint HTML files
         * @see {@link https://github.com/yaniswang/HTMLHint}
        **/
        htmlhintplus: {
            app: {
                src: [
                  '<%%= folders.assets %>/<%%= files.templates %>',
                  '<%%= folders.app %>/<%%= files.index %>'
                ]
            }
        },

        /**
         * Minimize index.html for deployment
         * @see {@link https://github.com/gruntjs/grunt-contrib-htmlmin}
        **/
        htmlmin: {
            options: {
                removeComments: true,
                collapseWhitespace: true
            },
            build: {
                files: [
                    {
                        src:  '<%%= folders.app %>/<%%= files.index %>',
                        dest: '<%%= folders.dist %>/<%%= folders.client %>/<%%= files.index %>'
                    }
                ]
            }
        },
<% if(props.compressImages) { %>
        /**
         * Optimize image assets for deployment using imagemin
         * @see {@link https://github.com/gruntjs/grunt-contrib-imagemin}
        **/
        imagemin: {
            build: {
                files: [{
                    expand: true,
                    flatten: true,
                    cwd: './',
                    src: ['<%%= folders.assets %>/<%%= files.images %>'],
                    dest: '<%%= folders.dist %>/<%%= deployed.assets %>/<%%= deployed.images %>'
                }]
            }
        },
<% } %>
        /**
         * Lint JavaScript code with JSCS (focus on code style)
         * @see {@link https://github.com/jscs-dev/grunt-jscs}
        **/
        jscs: {
            options: {
                config: '<%%= files.config.jscs %>',
                force: true,
                reporter: 'console',//checkstyle, inline, console, text
                reporterOutput: null
            },
            ing: {
                options: {
                    fix: <%= autoFix %>
                },
                files: {src: ['<%%= folders.app %>/<%%= files.scripts %>', '!<%%= folders.app %>/templates.js']}
            },
            app: {
                options: {
                    fix: false
                },
                files: {src: ['<%%= folders.app %>/<%%= files.scripts %>', '!<%%= folders.app %>/templates.js']}
            },
            comments: {
                files: {src: ['<%%= folders.app %>/<%%= files.scripts %>']}
            }
        },

        /**
         * Generate documentation from JS comments using JSDoc3
         * @see {@link https://github.com/krampstudio/grunt-jsdoc}
        **/
        jsdoc : {
            app: {
                src: ['<%%= folders.app %>/<%%= files.scripts %>'],
                dest: '<%%= folders.reports %>/<%%= folders.docs %>',
                options: {
                    readme: 'README.md'
                }
            }
        },

        /**
         * Lint JavaScript code with JSHint (with improved CLI output using jshint-stylish)
         * @see {@link https://github.com/gruntjs/grunt-contrib-jshint}
         * @see {@link https://github.com/sindresorhus/jshint-stylish}
         **/
        jshint: {
            options: {
                force: true,
                reporter: require('jshint-stylish'),
                jshintrc: '<%%= files.config.jshint %>',
                ignores: '<%%= folders.app %>/templates.js'
            },
            grunt: 'Gruntfile.js',
            tasks: '<%%= folders.tasks %>/<%%= files.scripts %>',
            tests: '<%%= folders.test %>/<%%= folders.specs %>/<%%= files.scripts %>',
            app:   '<%%= folders.app %>/<%%= files.scripts %>'
        },
<% if (props.useJsinspect) { %>
        /**
         * Detect copy-pasted and structurally similar code
         * @see {@link https://github.com/stefanjudis/grunt-jsinspect}
        **/
        jsinspect: {
            app:         {src: ['<%%= folders.app %>/<%%= files.scripts %>']},
            models:      {src: ['<%%= folders.app %>/<%%= files.models %>']},
            views:       {src: ['<%%= folders.app %>/<%%= files.views %>']},
            controllers: {src: ['<%%= folders.app %>/<%%= files.controllers %>']}
        },
<% } %>
        /**
         * Lint project JSON files
         * @see {@link https://github.com/brandonramirez/grunt-jsonlint}
        **/
        jsonlint: {
            project: {src: ['./*.json', '<%%= folders.config %>/.*']}
        },

        /**
         * Run tests and generate code coverage with the Karma test runner
         * @see {@link https://github.com/karma-runner/grunt-karma}
        **/
        karma: {
            options: {
                configFile: '<%%= files.config.karma %>',
                port: '<%%= ports.karma %>'
            },
            watch: {
                background: true,
                singleRun: false,
                coverageReporter: {
                    dir: '<%%= folders.reports %>/<%%= folders.coverage %>/',
                    includeAllSources: true
                }
            },
            coverage: {
                autoWatch: false,
                browsers: ['PhantomJS'],
                reporters: ['spec', 'coverage']
            },
            covering: {
                autoWatch: true,
                singleRun: false,
                browsers: ['Firefox'],
                reporters: ['progress', 'coverage']
            }
        },
<% if (useLess) { %>
        /**
         * Transpile LESS to CSS (with autoprefixed and minimized output)
         * @see {@link https://github.com/gruntjs/grunt-contrib-less}
        **/
        less: {
            main: {
                options: {
                    paths: ['<%%= folders.assets %>/<%%= files.styles %>']
                },
                files: {
                    '<%%= folders.app %>/style.css': '<%%= folders.assets %>/less/style.less',
                    '<%%= folders.dist %>/<%%= folders.client %>/style.css': '<%%= folders.assets %>/less/style.less'
                }
            }
        },
<% } %>
        /**
         * Open files in browsers for review
         * @see {@link https://github.com/jsoverson/grunt-open}
        **/
        open: {
            browser: {
                path: 'http://localhost:<%%= ports.default %>/<%%= folders.app %>'
            },
            demo: {
                path: 'http://localhost:<%%= ports.default %>/<%%= folders.dist %>/<%%= folders.client %>'
            },
            coverage: {
                path: __dirname + '/<%%= folders.reports %>/<%%= folders.coverage %>/report-html/index.html'
            },
            plato: {
                path: __dirname + '/<%%= folders.reports %>/plato/index.html'
            },
            docs: {
                path: __dirname + '/<%%= folders.reports %>/<%%= folders.docs %>/index.html'
            }
        },

        /**
         * Generate persistent static analysis reports with plato
         * @see {@link https://github.com/jsoverson/grunt-plato}
        **/
        plato: {
            app : {
                src : ['<%%= folders.app %>/<%%= files.scripts %>', '!<%%= folders.app %>/templates.js'],
                dest : '<%%= folders.reports %>/plato',
                options : {
                    jshint : grunt.file.readJSON(config.files.config.jshint)
                }
            }
        },

        /**
         * Apply several post-processors to your CSS using PostCSS
         * @see {@link https://github.com/nDmitry/grunt-postcss}
        **/
        postcss: {
            options: {
                map: {
                    inline: false,
                    annotation: '<%%= folders.app %>'
                },
                parser: require('postcss-safe-parser'),
                processors: [
                    require('autoprefixer')({browsers: 'last 2 versions'}),
                    require('cssnano')()
                ]
            },
            dist: {
                src: '<%%= folders.app %>/*.css'
            }
        },

        /**
         * Optimize JS code into single file using r.js
         * @see {@link https://github.com/gruntjs/grunt-contrib-requirejs}
         * @see (@link https://github.com/jrburke/r.js/blob/master/build/example.build.js}
        **/
        requirejs: {
            bundle: {
                options: {
                    out: '<%%= folders.dist %>/<%%= folders.client %>/<%%= files.configScript %>',
                    mainConfigFile: '<%%= folders.app %>/<%%= files.configScript %>',
                    baseUrl: '<%%= folders.app %>',
                    include: ['<%%= files.configScript %>'],
                    preserveLicenseComments: false,
                    findNestedDependencies: true,
                    optimize: 'uglify2',
                    uglify2: {
                        output: {
                            comments: false,
                            preamble: '/* <%%= package.name %> - v<%%= package.version %> - ' +
                                      '2016-02-07 */'
                        },
                        compress: {
                            drop_console: true //discard calls to console.* functions
                        }
                    }
                }
            }
        },
<% if (useBrowserify) { %>
        /**
         * Use Applause to replace link to bundled scripts if using browserify
         * @see {@link https://github.com/outaTiME/grunt-replace}
        **/
        replace: {
            'bundle-url': {
                options: {
                    patterns: [{
                        match: /<script.*<\/script>/g,
                        replacement: '<script src="bundle.min.js"></script>'
                    }]
                },
                files: [{
                    src:  '<%%= folders.dist %>/<%%= folders.client %>/<%%= files.index %>',
                    dest: '<%%= folders.dist %>/<%%= folders.client %>/<%%= files.index %>'
                }]
            }
        },
<% } %><% if (useSass) { %>
        /**
         * Transpile SCSS to CSS
         * @see {@link https://github.com/gruntjs/grunt-contrib-sass}
        **/
        sass: {
            main: {
                options: {
                    style: 'expanded',
                    sourcemap: 'none'
                },
                files: {
                    '<%%= folders.app %>/style.css': '<%%= folders.assets %>/sass/style.scss'
                }
            }
        },
<% } %><% if (useBrowserify) { %>
        /**
         * Minify JavaScript files with UglifyJS
         * @see {@link https://github.com/gruntjs/grunt-contrib-uglify}
        **/
        uglify: {
            bundle: {
                options: {
                    mangle: true,
                    comments: false,
                    compress: {
                        drop_console: true //discard calls to console.* functions
                    },
                    banner: '/* <%%= package.name %> - v<%%= package.version %> - 2016-02-07 */'
                },
                files: {
                    '<%%= folders.dist %>/<%%= folders.client %>/bundle.min.js': [
                        '<%%= folders.dist %>/<%%= folders.client %>/bundle.js'
                    ]
                }
            }
        },
<% } %>
        /**
         * Run predefined tasks whenever watched file patterns are added, changed or deleted
         * @see {@link https://github.com/gruntjs/grunt-contrib-watch}
        **/
        watch: {
            style: {
                files: ['<%%= folders.assets %>/<%%= files.styles %>'],
                tasks: ['process-styles', 'csslint'],
                options: {spawn: false}
            },
            jshint: {
                files: '<%%= folders.app %>/<%%= files.scripts %>',
                tasks: ['jshint:app'],
                options: {spawn: false}
            },
            jscs: {
                files: '<%%= folders.app %>/<%%= files.scripts %>',
                tasks: ['jscs:ing'],
                options: {spawn: false}
            },
            lint: {
                files: [
                    '<%%= folders.app %>/style.css',            //CSS
                    '<%%= folders.app %>/<%%= files.scripts %>' //Scripts
                ],
                tasks: ['lint'],
                options: {spawn: false}
            },
            browser: {
                files: [
                    '<%%= folders.app %>/<%%= files.index %>',      //index.html
                    '<%%= folders.app %>/style.css',                //CSS
                    '<%%= folders.app %>/<%%= files.scripts %>',    //Scripts
                    '<%%= folders.assets %>/<%%= files.templates %>'//Templates
                ],
                tasks: ['compile'],
                options: {
                    livereload: '<%%= ports.livereload %>',
                    spawn: false
                }
            }
        }
    });
    require('time-grunt')(grunt);            //Display execution times for tasks in console
    require('load-grunt-tasks')(grunt);      //Plugin for loading external task files
    grunt.loadTasks(config.folders.tasks);   //Load external task files
    grunt.registerTask('default', ['serve']);//Set default Grunt task
};
