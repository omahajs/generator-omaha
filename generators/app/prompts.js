
var path   = require('path');
var chalk  = require('chalk');

function step(num) {
    var TOTAL_STEPS = 13;
    num = (num < 10) ? ('0' + num) : num;
    return chalk[num === TOTAL_STEPS ? 'green' : 'gray']('('+ num + '/' + TOTAL_STEPS + ') ');
}

var cssPreprocessors = ['less', 'Sass', 'none'];
var scriptBundlers = ['requirejs', 'browserify'];
var templateTechnologies = ['handlebars', 'underscore'];

var questions = [
    {
        type: 'input',
        name: 'projectName',
        message: step(1) + 'What do you want to name this project?',
        default: path.basename(process.cwd())
    },
    {
        type: 'input',
        name: 'appDir',
        message: step(2) + 'Where do you want to put the application directory?',
        default: './'
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
        name: 'jsinspect',
        message: step(7) + 'Detect copy-pasted and structurally similar code with JS Inspect?',
        default: true
    },
    {
        type: 'confirm',
        name: 'a11y',
        message: step(8) + 'Enforce ARIA and Section 508 standards?',
        default: true
    },
    {
        type: 'confirm',
        name: 'imagemin',
        message: step(9) + 'Use image compression for deployed application?',
        default: true
    },
    {
        type: 'confirm',
        name: 'benchmarks',
        message: step(10) + 'Add benchmarking support using Benchmark.js?',
        default: true
    },
    {
        type: 'confirm',
        name: 'styleguide',
        message: step(11) + 'Generate styleguide from Markdown comments inside your stylesheeets with mdcss?',
        default: true
    },
    {
        type: 'confirm',
        name: 'coveralls',
        message: step(12) + 'Integrate with Coveralls.io?',
        default: false
    }
];

var promptOption;
var name;
var defaultValue;
var bundler;
var preprocessor;
var templateTechnology;
var defaults = Object.create(null);
var defaultOptions = questions.map(function(question) {
    defaultValue = (question.type === 'list') ? question.choices[0] : question.default;
    promptOption = Object.create(null);
    name = question.name;
    if (name === 'scriptBundler') {
        promptOption.useBrowserify = (defaultValue.toLowerCase() === 'browserify');
    } else if (name === 'cssPreprocessor') {
        promptOption.useLess = (defaultValue.toLowerCase() ===  'less');
    } else if (name === 'templateTechnology') {
        promptOption.useHandlebars = (defaultValue.toLowerCase() ===  'handlebars');
    } else {
        promptOption[name] = defaultValue;
    }
    return promptOption;
});
defaultOptions.forEach(function(option) {
    for (var key in option) {
        defaults[key] = option[key];
    }
});
defaults.useSass = !defaults.useLess;

exports.defaults = defaults;
exports.questions = questions;
