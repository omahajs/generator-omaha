'use strict';

var _      = require('lodash');
var path   = require('path');
var fs     = require('fs-extra');
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

function copyTpl(from, to, context) {
    var source = context.templatePath(from);
    var dest = context.destinationPath(to);
    context.fs.copyTpl(source, dest, context);
}

module.exports = {
    copyTpl,
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
