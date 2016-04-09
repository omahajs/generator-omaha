
var path   = require('path');
var chalk  = require('chalk');

function step(num) {
    var TOTAL_STEPS = 13;
    return chalk[num === TOTAL_STEPS ? 'green' : 'gray']('('+ num + '/' + TOTAL_STEPS + ') ');
}

var cssPreprocessors = ['less', 'Sass', 'none'];
var scriptBundlers = ['requirejs', 'browserify'];
var templateTechnologies = ['handlebars', 'underscore'];
var prompts = require('./prompts');

module.exports = [
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
