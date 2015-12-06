'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
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
                default: path.basename(this.destinationRoot())
            },
            {
                type: 'confirm',
                name: 'autoFix',
                message: 'Auto-fix minor style errors?',
                default: true
            },
            {
                type: 'confirm',
                name: 'useJsinspect',
                message: 'Detect copy-pasted and structurally similar code with JS Inspect?',
                default: true
            },
            {
                type: 'confirm',
                name: 'useBuddyjs',
                message: 'Detect magic numbers with buddy.js?',
                default: true
            },
            {
                type: 'confirm',
                name: 'useA11y',
                message: 'Enforce ARIA and Section 508 standards?',
                default: true
            },
            {
                type: 'confirm',
                name: 'compressImages',
                message: 'Use image compression for deployed application?',
                default: true
            },
            {
                type: 'confirm',
                name: 'useCoveralls',
                message: 'Integrate with Coveralls.io?',
                default: false
            }
        ];
        this.prompt(prompts, function (props) {
            this.props = props;
            this.projectName = props.projectName;
            this.userName = this.user.git.name() ? this.user.git.name() : 'John Doe';
            done();
        }.bind(this));
    },
    configuring: {
      project: function() {
          this.fs.copy(
              this.templatePath('config/{.*,*.*}'),
              this.destinationPath('config')
          );
          this.template('_LICENSE', 'LICENSE');
          this.template('_package.json', 'package.json');
          this.template('_Gruntfile.js', 'Gruntfile.js');
          this.template('_README.md', 'README.md');
          this.template('tasks/main.js', 'tasks/main.js');
          this.template('tasks/build.js', 'tasks/build.js');
          this.template('tasks/test.js', 'tasks/test.js');
      }
    },
    writing: {
        appStructure: function() {
            this.fs.copy(
                this.templatePath('tests/**/*.*'),
                this.destinationPath('tests')
            );
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
            this.fs.copy(
                this.templatePath('shims/*.js'),
                this.destinationPath('app/shims')
            );
            this.fs.copy(
                this.templatePath('helpers/*.js'),
                this.destinationPath('app/helpers')
            );
            this.fs.copy(
                this.templatePath('modules/*.js'),
                this.destinationPath('app/modules')
            );
            this.template('_index.html', 'app/index.html');
            this.template('_app.js', 'app/app.js');
            this.template('_main.js', 'app/main.js');
            this.template('_config.js', 'app/config.js');
            this.template('_router.js', 'app/router.js');
            this.template('example.model.js', 'app/models/example.js');
            this.template('example.view.js', 'app/views/example.js');
            this.template('example.controller.js', 'app/controllers/example.js');
        },
        assetFiles: function() {
            this.template('example.template.hbs', 'assets/templates/example.hbs');
            this.template('_reset.less', 'assets/less/reset.less');
            this.template('_style.less', 'assets/less/style.less');
            this.fs.copy(
                this.templatePath('techtonic.png'),
                this.destinationPath('assets/images/logo.png')
            );
        }
    },
    install: function () {
        this.installDependencies({npm: true, bower: false});
    }
});
