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
        /**
         * Clear files and folders
         * @see {@link https://github.com/gruntjs/grunt-contrib-clean}
        **/
        clean: {
            options: {
                force: true
            },
            docs:     ['<%%= folders.reports %>/<%%= folders.docs %>/*'],
            coverage: ['<%%= folders.reports %>/<%%= folders.coverage %>/'],
            compile:  ['<%%= folders.app %>/templates.js', '<%%= folders.app %>/style.css', '<%%= folders.app %>/style.css.map'],
            build:    ['<%%= folders.dist %>/<%%= folders.client %>', '<%%= folders.dist %>/<%%= deployed.assets %>']
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
         * Validate files with ESLint
         * @see {@link https://www.npmjs.com/package/grunt-eslint}
        **/
        eslint: {
            options: {
                configFile: '<%%= files.config.eslint %>'
            },
            ing: {
                options: {
                    fix: true
                },
                src: ['<%%= folders.app %>/<%%= files.scripts %>', '!<%%= folders.app %>/templates.js']
            },
            app: {
                options: {
                    fix: false
                },
                src: ['<%%= folders.app %>/<%%= files.scripts %>', '!<%%= folders.app %>/templates.js']
            }
        },

        /**
         * Start an Express.js web server
         * @see {@link https://github.com/blai/grunt-express}
        **/
        express: {
            main: {
                options: {
                    bases: [__dirname],
                    port: '<%%= ports.server %>',
                    hostname: '0.0.0.0',
                    livereload: '<%%= ports.livereload %>'
                }
            },
            demo: {
                options: {
                    bases: [__dirname],
                    port: '<%%= ports.server %>',
                    hostname: '0.0.0.0',
                    serverreload: true
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
        /**
         * Generate documentation from JS comments using JSDoc3
         * @see {@link https://github.com/krampstudio/grunt-jsdoc}
        **/
        jsdoc : {
            app: {
                src: ['<%%= folders.app %>/<%%= files.scripts %>', '!<%%= folders.app %>/templates.js'],
                dest: '<%%= folders.reports %>/<%%= folders.docs %>',
                options: {
                    readme: 'README.md'
                }
            }
        },
        /**
         * Lint project JSON files
         * @see {@link https://github.com/brandonramirez/grunt-jsonlint}
        **/
        jsonlint: {
            project: {src: ['./*.json', '<%%= files.config.csslint %>']}
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
        /**
         * Open files in browsers for review
         * @see {@link https://github.com/jsoverson/grunt-open}
        **/
        open: {
            browser: {
                path: 'http://localhost:<%%= ports.server %>/<%%= folders.app %>'
            },
            demo: {
                path: 'http://localhost:<%%= ports.server %>/<%%= folders.dist %>/<%%= folders.client %>'
            },
            coverage: {
                path: __dirname + '/<%%= folders.reports %>/<%%= folders.coverage %>/report-html/index.html'
            },
            plato: {
                path: __dirname + '/<%%= folders.reports %>/plato/index.html'
            }
        },

        /**
         * Generate persistent static analysis reports with plato
         * @see {@link https://github.com/jsoverson/grunt-plato}
        **/
        plato: {
            app: {
                src: ['<%%= folders.app %>/<%%= files.scripts %>', '!<%%= folders.app %>/templates.js'],
                dest: '<%%= folders.reports %>/plato',
                options: {
                    eslint: require(config.files.config.eslint)
                }
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
            eslint: {
                files: '<%%= folders.app %>/<%%= files.scripts %>',
                tasks: ['eslint:ing'],
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
                    '<%%= folders.app %>/<%%= files.index %>',//index.html
                    '<%%= folders.app %>/<%%= files.scripts %>',//Scripts
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
    grunt.registerTask('eslinting', 'Watch task for real-time linting with ESLint', [
        'eslint:ing',
        'watch:eslint'
    ]);
};
