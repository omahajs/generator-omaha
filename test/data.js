//Config files that are ALWAYS created
var configFiles = [
    'config/.csslintrc',
    'config/.eslintrc.js',
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
    'app/plugins/webworker.boilerplate.js'
];
//Dependencies that are CONDITIONALLY installed YES/NO
var dependencies = [
    '"jsinspect": ',
    'grunt-jsinspect',
    'grunt-contrib-imagemin',
    'grunt-a11y',
    'grunt-accessibility',
    'grunt-benchmark'
];

var options = {
    projectFiles: projectFiles,
    configFiles:  configFiles,
    appFiles:     files,
    booleanDeps:  dependencies
};

module.exports = options;
