module.exports = function(grunt) {
    'use strict';

    //Test Tasks
    grunt.registerTask('test', [
        'handlebars:compile',
        'lint',
        'jasmine:main',
        'karma:coverage'
    ]);
    grunt.registerTask('test-ci', [
        'compile',
        'lint',
        'jasmine:main',
        'karma:coverage',
        'coveralls'
    ]);
    grunt.registerTask('cover', [
        'clean:test',
        'clean:compile',
        'handlebars:compile',
        'karma:coverage'
    ]);
    grunt.registerTask('covering', [
        'clean:test',
        'clean:compile',
        'handlebars:compile',
        'karma:covering'
    ]);
    grunt.registerTask('testing', ['lint', 'karma:covering']);
};