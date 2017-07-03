/**
 * @file Example MarionetteJS View module
 * @author <%= userName %>
 * @module views/example
 * @requires models/example
**/
define(function(require, exports, module) {
    'use strict';

    const Mn      = require('backbone.marionette');
    const JST     = require('templates');
    const Example = require('models/example');

    /**
     * @name ExampleView
     * @description Example view
     * @constructor
     * @extends Marionette.View
    **/
    let ExampleView = Mn.View.extend({
        //view code goes here
        template: JST.example,
        model: new Example.Model()
    });

    module.exports = ExampleView;
});
