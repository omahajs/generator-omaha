/**
 * @file Application Router and Controller
 * @author <%= userName %>
 * @module router
**/
define(function(require, exports) {
    'use strict';

    const Mn = require('backbone.marionette');

    /**
     * @name RouterController
     * @constructor
     * @extends Marionette.Object
     * @prop {function} foo Example callback function to be called by ExampleAppRouter
    **/
    const RouterController = Mn.Object.extend({
        foo: function() {
            //code to be executed for 'foo' route
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
    const ExampleAppRouter = Mn.AppRouter.extend({
        appRoutes: {
            foo: 'foo'
        },
        controller: new RouterController()
    });

    exports.Controller = RouterController;
    exports.Router = ExampleAppRouter;
});
