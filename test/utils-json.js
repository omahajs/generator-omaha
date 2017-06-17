'use strict';

const path         = require('path');
const {unlinkSync} = require('fs');
const {json}       = require('../generators/app/utils');
const chai         = require('chai');
const {assert}     = chai;
chai.use(require('chai-shallow-deep-equal'));

describe('Generator JSON utility', function() {
    let content;
    let testJSON = path.join(__dirname, 'test.json');
    beforeEach(function() {
        json.write(testJSON, {foo: 'bar'});
    });
    afterEach(function() {
        unlinkSync(testJSON);
    });
    it('can extend JSON files', function() {
        content = json.read(testJSON);
        assert.shallowDeepEqual(content, {foo: 'bar'});
        json.extend(testJSON, {bar: 'baz'});
        content = json.read(testJSON);
        assert.shallowDeepEqual(content, {foo: 'bar', bar: 'baz'});
    });
});
