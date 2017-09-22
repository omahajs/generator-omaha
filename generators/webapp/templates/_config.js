/* global requirejs */
/**
 * @file RequireJS configuration file
 * @author <%= userName %>
**/
requirejs.config({
    baseUrl: '',
    //urlArgs is used to cache bust.
    //development should use timestamp, production should use version
    urlArgs: 'bust=' + (new Date()).getTime(),
    deps: ['main'],
    paths: {
        // Project Dependencies
        handlebars: '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/handlebars/dist/handlebars',
        // Backbone Libraries, Frameworks and Dependencies
        jquery:                '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/jquery/dist/jquery',
        lodash:                '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/lodash/lodash.min',
        redux:                 '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/redux/dist/redux.min',
        morphdom:              '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/morphdom/dist/morphdom-umd.min',
        backbone:              '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/backbone/backbone',
        'backbone.radio':      '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/backbone.radio/build/backbone.radio',
        'backbone.marionette': '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/backbone.marionette/lib/backbone.marionette',
        // Helpers and extensions
        'handlebars.helpers': './helpers/handlebars.helpers',
        'jquery.extensions':  './helpers/jquery.extensions',
        // Testing dependencies (Mocha is loaded by Karma plugin)
        sinon: '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/sinon/pkg/sinon',
        chai:  '<% if (sourceDirectory !== './') { %>../<% } %>../node_modules/chai/chai'
    },
    map: {
        '*': {
            underscore: 'lodash'
        }
    }
});
