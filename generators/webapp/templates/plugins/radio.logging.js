/* eslint strict: 0 */
/* eslint no-console: 0 */
/**
 * @file Logging module that leverages Backbone.Radio
 * @module plugins/logging
 * @example <caption>Extend application object</caption>
 * var logging = require('./plugins/radio.logging');
 * var App = new Marionette.Application();
 * _.extend(App, logging);
 * module.exports = App;
 * @example <caption>Use console message methods with custom stylized output</caption>
 * var App = require('app');
 * App.log('hello world');
 * App.info('hello world');
 * App.warn('hello world');
 * App.error('hello world');
 * @example <caption>Leverage Backbone.Radio to "tune" in and out on channels</caption>
 * var App = require('app');
 * setInterval(function() {
 *    App.radio.channel('test').trigger('log', 'message');
 * }, 1000);
 * App.radio.level('log');   //set logging level
 * App.radio.tuneIn('test'); //no need to create the channel first
 * // See some beautiful log messages in the console
 * App.radio.tuneOut('test'); //messages on test channel will no longer be shown
 * //Note: Remove 'test' channel with App.radio.reset('test')
 * @example <caption>Choose what level gets shown</caption>
 * var App = require('app');
 * App.radio.level('log'); //show all logs
 * App.radio.tuneIn('test'); //no need to create the channel first
 * setInterval(function() {
 *    App.radio.channel('test').trigger('log', 'message');
 *    App.radio.channel('test').trigger('info', 'message');
 *    App.radio.channel('test').trigger('warn', 'message');
 *    App.radio.channel('test').trigger('error', 'message');
 * }, 1000);
 * App.radio.level('none');  //show no logs
 * App.radio.level('error'); //only show 'error' logs
 * App.radio.level('warn');  //show 'error' and 'warn' logs
 * //Note: Unless directly set with level(), the default behavior is to show no logs
 * //Note: Return current logging level with App.radio.level()
 * //Note: Return channels with App.radio.channels()
**/
define(function(require, exports) {
    'use strict';

    var _     = require('underscore');
    var Radio = require('backbone.radio');

    Radio.DEBUG     = false; //Show & Hide Backbone.Radio debug messages
    var APP_LOGGING = true;  //Show & Hide Application console messages
    var MSG_PREFIX  = '%c APP ❱❱ %c';
    var MSG_TYPES   = ['error', 'warn', 'info', 'log', 'trace'];
    var zipObject   = _.isFunction(_.zipObject) ? _.zipObject : _.object;
    var MSG_DICT    = zipObject(MSG_TYPES, MSG_TYPES.map(function(type, i) {return i;}));

    var STYLE = {
        none:  'background:inherit;color:inherit;',
        error: 'background:red;color:white;',
        warn:  'background:yellow;color:black;',
        info:  'background:blue;color:white;',
        log:   'background:#333;color:white;'
    };

    function consoleMessage(type) {
        return Function.prototype.bind.call(console[type], console, MSG_PREFIX, STYLE[type], STYLE.none);
    }

    var channelMethods = Object.create(null);
    channelMethods.getChannels = function() {
        return Object.keys(Radio._channels);
    };
    channelMethods.level = function(value) {
        if (!_.isUndefined(value)) {
            var level;
            if (_.isNumber(value) && value < MSG_TYPES.length) {
                level = value;
            } else if (_.isString(value)) {
                if (_.contains(MSG_TYPES, value)) {
                    level = MSG_DICT[value] + 1;
                } else {
                    level = 0;
                }
            }
            channelMethods._level = level;
        }
        return channelMethods._level;
    };

    Radio.log = function(channelName, type) {
        type = _.contains(MSG_TYPES, type) ? type : 'log';
        var level = MSG_DICT[type];
        var msg = arguments.length > 2 ? arguments[2] : arguments[1];
        if (level < channelMethods.level()) {
            consoleMessage(type)('[' + channelName + '] ', msg, _.now());
        }
    };

    exports.radio = _.extend(Radio, channelMethods);

    MSG_TYPES.forEach(function(type) {
        exports[type] = APP_LOGGING ? consoleMessage(type) : function() {};
    });
});
