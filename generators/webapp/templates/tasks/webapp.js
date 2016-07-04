module.exports = function(grunt) {
    'use strict';

    // Default Task
    grunt.registerTask('serve', 'Start a live-reload enabled browser (no tests)', [
        'compile',
        'express',
        'open:browser',
        'watch:browser'
    ]);
    grunt.registerTask('lint', 'Lint JSON, CSS, and JS code', [
        'jsonlint',
        'htmlhintplus',
        'csslint',
        'eslint:app'
    ]);
    grunt.registerTask('linting', 'Watch task for real-time linting', [
        'lint',
        'watch:lint'
    ]);
    grunt.registerTask('styling', 'Watch task for real-time styling', [
        'process-styles',
        'csslint',
        'watch:style'
    ]);
    grunt.registerTask('test', 'Run full test and validation battery', [
        'compile',
        'lint',
        'cover'
    ]);
    grunt.registerTask('cover', 'Generate code coverage report using Karma and Istanbul', [
        'clean:coverage',
        'clean:compile',
        'precompile-templates',
        'karma:coverage'
    ]);
    grunt.registerTask('covering', 'Watch task to write tests and see code coverage in real-time', [
        'clean:coverage',
        'clean:compile',
        'precompile-templates',
        'karma:covering'
    ]);
    grunt.registerTask('precompile-templates', [
        <% if (useHandlebars) { %>'handlebars:main'<% } else { %>'jst:main'<% } %>
    ]);
    grunt.registerTask('process-styles', [<% if (useLess) { %>
        'less:main',   /*pre-process */<% } %><% if (useSass) { %>
        'sass:main',   /*pre-process */<% } %>
        'postcss:dev', /*post-process*/
        'postcss:prod'
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
        <% if (useImagemin) { %>'imagemin:build',<% } else { %>'copy:images',<% } %>
        'copy:fonts'
    ]);
    grunt.registerTask('docs', 'Generate documentation with JSDoc3 and styleguide with mdcss', [
        'clean:docs',
        'jsdoc:app',<% if (useLess) { %>
        'less:main',/*pre-process */<% } %><% if (useSass) { %>
        'sass:main',/*pre-process */<% } %>
        'postcss:styleguide'
    ]);
    grunt.registerTask('reports', 'Generate code coverage and plato report - then open both in browser', [
        'plato',
        'cover',
        'open:plato',
        'open:coverage'
    ]);
};
