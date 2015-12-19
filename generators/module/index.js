'use strict';
var yeoman = require('yeoman-generator');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.NamedBase.extend({
    prompting: function() {
        var done = this.async();
        var prompts = [
            {
                type: 'input',
                name: 'moduleDescription',
                message: 'What will this module do?',
                default: 'Module does this and that'
            },
            {
                type: 'checkbox',
                name: 'dependencies',
                message: 'Choose module dependencies:',
                choices: [
                    {
                        name: 'jQuery',
                        value: 'jquery',
                        checked: false
                    },
                    {
                        name: 'Underscore.js',
                        value: 'underscore',
                        checked: false
                    },
                    {
                        name: 'Backbone.js',
                        value: 'backbone',
                        checked: false
                    }
                ]
            }
        ];
        this.prompt(prompts, function (props) {
            this.moduleName = this.name;
            this.moduleDescription = props.moduleDescription;
            this.userName = this.user.git.name() ? this.user.git.name() : 'John Doe';
            this.depList = props.dependencies.map(function(dep) {
                return '\'' + dep + '\'';
            });
            this.use = {};
            props.dependencies.map(function(dep) {
                this.use[dep] = true;
            }, this);
            done();
        }.bind(this));
    },
    writing: {
        moduleFiles: function() {
            this.template('umd.template.js', 'app/modules/' + this.name + '.umd.js');
        }
    }
});
