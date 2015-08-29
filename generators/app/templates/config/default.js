'use strict';
var uuid = require('node-uuid');

module.exports = {
    grunt: {
        encryptedExtension: '.protected',
        ports: {
            default:    1337,
            karma:      4669,
            livereload: 46692
        },
        folders: {
            web:         'web',
            app:         'app',
            assets:      'assets',
            tasks:       'tasks',
            tests:       'tests',
            config:      'config',
            buildClient: 'web/client',
            buildAssets: 'web/assets'
        },
        files: {
            config: {
                jshint:  './config/.jshintrc',
                jscs:    './config/.jscsrc',
                jsdoc:   './config/.jscsrc-jsdoc',
                csslint: './config/.csslintrc',
                karma:   './config/karma.conf.js'
            },
            all: [
                './app/**/*.html',               //HTML
                './app/**/*.js',                 //JS
                './assets/css/**/*.css',         //CSS
                './assets/less/**/*.less',       //LESS
                './assets/templates/**/*.hbs',   //Handlebars Templates
                './assets/templates/data/*.json',//JSON Template Data
                './tests/**/*.js',               //Tests
                '!./tests/coverage/**/*'         //Exclude coverage files
            ],
            app: [
                './app/**/*.html',               //HTML
                './app/**/*.js',                 //JS
                './assets/css/**/*.css',         //CSS
                './assets/less/**/*.less',       //LESS
                './assets/templates/**/*.hbs',   //Handlebars Templates
                './assets/templates/data/*.json' //JSON Template Data
            ],
            index:       'index.html',
            models:      'models/**/*.js',
            views:       'views/**/*.js',
            controllers: 'controllers/**/*.js',
            scripts:     '**/*.js',
            images:      'assets/images/**/*.{png,jpg,gif,svg}',
            fonts:       'assets/fonts',
            less:        'assets/less/**/*.less',
            jsMain:      'main.js',
            jsConfig:    'config.js',
            lessMain:    'style.less',
            cssMain:     'style.css',
            styles:      'app/style.css',
            templates:   'assets/templates/**/*.hbs'
        }
    },
    execMap: {
        py: 'python',
        rb: 'ruby'
    },
    session: {
        secret: uuid.v1(),
        resave: false,
        saveUninitialized: false
    },
    websocket: {
        port: 13337
    },
    http: {
        port: process.env.PORT || 3000
    },
    log: {
        level: "error"
    },
    csp: {
        'default-src': '\'self\'',
        'script-src':  '\'self\' https://cdnjs.cloudflare.com'
    }
};