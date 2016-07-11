'use strict';

var path    = require('path');
var _       = require('lodash');
var sinon   = require('sinon');
var helpers = require('yeoman-test');
var assert  = require('yeoman-assert');
var base    = require('yeoman-generator').generators.Base;
var utils   = require('../generators/app/utils');
var extend  = utils.object.extend;
var clone   = utils.object.clone;

var prompts = require('../generators/app/prompts');
var ALL_TRUE = extend({}, prompts.project.defaults, prompts.webapp.defaults);
var ALL_FALSE = _.mapValues(ALL_TRUE, function(option) {return _.isBoolean(option) ? false : option;});

var SKIP_INSTALL = {skipInstall: true};
var browserifyContent = [
    ['package.json', '"browser":'],
    ['package.json', '"browserify":'],
    ['package.json', '"aliasify":'],
    ['Gruntfile.js', 'browserify'],
    ['Gruntfile.js', 'replace:'],
    ['Gruntfile.js', 'uglify:']
];
var ariaContent = [
    ['Gruntfile.js', 'a11y: '],
    ['Gruntfile.js', 'accessibility: '],
    ['Gruntfile.js', 'aria-audit']
];
function createProject() {
    return helpers.run(path.join(__dirname, '../generators/project'))
        .withOptions({skipInstall: true})
        .withPrompts(prompts.project.defaults)
        .toPromise();
}
function verifyCoreFiles() {
    var ALWAYS_INCLUDED = [
        'README.md',
        'config/.csslintrc',
        'tasks/webapp.js'
    ];
    ALWAYS_INCLUDED.forEach(file => assert.file(file));
}
function verifyBoilerplateFiles(sourceDirectory) {
    var files = [
        'app/index.html',
        'app/app.js',
        'app/main.js',
        'app/config.js',
        'app/router.js',
        'assets/images/logo.png',
        'app/controllers/example.webworker.js'
    ];
    files
        .map(function(fileName) {return sourceDirectory + fileName;})
        .forEach(file => assert.file(file));
}
function verifyDefaultConfiguration() {
    verifyCoreFiles();
    assert.fileContent(ariaContent);                 // aria
    assert.fileContent('Gruntfile.js', 'imagemin: ');// imagemin
    assert.noFileContent(browserifyContent);         // script bundler
    assert.fileContent('Gruntfile.js', 'less: ');    // css pre-processor
    assert.noFileContent('Gruntfile.js', 'sass: ');  // css pre-processor
    assert.noFileContent('Gruntfile.js', 'jst');     // template technology
    assert.fileContent('Gruntfile.js', 'handlebars');// template technology
}

