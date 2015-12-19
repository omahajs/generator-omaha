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
            this.moduleName = this.name;
            this.moduleDescription = props.moduleDescription;
            this.userName = this.user.git.name() ? this.user.git.name() : 'John Doe';
            this.use = {};
            this.depList = props.dependencies.map(function(dep) {
                return '\'' + dep + '\'';
            });
            props.dependencies.map(function(dep) {
                this.use[dep] = true;
            }, this);
            if (this.use['backbone'] && !this.use['underscore']) {
                this.depList.unshift('\'underscore\'');
                this.use['underscore'] = true;
            }
            done();
        }.bind(this));
    },
    writing: function() {
        var moduleFileName = this.name + '.umd.js';
        if (this.use.jquery) {
            moduleFileName = 'jquery.' + this.name + '.js';
        }
        if (this.use.backbone) {
            moduleFileName = 'backbone.' + this.name + '.js';
        }
        this.template('umd.template.js', 'app/modules/' + moduleFileName);
    }
});
