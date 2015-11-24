// WARNING: Order matters!
var config = require('config').get('grunt');
module.exports = function(karmaConfig) {
    karmaConfig.set({
        basePath: '../',
        frameworks: [ 'requirejs', 'jasmine'],// WARNING: Order matters!
        files: [// WARNING: Order matters! (I think)
            {pattern: config.folders.app + '/**/*.js',                               included: false},//app source
            {pattern: config.folders.assets + '/templates/**/*.hbs',                 included: false},//templates
            {pattern: 'tests/jasmine/specs/**/*.js',                                 included: false},//Jasmine Specs
            {pattern: 'tests/data/modules/*.js',                                     included: false},//Data modules
            {pattern: 'node_modules/sinon/pkg/sinon.js',                             included: false},//SinonJS
            {pattern: 'node_modules/jquery/dist/jquery.js',                          included: false},//jQuery
            {pattern: 'node_modules/handlebars/dist/handlebars.js',                  included: false},//Handlebars
            {pattern: 'node_modules/underscore/underscore.js',                       included: false},//Underscore
            {pattern: 'node_modules/backbone/backbone.js',                           included: false},//Backbone
            {pattern: 'node_modules/backbone.radio/build/backbone.radio.js',         included: false},//Backbone.Radio
            {pattern: 'node_modules/backbone.marionette/lib/backbone.marionette.js', included: false},//Marionette
            'tests/test-main.js'
        ],
        exclude: [config.folders.app + '/config.js'],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            'app/**/*.js': ['coverage']
        },
        coverageReporter: {
            dir: config.folders.reports + '/' + config.folders.coverage,
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