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
    element = element ? element : 3000;
    return function(nightmare) {
        if (url) {
            nightmare.goto(url);
        }
        nightmare
            .wait(element)
            .screenshot(createFilePath(name));
    };
};

var NAME = 'RNH_BCJAI';
var URL  = 'http://localhost:1235/' + NAME + '/dist/client/';
// var URL  = 'http://google.com';
console.log(URL);
var ELEM = '#main';
var SNAP = './images/' + NAME + '.png';
Nightmare({show: true})
    .viewport(1000, 800)
    .use(screenshot(NAME, URL))
    .end()
    .then(function(data) {
        resemble('./images/reference.png').compareTo(SNAP).onComplete(function(data) {
            console.log(data.misMatchPercentage);
        });
    });
