/**
 * @file Example Web Worker using RequireJS
 * @author Jason Wohlgemuth
 * @module modules/worker/example
 * @example <caption>Using web workers with RequireJS</caption>
 * //inside main.js
 * var worker = new Worker('modules/example.webworker.js');
 * worker.onmessage = function(e) {
 *     console.log('Received from Worker:' + e.data);
 * };
 * setTimeout(function() {
 *     worker.postMessage('start worker');
 * }, 1000);
**/
importScripts('../../assets/library/require.min.js');
var q = new Promise(function(){});
var msg = [];
self.onmessage = function(data) {
    msg.push(data);
};
require({baseUrl: '../'}, ['config'], function() {
    'use strict';
    require({baseUrl: '../'}, [/*paths from config go here*/], function() {
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
