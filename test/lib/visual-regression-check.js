var path      = require('path');
var chalk     = require('chalk');
var Bluebird  = require('bluebird');
var resemble  = require('node-resemble');
var Nightmare = require('nightmare');

var results = {};
var readFile = Bluebird.promisify(require('fs').readFile);
readFile(path.join(__dirname, 'builds'), 'utf8').then(function (data) {
    var builds = data.split('\n')
        .map(function(str) {return str.substring(0, 3);})
        .filter(function(str) {return str.length !== 0;});
    // setInterval(function() {
    //
    // }, 6000);
    builds.slice(1, 2).forEach(function(name, index) {
        var URL  = 'http://localhost:1235/' + name + '/dist/client/';
        saveScreenshot(URL, name).then(function() {compare('./test/lib/images/reference.png', './test/lib/images/' + name + '.png', name, results);});
    });
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
    element = element ? element : 5000;
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
function compare(imgA, imgB, name, results) {
    resemble(imgA).compareTo(imgB).onComplete(function(data) {
        console.log(data.misMatchPercentage);
        results[name] = data;
    });
}
