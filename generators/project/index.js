'use strict';

var yeoman = require('yeoman-generator');
var utils  = require('../app/utils');
var banner = require('../app/banner');

module.exports = yeoman.generators.Base.extend({
    initializing: function() {
        var generator = this;
        generator.config.set('userName', generator.user.git.name() ? generator.user.git.name() : 'John Doe');
    },
    prompting: function() {
        var generator = this;
        !generator.config.get('hideBanner') && generator.log(banner);
    },
    writing: function() {
        var generator = this;
        generator.userName = generator.config.get('userName');
        generator.appDir = './';
        generator.template('_LICENSE', 'LICENSE');
        generator.template('config/_gitignore', '.gitignore');
        generator.template('config/_default.json', 'config/default.json');
        generator.template('config/_csslintrc', 'config/.csslintrc');
        generator.template('config/_eslintrc.js', 'config/.eslintrc.js');
        generator.template('config/_karma.conf.js', 'config/karma.conf.js');
    }
});
