'use strict';

const Generator = require('yeoman-generator');
const banner    = require('./banner');
const footer    = require('./doneMessage');

module.exports = class extends Generator {
    initializing() {
        let options = this.options;
        this.log(banner);
        this.config.defaults({
            isComposed: true,
            isWebapp: true,
            isNative: false,
            hideBanner: true
        });
        this
            .composeWith(require.resolve('../project'), options)
            .composeWith(require.resolve('../webapp'), options);
    }
    end() {
        this.log(footer(this));
        // this.config.set('hideBanner', false);
    }
};
