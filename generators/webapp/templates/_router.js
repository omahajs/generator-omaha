/**
 * @file Application Router and Controller
 * @author <%= userName %>
 * @module router
**/
define(function(require, exports) {
    'use strict';

    var Marionette = require('backbone.marionette');

    /**
     * @name RouterController
     * @constructor
     * @extends Marionette.Object
     * @prop {function} foo Example callback function to be called by ExampleAppRouter
     */
    var RouterController = Marionette.Object.extend({
        foo: function() {
            console.log('bar');
        }
    });
    /**
     * @name ExampleAppRouter
     * @description Example application router
     * @constructor
     * @extends Marionette.AppRouter
     * @prop {object} appRoutes
     * @prop {string} appRoutes.foo
    **/
    var ExampleAppRouter = Marionette.AppRouter.extend({
        appRoutes: {
            'foo': 'foo'
        },
        controller: new RouterController()
    });

    exports.controller = RouterController;
    exports.router     = ExampleAppRouter;
});
