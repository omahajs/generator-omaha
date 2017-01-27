'use strict';

var Yeoman = require('yeoman-generator');
var utils  = require('../app/utils');
var banner = require('./banner');

module.exports = Yeoman.extend({
    initializing: function() {
        var generator = this;
        generator.log(banner);
        generator.config.set('isComposed', true);
        generator.config.set('hideBanner', true);
        generator.composeWith(require.resolve('../project'), generator.options);
        generator.composeWith(require.resolve('../webapp'), generator.options);
    },
    end: function() {
        this.config.set('hideBanner', false);
    }
});
