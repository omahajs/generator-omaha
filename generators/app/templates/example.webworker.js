/* global self, importScripts */
/* eslint strict: 0 */
/**
 * @file Example Web Worker using RequireJS
 * @author Jason Wohlgemuth
 * @module plugins/worker/example
 * @example <caption>Using web workers with RequireJS</caption>
 * //inside main.js
 * var worker = new Worker('plugins/example.webworker.js');
 * worker.onmessage = function(e) {
 *     console.log('Received from Worker:' + e.data);
 * };
 * setTimeout(function() {
 *     worker.postMessage('start worker');
 * }, 1000);
**/
importScripts('../../assets/library/require.min.js');
var q = new Promise(function() {});
var msg = [];
self.onmessage = function(data) {
    'use strict';
    msg.push(data);
};
var PREVENT_IMPORTSCRIPTS_ERROR = {baseUrl: '../', map: {'*': {'main': 'config'}}};
require(PREVENT_IMPORTSCRIPTS_ERROR, ['config'], function() {
    'use strict';
    require(PREVENT_IMPORTSCRIPTS_ERROR, [/*paths from config go here*/], function() {
        q.resolve = function() {
            self.onmessage = function(e) {
                msg.push(e);
                msg.forEach(function(data) {
                    /*
                    Code using RequireJS modules go here
                    */
                    self.postMessage(data.data);
                });
            };
        };
        q.resolve();
    });
});
