module.exports = function(grunt) {
    'use strict';

    //Test Tasks
    grunt.registerTask('test', 'Run full test and validation battery',
        [
            'handlebars:compile',
            'lint',
            'jasmine:main',
            'karma:coverage'
        ]);
    grunt.registerTask('test-ci', 'Run tests on continuous integration server',
        [
            'compile',
            'lint',
            'jasmine:main',
            'karma:coverage'<% if (props.useCoveralls) { %>,
            'coveralls'<% } %>
        ]);
    grunt.registerTask('cover', 'Generate code coverage report using Karma and Istanbul',
        [
            'clean:coverage',
            'clean:compile',
            'handlebars:compile',
            'karma:coverage'
        ]);
    grunt.registerTask('covering', 'Watch task to write tests and see code coverage in real-time',
        [
            'clean:coverage',
            'clean:compile',
            'handlebars:compile',
            'karma:covering'
        ]);
    grunt.registerTask('testing', ['lint', 'karma:covering']);
};
