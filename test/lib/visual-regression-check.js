var fs        = require('fs');
var path      = require('path');
var resemble  = require('node-resemble');
var Nightmare = require('nightmare');

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
};

function saveScreenshot(url, name, element) {
    return Nightmare({show: true})
        .viewport(1000, 800)
        .use(ScreenshotPlugin(url, name))
        .end();
}

function compare(imgA, imgB) {
    resemble(imgA).compareTo(imgB).onComplete(function(data) {
        console.log(data.misMatchPercentage);
        comparisonData[name] = data;
    });
}

var ELEM = '#main';
var reference = './images/reference.png';
var comparisonData = {};
fs.readFile(path.join(__dirname, 'builds'), 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }
    var builds = data.split('\n')
        .map(function(str) {return str.substring(0, 3);})
        .filter(function(str) {return str.length !== 0;});
    builds.slice(1, 2).forEach(function(name, index) {
        var URL  = 'http://localhost:1235/' + name + '/dist/client/';
        var testImage = './images/' + name + '.png';
        saveScreenshot(URL, name).then(function() {compare(reference, testImage);});
    });
});
