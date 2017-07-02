/**
 * @file Example controller module using Marionette
 * @author <%= userName %>
 * @module controllers/example
 */
define(function(require, exports, module) {
    'use strict';

    const Mn = require('backbone.marionette');

    /**
     * @name ExampleController
     * @description Example controller
     * @constructor
     * @extends Marionette.Object
    **/
    let ExampleController = Mn.Object.extend({
        //controller code goes here
    });

    module.exports = ExampleController;
});
