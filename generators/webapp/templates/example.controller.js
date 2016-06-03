/**
 * @file Example controller module using Marionette
 * @author <%= userName %>
 * @module controllers/example
 */
define(function(require, exports, module) {
    'use strict';

    var Marionette = require('backbone.marionette');

    /**
     * @name ExampleController
     * @description Example controller
     * @constructor
     * @extends Marionette.Object
    **/
    var ExampleController = Marionette.Object.extend({
        //controller code goes here
    });

    module.exports = ExampleController;
});
