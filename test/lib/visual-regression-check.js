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

function screenshot(name, url, element) {
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

var ELEM = '#main';

fs.readFile(path.join(__dirname, 'builds'), 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  data.split('\n')
    .map(function(str) {return str.substring(0, 3);})
    .filter(function(str) {return str.length !== 0;})
    .forEach(function(name) {
        var URL  = 'http://localhost:1235/' + name + '/dist/client/';
        var SNAP = './images/' + name + '.png';
        Nightmare({show: true})
            .viewport(1000, 800)
            .use(screenshot(name, URL))
            .end()
            .then(function(data) {
                resemble('./images/reference.png').compareTo(SNAP).onComplete(function(data) {
                    console.log(data.misMatchPercentage);
                });
            });
    });
});
