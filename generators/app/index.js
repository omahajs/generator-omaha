'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
    prompting: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
            'Welcome to the praiseworthy ' + chalk.red('techtonic') + ' generator!'
        ));

        var prompts = [
            {
                type: 'input',
                name: 'projectName',
                message: 'What do you want to name this project?',
                default: 'techtonic-app'
            }/*
            {
                type: 'confirm',
                name: 'someOption',
                message: 'Would you like to enable this option?',
                default: true
            }
        */];
        this.prompt(prompts, function (props) {
            this.props = props;
            done();
        }.bind(this));
    },
    configuring: {
      projectfiles: function() {
          this.fs.copy(
              this.templatePath('config/{.*,*.*}'),
              this.destinationPath('config')
          );
          this.fs.copyTpl(
              this.templatePath('_package.json'),
              this.destinationPath('package.json'),
              {
                  projectName: this.props.projectName,
                  userName: this.user.git.name()
              }
          );
          this.fs.copyTpl(
              this.templatePath('_app.json'),
              this.destinationPath('app.json'),
              {projectName: this.props.projectName}
          );
          this.template('_Gruntfile.js', 'Gruntfile.js');
          //TODO: Create/copy license here
      }
    },
    writing: {
        app: function() {
            this.fs.copy(
                this.templatePath('tasks/*.js'),
                this.destinationPath('tasks')
            );
            this.fs.copy(
                this.templatePath('web/*.js'),
                this.destinationPath('web')
            );
            //scaffold app folder structure
            mkdirp('app/models');
            mkdirp('app/views');
            mkdirp('app/controllers');
            mkdirp('app/modules');
            mkdirp('app/helpers');
            mkdirp('app/shims');
            mkdirp('assets/fonts');
            mkdirp('assets/images');
            mkdirp('assets/less');
            mkdirp('assets/library');
            mkdirp('assets/templates');
            //TODO: Create Jasmine boilerplate here
        }
    },
    install: function () {
        //this.installDependencies({npm: true, bower: false});
    }
});
