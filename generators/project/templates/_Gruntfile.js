const {join} = require('path');
const config = require('config').grunt;

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
        }
    });
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    /* -- load tasks placeholder -- */
};
