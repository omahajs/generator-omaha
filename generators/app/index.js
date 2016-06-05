'use strict';

var yeoman = require('yeoman-generator');
var banner = require('./banner');

module.exports = yeoman.generators.Base.extend({
    initializing: function() {
        var generator = this;
        generator.log(banner);
        generator.config.set('userName', generator.user.git.name() ? generator.user.git.name() : 'John Doe');
        generator.config.set('hideBanner', true);
        generator.composeWith('techtonic:webapp',
            {options: generator.options},
            {local: require.resolve('../webapp')}
        );
    },
    writing: function() {
        var generator = this;
        generator.userName = generator.config.get('userName');
        generator.template('_LICENSE', 'LICENSE');
        generator.template('config/_gitignore', '.gitignore');
        generator.template('config/_csslintrc', 'config/.csslintrc');
        generator.template('config/_eslintrc.js', 'config/.eslintrc.js');
        generator.template('config/_karma.conf.js', 'config/karma.conf.js');
    }
});