describe('Webapp generator', function() {
    var stub;
    before(function() {
        stub = sinon.stub(base.prototype.user.git, 'name');
        stub.returns(null);
    });
    after(function() {
        stub.restore();
    });
    it('can create and configure files with default prompt choices', function() {
        var sourceDirectory = './';
        return helpers.run(path.join(__dirname, '../generators/webapp'))
            .inTmpDir(createProject)
            .withOptions(SKIP_INSTALL)
            .withPrompts(prompts.webapp.defaults)
            .withLocalConfig({projectName: 'tech', sourceDirectory: sourceDirectory})
            .toPromise()
            .then(function() {
                verifyBoilerplateFiles(sourceDirectory);
                verifyDefaultConfiguration();
            });
    });
});
describe('Default generator', function() {
    var stub;
    describe('can create and configure files with prompt choices', function() {
        before(function() {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
        });
        after(function() {
            stub.restore();
        });
        it('all prompts FALSE (default configuration)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(ALL_FALSE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent(browserifyContent);
                    assert.noFileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('all prompts TRUE (default configuration)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyBoilerplateFiles('./');
                    verifyDefaultConfiguration();
                });
        });
        it('all prompts TRUE (--script-bundler browserify)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(extend({}, SKIP_INSTALL, {scriptBundler: 'browserify'}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent(browserifyContent);
                    assert.fileContent(ariaContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');

                });
        });
        it('all prompts TRUE (--css-preprocessor sass)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(extend({}, SKIP_INSTALL, {cssPreprocessor: 'sass'}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent('Gruntfile.js', 'sass: ');
                    assert.noFileContent('Gruntfile.js', 'less: ');
                });
        });
        it('all prompts TRUE (--template-technology underscore)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(extend({}, SKIP_INSTALL, {templateTechnology: 'underscore'}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent('Gruntfile.js', 'jst');
                    assert.noFileContent('Gruntfile.js', 'handlebars');
                });
        });
        it('all prompts TRUE (--skip-aria)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(extend({}, SKIP_INSTALL, {'skip-aria': true}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent(ariaContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('all prompts TRUE (--skip-imagemin)', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(extend({}, SKIP_INSTALL, {'skip-imagemin': true}))
                .withPrompts(ALL_TRUE)
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('only aria prompt FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(extend({}, ALL_TRUE, {aria: false}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent(ariaContent);
                });
        });
        it('only imagemin prompt FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(extend({}, ALL_TRUE, {imagemin: false}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('select browserify via prompt', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(extend({}, ALL_TRUE, {scriptBundler: 'browserify'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent(browserifyContent);
                    assert.fileContent(ariaContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');

                });
        });
        it('select sass via prompt', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(extend({}, ALL_TRUE, {cssPreprocessor: 'sass'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent('Gruntfile.js', 'sass: ');
                    assert.noFileContent('Gruntfile.js', 'less: ');
                });
        });
        it('select no CSS pre-processor via prompt', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(extend({}, ALL_TRUE, {cssPreprocessor: 'none'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent('Gruntfile.js', 'sass: ');
                    assert.noFileContent('Gruntfile.js', 'less: ');
                });
        });
    });
    describe('can create and configure files with with command line options', function() {
        before(function() {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
        });
        after(function() {
            stub.restore();
        });
        it('--defaults', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(extend({}, SKIP_INSTALL, {defaults: true}))
                .toPromise()
                .then(function() {
                    verifyBoilerplateFiles('./');
                    verifyDefaultConfiguration();
                });
        });
        it('--defaults --script-bundler browserify', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(extend({}, SKIP_INSTALL, {defaults: true, scriptBundler: 'browserify'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent(browserifyContent);
                });
        });
        it('--defaults --css-preprocessor sass', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(extend({}, SKIP_INSTALL, {defaults: true, cssPreprocessor: 'sass'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent('Gruntfile.js', 'sass: ');
                    assert.noFileContent('Gruntfile.js', 'less: ');
                });
        });
        it('--defaults --css-preprocessor none', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(extend({}, SKIP_INSTALL, {defaults: true, cssPreprocessor: 'none'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent('Gruntfile.js', 'sass: ');
                    assert.noFileContent('Gruntfile.js', 'less: ');
                });
        });
        it('--defaults --template-technology underscore', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(extend({}, SKIP_INSTALL, {defaults: true, templateTechnology: 'underscore'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent('Gruntfile.js', 'jst');
                    assert.noFileContent('Gruntfile.js', 'handlebars');
                });
        });
        it('--defaults --skip-aria --skip-imagemin', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(extend({}, SKIP_INSTALL, {
                    defaults: true,
                    'skip-aria': true,
                    'skip-imagemin': true}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.noFileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('--defaults --skip-aria --skip-imagemin --script-bundler browserify', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(extend({}, SKIP_INSTALL, {
                    defaults: true,
                    'skip-aria': true,
                    'skip-imagemin': true,
                    scriptBundler: 'browserify'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent(browserifyContent);
                    assert.noFileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('--defaults --script-bundler browserify --css-preprocessor sass --template-technology underscore', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(extend({}, SKIP_INSTALL, {
                    defaults: true,
                    scriptBundler: 'browserify',
                    cssPreprocessor: 'sass',
                    templateTechnology: 'underscore'}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles('./');
                    assert.fileContent(browserifyContent);
                    assert.fileContent('Gruntfile.js', 'sass: ');
                    assert.noFileContent('Gruntfile.js', 'less: ');
                    assert.fileContent('Gruntfile.js', 'jst');
                    assert.noFileContent('Gruntfile.js', 'handlebars');
                    assert.fileContent(ariaContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');
                });
        });
    });
});
describe('Default generator (with custom source directory)', function() {
    var stub;
    var sourceDirectory = 'webapp/';
    describe('can create and configure files with prompt choices', function() {
        before(function() {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
        });
        after(function() {
            stub.restore();
        });
        it('all prompts TRUE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(extend(ALL_TRUE, {sourceDirectory: sourceDirectory}))
                .toPromise()
                .then(function() {
                    verifyBoilerplateFiles(sourceDirectory);
                    verifyDefaultConfiguration();
                });
        });
        it('all prompts FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(extend(ALL_FALSE, {sourceDirectory: sourceDirectory}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles(sourceDirectory);
                    assert.noFileContent(browserifyContent);
                    assert.noFileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('only aria prompt FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(extend({}, ALL_TRUE, {sourceDirectory: sourceDirectory, aria: false}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles(sourceDirectory);
                    assert.noFileContent(browserifyContent);
                    assert.noFileContent(ariaContent);
                    assert.fileContent('Gruntfile.js', 'imagemin: ');
                });
        });
        it('only imagemin prompt FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/app'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(extend({}, ALL_TRUE, {sourceDirectory: sourceDirectory, imagemin: false}))
                .toPromise()
                .then(function() {
                    verifyCoreFiles();
                    verifyBoilerplateFiles(sourceDirectory);
                    assert.noFileContent(browserifyContent);
                    assert.fileContent(ariaContent);
                    assert.noFileContent('Gruntfile.js', 'imagemin: ');
                });
        });
    });
});
