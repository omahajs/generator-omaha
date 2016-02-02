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
        //Dependencies
        jquery:     '<% if (appDir !== './') { %>../<% } %>../node_modules/jquery/dist/jquery',
        underscore: '<% if (appDir !== './') { %>../<% } %>../node_modules/underscore/underscore',
        backbone:   '<% if (appDir !== './') { %>../<% } %>../node_modules/backbone/backbone',
        radio:      '<% if (appDir !== './') { %>../<% } %>../node_modules/backbone.radio/build/backbone.radio',
        marionette: '<% if (appDir !== './') { %>../<% } %>../node_modules/backbone.marionette/lib/backbone.marionette',
        handlebars: '<% if (appDir !== './') { %>../<% } %>../node_modules/handlebars/dist/handlebars',
        //Helpers and extensions
        'handlebars.helpers': './helpers/handlebars.helpers',
        'jquery.extensions':  './helpers/jquery.extensions',
        'underscore.mixins':  './helpers/underscore.mixins',
        //Spies, Stubs, and fake servers (Jasmine is loaded by Karma plugin)
        sinon: '<% if (appDir !== './') { %>../<% } %>../node_modules/sinon/pkg/sinon'
    }
});
