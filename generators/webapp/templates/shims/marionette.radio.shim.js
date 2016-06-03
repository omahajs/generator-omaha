/**
 * This shim overrides Backbone.Wreqr with Backbone.Radio
 * (only required for MarionetteJS 2.4 and below)
**/
define(function(require) {
    'use strict';

    var _          = require('underscore');
    var Radio      = require('backbone.radio');
    var Marionette = require('backbone.marionette');

    Marionette.Application.prototype._initChannel = function() {
        this.channelName =  _.result(this, 'channelName') || 'global';
        this.channel     =  _.result(this, 'channel') || Radio.channel(this.channelName);
    };
});
