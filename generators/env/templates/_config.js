/**
 * @file RequireJS configuration file
 * @author Jason Wohlgemuth
 */
requirejs.config({
    baseUrl: '',
    //urlArgs is used to cache bust.
    //development should use timestamp, production should use version
    urlArgs: 'bust=' + (new Date()).getTime(),
    deps: ['main'],
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
    }
});
