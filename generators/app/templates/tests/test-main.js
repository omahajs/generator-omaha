var tests = [];
for (var file in window.__karma__.files) {
    // Our test modules are named "<something>Spec.js"
    // If you decide to change the format of the file name this Regex
    // must reflect it.
    if (/\.spec\.js$/.test(file)) {
        tests.push(file);
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base/<%= appDir %>app',
    deps: tests,
    paths: {
        //Dependencies
        jquery:     '../node_modules/jquery/dist/jquery',
        underscore: '../node_modules/underscore/underscore',
        backbone:   '../node_modules/backbone/backbone',
        radio:      '../node_modules/backbone.radio/build/backbone.radio',
        marionette: '../node_modules/backbone.marionette/lib/backbone.marionette',
        handlebars: '../node_modules/handlebars/dist/handlebars',
        //Helpers and extensions
        'handlebars.helpers': './helpers/handlebars.helpers',
        'jquery.extensions':  './helpers/jquery.extensions',
        'underscore.mixins':  './helpers/underscore.mixins',
        //Spies, Stubs, and fake servers (Jasmine is loaded by Karma plugin)
        sinon: '../node_modules/sinon/pkg/sinon'
    },
    // start test run, once Require.js is done
    callback: window.__karma__.start
});
