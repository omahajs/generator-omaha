'use strict';
var uuid = require('node-uuid');

module.exports = {
    grunt: {
        ports: {
            default:    1337,
            karma:      4669,
            livereload: 46692
        },
        folders: {
            web:      'web',//TODO: add app dir
            client:   'client',//TODO: add app dir
            app:      'app',//TODO: add app dir
            config:   'config',
            assets:   'assets',//TODO: add app dir
            tasks:    'tasks',//TODO: add app dir
            tests:    'tests',//TODO: add app dir
            specs:    'jasmine/specs',
            coverage: 'coverage',
            reports:  'reports',
            docs:     'docs'
        },
        files: {
            config: {
                jshint:  './config/.jshintrc',
                jscs:    './config/.jscsrc',
                jsdoc:   './config/.jscsrc-jsdoc',
                csslint: './config/.csslintrc',
                karma:   './config/karma.conf.js'
            },
            index:        'index.html',
            styles:       'less/**/*.less',
            scripts:      '**/*.js',
            mainScript:   'main.js',
            configScript: 'config.js',
            models:       'models/**/*.js',
            views:        'views/**/*.js',
            controllers:  'controllers/**/*.js',
            fonts:        'fonts/*.{ttf,woff,eot,svg}',
            images:       'images/**/*.{png,jpg,gif,svg}',
            templates:    'templates/**/*.hbs'
        }
    }
};
