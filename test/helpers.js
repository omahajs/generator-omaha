var path    = require('path');
var _       = require('underscore');
var helpers = require('yeoman-test');
var assert  = require('yeoman-assert');

var data = require('./data');
var dependencies = data.booleanDeps;
var appFiles     = data.appFiles;
var configFiles  = data.configFiles;
var projectFiles = data.projectFiles;

var booleanAnswers = function(value) {
    value = value ? true : false;
    return {
        jsinspect:  value,
        a11y:       value,
        imagemin:   value,
        benchmarks: value,
        coveralls:  value,
        styleguide: value
    };
};

function scaffoldApp(options) {
    var appDir         = options.appDirectory;
    var scriptBundler  = options.scriptBundler;
    var cssProcessor   = options.styleProcessor;
    var templateLang   = options.templateTechnology;
    var allAnswersTrue = options.allAnswersTrue;
    var SKIP_INSTALL = {skipInstall: true};
    return helpers.run(path.join(__dirname, '../generators/app'))
        .withOptions(SKIP_INSTALL)
        .withPrompts(_.extend(_.clone(booleanAnswers(true)), {
            appDir: appDir,
            scriptBundler: scriptBundler,
            cssPreprocessor: cssProcessor,
            templateTechnology: templateLang
        }));
}

function scaffoldAppWith(options) {
    return helpers.run(path.join(__dirname, '../generators/app'))
        .withOptions({
            skipInstall: true,
            defaults: options.defaults,
            scriptBundler: options.scriptBundler,
            cssPreprocessor: options.cssPreprocessor,
            templateTechnology: options.templateTechnology
        });
}

function createPlugin(options) {
    var testOptions = {};
    if (options.customDependency && options.alias) {
        testOptions.customDependency = options.customDependency;
        testOptions.alias = options.alias;
    } else {
        options.dependencies.forEach(function(dep) {
            testOptions[dep] = true;
        });
    }
    return helpers.run(path.join(__dirname, '../generators/plugin'))
        .withLocalConfig({appDir: './'})
        .withArguments([options.name])
        .withPrompts({dependencies: options.dependencies})
        .withOptions(options.useCommandLineOptions ? testOptions : {})
        .toPromise();
}

function verifyFiles(appDir) {
    // assert.file(configFiles);
    // assert.file(projectFiles);
    // assert.file(appFiles.map(function(file) {return appDir + file;}));
    // assert.file('tasks/build.js');
    // assert.file('tasks/app.js');
    // assert.fileContent('.gitignore', 'app/templates.js');
    // assert.fileContent('.gitignore', 'app/style.css');
    // assert.fileContent('package.json', '"deploy": "cp -a dist/. dist/."');
}

function verifyConfiguration(options) {
    var appDir = options.appDirectory ? options.appDirectory : './';
    // verifyWorkflowDependencies(options.workflow);
    //verifyGruntfilePlugins(options.workflow);
    //verifyBenchmarkJs(options.workflow);
    // verifyBrowserifySupport(options.scriptBundler === 'browserify', appDir);
    // if (options.styleProcessor === 'less') {
    //     verifyLessSupport(true, appDir);
    // } else if (options.styleProcessor === 'sass') {
    //     verifySassSupport(true, appDir);
    // } else {
    //     verifyLessSupport(false, appDir);
    //     verifySassSupport(false, appDir);
    // }
    // verifyHandlebarsSupport(options.templateTechnology === 'handlebars', appDir);
}

function verifyWorkflowDependencies(added) {
    var verify = added ? assert.fileContent : assert.noFileContent;
    dependencies.forEach(function(dep) {
        verify('package.json', dep);
    });
}

function verifyGruntfilePlugins(configured) {
    var verify = configured ? assert.fileContent : assert.noFileContent;
    verify('Gruntfile.js', 'jsinspect: {');
    verify('Gruntfile.js', 'imagemin: {');
    verify('Gruntfile.js', 'a11y: {');
    verify('Gruntfile.js', 'accessibility: {');
    verify('Gruntfile.js', 'benchmark: {');
    verify('Gruntfile.js', 'styleguide: {');
    verify('Gruntfile.js', 'mdcss');
}

function verifyBenchmarkJs(configured) {
    var verify = configured ? assert.file : assert.noFile;
    verify('test/benchmarks/example.benchmark.js');
}

