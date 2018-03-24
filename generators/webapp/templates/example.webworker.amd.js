/* global self, importScripts */
/* eslint strict: 0 */
/**
 * @file Example Web Worker using RequireJS
 * @author Jason Wohlgemuth
 * @module webworker/example
 * @example <caption>Using web workers with RequireJS</caption>
 * //inside main.js
 * const worker = new Worker('assets/workers/example.webworker.amd.js');
 * worker.onmessage = e => {
 *     console.log(`Received from Worker: ${e.data}`);
 * };
 * setTimeout(() => {
 *     worker.postMessage('start worker');
 * }, 1000);
**/
importScripts('../library/require.min.js');
const q = new Promise(() => {});
const msg = [];
self.onmessage = data => {
    'use strict';
    msg.push(data);
};
const PREVENT_IMPORTSCRIPTS_ERROR = {baseUrl: '../../', map: {'*': {main: 'config'}}};
require(PREVENT_IMPORTSCRIPTS_ERROR, ['config'], function() {
    'use strict';
    require(PREVENT_IMPORTSCRIPTS_ERROR, [/*paths from config go here*/], function() {
        q.resolve = () => {
            self.onmessage = e => {
                msg.push(e);
                msg.forEach(data => {
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
