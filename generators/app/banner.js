var chalk = require('chalk');
var color = 'black';
var techtonic = '\n' + chalk[color].bgYellow(
    '                                                                          \n',
    '████████╗███████╗ ██████╗██╗  ██╗████████╗ ██████╗ ███╗   ██╗██╗ ██████╗ \n',
    '╚══██╔══╝██╔════╝██╔════╝██║  ██║╚══██╔══╝██╔═══██╗████╗  ██║██║██╔════╝ \n',
    '   ██║   █████╗  ██║     ███████║   ██║   ██║   ██║██╔██╗ ██║██║██║      \n',
    '   ██║   ██╔══╝  ██║     ██╔══██║   ██║   ██║   ██║██║╚██╗██║██║██║      \n',
    '   ██║   ███████╗╚██████╗██║  ██║   ██║   ╚██████╔╝██║ ╚████║██║╚██████╗ \n',
    '   ╚═╝   ╚══════╝ ╚═════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═══╝╚═╝ ╚═════╝ '
);
techtonic = techtonic + '\n' + '\n ( ';
techtonic = techtonic + chalk.white.bold('node') + ' + ';
techtonic = techtonic + chalk.red.bold('yeoman') + ' + ';
techtonic = techtonic + chalk.yellow.bold('grunt') + ' + ';
techtonic = techtonic + chalk.cyan.bold('karma') + ' ) * ( ';
techtonic = techtonic + chalk.red.bold('MarionetteJS') + ' + ';
techtonic = techtonic + chalk.blue.bold('Backbone.js') + ' ) ';
techtonic = techtonic + '\n';

module.exports = techtonic;
