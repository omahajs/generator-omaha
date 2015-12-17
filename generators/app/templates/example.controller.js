/**
 * @file Example controller module using Marionette
 * @author <%= userName %>
 * @module controllers/Example
 * @extends Marionette.Object
 */
define(function(require, exports, module) {
    'use strict';

    var Marionette = require('marionette');
    /**
     * @name ExampleController
     * @constructor
     * @extends Marionette.Object
    **/
    var ExampleController = Marionette.Object.extend({
        //controller code goes here
    });
    module.exports = ExampleController;
});
