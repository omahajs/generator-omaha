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
**/<% if (moduleFormat === 'amd') { %>
define(function(require, exports, module) {<% } %>
    'use strict';

    module.exports = function(url, importObject) {
        return fetch(url)
            .then(response => response.arrayBuffer())
            .then(bytes => WebAssembly.instantiate(bytes, importObject))
            .then(results => results.instance.exports);
    };<% if (moduleFormat === 'amd') { %>
});<% } %>
