'use strict';

const {join}       = require('path');
const {unlinkSync} = require('fs');
const {json}       = require('../generators/app/utils');
const chai         = require('chai');
const {assert}     = chai;
chai.use(require('chai-shallow-deep-equal'));

describe('Generator JSON utility', () => {
    let content;
    let testJSON = join(__dirname, 'test.json');
    beforeEach(() => {
        json.write(testJSON, {foo: 'bar'});
    });
    afterEach(() => {
        unlinkSync(testJSON);
    });
    it('can extend JSON files', () => {
        content = json.read(testJSON);
        assert.shallowDeepEqual(content, {foo: 'bar'});
        json.extend(testJSON, {bar: 'baz'});
        content = json.read(testJSON);
        assert.shallowDeepEqual(content, {foo: 'bar', bar: 'baz'});
    });
});
