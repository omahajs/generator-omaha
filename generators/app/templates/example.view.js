/**
 * @file Example MarionetteJS ItemView module
 * @author Jason Wohlgemuth
 * @module views/Example
 * @extends Marionette.ItemView
 */
define(function(require, exports, module) {
    'use strict';

    var Marionette = require('marionette');
    var JST = require('templates');

    var Example = require('models/example');

    module.exports = Marionette.ItemView.extend({
        //view code goes here
        template: JST.example,
        model: new Example.model()
    });
});
