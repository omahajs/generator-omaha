module.exports = function(grunt) {
    'use strict';

    //Build Tasks
    grunt.registerTask('transpile-styles', [
        'less:main'
    ]);
    grunt.registerTask('precompile-templates', [
        'handlebars:compile'
    ]);
    grunt.registerTask('compile', [
        'clean:compile',
        'transpile-styles',
        'precompile-templates'
    ]);
    grunt.registerTask('build', [
        'clean:build',
        'compile',
        'requirejs:build',
        'htmlmin',<% if(props.compressImages) { %>
        'imagemin:build',<% } %>
        'copy'
    ]);
    grunt.registerTask('demo', 'Build code and open in browser',
        [
            'build',
            'open:demo',
            'express:demo'
        ]);
    grunt.registerTask('docs', 'Generate documentation with JSDoc3',
        [
            'clean:docs',
            'jsdoc:app'
        ]);
    grunt.registerTask('reports', 'Generate code coverage, plato report and documentation - then open all in browser',
        [
            'docs',
            'plato',
            'cover',
            'open:docs',
            'open:coverage',
            'open:plato'
        ]);
};
