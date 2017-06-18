'use strict';

const Generator = require('yeoman-generator');
const banner    = require('./banner');

module.exports = Generator.extend({
    initializing: function() {
        let options = this.options;
        this.log(banner);
        this.config.defaults({
            isWebapp: true,
            hideBanner: true
        });
        this
            .composeWith(require.resolve('../project'), options)
            .composeWith(require.resolve('../webapp'), options);
    },
    end: function() {
        this.config.set('hideBanner', false);
    }
});
