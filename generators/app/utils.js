'use strict';

var fs = require('fs-extra');
var _  = require('lodash');

module.exports = {
    maybeInclude,
    copy,
    copyTpl,
    json: {
        read:   readJSON,
        write:  writeJSON,
        extend: extendJSON
    },
    object: {
        clone:  cloneObject
    }
};

function maybeInclude(bool, val, defaultValue) {
    return (_.isBoolean(bool) && bool) ? val : (defaultValue || []);
}
function copy(from, to, context) {
    var source = context.templatePath(from);
    var dest = context.destinationPath(to);
    context.fs.copy(source, dest);
}
function copyTpl(from, to, context) {
    var source = context.templatePath(from);
    var dest = context.destinationPath(to);
    context.fs.copyTpl(source, dest, context);
}
function readJSON(fileName) {
    return JSON.parse(fs.readFileSync(fileName).toString());
}
function writeJSON(fileName, content) {
    var INDENT_SPACES = 4;
    fs.writeFileSync(fileName, JSON.stringify(content, null, INDENT_SPACES) + '\n');
}
function extendJSON(fileName, obj) {
    writeJSON(fileName, _.merge(readJSON(fileName), obj));
}
function cloneObject(value) {
    return JSON.parse(JSON.stringify(value));
}
