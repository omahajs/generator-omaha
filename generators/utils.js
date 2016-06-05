var path   = require('path');
var fs     = require('fs');
var _      = require('lodash');
var extend = require('deep-extend');

function readJSON(fileName) {
    return JSON.parse(fs.readFileSync(path.join(__dirname, fileName + '.json')).toString());
}
function writeJSON(fileName, content) {
    fs.writeFileSync(path.join(__dirname, fileName + '.json'), JSON.stringify(content, null, 4) + '\n');
}
function removeJSON(fileName) {
    fs.unlinkSync(path.join(__dirname, fileName + '.json'));
}
function extendJSON(fileName, obj) {
    writeJSON(fileName, extend(readJSON(fileName), obj));
}

module.exports = {
    json: {
        read:   readJSON,
        write:  writeJSON,
        remove: removeJSON,
        extend: extendJSON
    }
};
