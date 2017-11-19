'use strict';

const {last}       = require('lodash');
const {join}       = require('path');
const {unlinkSync} = require('fs');
const {
    json,
    parseModuleData
} = require('../generators/app/utils');

describe('Utilities Module', function() {
    it('can parse module data string', () => {
        expect(
            [
                'AMD with \u001b[31mr.js\u001b[39m',
                'AMD with \u001b[33mbrowserify\u001b[39m',
                'CJS with \u001b[33mbrowserify\u001b[39m',
                'CJS with \u001b[34mwebpack\u001b[39m'
            ].map(parseModuleData).map(last)
        ).toEqual([
            'rjs',
            'browserify',
            'browserify',
            'webpack'
        ]);
    });
});
describe('Generator JSON utility', () => {
    let content;
    const testJSON = join(__dirname, 'test.json');
    beforeEach(() => {
        json.write(testJSON, {foo: 'bar'});
    });
    afterEach(() => {
        unlinkSync(testJSON);
    });
    it('can extend JSON files', () => {
        content = json.read(testJSON);
        expect(content).toMatchSnapshot();
        json.extend(testJSON, {bar: 'baz'});
        content = json.read(testJSON);
        expect(content).toMatchSnapshot();
    });
});
