var config = require('config').grunt;//Load external parameters using config node module
module.exports = function(grunt) {
    'use strict';
    grunt.initConfig({
        package: grunt.file.readJSON('package.json'),
        ports:   config.ports,
        folders: config.folders,
        files:   config.files,
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
            build:    ['<%%= folders.web %>/<%%= folders.client %>', '<%%= folders.web %>/<%%= folders.assets %>'],
            plain:    ['vault/*', '!vault/*<%%= encryptedExtension %>', '!vault/README.md'],
            cipher:   ['vault/*<%%= encryptedExtension %>']
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
            build: {
                files: [{
                    expand: true,
                    src: ['<%%= folders.assets %>/<%%= files.fonts %>'<% if(!props.compressImages) { %>, '<%%= folders.assets %>/<%%= files.images %>'<% } %>],
                    dest: '<%%= folders.web %>/',
                    filter: 'isFile'
                }]
            }
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
                    port:       '<%%= ports.default %>',
                    hostname:   '0.0.0.0',
                    livereload: '<%%= ports.livereload %>'
                }
            },
            demo: {
                options: {
                    bases: [__dirname],
                    port:       '<%%= ports.default %>',
                    hostname:   '0.0.0.0',
                    serverreload: true
                }
            }
        },

        /**
         * Pre-compile Handlebars templates
         * @see {@link https://github.com/gruntjs/grunt-contrib-handlebars}
         **/
        handlebars: {
            compile: {
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
         * Minimize index.html for deployment
         * @see {@link hhttps://github.com/gruntjs/grunt-contrib-htmlmin}
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
                        dest: '<%%= folders.web %>/<%%= folders.client %>/<%%= files.index %>'
                    }
                ]
            }
        },

        /**
         * Optimize image assets for deployment using imagemin
         * @see {@link https://github.com/gruntjs/grunt-contrib-imagemin}
         **/
        imagemin: {
            build: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: ['<%%= folders.assets %>/<%%= files.images %>'],
                    dest: '<%%= folders.web %>/'
                }]
            }
        },

        /**
         * Run Jasmine specs with RequireJS template
         * @see {@link https://github.com/gruntjs/grunt-contrib-jasmine}
         * @see {@link https://github.com/cloudchen/grunt-template-jasmine-requirejs}
         **/
        jasmine: {
            main: {
                src: ['<%%= folders.app %>/<%%= files.scripts %>', '!<%%= folders.app %>/<%%= files.scriptMain %>'],
                options: {
                    specs: ['<%%= folders.tests %>/<%%= folders.specs %>/<%%= files.scripts %>'],
                    keepRunner: false,
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfigFile: '<%%= folders.app %>/<%%= files.configScript %>',
                        requireConfig: {
                            baseUrl: '<%%= folders.app %>'
                        }
                    }
                }
            }
        },

        /**
         * Lint JavaScript code with JSCS (focus on code style)
         * @see {@link https://github.com/jscs-dev/grunt-jscs}
         **/
        jscs: {
            options: {
                force: true,
                reporter: 'console',//checkstyle, inline, console, text
                reporterOutput: null
            },
            app: {
                options: {
                    config: '<%%= files.config.jscs %>',
                    fix: <%= autoFix %>
                },
                files: {src: ['<%%= folders.app %>/<%%= files.scripts %>', '!<%%= folders.app %>/templates.js']}
            },
            comments: {
                options: {config: '<%%= files.config.jsdoc %>'},
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
                autoWatch: false
            },
            covering: {
                autoWatch: true,
                singleRun: false
            }
        },

        /**
         * Transpile LESS to CSS (with autoprefixed and minimized output)
         * @see {@link https://github.com/gruntjs/grunt-contrib-less}
         **/
        less: {
            main: {
                options: {
                    paths: ['<%%= folders.assets %>/<%%= files.styles %>'],
                    compress: false,
                    plugins: [
                        new (require('less-plugin-clean-css'))({advanced: true}),
                        new (require('less-plugin-autoprefix'))({browsers: ['last 2 versions']})
                    ]
                },
                files: {
                    '<%%= folders.app %>/style.css':         '<%%= folders.assets %>/less/style.less',
                    '<%%= folders.web %>/<%%= folders.client %>/style.css': '<%%= folders.assets %>/less/style.less'
                }
            }
        },

        /**
         * Open files in browsers for review
         * @see {@link https://github.com/jsoverson/grunt-open}
         **/
        open: {
            browser: {
                path: 'http://localhost:<%%= ports.default %>/<%%= folders.app %>'
            },
            demo: {
                path: 'http://localhost:<%%= ports.default %>/<%%= folders.web %>/<%%= folders.client %>'
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
         * Generate static analysis reports with plato
         * @see {@link https://github.com/jsoverson/grunt-plato}
         **/
        plato: {
            app : {
                src : '<%%= folders.app %>/<%%= files.scripts %>',
                dest : '<%%= folders.reports %>/plato',
                options : {
                    jshint : '<%%= files.config.jshint %>'
                }
            }
        },

        /**
         * Optimize JS code into single file using r.js
         * @see {@link https://github.com/gruntjs/grunt-contrib-requirejs}
         * @see (@link https://github.com/jrburke/r.js/blob/master/build/example.build.js}
         **/
        requirejs: {
            build: {
                options: {
                    out: '<%%= folders.web %>/<%%= folders.client %>/<%%= files.configScript %>',
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
                                      '2015-11-04 */'
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
                tasks: ['less:main', 'csslint'],
                options: {spawn: false}
            },
            jshint: {
                files: '<%%= folders.app %>/<%%= files.scripts %>',
                tasks: ['jshint:app'],
                options: {spawn: false}
            },
            jscs: {
                files: '<%%= folders.app %>/<%%= files.scripts %>',
                tasks: ['jscs:app'],
                options: {spawn: false}
            },
            lint: {
                files: [
                    '<%%= folders.assets %>/<%%= files.styles %>',//Styles
                    '<%%= folders.app %>/<%%= files.scripts %>'   //Scripts
                ],
                tasks: ['less:main', 'csslint', 'jshint:app', 'jscs:app'],
                options: {spawn: false}
            },
            review: {
                files: [
                    '<%%= folders.app %>/<%%= files.index %>',      //index.html
                    '<%%= folders.assets %>/<%%= files.styles %>',  //Styles
                    '<%%= folders.app %>/<%%= files.scripts %>',    //Scripts
                    '<%%= folders.assets %>/<%%= files.templates %>'//Templates
                ],
                tasks: ['compile', 'jshint:app', 'jscs:app', 'jasmine:main', 'karma:watch:run'],
                options: {
                    livereload: '<%%= ports.livereload %>',
                    spawn: false
                }
            },
            browser: {
                files: [
                    '<%%= folders.app %>/<%%= files.index %>',      //index.html
                    '<%%= folders.assets %>/<%%= files.styles %>',  //Styles
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
    require('time-grunt')(grunt);             //Display execution times for tasks in console
    require('load-grunt-tasks')(grunt);       //Plugin for loading external task files
    grunt.loadTasks(config.folders.tasks); //Load external task files
    grunt.registerTask('default',             //Set default Grunt task
        ['quick-review']
    );
};
