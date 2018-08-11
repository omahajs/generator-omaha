module.exports = function(grunt) {
    'use strict';

    var task = grunt.registerTask;

    // Default Task
    task('serve', 'Start a live-reload enabled browser (no tests)', [
        <% if (moduleFormat === 'amd') { %>'compile'<% } else { %>'build'<% } %>,
        <% if (moduleFormat === 'amd') { %>'browserSync:amd'<% } else { %>'browserSync:cjs'<% } %>,
        'watch:browser'
    ]);
    task('precompile-templates', [
        <% if (useHandlebars) { %>'handlebars:main'<% } else { %>'jst:main'<% } %>
    ]);
    task('preprocess-styles', [<% if (useLess) { %>
        'less:main',/* pre-process */<% } %><% if (useSass) { %>
        'sass:main'/* pre-process */<% } %>
    ]);
    task('process-styles', [
        'preprocess-styles',
        'postcss:dev',/* post-process */
        'postcss:prod'/* post-process */
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
    task('styleguide', 'Generate styleguide with mdcss', [
        'preprocess-styles',
        'postcss:styleguide'
    ]);
};
