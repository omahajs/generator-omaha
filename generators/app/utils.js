'use strict';

var fs     = require('fs-extra');
var extend = require('deep-extend');

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

function readJSON(fileName) {
    return JSON.parse(fs.readFileSync(fileName).toString());
}
function writeJSON(fileName, content) {
    var INDENT_SPACES = 4;
    fs.writeFileSync(fileName, JSON.stringify(content, null, INDENT_SPACES) + '\n');
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
