// WARNING: Order matters!
module.exports = function(config) {
    config.set({
        basePath: '../',
        frameworks: [ 'requirejs', 'jasmine'],// WARNING: Order matters!
        files: [// WARNING: Order matters! (I think)
            {pattern: 'app/**/*.js',                     included: false},//app source
            {pattern: 'assets/templates/**/*.hbs',       included: false},//templates
            {pattern: 'assets/library/**/*.js',          included: false},//Dependencies
            {pattern: 'tests/jasmine/specs/**/*.js',     included: false},//Jasmine Specs
            {pattern: 'tests/data/modules/*.js',         included: false},//Data modules
            {pattern: 'node_modules/sinon/pkg/sinon.js', included: false},//SinonJS (global scope)
            'tests/test-main.js'
        ],
        exclude: ['app/config.js'],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            'app/**/*.js': ['coverage']
        },
        coverageReporter: {
            dir: 'tests/coverage/',
            includeAllSources: true,
            reporters: [// WARNING: Order matters! (I think)
                {type: 'text-summary',subdir: '.', file: 'text-summary.txt'},
                {type: 'html', subdir: 'report-html'},
                {type: 'text-summary'},
                {type: 'lcov', subdir: 'report-lcov'},
                {type: 'cobertura', subdir: '.', file: 'report-cobertura.txt'}//Jenkins compatible
            ]
        },
        colors: true,
        logLevel: 'INFO',        //DISABLE, ERROR, WARN, INFO, DEBUG
        browsers: ['PhantomJS'], //Chrome, ChromeCanary, Firefox, Opera, IE (Win), Safari (Mac)
        captureTimeout: 60000,
        singleRun: true
    });
};