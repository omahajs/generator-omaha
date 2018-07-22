module.exports = function(grunt) {
    'use strict';

    var task =grunt.registerTask;

    // Default Task
    task('serve', 'Start a live-reload enabled browser (no tests)', [
        <% if (moduleFormat === 'amd') { %>'compile'<% } else { %>'build'<% } %>,
        <% if (moduleFormat === 'amd') { %>'browserSync:amd'<% } else { %>'browserSync:cjs'<% } %>,
        'watch:browser'
    ]);
    task('styling', 'Watch task for real-time styling', [
        'process-styles',
        'watch:style'
    ]);
    task('test', 'Run full test and validation battery', [
        'compile',
        'lint',
        'cover'
    ]);<% if (useJest !== true) { %>
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
    ]);<% } %>
    task('precompile-templates', [
        <% if (useHandlebars) { %>'handlebars:main'<% } else { %>'jst:main'<% } %>
    ]);
    task('process-styles', [<% if (useLess) { %>
        'less:main',/* pre-process */<% } %><% if (useSass) { %>
        'sass:main',/* pre-process */<% } %>
        'postcss:dev',/* post-process */
        'postcss:prod'
    ]);<% if (moduleFormat !== 'amd') { %>
    task('bundle-scripts', [<% if (useBrowserify) { %>
        'browserify:bundle'<% } %><% if (useWebpack) { %>
        'webpack:bundle'<% } %><% if (isNative) { %>,
        'htmlmin',
        'copy',
        'replace:bundle-url'<% } %>
    ]);<% } %>
    task('compile', [
        'clean:compile',
        'process-styles',
        'precompile-templates'<% if (moduleFormat !== 'amd') { %>,
        'bundle-scripts'<% } %>
    ]);
    task('build', [
        'clean:build',
        'compile',<% if (moduleFormat === 'amd') { %>
        'requirejs:bundle',<% } else { %>
        'uglify:bundle',<% } %>
        'htmlmin',
        'copy:fonts',
        'copy:library',
        'copy:workers',
        'copy:wasm',
        <% if (moduleFormat !== 'amd') { %>'replace:bundle-url',<% } else { %>'replace:almond-shim',<% } %>
        <% if (useImagemin) { %>'imagemin:build'<% } else { %>'copy:images'<% } %>
    ]);
    task('docs', 'Generate documentation with JSDoc3 and styleguide with mdcss', [
        'clean:docs',
        'jsdoc:app',<% if (useLess) { %>
        'less:main',/* pre-process */<% } %><% if (useSass) { %>
        'sass:main',/* pre-process */<% } %>
        'postcss:styleguide'
    ]);
};
