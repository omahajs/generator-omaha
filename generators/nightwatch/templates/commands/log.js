'use strict';

process.env.FORCE_COLOR = 1;// see https://github.com/nightwatchjs/nightwatch/issues/866

const {cyan} = require('chalk');
const info   = String.fromCharCode('9432');

exports.command = function(message, callback) {
    let browser = this;
    browser.perform(() => {
        console.log(` ${cyan.bold(info)} ${cyan(message)}`);
    });
    if (typeof callback === 'function') {
        callback.call(browser);
    }
    return browser;
}
