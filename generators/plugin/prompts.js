var indent = '  ';
module.exports = [{
    type: 'checkbox',
    name: 'dependencies',
    message: 'Choose plugin dependencies:',
    choices: [
        {
            name: indent + 'jQuery',
            value: 'jquery',
            checked: false
        },
        {
            name: indent + 'Underscore.js',
            value: 'underscore',
            checked: false
        },
        {
            name: indent + 'Backbone.js',
            value: 'backbone',
            checked: false
        }
    ]
}];
