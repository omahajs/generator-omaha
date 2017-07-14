const {blue} = require('chalk');
const info   = String.fromCharCode('9432');

exports.command = function(message, callback) {
    var browser = this;
    browser.perform(function() {
        console.log(' ' + blue.bold(info) + ' ' + message);
    });
    if (typeof(callback) === 'function') {
        callback.call(browser);
    }
    return browser;
}
