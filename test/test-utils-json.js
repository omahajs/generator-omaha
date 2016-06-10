var chai   = require('chai');
var assert = chai.assert;
var path   = require('path');
var fs     = require('fs');
var utils  = require('../generators/app/utils').json;
chai.use(require('chai-shallow-deep-equal'));

function removeJSON(fileName) {fs.unlinkSync(fileName);}

describe('Generator JSON utility', function() {
    var content;
    var testJSON = path.join(__dirname, 'test.json');
    beforeEach(function() {
        utils.write(testJSON, {foo: 'bar'});
    });
    afterEach(function() {
        removeJSON(testJSON);
    });
    it('can extend JSON files', function() {
        content = utils.read(testJSON);
        assert.shallowDeepEqual(content, {foo: 'bar'});
        utils.extend(testJSON, {bar: 'baz'});
        content = utils.read(testJSON);
        assert.shallowDeepEqual(content, {foo: 'bar', bar: 'baz'});
    });
});
