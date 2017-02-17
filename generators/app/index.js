'use strict';

var Yeoman = require('yeoman-generator');
var banner = require('./banner');

module.exports = Yeoman.extend({
    initializing: function() {
        var generator = this;
        generator.log(banner);
        generator.config.set('hideBanner', true);
        generator.composeWith(require.resolve('../project'), generator.options);
        generator.composeWith(require.resolve('../webapp'), generator.options);
    },
    end: function() {
        this.config.set('hideBanner', false);
    }
});
