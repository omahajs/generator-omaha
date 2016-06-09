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
    ]);<% if (use.a11y) { %>
    grunt.registerTask('aria', 'Perform an accessibility audit on your code', [
        'accessibility',
        'a11y'
    ]);<% } %>
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
};
