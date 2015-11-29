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
        appStructure: function() {
            this.fs.copy(
                this.templatePath('web/*.js'),
                this.destinationPath('web')
            );
            this.fs.copy(
                this.templatePath('tasks/*.js'),
                this.destinationPath('tasks')
            );
            this.fs.copy(
                this.templatePath('shims/*.js'),
                this.destinationPath('shims')
            );
            this.fs.copy(
                this.templatePath('modules/*.js'),
                this.destinationPath('modules')
            );
            //scaffold app folder structure
            mkdirp('app/models');
            mkdirp('app/views');
            mkdirp('app/controllers');
            mkdirp('app/helpers');
            mkdirp('assets/fonts');
            mkdirp('assets/images');
            mkdirp('assets/less');
            mkdirp('assets/library');
            mkdirp('assets/templates');
        },
        appFiles: function() {
            this.template('_index.js',   'index.js');
            this.template('_index.html', 'app/index.html');
            this.template('_app.js',     'app/app.js');
            this.template('_main.js',    'app/main.js');
            this.template('_config.js',  'app/config.js');
            this.template('_router.js',  'app/router.js');
            this.template('_reset.less', 'assets/less/reset.less');
            this.template('_style.less', 'assets/less/style.less');
            //TODO: Create Jasmine boilerplate here
        }
    },
    install: function () {
        this.installDependencies({npm: true, bower: false});
    }
});
