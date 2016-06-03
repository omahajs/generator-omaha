module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('process-styles', [<% if (useLess) { %>
        'less:main',/*pre-process */<% } %><% if (useSass) { %>
        'sass:main',/*pre-process */<% } %>
        'postcss'   /*post-process*/
    ]);
    grunt.registerTask('precompile-templates', [
        <% if (useHandlebars) { %>'handlebars:main'<% } else { %>'jst:main'<% } %>
    ]);
    grunt.registerTask('bundle-scripts', [<% if (useBrowserify) { %>
        'browserify:bundle',
        'uglify:bundle'<% } else { %>
        'requirejs:bundle'<% } %>
    ]);
    grunt.registerTask('compile', [
        'clean:compile',
        'process-styles',
        'precompile-templates'
    ]);
    grunt.registerTask('build', [
        'clean:build',
        'compile',
        'bundle-scripts',
        'htmlmin',<% if (useBrowserify) { %>
        'replace:bundle-url',<% } %>
        <% if (use.imagemin) { %>'imagemin:build',<% } else { %>'copy:images',<% } %>
        'copy:fonts'
    ]);
    grunt.registerTask('demo', 'Build code and open in browser', [
        'build',
        'open:demo',
        'express:demo'
    ]);
    grunt.registerTask('docs', 'Generate documentation with JSDoc3 and styleguide with mdcss', [
        'clean:docs',
        'jsdoc:app',<% if (styleguide) { %><% if (useLess) { %>
        'less:main',/*pre-process */<% } %><% if (useSass) { %>
        'sass:main',/*pre-process */<% } %>
        'postcss:styleguide'<% } %>
    ]);
    grunt.registerTask('reports', 'Generate code coverage and plato report - then open both in browser', [
        'plato',
        'cover',
        'open:plato',
        'open:coverage'
    ]);
};
