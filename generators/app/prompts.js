var projectQuestions = [
    {
        type: 'input',
        name: 'projectName',
        message: 'What do you want to name this project?',
        default: 'tech'
    },
    {
        type: 'input',
        name: 'appDir',
        message: 'Where do you want to put the application directory?',
        default: './'
    },
    {
        type: 'confirm',
        name: 'benchmark',
        message: 'Add benchmarking support using Benchmark.js?',
        default: true
    },
    {
        type: 'confirm',
        name: 'coveralls',
        message: 'Integrate with Coveralls.io?',
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
        name: 'scriptBundler',
        message: 'Which technology for bundling scripts before deployment?',
        choices: ['requirejs', 'browserify']
    },
    {
        type: 'list',
        name: 'cssPreprocessor',
        message: 'Which CSS pre-processor?',
        choices: ['less', 'Sass', 'none']
    },
    {
        type: 'list',
        name: 'templateTechnology',
        message: 'Which technology for templates?',
        choices: ['handlebars', 'underscore']
    },
    {
        type: 'confirm',
        name: 'aria',
        message: 'Enforce ARIA and Section 508 standards?',
        default: true
    },
    {
        type: 'confirm',
        name: 'imagemin',
        message: 'Use image compression for deployed application?',
        default: true
    }
];

var defaults = {project: {}, webapp: {}};
projectQuestions.forEach(function(question) {
    defaults.project[question.name] = question.default;
});
webappQuestions.forEach(function(question) {
    var defaultValue = (question.type === 'list') ? question.choices[0].toLowerCase() : question.default;
    var promptOption = {};
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
        defaults.webapp[key] = promptOption[key];
    }
});
defaults.useSass = !defaults.useLess;

defaults.webapp.scriptBundler = 'requirejs';
defaults.webapp.cssPreprocessor = 'less';
defaults.webapp.templateTechnology = 'handlebars';

function promptMessageFormat(type) {
    function addLeadingZero(step) {return (step < 10) ? ('0' + step) : step;}
    var total = projectQuestions.length + webappQuestions.length;
    return function(question, index) {
        var step = index + 1 + (type === 'webapp' ? projectQuestions.length : 0);
        question.message = require('chalk')[step === total ? 'green' : 'gray']('('+ addLeadingZero(step) + '/' + total + ') ') + question.message;
        return question;
    }
}

exports.project = {
    defaults: defaults.project,
    questions: projectQuestions.map(promptMessageFormat('project'))
};
exports.webapp = {
    defaults: defaults.webapp,
    questions: webappQuestions.map(promptMessageFormat('webapp'))
};
