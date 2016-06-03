module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('test', 'Run full test and validation battery', [
        'compile',
        'lint',
        'cover'
    ]);
    grunt.registerTask('test-ci', 'Run tests on continuous integration server', [
        'test'<% if (use.coveralls) { %>,
        'coveralls'<% } %>
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
