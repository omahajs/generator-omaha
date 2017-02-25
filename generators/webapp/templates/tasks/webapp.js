module.exports = function(grunt) {
    'use strict';

    var task =grunt.registerTask;

    // Default Task
    task('serve', 'Start a live-reload enabled browser (no tests)', [
        'compile',
        'express:main',
        'open:browser',
        'watch:browser'
    ]);
    task('lint', 'Lint JSON, CSS, and JS code', [
        'jsonlint',
        'htmlhintplus',
        'csslint',
        'eslint:src'
    ]);
    task('linting', 'Watch task for real-time linting', [
        'lint',
        'watch:lint'
    ]);
    task('styling', 'Watch task for real-time styling', [
        'process-styles',
        'csslint',
        'watch:style'
    ]);
    task('test', 'Run full test and validation battery', [
        'compile',
        'lint',
        'cover'
    ]);
    task('cover', 'Generate code coverage report using Karma and Istanbul', [
        'clean:coverage',
        'clean:compile',
        'precompile-templates',
        'karma:coverage'
    ]);
    task('covering', 'Watch task to write tests and see code coverage in real-time', [
        'clean:coverage',
        'clean:compile',
        'precompile-templates',
        'karma:covering'
    ]);
    task('precompile-templates', [
        <% if (useHandlebars) { %>'handlebars:main'<% } else { %>'jst:main'<% } %>
    ]);
    task('process-styles', [<% if (useLess) { %>
        'less:main', /* pre-process */<% } %><% if (useSass) { %>
        'sass:main', /* pre-process */<% } %>
        'postcss:dev', /* post-process */
        'postcss:prod'
    ]);
    task('bundle-scripts', [<% if (useBrowserify) { %>
        'browserify:bundle',
        'uglify:bundle'<% } else { %>
        'requirejs:bundle'<% } %>
    ]);
    task('compile', [
        'clean:compile',
        'process-styles',
        'precompile-templates'
    ]);
    task('build', [
        'clean:build',
        'compile',
        'bundle-scripts',
        'htmlmin',
        'copy:fonts',
        <% if (useBrowserify) { %>'replace:bundle-url',<% } else { %>'copy:library',<% } %>
        <% if (useImagemin) { %>'imagemin:build'<% } else { %>'copy:images'<% } %>
    ]);
    task('docs', 'Generate documentation with JSDoc3 and styleguide with mdcss', [
        'clean:docs',
        'jsdoc:app',<% if (useLess) { %>
        'less:main',/* pre-process */<% } %><% if (useSass) { %>
        'sass:main',/* pre-process */<% } %>
        'postcss:styleguide'
    ]);
    task('reports', 'Generate code coverage and plato report - then open both in browser', [
        'plato',
        'cover',
        'open:plato',
        'open:coverage'
    ]);
};
