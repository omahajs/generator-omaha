/* eslint no-console: 0 */
'use strict';

var path      = require('path');
var chalk     = require('chalk');
var Promise   = require('bluebird');
var resemble  = require('node-resemble');
var nightmare = require('nightmare');
var utils     = require('../../generators/app/utils');

var PORT = '1234';
var LONG_ENOUGH_TO_WAIT_FOR_ELEMENT = 3000;
var LONG_ENOUGH_TO_GET_SCREENSHOT = 6000;
var DEFAULT_SCREENSHOT_WIDTH = 1000;
var DEFAULT_SCREENSHOT_HEIGHT = 800;

var results = {};
var readFile = Promise.promisify(require('fs').readFile);
readFile(path.join(__dirname, 'builds'), 'utf8').then(function(data) {
    var i = 0;
    var builds = data.split('\n')
        .map(function getBuildName(str) {return str.split('=')[0];})
        .filter(function isValidBuildName(str) {return str.length !== 0;});
    var runBuilds = setInterval(function() {
        if (i === builds.length) {
            clearInterval(runBuilds);
            utils.json.write(path.join(__dirname, 'results.json'), results);
        } else {
            var name = builds[i];
            saveScreenshot(`http://localhost:${PORT}/` + name + '/dist/client/', name).then(function() {
                resemble('./test/lib/reference.png').compareTo('./test/lib/screenshots/' + name + '.png').onComplete(function(data) {
                    var mismatch = parseFloat(data.misMatchPercentage);
                    var postfix = chalk.green.bold('PASS');
                    if (mismatch > 0) {
                        postfix = chalk.red.bold('FAIL ') + chalk.inverse(' ' + mismatch + ' ');
                    }
                    console.log(name + (name.length === 3 ? '      ' : '') + ' - ' + postfix);
                    results[name] = data;
                    ++i;
                });
            });
        }
    }, LONG_ENOUGH_TO_GET_SCREENSHOT);
}).catch(function(e) {
    console.log('Error reading file', e);
});

function createFilePath(name, ext) {
    ext = ext ? ext : '.png';
    var filePath = path.join(__dirname, 'screenshots', name);
    filePath += ext;
    return filePath;
}
function screenshotPlugin(url, name, element) {
    element = element ? element : LONG_ENOUGH_TO_WAIT_FOR_ELEMENT;
    return function(nightmare) {
        if (url) {
            nightmare.goto(url);
        }
        nightmare
            .wait(element)
            .screenshot(createFilePath(name));
    };
}
function saveScreenshot(url, name) {
    return nightmare({show: true})
        .viewport(DEFAULT_SCREENSHOT_WIDTH, DEFAULT_SCREENSHOT_HEIGHT)
        .use(screenshotPlugin(url, name))
        .end();
}
