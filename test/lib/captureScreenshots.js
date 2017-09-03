'use strict';

const {join} = require('path');
const {bold, green} = require('chalk');
const Promise   = require('bluebird');
const puppeteer = require('puppeteer');

const PORT = 1234;
const width = 600;
const height = 650;
const prefix = 'snapshot';
const getPath = name => ({path: createFilePath(name)});
const readFile = Promise.promisify(require('fs').readFile);
/* eslint-disable no-console */
captureScreenshots().then(msg => console.log(bold(green('✔ ') + bold(msg))));
/* eslint-enable no-console */

function captureScreenshots(options) {
    return (async () => {
        const data = await readFile(join(__dirname, 'builds'), 'utf8');
        const builds = data.split('\n')
            .map(str => str.split('=')[0])
            .filter(str => (str.length !== 0));
        const urls = builds.map(build => `http://localhost:${PORT}/${build}/dist/client/`);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const screenshot = name => page.screenshot(getPath(name));
        await page.setViewport({width, height});
        let i = 0;
        for (let url of urls) {
            await page.goto(url);
            await screenshot(`${builds[i++]}`);
        }
        browser.close();
        return 'Capture Complete';
    })();
}
function createFilePath(name, ext) {
    ext = ext ? ext : '.png';
    var filePath = join(__dirname, 'screenshots', name);
    filePath += ext;
    return filePath;
}
