/**
 * @file Example MarionetteJS View module
 * @author <%= userName %>
 * @module views/example
 * @requires models/example
**/
define(function(require, exports, module) {
    'use strict';

    var Marionette = require('backbone.marionette');
    var JST        = require('templates');
    var Example    = require('models/example');

    /**
     * @name ExampleView
     * @description Example view
     * @constructor
     * @extends Marionette.View
    **/
    var ExampleView = Marionette.View.extend({
        //view code goes here
        template: JST.example,
        model: new Example.Model()
    });

    module.exports = ExampleView;
});
