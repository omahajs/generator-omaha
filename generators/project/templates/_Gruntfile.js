const {join} = require('path');
const config = require('config').grunt;

module.exports = function(grunt) {
    grunt.initConfig({
        package: grunt.file.readJSON('package.json'),
        ports:   config.ports,
        folders: config.folders,
        files:   config.files,
        deployed: {
            assets: config.folders.assets.split('/')[1]
        }
    });
    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    /* -- load tasks placeholder -- */
};
