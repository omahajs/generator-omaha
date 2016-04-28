var chalk = require('chalk');

var doneMessage = function(generator) {
    var SPACE = ' ';
    var CHECKMARK = chalk.green.bold('✔ ');
    var X = chalk.red.bold('✗ ')
    var cssPreprocessor;
    var scriptBundler;
    if (generator.useSass) {
        cssPreprocessor = chalk.magenta.bold('Sass');
    } else if (generator.useLess) {
        cssPreprocessor = chalk.blue.bold('Less');
    } else {
        cssPreprocessor = chalk.gray.bold('none');
    }
    var message = '' +
        '\nApplication Name:  ' + chalk.inverse.bold(SPACE + generator.projectName + SPACE) +
        '\nScript Bundler:    ' + chalk[generator.useBrowserify ? 'yellow' : 'red'].bold(generator.useBrowserify ? 'Browserify' : 'r.js') +
        '\nCSS pre-processor: ' + cssPreprocessor +
        '\nTemplate renderer: ' + chalk[generator.useHandlebars ? 'yellow' : 'blue'].bold(generator.useHandlebars ? 'Handlebars' : 'Underscore') +
        '\n\n' + (generator.use.jsinspect ? CHECKMARK + chalk.white.bold('Find duplicate code with JSInspect') : '') +
        '\n'   + (generator.use.imagemin ? CHECKMARK + chalk.white.bold('Compress production images with imagemin') : '') +
        '\n'   + (generator.use.a11y ? CHECKMARK + chalk.white.bold('Lint HTML with a11y') : '') +
        '\n'   + (generator.styleguide ? CHECKMARK + chalk.white.bold('Generate living styleguide with mdcss') : '') +
        '\n'   + (generator.use.benchmarks ? CHECKMARK + chalk.white.bold('Install benchmarks.js support') : X + chalk.gray.bold('Install benchmarks.js support')) +
        '\n'   + (generator.use.coveralls ? CHECKMARK + chalk.white.bold('Configure Coveralls.io integration') : X + chalk.gray.bold('Configure Coveralls.io integration')) +
        '\n';
    return message;
};

module.exports = doneMessage;
