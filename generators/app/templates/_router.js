/**
 * @file Application Router and Controller
 * @author Jason Wohlgemuth
 * @module router
**/
define(function(require, exports, module) {
    'use strict';

    var Marionette = require('marionette');

    /**
     * @name RouterController
     * @constructor
     * @extends Marionette.Object
     */
    var RouterController = Marionette.Object.extend({
        foo: function() {
            console.log('bar');
        }
    });
    module.exports = Marionette.AppRouter.extend({
        appRoutes: {
            'foo': 'foo'
        },
        controller: new RouterController()
    });
});