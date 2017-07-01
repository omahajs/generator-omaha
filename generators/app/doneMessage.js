'use strict';

const {isBoolean} = require('lodash');
const {blue, green, magenta, red, white, yellow, bold, dim} = require('chalk');
const {maybe} = require('./utils');

module.exports = function(generator) {
    const LETS_GET_STARTED = 'npm start';
    const ELECTRON_TAGLINE = '⚡ Powered by Electron!';
    let {config} = generator;
    let {
        projectName,
        useAria,
        useBenchmark,
        useBrowserify,
        useCoveralls,
        useHandlebars,
        useImagemin,
        useJsinspect,
        useLess,
        useSass
    } = config.get('projectParameters');
    let isNative = config.get('isNative');
    let isWebapp = config.get('isWebapp');
    let isApplication = (isNative || isWebapp);
    let isNativeWebapp = (isNative && isWebapp);
    let type = isApplication ? 'Application' : 'Project';
    return [].concat(
        '',
        `${type} Name:  ${bold.inverse(spaceWrap(projectName))}`,
        maybe(isWebapp, ''),
        maybe(isNativeWebapp, 'Renderer:', maybe(isWebapp, 'Webapp:')),
        maybe(isWebapp, [
            `Script Bundler:    ${bold(maybe(useBrowserify, yellow('Browserify'), red('r.js')))}`,
            `CSS pre-processor: ${bold(maybe(useLess, blue('Less'), maybe(useSass, magenta('Sass'), dim('None'))))}`,
            `Template renderer: ${bold(maybe(useHandlebars, yellow('Handlebars'), blue('Lodash')))}`
        ].map(yes).map(str => `  ${str}`)),
        '',
        yesNo(useBenchmark)('Install benchmarks.js support'),
        yesNo(useCoveralls)('Integrate Coveralls.io support'),
        yesNo(useJsinspect)('Find duplicate code with JSInspect'),
        maybe(isWebapp, [
            yesNo(useAria)('Perform accessibility audit on HTML code'),
            yesNo(useImagemin)('Compress production images with imagemin')
        ]),
        maybe(isNative, ['', yellow.bgBlack.bold(ELECTRON_TAGLINE)]),
        '',
        green.bold('All done!'),
        maybe(isApplication, white('Try out your shiny new app by running ') + white.bgBlack(spaceWrap(LETS_GET_STARTED))),
        ''
    ).join('\n');
};
function yes(str) {return bold(green('✔ ') + white(str));}
function no(str) {return bold.gray('✗ ' + str);}
function yesNo(val) {return (isBoolean(val) && val) ? yes : no;}
function spaceWrap(str) {return ` ${str} `;}
