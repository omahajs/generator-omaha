'use strict';

module.exports = {
    /**
     * Accessibility audit with a11y
     * @see {@link https://github.com/lucalanca/grunt-a11y}
    **/
    a11y: `{
        index: {
            options: {urls: ["<%= folders.app %>/<%= files.index %>"]}
        }
    }`,
    /**
     * Accessibility audit with AccessSniff and HTML Codesniffer
     * @see {@link https://github.com/yargalot/grunt-accessibility}
    **/
    accessibility: `{
        index: {
            options: {
                reportLevels: {
                    notice: false,
                    warning: true,
                    error: true
                },
                accessibilityLevel: "WCAG2AAA",
                ignore : [
                    "WCAG2A.Principle2.Guideline2_4.2_4_2.H25.2"
                ]
            },
            src: ["<%= folders.app %>/<%= files.index %>"]
        },
        templates: {
            options: {
                accessibilityLevel: "WCAG2AAA",
                ignore : [
                    //Templates will tend to always violate these rules and need not be reported
                    "WCAG2A.Principle2.Guideline2_4.2_4_2.H25.2",
                    "WCAG2A.Principle2.Guideline2_4.2_4_2.H25.1.NoTitleEl",
                    "WCAG2A.Principle3.Guideline3_1.3_1_1.H57.2"
                ]
            },
            src: ["<%= folders.assets %>/<%= files.templates %>"]
        }
    }`,
    /**
     * Run benchmarks
     * @see {@link https://github.com/shama/grunt-benchmark}
    **/
    benchmark: `{
        options: {
            displayResults: true
        },
        all: {
            src: ["<%= folders.test %>/benchmarks/*.js"],
            dest: "<%= folders.reports %>/benchmarks/results.csv"
        }
    }`,
    /**
     * Use Browserify to bundle scripts
     * @see {@link https://github.com/jmreidy/grunt-browserify}
    **/
    browserify: `{
        bundle: {
            files: {
                "<%= folders.dist %>/<%= folders.client %>/bundle.js": ["<%= folders.app %>/main.js"]
            }
        }
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
                flatten: true,
                src: ["<%= folders.assets %>/<%= files.fonts %>"],
                dest: "<%= folders.dist %>/<%= deployed.assets %>/<%= deployed.fonts %>",
                filter: "isFile"
            }]
        },
        library: {
            files: [{
                expand: true,
                flatten: true,
                src: ["<%= folders.assets %>/library/*.js"],
                dest: "<%= folders.dist %>/<%= deployed.assets %>/library",
                filter: "isFile"
            }]
        }
    }`,
    /**
     * Send coverage report to Coveralls.io
     * @see {@link https://github.com/mattjmorrison/grunt-karma-coveralls}
    **/
    coveralls: `{
        options: {
            // LCOV coverage file relevant to every target
            coverageDir: "<%= folders.reports %>/<%= folders.coverage %>/",
            recursive: true,
            force: true
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
                //"assets/templates/example.hbs" --> "example"
                processName: function(filePath) {
                    return filePath
                        .replace(config.folders.assets, "")
                        .replace(/[/]templates[/]/, "")
                        .replace(/[.]hbs/, "");
                }
            },
            files: {
                "<%= folders.app %>/templates.js": ["<%= folders.assets %>/<%= files.templates %>"]
            }
        }
    }`,
    /**
     * Lint HTML files
     * @see {@link https://github.com/yaniswang/HTMLHint}
    **/
    htmlhintplus: `{
        app: {
            src: [
              "<%= folders.assets %>/<%= files.templates %>",
              "<%= folders.app %>/<%= files.index %>"
            ]
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
                    src:  "<%= folders.app %>/<%= files.index %>",
                    dest: "<%= folders.dist %>/<%= folders.client %>/<%= files.index %>"
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
                cwd: "./",
                src: ["<%= folders.assets %>/<%= files.images %>"],
                dest: "<%= folders.dist %>"
            }]
        }
    }`,
    /**
     * Detect copy-pasted and structurally similar code
     * @see {@link https://github.com/stefanjudis/grunt-jsinspect}
    **/
    jsinspect: `{
        app:         {src: ["<%= folders.app %>/<%= files.scripts %>"]},
        models:      {src: ["<%= folders.app %>/<%= files.models %>"]},
        views:       {src: ["<%= folders.app %>/<%= files.views %>"]},
        controllers: {src: ["<%= folders.app %>/<%= files.controllers %>"]}
    }`,
    /**
     * Pre-compile underscore templates
     * @see {@link https://github.com/gruntjs/grunt-contrib-jst}
    **/
    jst: `{
        main: {
            options: {
                amd: true,
                //Use processName to name the template keys within the compiled templates.js file
                //"assets/templates/example.hbs" --> "example"
                processName: function(filePath) {
                    return filePath
                        .replace(config.folders.assets, "")
                        .replace(/[/]templates[/]/, "")
                        .replace(/[.]hbs/, "");
                },
                templateSettings: {
                    interpolate : /\{\{(.+?)\}\}/g
                }
            },
            files: {
                "<%= folders.app %>/templates.js": ["<%= folders.assets %>/<%= files.templates %>"]
            }
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
                paths: ["<%= folders.assets %>/<%= files.styles %>"]
            },
            files: {
                "<%= folders.app %>/style.css": "<%= folders.assets %>/less/style.less"
            }
        }
    }`,
    /**
     * Apply several post-processors to your CSS using PostCSS
     * @see {@link https://github.com/nDmitry/grunt-postcss}
    **/
    postcss: function(sourceDirectory) {
        return `{
            options: {
                parser: require("postcss-safe-parser"),
                processors: [
                    require("autoprefixer")({browsers: "last 2 versions"}),
                    require("cssnano")()
                ]
            },
            dev: {
                options: {
                    map: {
                        inline: false,
                        annotation: "<%= folders.app %>"
                    }
                },
                src: ["<%= folders.app %>/*.css", "<%= folders.assets %>/css/style.css"],
                dest: "<%= folders.app %>/style.css"
            },
            prod: {
                src:  "<%= folders.app %>/*.css",
                dest: "<%= folders.dist %>/<%= folders.client %>/style.css"
            },
            styleguide: {
                options: {
                    processors: [require("mdcss")({
                        examples: {
                            css: [
                                "../${sourceDirectory}app/style.css",
                                "../${sourceDirectory}assets/css/style.css"
                            ],
                        }
                    })],
                },
                src:  ["<%= folders.app %>/*.css", "<%= folders.assets %>/css/*.css"]
            }
        }`;
    },
    /**
     * Use Applause to replace link to bundled scripts if using browserify
     * @see {@link https://github.com/outaTiME/grunt-replace}
    **/
    replace: `{
        'bundle-url': {
            options: {
                patterns: [{
                    match: /<script.*<\\/script>/g,
                    replacement: '<script src="bundle.min.js"></script>'
                }]
            },
            files: [{
                src:  "<%= folders.dist %>/<%= folders.client %>/<%= files.index %>",
                dest: "<%= folders.dist %>/<%= folders.client %>/<%= files.index %>"
            }]
        }
    }`,
    /**
     * Transpile SCSS to CSS
     * @see {@link https://github.com/gruntjs/grunt-contrib-sass}
    **/
    sass: `{
        main: {
            options: {
                style: "expanded",
                sourcemap: "inline"
            },
            files: {
                "<%= folders.app %>/style.css": "<%= folders.assets %>/sass/style.scss"
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
                mangle: true,
                comments: false,
                compress: {
                    drop_console: true //discard calls to console.* functions
                },
                banner: "/* <%= package.name %> - v<%= package.version %> - 2016-02-07 */"
            },
            files: {
                "<%= folders.dist %>/<%= folders.client %>/bundle.min.js": ["<%= folders.dist %>/<%= folders.client %>/bundle.js"]
            }
        }
    }`
};
