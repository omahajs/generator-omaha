/**
 * @file Function to import WebAssembly module
 * @author Jason Wohlgemuth
 * @example
 * const importWasm = require('./helpers/importWasm');
 *
 * importWasm('../assets/rust/main.min.wasm').then(api => {
 *     const {add_one} = api;
 *     console.log(add_one(9000)); // 9001
 * });
 * @example <caption>Using Counter example</caption>
 * const importWasm = require('./helpers/importWasm');
 *
 * importWasm('../assets/rust/main.min.wasm').then(api => {
 *     const {
 *         createCounter,
 *         getCounterValue,
 *         incrementCounter,
 *         decrementCounter,
 *         destroyCounter
 *     } = api;
 *     class Counter {
 *         constructor(value = 0) {
 *             this.ptr = createCounter(value);
 *         }
 *         get() {
 *             return getCounterValue(this.ptr);
 *         }
 *         incrementBy(by) {
 *             return incrementCounter(this.ptr, by);
 *         }
 *         decrementBy(by) {
 *             return decrementCounter(this.ptr, by);
 *         }
 *         destroy() {
 *             destroyCounter(this.ptr);
 *         }
 *     }
 *     const counter = new Counter(7);
 *     console.log('Created counter', counter.get());
 *     console.log('add 3 -', counter.incrementBy(3));
 *     console.log('add 2 -', counter.incrementBy(2));
 *     console.log('sub 1 -', counter.decrementBy(1));
 *     counter.destroy();
 * });
 @see {@link https://github.com/jimfleming/rust-ffi-complex-types}
**/
'use strict';

module.exports = function(url, importObject) {
    return fetch(url)
        .then(response => response.arrayBuffer())
        .then(bytes => WebAssembly.instantiate(bytes, importObject))
        .then(results => results.instance.exports);
};
