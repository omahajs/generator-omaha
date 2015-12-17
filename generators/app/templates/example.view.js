/**
 * @file Example MarionetteJS ItemView module
 * @author <%= userName %>
 * @module views/example
 * @requires models/example
 */
define(function(require, exports, module) {
    'use strict';

    var Marionette = require('marionette');
    var JST        = require('templates');
    var Example    = require('models/example');

    /**
     * @name ExampleView
     * @description Example view
     * @constructor
     * @extends Marionette.ItemView
    **/
    var ExampleView = Marionette.ItemView.extend({
        //view code goes here
        template: JST.example,
        model: new Example.model()
    });

    module.exports = ExampleView;
});
