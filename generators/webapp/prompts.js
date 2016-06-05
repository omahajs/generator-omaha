
var path  = require('path');
var chalk = require('chalk');

var defaults = {};
var defaultValue;
var promptOption;
var cssPreprocessors = ['less', 'Sass', 'none'];
var scriptBundlers = ['requirejs', 'browserify'];
var templateTechnologies = ['handlebars', 'underscore'];

var projectQuestions = [
    {
        type: 'input',
        name: 'projectName',
        message: 'What do you want to name this project?',
        default: path.basename(process.cwd())
    },
    {
        type: 'input',
        name: 'appDir',
        message: 'Where do you want to put the application directory?',
        default: './'
    },
    {
        type: 'list',
        name: 'scriptBundler',
        message: 'Which technology for bundling scripts before deployment?',
        choices: scriptBundlers
    },
    {
        type: 'confirm',
        name: 'benchmarks',
        message: 'Add benchmarking support using Benchmark.js?',
        default: true
    },
    {
        type: 'confirm',
        name: 'coveralls',
        message: 'Integrate with Coveralls.io?',
        default: false
    },
    {
        type: 'confirm',
        name: 'autoFix',
        message: 'Auto-fix minor style errors when "eslinting"?',
        default: true
    },
    {
        type: 'confirm',
        name: 'jsinspect',
        message: 'Detect copy-pasted and structurally similar code with JS Inspect?',
        default: true
    }
];
var webappQuestions = [
    {
        type: 'list',
        name: 'cssPreprocessor',
        message: 'Which CSS pre-processor?',
        choices: cssPreprocessors
    },
    {
        type: 'list',
        name: 'templateTechnology',
        message: 'Which technology for templates?',
        choices: templateTechnologies
    },
    {
        type: 'confirm',
        name: 'a11y',
        message: 'Enforce ARIA and Section 508 standards?',
        default: true
    },
    {
        type: 'confirm',
        name: 'imagemin',
        message: 'Use image compression for deployed application?',
        default: true
    },
    {
        type: 'confirm',
        name: 'styleguide',
        message: 'Generate styleguide from Markdown comments inside your stylesheeets with mdcss?',
        default: true
    }
];
var questions = projectQuestions.concat(webappQuestions)

projectQuestions.concat(webappQuestions).forEach(function(question) {
    defaultValue = (question.type === 'list') ? question.choices[0].toLowerCase() : question.default;
    promptOption = {};
    switch (question.name) {
        case 'scriptBundler':
            promptOption.useBrowserify = (defaultValue === 'browserify');
            break;
        case 'cssPreprocessor':
            promptOption.useLess = (defaultValue === 'less');
            break;
        case 'templateTechnology':
            promptOption.useHandlebars = (defaultValue === 'handlebars');
            break;
        default:
            promptOption[question.name] = defaultValue;
    }
    for (var key in promptOption) {
        defaults[key] = promptOption[key];
    }
});
defaults.useSass = !defaults.useLess;

exports.project = {
    defaults: defaults,
    //questions: projectQuestions.map(addStepNumber)
};
exports.webapp = {
    defaults: defaults,
    questions: projectQuestions.concat(webappQuestions).map(addStepNumber)
};

function addStepNumber(question, index, array) {
    var step = index + 1;
    step = (step < 10) ? ('0' + step) : step;
    question.message = chalk[step === array.length ? 'green' : 'gray']('('+ step + '/' + array.length + ') ') + question.message;
    return question;
}
function select(arr, items) {
    function isSelectedItem(item) {return items.indexOf(item.name) > -1;}
    return arr.filter(isSelectedItem);
}
