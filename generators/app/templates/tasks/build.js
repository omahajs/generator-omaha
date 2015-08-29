module.exports = function(grunt) {
    'use strict';

    //Build Tasks
    grunt.registerTask('compile', [
        'clean:compile',
        'less:main',
        'handlebars:compile'
    ]);
    grunt.registerTask('build', [
        'clean:build',
        'compile',
        'requirejs:build',
        'uglify:build',
        'htmlmin',
        'imagemin:build',
        'copy:build'
    ]);
    grunt.registerTask('demo', [
        'build',
        'open:demo',
        'express:demo'
    ]);
};