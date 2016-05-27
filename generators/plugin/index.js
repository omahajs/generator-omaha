'use strict';

var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.NamedBase.extend({
    prompting: function() {
        var done = this.async();
        var prompts = [
            {
                type: 'input',
                name: 'pluginDescription',
                message: 'What will this plugin do?',
                default: 'Plugin does this and that'
            },
            {
                type: 'checkbox',
                name: 'dependencies',
                message: 'Choose plugin dependencies:',
                choices: [
                    {
                        name: '  jQuery',
                        value: 'jquery',
                        checked: false
                    },
                    {
                        name: '  Underscore.js',
                        value: 'underscore',
                        checked: false
                    },
                    {
                        name: '  Backbone.js',
                        value: 'backbone',
                        checked: false
                    }
                ]
            }
        ];
        this.prompt(prompts, function (props) {
            this.pluginName = this.name;
            this.pluginDescription = props.pluginDescription;
            this.userName = this.user.git.name() ? this.user.git.name() : 'John Doe';
            this.use = {};
            this.depList = props.dependencies.map(function(dep) {
                return '\'' + dep + '\'';
            });
            props.dependencies.map(function(dep) {
                this.use[dep] = true;
            }, this);
            if (this.use.backbone && !this.use.underscore) {
                this.depList.unshift('\'underscore\'');
                this.use.underscore = true;
            }
            done();
        }.bind(this));
    },
    writing: function() {
        var moduleFileName = this.name + '.js';
        if (this.use.jquery) {
            moduleFileName = 'jquery.' + moduleFileName;
        } else if (this.use.underscore) {
            moduleFileName = 'underscore.' + moduleFileName;
        }
        if (this.use.backbone) {
            moduleFileName = 'backbone.' + this.name + '.js';
        }
        this.template('umd.template.js', this.config.get('appDir') + 'app/modules/' + moduleFileName);
    }
});
