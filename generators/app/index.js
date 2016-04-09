'use strict';

var yeoman  = require('yeoman-generator');
var mkdirp  = require('mkdirp');
var banner  = require('./banner');
var prompts = require('./prompts');

module.exports = yeoman.generators.Base.extend({
    constructor: function() {
        yeoman.generators.Base.apply(this, arguments);
        this.option('full');
    },
    prompting: function() {
        var done = this.async();
        this.log(banner);
        this.prompt(prompts, function (props) {
            var generator = this;
            generator.props = props;
            var bundler = props.scriptBundler.toLowerCase();
            var preprocessor = props.cssPreprocessor.toLowerCase();
            var templateTechnology = props.templateTechnology.toLowerCase();
            var options = {
                useBrowserify: (bundler === 'browserify'),
                useLess:       (preprocessor === 'less'),
                useSass:       (preprocessor === 'sass'),
                useHandlebars: (templateTechnology !== 'underscore')
            };
            Object.keys(options).forEach(function(option) {
                generator[option] = options[option];
            });
            this.projectName = props.projectName;
            this.autoFix = props.autoFix;
            this.generateStyleguide = props.styleguide;
            this.appDir = (!/\/$/.test(props.appDir)) ? props.appDir + '/' : props.appDir;
            done();
        }.bind(this));
        this.userName = this.user.git.name() ? this.user.git.name() : 'John Doe';
        this.config.set('appDir', this.appDir);
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
            this.template('test/config.js', this.appDir + 'test/config.js');
            if (this.props.benchmarks) {
                this.template('test/example.benchmark.js', this.appDir + 'test/benchmarks/example.benchmark.js');
            }
            mkdirp(this.appDir + 'assets/fonts');
            mkdirp(this.appDir + 'assets/images');
            if (this.useLess) {
                mkdirp(this.appDir + 'assets/less');
            }
            if (this.useSass) {
                mkdirp(this.appDir + 'assets/sass');
            }
            mkdirp(this.appDir + 'assets/library');
            this.fs.copy(
                this.templatePath('library/require.min.js'),
                this.destinationPath(this.appDir + 'assets/library/require.min.js')
            );
            mkdirp(this.appDir + 'assets/templates');
        },
        appFiles: function() {
            this.fs.copy(
                this.templatePath('shims/*.js'),
                this.destinationPath(this.appDir + 'app/shims')
            );
            if (this.useHandlebars) {
                this.template('helpers/handlebars.helpers.js', this.appDir + 'app/helpers/handlebars.helpers.js');
            }
            this.template('helpers/jquery.extensions.js', this.appDir + 'app/helpers/jquery.extensions.js');
            this.template('helpers/underscore.mixins.js', this.appDir + 'app/helpers/underscore.mixins.js');
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
            if (this.useLess) {
                this.template('_reset.css', this.appDir + 'assets/less/reset.less');
                this.template('_style.less', this.appDir + 'assets/less/style.less');
            }
            if (this.useSass) {
                this.template('_reset.css', this.appDir + 'assets/sass/reset.scss');
                this.template('_style.scss', this.appDir + 'assets/sass/style.scss');
            }
            if (!(this.useLess || this.useSass)) {
                this.template('_reset.css', this.appDir + 'assets/css/reset.css');
            }
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
