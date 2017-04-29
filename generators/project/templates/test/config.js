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
    baseUrl: '/base/<%= sourceDirectory %>app',
    deps: tests,
    paths: {
        //Project Dependencies
        handlebars: '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/handlebars/dist/handlebars',
        //Backbone Libraries, Frameworks and Dependencies
        jquery:                '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/jquery/dist/jquery',
        underscore:            '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/underscore/underscore',
        lodash:                '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/lodash/lodash.min',
        'backbone':            '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/backbone/backbone',
        'backbone.radio':      '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/backbone.radio/build/backbone.radio',
        'backbone.marionette': '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/backbone.marionette/lib/backbone.marionette',
        //Helpers and extensions
        'handlebars.helpers': './helpers/handlebars.helpers',
        'jquery.extensions':  './helpers/jquery.extensions',
        'underscore.mixins':  './helpers/underscore.mixins',
        // Testing dependencies (Mocha is loaded by Karma plugin)
        sinon: '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/sinon/pkg/sinon',
        chai:  '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/chai/chai'
    },
    map: {
        '*': {
            underscore: 'lodash'
        }
    },
    // start test run, once Require.js is done
    callback: window.__karma__.start
});
