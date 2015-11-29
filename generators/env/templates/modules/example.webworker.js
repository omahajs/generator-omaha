/**
 * @file Example Web Worker using RequireJS
 * @author Jason Wohlgemuth
 */
importScripts('../../assets/library/require.min.js');
require({baseUrl: '../'}, ['config'], function() {
    'use strict';
    require({baseUrl: '../'}, [], function() {
        self.onmessage = function(e) {
            console.log('Worker Received: ' + e.data);
        };
    });
});