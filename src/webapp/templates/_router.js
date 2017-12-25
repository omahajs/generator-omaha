/**
 * @file Application Router and Controller
 * @author <%= userName %>
 * @module router
**/<% if (moduleFormat === 'amd') { %>
define(function(require, exports) {<% } %>
    'use strict';

    const Mn = require('backbone.marionette');

    const RouterController = Mn.Object.extend({
        foo: function() {
            //code to be executed for 'foo' route
        }
    });
    const ExampleAppRouter = Mn.AppRouter.extend({
        appRoutes: {
            foo: 'foo'
        },
        controller: new RouterController()
    });

    exports.Controller = RouterController;
    exports.Router = ExampleAppRouter;<% if (moduleFormat === 'amd') { %>
});<% } %>
