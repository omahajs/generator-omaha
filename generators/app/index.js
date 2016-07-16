'use strict';

var yeoman = require('yeoman-generator');
var utils  = require('../app/utils');
var banner = require('./banner');

module.exports = yeoman.Base.extend({
    initializing: function() {
        var generator = this;
        generator.log(banner);
        generator.config.set('hideBanner', true);
        generator.composeWith('techtonic:project',
            {options: generator.options},
            {local: require.resolve('../project')});
        generator.composeWith('techtonic:webapp',
            {options: generator.options},
            {local: require.resolve('../webapp')}
        );
    },
    end: function() {
        this.config.set('hideBanner', false);
    }
});
