/* global self, importScripts */
/* eslint strict: 0 */
/**
 * @file Example Web Worker
 * @author Jason Wohlgemuth
 * @module webworker/example
 * @example <caption>Using web workers</caption>
 * //inside main.js
 * const worker = new Worker('assets/workers/example.webworker.js');
 * worker.onmessage = e => {
 *     console.log(`Received from Worker: ${e.data}`);
 * };
 * setTimeout(() => {
 *     worker.postMessage('start worker');
 * }, 1000);
**/
self.onmessage = () => {
    self.postMessage('Hello');
}
