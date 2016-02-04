//Config files that are ALWAYS created
var configFiles = [
    'config/.csslintrc',
    'config/.jscsrc',
    'config/.jscsrc-jsdoc',
    'config/.jshintrc',
    'config/default.js',
    'config/karma.conf.js',
    '.gitignore'
];
//Project files that are ALWAYS created
var projectFiles = [
    'package.json',
    'Gruntfile.js',
    'README.md',
    'LICENSE'
];
//Files that are ALWAYS created
var files = [
    'tasks/main.js',
    'tasks/build.js',
    'tasks/test.js',
    'app/index.html',
    'app/app.js',
    'app/main.js',
    'app/config.js',
    'app/router.js',
    'assets/images/logo.png',
    'app/modules/umd.boilerplate.js',
    'app/modules/webworker.boilerplate.js'
];
//Dependencies that are CONDITIONALLY installed YES/NO
var dependencies = [
    '"jsinspect": ',
    'grunt-jsinspect',
    'grunt-buddyjs',
    'grunt-contrib-imagemin',
    'grunt-a11y',
    'grunt-accessibility',
    'grunt-karma-coveralls',
    'grunt-benchmark',
    'grunt-contrib-less'
];

var options = {
    projectFiles: projectFiles,
    configFiles:  configFiles,
    appFiles:     files,
    booleanDeps:  dependencies
};

module.exports = options;
