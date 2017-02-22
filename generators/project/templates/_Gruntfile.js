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
            },
            library: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['<%%= folders.assets %>/library/*.js'],
                    dest: '<%%= folders.dist %>/<%%= deployed.assets %>/library',
                    filter: 'isFile'
                }]
            },
            images: {
                files: [{
                    expand: true,
                    flatten: false,
                    src: ['<%%= folders.assets %>/<%%= files.images %>'],
                    dest: '<%%= folders.dist %>',
                    filter: 'isFile'
                }]
            }
        }
    });
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    /* -- load tasks placeholder -- */
};
