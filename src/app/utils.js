/* @flow */
const {isBoolean, findKey, merge, partialRight} = require('lodash');
const {readFileSync, writeFileSync} = require('fs-extra');

const maybeInclude = partialRight(maybe, []);

module.exports = {
    copy,
    copyTpl,
    maybe,
    maybeInclude,
    parseModuleData,
    json: {
        read:   readJSON,
        write:  writeJSON,
        extend: extendJSON
    },
    object: {
        clone:  cloneObject
    }
};

function parseModuleData(str: string) {
    const BUNDLER_LOOKUP = {
        browserify: /browserify/i,
        webpack: /webpack/i,
        rjs: /r[.]js/i
    };
    const data = str.split(' with ');
    return [data[0], findKey(BUNDLER_LOOKUP, re => re.test(data[1]))];
}
function maybe(condition: boolean, val: any, defaultValue: any = []) {
    return (isBoolean(condition) && condition) ? val : defaultValue;
}
function copy(from: string, to: string, context: any) {
    var source = context.templatePath(from);
    var dest = context.destinationPath(to);
    context.fs.copy(source, dest);
}
function copyTpl(from: string, to: string, context: any) {
    var source = context.templatePath(from);
    var dest = context.destinationPath(to);
    context.fs.copyTpl(source, dest, context);
}
function readJSON(fileName: string) {
    return JSON.parse(readFileSync(fileName).toString());
}
function writeJSON(fileName: string, content: any) {
    var INDENT_SPACES = 4;
    writeFileSync(fileName, `${JSON.stringify(content, null, INDENT_SPACES) }\n`);
}
function extendJSON(fileName: string, obj: any) {
    writeJSON(fileName, merge(readJSON(fileName), obj));
}
function cloneObject(value: any) {
    return JSON.parse(JSON.stringify(value));
}
