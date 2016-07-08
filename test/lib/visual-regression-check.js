var path      = require('path');
var chalk     = require('chalk');
var Promise   = require('bluebird');
var resemble  = require('node-resemble');
var Nightmare = require('nightmare');
var utils     = require('../../generators/app/utils');

var runBuilds;
var results = {};
var readFile = Promise.promisify(require('fs').readFile);
readFile(path.join(__dirname, 'builds'), 'utf8').then(function (data) {
    var i = 0;
    var builds = data.split('\n')
        .map(function(str) {return str.substring(0, 3);})
        .filter(function(str) {return str.length !== 0;});
    var runBuilds = setInterval(function() {
        if (i === builds.length) {
            clearInterval(runBuilds);
            utils.json.write(path.join(__dirname, 'results.json'), results);
        } else {
            var name = builds[i];
            saveScreenshot('http://localhost:1235/' + name + '/dist/client/', name).then(function() {
                resemble('./test/lib/images/reference.png').compareTo('./test/lib/images/' + name + '.png').onComplete(function(data) {
                    var mismatch = parseFloat(data.misMatchPercentage);
                    var postfix = chalk.green.bold('PASS');
                    if (mismatch > 0) {
                        postfix = chalk.red.bold('FAIL ') + chalk.inverse(' ' + mismatch + ' ');
                    }
                    console.log(name + ' - ' + postfix);
                    results[name] = data;
                    ++i;
                });
            });
        }
    }, 6000);
}).catch(function(e) {
    console.log('Error reading file', e);
});

function createFilePath(name, ext) {
    ext = ext ? ext : '.png';
    var filePath = path.join(__dirname, 'images', name);
    filePath += ext;
    return filePath;
}
function ScreenshotPlugin(url, name, element) {
    element = element ? element : 3000;
    return function(nightmare) {
        if (url) {
            nightmare.goto(url);
        }
        nightmare
            .wait(element)
            .screenshot(createFilePath(name));
    };
}
function saveScreenshot(url, name, element) {
    return Nightmare({show: true})
        .viewport(1000, 800)
        .use(ScreenshotPlugin(url, name))
        .end();
}
