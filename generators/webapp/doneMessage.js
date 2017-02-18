'use strict';

var _     = require('lodash');
var chalk = require('chalk');

module.exports = function(generator) {
    var SPACE = ' ';
    var LETS_GET_STARTED = 'npm start';
    var config = generator.config;
    var cssPreprocessor = chalk.magenta.bold(_.capitalize(generator.cssPreprocessor));
    var message = '' +
        '\nApplication Name:  ' + chalk.inverse.bold(SPACE + generator.projectName + SPACE) +
        '\nScript Bundler:    ' + chalk[generator.useBrowserify ? 'yellow' : 'red'].bold(generator.useBrowserify ? 'Browserify' : 'r.js') +
        '\nCSS pre-processor: ' + cssPreprocessor +
        '\nTemplate renderer: ' + chalk[generator.useHandlebars ? 'yellow' : 'blue'].bold(generator.useHandlebars ? 'Handlebars' : 'Underscore') +
        '\n' +
        '\n' + convertToYesNoFunction(config.get('useBenchmark'))('Install benchmarks.js support') +
        '\n' + convertToYesNoFunction(config.get('useCoveralls'))('Integrate Coveralls.io support') +
        '\n' + convertToYesNoFunction(config.get('useJsinspect'))('Find duplicate code with JSInspect') +
        '\n' + convertToYesNoFunction(generator.useAria)('Perform accessibility audit on HTML code') +
        '\n' + convertToYesNoFunction(generator.useImagemin)('Compress production images with imagemin') +
        '\n' +
        '\n' + chalk.green.bold('All done!') +
        '\n' + chalk.white('Try out your shiny new app by running ') + chalk.bgBlack.white(SPACE + LETS_GET_STARTED + SPACE) +
        '\n';
    return message;
};

function yes(str) {return chalk.green.bold('✔ ') + chalk.white.bold(str);}
function no(str) {return chalk.gray.bold('✗ ' + str);}
function convertToYesNoFunction(val) {return (_.isBoolean(val) && val) ? yes : no;}
