module.exports = function(grunt) {
    'use strict';
    grunt.registerTask('serve', 'Start a live-reload enabled browser (no tests)',
        [
            'compile',
            'express',
            'open:browser',
            'watch:browser'
        ]);
    grunt.registerTask('lint', 'Lint JSON, CSS, and JS code',
        [
            'jsonlint',
            'htmlhintplus',
            'csslint',
            'jshint:app',
            'jscs:app'<% if (props.useA11y) { %>,
            'buddyjs'<% } %>
        ]);
    grunt.registerTask('linting', 'Watch task for real-time linting',
        [
            'lint',
            'watch:lint'
        ]);
    grunt.registerTask('styling', 'Watch task styling your app',
        [
            'transpile-styles',
            'csslint',
            'watch:style'
        ]);
    grunt.registerTask('jshinting', 'Watch task for real-time linting with JSHint',
        [
            'jshint:app',
            'watch:jshint'
        ]);
    grunt.registerTask('jscsing', 'Watch task for real-time linting with JSCS',
        [
            'jscs:ing',
            'watch:jscs'
        ]);<% if (props.useA11y) { %>
    grunt.registerTask('aria', 'Perform an accessibility audit on your code',
        [
            'accessibility',
            'a11y'
        ]);<% } %><% if (props.useJsinspect) { %>
    grunt.registerTask('inspect', 'Detect copy-pasted and structurally similar code',
        [
            'jsinspect:app'
        ]);<% } %>
};