function verifyCoveralls(configured) {
    var verify = configured ? assert.fileContent : assert.noFileContent;
    //verify('Gruntfile.js', 'coveralls: {');
    if (configured) {
        //assert.fileContent('package.json', '"test-ci": "npm test && grunt coveralls"');
    } else {
        assert.fileContent('package.json', '"test-ci": "npm test"');
    }
}

function verifyHandlebarsSupport(exists, appDir) {
    appDir = appDir ? appDir: '.';
    var verify;
    if (exists) {
        verify =  assert.fileContent;
        assert.file(appDir + '/app/helpers/handlebars.helpers.js');
        assert.noFileContent('Gruntfile.js', 'jst: {');
        //assert.noFileContent('package.json', '"grunt-contrib-jst": ');
        assert.noFileContent('tasks/build.js', 'jst:main');
    } else {
        verify = assert.noFileContent;
        assert.noFile(appDir + '/app/helpers/handlebars.helpers.js');
        assert.fileContent('Gruntfile.js', 'jst: {');
        //assert.fileContent('package.json', '"grunt-contrib-jst": ');
        assert.fileContent('tasks/build.js', 'jst:main');
    }
    //verify('package.json', '"handlebars": ');
    //verify('package.json', '"grunt-contrib-handlebars": ');
    verify(appDir + '/app/app.js', './helpers/handlebars.helpers');
}

function verifyBrowserifySupport(exists, appDir) {
    appDir = appDir ? appDir: '.';
    var verify;
    if (exists) {
        verify =  assert.fileContent;
        assert.noFileContent('tasks/build.js', 'requirejs:bundle');
    } else {
        verify = assert.noFileContent;
        assert.fileContent('tasks/build.js', 'requirejs:bundle');
    }
    verify('package.json', '"browserify": {');
    // verify('package.json', 'grunt-browserify');
    // verify('package.json', 'grunt-replace');
    verify('package.json', 'deamdify');
    verify('package.json', 'aliasify');
    verify('Gruntfile.js', 'replace: {');
    verify('Gruntfile.js', 'browserify: {');
    verify('tasks/build.js', 'browserify:bundle');
    verify('tasks/build.js', 'replace:bundle-url');
    verify('tasks/build.js', 'uglify:bundle');
}

function verifyLessSupport(exists, appDir) {
    appDir = appDir ? appDir : '.';
    var verify;
    if (exists) {
        verify = assert.fileContent;
        assert.file(appDir + '/assets/less/reset.less');
        assert.file(appDir + '/assets/less/style.less');
        assert.noFile(appDir + '/assets/sass/reset.scss');
        assert.noFile(appDir + '/assets/sass/style.scss');
        assert.noFileContent('Gruntfile.js', 'sass: {');
        assert.noFileContent('config/default.json', 'sass/**/*.scss');
        assert.noFileContent('package.json', 'grunt-contrib-sass');
    } else {
        verify = assert.noFileContent;
    }
    verify('config/default.json', 'less/**/*.less');
    //verify('package.json', 'grunt-contrib-less');
    verify('Gruntfile.js', 'less: {');
}

function verifySassSupport(exists, appDir) {
    appDir = appDir ? appDir : '.';
    var verify;
    if (exists) {
        verify = assert.fileContent;
        assert.file(appDir + '/assets/sass/reset.scss');
        assert.file(appDir + '/assets/sass/style.scss');
        assert.noFile(appDir + '/assets/less/reset.less');
        assert.noFile(appDir + '/assets/less/style.less');
        assert.noFileContent('Gruntfile.js', 'less: {');
        assert.noFileContent('config/default.json', 'less/**/*.less');
        assert.noFileContent('package.json', 'grunt-contrib-less');
    } else {
        verify = assert.noFileContent;
    }
    verify('config/default.json', 'sass/**/*.scss');
    //verify('package.json', 'grunt-contrib-sass');
    verify('Gruntfile.js', 'sass: {');
}

module.exports = {
    scaffoldApp: scaffoldApp,
    scaffoldAppWith: scaffoldAppWith,
    createPlugin: createPlugin,
    verifyFiles: verifyFiles,
    verifyConfiguration: verifyConfiguration,
    verifyCoveralls: verifyCoveralls
};
