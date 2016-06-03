/**
 * @file Helpers that augment Handlebars
 * @author Jason Wohlgemuth
**/
define(function(require) {
    'use strict';

    var Handlebars = require('handlebars');

    //"if equal" conditional block helper
    Handlebars.registerHelper('if_eq', function(a, b, opts) {
        if (arguments.length < 3) {
            throw new Error('Handlebars Helper \'if_eq\' needs 2 parameters');
        }
        if (a === b) {
            return opts.fn(this);
        } else {
            return opts.inverse(this);
        }
    });
});
