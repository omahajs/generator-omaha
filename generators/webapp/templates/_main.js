/**
 * @file Main entry point for application
 * @author <%= userName %>
 * @requires app
 * @requires router
 * @requires views/example
**/
define(function(require) {
    'use strict';

    var Backbone = require('backbone');
    var WebApp   = require('app');
    var Example  = require('router');
    var View     = require('views/example');

    const name = WebApp.getState('name');

    WebApp.on('before:start', function() {
        console.info(name + ' is starting...');
        WebApp.router = new Example.Router();
    });
    WebApp.on('start', function() {
        Backbone.history.start();
        console.info(name + ' is started!');
        WebApp.getRegion().show(new View());
    });
    if (typeof (define) === 'undefined') {
        //Not AMD ==> Bundled with Browserify
        document.addEventListener('DOMContentLoaded', function() {
            WebApp.start();
        });
    } else {
        //AMD == > Bundled with r.js
        WebApp.start();
    }
});
