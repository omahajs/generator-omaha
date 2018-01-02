/* eslint-disable compat/compat */
const {camelCase, mapKeys, omit} = require('lodash');
const fs                 = require('fs-extra');
const {cyan, green, red} = require('chalk');
const fetch              = require('node-fetch');
const csv                = require('csvtojson');

const sanitizeKeyNames = item => mapKeys(item, (val, key) => camelCase(key));
const save = path => items => fs.writeFile(path, JSON.stringify(items, null, 2), 'utf-8');

module.exports = {
    fin,
    fail,
    download,
    formatCsvData,
    formatFederalAgencyData
};

function download(options) {
    const {formatter, path, url} = options;/* eslint-disable no-unused-vars */
    const [extension, ...rest] = url.split('.').reverse();/* eslint-enable no-unused-vars */
    const parse = (extension === 'json') ? (res => res.json()) : (res => res.text());
    const format = (typeof formatter === 'function') ? formatter : (i => i);
    return fetch(url)
        .then(parse)
        .then(format)
        .then(save(path))
        .then(fin(path))
        .catch(fail(path));
}
function formatCsvData(data) {
    return new Promise((resolve, reject) => {
        const results = [];
        csv()
            .fromString(data)
            .on('json', data => results.push(data))
            .on('error', reject)
            .on('done', () => resolve(results.map(sanitizeKeyNames)));
    });
}
function formatFederalAgencyData(data) {
    return data.taxonomies
        .map(item => item.taxonomy)
        .map(sanitizeKeyNames)
        .map(item => omit(item, 'vocabulary'));
}
function fin(str) {/* eslint-disable no-console */
    return items => {
        console.log(`${green.bold('✔')} Successfully downloaded ${cyan(str)}`);/* eslint-enable no-console */
        return items;
    };
}
function fail(str) {
    return items => {/* eslint-disable no-console */
        console.log(`${red.bold('✗')} Failed to download ${cyan(str)}`);/* eslint-enable no-console */
        return items;
    };
}
