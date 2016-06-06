var path  = require('path');
var fs    = require('fs');
var utils = require('../generators/utils').json;

function removeJSON(fileName) {fs.unlinkSync(path.join(__dirname, fileName));}

describe('Generator JSON utility', function() {
    it('can create and remove JSON files', function() {
        utils.write(path.join(__dirname, 'test.json'));
        removeJSON('test.json');
    });
});
