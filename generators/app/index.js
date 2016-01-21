'use strict';

var yeoman = require('yeoman-generator');
var chalk  = require('chalk');
var yosay  = require('yosay');
var path   = require('path');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
    prompting: function() {
        var done = this.async();

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
                type: 'input',
                name: 'appDir',
                message: 'Where do you want to put the application directory?',
                default: '.'
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
                name: 'benchmarks',
                message: 'Add benchmarking support using Benchmark.js?',
                default: true
            },
            {
                type: 'confirm',
                name: 'useCoveralls',
                message: 'Integrate with Coveralls.io?',
                default: true
            }
        ];
        this.prompt(prompts, function (props) {
            this.props = props;
            this.projectName = props.projectName;
            if (!/\/$/.test(props.appDir)) {
                 this.appDir = props.appDir + '/';
            } else {
                this.appDir = props.appDir;
            }
            this.userName = this.user.git.name() ? this.user.git.name() : 'John Doe';
            this.autoFix = props.autoFix ? 'true' : 'false';
            this.config.set('appDir', this.appDir);
            done();
        }.bind(this));
    },
    configuring: {
      project: function() {
          this.template('config/_csslintrc', 'config/.csslintrc');
          this.template('config/_jscsrc', 'config/.jscsrc');
          this.template('config/_jscsrc-jsdoc', 'config/.jscsrc-jsdoc');
          this.template('config/_jshintrc', 'config/.jshintrc');
          this.template('config/_default.js', 'config/default.js');
          this.template('config/_karma.conf.js', 'config/karma.conf.js');
          this.template('config/_gitignore', '.gitignore');
          this.template('_LICENSE', 'LICENSE');
          this.template('_package.json', 'package.json');
          this.template('_Gruntfile.js', 'Gruntfile.js');
          this.template('_README.md', 'README.md');
          this.template('tasks/main.js', this.appDir + 'tasks/main.js');
          this.template('tasks/build.js', this.appDir + 'tasks/build.js');
          this.template('tasks/test.js', this.appDir + 'tasks/test.js');
      }
    },
    writing: {
        appStructure: function() {
            this.fs.copy(
                this.templatePath('test/data/**/*.*'),
                this.destinationPath(this.appDir + 'test/data')
            );
            this.fs.copy(
                this.templatePath('test/jasmine/**/*.*'),
                this.destinationPath(this.appDir + 'test/jasmine')
            );
            this.template('test/test-main.js', this.appDir + 'test/test-main.js');
            if (this.props.benchmarks) {
                this.template('test/example.benchmark.js', this.appDir + 'test/benchmarks/example.benchmark.js');
            }
            mkdirp(this.appDir + 'app/models');
            mkdirp(this.appDir + 'app/views');
            mkdirp(this.appDir + 'app/controllers');
            mkdirp(this.appDir + 'app/helpers');
            mkdirp(this.appDir + 'assets/fonts');
            mkdirp(this.appDir + 'assets/images');
            mkdirp(this.appDir + 'assets/less');
            mkdirp(this.appDir + 'assets/library');
            mkdirp(this.appDir + 'assets/templates');
        },
        appFiles: function() {
            this.fs.copy(
                this.templatePath('shims/*.js'),
                this.destinationPath(this.appDir + 'app/shims')
            );
            this.fs.copy(
                this.templatePath('helpers/*.js'),
                this.destinationPath(this.appDir + 'app/helpers')
            );
            this.fs.copy(
                this.templatePath('modules/*.js'),
                this.destinationPath(this.appDir + 'app/modules')
            );
            this.template('_index.html', this.appDir + 'app/index.html');
            this.template('_app.js', this.appDir + 'app/app.js');
            this.template('_main.js', this.appDir + 'app/main.js');
            this.template('_config.js', this.appDir + 'app/config.js');
            this.template('_router.js', this.appDir + 'app/router.js');
            this.template('example.model.js', this.appDir + 'app/models/example.js');
            this.template('example.view.js', this.appDir + 'app/views/example.js');
            this.template('example.controller.js', this.appDir + 'app/controllers/example.js');
        },
        assetFiles: function() {
            this.template('example.template.hbs', this.appDir + 'assets/templates/example.hbs');
            this.template('_reset.less', this.appDir + 'assets/less/reset.less');
            this.template('_style.less', this.appDir + 'assets/less/style.less');
            this.fs.copy(
                this.templatePath('techtonic.png'),
                this.destinationPath(this.appDir + 'assets/images/logo.png')
            );
        }
    },
    install: function () {
        this.npmInstall();
    }
});
