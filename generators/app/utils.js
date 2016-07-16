'use strict';

var path   = require('path');
var fs     = require('fs');
var _      = require('lodash');
var extend = require('deep-extend');

function readJSON(fileName) {
    return JSON.parse(fs.readFileSync(fileName).toString());
}
function writeJSON(fileName, content) {
    fs.writeFileSync(fileName, JSON.stringify(content, null, 4) + '\n');
}
function extendJSON(fileName, obj) {
    writeJSON(fileName, extend(readJSON(fileName), obj));
}
function cloneObject(value) {
    return JSON.parse(JSON.stringify(value));
}

module.exports = {
    json: {
        read:   readJSON,
        write:  writeJSON,
        extend: extendJSON
    },
    object: {
        clone:  cloneObject,
        extend: extend
    }
};
