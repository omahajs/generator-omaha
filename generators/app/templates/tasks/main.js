module.exports = function(grunt) {
    'use strict';
    grunt.registerTask('lint', 'Lint JSON, CSS, and JS code',
        [
            'jsonlint',
            'csslint',
            'jshint:app',
            'jscs:app'<% if (props.useA11y) { %>,
            'buddyjs'<% } %>
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
    grunt.registerTask('review', 'Perform a live review of your app in a live-reload enabled browser',
        [
            'compile',
            'lint',
            'karma:coverage',
            'karma:watch:start',
            'express',
            'open:browser',
            'watch:review'
        ]);
    grunt.registerTask('quick-review', 'Perform a live review of your app in a live-reload enabled browser (no tests)',
        [
            'compile',
            'express',
            'open:browser',
            'watch:browser'
        ]);
    grunt.registerTask('styling', 'Watch task styling your app',
        [
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
            'jscs',
            'watch:jscs'
        ]);
    grunt.registerTask('linting', 'Watch task for real-time linting',
        [
            'lint',
            'watch:lint'
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
