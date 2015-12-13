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
        'htmlmin',<% if(props.compressImages) { %>
        'imagemin:build',<% } %>
        'copy'
    ]);
    grunt.registerTask('demo', [
        'build',
        'open:demo',
        'express:demo'
    ]);
};
