'use strict';

var banner = require('./banner');
var yeoman = require('yeoman-generator');
var chalk  = require('chalk');
var yosay  = require('yosay');
var path   = require('path');
var mkdirp = require('mkdirp');

function step(num) {
    var TOTAL_STEPS = 13;
    return chalk[num === TOTAL_STEPS ? 'green' : 'gray']('('+ num + '/' + TOTAL_STEPS + ') ');
}

module.exports = yeoman.generators.Base.extend({
    constructor: function() {
        yeoman.generators.Base.apply(this, arguments);
        this.option('full');
    },
    prompting: function() {
        var done = this.async();
        this.log(banner);
        var cssPreprocessors = ['less', 'Sass', 'none'];
        var scriptBundlers = ['requirejs', 'browserify'];
        var templateTechnologies = ['handlebars', 'underscore'];
        var prompts = [
            {
                type: 'input',
                name: 'projectName',
                message: step(1) + 'What do you want to name this project?',
                default: path.basename(this.destinationRoot())
            },
            {
                type: 'input',
                name: 'appDir',
                message: step(2) + 'Where do you want to put the application directory?',
                default: '.'
            },
            {
                type: 'list',
                name: 'scriptBundler',
                message: step(3) + 'Which technology for bundling scripts before deployment?',
                choices: scriptBundlers
            },
            {
                type: 'list',
                name: 'cssPreprocessor',
                message: step(4) + 'Which CSS pre-processor?',
                choices: cssPreprocessors
            },
            {
                type: 'list',
                name: 'templateTechnology',
                message: step(5) + 'Which techtonology for templates?',
                choices: templateTechnologies
            },
            {
                type: 'confirm',
                name: 'autoFix',
                message: step(6) + 'Auto-fix minor style errors?',
                default: true
            },
            {
                type: 'confirm',
                name: 'useJsinspect',
                message: step(7) + 'Detect copy-pasted and structurally similar code with JS Inspect?',
                default: true
            },
            {
                type: 'confirm',
                name: 'useBuddyjs',
                message: step(8) + 'Detect magic numbers with buddy.js?',
                default: true
            },
            {
                type: 'confirm',
                name: 'useA11y',
                message: step(9) + 'Enforce ARIA and Section 508 standards?',
                default: true
            },
            {
                type: 'confirm',
                name: 'compressImages',
                message: step(10) + 'Use image compression for deployed application?',
                default: true
            },
            {
                type: 'confirm',
                name: 'benchmarks',
                message: step(11) + 'Add benchmarking support using Benchmark.js?',
                default: true
            },
            {
                type: 'confirm',
                name: 'styleguide',
                message: step(12) + 'Generate styleguide from Markdown comments inside your stylesheeets with mdcss?',
                default: true
            },
            {
                type: 'confirm',
                name: 'useCoveralls',
                message: step(13) + 'Integrate with Coveralls.io?',
                default: true
            }
        ];
        this.prompt(prompts, function (props) {
            var generator = this;
            var bundler = props.scriptBundler.toLowerCase();
            var preprocessor = props.cssPreprocessor.toLowerCase();
            var templateTechnology = props.templateTechnology.toLowerCase();
            this.props = props;
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
            this.appDir = (!/\/$/.test(props.appDir)) ? props.appDir + '/' : props.appDir;
            this.userName = this.user.git.name() ? this.user.git.name() : 'John Doe';
            this.autoFix = props.autoFix ? 'true' : 'false';
            this.generateStyleguide = props.styleguide;
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
