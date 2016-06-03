module.exports = function(grunt) {
    'use strict';

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
    grunt.registerTask('eslinting', 'Watch task for real-time linting with ESLint', [
        'eslint:ing',
        'watch:eslint'
    ]);<% if (use.a11y) { %>
    grunt.registerTask('aria', 'Perform an accessibility audit on your code', [
        'accessibility',
        'a11y'
    ]);<% } %><% if (use.jsinspect) { %>
    grunt.registerTask('inspect', 'Detect copy-pasted and structurally similar code', [
        'jsinspect:app'
    ]);<% } %>
};
