'use strict';

var Yeoman = require('yeoman-generator');
var banner = require('./banner');

module.exports = Yeoman.extend({
    initializing: function() {
        var options = this.options;
        this.log(banner);
        this.config.defaults({
            isComposed: true,
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
