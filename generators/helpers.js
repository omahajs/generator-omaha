var path   = require('path');
var fs     = require('fs');
var _      = require('lodash');
var extend = require('deep-extend');

function readJSON(fileName) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, fileName + '.json')).toString());
}
function writeJSON(fileName, contents) {
    fs.writeFileSync(path.join(__dirname, fileName + '.json'), JSON.stringify(contents, null, 4) + '\n');
}
function extendJSON(fileName, obj) {
    writeJSON(fileName, extend(readJSON(fileName), obj));
}

extendJSON('test', {'boooom': 'boom'});
