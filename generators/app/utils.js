'use strict';

const {isBoolean, merge, partialRight} = require('lodash');
const {readFileSync, writeFileSync} = require('fs-extra');

const maybeInclude = partialRight(maybe, []);

module.exports = {
    copy,
    copyTpl,
    maybe,
    maybeInclude,
    json: {
        read:   readJSON,
        write:  writeJSON,
        extend: extendJSON
    },
    object: {
        clone:  cloneObject
    }
};

function maybe(bool, val, defaultValue = []) {
    return (isBoolean(bool) && bool) ? val : defaultValue;
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
    return JSON.parse(readFileSync(fileName).toString());
}
function writeJSON(fileName, content) {
    var INDENT_SPACES = 4;
    writeFileSync(fileName, `${JSON.stringify(content, null, INDENT_SPACES) }\n`);
}
function extendJSON(fileName, obj) {
    writeJSON(fileName, merge(readJSON(fileName), obj));
}
function cloneObject(value) {
    return JSON.parse(JSON.stringify(value));
}
