'use strict';

const {extend, curry, head, pick, set, toLower} = require('lodash');

const projectQuestions = [
    {
        type: 'input',
        name: 'projectName',
        message: 'What do you want to name this project?',
        default: 'omaha-project'
    },
    {
        type: 'input',
        name: 'sourceDirectory',
        message: 'Where do you want to put the source code?',
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
const webappQuestions = [
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
let getPromptQuestions = curry(function(type, isWebapp) {
    let questionLookup = {
        project: projectQuestions,
        webapp: webappQuestions
    };
    return questionLookup[type].map(promptMessageFormat(type, isWebapp));
});
let webappDefaults = webappQuestions
    .map(question => pick(question, ['name', 'default', 'choices']))
    .map(item => set({}, item.name, Array.isArray(item.choices) ? head(item.choices.map(toLower)) : item.default))
    .reduce(extend);
let defaults = {
    project: projectQuestions
        .map(question => set({}, question.name, question.default))
        .reduce(extend),
    webapp: extend(webappDefaults, {
        useBrowserify: webappDefaults.scriptBundler === 'browserify',
        useLess: webappDefaults.cssPreprocessor === 'less',
        useSass: webappDefaults.cssPreprocessor === 'sass',
        useHandlebars: webappDefaults.templateTechnology === 'handlebars'
    })
};

function promptMessageFormat(type, isWebapp) {
    function addLeadingZero(step) {return (step < 10) ? ('0' + step) : step;}
    let total = projectQuestions.length;
    total += isWebapp ? webappQuestions.length : 0;
    return function(question, index) {
        let step = index + 1 + ((type === 'webapp') ? projectQuestions.length : 0);
        question.message = require('chalk')[step === total ? 'green' : 'gray']('(' + addLeadingZero(step) + '/' + total + ') ') + question.message;
        return question;
    };
}

exports.project = {
    defaults: defaults.project,
    getQuestions: getPromptQuestions('project')
};
exports.webapp = {
    defaults: defaults.webapp,
    getQuestions: getPromptQuestions('webapp')
};
