'use strict';

var yeoman = require('yeoman-generator');
var banner = require('./banner');

module.exports = yeoman.generators.Base.extend({
    initializing: function() {
        this.log(banner);
        this.config.set('hideBanner', true);
        this.composeWith('techtonic:webapp', {options: this.options});
    }
});
