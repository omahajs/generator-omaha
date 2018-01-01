'use strict';

const sinon        = require('sinon');
const {last}       = require('lodash');
const {join}       = require('path');
const {unlinkSync} = require('fs');
const {
    fin,
    fail,
    download,
    formatFederalAgencyData
} = require('../generators/server/data-utils');
const {
    json,
    maybeInclude,
    parseModuleData
} = require('../generators/app/utils');

const ORIGINAL_CONSOLE_LOG = window.console.log;
const TEST_JSON_DATA = require('./data/test.json');

describe('Data Utilities Module', () => {
    beforeAll(() => {
        window.console.log = jest.fn().mockName('Console Log');
    });
    afterAll(() => {
        window.console.log.mock.mockReset();
        window.console.log = ORIGINAL_CONSOLE_LOG;
    });
    it('can log failure message for invalid url', () => {
        const url = 'not a valid url';
        const path = url;
        download({url, path});
        expect(window.console.log.mock.calls).toMatchSnapshot();
    });
    it('can format federal agency JSON data', () => {
        const results = formatFederalAgencyData(TEST_JSON_DATA);
        expect(results).toMatchSnapshot();
    });
    it('can log success and fail messages via promise chain', () => {
        const path = 'some-path-name.json'
        expect(fin(path)([1, 2, 3])).toMatchSnapshot();
        expect(fail(path)([4, 5, 6])).toMatchSnapshot();
        expect(window.console.log.mock.calls).toMatchSnapshot();
    });
});
describe('Utilities Module', () => {
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
