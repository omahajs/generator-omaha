module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('eslinting', 'Watch task for real-time linting with ESLint', [
        'eslint:ing',
        'watch:eslint'
    ]);
};
