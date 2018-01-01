
const {last}       = require('lodash');
const {join}       = require('path');
const {unlinkSync} = require('fs');
const {
    formatFederalAgencyData
} = require('../generators/server/data-utils');
const {
    json,
    maybeInclude,
    parseModuleData
} = require('../generators/app/utils');

const TEST_JSON_DATA = require('./data/test.json');

describe('Data Utilities Module', function() {
    it('can format federal agency JSON data', () => {
        const results = formatFederalAgencyData(TEST_JSON_DATA);
        expect(results).toMatchSnapshot();
    });
});
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
    it('can optionally return values', () => {
        const result = [].concat(
            maybeInclude(true, 'foo', 'bar'),
            maybeInclude(false, 'a', 'b'),
            maybeInclude(true, ['c', 'd'])
        );
        expect(result).toMatchSnapshot();
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
