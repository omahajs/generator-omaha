/**
 * @file Main entry point for application
 * @author <%= userName %>
 * @requires app
 * @requires router
 * @requires views/example
**/
define(function(require) {
    'use strict';

    const Backbone = require('backbone');
    const WebApp   = require('app');
    const Example  = require('router');
    const View     = require('views/example');

    let name = WebApp.getState('name');

    WebApp.on('before:start', () => {
        WebApp.info(name + ' is starting...');
        WebApp.router = new Example.Router();
    });
    WebApp.on('start', () => {
        Backbone.history.start();
        WebApp.info(name + ' is started!');
        WebApp.getRegion().show(new View());
    });
    if (typeof(define) === 'undefined') {
        //Not AMD ==> Bundled with Browserify
        document.addEventListener('DOMContentLoaded', () => WebApp.start());
    } else {
        //AMD == > Bundled with r.js
        WebApp.start();
    }
});
